import type { Customer } from "@/lib/types";

/**
 * Static customer config for Dörfler AG (Pilot)
 * Will be moved to Supabase customers table in Phase 4
 */
export const doerflerAg: Omit<Customer, "id" | "created_at" | "updated_at"> = {
  name: "Dörfler AG",
  slug: "doerfler-ag",
  phone: "+41434435200",
  email: "info@doerflerag.ch",
  sms_number: null, // Will be set when SMS provider is configured
  website_domain: "doerfler.flowsight.ch",
  google_review_link: null, // To be configured
  timezone: "Europe/Zurich",
  quiet_hours_start: "21:00",
  quiet_hours_end: "07:00",
  sla_response_minutes: 120,
  review_delay_hours: 2,
  plan: "pilot",
  onboarded_at: null,
  active: true,
  config: {
    address: "Hubstrasse 30",
    plz: "8942",
    ort: "Oberrieden",
    contact_person: "Ramon Dörfler",
    founded_year: 1926,
    generation: "3. Generation — Ramon & Luzian Dörfler",
    opening_hours: "Mo–Fr 08:00–12:00, 13:00–17:00",
    google_rating: 4.7,
    google_review_count: 3,
    certifications: ["Suissetec-Mitglied"],
    hero_claim: "Sanitär, Heizung & Spenglerei in Oberrieden — seit 1926",
    hero_benefits: [
      "Notfall-Service am selben Tag",
      "Familienbetrieb in 3. Generation — wir kennen jedes Haus",
      "Suissetec-zertifiziert — Qualität mit Garantie",
    ],
    review_highlights: [
      {
        text: "Schnelle und kompetente Hilfe bei unserem Rohrbruch. Sehr empfehlenswert!",
        author: "M. Keller",
        rating: 5,
        source: "Google",
      },
      {
        text: "Top Arbeit bei der Badsanierung. Sauber, pünktlich und faire Preise.",
        author: "S. Weber",
        rating: 5,
        source: "Google",
      },
      {
        text: "Zuverlässiger Familienbetrieb. Seit Jahren unser Sanitär-Partner.",
        author: "R. Brunner",
        rating: 5,
        source: "local.ch",
      },
    ],
    services: [
      {
        slug: "sanitaer",
        name: "Sanitär",
        short_description: "Installationen, Reparaturen & Badsanierungen",
        description:
          "Von der tropfenden Armatur bis zur kompletten Badsanierung — Ihr Sanitär-Spezialist in Oberrieden. Wir installieren, reparieren und sanieren fachgerecht und zeitnah.",
        icon: "Droplets",
        features: [
          "Badsanierungen & Umbauten",
          "Sanitär-Installationen (Neu & Umbau)",
          "Rohrreinigung & Leitungssanierung",
          "Entkalkungsanlagen",
          "Armaturen & Apparate",
          "Notfall-Service",
        ],
        cta_text: "Sanitär-Anfrage starten",
        cta_intent: "sanitaer_reparatur",
      },
      {
        slug: "heizung",
        name: "Heizung",
        short_description: "Erneuerung, Wärmepumpen & Wartung",
        description:
          "Moderne Heizsysteme für Ihr Zuhause. Wir beraten, planen und installieren — von der Wärmepumpe bis zur Holzheizung. Inklusive Wartung und 24h-Notfalldienst.",
        icon: "Flame",
        features: [
          "Heizungsersatz & Erneuerung",
          "Wärmepumpen",
          "Holz- & Pelletheizungen",
          "Fussbodenheizung",
          "Kesselsanierung",
          "Heizungsservice & Wartung",
        ],
        cta_text: "Heizungs-Anfrage starten",
        cta_intent: "heizung_wartung",
      },
      {
        slug: "spenglerei",
        name: "Spenglerei",
        short_description: "Dachrinnen, Blecharbeiten & Flachdach",
        description:
          "Professionelle Spenglerarbeiten für Dach und Fassade. Dachrinnen, Blechverkleidungen, Kaminverkleidungen und Flachdachabdichtungen — präzise und langlebig.",
        icon: "Home",
        features: [
          "Dachrinnen & Ablaufsysteme",
          "Blechverkleidungen",
          "Kaminverkleidungen",
          "Schneefang & Dachsicherheit",
          "Flachdach-Abdichtungen",
          "Fassadenbekleidungen",
        ],
        cta_text: "Spenglerei-Anfrage starten",
        cta_intent: "spenglerei",
      },
      {
        slug: "blitzschutz",
        name: "Blitzschutz",
        short_description: "Montage, Messungen & Überspannungsschutz",
        description:
          "Normgerechter Blitzschutz für Ihr Gebäude. Wir montieren Blitzableiter, führen Blitzschutzmessungen durch und installieren Überspannungsschutz.",
        icon: "Zap",
        features: [
          "Blitzschutz-Montage",
          "Blitzschutzmessungen",
          "Überspannungsschutz",
          "Erdungsanlagen",
        ],
        cta_text: "Blitzschutz-Anfrage starten",
        cta_intent: "blitzschutz",
      },
      {
        slug: "solar",
        name: "Solartechnik",
        short_description: "Sonnenkollektoren für Heizung & Warmwasser",
        description:
          "Nutzen Sie die Kraft der Sonne. Wir planen und installieren Solaranlagen für Warmwasser und Heizungsunterstützung — effizient und zukunftssicher.",
        icon: "Sun",
        features: [
          "Sonnenkollektoren",
          "Solar-Warmwasser",
          "Heizungsunterstützung",
          "Kombination mit Wärmepumpe",
        ],
        cta_text: "Solar-Beratung anfragen",
        cta_intent: "solar",
      },
      {
        slug: "leitungsbau",
        name: "Leitungsbau",
        short_description: "Hauswasserleitungen & Netzleitungen",
        description:
          "Professioneller Leitungsbau für Trinkwasser und Abwasser. Hauswasserzuleitungen, Netzwasserleitungen und Bauwasserprovisorien — zuverlässig und termingerecht.",
        icon: "Construction",
        features: [
          "Hauswasserzuleitungen",
          "Netzwasserleitungen",
          "Bauwasserprovisorien",
          "Rohrbruch-Sanierung",
        ],
        cta_text: "Leitungsbau-Anfrage starten",
        cta_intent: "leitungsbau",
      },
    ],
    intents: [
      { value: "sanitaer_notfall", label: "Sanitär-Notfall", category: "Sanitär" },
      { value: "sanitaer_reparatur", label: "Sanitär-Reparatur", category: "Sanitär" },
      { value: "sanitaer_bad", label: "Badsanierung", category: "Sanitär" },
      { value: "heizung_notfall", label: "Heizung ausgefallen", category: "Heizung" },
      { value: "heizung_wartung", label: "Heizungswartung", category: "Heizung" },
      { value: "heizung_neu", label: "Neue Heizung", category: "Heizung" },
      { value: "spenglerei", label: "Spenglerei", category: "Spenglerei" },
      { value: "blitzschutz", label: "Blitzschutz", category: "Blitzschutz" },
      { value: "solar", label: "Solartechnik", category: "Solar" },
      { value: "leitungsbau", label: "Leitungsbau", category: "Leitungsbau" },
      { value: "anderes", label: "Anderes", category: "Sonstiges" },
    ],
  },
};

/** Lookup customer config by slug */
export function getCustomerBySlug(slug: string) {
  const customers: Record<string, typeof doerflerAg> = {
    "doerfler-ag": doerflerAg,
  };
  return customers[slug] ?? null;
}
