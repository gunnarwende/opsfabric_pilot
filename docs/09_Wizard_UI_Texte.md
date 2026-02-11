# OpsFabric — 09 Wizard UI-Texte

**Owner:** FlowSight GmbH  
**Version:** 1.0  
**Stand:** 2026-02-10

> Alle Texte, Labels, Platzhalter und Fehlermeldungen für die Wizard-Flows.  
> Branche: Handwerk (Sanitär, Heizung, Spenglerei). Mandant-Variablen in `{klammern}`.

---

## 1) Wizard Einstieg (vor Flow-Auswahl)

### Überschrift
"Wie können wir Ihnen helfen?"

### Untertitel
"Wählen Sie die passende Option — wir melden uns schnellstmöglich."

### Flow-Auswahl (3 Kacheln)

| Kachel | Icon | Label | Untertitel | Ziel |
|--------|------|-------|-----------|------|
| 🔴 | Flamme/Warnung | **Notfall melden** | "Rohrbruch, Heizung aus, Wasserschaden" | Flow A |
| 📋 | Werkzeug | **Anfrage starten** | "Reparatur, Wartung, Beratung" | Flow B |
| 📐 | Dokument | **Offerte anfragen** | "Badsanierung, Heizungsersatz, Projekt" | Flow C |

---

## 2) Flow A — Notfall (urgency=HIGH)

### Schritt 1: Was ist passiert?
- **Label:** "Was ist passiert?"
- **Typ:** Button-Auswahl (Single Select)
- **Optionen:**
  - "🚰 Rohrbruch / Wasseraustritt"
  - "🔥 Heizung ausgefallen"
  - "🚽 Verstopfung / Rückstau"
  - "💧 Wasserschaden"
  - "⚡ Gasgeruch" → Sonderhinweis: "Bei Gasgeruch: Fenster öffnen, Gebäude verlassen, 118 rufen!"
  - "Anderes"
- **Bei "Anderes":** Textfeld erscheint
  - Placeholder: "Kurz beschreiben, was passiert ist"
  - Max: 200 Zeichen

### Schritt 2: Name & Telefon
- **Überschrift:** "Wie erreichen wir Sie?"
- **Feld 1 — Name:**
  - Label: "Ihr Name"
  - Placeholder: "Vor- und Nachname"
  - Pflicht: Ja
  - Fehler: "Bitte geben Sie Ihren Namen ein"
- **Feld 2 — Telefon:**
  - Label: "Telefonnummer"
  - Placeholder: "079 123 45 67"
  - Typ: tel
  - Pflicht: Ja
  - Validierung: Schweizer Nummer (07x, 06x, oder Festnetz)
  - Fehler: "Bitte geben Sie eine gültige Telefonnummer ein"

### Schritt 3: Wo?
- **Überschrift:** "Wo ist der Notfall?"
- **Feld — Adresse:**
  - Label: "Adresse / PLZ + Ort"
  - Placeholder: "Musterstrasse 12, 8942 Oberrieden"
  - Pflicht: Ja
  - Fehler: "Bitte geben Sie die Adresse an"

### Schritt 4: Foto (optional)
- **Überschrift:** "Haben Sie ein Foto?"
- **Untertitel:** "Ein Foto hilft uns, das Problem besser einzuschätzen."
- **Button:** "📸 Foto aufnehmen" (Mobile: Kamera öffnen) / "📁 Datei auswählen" (Desktop)
- **Max:** 3 Fotos, je max 10 MB
- **Formate:** JPG, PNG, HEIC
- **Skip-Link:** "Überspringen — kein Foto nötig"

### Schritt 5: Absenden
- **Zusammenfassung:** Alle Angaben anzeigen
- **Checkbox:** "Ich stimme zu, dass {betrieb} mich zur Bearbeitung meiner Anfrage kontaktiert." (Pflicht)
- **Button:** "🔴 Notfall absenden"
- **Hinweis unter Button:** "Bei akuter Gefahr (Gas, Wasser): Haupthahn schliessen und 118 rufen."

### Danke-Screen (Flow A)
- **Überschrift:** "Ihre Notfall-Meldung ist eingegangen"
- **Text:** "{betrieb} meldet sich schnellstmöglich bei Ihnen. Sie erhalten in Kürze eine SMS-Bestätigung."
- **Sicherheitshinweis:** "Wichtig: Bei Wasseraustritt → Haupthahn schliessen. Bei Gasgeruch → Gebäude verlassen, 118 rufen."
- **Link:** "Zurück zur Startseite"

