import Link from "next/link";
import { Phone, ArrowRight, Clock } from "lucide-react";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Customer } from "@/lib/types";

interface CtaSectionProps {
  customer: Pick<Customer, "name" | "slug" | "phone" | "config">;
  variant?: "default" | "emergency";
}

export function CtaSection({ customer, variant = "default" }: CtaSectionProps) {
  if (variant === "emergency") {
    return (
      <section className="py-16 sm:py-20 bg-danger-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Sanitär-Notfall?
          </h2>
          <p className="mt-4 text-lg text-red-100">
            Rohrbruch, Heizung ausgefallen oder Wasserschaden — wir sind für Sie da.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${formatPhoneTel(customer.phone)}`}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-danger-600 font-bold text-lg rounded-2xl hover:bg-neutral-100 transition-all"
            >
              <Phone className="w-5 h-5" />
              Notfall: {formatPhoneDisplay(customer.phone)}
            </a>
            <Link
              href={`/${customer.slug}/anfrage?flow=A`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-danger-600 text-white font-bold text-lg rounded-2xl hover:bg-danger-700 border-2 border-red-400/30 transition-all"
            >
              Notfall melden
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-800 relative overflow-hidden">
      {/* Decorative */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 70%, rgba(193,120,23,0.3) 0%, transparent 50%)",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-sm font-semibold text-accent-400 uppercase tracking-wider">Bereit?</span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Starten Sie Ihre Anfrage in 2 Minuten
        </h2>
        <p className="mt-4 text-lg text-primary-300 max-w-2xl mx-auto">
          Beschreiben Sie Ihr Anliegen, laden Sie optional Fotos hoch — und wir melden uns
          mit einem konkreten nächsten Schritt.
        </p>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-400">
          <Clock className="w-4 h-4" />
          <span>Antwort innerhalb von 2 Stunden während der Geschäftszeiten</span>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${customer.slug}/anfrage`}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-bold text-lg rounded-2xl hover:bg-accent-600 shadow-2xl shadow-accent-500/20 transition-all active:scale-[0.98]"
          >
            Anfrage starten
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={`tel:${formatPhoneTel(customer.phone)}`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/20 border border-white/10 transition-all"
          >
            <Phone className="w-5 h-5" />
            {formatPhoneDisplay(customer.phone)}
          </a>
        </div>
      </div>
    </section>
  );
}
