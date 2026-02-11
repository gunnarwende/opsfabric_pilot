"use client";

import { useState, useCallback } from "react";
import { FlowSelector } from "./flow-selector";
import { WizardSteps } from "./wizard-steps";
import { ThankYou } from "./thank-you";
import type { Customer, WizardFlow, WizardData, Urgency } from "@/lib/types";

interface WizardContainerProps {
  customer: Pick<Customer, "name" | "slug" | "phone" | "email" | "config">;
  initialFlow?: WizardFlow;
  initialIntent?: string;
  ref_source?: string;
  prefilledPhone?: string;
}

type WizardPhase = "select" | "steps" | "submitting" | "done" | "error";

export function WizardContainer({
  customer,
  initialFlow,
  initialIntent,
  ref_source,
  prefilledPhone,
}: WizardContainerProps) {
  const [phase, setPhase] = useState<WizardPhase>(initialFlow ? "steps" : "select");
  const [flow, setFlow] = useState<WizardFlow>(initialFlow ?? "B");
  const [data, setData] = useState<WizardData>({
    intent: initialIntent,
    ref: ref_source,
    prefilled_phone: prefilledPhone,
    contact_phone: prefilledPhone ?? "",
  });
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectFlow = useCallback((selectedFlow: WizardFlow) => {
    setFlow(selectedFlow);
    setData((prev) => ({
      ...prev,
      urgency: selectedFlow === "A" ? "HIGH" : selectedFlow === "C" ? "LOW" : "MED",
    }));
    setPhase("steps");
  }, []);

  const handleSubmit = useCallback(async (finalData: WizardData) => {
    setPhase("submitting");
    setError(null);

    const urgency: Urgency = flow === "A" ? "HIGH" : flow === "C" ? "LOW" : "MED";

    try {
      const response = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_slug: customer.slug,
          source: finalData.ref === "missed_call" ? "missed_call" : "wizard",
          intent: finalData.intent ?? finalData.category ?? "anderes",
          urgency,
          contact_name: finalData.contact_name,
          contact_phone: finalData.contact_phone,
          contact_email: finalData.contact_email,
          summary: finalData.description ?? finalData.incident_type ?? "",
          metadata: {
            flow,
            address: finalData.address,
            plz_ort: finalData.plz_ort,
            preferred_time: finalData.preferred_time,
            timeline: finalData.timeline,
            budget: finalData.budget,
            photo_count: finalData.photos?.length ?? 0,
            ref: finalData.ref,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Senden fehlgeschlagen");
      }

      const result = await response.json();
      setTicketId(result.ticket_id);
      setPhase("done");
    } catch {
      setError("Senden fehlgeschlagen. Bitte versuchen Sie es erneut.");
      setPhase("error");
    }
  }, [customer.slug, flow]);

  const handleBack = useCallback(() => {
    setPhase("select");
  }, []);

  if (phase === "done") {
    return (
      <ThankYou
        flow={flow}
        data={data}
        customer={customer}
        ticketId={ticketId}
      />
    );
  }

  if (phase === "select") {
    return <FlowSelector onSelect={handleSelectFlow} />;
  }

  return (
    <WizardSteps
      flow={flow}
      customer={customer}
      data={data}
      setData={setData}
      onSubmit={handleSubmit}
      onBack={handleBack}
      isSubmitting={phase === "submitting"}
      error={error}
      onClearError={() => setError(null)}
    />
  );
}
