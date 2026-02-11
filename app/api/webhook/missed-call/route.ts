import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizePhone } from "@/lib/phone";
import { sendSms } from "@/lib/sms/provider";
import { missedCallInitialSms, missedCallWeekendSms } from "@/lib/sms/templates";
import { isQuietHours } from "@/lib/utils";

export const runtime = "nodejs";

/**
 * POST /api/webhook/missed-call
 * Handles missed call webhooks from the voice/telephony provider.
 * Sends an auto-SMS with reply options (1/2/3).
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? await request.json().catch(() => ({}))
      : await request.formData().catch(() => null) ?? await request.json().catch(() => ({}));

    // Extract caller info (supports both form data and JSON)
    const fromNumber = (body instanceof FormData ? body.get("From") : body.From) as string;
    const toNumber = (body instanceof FormData ? body.get("To") : body.To) as string;
    const callStatus = (body instanceof FormData ? body.get("CallStatus") : body.CallStatus) as string;

    if (!fromNumber || !toNumber) {
      return NextResponse.json({ error: "Missing From or To number" }, { status: 400 });
    }

    // Only process missed calls
    if (callStatus && !["no-answer", "busy", "failed"].includes(callStatus)) {
      return NextResponse.json({ status: "ignored", reason: "not a missed call" });
    }

    const normalizedFrom = normalizePhone(fromNumber);
    const normalizedTo = normalizePhone(toNumber);

    // Look up customer by their SMS/phone number
    const { data: customer } = await supabaseAdmin
      .from("customers")
      .select("*")
      .or(`sms_number.eq.${normalizedTo},phone.eq.${normalizedTo}`)
      .eq("active", true)
      .single();

    if (!customer) {
      console.error("No customer found for number:", normalizedTo);
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Dedupe check: was an SMS sent to this number in the last 15 minutes?
    const fifteenMinAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const { data: recentSms } = await supabaseAdmin
      .from("sms_log")
      .select("id")
      .eq("customer_id", customer.id)
      .eq("to_number", normalizedFrom)
      .gte("created_at", fifteenMinAgo)
      .limit(1);

    if (recentSms && recentSms.length > 0) {
      return NextResponse.json({ status: "dedupe", reason: "SMS sent in last 15 minutes" });
    }

    // Check quiet hours (skip SMS unless urgent)
    if (isQuietHours(customer.quiet_hours_start, customer.quiet_hours_end, customer.timezone)) {
      // Queue for later (simplified: just log it)
      await supabaseAdmin.from("ticket_events").insert({
        ticket_id: null,
        event_type: "sms_failed",
        new_value: "quiet_hours",
        metadata: { from: normalizedFrom, to: normalizedTo, reason: "quiet_hours" },
      });
      return NextResponse.json({ status: "queued", reason: "quiet hours" });
    }

    // Determine if weekend
    const now = new Date();
    const day = now.getDay(); // 0=Sun, 6=Sat
    const isWeekend = day === 0 || day === 6;

    // Build SMS
    const templateVars = {
      betrieb: customer.name,
      phone: customer.phone,
    };
    const smsBody = isWeekend
      ? missedCallWeekendSms(templateVars)
      : missedCallInitialSms(templateVars);

    // Send SMS
    const smsResult = await sendSms({
      to: normalizedFrom,
      body: smsBody,
      from: customer.sms_number ?? undefined,
    });

    // Log to sms_log
    await supabaseAdmin.from("sms_log").insert({
      customer_id: customer.id,
      direction: "outbound",
      from_number: customer.sms_number,
      to_number: normalizedFrom,
      body: smsBody,
      provider_id: smsResult.provider_id,
      status: smsResult.success ? "sent" : "failed",
    });

    return NextResponse.json({
      status: smsResult.success ? "sent" : "failed",
      provider_id: smsResult.provider_id,
    });
  } catch (error) {
    console.error("Missed call webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
