import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowRight, Navigation } from "lucide-react";
import { getCustomerBySlug } from "@/lib/customer";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) return {};
  return {
    title: `Kontakt — ${customer.name}`,
    description: `${customer.name} kontaktieren: ${customer.phone}, ${customer.email}. ${customer.config.address}, ${customer.config.plz} ${customer.config.ort}.`,
  };
}

export default async function KontaktPage({ params }: PageProps) {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) notFound();

  const cfg = customer.config;

  return (
    <>
      {/* Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-primary-50 to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Kontakt</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Wir sind für Sie da
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Rufen Sie uns an, schreiben Sie uns oder starten Sie direkt eine Anfrage.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-6">{customer.name}</h2>
                <div className="space-y-5">
                  <a
                    href={`tel:${formatPhoneTel(customer.phone)}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <Phone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Telefon</div>
                      <div className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {formatPhoneDisplay(customer.phone)}
                      </div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${customer.email}`}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">E-Mail</div>
                      <div className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {customer.email}
                      </div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Adresse</div>
                      <div className="text-lg font-semibold text-neutral-900">
                        {cfg.address}
                      </div>
                      <div className="text-neutral-600">{cfg.plz} {cfg.ort}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm text-neutral-500">Öffnungszeiten</div>
                      <div className="text-lg font-semibold text-neutral-900">
                        {cfg.opening_hours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${formatPhoneTel(customer.phone)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  Jetzt anrufen
                </a>
                <Link
                  href={`/${slug}/anfrage`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-500 text-white font-semibold rounded-xl hover:bg-accent-600 shadow-md shadow-accent-500/20 transition-all"
                >
                  Anfrage starten
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Service Area */}
              <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="flex items-center gap-2 mb-3">
                  <Navigation className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-neutral-900">Unser Einzugsgebiet</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Oberrieden, Horgen, Thalwil, Kilchberg, Adliswil, Langnau am Albis,
                  Wädenswil und die gesamte Region Zürichsee-Süd.
                  Auch Kantone Zürich und Zug auf Anfrage.
                </p>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="space-y-6">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 border border-primary-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary-300 mx-auto mb-3" />
                  <div className="text-sm text-primary-500 font-medium">{cfg.address}</div>
                  <div className="text-sm text-primary-400">{cfg.plz} {cfg.ort}</div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cfg.address}, ${cfg.plz} ${cfg.ort}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    In Google Maps öffnen
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Emergency card */}
              <div className="p-6 bg-danger-500/5 rounded-2xl border border-danger-500/20">
                <h3 className="font-bold text-danger-600 mb-2">Notfall?</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Rohrbruch, Heizung ausgefallen oder Wasserschaden? Rufen Sie uns direkt an
                  oder melden Sie den Notfall online.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`tel:${formatPhoneTel(customer.phone)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-danger-500 text-white font-semibold rounded-xl text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Notfall anrufen
                  </a>
                  <Link
                    href={`/${slug}/anfrage?flow=A`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-danger-600 font-semibold border-2 border-danger-200 rounded-xl text-sm"
                  >
                    Notfall melden
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
