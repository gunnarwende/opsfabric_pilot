# OpsFabric — 06 Tech Architecture

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

---

## 1) Stack-Übersicht

| Komponente | Technologie | Zweck | Kosten (Pilot) |
|------------|------------|-------|----------------|
| **Frontend** | Next.js 14+ (App Router) | Website + Wizard + Dashboard | Gratis (Vercel) |
| **Styling** | Tailwind CSS | Utility-first, konsistent | — |
| **Datenbank** | Supabase (Postgres) | Tickets, Mandanten, Events | Gratis (Free-Tier) |
| **Auth** | Supabase Auth | Dashboard-Login für Betriebe | Gratis |
| **Storage** | Supabase Storage | Foto-Uploads aus Wizard | Gratis (1 GB) |
| **Edge Functions** | Supabase Edge Functions (Deno) | Webhooks, SMS-Versand, Cron | Gratis (500K/Mt.) |
| **SMS** | Twilio | Missed Call, Bestätigungen, Review | ~CHF 10/Mt. |
| **Hosting** | Vercel | Auto-Deploy, Edge, SSL | Gratis (Hobby) |
| **Repo** | GitHub (`opsfabric-pilot`) | Code, CI/CD | Gratis |
| **Domain** | flowsight.ch | Subdomains für Mandanten | Bestehend |

**Total Infrastrukturkosten (Pilot): ~CHF 10–15/Mt.**

---

## 2) Projekt-Struktur (Monorepo)

```
opsfabric-pilot/
├── apps/
│   └── web/                    # Next.js App
│       ├── app/
│       │   ├── [slug]/         # Dynamische Mandanten-Seiten
│       │   │   ├── page.tsx        # Homepage
│       │   │   ├── leistungen/
│       │   │   ├── anfrage/        # Wizard
│       │   │   ├── kontakt/
│       │   │   ├── datenschutz/
│       │   │   └── impressum/
│       │   ├── dashboard/      # Betriebsdashboard (Auth-geschützt)
│       │   │   ├── page.tsx        # Ticket-Übersicht
│       │   │   └── [ticketId]/     # Ticket-Detail
│       │   └── api/
│       │       ├── ticket/         # POST: Ticket erstellen
│       │       ├── webhook/
│       │       │   ├── twilio-call/    # Missed Call Event
│       │       │   └── twilio-sms/     # SMS Reply
│       │       └── cron/
│       │           └── review-request/ # Review Engine
│       ├── components/
│       │   ├── wizard/         # Wizard Steps
│       │   ├── proof/          # Proof-Block, Stars, Reviews
│       │   ├── layout/         # Header, Footer, Nav
│       │   └── ui/             # Buttons, Cards, Forms
│       ├── lib/
│       │   ├── supabase.ts     # Supabase Client
│       │   ├── twilio.ts       # Twilio Helper
│       │   ├── sms-templates.ts
│       │   └── types.ts        # TypeScript Types
│       └── config/
│           └── customers/      # Mandanten-Config (statisch, bis DB-driven)
│               └── doerfler-ag.ts
├── supabase/
│   ├── migrations/             # SQL Migrations
│   │   ├── 001_customers.sql
│   │   ├── 002_tickets.sql
│   │   └── 003_ticket_events.sql
│   ├── functions/              # Edge Functions
│   │   ├── send-sms/
│   │   ├── process-missed-call/
│   │   ├── process-sms-reply/
│   │   └── send-review-request/
│   └── seed.sql                # Testdaten
├── docs/                       # Diese Dokumentation
│   ├── 00_Index.md
│   ├── 01_Business_Model.md
│   ├── ...
│   └── 07_Pilot_Doerfler_AG.md
├── .env.local.example
├── package.json
└── README.md
```

---

## 3) Datenbank-Schema (Supabase/Postgres)

### 3.1 customers
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  twilio_number TEXT,
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
```

### 3.2 tickets
```sql
CREATE TABLE tickets (
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

CREATE INDEX idx_tickets_customer ON tickets(customer_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_dedupe ON tickets(dedupe_key);
CREATE INDEX idx_tickets_created ON tickets(created_at);
```

### 3.3 ticket_events
```sql
CREATE TABLE ticket_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'created','status_changed','sms_sent','sms_received',
    'sms_failed','review_requested','review_clicked','escalated'
  )),
  old_value TEXT,
  new_value TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_events_ticket ON ticket_events(ticket_id);
