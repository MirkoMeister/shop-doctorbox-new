# Go-live: Umzug von shop.doctorbox.de auf den Headless-Shop

**Stand:** 02.11.2026 · Hosting: **Scalingo** (App `doctorbox-shop`, Region osc-fr1, deployt automatisch aus `dctrbx/heimtests-new-shop` `main`). Das Vercel-Projekt ist gelöscht. Reihenfolge einhalten. Häkchen setzen, wenn erledigt.

## A. Vorbereitung (vor dem Umschalten)

- [ ] **Checkout-Domain:** DNS `checkout.doctorbox.de` als CNAME auf `shops.myshopify.com` In Shopify unter Einstellungen → Domains als **zusätzliche** Domain verbinden. Warten, bis `https://checkout.doctorbox.de` ohne Zertifikatsfehler auf `shop.doctorbox.de` weiterleitet.
- [ ] **Scalingo, Umgebungsvariablen** (App → Environment): `SHOPIFY_STORE_DOMAIN=doctorbox-heimtests.myshopify.com` (zeigt sie auf `shop.doctorbox.de`, ruft der Shop nach dem DNS-Wechsel sich selbst auf und fällt aus). `NEXT_PUBLIC_SITE_URL=https://shop.doctorbox.de` oder leer lassen. `SHOPIFY_ONLINE_STORE_DOMAIN=checkout.doctorbox.de` ist bereits aktiv. Außerdem vollständig: Storefront-Token, `ETRUSTED_*`, `NEXT_PUBLIC_KLAVIYO_COMPANY_ID`, `KLAVIYO_LIST_ID`, privater Klaviyo-Schlüssel, Anthropic-Schlüssel. `NEXT_PUBLIC_*`-Werte werden beim Build eingebaut: nach einer Änderung neu deployen (Deploy → Manual deploy), ein Neustart reicht nicht.
- [ ] **Scalingo, Domain:** App → Settings → Domains → `shop.doctorbox.de` hinzufügen. Ziel für den DNS-Eintrag ist `doctorbox-shop.osc-fr1.scalingo.io` (CNAME). Keine „Canonical domain“ setzen.
- [ ] **Rabattcode `MOVEMBER26`** in Shopify anlegen (20 % auf alle Heimtests, 1.–30.11.). Die Seite bewirbt ihn an 20 Stellen, Shopify meldet ihn heute als nicht anwendbar.
- [ ] **Weiterleitungs-Theme vorbereiten:** Das live Theme duplizieren und im Duplikat in `layout/theme.liquid` direkt nach `<head>` den Block aus Abschnitt D einfügen. Noch **nicht** veröffentlichen (erst nach dem DNS-Wechsel, Schritt B3).
- [ ] **Shopify-URL-Weiterleitungen** exportieren (Onlineshop → Navigation → URL-Weiterleitungen → Exportieren) und in den Shop übernehmen lassen.

## B. Umschalten (direkt hintereinander, ruhige Uhrzeit)

1. [ ] Shopify: `checkout.doctorbox.de` als **primäre** Domain festlegen.
2. [ ] DNS (Route 53): `shop.doctorbox.de` als CNAME auf `doctorbox-shop.osc-fr1.scalingo.io` umstellen (heute CNAME auf `shops.myshopify.com`, TTL steht bereits niedrig). Prüfen, dass `https://shop.doctorbox.de` den neuen Shop zeigt.
3. [ ] Shopify: erst **jetzt** das Weiterleitungs-Theme veröffentlichen. Vorher würde es auf `shop.doctorbox.de` weiterleiten, das noch bei Shopify liegt: Endlosschleife.
4. [ ] Shopify: `shop.doctorbox.de` aus den Domains entfernen.
5. [ ] Scalingo: prüfen, dass `https://shop.doctorbox.de/account` auf `checkout.doctorbox.de/account` weiterleitet (`SHOPIFY_ONLINE_STORE_DOMAIN`, bereits aktiv).

Zwischen 1 und 3 läuft der alte Shop wenige Minuten unter der Checkout-Domain; nach 2 kann `shop.doctorbox.de` ein bis zwei Minuten einen Zertifikatsfehler zeigen, bis Scalingo das Let's-Encrypt-Zertifikat ausgestellt hat.

## C. Prüfen (direkt danach)

- [ ] `https://shop.doctorbox.de` liefert den neuen Shop (Header `x-request-id`, kein `x-shopid`), ohne `X-Robots-Tag: noindex`, mit gültigem Zertifikat.
- [ ] Produkt in den Warenkorb, „Zur Kasse“: Checkout lädt auf `checkout.doctorbox.de`, Cookie-Einwilligung ist übernommen, Testbestellung bis zur Bestätigung.
- [ ] `https://checkout.doctorbox.de/products/sti-pro-10?variant=…` leitet auf `shop.doctorbox.de` mit Pfad und Variante weiter.
- [ ] Kundenkonto-Link und Bestellstatus-Link aus einer Bestellmail funktionieren.
- [ ] Alte URLs (Sitemap-Abgleich) und UCP-Endpunkte (`/.well-known/ucp`, `/api/ucp/mcp`) erneut prüfen.
- [ ] Google Search Console: Sitemap `https://shop.doctorbox.de/sitemap.xml` einreichen.
- [ ] **Google Merchant Center und Meta-Katalog:** Die Shopify-Kanäle übernehmen die primäre Domain in die Produktlinks (`checkout.doctorbox.de/products/…`). Im Merchant Center eine Attributregel für `link` anlegen (`checkout.doctorbox.de` durch `shop.doctorbox.de` ersetzen), sonst meldet Google abweichende Domains. Im Meta Commerce Manager die Produktlinks prüfen.
- [ ] Shopify-Benachrichtigungen (Bestellbestätigung usw.): Links auf den Shop prüfen, `{{ shop.url }}` zeigt jetzt auf die Checkout-Domain und landet über das Weiterleitungs-Theme im neuen Shop.
- [ ] Erster Tag: Scalingo-Logs (App → Logs) auf 404, 500 und Speicher (Metrics) beobachten.

## D. Block für das Weiterleitungs-Theme

Leitet jede Shop-Seite des alten Themes mit Pfad, Parametern (z. B. `?variant=`) und Anker auf den neuen Shop. Kundenkonto-Seiten bleiben bei Shopify.

```liquid
{%- unless template contains 'customers' -%}
  <meta name="robots" content="noindex">
  <script>location.replace("https://shop.doctorbox.de" + location.pathname + location.search + location.hash);</script>
  <noscript><meta http-equiv="refresh" content="0; url=https://shop.doctorbox.de{{ request.path }}"></noscript>
{%- endunless -%}
```
