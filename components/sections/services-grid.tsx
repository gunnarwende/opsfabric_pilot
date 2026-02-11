import Link from "next/link";
import { ArrowRight, Droplets, Flame, Home, Zap, Sun, Construction, Wrench } from "lucide-react";
import type { Customer, ServiceConfig } from "@/lib/types";

interface ServicesGridProps {
  customer: Pick<Customer, "slug" | "config">;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplets,
  Flame,
  Home,
  Zap,
  Sun,
  Construction,
  Wrench,
};

function ServiceCard({ service, slug }: { service: ServiceConfig; slug: string }) {
  const Icon = iconMap[service.icon] ?? Wrench;

  return (
    <Link
      href={`/${slug}/leistungen/${service.slug}`}
      className="group relative bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200/60 shadow-sm hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all duration-300"
    >
      {/* Icon */}
      <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center mb-5 group-hover:bg-primary-100 transition-colors">
        <Icon className="w-7 h-7 text-primary-600" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
        {service.name}
      </h3>
      <p className="text-sm text-neutral-500 leading-relaxed mb-4">
        {service.short_description}
      </p>

      {/* Features preview */}
      <div className="space-y-1.5 mb-6">
        {service.features.slice(0, 3).map((f) => (
          <div key={f} className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="w-1 h-1 rounded-full bg-primary-400" />
            {f}
          </div>
        ))}
        {service.features.length > 3 && (
          <span className="text-xs text-primary-500">+{service.features.length - 3} weitere</span>
        )}
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary-600 group-hover:text-primary-700">
        Mehr erfahren
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

export function ServicesGrid({ customer }: ServicesGridProps) {
  const services = customer.config.services ?? [];

  return (
    <section className="py-20 sm:py-28 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Unsere Leistungen</span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
            Alles aus einer Hand
          </h2>
          <p className="mt-4 text-neutral-500 text-lg leading-relaxed">
            Von der Reparatur bis zum Grossprojekt — wir bieten Ihnen das komplette Leistungsspektrum
            rund um Sanitär, Heizung und Gebäudetechnik.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} slug={customer.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
