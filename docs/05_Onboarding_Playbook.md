# OpsFabric — 05 Onboarding Playbook

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

---

## 1) Zweck

Dieses Playbook beschreibt, wie ein neuer Handwerksbetrieb in OpsFabric ongeboardet wird — vom Erstkontakt bis zum Go-Live. Ziel: **jeder Betrieb in <5 Arbeitstagen live**, mit minimalem Aufwand für den Betrieb.

---

## 2) Voraussetzungen (FlowSight-Seite)

Bevor ein Betrieb ongeboardet werden kann, muss stehen:
- [ ] Supabase-Projekt mit Schema (Tabellen, RLS, Edge Functions)
- [ ] Next.js Template (Handwerk) deployt auf Vercel
- [ ] Twilio-Account mit CH-Nummer-Kapazität
- [ ] Onboarding-Checkliste (dieses Dokument)
- [ ] Datenschutzerklärung-Template
- [ ] Vertrag/AGB-Template (Pilot: einfaches Agreement)

---

## 3) Onboarding-Checkliste (vom Betrieb benötigt)

### Pflicht

| # | Was | Beispiel | Wer liefert |
|---|-----|---------|-------------|
| 1 | Firmenname (offiziell) | Dörfler AG | Betrieb |
| 2 | Claim / Slogan | "Ihr Spezialist für Sanitär, Heizung und Spenglerei" | Betrieb oder FlowSight |
| 3 | Adresse | Hubstrasse 30, 8942 Oberrieden | Betrieb |
| 4 | Telefonnummer (Haupt) | +41 43 443 52 00 | Betrieb |
| 5 | E-Mail (Primary Inbox) | info@doerflerag.ch | Betrieb |
| 6 | Leistungen (Top 3–6) | Sanitär, Heizung, Spenglerei, Blitzschutz, Solar, Leitungsbau | Betrieb |
| 7 | Öffnungszeiten | Mo–Fr 08:00–12:00, 13:00–17:00 | Betrieb |
| 8 | Logo (SVG oder PNG, min 500px) | — | Betrieb |
| 9 | Google Business Profil URL | maps.google.com/…/Dörfler+AG | Betrieb (FlowSight sucht) |
| 10 | Google Review Link (Direkt) | search.google.com/local/writereview?placeid=… | FlowSight generiert |
| 11 | Kontaktperson für Rückfragen | Ramon Dörfler, Geschäftsführer | Betrieb |

### Optional (verbessert Qualität)

| # | Was | Beispiel |
|---|-----|---------|
| 12 | Firmengeschichte (kurz) | "Familienbetrieb seit 1926, 3. Generation" |
| 13 | Team-Fotos | Gruppenbild, Porträts |
| 14 | Projekt-Fotos (5–15) | Badsanierung, Heizungseinbau, Dacharbeiten |
| 15 | Zertifikate | Suissetec-Mitglied, Meisterprüfungen |
| 16 | Bestehende Website-URL | www.doerflerag.ch |
| 17 | Bestehende Bewertungen (kuratiert) | "Schnell, sauber, fair" — H. Müller |
| 18 | Notfall-Policy | "Notfälle auch Sa/So bis 18:00" |
| 19 | Service-Gebiet | Bezirk Horgen, Kanton Zürich, Kanton Zug |
| 20 | Wunsch-Domain | doerfler-sanitaer.ch (oder Subdomain) |

---

## 4) Setup-Ablauf (FlowSight intern)

### Tag 1: Daten sammeln & Mandant anlegen
- [ ] Onboarding-Checkliste an Betrieb senden (oder gemeinsam ausfüllen)
- [ ] Mandant in `customers`-Tabelle anlegen
- [ ] Domain/Subdomain konfigurieren (Vercel)
- [ ] Twilio-Nummer bestellen und zuweisen

