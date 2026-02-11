/**
 * OpsFabric — Customer Onboarding Script
 *
 * Usage: npx tsx scripts/onboard-customer.ts
 *
 * Inserts a new customer into Supabase with full config.
 * Edit the CUSTOMER object below with customer details, then run.
 */

import { createClient } from "@supabase/supabase-js";

// --- EDIT THIS SECTION FOR EACH NEW CUSTOMER ---

const CUSTOMER = {
  // Required fields
  name: "Beispiel GmbH",
  slug: "beispiel-gmbh", // URL-safe, lowercase, hyphens only
  phone: "+41441234567", // E.164 format
  email: "info@beispiel.ch",

  // Optional fields (uncomment and fill as needed)
  sms_number: null as string | null, // SMS sender number
  website_domain: null as string | null, // e.g. "beispiel.flowsight.ch"
  google_review_link: null as string | null, // Google review URL
  timezone: "Europe/Zurich",
  quiet_hours_start: "21:00",
  quiet_hours_end: "07:00",
  sla_response_minutes: 120,
  review_delay_hours: 2,
  plan: "starter" as "pilot" | "starter" | "pro" | "premium",
  active: true,

  // Config JSONB — customer-specific content
  config: {
    address: "",
    plz: "",
    ort: "",
    contact_person: "",
    opening_hours: "Mo–Fr 08:00–12:00, 13:00–17:00",

    // Optional branding & proof
    // logo_url: "",
    // founded_year: 2020,
    // generation: "",
    // google_rating: 4.5,
    // google_review_count: 10,
    // certifications: [],

    // Hero section (for website module)
    // hero_claim: "Ihr Fachbetrieb in Zürich",
    // hero_benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],

    // Services
    services: [
      {
        slug: "dienstleistung-1",
        name: "Dienstleistung 1",
        short_description: "Kurzbeschreibung",
        description: "Ausführliche Beschreibung der Dienstleistung.",
        icon: "Wrench", // Lucide icon name
        features: ["Feature A", "Feature B", "Feature C"],
        cta_text: "Anfrage starten",
        cta_intent: "dienstleistung_1",
      },
    ],

    // Intents (wizard options)
    intents: [
      { value: "dienstleistung_1", label: "Dienstleistung 1", category: "Allgemein" },
      { value: "anderes", label: "Anderes", category: "Sonstiges" },
    ],

    // Review highlights (for website)
    // review_highlights: [
    //   { text: "Toller Service!", author: "A. Muster", rating: 5, source: "Google" },
    // ],
  },
};

// --- DO NOT EDIT BELOW THIS LINE ---

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
    console.error("Run with: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/onboard-customer.ts");
    process.exit(1);
  }

  // Validate required fields
  if (!CUSTOMER.name || !CUSTOMER.slug || !CUSTOMER.phone || !CUSTOMER.email) {
    console.error("Missing required fields: name, slug, phone, email");
    process.exit(1);
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(CUSTOMER.slug)) {
    console.error("Invalid slug format. Use lowercase letters, numbers, and hyphens only.");
    process.exit(1);
  }

  // Validate phone format (E.164)
  if (!/^\+\d{10,15}$/.test(CUSTOMER.phone)) {
    console.error("Invalid phone format. Use E.164: +41...");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check if slug already exists
  const { data: existing } = await supabase
    .from("customers")
    .select("id, name")
    .eq("slug", CUSTOMER.slug)
    .single();

  if (existing) {
    console.error(`Slug "${CUSTOMER.slug}" already exists (${existing.name}, ID: ${existing.id})`);
    console.error("Choose a different slug or update the existing customer.");
    process.exit(1);
  }

  // Insert customer
  const { data, error } = await supabase
    .from("customers")
    .insert({
      name: CUSTOMER.name,
      slug: CUSTOMER.slug,
      phone: CUSTOMER.phone,
      email: CUSTOMER.email,
      sms_number: CUSTOMER.sms_number,
      website_domain: CUSTOMER.website_domain,
      google_review_link: CUSTOMER.google_review_link,
      timezone: CUSTOMER.timezone,
      quiet_hours_start: CUSTOMER.quiet_hours_start,
      quiet_hours_end: CUSTOMER.quiet_hours_end,
      sla_response_minutes: CUSTOMER.sla_response_minutes,
      review_delay_hours: CUSTOMER.review_delay_hours,
      plan: CUSTOMER.plan,
      config: CUSTOMER.config,
      active: CUSTOMER.active,
    })
    .select("id, slug, name")
    .single();

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log("\n✅ Customer created successfully!\n");
  console.log(`   ID:    ${data.id}`);
  console.log(`   Name:  ${data.name}`);
  console.log(`   Slug:  ${data.slug}`);
  console.log(`   URL:   ${process.env.APP_BASE_URL || "https://opsfabricpilot.vercel.app"}/${data.slug}`);
  console.log(`\n   Services: ${CUSTOMER.config.services.length}`);
  console.log(`   Intents:  ${CUSTOMER.config.intents.length}`);
  console.log(`\nNext steps:`);
  console.log(`   1. Visit /${data.slug} to verify the website`);
  console.log(`   2. POST /api/ticket with customer_slug="${data.slug}" to test ticketing`);
  console.log(`   3. Fill in google_review_link to activate review engine`);
}

main().catch(console.error);