---

## 3) Flow B — Standard-Anfrage (urgency=MED)

### Schritt 1: Kategorie
- **Label:** "Um was geht es?"
- **Typ:** Button-Auswahl (Single Select)
- **Optionen:**
  - "🚰 Sanitär" → intent: sanitaer_reparatur
  - "🔥 Heizung" → intent: heizung_wartung
  - "🏠 Spenglerei" → intent: spenglerei
  - "⚡ Blitzschutz" → intent: blitzschutz
  - "☀️ Solartechnik" → intent: solar
  - "🔧 Leitungsbau" → intent: leitungsbau
  - "📋 Anderes" → intent: anderes

### Schritt 2: Beschreibung
- **Label:** "Was brauchen Sie?"
- **Typ:** Textarea
- **Placeholder:** "z.B. Tropfender Wasserhahn im Badezimmer, Heizung macht Geräusche, Dachrinne undicht…"
- **Max:** 300 Zeichen
- **Zeichenzähler:** "47/300"
- **Pflicht:** Ja
- **Fehler:** "Bitte beschreiben Sie kurz Ihr Anliegen"

### Schritt 3: Kontakt
- **Überschrift:** "Wie erreichen wir Sie?"
- **Feld 1 — Name:**
  - Label: "Ihr Name"
  - Placeholder: "Vor- und Nachname"
  - Pflicht: Ja
- **Feld 2 — Telefon:**
  - Label: "Telefonnummer"
  - Placeholder: "079 123 45 67"
  - Pflicht: Ja
- **Feld 3 — E-Mail:**
  - Label: "E-Mail (optional)"
  - Placeholder: "ihre@email.ch"
  - Pflicht: Nein

### Schritt 4: Ort & Zeitpunkt
- **Feld 1 — PLZ/Ort:**
  - Label: "PLZ / Ort"
  - Placeholder: "8942 Oberrieden"
  - Pflicht: Ja
  - Fehler: "Bitte geben Sie PLZ und Ort an"
- **Feld 2 — Zeitpunkt:**
  - Label: "Wann soll es sein?"
  - Typ: Button-Auswahl
  - Optionen: "So schnell wie möglich" / "Diese Woche" / "Nächste Woche" / "Bin flexibel"
  - Pflicht: Ja

### Schritt 5: Foto (optional)
- **Überschrift:** "Haben Sie ein Foto?"
- **Untertitel:** "Fotos helfen uns, die Situation besser einzuschätzen und schneller eine Lösung zu finden."
- **Upload:** Wie Flow A
- **Skip-Link:** "Weiter ohne Foto"

### Schritt 6: Absenden
- **Zusammenfassung:** Alle Angaben kompakt anzeigen
- **Checkbox:** "Ich stimme zu, dass {betrieb} mich zur Bearbeitung meiner Anfrage kontaktiert."
- **Button:** "✅ Anfrage absenden"

### Danke-Screen (Flow B)
- **Überschrift:** "Vielen Dank, {name}!"
- **Text:** "Ihre Anfrage bei {betrieb} ist eingegangen. Wir melden uns bis {sla_zeit}."
- **Info:** "Sie erhalten in Kürze eine SMS-Bestätigung an {phone}."
- **Optional CTA:** "Kennen Sie jemanden, der uns weiterempfehlen würde? → Bewertung auf Google" (nur wenn Review-Link konfiguriert)
- **Link:** "Zurück zur Startseite"

---

## 4) Flow C — Offerte / Projekt (urgency=LOW)

### Schritt 1: Kategorie
- **Label:** "Wofür brauchen Sie eine Offerte?"
- **Typ:** Button-Auswahl
- **Optionen:**
  - "🛁 Badsanierung / Badumbau" → intent: sanitaer_bad
  - "🔥 Heizungsersatz / Neue Heizung" → intent: heizung_neu
  - "🏠 Spenglerei-Projekt" → intent: spenglerei
  - "☀️ Solaranlage" → intent: solar
  - "🔧 Anderes Projekt" → intent: anderes

### Schritt 2: Details
- **Label:** "Erzählen Sie uns mehr"
- **Typ:** Textarea
- **Placeholder:** "z.B. Komplette Badsanierung, Badewanne durch Dusche ersetzen, neues WC und Lavabo. Wohnung Baujahr 1985, Bad ca. 8m²."
- **Max:** 500 Zeichen
- **Zeichenzähler:** Ja
- **Pflicht:** Ja
- **Fehler:** "Bitte beschreiben Sie Ihr Projekt"

