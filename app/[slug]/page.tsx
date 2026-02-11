import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/customer";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { ServicesGrid } from "@/components/sections/services-grid";
import { Heritage } from "@/components/sections/heritage";
import { Reviews } from "@/components/sections/reviews";
import { CtaSection } from "@/components/sections/cta-section";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function HomePage({ params }: PageProps) {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);

  if (!customer) {
    notFound();
  }

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `https://${customer.website_domain}`,
            name: customer.name,
            description: customer.config.hero_claim,
            telephone: customer.phone,
            email: customer.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: customer.config.address,
              postalCode: customer.config.plz,
              addressLocality: customer.config.ort,
              addressCountry: "CH",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 47.2717,
              longitude: 8.5813,
            },
            aggregateRating: customer.config.google_rating
              ? {
                  "@type": "AggregateRating",
                  ratingValue: customer.config.google_rating,
                  reviewCount: customer.config.google_review_count,
                  bestRating: 5,
                }
              : undefined,
            openingHoursSpecification: [
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "08:00",
                closes: "12:00",
              },
              {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "13:00",
                closes: "17:00",
              },
            ],
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Leistungen",
              itemListElement: customer.config.services?.map((s) => ({
                "@type": "Offer",
                itemOffered: {
                  "@type": "Service",
                  name: s.name,
                  description: s.short_description,
                },
              })),
            },
          }),
        }}
      />

      <Hero customer={customer} />
      <TrustBar customer={customer} />
      <ServicesGrid customer={customer} />
      <Heritage customer={customer} />
      <Reviews customer={customer} />
      <CtaSection customer={customer} />
    </>
  );
}
