"use client";

import { AlertTriangle, Wrench, FileText } from "lucide-react";
import type { WizardFlow } from "@/lib/types";

interface FlowSelectorProps {
  onSelect: (flow: WizardFlow) => void;
}

const flows = [
  {
    flow: "A" as WizardFlow,
    icon: AlertTriangle,
    label: "Notfall melden",
    subtitle: "Rohrbruch, Heizung aus, Wasserschaden",
    color: "bg-danger-500",
    hoverColor: "hover:bg-danger-600",
    ringColor: "ring-danger-500/20",
    iconColor: "text-white",
  },
  {
    flow: "B" as WizardFlow,
    icon: Wrench,
    label: "Anfrage starten",
    subtitle: "Reparatur, Wartung, Beratung",
    color: "bg-primary-600",
    hoverColor: "hover:bg-primary-700",
    ringColor: "ring-primary-600/20",
    iconColor: "text-white",
  },
  {
    flow: "C" as WizardFlow,
    icon: FileText,
    label: "Offerte anfragen",
    subtitle: "Badsanierung, Heizungsersatz, Projekt",
    color: "bg-accent-500",
    hoverColor: "hover:bg-accent-600",
    ringColor: "ring-accent-500/20",
    iconColor: "text-white",
  },
];

export function FlowSelector({ onSelect }: FlowSelectorProps) {
  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
          Wie können wir Ihnen helfen?
        </h1>
        <p className="mt-2 text-neutral-500">
          Wählen Sie die passende Option — wir melden uns schnellstmöglich.
        </p>
      </div>

      {/* Flow Cards */}
      <div className="space-y-4">
        {flows.map(({ flow, icon: Icon, label, subtitle, color, hoverColor, ringColor }) => (
          <button
            key={flow}
            onClick={() => onSelect(flow)}
            className={`w-full flex items-center gap-5 p-5 sm:p-6 rounded-2xl ${color} ${hoverColor} text-white shadow-lg ring-4 ${ringColor} transition-all active:scale-[0.98] text-left`}
          >
            <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-lg font-bold">{label}</div>
              <div className="text-sm opacity-80">{subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
