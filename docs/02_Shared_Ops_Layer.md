# OpsFabric — 02 Shared Ops Layer

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

> Der Shared Ops Layer ist der gemeinsame Kern, den Säule 1 (Web/Wizard) und Säule 2 (Missed Call) nutzen.  
> Er liefert die verlässliche Prozesskette: **Ticket → Bestätigung (SLA) → Routing → Lifecycle Messaging → Review**.

---

## 1) Warum der Shared Ops Layer existiert

Ohne ihn hast du "Nachrichten". Mit ihm hast du:
- Ein **System of Record** (jede Interaktion = Ticket)
- Klare Zustände und Verantwortlichkeit
- Dedupe/Throttle und Quiet Hours
- Messbare KPIs und Reporting
- Wiederverwendbarkeit über Branchen und Kanäle
- Mandantenfähigkeit von Tag 1

---

## 2) Ticket als System of Record

### 2.1 Pflichtfelder (Tabelle `tickets`)

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | uuid (PK) | Auto-generiert |
| `customer_id` | uuid (FK) | Mandant (Betrieb) |
| `source` | enum | `wizard` · `missed_call` · `sms_reply` · `whatsapp` · `email` · `manual` |
| `status` | enum | `NEW` · `NEEDS_CALLBACK` · `SCHEDULED` · `IN_PROGRESS` · `DONE` · `CLOSED` |
| `intent` | text | Branchenspezifisch (z.B. `sanitaer_notfall`, `heizung_wartung`, `offerte_bad`) |
| `urgency` | enum | `LOW` · `MED` · `HIGH` |
| `contact_phone` | text | Normalisiert: +41… |
| `contact_email` | text | Optional |
| `contact_name` | text | |
| `summary` | text | Kurzbeschreibung |
| `metadata` | jsonb | Flexibel: PLZ, Adresse, Fotos-URLs, preferred_time, Wizard-Antworten |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |
| `job_completed_at` | timestamptz | Gesetzt wenn status → DONE |
| `review_request_sent_at` | timestamptz | Gesetzt nach Review-SMS |
| `review_clicked` | boolean | Via Tracking-Link |
| `dedupe_key` | text | Generiert: `customer_id + normalized_phone + day_bucket` |

### 2.2 Tabelle `customers` (Mandanten/Betriebe)

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | uuid (PK) | |
| `name` | text | Firmenname (z.B. "Dörfler AG") |
| `slug` | text | URL-Slug (z.B. "doerfler-ag") |
| `phone` | text | Hauptnummer des Betriebs |
| `email` | text | Primary Inbox |
| `twilio_number` | text | Zugewiesene Twilio-Nummer |
| `website_domain` | text | z.B. "doerfler.opsfabric.ch" |
| `google_review_link` | text | Direktlink zum Google-Review-Formular |
| `timezone` | text | Default: `Europe/Zurich` |
| `quiet_hours_start` | time | Default: `21:00` |
| `quiet_hours_end` | time | Default: `07:00` |
| `sla_response_minutes` | int | Default: 120 (2 Stunden) |
| `review_delay_hours` | int | Default: 2 |
| `plan` | enum | `pilot` · `starter` · `pro` · `premium` |
| `onboarded_at` | timestamptz | |
| `active` | boolean | |

### 2.3 Tabelle `ticket_events` (Audit Log)

| Feld | Typ | Beschreibung |
|------|-----|-------------|
| `id` | uuid (PK) | |
| `ticket_id` | uuid (FK) | |
| `event_type` | enum | `created` · `status_changed` · `sms_sent` · `sms_received` · `review_requested` · `review_clicked` |
| `old_value` | text | |
| `new_value` | text | |
| `created_at` | timestamptz | |

### 2.4 Dedupe-Logik
- **Dedupe Key:** `customer_id` + `normalized_phone` + `date_bucket` (YYYY-MM-DD)
- **Regel:** Wenn Ticket mit gleichem Dedupe Key und Status ≠ `CLOSED` existiert → bestehends Ticket updaten, kein neues anlegen
- **Missed Call spezifisch:** Gleiche Nummer innerhalb 15 Min → kein neues Ticket, kein neuer SMS

---

## 3) SLA & Bestätigungen

### 3.1 Trigger → Bestätigung

| Trigger | Bestätigungs-Inhalt | Kanal | Timing |
|---------|-------------------|-------|--------|
| Wizard Submit | "Danke {Name}, Ihre Anfrage ist eingegangen. Wir melden uns bis {SLA-Zeit}." | SMS | Sofort (<30s) |
| Missed Call Reply "1" | "Verstanden — dringend. {Betrieb} meldet sich schnellstmöglich." | SMS | Sofort |
| Missed Call Reply "2" | "Rückruf ist notiert. {Betrieb} ruft Sie bis {SLA-Zeit} zurück." | SMS | Sofort |
| Missed Call Reply "3" / Klick | Wizard-Link senden | SMS | Sofort |
| Status → SCHEDULED | "Ihr Termin bei {Betrieb}: {Datum/Zeit}." | SMS | Bei Statusänderung |
| Status → DONE | Review Request (siehe §5) | SMS | +2h (konfigurierbar) |

### 3.2 SLA-Berechnung
- `sla_deadline = created_at + sla_response_minutes`
- Quiet Hours werden übersprungen (SLA pausiert zwischen quiet_hours_start und quiet_hours_end)
- Default: 2 Stunden während Geschäftszeiten

### 3.3 Bestätigungs-Template (Skeleton)
```
Zeile 1: Danke + Kontext
Zeile 2: Nächster Schritt (Rückruf/Termin/Link)
Zeile 3: Zeitfenster (SLA)
Zeile 4: Notfall-Hinweis (nur bei urgency=HIGH)
```

