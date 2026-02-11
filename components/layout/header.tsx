"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPhoneDisplay, formatPhoneTel } from "@/lib/phone";
import type { Customer } from "@/lib/types";

interface HeaderProps {
  customer: Pick<Customer, "name" | "slug" | "phone" | "config">;
}

export function Header({ customer }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const services = customer.config.services ?? [];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200/60 shadow-sm">
      {/* Top bar */}
      <div className="bg-primary-800 text-white text-sm py-1.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <span className="hidden sm:inline text-primary-200">
            {customer.config.opening_hours}
          </span>
          <a
            href={`tel:${formatPhoneTel(customer.phone)}`}
            className="flex items-center gap-1.5 text-white hover:text-accent-300 transition-colors font-medium ml-auto"
          >
            <Phone className="w-3.5 h-3.5" />
            {formatPhoneDisplay(customer.phone)}
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo / Name */}
          <Link
            href={`/${customer.slug}`}
            className="flex items-center gap-3 font-bold text-xl text-primary-800 hover:text-primary-600 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center text-white text-lg font-bold shrink-0">
              {customer.name.charAt(0)}
            </div>
            <span className="hidden sm:inline">{customer.name}</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href={`/${customer.slug}`}
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-all"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <Link
                href={`/${customer.slug}/leistungen`}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-all"
              >
                Leistungen
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", servicesOpen && "rotate-180")} />
              </Link>
              {servicesOpen && (
                <div className="absolute top-full left-0 pt-1 w-64">
                  <div className="bg-white rounded-xl shadow-xl border border-neutral-100 py-2 animate-fade-in">
                    {services.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/${customer.slug}/leistungen/${s.slug}`}
                        className="block px-4 py-2.5 text-sm text-neutral-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                      >
                        <span className="font-medium">{s.name}</span>
                        <span className="block text-xs text-neutral-400 mt-0.5">{s.short_description}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={`/${customer.slug}/kontakt`}
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 rounded-md hover:bg-primary-50 transition-all"
            >
              Kontakt
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${formatPhoneTel(customer.phone)}`}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-primary-700 border-2 border-primary-200 rounded-xl hover:bg-primary-50 hover:border-primary-300 transition-all"
            >
              <Phone className="w-4 h-4" />
              Anrufen
            </a>
            <Link
              href={`/${customer.slug}/anfrage`}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 rounded-xl hover:bg-primary-700 shadow-md shadow-primary-600/20 hover:shadow-lg hover:shadow-primary-600/30 transition-all"
            >
              Anfrage starten
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
            aria-label="Menü"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-neutral-100 bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link
              href={`/${customer.slug}`}
              className="block px-4 py-3 text-base font-medium text-neutral-800 rounded-lg hover:bg-primary-50"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href={`/${customer.slug}/leistungen`}
              className="block px-4 py-3 text-base font-medium text-neutral-800 rounded-lg hover:bg-primary-50"
              onClick={() => setMobileOpen(false)}
            >
              Leistungen
            </Link>
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/${customer.slug}/leistungen/${s.slug}`}
                className="block px-4 py-3 pl-8 text-sm text-neutral-600 rounded-lg hover:bg-primary-50"
                onClick={() => setMobileOpen(false)}
              >
                {s.name}
              </Link>
            ))}
            <Link
              href={`/${customer.slug}/kontakt`}
              className="block px-4 py-3 text-base font-medium text-neutral-800 rounded-lg hover:bg-primary-50"
              onClick={() => setMobileOpen(false)}
            >
              Kontakt
            </Link>
            <div className="pt-3 space-y-2">
              <a
                href={`tel:${formatPhoneTel(customer.phone)}`}
                className="flex items-center justify-center gap-2 w-full py-3 text-base font-semibold text-primary-700 border-2 border-primary-200 rounded-xl"
              >
                <Phone className="w-5 h-5" />
                Jetzt anrufen
              </a>
              <Link
                href={`/${customer.slug}/anfrage`}
                className="block text-center w-full py-3 text-base font-semibold text-white bg-primary-600 rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Anfrage starten
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
