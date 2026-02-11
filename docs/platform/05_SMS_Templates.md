# OpsFabric — 08 SMS & Bestätigungs-Templates

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

> Alle SMS-Texte für OpsFabric — pro Trigger, ausformuliert, mit Variablen.  
> Variablen: `{betrieb}`, `{name}`, `{phone}`, `{sla_zeit}`, `{wizard_link}`, `{review_link}`, `{dashboard_link}`

---

## 1) Missed Call — Erst-SMS (nach 30–60s)

### Standard (Handwerk)
```
Danke für Ihren Anruf bei {betrieb}. Wir sind gerade im Einsatz.

1 = Dringend/Notfall
2 = Rückruf gewünscht
3 = Anfrage mit Details

Oder nochmals anrufen: {phone}
```
**Zeichenanzahl:** ~160 (1 SMS-Segment)

### Variante Wochenende
```
Danke für Ihren Anruf bei {betrieb}. Am Wochenende sind wir eingeschränkt erreichbar.

1 = Notfall (wir melden uns schnellstmöglich)
2 = Rückruf am Montag
3 = Anfrage mit Details

Notfall-Nummer: {phone}
```

---

## 2) Missed Call — Antwort-Bestätigungen

### Antwort "1" (Notfall/Dringend)
```
Verstanden — dringend. {betrieb} meldet sich schnellstmöglich. Bei akuter Gefahr (Wasser/Gas): Bitte Haupthahn schliessen und 118 (Feuerwehr) rufen.
```

### Antwort "2" (Rückruf)
```
Rückruf notiert. {betrieb} ruft Sie bis {sla_zeit} zurück. Falls es dringend wird: {phone}
```

### Antwort "3" oder Link-Klick (Wizard)
```
Hier können Sie Ihre Anfrage mit Foto/Details senden — wir melden uns bis {sla_zeit}: {wizard_link}
```

### Freitext-Antwort (nicht 1/2/3)
```
Danke für Ihre Nachricht. {betrieb} meldet sich bis {sla_zeit} bei Ihnen. Falls dringend: {phone}
```

---

## 3) Wizard — Bestätigung nach Submit

### Standard (urgency=MED/LOW)
```
Danke {name}, Ihre Anfrage bei {betrieb} ist eingegangen. Wir melden uns bis {sla_zeit}. Fragen? {phone}
```

### Notfall (urgency=HIGH)
```
{name}, Ihre Notfall-Meldung ist eingegangen. {betrieb} meldet sich schnellstmöglich. Bei akuter Gefahr: Haupthahn schliessen, 118 rufen.
```

### Offerte/Projekt (urgency=LOW, intent=offerte)
```
Danke {name}, Ihre Offert-Anfrage bei {betrieb} ist eingegangen. Wir prüfen die Details und melden uns bis {sla_zeit} mit einem nächsten Schritt.
```

---

## 4) Status-Updates (vom Betrieb ausgelöst)

### Status → SCHEDULED (Termin vereinbart)
```
Ihr Termin bei {betrieb} ist bestätigt: {termin_datum}, {termin_zeit}. Adresse: {betrieb_adresse}. Fragen? {phone}
```

### Status → IN_PROGRESS (In Bearbeitung)
```
Ihre Anfrage bei {betrieb} wird bearbeitet. Wir melden uns bei Ihnen. Fragen? {phone}
```

---

## 5) Review Request (nach Auftragsabschluss)

### Standard (Delay: +2h nach DONE)
```
Danke für Ihren Auftrag bei {betrieb}! Wenn Sie 30 Sekunden haben — eine Google-Bewertung hilft uns sehr: {review_link}
```

### Variante (persönlicher)
```
Vielen Dank für Ihr Vertrauen, {name}. Waren Sie zufrieden mit unserer Arbeit? Über eine kurze Bewertung würden wir uns freuen: {review_link}
```

---

## 6) Eskalation (SLA überschritten)

### Reminder an Betrieb (intern, per E-Mail)
```
Betreff: [OpsFabric] ⚠️ Ticket #{ticket_id} wartet seit {wartezeit}

Hallo {betrieb_kontakt},

folgendes Ticket wartet seit {wartezeit} auf eine Reaktion:

Kunde: {contact_name} ({contact_phone})
Anfrage: {summary}
Dringlichkeit: {urgency}
Eingegangen: {created_at}

→ Im Dashboard öffnen: {dashboard_link}
→ Direkt anrufen: tel:{contact_phone}

Bitte schnellstmöglich bearbeiten.

— OpsFabric
```

---

## 7) Template-Regeln

| Regel | Beschreibung |
|-------|-------------|
| **Länge** | SMS max 160 Zeichen (1 Segment) wenn möglich, max 320 (2 Segmente) |
| **Ton** | Professionell, kurz, freundlich — kein Marketing-Sprech |
| **Sprache** | Deutsch (Sie-Form), Schweizer Konventionen |
| **Variablen** | Immer in `{geschweiften_klammern}`, werden serverseitig ersetzt |
| **Notfall-Hinweis** | Bei urgency=HIGH immer Sicherheitshinweis (Haupthahn, 118) |
| **Rückruf-Nummer** | Immer die Betriebsnummer, nicht die System-SMS-Nummer |
| **Opt-Out** | Nicht nötig für transaktionale SMS (DSG), aber: nie Werbung senden |
| **Quiet Hours** | Keine SMS zwischen 21:00–07:00, ausser urgency=HIGH |

---

## 8) Variablen-Referenz

| Variable | Quelle | Beispiel |
|----------|--------|---------|
| `{betrieb}` | customers.name | "Dörfler AG" |
| `{name}` | tickets.contact_name | "Hans Müller" |
| `{phone}` | customers.phone | "043 443 52 00" |
| `{sla_zeit}` | Berechnet: created_at + sla_response_minutes, Quiet Hours beachtet | "heute bis 16:00" / "morgen bis 10:00" |
| `{wizard_link}` | customers.website_domain + /anfrage?ref=missed_call&phone=... | "doerfler.flowsight.ch/anfrage?ref=mc&p=+41791234567" |
| `{review_link}` | Tracking-Redirect → customers.google_review_link | "flowsight.ch/r/abc123" |
| `{dashboard_link}` | App URL + /dashboard/tickets/{ticket_id} | "app.flowsight.ch/dashboard/tickets/abc-123" |
| `{termin_datum}` | tickets.metadata.appointment_date | "Donnerstag, 13. Februar" |
| `{termin_zeit}` | tickets.metadata.appointment_time | "14:00 Uhr" |
| `{betrieb_adresse}` | customers.config.address | "Hubstrasse 30, 8942 Oberrieden" |
| `{wartezeit}` | Berechnet: now() - created_at | "3 Stunden" |
| `{ticket_id}` | tickets.id (kurz) | "TK-2024-0042" |
| `{contact_phone}` | tickets.contact_phone | "+41 79 123 45 67" |
| `{betrieb_kontakt}` | customers.config.contact_person | "Ramon" |

### SLA-Zeit Berechnung (für `{sla_zeit}`)
- **Während Geschäftszeiten:** created_at + sla_response_minutes → "heute bis {zeit}"
- **Nach Geschäftsschluss:** nächster Geschäftstag, quiet_hours_end + sla_response_minutes → "morgen bis {zeit}"
- **Wochenende:** "am Montag bis {zeit}"
- **urgency=HIGH:** Ignoriert Quiet Hours → "schnellstmöglich"
