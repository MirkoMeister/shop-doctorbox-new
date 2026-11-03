# Apps, Tracking und Merchant Center nach dem Headless-Umzug

**Stand:** 03.11.2026. Quellen: Live-Theme `DoctorBoxShopifyTheme/master` (147115999562) per Shopify CLI gelesen (`config/settings_data.json`, `layout/theme.liquid`, Snippets), Web-Pixel-Liste aus dem Seitenquelltext von shop.doctorbox.de, öffentlicher GTM-Container `GTM-N3DHSDL`.

Grundregel: Alles, was im **Theme** läuft (App-Einbettungen, Snippets, Skripte in `theme.liquid`), fehlt im Headless-Shop. Alles, was im **Shopify-Backend** oder im **Checkout** läuft (Web-Pixel der Apps, Custom Pixels, Feeds, Webhooks), läuft weiter, weil der Checkout bei Shopify bleibt.

## 1. Vor dem Go-live erledigen

| # | Punkt | Wer | Status |
|---|---|---|---|
| 1 | **Widerrufsformular** (§ 356a BGB): Die App „EU Widerruf Button“ bleibt. Footer-Link „Vertrag widerrufen“ auf jeder Seite, `/pages/widerruf-formular` leitet auf die App-Seite der Shopify-Domain, das Weiterleitungs-Theme nimmt die Seite aus (per CLI ins Duplikat gepusht). | Code + Theme | erledigt (ac53ea8) |
| 2 | Google- und Meta-Bestätigungs-Tags (Merchant Center, Search Console, Meta-Domain) | Code | erledigt, live auf Scalingo |
| 3 | Merchant Center: Attributregel `link` = `checkout.doctorbox.de` → `shop.doctorbox.de` (Feed nimmt die primäre Domain) | Marketing | direkt nach dem Umschalten |
| 4 | Testbestellung mit einem Bundle (z. B. STI Complete Trio): Bestellung im Admin zeigt die Komponenten? Simple Bundles v2 ist als Theme-Einbettung aktiv. | Mirko | offen |
| 5 | Weiterleitungs-Theme mit App-Proxy-Ausnahme (`/apps/`, `/tools/`) | Mirko | erledigt (per CLI geprüft) |

## 2. Theme-Apps: was wegfällt

| App-Einbettung / Snippet | Im Headless-Shop | Empfehlung |
|---|---|---|
| EU Widerruf Button | Formular über die Shopify-Domain | erledigt, siehe 1.1 |
| Simple Bundles v2 | Theme-Skript fehlt, Bundles über die Storefront-API | mit Testbestellung prüfen (1.4) |
| Shopify Inbox (Chat) | **fehlt** | Chat gewünscht? Sonst übernimmt Mira |
| Lucky Orange (Heatmaps) | fehlt | deinstalliert (03.11.2026) |
| Google & YouTube „Store widget“ | fehlt | optional (Shop-Bewertungsbadge) |
| Microsoft Clarity (App-Einbettung) | über GTM weiter vorhanden | nichts |
| Klaviyo Onsite (Formulare, Tracking) | klaviyo.js wird nach Einwilligung geladen, Formulare erscheinen; „Viewed Product“/„Added to Cart“ nachgebaut (c4d2fba) | nichts |
| Yoast SEO, IndexGPT (Schema), AVADA SEO | ersetzt durch eigene Metadaten und JSON-LD | IndexGPT kann deinstalliert werden: sein Schema-Block gibt im alten Theme nichts mehr aus, `llms.txt` kommt vom Shop bzw. von Shopify |
| Cookie-Banner (GDPR legal cookie / Complianz) | ersetzt durch iubenda, Einwilligung geht an Shopify | nichts |
| KI-Berater (`header-ki-chat`, Backend auf ai-berater-backend.vercel.app) | ersetzt durch Mira | Backend kann nach dem Umzug abgeschaltet werden |
| Zammad-Chat (ticket.doctorbox.de) | **fehlt** | gewünscht? |
| Rebuy Smart Cart, Custom Price Calculator, bcpo, Booster | ersetzt durch eigenen Warenkorb/Produktseite | nichts |
| fraud0, idsync (contentabc), Tracify | fehlen | Tracify bewusst entfallen; fraud0/idsync bei Bedarf |
| Microsoft-UET-Platzhalterblock | entfallen (war fehlerhaft) | nichts |

