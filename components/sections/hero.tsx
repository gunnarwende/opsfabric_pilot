import Link from "next/link";
import { Phone, ArrowRight, Shield, Clock, Award } from "lucide-react";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Customer } from "@/lib/types";

interface HeroProps {
  customer: Pick<Customer, "name" | "slug" | "phone" | "config">;
}

const benefitIcons = [Clock, Shield, Award];

export function Hero({ customer }: HeroProps) {
  const cfg = customer.config;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(193,120,23,0.2) 0%, transparent 50%)",
        }}
      />
      {/* Subtle pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-40 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-primary-200 mb-8 border border-white/10">
            <span className="w-2 h-2 bg-accent-400 rounded-full" />
            Seit {cfg.founded_year} — {cfg.generation}
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animation-delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            {cfg.hero_claim}
          </h1>

          {/* Benefits */}
          <div className="animate-fade-in-up animation-delay-200 mt-8 space-y-3">
            {cfg.hero_benefits?.map((benefit, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <div key={i} className="flex items-center gap-3 text-primary-200">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm">
                    <Icon className="w-4 h-4 text-accent-400" />
                  </div>
                  <span className="text-base sm:text-lg">{benefit}</span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="animate-fade-in-up animation-delay-300 mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href={`tel:${formatPhoneTel(customer.phone)}`}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-primary-800 font-bold text-lg rounded-2xl hover:bg-neutral-100 shadow-2xl shadow-black/20 transition-all active:scale-[0.98]"
            >
              <Phone className="w-5 h-5" />
              <span>Jetzt anrufen</span>
              <span className="text-sm font-normal text-primary-500">{formatPhoneDisplay(customer.phone)}</span>
            </a>
            <Link
              href={`/${customer.slug}/anfrage`}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-500 text-white font-bold text-lg rounded-2xl hover:bg-accent-600 shadow-2xl shadow-accent-500/30 transition-all active:scale-[0.98]"
            >
              Anfrage starten
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-in-up animation-delay-400 mt-8 flex flex-wrap items-center gap-6 text-sm text-primary-300">
            {cfg.google_rating && (
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(cfg.google_rating!) ? "text-yellow-400" : "text-primary-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span>{cfg.google_rating} auf Google</span>
              </div>
            )}
            {cfg.certifications?.map((cert) => (
              <div key={cert} className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-accent-400" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
