# Shopify Analytics im Headless-Shop

Stand: 12.11.2026

## Warum

Der Headless-Shop lädt keine Theme-Skripte von Shopify. Bis jetzt hat Shopify deshalb nur Sitzungen gesehen, die im Checkout begonnen haben. Sitzungen, Konversionsrate, Funnel und Live-Ansicht waren damit nicht aussagekräftig.

## Was gesendet wird

Gesendet wird **nur nach Zustimmung zur Erfolgsmessung** (iubenda Zweck 4 → Shopify „analytics“). Ereignisse aus der Zeit vor der Entscheidung warten und gehen raus, sobald Shopify die Zustimmung meldet. Ohne Zustimmung wird nichts gesendet.

Die Ereignisse gehen direkt aus dem Browser an `https://checkout.doctorbox.de/.well-known/shopify/monorail/unstable/produce_batch`:

| Ereignis | Wann | Inhalt |
|---|---|---|
| Seitenaufruf | Jede Seite, auch bei Seitenwechsel ohne Neuladen | Seitentyp (Startseite, Kategorie, Suche, Blog, Richtlinien, Seite), URL, Titel, Herkunftsseite (Referrer) |
| Produktaufruf | Jede Produktseite | Zusätzlich Produkt, Variante, Preis, SKU |
| In den Warenkorb | Hinzufügen oder Menge erhöhen | Produkt, Menge, Warenkorb-ID, Gesamtwert des Warenkorbs |

Jedes Ereignis enthält außerdem:

- Shop-ID `gid://shopify/Shop/56469913683`
- Storefront-ID `392908` (Headless-Kanal)
- Besucher- und Sitzungs-Kennung, stabil über Seitenaufrufe hinweg (siehe „Stabile Kennungen“)
- Währung EUR, Sprache DE oder EN
- User-Agent
- Einwilligungen (Analytics, Marketing, Datenverkauf)
- `gdpr_enforced: true` (Verkauf nur in die EU)

**Unverändert:**

- Die Warenkorb-Anfragen an die Storefront API (über unseren Server, ohne Besucher-Kennung)
- Die Übergabe der Einwilligung an Shopify (`Analytics.tsx`, iubenda → `setTrackingConsent`)

## Stabile Kennungen (Proxy)

Ohne Shopifys Cookies erzeugt die Customer Privacy API bei jedem Seitenaufruf neue Kennungen. Jeder Seitenaufruf wäre dann ein neuer Besucher.

- **Route:** `src/app/api/unstable/graphql.json/route.ts`. Sie leitet nur die eine Cookie-Abfrage `consentManagement.cookies` an `checkout.doctorbox.de` weiter. Andere Abfragen beantwortet sie mit 403.
- **Cookies:** Shopify setzt `_shopify_analytics`, `_shopify_marketing` und `_shopify_essential` (HttpOnly, nur `shop.doctorbox.de`). Sie ersetzen die abgeschafften Cookies `_shopify_y` und `_shopify_s`.
- **Einwilligungs-Cookies werden nicht durchgereicht:** Shopify würde `_tracking_consent` löschen und stattdessen `_shopify_cmp` setzen. Beides gibt die Route nicht weiter, damit die Übergabe der Einwilligung unverändert bleibt.
- **Einwilligung wird mitgeschickt:** Die Seite gibt die Entscheidung des Besuchers als vier Ja/Nein-Werte mit (Analytics, Marketing, Präferenzen, Datenverkauf), die Route prüft genau diese vier. Mit leerer Einwilligung wertet Shopify das als „abgelehnt“: keine Besucher-Cookies, keine Kennungen (Fehler bis zum Fix vom 12.11.2026).
- **Browser (`ensureCookies` in `shopify.ts`):** Einmal pro Seitenladung, nur mit Zustimmung. Die Ereignisse verwenden die Kennungen aus Shopifys Antwort.
- **Live getestet:** Nach dem Neuladen bleiben Besucher- und Sitzungs-Kennung gleich. `_tracking_consent` bleibt erhalten.

## Code

- `src/lib/tracking/shopify.ts`: Ereignisse, Warten auf Zustimmung, Seitentypen, Cookie-Abfrage
- `src/app/api/unstable/graphql.json/route.ts`: Proxy für die Cookie-Abfrage
- `src/lib/tracking/config.ts`: Shop-ID, Checkout-Domain, Storefront-ID. Alle drei sind per Env-Variable überschreibbar: `NEXT_PUBLIC_SHOPIFY_SHOP_ID`, `NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN`, `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ID`.
- `src/lib/tracking/events.ts`: Produktaufruf und In den Warenkorb
- `src/components/analytics/RouteTracker.tsx`: Seitenaufrufe
- Paket: `@shopify/hydrogen-react` 2026.4.4 (`sendShopifyAnalytics`, `getClientBrowserParameters`)

