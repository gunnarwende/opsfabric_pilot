# OpsFabric — 07 Pilot: Dörfler AG

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

---

## 1) Betriebsprofil

| Feld | Wert |
|------|------|
| Firma | Dörfler AG |
| Rechtsform | AG (CHE-110.607.871) |
| Gegründet | 1926 (100 Jahre!) |
| Geschäftsleitung | Ramon Dörfler (Präsident), Luzian Dörfler (VR-Mitglied) |
| Adresse | Hubstrasse 30, 8942 Oberrieden |
| Telefon | +41 43 443 52 00 |
| Fax | +41 43 443 52 01 |
| E-Mail | info@doerflerag.ch |
| Website (aktuell) | www.doerflerag.ch |
| Zweite Domain | www.sanitaer-heizung-doerfler.ch |
| Öffnungszeiten | Mo–Fr 08:00–12:00, 13:00–17:00 |
| Verband | Suissetec-Mitglied |
| Service-Gebiet | Bezirk Horgen, Kanton Zürich, Kanton Zug |

### Leistungsportfolio
1. **Sanitär** — Installationen, Reparaturen, Badsanierungen, Entkalkungsanlagen, Rohrreinigung, Notfall
2. **Heizung** — Erneuerung, Wärmepumpen, Holzheizung, Kesselsanierung, Fussbodenheizung, Service
3. **Spenglerei** — Dachrinnen, Blechverkleidungen, Kaminverkleidungen, Schneefang, Flachdach
4. **Blitzschutz** — Montage, Messungen, Überspannungsschutz
5. **Solartechnik** — Sonnenkollektoren, Solaranlagen für Heizung und Warmwasser
6. **Leitungsbau** — Hauswasserzuleitungen, Netzwasserleitungen, Bauwasserprovisorien, Rohrbruch
7. **Reparaturservice** — Allgemein, Notfall

### Firmengeschichte
- 1926: Gründung durch Emil Dörfler sen. an der Dörflistrasse 14, Oberrieden
- 1960: Emil Dörfler jun. besteht höhere Fachprüfung als Spengler
- 1964: Emil Dörfler jun. besteht Sanitär-Meisterprüfung
- 1970: Übergabe an Emil Dörfler jun.
- 1988: Umzug in neue Werkstatt an der Hubstrasse 30
- 2002: Ramon Dörfler besteht Sanitär-Meisterprüfung
- 2004: Übergabe an Ramon & Luzian Dörfler (3. Generation)
- Luzian Dörfler: Zusatzlehre als Heizungsmonteur (zweiter Bildungsweg)
- 2007: Erster Mitarbeiter (Sanitärinstallateur) eingestellt

---

## 2) Analyse der aktuellen Website (doerflerag.ch)

### Struktur (aktuell)
| Seite | URL |
|-------|-----|
| Home | / |
| Team | /doerflerag-team.htm |
| Angebot | /doerflerag-angebot.htm |
| Kontakt | /doerflerag-kontakt.htm |
| Links | /doerflerag-links.htm |
| Galerien | Dropdown → 5 Unterseiten |
| Firmengeschichte | /doerflerag-firmengeschichte.htm |
| Fotogalerien | sanitaer, spenglerei, heizung, leitungsbau, solar |

### Stärken
- Inhalte vorhanden (Geschichte, Leistungen, Fotos)
- Telefonnummer prominent
- Suissetec-Logo sichtbar
- Google+ Link (veraltet, aber Absicht erkennbar)
- Projekt-Fotos in Galerien

### Schwächen (OpsFabric-Potenzial)

