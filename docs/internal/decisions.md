# Technische Entscheidungen

## SMS-Provider: eCall.ch statt Twilio
**Datum:** Februar 2025
**Entscheidung:** eCall.ch als Produktions-SMS-Provider, nicht Twilio.
**Grund:** Twilio kann auf Schweizer Nummern nicht Voice + SMS auf einer Nummer. Lokale CH-Nummern (+41 43/44) = nur Voice, Mobile (+41 7x) = nur SMS. eCall.ch bietet beides, ist Schweizer Provider, Datenresidenz in der Schweiz.
**Architektur:** Provider-agnostische Abstraktionsschicht (`lib/sms/provider.ts`). Swap ohne Code-Änderung.
**Backup:** ASPSMS (Schweizer Alternative mit Node.js SDK)

## Database: Supabase (nicht Firebase/PlanetScale)
**Datum:** Februar 2025
**Entscheidung:** Supabase auf EU-Region Frankfurt.
**Grund:** Postgres (kein Vendor-Lock), RLS für Multi-Tenancy, DSGVO/DSG-konform (EU-Server), großzügiger Free Tier.

## Styling: Tailwind CSS v4 (nicht v3)
**Datum:** Februar 2025
**Entscheidung:** Tailwind v4 mit `@tailwindcss/postcss` und `@theme` directive.
**Grund:** Neuer Stack, kein Legacy. v4 ist schneller und hat besseren CSS-Output. `@theme` statt `tailwind.config.js`.

## Customer Config: JSONB statt separate Tabellen
**Datum:** Februar 2025
**Entscheidung:** Services, Intents, Reviews, Hero-Content als JSONB in `customers.config` statt separate `services`, `intents`, `reviews` Tabellen.
**Grund:** Flexibel pro Branche (Handwerk hat andere Config als Gastro). Kein Schema-Migration nötig bei neuen Feldern. Für <50 Kunden performant genug.
**Trade-off:** Kein SQL-Querying auf Service-Level (akzeptabel).

## Branch Strategy: Direkt auf main
**Datum:** Februar 2025
**Entscheidung:** Kein dev-Branch, direkt auf main pushen.
**Grund:** Solo-Entwickler, Vercel auto-deploys. Overhead von dev/PR-Workflow nicht gerechtfertigt. Build muss vor Push erfolgreich sein.

## Cron Security: CRON_SECRET Pflicht
**Datum:** Februar 2025
**Entscheidung:** Cron-Endpunkt lehnt IMMER ab wenn CRON_SECRET nicht gesetzt.
**Grund:** Sicherheitslücke gefunden: Originaler Code prüfte `if (cronSecret && ...)` — wenn Env-Var nicht gesetzt, war Endpunkt offen. Fix: `if (!cronSecret || ...)`.

## Webhook Body Parsing: Content-Type Check
**Datum:** Februar 2025
**Entscheidung:** Webhooks prüfen `Content-Type` Header vor Body-Parsing.
**Grund:** `request.formData()` konsumiert Body-Stream. Bei JSON-Content-Type schlug JSON-Fallback fehl. Fix: Content-Type erst prüfen, dann passenden Parser wählen.
