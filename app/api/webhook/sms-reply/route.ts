import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizePhone, generateDedupeKey } from "@/lib/phone";
import { sendSms } from "@/lib/sms/provider";
import { replyUrgentSms, replyCallbackSms, replyWizardSms, replyFreetextSms } from "@/lib/sms/templates";
import { calculateSlaDeadline } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/webhook/sms-reply
 * Handles inbound SMS replies (1/2/3/freetext) from missed call flow.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.formData().catch(() => null) ?? await request.json().catch(() => ({}));

    const fromNumber = (body instanceof FormData ? body.get("From") : body.From) as string;
    const toNumber = (body instanceof FormData ? body.get("To") : body.To) as string;
    const messageBody = ((body instanceof FormData ? body.get("Body") : body.Body) as string)?.trim();

    if (!fromNumber || !toNumber || !messageBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const normalizedFrom = normalizePhone(fromNumber);
    const normalizedTo = normalizePhone(toNumber);

    // Look up customer
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .or(`sms_number.eq.${normalizedTo},phone.eq.${normalizedTo}`)
      .eq("active", true)
      .single();

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Log inbound SMS
    await supabaseAdmin.from("sms_log").insert({
      customer_id: customer.id,
      direction: "inbound",
      from_number: normalizedFrom,
      to_number: normalizedTo,
      body: messageBody,
      status: "received",
    });

    // Calculate SLA
    const slaResult = calculateSlaDeadline(
      new Date(),
      customer.sla_response_minutes ?? 120,
      customer.quiet_hours_start ?? "21:00",
      customer.quiet_hours_end ?? "07:00"
    );

    const templateVars = {
      betrieb: customer.name,
      phone: customer.phone,
      sla_zeit: slaResult.displayText,
      wizard_link: `${process.env.APP_BASE_URL ?? ""}/${customer.slug}/anfrage?ref=missed_call&phone=${encodeURIComponent(normalizedFrom)}`,
    };

    // Parse reply
    const reply = messageBody.trim();
    let responseSms: string;
    let urgency: "LOW" | "MED" | "HIGH" = "MED";
    let status: string = "NEW";

    if (reply === "1") {
      responseSms = replyUrgentSms(templateVars);
      urgency = "HIGH";
      status = "NEW";
    } else if (reply === "2") {
      responseSms = replyCallbackSms(templateVars);
      urgency = "MED";
      status = "NEEDS_CALLBACK";
    } else if (reply === "3") {
      responseSms = replyWizardSms(templateVars);
      // Don't create ticket — wizard will create it
      const smsResult = await sendSms({ to: normalizedFrom, body: responseSms, from: customer.sms_number ?? undefined });
      await supabaseAdmin.from("sms_log").insert({
        customer_id: customer.id, direction: "outbound",
        from_number: customer.sms_number, to_number: normalizedFrom,
        body: responseSms, provider_id: smsResult.provider_id,
        status: smsResult.success ? "sent" : "failed",
      });
      return NextResponse.json({ status: "wizard_link_sent" });
    } else {
      // Freetext
      responseSms = replyFreetextSms(templateVars);
      urgency = "MED";
      status = "NEW";
    }

    // Create or update ticket
    const dedupeKey = generateDedupeKey(customer.id, normalizedFrom);
    const { data: existingTicket } = await supabaseAdmin
      .from("tickets")
      .select("id")
      .eq("dedupe_key", dedupeKey)
      .neq("status", "CLOSED")
      .single();

    let ticketId: string;

    if (existingTicket) {
      ticketId = existingTicket.id;
      await supabaseAdmin.from("tickets").update({
        urgency,
        status,
        summary: reply === "1" ? "Dringend — per SMS" : reply === "2" ? "Rückruf gewünscht — per SMS" : messageBody,
        updated_at: new Date().toISOString(),
      }).eq("id", ticketId);
    } else {
      const { data: newTicket } = await supabaseAdmin.from("tickets").insert({
        customer_id: customer.id,
        source: "sms_reply",
        status,
        intent: reply === "1" ? "notfall" : "sms_reply",
        urgency,
        contact_phone: normalizedFrom,
        contact_name: null,
        summary: reply === "1" ? "Dringend — per SMS" : reply === "2" ? "Rückruf gewünscht — per SMS" : messageBody,
        dedupe_key: dedupeKey,
        metadata: { sms_reply: reply },
      }).select("id").single();

      ticketId = newTicket?.id ?? "unknown";

      await supabaseAdmin.from("ticket_events").insert({
        ticket_id: ticketId,
        event_type: "created",
        new_value: status,
        metadata: { source: "sms_reply", reply },
      });
    }

    // Send confirmation
    const smsResult = await sendSms({ to: normalizedFrom, body: responseSms, from: customer.sms_number ?? undefined });

    await supabaseAdmin.from("sms_log").insert({
      customer_id: customer.id, ticket_id: ticketId, direction: "outbound",
      from_number: customer.sms_number, to_number: normalizedFrom,
      body: responseSms, provider_id: smsResult.provider_id,
      status: smsResult.success ? "sent" : "failed",
    });

    await supabaseAdmin.from("ticket_events").insert({
      ticket_id: ticketId,
      event_type: smsResult.success ? "sms_sent" : "sms_failed",
      new_value: responseSms,
      metadata: { trigger: "sms_reply_confirmation" },
    });

    return NextResponse.json({ status: "processed", ticket_id: ticketId });
  } catch (error) {
    console.error("SMS reply webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
