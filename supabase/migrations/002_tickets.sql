-- OpsFabric: Tickets table
-- System of record for all customer interactions

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_customer ON tickets(customer_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_dedupe ON tickets(dedupe_key);
CREATE INDEX IF NOT EXISTS idx_tickets_created ON tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_tickets_source ON tickets(source);
CREATE INDEX IF NOT EXISTS idx_tickets_urgency ON tickets(urgency);

-- Row Level Security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role full access on tickets"
  ON tickets FOR ALL
  USING (true)
  WITH CHECK (true);
