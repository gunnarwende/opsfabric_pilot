import { notFound } from "next/navigation";
import { getCustomerBySlug } from "@/config/customers/doerfler-ag";
import { formatPhoneDisplay } from "@/lib/phone";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) return {};
  return { title: `Datenschutzerklärung — ${customer.name}` };
}

export default async function DatenschutzPage({ params }: PageProps) {
  const { slug } = await params;
  const customer = getCustomerBySlug(slug);
  if (!customer) notFound();

  const cfg = customer.config;

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-8">Datenschutzerklärung</h1>

        <div className="prose prose-neutral max-w-none space-y-6 text-neutral-700 leading-relaxed">
          <p>
            <strong>Verantwortliche Stelle:</strong><br />
            {customer.name}<br />
            {cfg.address}<br />
            {cfg.plz} {cfg.ort}<br />
            Telefon: {formatPhoneDisplay(customer.phone)}<br />
            E-Mail: {customer.email}
          </p>
          <p><strong>Stand:</strong> 10. Februar 2026</p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">1. Allgemein</h2>
          <p>
            {customer.name} nimmt den Schutz Ihrer Personendaten ernst. Diese Datenschutzerklärung informiert
            Sie darüber, welche Personendaten wir im Zusammenhang mit unserer Website und unseren Dienstleistungen
            bearbeiten, zu welchem Zweck und auf welcher Grundlage.
          </p>
          <p>
            Wir richten uns nach dem Schweizer Datenschutzgesetz (DSG) sowie, soweit anwendbar, der
            EU-Datenschutz-Grundverordnung (DSGVO).
          </p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">2. Welche Daten wir erheben</h2>
          <p><strong>a) Bei Besuch unserer Website:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Technische Daten: IP-Adresse, Browser-Typ, Betriebssystem, Zugriffszeit, aufgerufene Seiten</li>
            <li>Diese Daten werden anonymisiert und dienen der Sicherstellung des Betriebs und der Verbesserung unserer Website</li>
          </ul>

          <p><strong>b) Bei Nutzung unseres Anfrageformulars (Wizard):</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name, Telefonnummer, E-Mail-Adresse (sofern angegeben)</li>
            <li>PLZ / Ort / Adresse</li>
            <li>Art und Beschreibung der Anfrage</li>
            <li>Fotos (sofern hochgeladen)</li>
            <li>Zeitpunkt und Präferenzen</li>
          </ul>

          <p><strong>c) Bei telefonischem Kontakt / verpassten Anrufen:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Telefonnummer des Anrufers</li>
            <li>Zeitpunkt des Anrufs</li>
            <li>Ihre Antwort auf unsere Rück-SMS (sofern Sie antworten)</li>
          </ul>

          <p><strong>d) Bei Auftragsabwicklung:</strong></p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Auftragsbezogene Daten (Adresse, Terminvereinbarung, Auftragsdetails)</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">3. Zweck der Datenbearbeitung</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bearbeitung Ihrer Anfragen und Aufträge</li>
            <li>Kontaktaufnahme per Telefon, SMS oder E-Mail im Zusammenhang mit Ihrer Anfrage</li>
            <li>Terminvereinbarung und Auftragskoordination</li>
            <li>Versand von Auftragsbestätigungen und Statusmeldungen per SMS</li>
            <li>Einmalige Anfrage nach Auftragsabschluss, ob Sie eine Google-Bewertung abgeben möchten</li>
            <li>Verbesserung unserer Dienstleistungen und unserer Website</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">4. Rechtsgrundlage</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ihrer Einwilligung (Art. 31 Abs. 1 DSG), insbesondere bei der Nutzung des Anfrageformulars</li>
            <li>Vertragsdurchführung (Art. 31 Abs. 2 lit. a DSG) bei Auftragsbearbeitung</li>
            <li>Berechtigtem Interesse (Art. 31 Abs. 2 lit. a DSG) bei der Kontaktaufnahme nach verpassten Anrufen</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">5. Weitergabe an Dritte</h2>
          <p>Wir geben Ihre Daten nur weiter, soweit dies zur Erbringung unserer Dienstleistungen erforderlich ist:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-2 pr-4 font-semibold">Empfänger</th>
                  <th className="text-left py-2 pr-4 font-semibold">Zweck</th>
                  <th className="text-left py-2 font-semibold">Standort</th>
                </tr>
              </thead>
              <tbody className="text-neutral-600">
                <tr className="border-b border-neutral-100">
                  <td className="py-2 pr-4">FlowSight GmbH</td>
                  <td className="py-2 pr-4">Technischer Betrieb der Website und des Anfrage-Systems</td>
                  <td className="py-2">Schweiz</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-2 pr-4">Supabase Inc.</td>
                  <td className="py-2 pr-4">Datenbank-Hosting (EU-Region Frankfurt)</td>
                  <td className="py-2">EU (Deutschland)</td>
                </tr>
                <tr className="border-b border-neutral-100">
                  <td className="py-2 pr-4">Vercel Inc.</td>
                  <td className="py-2 pr-4">Website-Hosting</td>
                  <td className="py-2">Global (Edge)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>Wir verkaufen Ihre Daten nicht und nutzen sie nicht für Werbezwecke Dritter.</p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">6. Aufbewahrung und Löschung</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Anfrage-Daten: Werden nach 24 Monaten Inaktivität anonymisiert</li>
            <li>Auftrags-Daten: Aufbewahrung gemäss gesetzlicher Pflichten (10 Jahre)</li>
            <li>Fotos: Werden nach Auftragsabschluss und Ablauf der Aufbewahrungsfrist gelöscht</li>
            <li>Sie können jederzeit die Löschung Ihrer Daten verlangen</li>
          </ul>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">7. Ihre Rechte</h2>
          <p>Sie haben das Recht auf:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Auskunft</strong> über Ihre gespeicherten Personendaten</li>
            <li><strong>Berichtigung</strong> unrichtiger Daten</li>
            <li><strong>Löschung</strong> Ihrer Daten (soweit keine gesetzliche Aufbewahrungspflicht besteht)</li>
            <li><strong>Widerruf</strong> Ihrer Einwilligung (mit Wirkung für die Zukunft)</li>
            <li><strong>Datenübertragbarkeit</strong> in einem gängigen Format</li>
          </ul>
          <p>Zur Ausübung Ihrer Rechte kontaktieren Sie uns unter: {customer.email} oder {formatPhoneDisplay(customer.phone)}</p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">8. Cookies</h2>
          <p>
            Unsere Website verwendet nur technisch notwendige Cookies. Es werden keine Tracking-Cookies
            oder Analyse-Tools von Drittanbietern eingesetzt.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">9. Änderungen</h2>
          <p>Wir können diese Datenschutzerklärung jederzeit anpassen. Die aktuelle Version ist auf unserer Website einsehbar.</p>

          <h2 className="text-xl font-bold text-neutral-900 mt-8">10. Kontakt und Aufsichtsbehörde</h2>
          <p>
            Bei Fragen zum Datenschutz:<br />
            {customer.name}<br />
            {customer.email}<br />
            {formatPhoneDisplay(customer.phone)}
          </p>
          <p>
            Zuständige Aufsichtsbehörde:<br />
            Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB)<br />
            Feldeggweg 1, 3003 Bern<br />
            www.edoeb.admin.ch
          </p>
        </div>
      </div>
    </section>
  );
}
