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

## 4b. Rechtliche Prüfung (Feedback vom 28.10.)

Im Shop umgesetzt: „nahezu schmerzfrei“ (Herstellerformulierung) statt „komplett schmerzfrei“ auf allen Seiten und bei Mira; Tasso+ wird nur noch vorausgewählt, wenn es nicht teurer ist als die günstigste Variante (betrifft Fettstoffwechsel, Testosteron, Bio-Age); Bewertungshinweis beschreibt die Prüfung korrekt; Mira-Hinweis nennt Anthropic und das Nicht-Speichern präzise.

- [ ] **Entscheidung Tasso-Wortlaut:** CEO wünschte „komplett schmerzfrei“, rechtlich riskant (Heilmittelwerbung, absolutes Versprechen). Aktuell steht „nahezu schmerzfrei“. Final mit Recht/CEO klären.
- [ ] **Shopify-Texte bereinigen:** „10-fach geschützt“ in den Beschreibungen von `sti-pro-10`, `sti-complete-trio-fur-frauen`, `sti-complete-trio-fur-manner` ersetzen (ein Test schützt nicht, er erkennt). „schmerzfrei“ in den SEO-Beschreibungen von `sti-pro-10`, `allergietest`, `heimtest-fettstoffwechsel` und in 16 Produktbeschreibungen auf „nahezu schmerzfrei“ anpassen.
- [x] **Streichpreise ausgeblendet (28.10.):** Der Shop zeigt keine Shopify-Vergleichspreise mehr; Abo-Preis und Halloween-Codepreis bleiben, weil sie den aktuellen Preis vergleichen. Wieder einschalten nur mit Beleg per `NEXT_PUBLIC_SHOW_COMPARE_PRICES=true`. Ursprünglich: 9 Produkte haben einen Vergleichspreis (u. a. STI Standard 80 statt 135, HPV 85 statt 100, STI Complete Trio, Darmkrebsvorsorge, Allergietest, Vitamin-D-Winteraktion, STI 4er-Bundle). Der Vergleichspreis muss der niedrigste Preis der letzten 30 Tage sein. Entweder belegen oder in Shopify entfernen. Notfallschalter: `NEXT_PUBLIC_SHOW_COMPARE_PRICES=false` blendet alle Streichpreise aus.
- [ ] **Mira-Einwilligung (umgesetzt 28.10.):** Vor der ersten Nachricht erscheint eine Einwilligungskarte (Zweck, Übermittlung an Anthropic, keine Speicherung, Datenschutz-Link, Buttons „Einverstanden“ / „Lieber nicht“), gemerkt pro Browser. Wortlaut von Recht freigeben lassen.
- [ ] **Datenschutzerklärung:** Mira ergänzen (Verarbeitung durch Anthropic, Zweck, keine Speicherung bei DoctorBox, Hinweis auf Gesundheitsdaten) und Auftragsverarbeitung mit Anthropic prüfen.
  Fakten für den Text: Eingaben und Antworten gehen über unseren Server an die Anthropic-API (Anthropic PBC, USA; Standardvertragsklauseln/DPF über das Anthropic Data Processing Addendum, abrufbar im Anthropic-Konto). DoctorBox speichert das Gespräch nicht; der Browser hält es nur bis zum Schließen der Seite. Serverseitig wird nur eine anonymisierte Kennung für die Ratenbegrenzung kurz gehalten (30 Anfragen pro 10 Minuten). Anthropic bewahrt API-Daten nach eigener Richtlinie zeitlich begrenzt auf, falls gewünscht „Zero Data Retention“ bei Anthropic beantragen. Rechtsgrundlage für Gesundheitsangaben in der Eingabe: Einwilligung (Art. 9 Abs. 2 a DSGVO), Hinweis vor dem ersten Senden prüfen.

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