| Problem | Impact | OpsFabric-Lösung |
|---------|--------|-----------------|
| **Kein Wizard / Kontaktformular** | Kunden können nur anrufen oder mailen | Wizard (Flows A/B/C) |
| **Kein Mobile-first Design** | Alte HTML-Struktur, separate "SmartPhone Version" | Next.js + Tailwind, responsive |
| **Kein Proof-Block** (Above-the-fold) | Bewertungen nicht sichtbar | Google 4.7★ + Highlights + Suissetec |
| **Kein CTA above-the-fold** | Telefonnummer erst unten / seitlich | Primary CTA: Anrufen, Secondary: Anfrage |
| **Kein Missed Call Handling** | Monteure auf dem Dach → Anruf verpasst → Kunde weg | Missed Call Recovery (Säule 2) |
| **Kein Bestätigungs-System** | Kunde weiss nicht ob Anfrage angekommen ist | Auto-SMS Bestätigung |
| **Kein Review-Management** | 3 Google Reviews, 2 local.ch Reviews — sehr wenig für 100 Jahre | Review Engine |
| **Veraltete Technologie** | .htm-Dateien, Tabellen-Layout, Google+ Link | Modern Stack |
| **Kein SEO** | Keine Meta Tags, kein Schema.org, keine H1-Struktur | SEO-Grundlagen (Säule 1, §6) |
| **Kein HTTPS** | Sicherheitswarnung im Browser | Vercel = automatisch HTTPS |

---

## 3) Bewertungs-Situation

| Plattform | Rating | Anzahl | Link vorhanden |
|-----------|--------|--------|---------------|
| Google | 4.7★ | 3 | Ja (via handwerker.ch) |
| local.ch | 5.0★ | 2 | Ja |
| search.ch | — | 0 | — |
| Sanitärvergleich | 5.0★ | 3 | Ja |
| daibau.ch | vorhanden | — | Ja |

**Problem:** Für einen 100-jährigen Betrieb sind 3 Google-Bewertungen extrem wenig. Die Review Engine ist hier ein riesiger Quickwin.

**Ziel nach 6 Monaten OpsFabric:** 15–25 Google Reviews (bei ~2 Review Requests/Woche und 30% Conversion)

---

## 4) Content-Mapping (Alt → Neu)

### Homepage (Above-the-fold)

**Claim:** "Sanitär, Heizung & Spenglerei in Oberrieden — seit 1926"

**Top 3 Nutzenpunkte:**
- "Notfall-Service am selben Tag"
- "Familienbetrieb in 3. Generation — wir kennen jedes Haus"
- "Suissetec-zertifiziert — Qualität mit Garantie"

**Proof:**
- Google 4.7★ (3 Bewertungen) → "Alle Bewertungen ansehen"
- "Seit 1926 in Oberrieden — 100 Jahre Erfahrung"
- Suissetec-Logo
- "Meisterbetrieb — Ramon & Luzian Dörfler"

**CTAs:**
- Primary: "Jetzt anrufen: 043 443 52 00" (Click-to-Call)
- Secondary: "Anfrage starten" → Wizard

### Leistungsseiten

| Seite | Kern-Content (von bestehender Website) | CTA |
|-------|---------------------------------------|-----|
| Sanitär | Installationen, Badsanierung, Rohrreinigung, Notfall, Entkalkung | "Sanitär-Anfrage starten" |
| Heizung | Erneuerung, Wärmepumpen, Holzheizung, Fussbodenheizung, Service | "Heizungs-Anfrage starten" |
| Spenglerei | Dachrinnen, Blech, Kamin, Schneefang, Flachdach | "Spenglerei-Anfrage starten" |
| Blitzschutz & Solar | Blitzableiter, Solaranlagen, Warmwasser | "Beratung anfragen" |
| Leitungsbau | Hauswasser, Netzleitungen, Rohrbruch | "Leitungsbau-Anfrage starten" |
| Notfall | Rohrbruch, Heizung ausgefallen, Verstopfung | "Notfall melden" (urgency=HIGH) |

### Wizard-Konfiguration (Dörfler AG)

