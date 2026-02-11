import { redirect } from "next/navigation";
import { getAllActiveCustomers } from "@/lib/customer";
import Link from "next/link";

/**
 * Root page — redirects to default customer or shows customer list.
 * Set DEFAULT_CUSTOMER_SLUG env var to auto-redirect.
 */
export default async function RootPage() {
  const defaultSlug = process.env.DEFAULT_CUSTOMER_SLUG;

  if (defaultSlug) {
    redirect(`/${defaultSlug}`);
  }

  // No default slug → show platform landing with active customers
  const customers = await getAllActiveCustomers();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          OpsFabric
        </h1>
        <p className="text-neutral-600 mb-10">
          Operations-Plattform von FlowSight GmbH
        </p>

        {customers.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider">
              Aktive Kunden
            </h2>
            {customers.map((c) => (
              <Link
                key={c.id}
                href={`/${c.slug}`}
                className="block p-4 bg-white rounded-lg border border-neutral-200 hover:border-primary-400 hover:shadow-sm transition-all"
              >
                <span className="font-medium text-neutral-900">{c.name}</span>
                <span className="text-neutral-400 ml-2 text-sm">/{c.slug}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500">Noch keine Kunden konfiguriert.</p>
        )}
      </div>
    </main>
  );
}
