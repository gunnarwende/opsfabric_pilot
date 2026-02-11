import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Phone, CheckCircle, Droplets, Flame, Home, Zap, Sun, Construction, Wrench } from "lucide-react";
import { getCustomerBySlug } from "@/config/customers/doerfler-ag";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import { CtaSection } from "@/components/sections/cta-section";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string; service: string }>;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets, Flame, Home, Zap, Sun, Construction, Wrench,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; service: string }> }): Promise<Metadata> {
  const { slug, service: serviceSlug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) return {};
  const service = customer.config.services?.find((s) => s.slug === serviceSlug);
  if (!service) return {};
  return {
    title: `${service.name} in ${customer.config.ort} — ${customer.name}`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug, service: serviceSlug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) notFound();

  const service = customer.config.services?.find((s) => s.slug === serviceSlug);
  if (!service) notFound();

  const Icon = iconMap[service.icon] ?? Wrench;
  const otherServices = customer.config.services?.filter((s) => s.slug !== serviceSlug) ?? [];

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-neutral-50 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Link href={`/${slug}`} className="hover:text-primary-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${slug}/leistungen`} className="hover:text-primary-600 transition-colors">Leistungen</Link>
            <span>/</span>
            <span className="text-neutral-800 font-medium">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-6">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 tracking-tight">
                {service.name}
              </h1>
              <p className="mt-5 text-lg text-neutral-500 leading-relaxed">
                {service.description}
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${slug}/anfrage?intent=${service.cta_intent}`}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-all"
                >
                  {service.cta_text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`tel:${formatPhoneTel(customer.phone)}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-primary-700 font-semibold border-2 border-primary-200 rounded-xl hover:bg-primary-50 transition-all"
                >
                  <Phone className="w-4 h-4" />
                  {formatPhoneDisplay(customer.phone)}
                </a>
              </div>
            </div>

            {/* Visual area */}
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 border border-primary-100 flex items-center justify-center">
              <Icon className="w-32 h-32 text-primary-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Was wir im Bereich {service.name} für Sie tun</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {service.features.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 p-5 bg-neutral-50 rounded-xl border border-neutral-100"
              >
                <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 shrink-0" />
                <span className="text-neutral-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Other Services */}
      {otherServices.length > 0 && (
        <section className="py-16 sm:py-20 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8">Weitere Leistungen</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {otherServices.map((s) => {
                const OtherIcon = iconMap[s.icon] ?? Wrench;
                return (
                  <Link
                    key={s.slug}
                    href={`/${slug}/leistungen/${s.slug}`}
                    className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-neutral-200/60 hover:border-primary-200 hover:shadow-md transition-all text-center"
                  >
                    <OtherIcon className="w-8 h-8 text-primary-400 group-hover:text-primary-600 transition-colors" />
                    <span className="text-sm font-medium text-neutral-700 group-hover:text-primary-700">{s.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CtaSection customer={customer} />

      {/* Back Link */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <Link
            href={`/${slug}/leistungen`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </>
  );
}