### Tag 2–3: Website bauen
- [ ] Template klonen und Betriebsdaten einfügen
- [ ] Above-the-Fold: Claim, Proof, CTAs
- [ ] Leistungsseiten erstellen
- [ ] Wizard konfigurieren (Kategorien anpassen)
- [ ] Fotos einpflegen (Hero, Galerie)
- [ ] Datenschutz + Impressum generieren
- [ ] SEO: Title Tags, Meta, Schema.org

### Tag 3–4: Ops-Setup
- [ ] Twilio Forwarding einrichten (→ Betriebsnummer)
- [ ] Missed Call Webhook testen
- [ ] SMS-Templates für Betrieb anpassen
- [ ] Bestätigungs-Templates anpassen
- [ ] Routing-Email testen
- [ ] Review-Link konfigurieren

### Tag 4–5: Test & Go-Live
- [ ] End-to-End Test: Wizard Submit → Ticket → Bestätigung → Routing
- [ ] End-to-End Test: Missed Call → SMS → Reply → Ticket → Bestätigung
- [ ] Mobile Test (iPhone + Android)
- [ ] Lighthouse Check (>90)
- [ ] Demo mit Betrieb (15 Min Screenshare)
- [ ] Go-Live: DNS umstellen / Subdomain aktivieren
- [ ] Betrieb informiert Kunden über neue Nummer (falls Twilio-Front)

---

## 5) Übergabe an Betrieb

### Was der Betrieb wissen muss (Kurz-Briefing, 15 Min)
1. "Ihre neue Website ist live unter {URL}"
2. "Anfragen kommen als E-Mail an {email} — mit allen Details"
3. "Verpasste Anrufe bekommen automatisch eine SMS"
4. "Wenn ein Auftrag erledigt ist, setzen Sie den Status auf DONE im Dashboard — dann fragt das System automatisch nach einer Google-Bewertung"
5. "Bei Fragen: rufen Sie mich an / WhatsApp"

### Was der Betrieb NICHT tun muss
- Keine Software installieren
- Kein Login nötig (erst ab Phase 3 mit Dashboard)
- Kein Content pflegen
- Nichts konfigurieren

---

## 6) Post-Go-Live (Woche 1–2)

- [ ] Tag 1: Check ob Tickets reinkommen
- [ ] Tag 3: Kurzer Call mit Betrieb: "Läuft alles?"
- [ ] Woche 1: Erste Metriken prüfen (Tickets, SMS, Replies)
- [ ] Woche 2: Mini-Report an Betrieb: "X Anfragen erfasst, Y Missed Calls recovered"
- [ ] Feedback sammeln: Was fehlt? Was nervt?

---

## 7) Skalierung: Onboarding-Wizard (Phase 4)

Ab Mandant #3 soll das Onboarding teilautomatisiert sein:
- FlowSight-interner Wizard (eat your own dogfood)
- Betrieb füllt Formular aus → Daten landen in `customers`
- Template wird automatisch geklont und Variablen ersetzt
- FlowSight prüft, passt an, deployt

Ziel: Onboarding-Zeit von 5 Tagen auf **2 Tage** reduzieren.

---

## 8) Pilot-Vertrag (Template, minimal)

Für den Pilot-Betrieb (Dörfler AG) reicht ein einfaches Agreement:

```
OpsFabric Pilot-Vereinbarung

Zwischen: FlowSight GmbH und {Betrieb}
Laufzeit: 3 Monate ab Go-Live
Kosten: CHF 0 (Pilotphase)

FlowSight liefert:
- Conversion-optimierte Website
- Automatisiertes Anfrage-Management
- Missed-Call-Recovery
- Review-Anfrage nach Auftragsabschluss
- Monatliches Reporting

{Betrieb} liefert:
- Firmendaten gemäss Onboarding-Checkliste
- Ehrliches Feedback (mind. 1× monatlich)
- Testimonial/Referenz bei Zufriedenheit
- Weiterleitung der Telefonnummer (falls benötigt)

Datenschutz: Gemäss separater Datenschutzerklärung.
Kündigung: Jederzeit mit 14 Tagen Frist.
```
