# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**OpsFabric** is a modular customer operations platform (SaaS) by **FlowSight GmbH** for local businesses in Switzerland. It automates lead capture, customer communication, and reputation management.

**Target Market:** Local service businesses — starting with Handwerk (plumbing, heating, roofing) in Zürichsee-Süd, expanding to Gastro, Beauty, and other local trades.

**Business Model:** Setup fee (website creation) + monthly subscription (MRR) for the operations platform.

**Pilot Customer:** Dörfler AG (doerfler-ag) — live at opsfabricpilot.vercel.app

**Key Architecture Principles:**
- Multi-tenant from day 1 (`customer_id` in all data models)
- Modular: each feature (website, missed-call, review-engine) can be enabled/disabled per customer
- Provider-agnostic SMS layer (console for dev, eCall.ch for production)
- Customer config stored in Supabase `customers.config` JSONB — no hardcoded customer data in code
- German UI/docs, English code

## Stack & Versions

- **Runtime:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4 (with `@tailwindcss/postcss`, `@theme` directive)
- **Database:** Supabase (Postgres, EU Frankfurt for GDPR/DSG compliance)
- **Icons:** Lucide React
- **SMS:** Provider-agnostic (`lib/sms/provider.ts`). Dev: console. Production: eCall.ch
- **Hosting:** Vercel (auto-deploy from `main` branch)
- **Domain:** flowsight.ch (FlowSight GmbH). Customer domains: `{customer}.flowsight.ch` or custom domain

## Project Structure (Actual)

```
opsfabric_pilot/
├── app/
│   ├── [slug]/                        # Dynamic customer pages
│   │   ├── page.tsx                   # Homepage
│   │   ├── layout.tsx                 # Customer layout (header, footer, floating CTA)
│   │   ├── anfrage/page.tsx           # Wizard intake
│   │   ├── kontakt/page.tsx           # Contact page
│   │   ├── leistungen/page.tsx        # Services overview
│   │   ├── leistungen/[service]/page.tsx  # Service detail
│   │   ├── datenschutz/page.tsx       # Privacy policy (DSG)
│   │   └── impressum/page.tsx         # Legal notice
│   ├── api/
│   │   ├── ticket/route.ts            # POST: Create/update ticket
│   │   ├── webhook/
│   │   │   ├── missed-call/route.ts   # Missed call webhook (form-encoded + JSON)
│   │   │   └── sms-reply/route.ts     # SMS reply webhook (1/2/3/freetext)
│   │   └── cron/
│   │       └── review-request/route.ts # Review engine (requires CRON_SECRET)
│   ├── page.tsx                       # Root redirect (configurable via DEFAULT_CUSTOMER_SLUG)
│   ├── layout.tsx                     # Global layout (Inter font, lang="de")
│   └── globals.css                    # Tailwind v4 design system
│
├── components/
│   ├── layout/                        # Header, Footer, FloatingCta
│   ├── sections/                      # Hero, ServicesGrid, TrustBar, Heritage, Reviews, CtaSection
│   └── wizard/                        # WizardContainer, FlowSelector, WizardSteps, ThankYou
│
├── config/
│   └── customers/
│       └── doerfler-ag.ts             # LEGACY: static config (migrating to Supabase)
│
├── lib/
│   ├── types.ts                       # All TypeScript types and enums
│   ├── supabase.ts                    # Supabase client (public + admin/service-role)
│   ├── phone.ts                       # Swiss E.164 normalization, validation, dedupe keys
│   ├── utils.ts                       # cn(), isQuietHours(), calculateSlaDeadline()
│   └── sms/
│       ├── provider.ts                # SMS provider abstraction (Console, eCall)
│       └── templates.ts               # All SMS templates (German, Sie-Form)
│
├── supabase/
│   ├── migrations/
│   │   └── 001_init.sql               # Complete schema (customers, tickets, ticket_events, sms_log)
│   └── seed.sql                       # Seed data for pilot customer
│
├── scripts/                           # Utility scripts (onboarding, etc.)
│
├── docs/
│   ├── platform/                      # Generic OpsFabric documentation
│   ├── customers/                     # Per-customer profiles and configs
│   └── internal/                      # Architecture decisions, changelog
│
└── public/                            # Static assets
```

## Database Schema

**Core Tables:**
- `customers` — Tenant config (slug, phone, email, sms_number, SLA settings, quiet hours, `config` JSONB for services/intents/reviews/hero)
- `tickets` — System of record (source, status, intent, urgency, contact info, dedupe_key)
- `ticket_events` — Audit log (created, status_changed, sms_sent, sms_received, sms_failed, review_requested, review_clicked, escalated)
- `sms_log` — SMS delivery tracking (direction, provider_id, status)

**Multi-tenancy:** Every table includes `customer_id UUID REFERENCES customers(id)`. RLS enabled on tickets, ticket_events, sms_log.

