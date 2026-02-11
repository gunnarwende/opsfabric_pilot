# OpsFabric — Technische Architektur (IST-Zustand)

> Letzte Aktualisierung: Februar 2025

## Stack

| Komponente | Technologie | Version |
|-----------|------------|---------|
| **Frontend** | Next.js (App Router) | 16.1.6 |
| **UI Framework** | React | 19.2.3 |
| **Styling** | Tailwind CSS | 4.x (`@tailwindcss/postcss`, `@theme`) |
| **Icons** | Lucide React | 0.563.0 |
| **Datenbank** | Supabase (Postgres) | EU Frankfurt |
| **SMS** | Provider-agnostisch | Console (Dev), eCall.ch (Prod) |
| **Hosting** | Vercel | Auto-deploy `main` |
| **Domain** | flowsight.ch | FlowSight GmbH |

## Architektur-Diagramm

```
┌─────────────────────────────────────────────┐
│              INBOUND CHANNELS                │
├─────────────────────────────────────────────┤
│  Website Wizard  → POST /api/ticket         │
│  Missed Call     → POST /api/webhook/missed-call │
│  SMS Reply       → POST /api/webhook/sms-reply   │
│  (WhatsApp)      → POST /api/webhook/whatsapp    │  ← geplant
│  (E-Mail)        → POST /api/webhook/email       │  ← geplant
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│          CONTACT RESOLUTION                  │
│  Phone (E.164) / E-Mail → customer_id       │
│  Dedupe: customer_id + phone + date         │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│           TICKET SYSTEM (Supabase)           │
│  tickets → ticket_events → sms_log          │
│  Status: NEW → NEEDS_CALLBACK → SCHEDULED   │
│          → IN_PROGRESS → DONE → CLOSED      │
└──────────────────────┬──────────────────────┘
                       ↓
┌─────────────────────────────────────────────┐
│          OUTBOUND (SMS/WhatsApp)             │
│  Bestätigungen, Status-Updates, Reviews      │
│  Provider: lib/sms/provider.ts               │
│  Templates: lib/sms/templates.ts             │
└─────────────────────────────────────────────┘
```

## Datenbank-Schema

### customers
Mandanten-Konfiguration. Jeder Betrieb = 1 Row.

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID PK | Auto-generated |
| name | TEXT | Firmenname |
| slug | TEXT UNIQUE | URL-Slug (z.B. "doerfler-ag") |
| phone | TEXT | Haupttelefon (E.164) |
| email | TEXT | Haupt-E-Mail |
| sms_number | TEXT | SMS-Absendernummer |
| website_domain | TEXT | Kundendomain |
| google_review_link | TEXT | Google Review-URL |
| timezone | TEXT | Default: Europe/Zurich |
| quiet_hours_start | TIME | Default: 21:00 |
| quiet_hours_end | TIME | Default: 07:00 |
| sla_response_minutes | INT | Default: 120 |
| review_delay_hours | INT | Default: 2 |
| plan | TEXT | pilot, starter, pro, premium |
| config | JSONB | Services, Intents, Reviews, Hero, etc. |
| active | BOOLEAN | Default: true |

### tickets
System of Record für alle Kundeninteraktionen.

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID PK | Auto-generated |
| customer_id | UUID FK | → customers(id) |
| source | TEXT | wizard, missed_call, sms_reply, whatsapp, email, manual |
| status | TEXT | NEW, NEEDS_CALLBACK, SCHEDULED, IN_PROGRESS, DONE, CLOSED |
| intent | TEXT | z.B. sanitaer_notfall, heizung_wartung |
| urgency | TEXT | LOW, MED, HIGH |
| contact_phone | TEXT | E.164 |
| contact_email | TEXT | |
| contact_name | TEXT | |
| summary | TEXT | Freitext-Zusammenfassung |
| metadata | JSONB | Zusatzinfos |
| dedupe_key | TEXT | customer_id:phone:YYYY-MM-DD |
| job_completed_at | TIMESTAMPTZ | Wann Auftrag erledigt |
| review_request_sent_at | TIMESTAMPTZ | Wann Review-SMS gesendet |
| review_clicked | BOOLEAN | Ob Review-Link geklickt |

