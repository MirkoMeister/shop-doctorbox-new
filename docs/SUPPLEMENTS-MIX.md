# Personalisierter Nährstoffmix (Riise) – Stand

Grundlage: Issue dctrbx/heimtests-new-shop#12 und Julians Briefing-Paket vom 05.11.2026
(`questionnaire.de.json`, `product-rules.template.json` liegen unverändert unter `src/content/supplement-mix/`).

## Was gebaut ist (Phase 1: Demo, nur lokal)

Seite `/vitamine` (nur Deutsch, `noindex`, nirgends verlinkt, nicht in der Sitemap).

| Teil | Stand |
|---|---|
| Einstieg, Demo-Hinweis, Einwilligung (nicht vorausgewählt, Ablehnung → selbst zusammenstellen) | **Demo** |
| Fragebogen aus `questionnaire.de.json`: 4 Gruppen mit Fortschritt, Pflichtfelder, exklusive Antworten, max. 3 Ziele, Folgefrage „bereits eingenommene Nährstoffe“, Verzweigungs- und Risikoregeln | **Demo** (Logik vollständig nach JSON) |
| Ergebnis-Zustände `ready` / `insufficient_data` / `not_supported` / `rule_configuration_missing` | **Demo**: `ready` zeigt nur den gekennzeichneten Beispielmix aus dem Briefing (Vitamin D3 20 µg, Magnesium 200 mg), unabhängig von den Antworten |
| Zutatenkatalog: live aus Riises öffentlichem Katalog (`GET /ingredient/all`, aktiv + B2B, derzeit 32 Zutaten, 1× täglich aktualisiert); Ersatz bei Ausfall: die 7 Nährstoffe des Briefings. Nur eine Form je Nährstoff (Folsäure oder L-5-MTHF). Keine Mengen oder Preise aus dem Katalog | **Live-Daten, nur lesend** |
| Rezeptur-Editor: Nährstoffe hinzufügen/entfernen, Mengen mit Komma, exakte µg→mg-Umrechnung als Dezimal-String, Omega-3 als eigenes Produkt (Ausschluss bei Fischallergie, vegetarisch, vegan) | **Demo** (nur Formatprüfung, keine Grenzen) |
| Warenkorb mit Positionsattributen `_db_formula_mg`, `_db_catalog_version`, `_db_mix_ref` | **Simulation**, nichts geht an Shopify |
| Zahlung, Prüfung, Riise-Übergabe, Versandstatus, Riise-Auftragsdaten (Beispielkunde aus dem Briefing) | **Simulation**, nichts geht an Riise |

Antworten bleiben im Arbeitsspeicher des Browserfensters: keine URL-Parameter, kein Speicher, keine Analytics-Ereignisse, keine Netzwerkaufrufe.

Code: `src/lib/supplement-mix/engine.ts` (Regeln, Mengen, Empfehlungs-Zustände), `src/lib/supplement-mix/riise-catalog.ts` (Riise-Katalog), `src/content/supplement-mix/catalog.ts` (Ersatzliste, Omega-3, Beispielmix), `src/components/supplement-mix/MixFlow.tsx` (Ablauf).

## Nicht gebaut (bewusst)

- Server-Endpunkte `/api/supplements/*`, Shopify-Webhook `orders/paid`, Datenbank für Aufträge, Riise-Adapter, Fulfillment.
- Echtes Hinzufügen zum Warenkorb (es gibt noch kein Shopify-Produkt bzw. keine Preisstufen).

## Vor Phase 2 extern benötigt

| Punkt | Wer / was |
|---|---|
| Produktregeln | erlaubte Formen (u. a. Folat: Riise-ID 26 oder 33), Grenzen, Schrittweiten, Kombinationen, Zielgruppen, Allergen- und Vegan-Angaben je Zutat |
| Empfehlungsregeln | fachliche Logik mit Quelle, Verantwortlichem, Version; sonst bleibt es bei „kein Vorschlag“ |
| Preismodell | Herstellerkosten, Verkaufspreise als Shopify-Varianten/Preisstufen, Rabattregeln, Versand |
| Shopify | Plan (Checkout-Validierung braucht für eigene Functions Shopify Plus), Riise-Standort, Versandprofil, Pflicht-Telefonnummer |
| Backend | Datenbank auf Scalingo für Webhook-Ereignisse und Riise-Aufträge |
| Riise | bestätigter Testbetrieb, Produktionsschlüssel (nur in Scalingo-Umgebung), Verhalten bei doppelter `orderId`, Storno |
| Recht | Einwilligungstext Gesundheitsdaten (Art. 9 DSGVO), Auftragsverarbeitung mit Riise, Datenschutzerklärung, Widerrufsausschluss für personalisierte Ware |
