# OpsFabric — 03 Säule 1: Website Conversion & Intake System

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

> **Interlock:** Säule 1 nutzt den **Shared Ops Layer** (02) für Ticketing, SLA, Routing und Lifecycle Messaging.

---

## 1) Ziel

Säule 1 ist kein "Website-Redesign" — es ist ein **Conversion- und Intake-System**, das:
- Vertrauen in <10 Sekunden aufbaut (Proof)
- Den richtigen nächsten Schritt erzwingt (CTA-Policy)
- Anfragen vollständig erfasst (Wizard statt Kontaktformular)
- Sofort bestätigt (SLA) und intern strukturiert weitergibt (Ticket)

### Output-KPIs (messbar)

| KPI | Ziel |
|-----|------|
| Captured Rate | >95% Web-Anfragen landen als Ticket |
| First Response Time (Auto) | <5 Minuten (Bestätigung) |
| 24h Next-Step Rate | >80% Tickets bekommen nächsten Schritt |
| Wizard Completion Rate | >60% der Gestarteten schliessen ab |
| Mobile Usability | 100% (Mobile-first Design) |

---

## 2) Seiten-Blueprint

### Minimum Set (MVP)

| Seite | Zweck |
|-------|-------|
| **Homepage** | Above-the-fold → Vertrauen + CTA |
| **Leistungen** (Übersicht) | Was der Betrieb macht, mit Verlinkung zu Details |
| **Leistung-Detail** (2–6 Seiten) | Top-Angebote, jeweils mit eigenem CTA |
| **Anfrage/Wizard** | Primärer Intake-Flow |
| **Kontakt** | Telefon, Adresse, Karte, Öffnungszeiten |
| **Datenschutz** | DSG-konform |
| **Impressum** | Pflicht CH |

### Optional (Phase 2+)
- Referenzen / Galerie (Projekt-Fotos)
- Team-Seite
- FAQ
- Notfall-Seite (Sanitär Notfall → urgency=HIGH)

---

## 3) Above-the-Fold (universell)

Jede Seite hat ein konsistentes Above-the-Fold. Muss enthalten:

**1. Claim:** Was + für wen + wo
Beispiel: *"Ihr Sanitär- und Heizungsspezialist in Oberrieden — seit 1926"*

**2. Top 3 Nutzenpunkte** (Outcomes, nicht Features)
- "Notfall-Service am selben Tag"
- "Offerte innerhalb 48 Stunden"
- "100% transparent — keine versteckten Kosten"

**3. Proof-Block** (Bewertungen/Trust)
- Google-Sterne + Anzahl + Snippet
- Suissetec-Mitglied Badge
- "Seit X Jahren in Oberrieden"

**4. 2 CTAs** (Primary + Secondary)

### CTA-Policy (Handwerk)

| CTA | Typ | Ziel | Wann |
|-----|-----|------|------|
| **"Jetzt anrufen"** | Primary | `tel:+41434435200` | Mobile: Click-to-Call |
| **"Notfall melden"** | Primary (Variante) | Wizard Flow A (urgency=HIGH) | Nur auf Notfall-Seiten |
| **"Anfrage starten"** | Secondary | Wizard Flow B/C | Immer sichtbar |

**Regel:** Pro Screen maximal 1 dominanter CTA. Kein CTA-Overload.

---

## 4) Proof-System

### Minimum (Stufe 1 — MVP)
- **Google Sterne:** Ø Rating + Anzahl Reviews (statisch, manuell aktualisiert)
- **Review Highlights:** 2–4 kuratierte Zitate (Text, anonymisiert oder mit Vorname)
- **Link zur Quelle:** "Alle X Bewertungen auf Google ansehen"
- **Zertifikat:** Suissetec-Mitglied (Logo + Verlinkung)
- **Historie:** "Familienbetrieb seit 1926 — 3. Generation"

### Dynamisch (Stufe 2 — Phase 3+)
- Cron-Job (1×/Woche) fetcht Google Rating + Count
- Speichert als JSON in Supabase
- Website rendert aus JSON (kein Live-API-Call beim Page View)
- Highlights bleiben kuratiert (Qualitätskontrolle)