## Getestet am 11.11.2026

| Test | Ergebnis |
|---|---|
| Vor der Zustimmung (lokal und live) | Keine Anfrage an Shopify |
| Nach „Allen zustimmen“ | Seitenaufruf, Produktaufruf und In den Warenkorb angenommen (200), keine abgelehnten Ereignisse |
| Ohne Storefront-ID (Commit `e581a84`) | Ereignisse angenommen, aber in der Live-Ansicht kein aktiver Warenkorb |
| Mit Storefront-ID `392908` (Commit `5abcce5`) | „Aktive Warenkörbe“ in der Live-Ansicht steigt, mit einigen Minuten Verzögerung |
| Neuladen vor dem Proxy | Derselbe Besucher bekommt neue Kennungen |
| Neuladen mit Proxy (Commit `823f2d8`) | Nur scheinbar stabil: Ein neuer Besucher bekam keine Kennungen (`null`), weil die Einwilligung leer war. Bei uns gab es die Cookies schon aus Tests. |
| Proxy mit echter Einwilligung (12.11.2026, lokal) | Neuer Besucher bekommt Kennungen und Cookies, nach Neuladen dieselben Kennungen. `_tracking_consent` bleibt erhalten. Ungültige Einwilligung → 400, fremde Abfrage → 403 |

## Erkenntnisse

- **Storefront-ID ist Pflicht.** Ohne sie (Wert `"0"`) nimmt Shopify die Ereignisse zwar an, ordnet sie aber keinem Kanal zu. Die ID steht in der Admin-URL des Headless-Storefronts.
- **Die alten Cookies gibt es nicht mehr.** `_shopify_y` und `_shopify_s` sind seit April 2026 abgeschafft. Die neuen Cookies setzt Shopify nur über die eigene Domain (Proxy). `useShopifyCookies` mit `hasUserConsent` und `domain` gibt es in hydrogen-react 2026.4 nicht mehr.
- **Bruch in der Zeitreihe ab 11.11.2026:** Sessions und Conversion Rate in Shopify sind vorher und nachher nicht vergleichbar. Vorher zählte Shopify nur Checkout-Sitzungen, die Conversion Rate war deshalb zu hoch.
- **Die Live-Ansicht hinkt hinterher.** Ein Warenkorb zählt 10 Minuten als aktiv.

## Offen

- **Berichte in 1–2 Tagen prüfen:** Unter „Sitzungen nach Landingpage“ sollten Shop-Seiten (`/`, `/products/...`) erscheinen, nicht nur Checkout-Seiten. Konversionsrate und Funnel sollten realistischer werden.
- **Shop → Checkout:** Die Besucher-Cookies gelten nur auf `shop.doctorbox.de`, der Checkout sieht sie nicht. Ob Shopify Shop und Checkout trotzdem verbindet, zeigt der Funnel in den Berichten. Falls nicht, hilft Variante A: Der Warenkorb trägt dann die stabile Kennung.
- **Die Route wird pro Seitenladung zweimal aufgerufen:** Das ist harmlos, die Ursache ist aber noch nicht geklärt.
- **Variante A liegt als Git-Stash bereit**, falls die Warenkörbe doch nicht sauber gezählt werden. Der Stash heißt „Variante A: Besucher-Kennung bei Warenkorb-Anfragen“. Mit Zustimmung schickt er bei jeder Warenkorb-Anfrage die Besucher-Kennung und die Storefront-ID mit, wie es der Warenkorb von Shopify selbst (`hydrogen-react`) tut. Löschen, sobald die Zahlen stimmen.
- **Fallback Variante B:** Ein Storefront-API-Proxy auf der eigenen Domain, wie Shopify ihn empfiehlt. Er greift in die Cookie-Behandlung ein und damit in die Übergabe der Einwilligung. Deshalb nur nach Rücksprache mit Julian.
- **Teil 2 (Consent Mode Advanced):** erst nach Julians Freigabe.

## Quellen

- [Shopify-Hilfe: Live-Ansicht](https://help.shopify.com/en/manual/reports-and-analytics/shopify-reports/live-view)
- [Shopify: Cookies für eigene Headless-Setups (Abschaffung `_shopify_y`/`_shopify_s`, Proxy)](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/cookies-custom-setup)
- [Shopify Community: Aktive Warenkörbe bei Storefront-API-Warenkörben](https://community.shopify.com/t/adding-or-removing-line-items-from-cart-causes-active-cart-count-to-skyrocket-with-storefront-api/407620)
- [hydrogen-react: sendShopifyAnalytics](https://shopify.dev/docs/api/hydrogen-react/latest/utilities/sendshopifyanalytics)
