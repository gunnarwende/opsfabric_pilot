-- OpsFabric: Customers (Mandanten) table
-- Multi-tenant from day 1

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_customers_slug ON customers(slug);
CREATE INDEX IF NOT EXISTS idx_customers_active ON customers(active);
CREATE INDEX IF NOT EXISTS idx_customers_sms_number ON customers(sms_number);