Nicht genutzt (laut Mirko, 03.11.2026): Judge.me, Bloggle, Lucky Orange. Deaktiviert und damit ohne Auswirkung: Pumper Bundles, Table of Contents, Recurpay-Widget, Clarity Brand Agents, EU-Widerruf schwebender Button.

## 3. Tracking

**Im Checkout (unverändert, Shopify-Web-Pixel):** Google & YouTube (GA4 G-CGV5EJCVQQ, Google Ads AW-11030442108 mit Kauf-Conversion), Meta (725119135330052), Reddit, Klaviyo (Started Checkout, Placed Order), Microsoft Ads (UET 187218266), Pinterest (2613106093844), Lucky Orange, eine weitere App mit `myshopifyDomain`-Konfiguration, 5 Custom Pixels.

**Im Headless-Shop (nach Einwilligung):**
- GTM-N3DHSDL: GA4-Haupttag auf `view_item|view_item_list|select_item|add_to_cart|remove_from_cart|view_cart|begin_checkout|…`, Google-Ads-Basis und Remarketing, Bing UET mit `add_to_cart`, Clarity, TikTok-Basis, Engaged-User-Timer. Der Shop sendet `view_item`, `view_item_list`, `add_to_cart`, `remove_from_cart`, `view_cart` und `begin_checkout` im Format des alten Themes (4079387).
- direkt: Meta (PageView, ViewContent, AddToCart), Reddit, Klaviyo, Plausible (cookielos).

**Lücken:**
- `select_item` (Klick auf ein Produkt in einer Liste) sendet der Shop nicht.
- Pinterest hat im Shop selbst kein Tag, nur im Checkout.
- Die TikTok-Ereignisse im GTM-Container (ViewContent, AddToCart) hängen an `dl_*`-Ereignissen, die weder altes Theme noch neuer Shop senden. Das sollte im GTM-Container auf die GA4-Namen umgestellt werden (Agentur/GTM-Verantwortliche).
- Gleiches gilt für die GA4-Tags mit eigener Mess-ID (`dl_view_item` usw.): Sie stammen offenbar aus einer älteren Einrichtung.

## 4. Google Merchant Center

- Website-Bestätigung: beide `google-site-verification`-Tags stehen auf jeder Seite des neuen Shops. Für mehr Sicherheit zusätzlich die Domain `doctorbox.de` per DNS-TXT-Eintrag in der Search Console bestätigen.
- Produktlinks: Attributregel, siehe 1.3.
- Preise und Verfügbarkeit: JSON-LD mit einem Angebot je Variante und `?variant=`-URL, passend zum Feed.
- Rückgabe- und Versandinfos: `/policies/*` werden vom neuen Shop ausgeliefert.
- Kauf-Conversions für Google Ads: kommen aus dem Checkout-Pixel der Google & YouTube-App, unverändert.

## 5. Bestellungen über Mira

Öffnet jemand ein Produkt aus einer Empfehlung von Mira und legt es danach in den Warenkorb, bekommt die Warenkorbposition die versteckte Eigenschaft `_mira` = `empfohlen` (`src/lib/assistant/attribution.ts`). Shopify übernimmt sie in die Bestellung; im Admin steht sie an der Position, Kunden sehen sie nicht.

Tag „Mira“ per Shopify Flow (einmalig einrichten):
1. Apps → Shopify Flow → Workflow erstellen → Auslöser „Bestellung erstellt“ (Order created).
2. Bedingung: „Bestellung / Positionen / Benutzerdefinierte Attribute / Schlüssel“ ist gleich `_mira` (bei „Mindestens eins von“).
3. Aktion „Bestellungstags hinzufügen“: `Mira`. Workflow aktivieren.

Danach in Bestellungen nach dem Tag `Mira` filtern. Hinweis: Lag dieselbe Variante schon vorher ohne Mira im Warenkorb, steht sie danach zweimal dort (eine Position mit, eine ohne Markierung).