**Deduplication:** `dedupe_key = customer_id + normalized_phone + YYYY-MM-DD` prevents duplicate tickets per day.

**Customer Config JSONB:** The `customers.config` column stores all customer-specific configuration:
- `services[]` — Service definitions (slug, name, description, features, icon)
- `intents[]` — Wizard intent options (slug, label, service, urgency)
- `reviews[]` — Review highlights for website
- `hero` — Hero section content (claim, subclaim, benefits)
- `address`, `plz`, `ort`, `contact_person`
- `founded_year`, `generation`, `certifications`
- `opening_hours`, `google_rating`, `google_review_count`

## Key Conventions

1. **Language:** Documentation in German. Code (variables, functions, comments) in English.
2. **Customer Routing:** `[slug]` dynamic routes. Slug maps to `customers.slug` in Supabase.
3. **Phone Numbers:** Always E.164 format (+41...). Use `normalizePhone()` from `lib/phone.ts`.
4. **Quiet Hours:** SMS respects `quiet_hours_start`/`quiet_hours_end` (default 21:00–07:00), except `urgency=HIGH`.
5. **SLA Calculation:** `sla_deadline = created_at + sla_response_minutes`, pausing during quiet hours.
6. **Ticket Sources:** `wizard`, `missed_call`, `sms_reply`, `whatsapp`, `email`, `manual`
7. **Ticket Statuses:** `NEW` → `NEEDS_CALLBACK` → `SCHEDULED` → `IN_PROGRESS` → `DONE` → `CLOSED`
8. **Modules:** Customer features controlled via `customers.modules` JSONB: `{ website, missed_call, sms, review_engine }`

## API Routes

### POST /api/ticket
Create or update ticket from wizard submission.
- Input: `{ customer_slug, source, intent, urgency, contact_name, contact_phone, contact_email, summary, metadata }`
- Flow: Validate → Lookup customer → Normalize phone → Dedupe check → Insert/update → Log event → Send confirmation SMS → Log SMS
- Returns: `{ ticket_id, confirmation_sent, dedupe_matched }`

### POST /api/webhook/missed-call
Handle missed call webhooks (form-encoded or JSON).
- Identifies customer by `To` number (matches `sms_number` or `phone`)
- 15-minute dedupe window via sms_log
- Sends missed-call SMS with 1/2/3 reply options
- Weekend detection → different template

### POST /api/webhook/sms-reply
Handle inbound SMS replies (form-encoded or JSON).
- Parses reply: "1" → HIGH/NEW, "2" → MED/NEEDS_CALLBACK, "3" → wizard link (no ticket), freetext → MED/NEW
- Dedupes via generateDedupeKey
- Sends confirmation SMS per reply type

### POST /api/cron/review-request
Periodic job (every 15 min). **Requires `CRON_SECRET` (always, even if env var unset).**
- Queries: status=DONE, review_request_sent_at IS NULL, job_completed_at + delay passed
- Sends review SMS, updates ticket, logs event

## Environment Variables

Required in `.env.local` and Vercel:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

APP_BASE_URL=https://opsfabricpilot.vercel.app

# SMS Provider: "console" (dev), "ecall" (production)
SMS_PROVIDER=console

# eCall credentials (production)
# ECALL_USERNAME=
# ECALL_PASSWORD=
# ECALL_SENDER_ID=

# Cron authentication
# CRON_SECRET=

# Root redirect (optional)
# DEFAULT_CUSTOMER_SLUG=doerfler-ag
```

## Development Workflow

1. **Branch Strategy:** Push directly to `main` (auto-deploys to Vercel production)
2. **Supabase Migrations:** Execute via Supabase SQL Editor or pg client
3. **Testing:** `npm run dev` locally, smoke test against production endpoints
4. **Build Check:** `npx next build` must pass with 0 errors before committing

## SMS Templates

All templates in `lib/sms/templates.ts`. German, Sie-Form. Variables via template literal interpolation.

**Template Functions:**
- `missedCallInitialSms(vars)` / `missedCallWeekendSms(vars)` — Missed call auto-reply
- `replyUrgentSms(vars)` / `replyCallbackSms(vars)` / `replyWizardSms(vars)` / `replyFreetextSms(vars)` — SMS reply confirmations
- `wizardConfirmationStandard(vars)` / `wizardConfirmationUrgent(vars)` / `wizardConfirmationOfferte(vars)` — Wizard confirmations
- `reviewRequestSms(vars)` — Review request after job completion
- `getConfirmationSms(source, urgency, vars)` — Selector function

**Template Variables:** `{ betrieb, name, phone, sla_zeit, wizard_link, review_link }`

## Security

- Supabase RLS for tenant isolation
- CRON_SECRET required for cron endpoints (rejects if unset)
- Never expose `SUPABASE_SERVICE_ROLE_KEY` client-side
- Webhook endpoints support form-encoded (production) and JSON (testing)
- HTTPS everywhere (Vercel default)
- `.env.local` in `.gitignore` — never committed