```

### 3.4 sms_log
```sql
CREATE TABLE sms_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) NOT NULL,
  ticket_id UUID REFERENCES tickets(id),
  direction TEXT CHECK (direction IN ('outbound','inbound')),
  from_number TEXT,
  to_number TEXT,
  body TEXT,
  twilio_sid TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sms_customer ON sms_log(customer_id);
```

### 3.5 Row Level Security (RLS)
```sql
-- Betriebe sehen nur ihre eigenen Daten
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Betrieb sieht eigene Tickets"
  ON tickets FOR SELECT
  USING (customer_id = auth.jwt()->>'customer_id');

ALTER TABLE ticket_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Betrieb sieht eigene Events"
  ON ticket_events FOR SELECT
  USING (ticket_id IN (
    SELECT id FROM tickets WHERE customer_id = auth.jwt()->>'customer_id'
  ));
```

---

## 4) API-Routen

### 4.1 POST /api/ticket (Wizard Submit)
```
Input:  { customer_slug, source, intent, urgency, contact_name, 
          contact_phone, contact_email, summary, metadata }
Output: { ticket_id, confirmation_sent }
Flow:   Validate → Dedupe Check → Insert Ticket → Log Event → 
        Send Confirmation SMS → Route to Betrieb
```

### 4.2 POST /api/webhook/twilio-call (Missed Call)
```
Input:  Twilio Webhook (CallSid, CallStatus, From, To)
Output: 200 OK
Flow:   Identify Customer (by To number) → Check Dedupe → 
        Wait 30–60s → Send Missed Call SMS → Log
```

### 4.3 POST /api/webhook/twilio-sms (SMS Reply)
```
Input:  Twilio Webhook (MessageSid, From, To, Body)
Output: 200 OK
Flow:   Identify Customer (by To number) → Parse Body (1/2/3/Freitext) → 
        Create/Update Ticket → Send Confirmation → Route
```

### 4.4 POST /api/cron/review-request (Cron, 15 Min Intervall)
```
Flow:   Query tickets WHERE status=DONE 
        AND job_completed_at + review_delay < now()
        AND review_request_sent_at IS NULL
        → Send Review SMS → Update Ticket → Log Event
```

---

## 5) Umgebungsvariablen

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+41...

# App
NEXT_PUBLIC_APP_URL=https://doerfler.flowsight.ch
NODE_ENV=production
```

---

## 6) Deployment

### Vercel
- Auto-Deploy von `main` Branch
- Preview Deployments von `dev` Branch
- Custom Domain: `*.flowsight.ch` (Wildcard)
- Environment Variables in Vercel Dashboard

### Supabase
- Projekt-Region: **EU West (Frankfurt)**
- Migrations via `supabase db push`
- Edge Functions via `supabase functions deploy`

### CI/CD
- Push to `dev` → Preview auf Vercel
- PR to `main` → Review → Merge → Production Deploy
- Supabase Migrations: manuell via CLI (Phase 1), automatisiert (Phase 4)

---

## 7) Accounts & Zugänge (Setup-Checkliste)

| Service | URL | Status |
|---------|-----|--------|
| GitHub | github.com (Repo: opsfabric-pilot) | ✅ Erstellt |
| Vercel | vercel.com | ✅ Erstellt |
| Supabase | supabase.com | ✅ Erstellt |
| Twilio | twilio.com | ⬜ Noch anlegen |
| flowsight.ch DNS | Registrar | ⬜ Subdomain konfigurieren |

### Twilio Setup-Schritte
1. Account erstellen auf twilio.com
2. Kreditkarte hinterlegen
3. Schweizer Nummer bestellen (+41)
4. Webhook-URLs konfigurieren
5. Sender ID registrieren (für CH SMS)

---

## 8) Sicherheit

- Supabase RLS für Mandantentrennung
- API-Routen: Twilio Webhook Signature Validation
- HTTPS überall (Vercel default)
- Environment Variables nie im Code
- Supabase Service Role Key nur serverseitig
- Rate Limiting auf API-Routen (Vercel Edge Middleware)
- CORS: nur eigene Domains

---

## 9) Monitoring & Alerting (Phase 3+)

| Was | Wie |
|-----|-----|
| Website Up | Vercel Analytics (gratis) |
| API Errors | Vercel Logs + Supabase Logs |
| SMS Delivery Failures | Twilio Dashboard + Webhook Status Callbacks |
| Ticket ohne Bestätigung >5 Min | Supabase Cron Check → Alert |
| System Health | Wöchentlicher manueller Check (Phase 1) |
