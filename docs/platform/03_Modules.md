# OpsFabric — Module

Jedes Modul kann pro Kunde aktiviert/deaktiviert werden via `customers.modules` JSONB.

## Übersicht

| Modul | Key | Status | Beschreibung |
|-------|-----|--------|-------------|
| **Ticket-System** | `tickets` | ✅ Live | Kern: alle Kanäle → 1 Ticket |
| **SMS-Kommunikation** | `sms` | ✅ Live | Bestätigungen, Status-Updates |
| **Website** | `website` | ✅ Live | Template-basierte Kunden-Website |
| **Wizard (Web-Intake)** | `wizard` | ✅ Live | 3-Wege-Anfrageformular |
| **Missed-Call Recovery** | `missed_call` | ✅ Live | Verpasste Anrufe → Auto-SMS → Ticket |
| **Review-Engine** | `review_engine` | ✅ Live | Automatische Google-Bewertungsanfragen |
| **WhatsApp** | `whatsapp` | 🔜 Geplant | WhatsApp Business API Integration |
| **E-Mail-Intake** | `email` | 🔜 Geplant | E-Mail → Ticket (Postmark) |
| **Voice Agent** | `voice_agent` | 🔜 Geplant | KI-Telefonie (OpenAI Realtime) |
| **Dashboard** | `dashboard` | 🔜 Geplant | ROI-Zahlen, Ticket-Übersicht |

## Modul-Konfiguration

```json
{
  "modules": {
    "tickets": true,
    "sms": true,
    "website": true,
    "wizard": true,
    "missed_call": true,
    "review_engine": true,
    "whatsapp": false,
    "email": false,
    "voice_agent": false,
    "dashboard": false
  }
}
```

## Modul-Details

### Ticket-System (Kern)
**Immer aktiv.** Jede Kundeninteraktion wird als Ticket erfasst.

- **Quellen:** wizard, missed_call, sms_reply, whatsapp, email, manual
- **Status-Flow:** NEW → NEEDS_CALLBACK → SCHEDULED → IN_PROGRESS → DONE → CLOSED
- **Dedupe:** customer_id + normalized_phone + Datum → verhindert Duplikate
- **SLA:** `sla_response_minutes` (Default 120 Min), pausiert in Quiet Hours

### SMS-Kommunikation
Automatische SMS-Nachrichten an Endkunden.

- **Provider:** Abstraktionsschicht (`lib/sms/provider.ts`)
- **Dev:** Console-Provider (loggt statt sendet)
- **Prod:** eCall.ch (Schweizer Dateresidenz, 2-Weg-SMS)
- **Templates:** `lib/sms/templates.ts` (Deutsch, Sie-Form)
- **Quiet Hours:** 21:00–07:00, außer urgency=HIGH

### Website
Template-basierte Kunden-Website.

- **Routing:** `/{slug}/` → Homepage, Leistungen, Kontakt, Wizard, Legal
- **Komponenten:** Hero, TrustBar, ServicesGrid, Heritage, Reviews, CtaSection
- **Schema.org:** LocalBusiness, AggregateRating, OfferCatalog
- **Konfiguration:** Alles aus `customers.config` JSONB (Services, Hero-Text, Reviews)
- **Ohne Website:** Modul deaktiviert → minimale Landingpage mit Kontaktdaten

### Wizard (Web-Intake)
3-Wege-Anfrageformular für Endkunden.

- **Flow A (Notfall):** urgency=HIGH, minimal Felder, Sicherheits-Hinweis
- **Flow B (Standard):** urgency=MED, Kategorie-basiert, 5 Schritte
- **Flow C (Offerte):** urgency=LOW, detaillierte Projektinfos
- **Standalone:** Funktioniert auch ohne Website (z.B. QR-Code auf Visitenkarte → `/{slug}/anfrage`)
- **API:** POST `/api/ticket`

### Missed-Call Recovery
Verpasste Anrufe → Auto-SMS → Ticket.

- **Trigger:** Telephony-Provider Webhook → `POST /api/webhook/missed-call`
- **SMS:** "1 = Dringend, 2 = Rückruf, 3 = Online-Formular"
- **Antwort-Verarbeitung:** `POST /api/webhook/sms-reply`
- **Dedupe:** 15-Minuten-Fenster (kein erneuter SMS bei Mehrfachanruf)
- **Weekend:** Anderes Template ("Wir sind ab Montag wieder für Sie da")

### Review-Engine
Automatische Google-Bewertungsanfragen nach Auftragsabschluss.

- **Trigger:** Ticket status=DONE → Verzögerung (Default 2h) → Review-SMS
- **Cron:** `POST /api/cron/review-request` (alle 15 Min)
- **Bedingungen:** Quiet Hours respektiert, google_review_link muss hinterlegt sein
- **Tracking:** review_request_sent_at, review_clicked

### WhatsApp (geplant)
WhatsApp Business API für Kundenkommunikation.

- **Inbound:** Nachricht → Ticket (wie SMS, aber reichhaltiger)
- **Outbound:** Bestätigungen, Status-Updates, Review-Anfragen
- **Medien:** Fotos senden/empfangen
- **Provider:** Twilio WhatsApp API oder Meta Cloud API

### E-Mail-Intake (geplant)
E-Mails automatisch zu Tickets.

- **Provider:** Postmark Inbound Webhook
- **Flow:** E-Mail → Parsing (Betreff, Body) → Ticket
- **Contact Resolution:** E-Mail-Adresse → Kundenmatching

### Voice Agent (geplant)
KI-gestützte Telefonie.

- **Stack:** Twilio Voice + OpenAI Realtime API
- **Sprachen:** Deutsch, Englisch, Französisch (Schweizerdeutsch-Verständnis)
- **DSG-konform:** Nur Transkription, keine Audio-Speicherung
- **Fallback:** "0" für Mensch

## Branchen-Profile

Module können pro Branche vorkonfiguriert werden:

| Branche | Website | Wizard | Missed-Call | Review | WhatsApp |
|---------|---------|--------|-------------|--------|----------|
| **Handwerk** | ✅ | ✅ (Notfall/Standard/Offerte) | ✅ | ✅ | Optional |
| **Gastro** | ✅ | ✅ (Reservierung/Event/Catering) | ✅ | ✅ | ✅ |
| **Beauty** | ✅ | ✅ (Termin/Beratung) | ✅ | ✅ | ✅ |
| **Allgemein** | ✅ | ✅ (Anfrage/Offerte) | ✅ | ✅ | Optional |