### Proof-Daten Dörfler AG (recherchiert)
- Google: **4.7★** bei **3 Bewertungen** (Stand Feb 2026)
- local.ch: **5.0★** bei **2 Bewertungen**
- Suissetec-Mitglied: ✅
- Gegründet: **1926** (100 Jahre!)
- 3. Generation: Ramon & Luzian Dörfler
- Meisterprüfungen: Sanitär (Ramon, 2002), Heizungsmonteur (Luzian)
- Standort: durchgängig Oberrieden

---

## 5) Intake: Wizard statt Formular

### Warum Wizard (Default)?
- Bessere Datenqualität (geführt, nicht frei)
- Weniger Ping-Pong mit Kunden
- Foto/Medien-Upload möglich
- Keine Halluzinations-/Beratungsrisiken (kein AI-Chat)
- Kein zusätzliches SaaS nötig

### Wizard-Flows (Handwerk)

**Flow A — Notfall / Sofort (urgency=HIGH)**
1. Was ist passiert? → Dropdown (Rohrbruch / Heizung ausgefallen / Verstopfung / Anderes)
2. Name
3. Telefon
4. Adresse/PLZ
5. Optional: Foto
→ Ticket urgency=HIGH → Bestätigung "Wir melden uns sofort"

**Flow B — Standard-Anfrage (urgency=MED)**
1. Was brauchen Sie? → Kategorie (Sanitär / Heizung / Spenglerei / Blitzschutz / Solar / Anderes)
2. Beschreibung (kurz, max 300 Zeichen)
3. Name
4. Telefon oder E-Mail
5. PLZ / Ort
6. Wann? → ASAP / diese Woche / nächste Woche / flexibel
7. Foto optional
→ Ticket urgency=MED

**Flow C — Offerte / Projekt (urgency=LOW)**
1. Kategorie (wie Flow B)
2. Was genau? → Dropdown (Badsanierung / Heizungsersatz / Neuinstallation / Anderes)
3. Beschreibung (bis 500 Zeichen)
4. Name
5. Telefon + E-Mail
6. Adresse
7. Zeitrahmen → diesen Monat / in 3 Monaten / dieses Jahr / nur informieren
8. Fotos (bis 5, empfohlen)
9. Budget-Rahmen → optional (unter 5k / 5–15k / 15–50k / über 50k / keine Angabe)
→ Ticket urgency=LOW, intent=offerte

### Wizard UX-Regeln
- Mobile-first: grosse Buttons, kein Tippen wo möglich
- Fortschrittsbalken: "Schritt 2 von 5"
- Zurück-Button auf jedem Schritt
- Foto-Upload: Kamera direkt öffnen (Mobile) oder Drag & Drop (Desktop)
- Danke-Screen nach Submit: Bestätigung + "Wir melden uns bis {SLA-Zeit}" + optional Google-Review-Link

---

## 6) SEO-Grundlagen (Handwerk / lokal)

| Element | Umsetzung |
|---------|-----------|
| Title Tag | "{Leistung} in {Ort} — {Betrieb}" |
| Meta Description | Claim + CTA + Ort |
| H1 | Einmal pro Seite, enthält Leistung + Ort |
| Schema.org | LocalBusiness + Service + AggregateRating |
| Google Business Profil | Verlinkt auf neue Website |
| Sitemap | Auto-generiert (Next.js) |
| Performance | Lighthouse >90 (Vercel Edge) |

---

## 7) Technische Umsetzung

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel (auto-deploy von main)
- **Wizard State:** React useState (kein externer State-Manager)
- **Foto-Upload:** Supabase Storage (presigned URLs)
- **Ticket-Erstellung:** Supabase Edge Function (POST /api/ticket)
- **SMS-Bestätigung:** Twilio API (getriggert von Edge Function)
- **Domain:** `doerfler.flowsight.ch` oder eigene Domain des Betriebs

---

## 8) Definition of Done (Säule 1)

- [ ] Above-the-fold erfüllt §3 (Claim, Proof, CTAs)
- [ ] Proof sichtbar + Link zur Quelle
- [ ] Leistungsseiten mit korrekten CTAs
- [ ] Wizard ersetzt Kontaktformular (Flows A/B/C)
- [ ] Foto-Upload funktioniert
- [ ] Jede Anfrage erzeugt Ticket + Bestätigung
- [ ] Mobile-first, Lighthouse >90
- [ ] Keine Console Errors
- [ ] Datenschutz + Impressum vorhanden
- [ ] Schema.org Markup korrekt
