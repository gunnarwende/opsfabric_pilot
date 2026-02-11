import { Calendar, Award, MapPin, Users } from "lucide-react";
import type { Customer } from "@/lib/types";

interface HeritageProps {
  customer: Pick<Customer, "name" | "config">;
}

export function Heritage({ customer }: HeritageProps) {
  const cfg = customer.config;
  const yearsActive = cfg.founded_year ? new Date().getFullYear() - cfg.founded_year : 0;

  const milestones = [
    { year: "1926", text: "Gründung durch Emil Dörfler sen. in Oberrieden", icon: Calendar },
    { year: "1970", text: "Übergabe an die 2. Generation — Emil Dörfler jun.", icon: Users },
    { year: "1988", text: "Umzug in die neue Werkstatt an der Hubstrasse 30", icon: MapPin },
    { year: "2004", text: "3. Generation — Ramon & Luzian Dörfler übernehmen", icon: Award },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            <span className="text-sm font-semibold text-accent-500 uppercase tracking-wider">Unsere Geschichte</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">
              {yearsActive} Jahre Handwerk<br />mit Leidenschaft
            </h2>
            <p className="mt-5 text-neutral-500 text-lg leading-relaxed">
              Seit {cfg.founded_year} steht {customer.name} für zuverlässige Handwerkskunst in Oberrieden
              und der Region Zürichsee-Süd. Als Familienbetrieb in {cfg.generation?.split("—")[0]?.trim()} kennen
              wir jedes Haus in der Nachbarschaft — und unsere Kunden vertrauen uns seit Generationen.
            </p>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-700">{yearsActive}</div>
                <div className="text-xs text-neutral-500 mt-1">Jahre Erfahrung</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-700">3</div>
                <div className="text-xs text-neutral-500 mt-1">Generationen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-700">1</div>
                <div className="text-xs text-neutral-500 mt-1">Standort</div>
              </div>
            </div>
          </div>

          {/* Right: Timeline */}
          <div className="relative">
            {/* Image placeholder */}
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary-100 via-primary-50 to-accent-50 border border-primary-100 mb-8 flex items-center justify-center overflow-hidden">
              <div className="text-center px-8">
                <div className="text-6xl font-bold text-primary-200">
                  {cfg.founded_year}
                </div>
                <div className="mt-2 text-sm text-primary-400">
                  Familienbetrieb seit {yearsActive} Jahren
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {milestones.map((m, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                    <m.icon className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary-700">{m.year}</div>
                    <div className="text-sm text-neutral-600">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
