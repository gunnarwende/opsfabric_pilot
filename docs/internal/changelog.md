# Changelog

## Februar 2025 — Phase 1: Foundation

### Website + Wizard + Backend (Commit: 526fc239)
- Next.js 16 App mit Tailwind v4 Design-System
- Dynamische `[slug]`-Routen für Multi-Tenancy
- Komponenten: Hero, TrustBar, ServicesGrid, Heritage, Reviews, CtaSection
- 3-Wege Wizard (Notfall, Standard, Offerte)
- Header, Footer, FloatingCta
- Seiten: Homepage, Leistungen, Leistung-Detail, Kontakt, Datenschutz, Impressum
- Dörfler AG als statische Config

### Ticket-System + API (Commit: 526fc239)
- POST /api/ticket (Dedupe, SMS-Bestätigung)
- POST /api/webhook/missed-call (15-Min-Dedupe, Weekend-Detection)
- POST /api/webhook/sms-reply (1/2/3/Freitext Parsing)
- POST /api/cron/review-request (CRON_SECRET Auth)
- Provider-agnostische SMS-Schicht (Console + eCall.ch)
- Alle SMS-Templates (Deutsch, Sie-Form)

### Datenbank (Supabase)
- Schema: customers, tickets, ticket_events, sms_log
- 20 Indexes, RLS auf Datentabellen
- Dörfler AG Seed-Data
- Migriert via pg-Client direkt

### Security Fixes
- **Cron Security** (Commit: 02d6971a): `if (cronSecret && ...)` → `if (!cronSecret || ...)`
- **Webhook Parsing** (Commit: d06324da): Content-Type Check vor Body-Parsing

### Verification Tests (alle bestanden)
- A) Ticket-Dedupe: 2× gleiche Anfrage → 1 Ticket ✅
- B) Abuse Guard: 10 Requests → alle deduped ✅
- C) Missed-Call Dedupe: 2× gleicher Anrufer → 1 SMS ✅
- D) SMS Reply: "1", "2", "3", Freitext → korrekte Tickets ✅
- E) Cron Security: ohne Auth → 401 ✅
- F) Secrets Hygiene: keine Secrets in Logs ✅

## Februar 2025 — Skalierung: Docs + Config → DB

### Dokumentation Restrukturierung
- docs/ aufgeteilt in platform/, customers/, internal/
- CLAUDE.md aktualisiert (IST-Zustand, korrekte Referenzen)
- Veraltete Twilio-Referenzen entfernt
- Kunden-Template erstellt
