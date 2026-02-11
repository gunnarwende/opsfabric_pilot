"use client";

import { Phone, MessageSquare } from "lucide-react";
import { formatPhoneTel } from "@/lib/phone";
import Link from "next/link";

interface FloatingCtaProps {
  phone: string;
  slug: string;
}

export function FloatingCta({ phone, slug }: FloatingCtaProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 md:hidden">
      <Link
        href={`/${slug}/anfrage`}
        className="flex items-center justify-center w-14 h-14 bg-primary-600 text-white rounded-full shadow-xl shadow-primary-600/30 hover:bg-primary-700 transition-all active:scale-95"
        aria-label="Anfrage starten"
      >
        <MessageSquare className="w-6 h-6" />
      </Link>
      <a
        href={`tel:${formatPhoneTel(phone)}`}
        className="flex items-center justify-center w-14 h-14 bg-accent-500 text-white rounded-full shadow-xl shadow-accent-500/30 hover:bg-accent-600 transition-all active:scale-95"
        aria-label="Jetzt anrufen"
      >
        <Phone className="w-6 h-6" />
      </a>
    </div>
  );
}
