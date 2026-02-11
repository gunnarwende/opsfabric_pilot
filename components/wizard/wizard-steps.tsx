"use client";

import { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, X } from "lucide-react";
import { isValidSwissPhone } from "@/lib/phone";
import type { Customer, WizardFlow, WizardData } from "@/lib/types";

interface WizardStepsProps {
  flow: WizardFlow;
  customer: Pick<Customer, "name" | "slug" | "config">;
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  onSubmit: (data: WizardData) => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
  onClearError: () => void;
}

interface StepDef {
  id: string;
  title: string;
  validate: (data: WizardData) => string | null;
}

function getSteps(flow: WizardFlow): StepDef[] {
  if (flow === "A") {
    return [
      { id: "incident", title: "Was ist passiert?", validate: (d) => d.incident_type ? null : "Bitte wählen Sie eine Option" },
      { id: "contact", title: "Wie erreichen wir Sie?", validate: (d) => {
        if (!d.contact_name?.trim()) return "Bitte geben Sie Ihren Namen ein";
        if (!d.contact_phone?.trim() || !isValidSwissPhone(d.contact_phone)) return "Bitte geben Sie eine gültige Telefonnummer ein";
        return null;
      }},
      { id: "location", title: "Wo ist der Notfall?", validate: (d) => d.address?.trim() ? null : "Bitte geben Sie die Adresse an" },
      { id: "summary", title: "Zusammenfassung", validate: (d) => d.consent ? null : "Bitte stimmen Sie zu" },
    ];
  }
  if (flow === "C") {
    return [
      { id: "category", title: "Wofür brauchen Sie eine Offerte?", validate: (d) => d.category ? null : "Bitte wählen Sie eine Kategorie" },
      { id: "description", title: "Erzählen Sie uns mehr", validate: (d) => d.description?.trim() ? null : "Bitte beschreiben Sie Ihr Projekt" },
      { id: "contact_full", title: "Ihre Kontaktdaten", validate: (d) => {
        if (!d.contact_name?.trim()) return "Bitte geben Sie Ihren Namen ein";
        if (!d.contact_phone?.trim() || !isValidSwissPhone(d.contact_phone)) return "Bitte geben Sie eine gültige Telefonnummer ein";
        if (!d.contact_email?.trim()) return "Für die Offerte benötigen wir Ihre E-Mail-Adresse";
        if (!d.address?.trim()) return "Bitte geben Sie die Adresse des Objekts an";
        return null;
      }},
      { id: "timeline", title: "Zeitrahmen & Budget", validate: () => null },
      { id: "summary", title: "Zusammenfassung", validate: (d) => d.consent ? null : "Bitte stimmen Sie zu" },
    ];
  }
  // Flow B (default)
  return [
    { id: "category", title: "Um was geht es?", validate: (d) => d.category ? null : "Bitte wählen Sie eine Kategorie" },
    { id: "description", title: "Was brauchen Sie?", validate: (d) => d.description?.trim() ? null : "Bitte beschreiben Sie kurz Ihr Anliegen" },
    { id: "contact", title: "Wie erreichen wir Sie?", validate: (d) => {
      if (!d.contact_name?.trim()) return "Bitte geben Sie Ihren Namen ein";
      if (!d.contact_phone?.trim() || !isValidSwissPhone(d.contact_phone)) return "Bitte geben Sie eine gültige Telefonnummer ein";
      return null;
    }},
    { id: "location_time", title: "Ort & Zeitpunkt", validate: (d) => d.plz_ort?.trim() ? null : "Bitte geben Sie PLZ und Ort an" },
    { id: "summary", title: "Zusammenfassung", validate: (d) => d.consent ? null : "Bitte stimmen Sie zu" },
  ];
}

const categories = [
  { value: "sanitaer_reparatur", label: "Sanitär", icon: "🚰" },
  { value: "heizung_wartung", label: "Heizung", icon: "🔥" },
  { value: "spenglerei", label: "Spenglerei", icon: "🏠" },
  { value: "blitzschutz", label: "Blitzschutz", icon: "⚡" },
  { value: "solar", label: "Solartechnik", icon: "☀️" },
  { value: "leitungsbau", label: "Leitungsbau", icon: "🔧" },
  { value: "anderes", label: "Anderes", icon: "📋" },
];

const incidents = [
  { value: "rohrbruch", label: "Rohrbruch / Wasseraustritt", icon: "🚰" },
  { value: "heizung_aus", label: "Heizung ausgefallen", icon: "🔥" },
  { value: "verstopfung", label: "Verstopfung / Rückstau", icon: "🚽" },
  { value: "wasserschaden", label: "Wasserschaden", icon: "💧" },
  { value: "gasgeruch", label: "Gasgeruch", icon: "⚡" },
  { value: "anderes", label: "Anderes", icon: "❓" },
];

