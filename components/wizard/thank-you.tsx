"use client";

import Link from "next/link";
import { CheckCircle, Phone, ArrowLeft, AlertTriangle } from "lucide-react";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Customer, WizardFlow, WizardData } from "@/lib/types";

interface ThankYouProps {
  flow: WizardFlow;
  data: WizardData;
  customer: Pick<Customer, "name" | "slug" | "phone" | "config">;
  ticketId: string | null;
}

export function ThankYou({ flow, data, customer }: ThankYouProps) {
  if (flow === "A") {
    return (
      <div className="animate-fade-in-up text-center py-8">
        <div className="w-20 h-20 rounded-full bg-danger-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-danger-500" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
          Ihre Notfall-Meldung ist eingegangen
        </h1>
        <p className="text-neutral-500 max-w-md mx-auto mb-6">
          {customer.name} meldet sich schnellstmöglich bei Ihnen.
          Sie erhalten in Kürze eine SMS-Bestätigung.
        </p>
        <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl text-sm text-danger-700 max-w-md mx-auto mb-8">
          <strong>Wichtig:</strong> Bei Wasseraustritt → Haupthahn schliessen. Bei Gasgeruch → Gebäude verlassen, 118 rufen.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${formatPhoneTel(customer.phone)}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-danger-500 text-white font-semibold rounded-xl"
          >
            <Phone className="w-4 h-4" />
            Direkt anrufen: {formatPhoneDisplay(customer.phone)}
          </a>
          <Link
            href={`/${customer.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-neutral-600 font-medium rounded-xl hover:bg-neutral-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up text-center py-8">
      <div className="w-20 h-20 rounded-full bg-success-500/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-success-500" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
        {flow === "C" ? "Ihre Offert-Anfrage ist eingegangen" : `Vielen Dank, ${data.contact_name ?? ""}!`}
      </h1>
      <p className="text-neutral-500 max-w-md mx-auto mb-2">
        {flow === "C"
          ? `${customer.name} prüft Ihre Angaben und meldet sich mit einem nächsten Schritt.`
          : `Ihre Anfrage bei ${customer.name} ist eingegangen. Wir melden uns schnellstmöglich.`}
      </p>
      {data.contact_phone && (
        <p className="text-sm text-neutral-400 mb-8">
          Sie erhalten eine SMS-Bestätigung an {data.contact_phone}.
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={`tel:${formatPhoneTel(customer.phone)}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-primary-700 font-medium border-2 border-primary-200 rounded-xl hover:bg-primary-50"
        >
          <Phone className="w-4 h-4" />
          {formatPhoneDisplay(customer.phone)}
        </a>
        <Link
          href={`/${customer.slug}`}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-neutral-600 font-medium rounded-xl hover:bg-neutral-100"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Startseite
        </Link>
      </div>
    </div>
  );
}