### 3.4 Throttle & Dedupe (Bestätigungen)
- Max 1 Bestätigung pro Ticket pro 30 Minuten
- Quiet Hours beachten (21:00–07:00), ausser urgency=HIGH
- Keine Bestätigung doppelt senden (check `ticket_events`)

---

## 4) Routing (intern)

### 4.1 Primary Inbox
Pro Mandant genau **1 Primary Inbox** — nicht 5.

| Priorität | Kanal | Wann |
|-----------|-------|------|
| 1 | E-Mail an `customer.email` | Default, immer |
| 2 | WhatsApp an `customer.phone` | Wenn konfiguriert (Phase 5) |
| 3 | Dashboard-Notification | Wenn Dashboard aktiv (Phase 3) |

### 4.2 Routing-Email (Template)
```
Betreff: [OpsFabric] Neue Anfrage: {intent} — {urgency}

{contact_name} | {contact_phone}
Anfrage: {summary}
Dringlichkeit: {urgency}
Quelle: {source}

→ Dashboard: {dashboard_link}
→ Direkt anrufen: tel:{contact_phone}
```

### 4.3 Eskalation
- Wenn Ticket Status = `NEW` und `created_at + sla_response_minutes` überschritten → Reminder an Betrieb
- Max 1 Reminder pro Ticket

---

## 5) Lifecycle Messaging: Review Engine

### 5.1 Trigger
- Ticket Status wird auf `DONE` gesetzt
- `job_completed_at` wird gesetzt (automatisch bei Status-Wechsel)

### 5.2 Delay
- Review Request nach `job_completed_at + review_delay_hours`
- Default: 2 Stunden
- Konfigurierbar pro Mandant

### 5.3 Guardrails
- Nur senden, wenn `review_request_sent_at` leer ist (einmal pro Ticket)
- Quiet Hours beachten
- Nur senden, wenn Mandant `google_review_link` konfiguriert hat

### 5.4 SMS-Template
```
Danke für Ihren Auftrag bei {Betrieb}. Wenn Sie 30 Sekunden haben, 
freuen wir uns über eine Bewertung: {review_link}
```

### 5.5 Tracking
- `review_request_sent_at` setzen
- Tracking-Link (Redirect via OpsFabric) → `review_clicked = true` setzen
- Redirect zu `google_review_link`

### 5.6 Spätere Erweiterung (nicht Kern)
- Rating-Splitting: 5★ → Google, ≤4★ → internes Feedback-Formular
- NPS-Abfrage vor Review-Link

---

## 6) Error Handling & Fallbacks

| Fehler | Fallback |
|--------|----------|
| SMS nicht zugestellt (Twilio Error) | Log in `ticket_events`, Retry nach 5 Min, max 2 Retries |
| Wizard-Submit schlägt fehl | Client-Side Retry + Fehler-UI ("Bitte nochmal versuchen") |
| Supabase nicht erreichbar | Queue in Edge Function, Retry |
| Twilio Nummer nicht aktiv | E-Mail-Fallback an Betrieb |
| Bestätigung in Quiet Hours | Queue, sende um `quiet_hours_end` |

---

## 7) Datenschutz (DSG / DSGVO)

- Supabase Projekt in **EU-Region** (Frankfurt)
- Telefonnummern werden nur für den definierten Zweck gespeichert
- Consent-Text im Wizard: "Mit dem Absenden stimmen Sie zu, dass {Betrieb} Sie kontaktiert."
- Löschfrist: Tickets nach 24 Monaten Inaktivität anonymisieren
- Kein Tracking über Betriebe hinweg (strikt mandantengetrennt)
- Datenschutzerklärung auf jeder Betriebswebsite (Template bereitstellen)

---

## 8) Reporting

### 8.1 Mandanten-Level (pro Betrieb, monatlich)

| Metrik | Beschreibung |
|--------|-------------|
| Tickets Total | Anzahl neue Tickets |
| Tickets nach Quelle | wizard / missed_call / sms_reply |
| Tickets nach Urgency | LOW / MED / HIGH |
| Captured Rate | Tickets / (Wizard Visits + Missed Calls) |
| First Response Time (Auto) | Ø Zeit bis Bestätigung |
| First Response Time (Human) | Ø Zeit bis Status ≠ NEW |
| 24h Next-Step Rate | % Tickets mit Status-Wechsel innerhalb 24h |
| Review Requests gesendet | Anzahl |
| Review Clicks | Anzahl |
| Review Conversion | Clicks / Requests |

### 8.2 FlowSight-Level (intern, übergreifend)

| Metrik | Beschreibung |
|--------|-------------|
| Active Mandanten | Mandanten mit active=true |
| MRR | Summe aller Pläne |
| Churn Rate | Mandanten lost / total |
| System Uptime | Vercel + Supabase + Twilio |
| SMS Delivery Rate | Delivered / Sent |

---

## 9) Definition of Done

- [ ] Jeder Eingang (Wizard, Missed Call, SMS Reply) erzeugt oder aktualisiert ein Ticket
- [ ] Bestätigungen sind konsistent, dedupliziert, Quiet-Hours-konform
- [ ] Routing ist deterministisch (1 Primary Inbox pro Mandant)
- [ ] Dedupe Key verhindert Doppel-Tickets
- [ ] Review Request feuert als Lifecycle-Event (DONE → T+delay)
- [ ] Error Handling: SMS-Retry, Queue bei Quiet Hours
- [ ] Ticket Events werden geloggt (Audit Trail)
- [ ] Reporting-Queries funktionieren
- [ ] Datenschutz: EU-Region, Consent, Löschfrist
