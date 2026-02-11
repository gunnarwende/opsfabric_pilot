-- ============================================================
-- OpsFabric: Complete Database Schema (Phase 1)
-- Execute this file 1:1 in Supabase SQL Editor
-- ============================================================

-- 1) Customers (Mandanten)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  sms_number TEXT,
  website_domain TEXT,
  google_review_link TEXT,
  timezone TEXT DEFAULT 'Europe/Zurich',
  quiet_hours_start TIME DEFAULT '21:00',
  quiet_hours_end TIME DEFAULT '07:00',
  sla_response_minutes INT DEFAULT 120,
  review_delay_hours INT DEFAULT 2,
  plan TEXT DEFAULT 'pilot' CHECK (plan IN ('pilot','starter','pro','premium')),
  config JSONB DEFAULT '{}',
  onboarded_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customers_slug ON customers(slug);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(active);
CREATE INDEX IF NOT EXISTS idx_customers_sms_number ON customers(sms_number);

-- 2) Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('wizard','missed_call','sms_reply','whatsapp','email','manual')),
  status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW','NEEDS_CALLBACK','SCHEDULED','IN_PROGRESS','DONE','CLOSED')),
  intent TEXT,
  urgency TEXT DEFAULT 'MED' CHECK (urgency IN ('LOW','MED','HIGH')),
  contact_phone TEXT,
  contact_email TEXT,
  contact_name TEXT,
  summary TEXT,
  metadata JSONB DEFAULT '{}',
  dedupe_key TEXT,
  job_completed_at TIMESTAMPTZ,
  review_request_sent_at TIMESTAMPTZ,
  review_clicked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_dedupe ON tickets(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_source ON tickets(source);
CREATE INDEX IF NOT EXISTS idx_tickets_urgency ON tickets(urgency);

ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on tickets"
  ON tickets FOR ALL USING (true) WITH CHECK (true);

-- 3) Ticket Events (Audit Log)
CREATE TABLE IF NOT EXISTS ticket_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id),
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created','status_changed','sms_sent','sms_received',
    'sms_failed','review_requested','review_clicked','escalated'
  )),
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_ticket ON ticket_events(ticket_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON ticket_events(event_type);

ALTER TABLE ticket_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on ticket_events"
  ON ticket_events FOR ALL USING (true) WITH CHECK (true);

-- 4) SMS Log
CREATE TABLE IF NOT EXISTS sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  ticket_id UUID REFERENCES tickets(id),
  direction TEXT CHECK (direction IN ('outbound','inbound')),
  from_number TEXT,
  to_number TEXT,
  body TEXT,
  provider_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sms_customer ON sms_log(customer_id);
CREATE INDEX IF NOT EXISTS idx_sms_ticket ON sms_log(ticket_id);
CREATE INDEX IF NOT EXISTS idx_sms_to ON sms_log(to_number);
CREATE INDEX IF NOT EXISTS idx_sms_created ON sms_log(created_at);

ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on sms_log"
  ON sms_log FOR ALL USING (true) WITH CHECK (true);

-- 5) Seed: Dörfler AG (Pilot)
INSERT INTO customers (
  name, slug, phone, email, sms_number, website_domain,
  timezone, quiet_hours_start, quiet_hours_end,
  sla_response_minutes, review_delay_hours, plan,
  config, active
) VALUES (
  'Dörfler AG',
  'doerfler-ag',
  '+41434435200',
  'info@doerflerag.ch',
  NULL,
  'doerfler.flowsight.ch',
  'Europe/Zurich',
  '21:00',
  '07:00',
  120,
  2,
  'pilot',
  '{
    "address": "Hubstrasse 30",
    "plz": "8942",
    "ort": "Oberrieden",
    "contact_person": "Ramon Dörfler",
    "founded_year": 1926,
    "generation": "3. Generation — Ramon & Luzian Dörfler",
    "opening_hours": "Mo–Fr 08:00–12:00, 13:00–17:00",
    "google_rating": 4.7,
    "google_review_count": 3,
    "certifications": ["Suissetec-Mitglied"]
  }'::jsonb,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  config = EXCLUDED.config,
  updated_at = now();
