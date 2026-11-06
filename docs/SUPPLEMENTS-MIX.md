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
| Zutaten: feste, versionierte Liste `src/content/supplement-mix/product-config.ts` (Entwurf `2026-11-06-draft`, **nicht freigegeben**): 24 Vitamine und Mineralstoffe mit EU-Referenzwert aus dem Riise-Katalog. Nicht enthalten: Ashwagandha, Kurkuma, Coenzym Q10, MSM, Bacillus coagulans, Lutein, Phytosterine, Alpha-Liponsäure sowie die nicht für B2B freigegebenen Formen (Magnesiumcitrat, Cyanocobalamin). Der Riise-Katalog wird 1× täglich nur abgeglichen: Einträge, die Riise nicht mehr aktiv/B2B führt, fallen raus; er fügt nie Zutaten hinzu. Keine Mengen, Grenzen oder Preise aus dem Katalog | **Entwurf, Abgleich live (nur lesend)** |
| Rezeptur-Editor: Nährstoffe hinzufügen/entfernen, Mengen mit Komma, exakte µg→mg-Umrechnung als Dezimal-String, Omega-3 als eigenes Produkt (Ausschluss bei Fischallergie, vegetarisch, vegan) | **Demo** (nur Formatprüfung, keine Grenzen) |
| Warenkorb mit Positionsattributen `_db_formula_mg`, `_db_catalog_version`, `_db_mix_ref` | **Simulation**, nichts geht an Shopify |
| Zahlung, Prüfung, Riise-Übergabe, Versandstatus, Riise-Auftragsdaten (Beispielkunde aus dem Briefing) | **Simulation**, nichts geht an Riise |

Antworten bleiben im Arbeitsspeicher des Browserfensters: keine URL-Parameter, kein Speicher, keine Analytics-Ereignisse, keine Netzwerkaufrufe.

Code: `src/lib/supplement-mix/engine.ts` (Regeln, Mengen, Empfehlungs-Zustände), `src/content/supplement-mix/product-config.ts` (verkaufbare Zutatenliste), `src/lib/supplement-mix/riise-catalog.ts` (Abgleich mit Riise), `src/content/supplement-mix/catalog.ts` (Typen, Omega-3, Beispielmix), `src/components/supplement-mix/MixFlow.tsx` (Ablauf).

## Starten und testen

Die Demo liegt auf dem Branch `feature/supplements-mix` und ist **nicht** auf `main` (main wird automatisch produktiv deployt).

```bash
git fetch && git checkout feature/supplements-mix
npm install
cp .env.example .env.local   # Shopify-Storefront-Werte eintragen; für /vitamine selbst werden keine Schlüssel gebraucht
npm run dev
```

Dann http://localhost:3000/vitamine öffnen.

Automatische Prüfungen (Mengenformat, exakte µg→mg-Umrechnung, Zutatenliste):

```bash
node scripts/test-supplement-mix.mjs
```

Zum Durchklicken:

1. **Selbst zusammenstellen:** Zutaten hinzufügen/entfernen, Mengen mit Komma eingeben (z. B. `0,5`), ungültige Eingaben (`1e3`, `-1`, `1.000,5`) werden abgelehnt. Folsäure und L-5-MTHF schließen sich aus.
2. **Fragebogen → `not_supported`:** z. B. „regelmäßige Medikamente: ja“ oder Alter unter 18.
3. **Fragebogen → `insufficient_data`:** bei Medikamenten/Erkrankungen „weiß nicht“ wählen.
4. **Fragebogen → `ready`:** unauffällige Angaben; es erscheint nur der gekennzeichnete Beispielmix (D3 20 µg, Magnesium 200 mg).
5. **Omega-3:** bei Fischallergie, vegetarisch oder vegan nicht angeboten.
6. **Warenkorb bis Versandstatus:** reine Simulation. Im Netzwerk-Tab der Entwicklertools darf dabei kein Aufruf an Shopify oder Riise auftauchen.

Simulationen und Shopify-Testzahlungen erzeugen keine Riise-Aufträge: Es gibt in diesem Stand keinen Code, der Riise-Aufträge anlegt.

## Nicht gebaut (bewusst)

- Server-Endpunkte `/api/supplements/*`, Shopify-Webhook `orders/paid`, Datenbank für Aufträge, Riise-Adapter, Fulfillment.
- Echtes Hinzufügen zum Warenkorb (es gibt noch kein Shopify-Produkt bzw. keine Preisstufen).

## Vor Phase 2 extern benötigt

| Punkt | Wer / was |
|---|---|
| Produktregeln | Freigabe der Zutatenliste, Mengenbereiche, Schrittweiten, Kombinationen, Zielgruppen; je Zutat Vegan-/Allergenstatus und Bezug der mg-Menge (Tagesportion, Wirkstoff oder Rohstoff) aus vorhandenen Riise-Unterlagen dokumentieren |
| Empfehlungsregeln | fachliche Logik mit Quelle, Verantwortlichem, Version; sonst bleibt es bei „kein Vorschlag“ |
| Preismodell | Verkaufspreis = Riise-Einkaufspreis der Rezeptur × 1,25, Riise-Versand ohne Aufschlag; offen: Quelle des Einkaufspreises je Rezeptur und verbindliche Abbildung im Shopify-Checkout |
| Shopify | Plan (Checkout-Validierung braucht für eigene Functions Shopify Plus), Riise-Standort, Versandprofil, Pflicht-Telefonnummer |
| Backend | Datenbank auf Scalingo für Webhook-Ereignisse und Riise-Aufträge |
| Riise | bestätigter Testbetrieb, Produktionsschlüssel (nur in Scalingo-Umgebung), Verhalten bei doppelter `orderId`, Storno |
| Recht | Einwilligungstext Gesundheitsdaten (Art. 9 DSGVO), Auftragsverarbeitung mit Riise, Datenschutzerklärung, Widerrufsausschluss für personalisierte Ware |
