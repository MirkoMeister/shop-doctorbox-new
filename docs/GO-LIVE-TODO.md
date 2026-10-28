# Go-live-Checkliste: Headless-Shop auf shop.doctorbox.de

Stand: 28.10.2026. Offene Punkte vor dem DNS-Umzug von Shopify auf Vercel.
Erledigtes bitte abhaken, Verantwortliche eintragen.

## 1. Domains und Checkout (kritisch)

- [ ] **Checkout-Domain in Shopify anlegen.** Heute ist `shop.doctorbox.de` die Primärdomain von Shopify, der Checkout-Link lautet `shop.doctorbox.de/cart/c/…`. Zeigt die Domain auf Vercel, bricht der Checkout.
  Lösung: Subdomain anlegen, zum Beispiel `checkout.doctorbox.de`, in Shopify als Primärdomain setzen (CNAME auf `shops.myshopify.com`).
- [ ] **Env-Variable setzen:** `SHOPIFY_ONLINE_STORE_DOMAIN=checkout.doctorbox.de` in Vercel (Fallback im Code: `doctorbox-heimtests.myshopify.com`). Dorthin gehen Proxy für UCP, Weiterleitungen für Checkout, Konto, Bestellungen, Apps.
- [ ] **`SHOPIFY_STORE_DOMAIN`** in Vercel vor dem Umzug auf `doctorbox-heimtests.myshopify.com` stellen, sonst ruft der Shop seine eigene Domain auf.
- [ ] Nach dem Umzug prüfen: Produkt in den Warenkorb, „Zur Kasse“, Checkout lädt auf der Checkout-Domain, Testbestellung bis zur Bestätigung.

## 2. Agentic Commerce (ChatGPT, Perplexity, Copilot, Shop-App)

Shopify betreibt UCP-Profil, MCP-Server und Katalog selbst. Der Headless-Shop reicht sie durch. Umgesetzt im Code: Proxy für `/.well-known/ucp*` und `/api/ucp/*`, Link-Header `rel="ucp"`, `public/agents.md`, `public/llms.txt`, robots erlaubt die Endpunkte.

- [ ] **Agentic Storefronts** in Shopify Admin aktiv lassen (Einstellungen → Apps und Vertriebskanäle), inklusive Shop-Kanal.
- [ ] Nach dem Umzug prüfen: `https://shop.doctorbox.de/.well-known/ucp` liefert JSON, `POST https://shop.doctorbox.de/api/ucp/mcp` mit `tools/list` liefert die Werkzeuge, `curl -I https://shop.doctorbox.de/` zeigt `Link: </.well-known/ucp>; rel="ucp"`.
- [ ] `agents.md` und `llms.txt` nach dem Umzug einmal gegenlesen (Kontaktdaten, Links).
- [ ] Optional, später: WebMCP-Werkzeuge auf den Seiten (gibt es nur in Liquid/Hydrogen, für UCP-Käufe nicht nötig).

## 3. Storefront-API-Rechte

- [ ] Rechte des Tokens bleiben wie am 28.10. gesetzt: Produkte (inkl. Inventar, Tags, Abhol-Standorte), Inhalt, Checkouts, Verkaufspläne, Bundles, Metaobjekte.
- [ ] Nach Änderungen an Metafeld-Definitionen: Haken „Storefronts“ unter „Zugriff“ prüfen (`custom.inhaltsstoffe`, `custom.einnahmeempfehlung`, `custom.produktvorteile`).

## 4. Inhalte

- [ ] **Halloween:** Rabattcode `HALLOWEEN26` in Shopify auf alle Heimtests anlegen (die Seite verspricht 20 % auf alle Tests). Aktion endet automatisch am 31.10., 23:59.
- [ ] **Youngle:** Metafelder für die 20 restlichen Produkte aus `docs/youngle-produktangaben.xlsx` füllen (AKG ist befüllt).
- [ ] **Apotheken:** Liste vom CEO in `src/content/pharmacies.json` eintragen.
- [ ] **Tasso-Wortlaut** „komplett schmerzfrei“ medizinisch/rechtlich freigeben (Hersteller sagt „nahezu schmerzfrei“).
- [ ] **Mira-Texte** zu STI-Zeitfenstern und Supplements medizinisch gegenlesen.
- [ ] Blogartikel ohne Auszug/SEO-Beschreibung in Shopify nachpflegen (Liste aus der Sitzung vom 20.10.).
- [x] **Trusted Shops, Antworten nachbearbeiten (erledigt 28.10.):** Einige Antworten enthalten Platzhalter wie „[Kontaktweg einfügen]“ oder „[Ort einfügen, z. B. Meine Tests]“. Sie sind öffentlich auf den Produktseiten sichtbar. Im eTrusted Control Centre korrigieren.
- [ ] **Bewertungszahlen klären:** Shopify-Metafeld (z. B. STI Pro 43 × 4,81) und Trusted Shops (30 × ~4,5) weichen ab. Der Shop zeigt die verifizierten Trusted-Shops-Werte; falls die Shopify-Zahlen aus einer anderen echten Quelle stammen, Quelle benennen.

## 5. Vercel-Umgebungsvariablen (vollständig?)

- [ ] **Trusted Shops Bewertungen:** `ETRUSTED_CLIENT_ID`, `ETRUSTED_CLIENT_SECRET`, `ETRUSTED_CHANNEL_ID=chl-2cbd51e9-0164-4b34-a260-c813d0007e3f` in Vercel setzen (lokal bereits aktiv). Ohne sie fällt der Shop auf die Shopify-Sterne zurück.

- [ ] Alle Werte aus `.env.example` gesetzt, insbesondere `ANTHROPIC_API_KEY` (Workspace-Key), `RESEND_API_KEY`, `CONTACT_TO`, `NEXT_PUBLIC_SITE_URL=https://shop.doctorbox.de`.
- [ ] **Newsletter (Klaviyo):** `KLAVIYO_LIST_ID` in Vercel und `.env.local` setzen (Klaviyo → Listen → Liste → Einstellungen, ID im Pfad). Auf der Liste Double Opt-in aktivieren und die Bestätigungsmail auf Deutsch prüfen. Bis dahin sind Newsletter-Formulare auf Startseite und Footer sichtbar, melden bei Absenden aber einen Fehler.
- [ ] Noch leer: Trusted-Shops-Widget-ID, Meta-Pixel-ID.

## 6. Letzte Prüfung vor dem DNS-Switch

- [ ] URL-Check gegen die alte Sitemap erneut laufen lassen (alle 1.627 URLs antworteten am 28.10. mit 200 oder Weiterleitung).
- [ ] Impressum, Datenschutz, AGB, Widerruf inhaltlich prüfen.
- [ ] Cookie-Banner (iubenda) auf der neuen Domain testen.
- [ ] Google Search Console: neue Sitemap einreichen, Property bleibt dieselbe Domain.
- [ ] Ersten Tag nach dem Umzug: Vercel-Logs auf 404 und 500 beobachten.
