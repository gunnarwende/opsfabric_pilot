/**
 * SMS Provider Abstraction Layer
 *
 * Provider-agnostic SMS interface. Swap implementations without touching business logic.
 * Recommended for Switzerland: eCall.ch (Swiss data residency, 2-way SMS)
 * Backup: ASPSMS (Swiss, Node.js SDK)
 */

import type { SmsMessage, SmsProvider, SmsProviderResult } from "@/lib/types";

// --- Console/Log Provider (Development) ---

class ConsoleSmsProvider implements SmsProvider {
  readonly name = "console";

  async send(message: SmsMessage): Promise<SmsProviderResult> {
    console.log(`[SMS:${this.name}] To: ${message.to} | From: ${message.from ?? "default"}`);
    console.log(`[SMS:${this.name}] Body: ${message.body}`);
    return { success: true, provider_id: `dev_${Date.now()}` };
  }
}

// --- eCall Provider (Production - Switzerland) ---
// Docs: https://ecall-messaging.com/en/interfaces-and-documents/rest-interface/

class EcallSmsProvider implements SmsProvider {
  readonly name = "ecall";
  private readonly username: string;
  private readonly password: string;
  private readonly senderId: string;

  constructor() {
    this.username = process.env.ECALL_USERNAME ?? "";
    this.password = process.env.ECALL_PASSWORD ?? "";
    this.senderId = process.env.ECALL_SENDER_ID ?? process.env.SMS_FROM_NUMBER ?? "";
  }

  async send(message: SmsMessage): Promise<SmsProviderResult> {
    if (!this.username || !this.password) {
      return { success: false, error: "eCall credentials not configured" };
    }

    try {
      const params = new URLSearchParams({
        UserName: this.username,
        Password: this.password,
        Address: message.to,
        Message: message.body,
        CallBack: message.from ?? this.senderId,
      });

      const response = await fetch(
        `https://api.ecall.ch/api/sms?${params.toString()}`,
        { method: "GET" }
      );

      if (response.ok) {
        const result = await response.text();
        return { success: true, provider_id: result.trim() };
      }

      return { success: false, error: `eCall API error: ${response.status}` };
    } catch (error) {
      return { success: false, error: `eCall send failed: ${error}` };
    }
  }
}

// --- Provider Factory ---

export function getSmsProvider(): SmsProvider {
  const providerName = process.env.SMS_PROVIDER ?? "console";

  switch (providerName) {
    case "ecall":
      return new EcallSmsProvider();
    case "console":
    default:
      return new ConsoleSmsProvider();
  }
}

/** Send an SMS using the configured provider */
export async function sendSms(message: SmsMessage): Promise<SmsProviderResult> {
  const provider = getSmsProvider();
  return provider.send(message);
}
