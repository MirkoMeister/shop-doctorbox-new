# Go-live: Umzug von shop.doctorbox.de auf den Headless-Shop

**Stand:** 03.11.2026, umgeschaltet am 03.11. gegen 14:30 Uhr · Hosting: **Scalingo** (App `doctorbox-shop`, Region osc-fr1, deployt automatisch aus `dctrbx/heimtests-new-shop` `main`). Das Vercel-Projekt ist gelöscht. Reihenfolge einhalten. Häkchen setzen, wenn erledigt.

## A. Vorbereitung (vor dem Umschalten)

- [x] **Checkout-Domain:** DNS `checkout.doctorbox.de` als CNAME auf `shops.myshopify.com` In Shopify unter Einstellungen → Domains als **zusätzliche** Domain verbinden. Warten, bis `https://checkout.doctorbox.de` ohne Zertifikatsfehler auf `shop.doctorbox.de` weiterleitet.
- [x] **Scalingo, Umgebungsvariablen** (App → Environment): `SHOPIFY_STORE_DOMAIN=doctorbox-heimtests.myshopify.com` (zeigt sie auf `shop.doctorbox.de`, ruft der Shop nach dem DNS-Wechsel sich selbst auf und fällt aus). `NEXT_PUBLIC_SITE_URL=https://shop.doctorbox.de` oder leer lassen. `SHOPIFY_ONLINE_STORE_DOMAIN=checkout.doctorbox.de` ist bereits aktiv. Außerdem vollständig: Storefront-Token, `ETRUSTED_*`, `NEXT_PUBLIC_KLAVIYO_COMPANY_ID`, `KLAVIYO_LIST_ID`, privater Klaviyo-Schlüssel, Anthropic-Schlüssel. `NEXT_PUBLIC_*`-Werte werden beim Build eingebaut: nach einer Änderung neu deployen (Deploy → Manual deploy), ein Neustart reicht nicht.
- [x] **Scalingo, Domain:** App → Settings → Domains → `shop.doctorbox.de` hinzufügen. Ziel für den DNS-Eintrag ist `doctorbox-shop.osc-fr1.scalingo.io` (CNAME). Keine „Canonical domain“ setzen.
- [x] **Rabattcode `MOVEMBER26`** in Shopify angelegt (20 %, 1.–30.11.). Gilt nur für die Männer-Tests der Aktionsseite (`movemberHandles` in `src/content/movember.ts`); Shopify muss genau diese 14 Produkte abdecken.
- [x] **Weiterleitungs-Theme vorbereiten:** Das live Theme duplizieren und im Duplikat in `layout/theme.liquid` direkt nach `<head>` den Block aus Abschnitt D einfügen. Noch **nicht** veröffentlichen (erst nach dem DNS-Wechsel, Schritt B3).
- [x] **Widerrufsformular** im neuen Shop verfügbar machen (fehlt heute, siehe `GO-LIVE-APPS-TRACKING.md` Punkt 1.1).
- [ ] **Shopify-URL-Weiterleitungen** exportieren (Onlineshop → Navigation → URL-Weiterleitungen → Exportieren) und in den Shop übernehmen lassen.

## B. Umschalten (direkt hintereinander, ruhige Uhrzeit)

1. [x] Shopify: `checkout.doctorbox.de` als **primäre** Domain festlegen.
2. [x] DNS (Route 53): `shop.doctorbox.de` als CNAME auf `doctorbox-shop.osc-fr1.scalingo.io` umstellen (heute CNAME auf `shops.myshopify.com`, TTL steht bereits niedrig). Prüfen, dass `https://shop.doctorbox.de` den neuen Shop zeigt.
3. [x] Shopify: erst **jetzt** das Weiterleitungs-Theme veröffentlichen. Vorher würde es auf `shop.doctorbox.de` weiterleiten, das noch bei Shopify liegt: Endlosschleife.
4. [ ] Shopify: `shop.doctorbox.de` aus den Domains entfernen.
5. [x] Scalingo: prüfen, dass `https://shop.doctorbox.de/account` auf `checkout.doctorbox.de/account` weiterleitet (`SHOPIFY_ONLINE_STORE_DOMAIN`, bereits aktiv).

Zwischen 1 und 3 läuft der alte Shop wenige Minuten unter der Checkout-Domain; nach 2 kann `shop.doctorbox.de` ein bis zwei Minuten einen Zertifikatsfehler zeigen, bis Scalingo das Let's-Encrypt-Zertifikat ausgestellt hat.

## C. Prüfen (direkt danach)

- [x] `https://shop.doctorbox.de` liefert den neuen Shop (Header `x-request-id`, kein `x-shopid`), ohne `X-Robots-Tag: noindex`, mit gültigem Zertifikat.
- [ ] Produkt in den Warenkorb, „Zur Kasse“: Checkout lädt auf `checkout.doctorbox.de`, Cookie-Einwilligung ist übernommen, Testbestellung bis zur Bestätigung.
- [x] `https://checkout.doctorbox.de/products/sti-pro-10?variant=…` leitet auf `shop.doctorbox.de` mit Pfad und Variante weiter.
- [ ] Kundenkonto-Link und Bestellstatus-Link aus einer Bestellmail funktionieren.
- [ ] Alte URLs (Sitemap-Abgleich) und UCP-Endpunkte (`/.well-known/ucp`, `/api/ucp/mcp`) erneut prüfen.
- [ ] Google Search Console: Sitemap `https://shop.doctorbox.de/sitemap.xml` einreichen.
- [ ] **Google Merchant Center und Meta-Katalog:** Die Shopify-Kanäle übernehmen die primäre Domain in die Produktlinks (`checkout.doctorbox.de/products/…`). Im Merchant Center eine Attributregel für `link` anlegen (`checkout.doctorbox.de` durch `shop.doctorbox.de` ersetzen), sonst meldet Google abweichende Domains. Im Meta Commerce Manager die Produktlinks prüfen.
- [ ] Shopify-Benachrichtigungen (Bestellbestätigung usw.): Links auf den Shop prüfen, `{{ shop.url }}` zeigt jetzt auf die Checkout-Domain und landet über das Weiterleitungs-Theme im neuen Shop.
- [ ] Erster Tag: Scalingo-Logs (App → Logs) auf 404, 500 und Speicher (Metrics) beobachten.

## D. Block für das Weiterleitungs-Theme

Leitet jede Shop-Seite des alten Themes mit Pfad, Parametern (z. B. `?variant=`) und Anker auf den neuen Shop. Kundenkonto-Seiten und App-Proxy-Seiten (`/apps/…`, `/tools/…`, z. B. Abo-Kundenportal) und das Widerrufsformular der App „EU Widerruf Button“ (`/pages/widerruf-formular`) bleiben bei Shopify, ebenso die ganze Domain `shop.doctorbox.eu` (Schweiz, Dänemark: vorerst weiter im alten Shop); der neue Shop leitet diese Pfade dorthin, eine Weiterleitung zurück wäre eine Schleife.

```liquid
{%- unless request.host contains 'doctorbox.eu' or template contains 'customers' or request.path contains '/apps/' or request.path contains '/tools/' or request.path contains '/pages/widerruf-formular' -%}
  <meta name="robots" content="noindex">
  <script>location.replace("https://shop.doctorbox.de" + location.pathname + location.search + location.hash);</script>
  <noscript><meta http-equiv="refresh" content="0; url=https://shop.doctorbox.de{{ request.path }}"></noscript>
{%- endunless -%}
```
