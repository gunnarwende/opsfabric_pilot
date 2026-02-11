# OpsFabric — 04 Säule 2: Missed Call Recovery

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

> **Interlock:** Säule 2 nutzt den **Shared Ops Layer** (02) für Ticketing, SLA, Routing und Dedupe.  
> Option 3 führt in den **Wizard** (Säule 1, 03) → vereinheitlichte Datenerfassung.

---

## 1) Ziel

Verpasste Telefonanrufe werden nicht zu verlorenen Aufträgen.

**Kern-Outcomes:**
- Auto-Reaktion innerhalb 30–60 Sekunden nach Missed Call
- Antworten/Klicks werden zu strukturierten Tickets
- Dedupe/Throttle verhindert Spam
- Betrieb verpasst keine Chance, auch wenn er auf dem Dach steht

### KPIs

| KPI | Ziel |
|-----|------|
| SMS-Versand nach Missed Call | <60 Sekunden |
| Reply Rate (1/2/3) | >30% |
| Ticket-Erstellung bei Reply | 100% |
| False Positive (Spam/Robocall → SMS) | <5% |

---

## 2) Architektur-Flow

```
Anrufer → Betriebsnummer (Twilio) → Nicht abgenommen
                                         │
                                    [30–60s Delay]
                                         │
                                    SMS an Anrufer
                                    "Danke für Ihren Anruf..."
                                    1 = Dringend
                                    2 = Rückruf
                                    3 = Anfrage mit Details
                                         │
                              ┌──────────┼──────────┐
                              │          │          │
                         Reply "1"  Reply "2"  Reply "3" / Klick
                              │          │          │
                         Ticket       Ticket     Wizard-Link
                         HIGH         CALLBACK   → Säule 1
                              │          │          │
                              └──────────┴──────────┘
                                         │
                                  Bestätigung + Routing
                                  (Shared Ops Layer)
```

---

## 3) Trigger & Timing

| Parameter | Wert | Konfigurierbar |
|-----------|------|---------------|
| Trigger | Missed Call Event (Twilio: `CallStatus=no-answer` oder `busy`) | Nein |
| Delay vor SMS | 30–60 Sekunden | Ja, pro Mandant |
| Quiet Hours | 21:00–07:00 (Default) | Ja, pro Mandant |
| Dedupe Window | 15 Minuten (gleiche Nummer → keine zweite SMS) | Ja |
| Wochenend-Policy | SMS senden, aber Rückruf-SLA anpassen | Ja |

### Twilio-Setup
- Pro Mandant: 1 Twilio-Nummer (Schweiz: +41 Nummer)
- Anrufe werden an Betriebsnummer weitergeleitet (Forwarding)
- Wenn nicht abgenommen → Webhook an OpsFabric API
- API prüft Dedupe → sendet SMS

---

## 4) SMS-Template

### Standard (Handwerk)
```
Danke für Ihren Anruf bei {Betrieb}. 
Wir sind gerade im Einsatz.

Antworten Sie mit:
1 = Dringend / Notfall
2 = Rückruf gewünscht
3 = Anfrage mit Details senden

Oder rufen Sie nochmals an: {phone}
```

### Regeln
- Max 160 Zeichen (1 SMS-Segment) wenn möglich, sonst max 2 Segmente
- Optionen 1/2/3 bleiben branchenübergreifend gleich
- Betriebsname wird eingefügt
- Rückruf-Nummer am Ende

---

## 5) Antwortlogik (deterministisch)

| Antwort | Aktion | Ticket-Werte | Bestätigung |
|---------|--------|-------------|-------------|
| "1" | Ticket erstellen | urgency=HIGH, status=NEW | "Verstanden — dringend. {Betrieb} meldet sich sofort." |
| "2" | Ticket erstellen | urgency=MED, status=NEEDS_CALLBACK | "Rückruf notiert. {Betrieb} ruft bis {SLA} zurück." |
| "3" oder Link-Klick | Wizard-Link senden | (noch kein Ticket — Wizard erstellt es) | "Hier können Sie Ihre Anfrage mit Foto senden: {wizard_link}" |
| Freitext (nicht 1/2/3) | Ticket erstellen mit Freitext in summary | urgency=MED, status=NEW | "Danke, Ihre Nachricht ist eingegangen. {Betrieb} meldet sich bis {SLA}." |
| Keine Antwort | Kein Follow-up | — | — |

