-- OpsFabric: Ticket Events (Audit Log) + SMS Log

-- Ticket Events
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

-- SMS Log
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

-- RLS for ticket_events
ALTER TABLE ticket_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on ticket_events"
  ON ticket_events FOR ALL USING (true) WITH CHECK (true);

-- RLS for sms_log
ALTER TABLE sms_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access on sms_log"
  ON sms_log FOR ALL USING (true) WITH CHECK (true);
