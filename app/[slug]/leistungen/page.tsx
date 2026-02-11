import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Droplets, Flame, Home, Zap, Sun, Construction, Wrench } from "lucide-react";
import { getCustomerBySlug } from "@/config/customers/doerfler-ag";
import { CtaSection } from "@/components/sections/cta-section";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) return {};
  return {
    title: `Leistungen — ${customer.name}`,
    description: `Unsere Leistungen: ${customer.config.services?.map((s) => s.name).join(", ")}. ${customer.config.ort}.`,
  };
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets, Flame, Home, Zap, Sun, Construction, Wrench,
};

export default async function LeistungenPage({ params }: PageProps) {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) notFound();

  const services = customer.config.services ?? [];

  return (
    <>
      {/* Page Header */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-primary-50 to-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Unsere Leistungen</span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight">
            Alles rund um Gebäudetechnik
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto">
            Von der kleinen Reparatur bis zum Grossprojekt — {customer.name} ist Ihr zuverlässiger Partner
            in {customer.config.ort} und der Region Zürichsee-Süd.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Wrench;
            const isEven = i % 2 === 0;

            return (
              <div
                key={service.slug}
                className="group bg-white rounded-2xl border border-neutral-200/60 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  {/* Image/Visual area */}
                  <div className="lg:w-2/5 aspect-[16/10] lg:aspect-auto bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-primary-300" />
                  </div>

                  {/* Content */}
                  <div className="lg:w-3/5 p-6 sm:p-10">
                    <h2 className="text-2xl font-bold text-neutral-900 group-hover:text-primary-700 transition-colors">
                      {service.name}
                    </h2>
                    <p className="mt-3 text-neutral-500 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((f) => (
                        <div key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/${slug}/anfrage?intent=${service.cta_intent}`}
                      className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-600/20"
                    >
                      {service.cta_text}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CtaSection customer={customer} variant="emergency" />
      <CtaSection customer={customer} />
    </>
  );
}
