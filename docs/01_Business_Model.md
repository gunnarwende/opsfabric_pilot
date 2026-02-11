# OpsFabric — 01 Business Model

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

---

## 1) Was ist OpsFabric?

OpsFabric ist ein Produkt der FlowSight GmbH, das lokalen Handwerksbetrieben ein schlüsselfertiges **Conversion- und Betriebssystem** liefert. Kein CRM, keine Marketing-Agentur, kein Website-Baukasten — sondern ein integriertes System, das dafür sorgt, dass **kein Auftrag verloren geht**.

**Kernversprechen:** Jeder Anruf, jede Anfrage wird erfasst, bestätigt und nachverfolgt — automatisch, zuverlässig, ohne dass der Betrieb sein Verhalten ändern muss.

---

## 2) Zielmarkt (Pilot)

### Branche
Handwerk: Sanitär, Heizung, Spenglerei, Elektro, Schreiner, Maler

### Warum Handwerk zuerst?
- Hohes Anrufvolumen, Monteure sind unterwegs → viele verpasste Anrufe
- Offerten brauchen Fotos/Details → Wizard löst echtes Problem
- Hoher Auftragswert (CHF 500–50'000) → ROI leicht darstellbar
- Zahlungsbereitschaft für funktionierende Lösung: CHF 200–500/Mt. ist nichts
- Lokale Mundpropaganda: "Was hat der Dörfler da?" → Nachbar-Effekt

### Geografie (Pilot)
Zürichsee-Süd / linkes Ufer: Oberrieden, Horgen, Thalwil, Kilchberg, Adliswil, Langnau a.A., Wädenswil. Einzugsgebiet: ~50'000 Einwohner, hunderte lokale Betriebe.

### Idealprofil Pilotbetrieb
- 2–15 Mitarbeiter
- Bestehende Website (veraltet oder schwach konvertierend)
- Telefon als primärer Eingangskanal
- Inhaber/Geschäftsführer als Ansprechpartner
- Bereit für ehrliches Feedback

---

## 3) Produkt-Pakete & Pricing

### Pilot (1 Betrieb — Dörfler AG)
- **Preis:** Kostenlos
- **Gegenleistung:** Ehrliches Feedback, Testimonial, Case Study
- **Laufzeit:** 3 Monate
- **Umfang:** Vollausbau (Website + Missed Call + Dashboard + Reviews)

### Starter — CHF 249/Mt.
- Website (Säule 1): Conversion-optimiert, Mobile-first
- Wizard-Intake mit Foto-Upload
- Automatische Bestätigung (SMS)
- E-Mail-Routing an Betrieb
- Monatliches Reporting (PDF/Dashboard)

### Pro — CHF 399/Mt.
- Alles aus Starter +
- Missed Call Recovery (SMS, später WhatsApp)
- Betriebsdashboard (Ticket-Übersicht, Status ändern)
- Review Engine (automatische Google-Review-Anfrage nach Auftrag)
- Erweitertes Reporting (FRT, Conversion Rates, Kanalvergleich)

### Premium — CHF 549/Mt. (Phase 5+)
- Alles aus Pro +
- WhatsApp Business Integration (Intake + Bestätigung)
- Retention-Flows (Wiederkontakt nach 6/12 Monaten)
- Saisonale Kampagnen-Templates
- Priority Support

### Setup-Gebühr
- **Pilot:** CHF 0
- **Starter/Pro:** CHF 490 einmalig
- **Premium:** CHF 790 einmalig

---

## 4) Unit Economics

### Kosten pro Mandant (laufend)
| Posten | Monatlich |
|--------|-----------|
| Supabase (anteilig, Free-Tier bis ~10 Mandanten) | CHF 0–5 |
| Vercel (anteilig, Free-Tier bis ~10 Mandanten) | CHF 0–3 |
| Twilio SMS (~50 SMS/Mt. à CHF 0.07) | CHF 3.50 |
| Twilio Nummer (CH) | CHF 5 |
| Domain/Subdomain (anteilig) | CHF 1 |
| **Total Infrastruktur** | **~CHF 10–15** |

### Marge pro Mandant
| Paket | Umsatz | Kosten | Marge | Marge % |
|-------|--------|--------|-------|---------|
| Starter | CHF 249 | CHF 12 | CHF 237 | 95% |
| Pro | CHF 399 | CHF 15 | CHF 384 | 96% |
| Premium | CHF 549 | CHF 20 | CHF 529 | 96% |

### Skalierungs-Szenarien (Monthly Recurring Revenue)
| Mandanten | Ø Paket | MRR | Jährlich |
|-----------|---------|-----|----------|
| 5 | CHF 349 | CHF 1'745 | CHF 20'940 |
| 10 | CHF 349 | CHF 3'490 | CHF 41'880 |
| 25 | CHF 399 | CHF 9'975 | CHF 119'700 |
| 50 | CHF 399 | CHF 19'950 | CHF 239'400 |

### Break-Even
- Fixkosten FlowSight (geschätzt): CHF 500/Mt. (Infra + Tools + Domain)
- Break-Even: **2 Mandanten** à Pro-Paket

---

## 5) Go-to-Market (Pilot-Phase)

### Akquise-Strategie: "Show, Don't Tell"
Kein Cold Calling, kein Ads-Budget. Stattdessen:

**Schritt 1 — Dörfler AG als Showcase (Woche 1–6)**
- Kostenloser Pilot, volles System
- Ergebnis: Live-Website, messbarer Impact, Testimonial

**Schritt 2 — "Ich zeige dir, was du verpasst" (Woche 4+)**
- Anderen Betrieben in Oberrieden/Horgen anbieten: 2 Wochen Missed-Call-Tracking gratis
- Daten zeigen (X Anrufe verpasst, Y nicht zurückgerufen)
- Dann OpsFabric-Lösung anbieten

**Schritt 3 — Nachbar-Effekt (Woche 6+)**
- Dörfler AG Website als Referenz
- "Die haben jetzt X% weniger verlorene Anfragen"
- Lokale Handwerker sehen es, fragen nach

**Schritt 4 — Suissetec / Branchenverband (Monat 3+)**
- Dörfler AG ist Suissetec-Mitglied
- Case Study an regionale Sektion senden
- Vortrag/Workshop bei Verbandsanlass anbieten

### Verkaufs-Assets (zu erstellen)
- 1-Pager: "Was OpsFabric für Ihren Betrieb tut" (PDF)
- Live-Demo: Dörfler AG Website
- ROI-Rechner: "Bei X verpassten Anrufen/Monat = Y verlorener Umsatz"
- Testimonial: Zitat/Video von Dörfler AG (nach Pilot)

---

## 6) Wettbewerb & Positionierung

### Was existiert?
- **Website-Agenturen** (Webflow, WordPress): Bauen Seiten, kein Ops-System
- **CRM-Tools** (HubSpot, Pipedrive): Zu komplex für 5-Mann-Betrieb
- **Chatbots** (Tidio, Intercom): Halluzinationsrisiko, kein Wizard
- **Scheduling Tools** (Calendly, SimplyBook): Nur Terminbuchung, kein Intake
- **Telefonlösungen** (Moneypenny, Ruby): Teuer, generisch

### OpsFabric-Differenzierung
- **Integriert:** Website + Missed Call + Ticketing + Reviews in einem System
- **Deterministisch:** Kein AI-Chat, keine Halluzination — kuratierte Wizards
- **Lokal:** Auf Schweizer KMU zugeschnitten (Sprache, Normen, Suissetec)
- **Wartungsarm:** Betrieb muss nichts lernen, nichts pflegen
- **Messbar:** Jede Interaktion wird zum Ticket → Reporting aus Tag 1

---

## 7) Risiken & Mitigations

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Betrieb sieht keinen Wert | Mittel | Hoch | Missed-Call-Daten als Beweis zeigen |
| Churn nach 3 Monaten | Mittel | Hoch | Review Engine + Reporting machen Wert sichtbar |
| Twilio SMS-Zustellung CH | Niedrig | Mittel | Sender-ID korrekt, Fallback WhatsApp |
| Konkurrenz kopiert | Niedrig | Mittel | Lokaler Vorsprung, Beziehung > Technologie |
| Skalierung FlowSight (1 Person) | Hoch | Hoch | Mandantenfähigkeit + Onboarding-Wizard ab Phase 4 |
| Datenschutz (DSG/DSGVO) | Mittel | Hoch | Supabase EU-Region, Consent im Wizard, Datenschutzerklärung |

---

## 8) Erfolgsmetriken (FlowSight-Level)

| KPI | Ziel (6 Monate) |
|-----|-----------------|
| Live-Mandanten | 5–10 |
| MRR | CHF 2'000–4'000 |
| Churn Rate | <10% monatlich |
| NPS (Betriebe) | >50 |
| Captured Rate (Ø über alle Mandanten) | >90% |
| Review Requests gesendet/Monat | >20 |
