import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/customer";
import { WizardContainer } from "@/components/wizard/wizard-container";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ flow?: string; intent?: string; ref?: string; phone?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) return {};
  return {
    title: `Anfrage starten — ${customer.name}`,
    description: `Starten Sie Ihre Anfrage bei ${customer.name}. Beschreiben Sie Ihr Anliegen — wir melden uns schnellstmöglich.`,
  };
}

export default async function AnfragePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const customer = await getCustomerBySlug(slug);
  if (!customer) notFound();

  return (
    <section className="min-h-[80vh] py-8 sm:py-16 bg-gradient-to-b from-primary-50/50 to-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <WizardContainer
          customer={customer}
          initialFlow={sp.flow === "A" ? "A" : sp.flow === "C" ? "C" : undefined}
          initialIntent={sp.intent}
          ref_source={sp.ref}
          prefilledPhone={sp.phone}
        />
      </div>
    </section>
  );
}
