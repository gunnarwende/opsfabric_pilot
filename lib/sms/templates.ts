/**
 * SMS Templates — all message texts as per docs/08_SMS_Templates.md
 * Variables are replaced at send-time. All texts in German (Sie-Form).
 */

interface TemplateVars {
  betrieb: string;
  name?: string;
  phone: string;
  sla_zeit?: string;
  wizard_link?: string;
  review_link?: string;
}

// --- Missed Call Templates ---

export function missedCallInitialSms(vars: TemplateVars): string {
  return [
    `Danke für Ihren Anruf bei ${vars.betrieb}. Wir sind gerade im Einsatz.`,
    "",
    "1 = Dringend/Notfall",
    "2 = Rückruf gewünscht",
    "3 = Anfrage mit Details",
    "",
    `Oder nochmals anrufen: ${vars.phone}`,
  ].join("\n");
}

export function missedCallWeekendSms(vars: TemplateVars): string {
  return [
    `Danke für Ihren Anruf bei ${vars.betrieb}. Am Wochenende sind wir eingeschränkt erreichbar.`,
    "",
    "1 = Notfall (wir melden uns schnellstmöglich)",
    "2 = Rückruf am Montag",
    "3 = Anfrage mit Details",
    "",
    `Notfall-Nummer: ${vars.phone}`,
  ].join("\n");
}

// --- Missed Call Reply Confirmations ---

export function replyUrgentSms(vars: TemplateVars): string {
  return `Verstanden — dringend. ${vars.betrieb} meldet sich schnellstmöglich. Bei akuter Gefahr (Wasser/Gas): Bitte Haupthahn schliessen und 118 (Feuerwehr) rufen.`;
}

export function replyCallbackSms(vars: TemplateVars): string {
  return `Rückruf notiert. ${vars.betrieb} ruft Sie bis ${vars.sla_zeit} zurück. Falls es dringend wird: ${vars.phone}`;
}

export function replyWizardSms(vars: TemplateVars): string {
  return `Hier können Sie Ihre Anfrage mit Foto/Details senden — wir melden uns bis ${vars.sla_zeit}: ${vars.wizard_link}`;
}

export function replyFreetextSms(vars: TemplateVars): string {
  return `Danke für Ihre Nachricht. ${vars.betrieb} meldet sich bis ${vars.sla_zeit} bei Ihnen. Falls dringend: ${vars.phone}`;
}

// --- Wizard Confirmation Templates ---

export function wizardConfirmationStandard(vars: TemplateVars): string {
  return `Danke ${vars.name}, Ihre Anfrage bei ${vars.betrieb} ist eingegangen. Wir melden uns bis ${vars.sla_zeit}. Fragen? ${vars.phone}`;
}

export function wizardConfirmationUrgent(vars: TemplateVars): string {
  return `${vars.name}, Ihre Notfall-Meldung ist eingegangen. ${vars.betrieb} meldet sich schnellstmöglich. Bei akuter Gefahr: Haupthahn schliessen, 118 rufen.`;
}

export function wizardConfirmationOfferte(vars: TemplateVars): string {
  return `Danke ${vars.name}, Ihre Offert-Anfrage bei ${vars.betrieb} ist eingegangen. Wir prüfen die Details und melden uns bis ${vars.sla_zeit} mit einem nächsten Schritt.`;
}

// --- Review Request ---

export function reviewRequestSms(vars: TemplateVars): string {
  return `Danke für Ihren Auftrag bei ${vars.betrieb}! Wenn Sie 30 Sekunden haben — eine Google-Bewertung hilft uns sehr: ${vars.review_link}`;
}

// --- Status Updates ---

export function statusScheduledSms(
  vars: TemplateVars & { termin_datum: string; termin_zeit: string; betrieb_adresse: string }
): string {
  return `Ihr Termin bei ${vars.betrieb} ist bestätigt: ${vars.termin_datum}, ${vars.termin_zeit}. Adresse: ${vars.betrieb_adresse}. Fragen? ${vars.phone}`;
}

// --- Template Selector ---

export function getConfirmationSms(
  source: "wizard" | "missed_call",
  urgency: "LOW" | "MED" | "HIGH",
  vars: TemplateVars
): string {
  if (source === "missed_call") {
    return replyFreetextSms(vars);
  }
  if (urgency === "HIGH") {
    return wizardConfirmationUrgent(vars);
  }
  if (urgency === "LOW") {
    return wizardConfirmationOfferte(vars);
  }
  return wizardConfirmationStandard(vars);
}
