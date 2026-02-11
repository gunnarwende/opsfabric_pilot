# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpsFabric is a customer operations platform (SaaS) for Swiss craftsmen businesses (Handwerk), specifically targeting the plumbing, heating, and roofing trades in the Zürichsee-Süd region. The pilot customer is Dörfler AG.

**Key Business Logic:**
- Two customer acquisition channels: Website Wizard (Säule 1) and Missed Call Recovery (Säule 2)
- Multi-tenant architecture from day 1 (`customer_id` in all data models)
- Shared operations layer handles: tickets, SLA tracking, confirmations, lifecycle messaging, and review requests
- German market focus with Swiss phone numbers (+41), SMS via Twilio, Supabase EU region

## Documentation Structure

**Critical:** This project is documentation-first. Before implementing any feature, read the relevant docs:
- `docs/00_Index.md` — Overall project structure, phases, dependencies
- `docs/02_Shared_Ops_Layer.md` — Core ticket system, SLA, routing, review engine
- `docs/03_Saule_1_Web_Intake.md` — Website wizard blueprint
- `docs/04_Saule_2_Missed_Call.md` — Missed call recovery logic
- `docs/06_Tech_Architecture.md` — Stack, database schema, API routes, project structure
- `docs/08_SMS_Templates.md` — All SMS templates with variable references
- `docs/09_Wizard_UI_Texte.md` — UI text for wizard flows

## Stack & Tools

- **Frontend:** Next.js 14+ App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres, Auth, Edge Functions with Deno), Vercel Edge Middleware
- **SMS:** Twilio (for Swiss numbers)
- **Hosting:** Vercel (auto-deploy from `main`)
- **Region:** Supabase EU West (Frankfurt) for GDPR/DSG compliance

## Project Structure (Target)

```
opsfabric-pilot/
├── apps/web/                          # Next.js App
│   ├── app/
│   │   ├── [slug]/                    # Dynamic customer pages
│   │   │   ├── page.tsx               # Homepage
│   │   │   ├── anfrage/               # Wizard
│   │   │   ├── datenschutz/           # Privacy policy
│   │   │   └── impressum/             # Legal notice
│   │   ├── dashboard/                 # Customer dashboard (auth-protected)
│   │   └── api/
│   │       ├── ticket/                # POST: Create ticket
│   │       ├── webhook/
│   │       │   ├── twilio-call/       # Missed call handler
│   │       │   └── twilio-sms/        # SMS reply handler
│   │       └── cron/
│   │           └── review-request/    # Review engine
│   ├── components/
│   │   ├── wizard/                    # Wizard steps
│   │   ├── proof/                     # Social proof blocks
│   │   └── ui/                        # Reusable UI components
│   ├── lib/
│   │   ├── supabase.ts                # Supabase client
│   │   ├── twilio.ts                  # Twilio helper
│   │   ├── sms-templates.ts           # Template functions
│   │   └── types.ts                   # TypeScript types
│   └── config/customers/              # Customer configs (static, until DB-driven)
├── supabase/
│   ├── migrations/                    # SQL migrations
│   └── functions/                     # Edge Functions
└── docs/                              # Business & technical documentation
```

## Database Schema Principles

**Multi-tenancy:** Every table with customer data includes `customer_id UUID REFERENCES customers(id)`.

**Core Tables:**
- `customers` — Tenant configuration (slug, phone, Twilio number, SLA settings, quiet hours)
- `tickets` — System of record for all customer interactions (source, status, intent, urgency, contact info, dedupe_key)
- `ticket_events` — Audit log for ticket lifecycle
- `sms_log` — SMS delivery tracking

**Row Level Security:** Supabase RLS policies ensure tenants only see their own data.

**Deduplication:** `dedupe_key = customer_id + normalized_phone + date_bucket` prevents duplicate tickets within the same day.

## Key Conventions

1. **Language:** All documentation is in German. All code (variables, functions, comments) must be in English.
2. **Customer Routing:** Use `[slug]` dynamic routes where slug maps to `customers.slug` in Supabase.
3. **Phone Numbers:** Always normalize to E.164 format (+41...). Use a utility function for this.
4. **Quiet Hours:** SMS sending respects `quiet_hours_start` and `quiet_hours_end` from customer config (default 21:00–07:00), except for `urgency=HIGH`.
5. **SLA Calculation:** `sla_deadline = created_at + sla_response_minutes`, pausing during quiet hours.
6. **Ticket Sources:** Valid values: `wizard`, `missed_call`, `sms_reply`, `whatsapp`, `email`, `manual`.
7. **Ticket Statuses:** `NEW` → `NEEDS_CALLBACK` → `SCHEDULED` → `IN_PROGRESS` → `DONE` → `CLOSED`.

