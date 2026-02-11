import { Star, Shield, Clock, Users } from "lucide-react";
import type { Customer } from "@/lib/types";

interface TrustBarProps {
  customer: Pick<Customer, "config">;
}

export function TrustBar({ customer }: TrustBarProps) {
  const cfg = customer.config;

  const stats = [
    {
      icon: Star,
      value: cfg.google_rating ? `${cfg.google_rating}\u2605` : null,
      label: `${cfg.google_review_count ?? 0} Google-Bewertungen`,
      color: "text-yellow-500",
    },
    {
      icon: Clock,
      value: cfg.founded_year ? `${new Date().getFullYear() - cfg.founded_year}` : null,
      label: "Jahre Erfahrung",
      color: "text-primary-600",
    },
    {
      icon: Shield,
      value: cfg.certifications?.[0] ?? null,
      label: "Zertifiziert & geprüft",
      color: "text-accent-500",
    },
    {
      icon: Users,
      value: cfg.generation ? "3." : null,
      label: "Generation Familienbetrieb",
      color: "text-primary-600",
    },
  ].filter((s) => s.value);

  return (
    <section className="relative -mt-8 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-neutral-900/5 border border-neutral-100 p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="flex items-center gap-4 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-neutral-900">{stat.value}</div>
                  <div className="text-xs text-neutral-500 leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