### ticket_events
Audit-Log für Ticket-Lifecycle.

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID PK | |
| ticket_id | UUID FK | → tickets(id) |
| event_type | TEXT | created, status_changed, sms_sent, sms_received, sms_failed, review_requested, review_clicked, escalated |
| old_value | TEXT | Vorheriger Wert |
| new_value | TEXT | Neuer Wert |
| metadata | JSONB | Zusatzinfos |

### sms_log
SMS-Versand-Tracking.

| Spalte | Typ | Beschreibung |
|--------|-----|-------------|
| id | UUID PK | |
| customer_id | UUID FK | → customers(id) |
| ticket_id | UUID FK | → tickets(id), nullable |
| direction | TEXT | outbound, inbound |
| from_number | TEXT | |
| to_number | TEXT | |
| body | TEXT | |
| provider_id | TEXT | Provider-Referenz |
| status | TEXT | sent, failed, received |

### Row Level Security
- `tickets`, `ticket_events`, `sms_log`: RLS enabled
- Service-Role hat vollen Zugriff
- Anon-Key: kein direkter Zugriff (nur über API-Routen)

## API-Routen (getestet & live)

### POST /api/ticket ✅
Ticket erstellen/aktualisieren (Wizard, manuell).
- **Input:** `{ customer_slug, source, intent, urgency, contact_name, contact_phone, summary, metadata }`
- **Response:** `{ ticket_id, confirmation_sent, dedupe_matched }`
- **Dedupe:** Gleiche Nummer am gleichen Tag → Update statt Insert

### POST /api/webhook/missed-call ✅
Verpasste Anrufe verarbeiten.
- **Format:** Form-encoded (Produktion) oder JSON (Testing)
- **Flow:** To-Nummer → Customer-Lookup → 15-Min-Dedupe → SMS (1/2/3)
- **Weekend:** Anderes Template

### POST /api/webhook/sms-reply ✅
SMS-Antworten verarbeiten (1/2/3/Freitext).
- **"1"** → Ticket urgency=HIGH, status=NEW
- **"2"** → Ticket urgency=MED, status=NEEDS_CALLBACK
- **"3"** → Wizard-Link senden (kein Ticket)
- **Freitext** → Ticket urgency=MED, Text als Summary

### POST /api/cron/review-request ✅
Review-SMS senden (alle 15 Min via Cron).
- **Auth:** CRON_SECRET Pflicht (lehnt ab wenn nicht gesetzt)
- **Query:** status=DONE, review_request_sent_at IS NULL, delay abgelaufen

## Environment Variables

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

# App
APP_BASE_URL=https://opsfabricpilot.vercel.app

# SMS
SMS_PROVIDER=console          # "console" (dev) oder "ecall" (prod)
ECALL_USERNAME=               # eCall.ch Zugangsdaten
ECALL_PASSWORD=
ECALL_SENDER_ID=

# Security
CRON_SECRET=                  # Cron-Endpunkte Authentifizierung

# Optional
DEFAULT_CUSTOMER_SLUG=        # Root-Redirect
```

## Sicherheit

- **Tenant-Isolation:** Supabase RLS auf allen Daten-Tabellen
- **Cron-Auth:** CRON_SECRET Pflicht, lehnt ab wenn Env-Variable fehlt
- **Secrets:** `.env.local` im `.gitignore`, Service-Role-Key nur server-side
- **Webhooks:** Form-encoded (Produktion) + JSON (Testing)
- **HTTPS:** Vercel Default
- **Keine Audio-Speicherung:** Geplanter Voice Agent transkribiert nur, speichert kein Audio (DSG-konform)

## Infrastrukturkosten pro Kunde

| Service | Free Tier | Kosten bei Wachstum |
|---------|-----------|---------------------|
| Supabase | 500 MB, 50k Rows | CHF 25/Mt (Pro) |
| Vercel | 100 GB Bandwidth | CHF 20/Mt (Pro) |
| eCall.ch SMS | — | CHF 0.07/SMS |
| Domain | — | CHF 15/Jahr |
| **Total (Start)** | **~CHF 0** | **~CHF 10–15/Mt/Kunde** |
