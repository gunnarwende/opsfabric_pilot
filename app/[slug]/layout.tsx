import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/config/customers/doerfler-ag";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCta } from "@/components/layout/floating-cta";
import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) return {};

  const cfg = customer.config;
  return {
    title: {
      template: `%s — ${customer.name}`,
      default: `${customer.name} — ${cfg.hero_claim}`,
    },
    description: `${customer.name}: ${cfg.services?.map((s) => s.name).join(", ")} in ${cfg.ort}. ${cfg.hero_claim}`,
    openGraph: {
      title: `${customer.name} — ${cfg.hero_claim}`,
      description: cfg.hero_benefits?.join(" | "),
      type: "website",
    },
  };
}

export default async function CustomerLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);

  if (!customer) {
    notFound();
  }

  return (
    <>
      <Header customer={customer} />
      <main className="pt-[calc(2.5rem+4rem)]">
        {children}
      </main>
      <Footer customer={customer} />
      <FloatingCta phone={customer.phone} slug={customer.slug} />
    </>
  );
}