### Schritt 3: Kontakt (vollständig)
- **Überschrift:** "Ihre Kontaktdaten"
- **Feld 1 — Name:** (Pflicht)
- **Feld 2 — Telefon:** (Pflicht)
- **Feld 3 — E-Mail:** (Pflicht für Offerten)
  - Fehler: "Für die Offerte benötigen wir Ihre E-Mail-Adresse"
- **Feld 4 — Adresse:** (Pflicht)
  - Label: "Adresse des Objekts"
  - Placeholder: "Musterstrasse 12, 8942 Oberrieden"

### Schritt 4: Zeitrahmen & Budget
- **Feld 1 — Zeitrahmen:**
  - Label: "Wann soll das Projekt umgesetzt werden?"
  - Typ: Button-Auswahl
  - Optionen: "Diesen Monat" / "In 1–3 Monaten" / "In 3–6 Monaten" / "Dieses Jahr" / "Nur informieren"
- **Feld 2 — Budget (optional):**
  - Label: "Haben Sie einen Budget-Rahmen?"
  - Typ: Button-Auswahl
  - Optionen: "Unter CHF 5'000" / "CHF 5'000–15'000" / "CHF 15'000–50'000" / "Über CHF 50'000" / "Keine Angabe"

### Schritt 5: Fotos (empfohlen)
- **Überschrift:** "Fotos des Projekts"
- **Untertitel:** "Fotos helfen uns, eine genauere Offerte zu erstellen. Bitte fotografieren Sie den aktuellen Zustand."
- **Max:** 5 Fotos
- **Empfehlung:** "Tipp: Übersichtsfoto + Detailfotos von relevanten Stellen"
- **Skip-Link:** "Weiter ohne Fotos"

### Schritt 6: Absenden
- **Zusammenfassung:** Alle Angaben inkl. Foto-Vorschau
- **Checkbox:** Wie Flow B
- **Button:** "📐 Offert-Anfrage absenden"

### Danke-Screen (Flow C)
- **Überschrift:** "Ihre Offert-Anfrage ist eingegangen"
- **Text:** "Vielen Dank, {name}. {betrieb} prüft Ihre Angaben und meldet sich bis {sla_zeit} mit einem nächsten Schritt."
- **Info:** "Sie erhalten eine Bestätigung per SMS an {phone} und per E-Mail an {email}."
- **Link:** "Zurück zur Startseite"

---

## 5) Allgemeine UI-Texte

### Fortschrittsbalken
"Schritt {current} von {total}"

### Navigation
- **Zurück:** "← Zurück"
- **Weiter:** "Weiter →"
- **Abbrechen:** "✕" (oben rechts, öffnet Bestätigungsdialog)

### Abbruch-Dialog
- **Titel:** "Anfrage abbrechen?"
- **Text:** "Ihre bisherigen Eingaben gehen verloren."
- **Buttons:** "Ja, abbrechen" / "Nein, weitermachen"

### Validierungs-Fehler (generisch)
- **Leeres Pflichtfeld:** "Bitte füllen Sie dieses Feld aus"
- **Ungültige Telefonnummer:** "Bitte geben Sie eine gültige Schweizer Telefonnummer ein"
- **Ungültige E-Mail:** "Bitte geben Sie eine gültige E-Mail-Adresse ein"
- **Text zu lang:** "Maximal {max} Zeichen erlaubt"
- **Foto zu gross:** "Die Datei ist zu gross (max. 10 MB)"
- **Falsches Format:** "Erlaubte Formate: JPG, PNG, HEIC"
- **Upload fehlgeschlagen:** "Upload fehlgeschlagen — bitte versuchen Sie es erneut"

### Consent-Text (Checkbox)
"Ich stimme zu, dass {betrieb} mich zur Bearbeitung meiner Anfrage per Telefon, SMS oder E-Mail kontaktiert. Weitere Informationen: [Datenschutzerklärung]({datenschutz_link})"

### Lade-Zustand (Submit)
- **Button-Text während Submit:** "Wird gesendet…"
- **Bei Fehler:** "Senden fehlgeschlagen. Bitte versuchen Sie es erneut."
- **Retry-Button:** "Erneut versuchen"