## API Routes

### POST /api/ticket
Create or update ticket from wizard submission.
- Input: `{ customer_slug, source, intent, urgency, contact_name, contact_phone, contact_email, summary, metadata }`
- Flow: Validate → Dedupe check → Insert/update ticket → Send confirmation SMS → Route to customer inbox

### POST /api/webhook/twilio-call
Handle Twilio missed call webhook.
- Flow: Identify customer by `To` number → Check dedupe → Wait 30-60s → Send missed call SMS → Create ticket

### POST /api/webhook/twilio-sms
Handle Twilio SMS reply webhook.
- Flow: Identify customer → Parse body (1/2/3 or freetext) → Update ticket → Send confirmation

### POST /api/cron/review-request
Periodic job (every 15 min) to send review requests.
- Flow: Query tickets with `status=DONE AND job_completed_at + review_delay < now() AND review_request_sent_at IS NULL` → Send review SMS → Update ticket

## Environment Variables

Required in `.env.local` and Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+41...

NEXT_PUBLIC_APP_URL=https://doerfler.flowsight.ch
```

## Development Workflow

1. **Branch Strategy:** Work on `dev` branch, merge to `main` for production deploy
2. **Vercel:** Auto-deploys `main` to production, `dev` to preview
3. **Supabase Migrations:** Apply via `supabase db push` (manual in Phase 1, automated later)
4. **Testing:** Run locally with `npm run dev`, test against Supabase dev instance

## Twilio Webhook Validation

All `/api/webhook/twilio-*` routes must validate Twilio signatures using `twilio.validateRequest()` to prevent unauthorized calls.

## Error Handling

- **SMS Delivery Failures:** Log to `ticket_events`, retry after 5 min (max 2 retries)
- **Quiet Hours:** Queue SMS to send at `quiet_hours_end`
- **Duplicate Submissions:** Use dedupe_key to prevent duplicate tickets

## Phase Plan

- **Phase 1 (Weeks 1-3):** Website + Wizard + Ticket backend + Confirmation SMS (Dörfler AG live)
- **Phase 2 (Weeks 3-4):** Missed Call Recovery via Twilio
- **Phase 3 (Weeks 5-6):** Dashboard + Review Engine + Reporting
- **Phase 4 (Weeks 7-8):** Multi-tenancy + Onboarding wizard + 2nd customer
- **Phase 5 (Weeks 9-12):** WhatsApp channel + Retention flows + Regional scaling

We are currently in the early stages of Phase 1.

## Security

- Use Supabase RLS for tenant isolation
- Validate all Twilio webhooks with signature verification
- Never expose `SUPABASE_SERVICE_ROLE_KEY` client-side
- Use Vercel Edge Middleware for rate limiting on API routes
- HTTPS everywhere (Vercel default)

## SMS Templates

See `docs/08_SMS_Templates.md` for all SMS templates. Templates use variables like `{name}`, `{betrieb}`, `{sla_zeit}`, etc.

**Key Template Functions:**
- `getConfirmationSMS(source, urgency, customerName, slaDeadline)`
- `getMissedCallSMS(customerName)`
- `getReviewRequestSMS(customerName, reviewLink)`

## Pilot Customer: Dörfler AG

- **Slug:** `doerfler-ag`
- **Company:** Dörfler AG, Hubstrasse 30, 8942 Oberrieden
- **Phone:** +41 43 443 52 00
- **Email:** info@doerflerag.ch
- **Services:** Sanitär (plumbing), Heizung (heating), Spenglerei (roofing), Blitzschutz, Solartechnik
- **Founded:** 1926 (100 years old, family business, 3rd generation)

## Multi-Tenant Considerations

- Each customer has a unique `slug` used in URL routing (`/{slug}/anfrage`)
- Customer configuration (colors, logo, services, contact info) stored in `customers` table
- Until Phase 4, customer config can be static TypeScript files in `config/customers/`
- After Phase 4, make customer config fully DB-driven with onboarding wizard