**Kategorien (intent):**
- `sanitaer_notfall` — Rohrbruch, Verstopfung, Wasserschaden
- `sanitaer_reparatur` — Spülkasten, Lavabo, WC, Armaturen
- `sanitaer_bad` — Badsanierung, Umbau
- `heizung_notfall` — Heizung ausgefallen
- `heizung_wartung` — Heizungsservice, Kesselsanierung
- `heizung_neu` — Heizungsersatz, Wärmepumpe
- `spenglerei` — Dachrinne, Blech, Kamin
- `blitzschutz` — Blitzableiter, Messung
- `solar` — Solaranlage, Warmwasser
- `leitungsbau` — Hauswasser, Rohrbruch
- `anderes` — Sonstiges

---

## 5) Umsetzungsplan (Tag für Tag)

### Morgen (Tag 1): Grundgerüst
- [ ] GitHub Repo klonen und Next.js + Tailwind aufsetzen
- [ ] Supabase-Projekt: Tabellen erstellen (customers, tickets, ticket_events, sms_log)
- [ ] Seed: Dörfler AG als Mandant in `customers` einfügen
- [ ] Homepage bauen: Above-the-fold mit echtem Dörfler-Content
- [ ] Wizard bauen: Flow B (Standard-Anfrage) mit allen Kategorien
- [ ] API Route: POST /api/ticket → Supabase Insert
- [ ] Lokal lauffähig: `npm run dev` → Website sichtbar

### Tag 2: Ops-Verbindung
- [ ] Twilio-Account anlegen und CH-Nummer bestellen
- [ ] SMS-Bestätigung nach Wizard-Submit
- [ ] Missed Call Webhook (Twilio → API)
- [ ] Missed Call SMS Template
- [ ] Reply-Parsing (1/2/3)
- [ ] Routing-Email an Betrieb

### Tag 3: Polishing & Deploy
- [ ] Leistungsseiten (Content von bestehender Website)
- [ ] Proof-Block (Sterne, Suissetec, Geschichte)
- [ ] Datenschutz + Impressum
- [ ] Mobile Testing
- [ ] Vercel Deploy
- [ ] Subdomain: doerfler.flowsight.ch

### Tag 4: Test & Feedback
- [ ] End-to-End Test aller Flows
- [ ] Lighthouse Check
- [ ] Screenshots / Screenrecording für Präsentation
- [ ] Präsentation vorbereiten für Dörfler AG

---

## 6) Präsentation für Dörfler AG

### Pitch (5 Minuten)
1. "Ich wohne in Oberrieden und habe Ihre Website angeschaut"
2. "Sie haben einen fantastischen Betrieb — 100 Jahre, 3. Generation, Suissetec"
3. "Aber: Wenn Sie auf dem Dach sind und ein Kunde anruft — was passiert?"
4. [Demo: Neue Website auf dem Handy zeigen]
5. [Demo: Wizard ausfüllen → SMS-Bestätigung kommt sofort]
6. "Das System fängt verpasste Anrufe auf, erfasst Anfragen komplett, und fragt nach Auftragsabschluss automatisch nach einer Google-Bewertung"
7. "Ich möchte Ihnen das 3 Monate kostenlos zur Verfügung stellen — als Pilot"

### Was wir zeigen
- Neue Website (mobil + Desktop)
- Wizard durchspielen → SMS kommt an
- Missed Call simulieren → SMS kommt an
- "Stellen Sie sich vor: 3 Bewertungen → 25 Bewertungen in 6 Monaten"

---

## 7) Erfolgskriterien (nach 3 Monaten Pilot)

| Metrik | Ziel |
|--------|------|
| Website live & stabil | ✅ |
| Wizard-Anfragen / Monat | >5 |
| Missed Calls recovered / Monat | >3 |
| Google Reviews (neu) | >8 |
| First Response Time (Auto) | <2 Minuten |
| Betrieb-Zufriedenheit | "Ja, weiterführen" |
| Testimonial erhalten | Ja |
