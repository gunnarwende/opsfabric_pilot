# OpsFabric — Dokumenten-Index

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10  
**Region (Pilot):** Zürichsee-Süd (Oberrieden, Horgen, Thalwil, Kilchberg, Adliswil)  
**Zielbranche (Pilot):** Handwerk — Sanitär, Heizung, Spenglerei  
**Erster Pilotbetrieb:** Dörfler AG, Hubstrasse 30, 8942 Oberrieden  
**Umsetzung:** Claude Code + Claude.ai  
**Stack:** Next.js · Supabase · Twilio · Vercel

---

## Dokumente

| # | Datei | Inhalt | Status |
|---|-------|--------|--------|
| 00 | `00_Index.md` | Dieses Dokument — Übersicht, Abhängigkeiten, Phasenplan | ✅ |
| 01 | `01_Business_Model.md` | Zielmarkt, Pricing, Unit Economics, Go-to-Market | ✅ |
| 02 | `02_Shared_Ops_Layer.md` | Ticket-System, SLA, Routing, Dedupe, Lifecycle Messaging, Review Engine | ✅ |
| 03 | `03_Saule_1_Web_Intake.md` | Website-Blueprint, Wizard, Proof-System, CTA-Policy, Conversion | ✅ |
| 04 | `04_Saule_2_Missed_Call.md` | Missed Call Recovery, SMS/WhatsApp, Antwortlogik, Dedupe | ✅ |
| 05 | `05_Onboarding_Playbook.md` | Checkliste für Betrieb-Onboarding, Setup-Ablauf, Timeline | ✅ |
| 06 | `06_Tech_Architecture.md` | Stack, Datenmodell, API-Routen, Deployment, Accounts | ✅ |
| 07 | `07_Pilot_Doerfler_AG.md` | Analyse Dörfler AG, konkreter Umsetzungsplan, Content-Mapping | ✅ |
| 08 | `08_SMS_Templates.md` | Alle SMS-Texte pro Trigger, Variablen-Referenz, SLA-Berechnung | ✅ |
| 09 | `09_Wizard_UI_Texte.md` | Labels, Platzhalter, Fehlermeldungen, Danke-Screens für Flow A/B/C | ✅ |
| 10 | `10_Rechtliche_Templates.md` | Datenschutzerklärung (DSG), Impressum, ausgefüllt für Dörfler AG | ✅ |

---

## Architektur-Übersicht

```
┌─────────────────────────────────────────────────────────┐
│                   01 Business Model                      │
│           FlowSight GmbH → OpsFabric Produkt             │
│         Pricing · GTM · Unit Economics · Skalierung       │
└────────────┬──────────────────────────┬──────────────────┘
             │                          │
  ┌──────────▼────────────┐  ┌──────────▼────────────────┐
  │  03 Säule 1           │  │  04 Säule 2               │
  │  Website + Wizard     │  │  Missed Call Recovery      │
  │  (Conversion/Intake)  │  │  (SMS → Ticket)            │
  └──────────┬────────────┘  └──────────┬────────────────┘
             │                          │
       ┌─────▼──────────────────────────▼──────┐
       │         02 Shared Ops Layer            │
       │  Ticket · SLA · Routing · Dedupe ·     │
       │  Lifecycle Messaging · Review Engine    │
       └────────────────┬──────────────────────┘
                        │
       ┌────────────────▼──────────────────────┐
       │         06 Tech Architecture           │
       │  Supabase · Twilio · Next.js · Vercel  │
       └────────────────┬──────────────────────┘
                        │
  ┌─────────────────────▼──────────────────────────┐
  │  05 Onboarding Playbook   07 Pilot Dörfler AG  │
  │  (generisch)              (konkret)              │
  └─────────────────────────────────────────────────┘
```

---

## Phasenplan

| Phase | Zeitraum | Lieferung | Abhängigkeit |
|-------|----------|-----------|--------------|
| **Phase 1** | Woche 1–3 | Website + Wizard + Ticket-Backend + Bestätigung (Dörfler AG live) | Supabase, Vercel, GitHub |
| **Phase 2** | Woche 3–4 | Missed Call Recovery (SMS via Twilio) | Twilio-Account + CH-Nummer |
| **Phase 3** | Woche 5–6 | Betriebsdashboard + Review Engine + Reporting | — |
| **Phase 4** | Woche 7–8 | Mandantenfähigkeit + Onboarding-Wizard + 2. Betrieb | 1. Betrieb validiert |
| **Phase 5** | Woche 9–12 | WhatsApp-Kanal + Retention-Flows + Skalierung Region | WhatsApp Business API |

---

## Konventionen

- **Sprache:** Dokumente auf Deutsch, Code auf Englisch
- **Repo:** `opsfabric-pilot` auf GitHub
- **Branch-Strategie:** `main` (prod) + `dev` (Arbeit)
- **Deployment:** Vercel (auto-deploy von `main`)
- **Datenbank:** Supabase (Postgres + Auth + Edge Functions)
- **Mandanten-ID:** `customer_id` durchgängig in jedem Datensatz
