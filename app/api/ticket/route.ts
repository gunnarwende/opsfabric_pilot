import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizePhone, generateDedupeKey } from "@/lib/phone";
import { sendSms } from "@/lib/sms/provider";
import { getConfirmationSms } from "@/lib/sms/templates";
import { calculateSlaDeadline } from "@/lib/utils";
import type { CreateTicketRequest, CreateTicketResponse, Urgency } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body: CreateTicketRequest = await request.json();

    // Validate required fields
    if (!body.customer_slug || !body.contact_name || !body.contact_phone) {
      return NextResponse.json(
        { error: "Missing required fields: customer_slug, contact_name, contact_phone" },
        { status: 400 }
      );
    }

    // Look up customer
    const { data: customer, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("slug", body.customer_slug)
      .eq("active", true)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Normalize phone
    const normalizedPhone = normalizePhone(body.contact_phone);

    // Dedupe check
    const dedupeKey = generateDedupeKey(customer.id, normalizedPhone);
    const { data: existingTicket } = await supabaseAdmin
      .from("tickets")
      .select("id, status")
      .eq("dedupe_key", dedupeKey)
      .neq("status", "CLOSED")
      .single();

    let ticketId: string;
    let dedupeMatched = false;

    if (existingTicket) {
      // Update existing ticket
      dedupeMatched = true;
      ticketId = existingTicket.id;

      await supabaseAdmin
        .from("tickets")
        .update({
          summary: body.summary ?? undefined,
          metadata: body.metadata ?? undefined,
          updated_at: new Date().toISOString(),
        })
        .eq("id", ticketId);

      // Log event
      await supabaseAdmin.from("ticket_events").insert({
        ticket_id: ticketId,
        event_type: "status_changed",
        old_value: existingTicket.status,
        new_value: existingTicket.status,
        metadata: { action: "dedupe_update", source: body.source },
      });
    } else {
      // Create new ticket
      const urgency: Urgency = body.urgency ?? "MED";

      const { data: newTicket, error: insertError } = await supabaseAdmin
        .from("tickets")
        .insert({
          customer_id: customer.id,
          source: body.source ?? "wizard",
          status: "NEW",
          intent: body.intent,
          urgency,
          contact_phone: normalizedPhone,
          contact_email: body.contact_email ?? null,
          contact_name: body.contact_name,
          summary: body.summary,
          metadata: body.metadata ?? {},
          dedupe_key: dedupeKey,
        })
        .select("id")
        .single();

      if (insertError || !newTicket) {
        console.error("Failed to create ticket:", insertError);
        return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
      }

      ticketId = newTicket.id;

      // Log creation event
      await supabaseAdmin.from("ticket_events").insert({
        ticket_id: ticketId,
        event_type: "created",
        new_value: "NEW",
        metadata: { source: body.source, urgency },
      });
    }

    // Send confirmation SMS (async, non-blocking)
    let confirmationSent = false;
    try {
      const slaResult = calculateSlaDeadline(
        new Date(),
        customer.sla_response_minutes ?? 120,
        customer.quiet_hours_start ?? "21:00",
        customer.quiet_hours_end ?? "07:00"
      );

      const smsBody = getConfirmationSms(
        (body.source === "missed_call" ? "missed_call" : "wizard"),
        body.urgency ?? "MED",
        {
          betrieb: customer.name,
          name: body.contact_name,
          phone: customer.phone,
          sla_zeit: slaResult.displayText,
        }
      );

      const smsResult = await sendSms({
        to: normalizedPhone,
        body: smsBody,
        from: customer.sms_number ?? undefined,
      });

      confirmationSent = smsResult.success;

      // Log SMS event
      await supabaseAdmin.from("ticket_events").insert({
        ticket_id: ticketId,
        event_type: smsResult.success ? "sms_sent" : "sms_failed",
        new_value: smsBody,
        metadata: { provider_id: smsResult.provider_id, error: smsResult.error },
      });

      // Log to sms_log
      await supabaseAdmin.from("sms_log").insert({
        customer_id: customer.id,
        ticket_id: ticketId,
        direction: "outbound",
        from_number: customer.sms_number,
        to_number: normalizedPhone,
        body: smsBody,
        provider_id: smsResult.provider_id,
        status: smsResult.success ? "sent" : "failed",
      });
    } catch (smsError) {
      console.error("SMS sending failed:", smsError);
    }

    const response: CreateTicketResponse = {
      ticket_id: ticketId,
      confirmation_sent: confirmationSent,
      dedupe_matched: dedupeMatched,
    };

    return NextResponse.json(response, { status: dedupeMatched ? 200 : 201 });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
