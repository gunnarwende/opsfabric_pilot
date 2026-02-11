import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/customer";
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
  const customer = await getCustomerBySlug(slug);
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
  const customer = await getCustomerBySlug(slug);

  if (!customer) {
    notFound();
  }

  // Headless mode: website module disabled → minimal layout
  if (customer.modules?.website === false) {
    return (
      <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">{customer.name}</h1>
          <p className="text-neutral-600 mb-6">
            {customer.config?.address && `${customer.config.address}, ${customer.config.plz} ${customer.config.ort}`}
          </p>
          <div className="space-y-3">
            <a
              href={`tel:${customer.phone}`}
              className="block w-full py-3 px-4 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
            >
              Anrufen: {customer.phone}
            </a>
            <a
              href={`/${slug}/anfrage`}
              className="block w-full py-3 px-4 bg-white text-primary-600 border border-primary-200 rounded-lg font-medium hover:bg-primary-50 transition"
            >
              Online-Anfrage starten
            </a>
          </div>
          {children}
        </div>
      </main>
    );
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
