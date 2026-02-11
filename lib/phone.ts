/**
 * Phone number utilities for Swiss E.164 normalization
 */

/** Normalize a Swiss phone number to E.164 format (+41...) */
export function normalizePhone(phone: string): string {
  // Strip all non-digit characters except leading +
  let cleaned = phone.replace(/[^\d+]/g, "");

  // Handle Swiss formats
  if (cleaned.startsWith("0041")) {
    cleaned = "+" + cleaned.slice(2);
  } else if (cleaned.startsWith("41") && cleaned.length >= 11) {
    cleaned = "+" + cleaned;
  } else if (cleaned.startsWith("0") && cleaned.length >= 10) {
    cleaned = "+41" + cleaned.slice(1);
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+41" + cleaned;
  }

  return cleaned;
}

/** Format a phone number for display (Swiss format) */
export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  // +41 79 123 45 67
  if (normalized.length === 12 && normalized.startsWith("+41")) {
    const rest = normalized.slice(3);
    return `+41 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
  }
  // +41 43 443 52 00 (landline)
  if (normalized.length === 12 && normalized.startsWith("+414")) {
    const rest = normalized.slice(3);
    return `+41 ${rest.slice(0, 2)} ${rest.slice(2, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
  }
  return normalized;
}

/** Format for click-to-call tel: links */
export function formatPhoneTel(phone: string): string {
  return normalizePhone(phone);
}

/** Check if a phone number looks like a valid Swiss number */
export function isValidSwissPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Swiss numbers: +41 followed by 9 digits
  return /^\+41\d{9}$/.test(normalized);
}

/** Check if a number is a Swiss mobile number */
export function isSwissMobile(phone: string): boolean {
  const normalized = normalizePhone(phone);
  // Swiss mobile: +41 7x xxx xx xx
  return /^\+417[4-9]\d{7}$/.test(normalized);
}

/** Generate a dedupe key for a ticket */
export function generateDedupeKey(customerId: string, phone: string, date?: Date): string {
  const normalized = normalizePhone(phone);
  const d = date ?? new Date();
  const dateBucket = d.toISOString().split("T")[0]; // YYYY-MM-DD
  return `${customerId}:${normalized}:${dateBucket}`;
}
