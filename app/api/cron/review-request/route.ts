import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSms } from "@/lib/sms/provider";
import { reviewRequestSms } from "@/lib/sms/templates";
import { isQuietHours } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/cron/review-request
 * Periodic job (every 15 min) to send review requests.
 * Query tickets: status=DONE AND job_completed_at + review_delay < now() AND review_request_sent_at IS NULL
 */
export async function POST(request: NextRequest) {
  // Auth check: always require CRON_SECRET
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all eligible tickets with customer data
    const { data: tickets, error } = await supabaseAdmin
      .from("tickets")
      .select("*, customers(*)")
      .eq("status", "DONE")
      .is("review_request_sent_at", null)
      .not("job_completed_at", "is", null)
      .not("contact_phone", "is", null);

    if (error) {
      console.error("Review request query error:", error);
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    let sent = 0;
    let skipped = 0;

    for (const ticket of tickets ?? []) {
      const customer = ticket.customers;
      if (!customer?.google_review_link || !customer?.active) {
        skipped++;
        continue;
      }

      // Check if review delay has passed
      const completedAt = new Date(ticket.job_completed_at);
      const delayHours = customer.review_delay_hours ?? 2;
      const sendAfter = new Date(completedAt.getTime() + delayHours * 60 * 60 * 1000);

      if (new Date() < sendAfter) {
        skipped++;
        continue;
      }

      // Check quiet hours
      if (isQuietHours(customer.quiet_hours_start, customer.quiet_hours_end, customer.timezone)) {
        skipped++;
        continue;
      }

      // Send review request SMS
      const smsBody = reviewRequestSms({
        betrieb: customer.name,
        name: ticket.contact_name,
        phone: customer.phone,
        review_link: customer.google_review_link,
      });

      const smsResult = await sendSms({
        to: ticket.contact_phone!,
        body: smsBody,
        from: customer.sms_number ?? undefined,
      });

      if (smsResult.success) {
        // Update ticket
        await supabaseAdmin
          .from("tickets")
          .update({ review_request_sent_at: new Date().toISOString() })
          .eq("id", ticket.id);

        // Log event
        await supabaseAdmin.from("ticket_events").insert({
          ticket_id: ticket.id,
          event_type: "review_requested",
          new_value: smsBody,
          metadata: { provider_id: smsResult.provider_id },
        });

        // Log SMS
        await supabaseAdmin.from("sms_log").insert({
          customer_id: customer.id,
          ticket_id: ticket.id,
          direction: "outbound",
          from_number: customer.sms_number,
          to_number: ticket.contact_phone,
          body: smsBody,
          provider_id: smsResult.provider_id,
          status: "sent",
        });

        sent++;
      } else {
        skipped++;
      }
    }

    return NextResponse.json({ sent, skipped, total: tickets?.length ?? 0 });
  } catch (error) {
    console.error("Review request cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