### Wizard-Link (Option 3)
- URL: `{website_domain}/anfrage?ref=missed_call&phone={normalized_phone}`
- Wizard erkennt Quelle (source=missed_call) und vorausgefüllte Telefonnummer
- Wizard erstellt Ticket mit source=missed_call

---

## 6) Dedupe & Throttle

### SMS-Dedupe
- **Key:** `customer_id + normalized_phone`
- **Window:** 15 Minuten
- **Logik:** Wenn in den letzten 15 Min bereits eine Missed-Call-SMS an diese Nummer ging → nichts tun

### Ticket-Dedupe
- Nutzt Shared Ops Layer Dedupe (§2.4 in 02_Shared_Ops_Layer.md)
- Wenn offenes Ticket für gleiche Nummer + gleicher Tag existiert → Update statt neues Ticket

### Throttle (pro Nummer/Tag)
- Max 3 Missed-Call-SMS pro Nummer pro Tag
- Danach: kein SMS mehr, nur noch Log in ticket_events

---

## 7) Rufumleitung & Nummern-Strategie

### Option A: Twilio als Front-Nummer (empfohlen für Pilot)
- Betrieb kommuniziert Twilio-Nummer als Hauptnummer
- Twilio leitet an echte Betriebsnummer weiter
- Bei Nicht-Abheben: Missed Call Event → SMS
- Vorteil: Volle Kontrolle, kein Eingriff beim Betrieb nötig
- Nachteil: Neue Nummer kommunizieren

### Option B: Carrier-Weiterleitung (spätere Phase)
- Betrieb behält bestehende Nummer
- Bei Nicht-Abheben: Carrier leitet an Twilio weiter
- Twilio erkennt Missed Call → SMS
- Vorteil: Bestehende Nummer bleibt
- Nachteil: Abhängig von Carrier-Konfiguration

### Pilot Dörfler AG: Option A
- Neue Twilio-Nummer: +41 43 XXX XX XX
- Weiterleitung an: +41 43 443 52 00
- Auf neuer Website prominent platziert

---

## 8) Error Handling

| Fehler | Handling |
|--------|---------|
| SMS-Zustellung fehlgeschlagen | Retry nach 2 Min, max 2 Retries, Log in ticket_events |
| Twilio Webhook nicht erreichbar | Twilio Retry-Policy (3x), Alert an FlowSight |
| Anrufer-Nummer unterdrückt | Kein SMS möglich → Log only |
| Anrufer-Nummer ist Festnetz (kein SMS) | Erkennung via Twilio Lookup → kein SMS, Log only |
| Spam-Erkennung | Wenn >5 Missed Calls von gleicher Nummer/Tag → Blocklist |

---

## 9) Reporting (Monatlich, pro Mandant)

| Metrik | Beschreibung |
|--------|-------------|
| Inbound Calls Total | Alle Anrufe über Twilio-Nummer |
| Missed Calls | Nicht abgenommene Anrufe |
| Missed Call Rate | Missed / Total |
| Auto-SMS gesendet | Anzahl Missed-Call-SMS |
| Reply Rate | Replies / SMS gesendet |
| Replies nach Option | 1 (Notfall) / 2 (Rückruf) / 3 (Wizard) / Freitext |
| Wizard Submissions via Missed Call | Tickets mit source=missed_call |
| Recovery Rate | Tickets aus Missed Calls / Missed Calls Total |

---

## 10) Definition of Done (Säule 2)

- [ ] Twilio-Nummer eingerichtet und Weiterleitung aktiv
- [ ] SMS-Versand <60s nach Missed Call
- [ ] Dedupe funktioniert (15-Min-Window)
- [ ] Quiet Hours aktiv
- [ ] Antwort-Parsing korrekt (1/2/3/Freitext)
- [ ] Wizard-Link (Option 3) funktioniert mit source=missed_call
- [ ] Tickets werden erstellt/aktualisiert
- [ ] Bestätigungen werden gesendet
- [ ] Error Handling: Retry, Festnetz-Erkennung, Spam-Schutz
- [ ] Reporting-Queries funktionieren