const offerteCategories = [
  { value: "sanitaer_bad", label: "Badsanierung / Badumbau", icon: "🛁" },
  { value: "heizung_neu", label: "Heizungsersatz / Neue Heizung", icon: "🔥" },
  { value: "spenglerei", label: "Spenglerei-Projekt", icon: "🏠" },
  { value: "solar", label: "Solaranlage", icon: "☀️" },
  { value: "anderes", label: "Anderes Projekt", icon: "🔧" },
];

const timeOptions = ["So schnell wie möglich", "Diese Woche", "Nächste Woche", "Bin flexibel"];
const timelineOptions = ["Diesen Monat", "In 1–3 Monaten", "In 3–6 Monaten", "Dieses Jahr", "Nur informieren"];
const budgetOptions = ["Unter CHF 5'000", "CHF 5'000–15'000", "CHF 15'000–50'000", "Über CHF 50'000", "Keine Angabe"];

function OptionButton({ selected, label, icon, onClick }: { selected: boolean; label: string; icon?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98] ${
        selected
          ? "border-primary-500 bg-primary-50 text-primary-800"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-200 hover:bg-primary-50/50"
      }`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      <span className="font-medium">{label}</span>
    </button>
  );
}

export function WizardSteps({ flow, customer, data, setData, onSubmit, onBack, isSubmitting, error, onClearError }: WizardStepsProps) {
  const steps = useMemo(() => getSteps(flow), [flow]);
  const [currentStep, setCurrentStep] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const update = (partial: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...partial }));
    setValidationError(null);
    onClearError();
  };

  const next = () => {
    const err = step.validate(data);
    if (err) { setValidationError(err); return; }
    if (isLast) { onSubmit(data); return; }
    setCurrentStep((s) => s + 1);
    setValidationError(null);
  };

  const prev = () => {
    if (currentStep === 0) { onBack(); return; }
    setCurrentStep((s) => s - 1);
    setValidationError(null);
  };

  const displayError = validationError || error;

  return (
    <div className="animate-fade-in">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-500">Schritt {currentStep + 1} von {steps.length}</span>
          <span className="text-sm font-medium text-primary-600">{step.title}</span>
        </div>
        <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-6 sm:p-8 min-h-[300px]">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">{step.title}</h2>

        {/* Gas warning */}
        {data.incident_type === "gasgeruch" && step.id === "incident" && (
          <div className="mb-6 p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
            <div className="text-sm text-danger-700 font-medium">
              Bei Gasgeruch: Fenster öffnen, Gebäude verlassen, 118 rufen!
            </div>
          </div>
        )}

        {/* Dynamic step content */}
        <div className="space-y-4">
          {step.id === "incident" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incidents.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={data.incident_type === opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  onClick={() => update({ incident_type: opt.value, intent: opt.value === "anderes" ? "sanitaer_notfall" : opt.value })}
                />
              ))}
            </div>
          )}

          {step.id === "category" && flow === "C" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {offerteCategories.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={data.category === opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  onClick={() => update({ category: opt.value, intent: opt.value })}
                />
              ))}
            </div>
          )}

          {step.id === "category" && flow === "B" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={data.category === opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  onClick={() => update({ category: opt.value, intent: opt.value })}
                />
              ))}
            </div>
          )}

          {step.id === "description" && (
            <div>
              <textarea
                value={data.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                placeholder={flow === "C"
                  ? "z.B. Komplette Badsanierung, Badewanne durch Dusche ersetzen, neues WC und Lavabo. Wohnung Baujahr 1985, Bad ca. 8m²."
                  : "z.B. Tropfender Wasserhahn im Badezimmer, Heizung macht Geräusche, Dachrinne undicht…"
                }
                maxLength={flow === "C" ? 500 : 300}
                rows={4}
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors resize-none"
              />
              <div className="text-right text-xs text-neutral-400 mt-1">
                {(data.description?.length ?? 0)}/{flow === "C" ? 500 : 300}
              </div>
            </div>
          )}

          {(step.id === "contact" || step.id === "contact_full") && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Ihr Name *</label>
                <input
                  type="text"
                  value={data.contact_name ?? ""}
                  onChange={(e) => update({ contact_name: e.target.value })}
                  placeholder="Vor- und Nachname"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Telefonnummer *</label>
                <input
                  type="tel"
                  value={data.contact_phone ?? ""}
                  onChange={(e) => update({ contact_phone: e.target.value })}
                  placeholder="079 123 45 67"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
                />
              </div>
              {(step.id === "contact_full" || flow === "B") && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    E-Mail {step.id === "contact_full" ? "*" : "(optional)"}
                  </label>
                  <input
                    type="email"
                    value={data.contact_email ?? ""}
                    onChange={(e) => update({ contact_email: e.target.value })}
                    placeholder="ihre@email.ch"
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
                  />
                </div>
              )}
              {step.id === "contact_full" && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Adresse des Objekts *</label>
                  <input
                    type="text"
                    value={data.address ?? ""}
                    onChange={(e) => update({ address: e.target.value })}
                    placeholder="Musterstrasse 12, 8942 Oberrieden"
                    className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {step.id === "location" && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Adresse / PLZ + Ort *</label>
              <input
                type="text"
                value={data.address ?? ""}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="Musterstrasse 12, 8942 Oberrieden"
                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
              />
            </div>
          )}

          {step.id === "location_time" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">PLZ / Ort *</label>
                <input
                  type="text"
                  value={data.plz_ort ?? ""}
                  onChange={(e) => update({ plz_ort: e.target.value })}
                  placeholder="8942 Oberrieden"
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:border-primary-500 focus:ring-0 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Wann soll es sein?</label>
                <div className="grid grid-cols-2 gap-3">
                  {timeOptions.map((opt) => (
                    <OptionButton
                      key={opt}
                      selected={data.preferred_time === opt}
                      label={opt}
                      onClick={() => update({ preferred_time: opt })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step.id === "timeline" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Wann soll das Projekt umgesetzt werden?</label>
                <div className="grid grid-cols-2 gap-3">
                  {timelineOptions.map((opt) => (
                    <OptionButton
                      key={opt}
                      selected={data.timeline === opt}
                      label={opt}
                      onClick={() => update({ timeline: opt })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Haben Sie einen Budget-Rahmen? (optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  {budgetOptions.map((opt) => (
                    <OptionButton
                      key={opt}
                      selected={data.budget === opt}
                      label={opt}
                      onClick={() => update({ budget: opt })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step.id === "summary" && (
            <div className="space-y-4">
              {/* Summary display */}
              <div className="bg-neutral-50 rounded-xl p-5 space-y-3 text-sm">
                {data.incident_type && <div><span className="text-neutral-500">Problem:</span> <span className="font-medium">{incidents.find(i => i.value === data.incident_type)?.label ?? data.incident_type}</span></div>}
                {data.category && <div><span className="text-neutral-500">Kategorie:</span> <span className="font-medium">{[...categories, ...offerteCategories].find(c => c.value === data.category)?.label ?? data.category}</span></div>}
                {data.description && <div><span className="text-neutral-500">Beschreibung:</span> <span className="font-medium">{data.description}</span></div>}
                {data.contact_name && <div><span className="text-neutral-500">Name:</span> <span className="font-medium">{data.contact_name}</span></div>}
                {data.contact_phone && <div><span className="text-neutral-500">Telefon:</span> <span className="font-medium">{data.contact_phone}</span></div>}
                {data.contact_email && <div><span className="text-neutral-500">E-Mail:</span> <span className="font-medium">{data.contact_email}</span></div>}
                {data.address && <div><span className="text-neutral-500">Adresse:</span> <span className="font-medium">{data.address}</span></div>}
                {data.plz_ort && <div><span className="text-neutral-500">PLZ/Ort:</span> <span className="font-medium">{data.plz_ort}</span></div>}
                {data.preferred_time && <div><span className="text-neutral-500">Zeitpunkt:</span> <span className="font-medium">{data.preferred_time}</span></div>}
                {data.timeline && <div><span className="text-neutral-500">Zeitrahmen:</span> <span className="font-medium">{data.timeline}</span></div>}
                {data.budget && <div><span className="text-neutral-500">Budget:</span> <span className="font-medium">{data.budget}</span></div>}
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.consent ?? false}
                  onChange={(e) => update({ consent: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-2 border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-600 leading-relaxed">
                  Ich stimme zu, dass {customer.name} mich zur Bearbeitung meiner Anfrage per Telefon,
                  SMS oder E-Mail kontaktiert.{" "}
                  <a href={`/${customer.slug}/datenschutz`} target="_blank" className="text-primary-600 hover:text-primary-700 underline">
                    Datenschutzerklärung
                  </a>
                </span>
              </label>

              {flow === "A" && (
                <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-sm text-danger-700">
                  <strong>Wichtig:</strong> Bei Wasseraustritt → Haupthahn schliessen. Bei Gasgeruch → Gebäude verlassen, 118 rufen.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Error */}
        {displayError && (
          <div className="mt-4 p-3 bg-danger-500/10 border border-danger-500/20 rounded-xl flex items-center gap-2 text-sm text-danger-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {displayError}
            <button onClick={() => { setValidationError(null); onClearError(); }} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-800 rounded-xl hover:bg-neutral-100 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </button>
        <button
          onClick={next}
          disabled={isSubmitting}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-md transition-all active:scale-[0.98] ${
            isLast
              ? flow === "A"
                ? "bg-danger-500 hover:bg-danger-600 shadow-danger-500/20"
                : "bg-primary-600 hover:bg-primary-700 shadow-primary-600/20"
              : "bg-primary-600 hover:bg-primary-700 shadow-primary-600/20"
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Wird gesendet…
            </>
          ) : isLast ? (
            flow === "A" ? "Notfall absenden" : flow === "C" ? "Offert-Anfrage absenden" : "Anfrage absenden"
          ) : (
            <>
              Weiter
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
