import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Customer } from "@/lib/types";

interface FooterProps {
  customer: Pick<Customer, "name" | "slug" | "phone" | "email" | "config">;
}

export function Footer({ customer }: FooterProps) {
  const cfg = customer.config;
  const services = cfg.services ?? [];

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center text-white text-lg font-bold">
                {customer.name.charAt(0)}
              </div>
              <span className="text-lg font-bold">{customer.name}</span>
            </div>
            <p className="text-sm text-primary-300 leading-relaxed">
              {cfg.hero_claim}
            </p>
            {cfg.certifications?.map((cert) => (
              <div key={cert} className="flex items-center gap-2 text-sm text-accent-400">
                <span className="w-2 h-2 bg-accent-400 rounded-full" />
                {cert}
              </div>
            ))}
          </div>

          {/* Kontakt */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Kontakt</h3>
            <div className="space-y-3">
              <a
                href={`tel:${formatPhoneTel(customer.phone)}`}
                className="flex items-start gap-3 text-sm text-primary-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                {formatPhoneDisplay(customer.phone)}
              </a>
              <a
                href={`mailto:${customer.email}`}
                className="flex items-start gap-3 text-sm text-primary-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                {customer.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-primary-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{cfg.address}, {cfg.plz} {cfg.ort}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-primary-300">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{cfg.opening_hours}</span>
              </div>
            </div>
          </div>

          {/* Leistungen */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Leistungen</h3>
            <div className="space-y-2">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${customer.slug}/leistungen/${s.slug}`}
                  className="block text-sm text-primary-300 hover:text-white transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links & CTA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Schnellzugriff</h3>
            <div className="space-y-2">
              <Link
                href={`/${customer.slug}/anfrage`}
                className="block text-sm text-primary-300 hover:text-white transition-colors"
              >
                Anfrage starten
              </Link>
              <Link
                href={`/${customer.slug}/kontakt`}
                className="block text-sm text-primary-300 hover:text-white transition-colors"
              >
                Kontakt & Anfahrt
              </Link>
              <Link
                href={`/${customer.slug}/datenschutz`}
                className="block text-sm text-primary-300 hover:text-white transition-colors"
              >
                Datenschutz
              </Link>
              <Link
                href={`/${customer.slug}/impressum`}
                className="block text-sm text-primary-300 hover:text-white transition-colors"
              >
                Impressum
              </Link>
            </div>
            {/* CTA */}
            <Link
              href={`/${customer.slug}/anfrage`}
              className="inline-flex items-center gap-2 mt-4 px-5 py-3 bg-accent-500 text-white text-sm font-semibold rounded-xl hover:bg-accent-600 transition-all shadow-lg shadow-accent-500/20"
            >
              Anfrage starten
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <span>&copy; {new Date().getFullYear()} {customer.name}. Alle Rechte vorbehalten.</span>
          <span>
            Betrieben von{" "}
            <a
              href="https://flowsight.ch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-300 hover:text-white transition-colors"
            >
              FlowSight
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
