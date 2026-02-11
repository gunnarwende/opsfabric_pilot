-- OpsFabric: Seed data for Dörfler AG (Pilot)

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
