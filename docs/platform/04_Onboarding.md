# OpsFabric — Kunden-Onboarding

## Onboarding-Ziel

Neuen Betrieb in **30 Minuten** konfigurieren und live schalten.

## Voraussetzungen

### Pflichtangaben
| Feld | Beispiel | Woher? |
|------|----------|--------|
| Firmenname | Dörfler AG | Kunde |
| Slug | doerfler-ag | Generiert aus Name |
| Telefon (E.164) | +41434435200 | Kunde |
| E-Mail | info@doerflerag.ch | Kunde |
| Adresse | Hubstrasse 30, 8942 Oberrieden | Kunde |
| Services (min. 1) | Sanitär, Heizung, Spenglerei | Kunde |
| Google Review-Link | https://g.page/... | Google My Business |
| Plan | starter, pro, premium | Vertrag |

### Optionale Angaben
| Feld | Default |
|------|---------|
| SMS-Nummer | null (nutzt System-Default) |
| Website-Domain | {slug}.flowsight.ch |
| Quiet Hours Start | 21:00 |
| Quiet Hours End | 07:00 |
| SLA Response (Min.) | 120 |
| Review Delay (Std.) | 2 |
| Timezone | Europe/Zurich |
| Logo-URL | null |
| Gründungsjahr | null |
| Google Rating | null |
| Zertifizierungen | [] |

## Onboarding-Prozess

### Schritt 1: Kundendaten sammeln (Tag 1)
- Checkliste an Kunden senden (Pflichtangaben oben)
- Google My Business Profil prüfen → Review-Link extrahieren
- Domain klären ({slug}.flowsight.ch oder eigene Domain)

### Schritt 2: System-Setup (30 Minuten)
```bash
# Option A: Onboarding-Script
npx tsx scripts/onboard-customer.ts

# Option B: Manuell
# 1. INSERT INTO customers via Supabase SQL Editor
# 2. Config JSONB mit Services, Intents, Reviews befüllen
# 3. Env vars in Vercel aktualisieren (falls nötig)
```

### Schritt 3: Website konfigurieren (2-4 Stunden, falls Modul aktiv)
- Hero-Texte anpassen (Claim, Subclaim, Benefits)
- Services mit Beschreibungen, Features, Icons
- Review-Highlights (3-5 echte Google-Bewertungen)
- Fotos einbinden (Hero, Services, Team)
- Datenschutz/Impressum generieren (Mandant-Variablen)

### Schritt 4: Testen (30 Minuten)
- [ ] Website erreichbar unter /{slug}/
- [ ] Wizard: Test-Anfrage absenden → Ticket in DB?
- [ ] SMS: Bestätigung erhalten? (SMS_PROVIDER=console → Logs prüfen)
- [ ] Missed-Call: Test-Webhook senden → SMS + Ticket?
- [ ] Review: Ticket auf DONE setzen → Review-SMS nach Delay?

### Schritt 5: Go-Live
- [ ] DNS konfigurieren (falls eigene Domain)
- [ ] SMS-Provider auf Produktion umschalten (eCall.ch)
- [ ] CRON_SECRET setzen in Vercel
- [ ] Kunden einweisen (15 Min Call)

## Customer Config JSONB — Vollständiges Beispiel

```json
{
  "address": "Hubstrasse 30",
  "plz": "8942",
  "ort": "Oberrieden",
  "contact_person": "Ramon Dörfler",
  "founded_year": 1926,
  "generation": "3. Generation",
  "opening_hours": "Mo–Fr 08:00–12:00, 13:00–17:00",
  "google_rating": 4.7,
  "google_review_count": 3,
  "certifications": ["Suissetec-Mitglied"],
  "modules": {
    "website": true,
    "wizard": true,
    "missed_call": true,
    "review_engine": true,
    "sms": true
  },
  "services": [
    {
      "slug": "sanitaer",
      "name": "Sanitär",
      "description": "Badsanierungen, Installationen, Rohrreinigung",
      "features": ["Badsanierung", "Rohrreinigung", "Entkalkung"],
      "icon": "droplets"
    }
  ],
  "intents": [
    {
      "slug": "sanitaer_notfall",
      "label": "Sanitär-Notfall",
      "service": "sanitaer",
      "urgency": "HIGH"
    }
  ],
  "reviews": [
    {
      "author": "M. Keller",
      "rating": 5,
      "text": "Schnell, sauber, fair.",
      "source": "Google"
    }
  ],
  "hero": {
    "claim": "Ihr Fachbetrieb seit 1926",
    "subclaim": "Sanitär, Heizung und Spenglerei",
    "benefits": ["24/7 Notdienst", "Festpreisgarantie", "Meisterbetrieb"]
  }
}
```

## Branchen-Templates

Für schnelleres Onboarding gibt es vorkonfigurierte Templates:

### Handwerk
- Services: Sanitär, Heizung, Spenglerei, etc.
- Intents: Notfall, Reparatur, Wartung, Offerte
- Wizard: Flow A (Notfall), B (Standard), C (Offerte)

### Gastro
- Services: Restaurant, Bar, Catering, Events
- Intents: Reservierung, Privatanlass, Catering-Anfrage
- Wizard: Flow B (Reservierung), C (Event-Anfrage)

### Beauty & Wellness
- Services: Schnitt, Färben, Massage, Kosmetik
- Intents: Termin, Beratung, Gutschein
- Wizard: Flow B (Termin), C (Beratung)

### Allgemein
- Services: Konfigurierbar
- Intents: Anfrage, Offerte, Kontakt
- Wizard: Flow B (Standard), C (Offerte)
