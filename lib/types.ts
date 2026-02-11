// ============================================================
// OpsFabric Type Definitions
// ============================================================

// --- Enums ---

export type TicketSource = "wizard" | "missed_call" | "sms_reply" | "whatsapp" | "email" | "manual";

export type TicketStatus = "NEW" | "NEEDS_CALLBACK" | "SCHEDULED" | "IN_PROGRESS" | "DONE" | "CLOSED";

export type Urgency = "LOW" | "MED" | "HIGH";

export type CustomerPlan = "pilot" | "starter" | "pro" | "premium";

export type TicketEventType =
  | "created"
  | "status_changed"
  | "sms_sent"
  | "sms_received"
  | "sms_failed"
  | "review_requested"
  | "review_clicked"
  | "escalated";

export type SmsDirection = "outbound" | "inbound";

// --- Database Models ---

export interface CustomerModules {
  website?: boolean;
  wizard?: boolean;
  missed_call?: boolean;
  review_engine?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  email?: boolean;
  voice_agent?: boolean;
  dashboard?: boolean;
}

export interface Customer {
  id: string;
  name: string;
  slug: string;
  phone: string;
  email: string;
  sms_number: string | null;
  website_domain: string | null;
  google_review_link: string | null;
  timezone: string;
  quiet_hours_start: string;
  quiet_hours_end: string;
  sla_response_minutes: number;
  review_delay_hours: number;
  plan: CustomerPlan;
  config: CustomerConfig;
  modules: CustomerModules;
  onboarded_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerConfig {
  address?: string;
  plz?: string;
  ort?: string;
  contact_person?: string;
  logo_url?: string;
  primary_color?: string;
  accent_color?: string;
  services?: ServiceConfig[];
  intents?: IntentConfig[];
  google_rating?: number;
  google_review_count?: number;
  certifications?: string[];
  founded_year?: number;
  generation?: string;
  hero_claim?: string;
  hero_benefits?: string[];
  opening_hours?: string;
  review_highlights?: ReviewHighlight[];
}

export interface ServiceConfig {
  slug: string;
  name: string;
  short_description: string;
  description: string;
  icon: string;
  features: string[];
  cta_text: string;
  cta_intent: string;
}

export interface IntentConfig {
  value: string;
  label: string;
  category: string;
}

export interface ReviewHighlight {
  text: string;
  author: string;
  rating: number;
  source: string;
}

export interface Ticket {
  id: string;
  customer_id: string;
  source: TicketSource;
  status: TicketStatus;
  intent: string | null;
  urgency: Urgency;
  contact_phone: string | null;
  contact_email: string | null;
  contact_name: string | null;
  summary: string | null;
  metadata: Record<string, unknown>;
  dedupe_key: string | null;
  job_completed_at: string | null;
  review_request_sent_at: string | null;
  review_clicked: boolean;
  created_at: string;
  updated_at: string;
}

export interface TicketEvent {
  id: string;
  ticket_id: string;
  event_type: TicketEventType;
  old_value: string | null;
  new_value: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface SmsLog {
  id: string;
  customer_id: string;
  ticket_id: string | null;
  direction: SmsDirection;
  from_number: string | null;
  to_number: string | null;
  body: string | null;
  provider_id: string | null;
  status: string | null;
  created_at: string;
}

// --- API Types ---

export interface CreateTicketRequest {
  customer_slug: string;
  source: TicketSource;
  intent?: string;
  urgency: Urgency;
  contact_name: string;
  contact_phone: string;
  contact_email?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateTicketResponse {
  ticket_id: string;
  confirmation_sent: boolean;
  dedupe_matched: boolean;
}

// --- Wizard Types ---

export type WizardFlow = "A" | "B" | "C";

export interface WizardState {
  flow: WizardFlow | null;
  currentStep: number;
  data: WizardData;
}

export interface WizardData {
  // Flow selection
  category?: string;
  intent?: string;
  urgency?: Urgency;

  // Description
  description?: string;
  incident_type?: string;

  // Contact
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;

  // Location
  address?: string;
  plz_ort?: string;

  // Timing
  preferred_time?: string;
  timeline?: string;
  budget?: string;

  // Photos
  photos?: File[];

  // Consent
  consent?: boolean;

  // Source tracking
  ref?: string;
  prefilled_phone?: string;
}

// --- SMS Types ---

export interface SmsMessage {
  to: string;
  body: string;
  from?: string;
}

export interface SmsProviderResult {
  success: boolean;
  provider_id?: string;
  error?: string;
}

export interface SmsProvider {
  send(message: SmsMessage): Promise<SmsProviderResult>;
  readonly name: string;
}
