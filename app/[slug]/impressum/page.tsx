import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/lib/customer";
import { formatPhoneDisplay } from "@/lib/phone";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) return {};
  return { title: `Impressum — ${customer.name}` };
}

export default async function ImpressumPage({ params }: PageProps) {
  const { slug } = await params;
  const customer = await getCustomerBySlug(slug);
  if (!customer) notFound();

  const cfg = customer.config;

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Impressum</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700 leading-relaxed">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Betreiber dieser Website</h2>
            <p>
              {customer.name}<br />
              {cfg.address}<br />
              {cfg.plz} {cfg.ort}<br />
              Schweiz
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Kontakt</h2>
            <p>
              Telefon: {formatPhoneDisplay(customer.phone)}<br />
              E-Mail: {customer.email}<br />
              Website: {customer.website_domain}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Vertretungsberechtigte Personen</h2>
            <p>
              Ramon Dörfler (Präsident)<br />
              Luzian Dörfler (Mitglied des Verwaltungsrates)
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Handelsregistereintrag</h2>
            <p>
              Aktiengesellschaft (AG)<br />
              UID: CHE-110.607.871<br />
              Handelsregisteramt des Kantons Zürich
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Haftungsausschluss</h2>
            <p>
              Der Autor übernimmt keine Gewähr für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit
              und Vollständigkeit der Informationen auf dieser Website. Haftungsansprüche gegen den Autor
              wegen Schäden materieller oder immaterieller Art, die aus dem Zugriff oder der Nutzung bzw.
              Nichtnutzung der veröffentlichten Informationen entstanden sind, werden ausgeschlossen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Urheberrecht</h2>
            <p>
              Die auf dieser Website enthaltenen Inhalte und Werke sind urheberrechtlich geschützt.
              Jede Verwertung ausserhalb der Grenzen des Urheberrechts bedarf der Zustimmung des
              jeweiligen Autors.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-neutral-900">Technische Umsetzung</h2>
            <p>
              FlowSight GmbH —{" "}
              <a href="https://flowsight.ch" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                flowsight.ch
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
