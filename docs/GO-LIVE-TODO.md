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
- [ ] **Movember:** Rabattcode `MOVEMBER26` in Shopify anlegen (20 % auf alle Heimtests, 1.–30.11.). Seite `/pages/movember` (Inhalt `src/content/movember.ts`) ist schon online, Ankündigungsleiste, Menü-Karte und Warenkorb-Hinweis schalten am 1.11. automatisch von Halloween auf Movember um. Hero-Bild ist das Shopify-Bild der Kollektion Männergesundheit; bei Bedarf eigenes Bild unter `public/hero/` hinterlegen. Fakten im Hero (5 Jahre, Prostatakrebs Nr. 1, ab 45/50) mit Quellen gegenlesen.
- [ ] **Youngle:** Metafelder für die 20 restlichen Produkte aus `docs/youngle-produktangaben.xlsx` füllen (AKG ist befüllt).
- [ ] **Youngle-Texte prüfen (Health Claims):** Die Produktseiten zeigen seit 28.10. die Herstellertexte von youngle.com (Produktvorteile erklärt, „Was kannst du erwarten?“, Wirkstoffe im Detail; Quelle `src/content/youngle-content.json`, lesbar in `docs/youngle-weiterfuehrende-inhalte.csv` und im Tabellenblatt „Weiterführende Inhalte“). Aussagen wie „unterstützt Herzgesundheit“ sind gesundheitsbezogene Angaben nach Health-Claims-Verordnung; mit Youngle klären, welche zugelassen sind, sonst Einträge in der JSON kürzen. Detailliste je Produkt: `docs/youngle-health-claims.md`.
- [ ] **Apotheken:** Liste vom CEO in `src/content/pharmacies.json` eintragen.
- [ ] **Youngle-Versandtext bestätigen:** Produktseiten und Warenkorb sagen seit 28.10.: Versand direkt von Youngle in eigenem Paket, 1 bis 2 Werktage, keine Abholung in Berlin, Rückgabe 14 Tage ungeöffnet (`src/content/youngle-shipping.ts`). Mit Ops/Youngle abgleichen (Versandkosten für Collective-Artikel, Rücksendeadresse, Freigrenze).
- [ ] **Rabattcodes im Warenkorb:** Der Warenkorb kann Codes direkt anwenden (Shopify `cartDiscountCodesUpdate`). Solange `HALLOWEEN26` in Shopify nicht angelegt ist, meldet die Seite „Code nicht gültig“.
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
- [ ] Noch leer: Trusted-Shops-Widget-ID. (Tracking-IDs stehen als Standardwerte im Code, siehe `src/lib/tracking/config.ts`; Env-Variablen überschreiben sie.)

## 6. Letzte Prüfung vor dem DNS-Switch

- [ ] **SEO-Audit vom 29.10. abarbeiten:** Caching, Server-Region fra1, `noindex` außerhalb der Live-Domain, UTM in internen Links und Sitemap sind erledigt (Abschnitt 8 in [seo-audit-2026-10-29/site-audit.md](seo-audit-2026-10-29/site-audit.md)). Defekte Links mit eindeutigem Ziel sind korrigiert. Offen vor dem Umzug: fehlende Seiteninhalte (C1), Ziele für ProAktiv, Darmgesundheits-Check und Allergietest-Inhalationsallergene (L1), **Shopify-URL-Weiterleitungen exportieren und übernehmen** (Onlineshop → Navigation → URL-Weiterleitungen → Exportieren).

- [ ] URL-Check gegen die alte Sitemap erneut laufen lassen (alle 1.627 URLs antworteten am 28.10. mit 200 oder Weiterleitung).
- [ ] Impressum, Datenschutz, AGB, Widerruf inhaltlich prüfen.
- [ ] Cookie-Banner (iubenda) auf der neuen Domain testen.
- [ ] **Tracking nach Vorgabe (umgesetzt 29.10.):** iubenda lädt vor allen anderen Skripten. Tag Manager (Zweck 4, Messung), Meta-Pixel, Reddit-Pixel und Klaviyo (Zweck 5, Marketing) starten erst nach Zustimmung. Ohne Zustimmung laufen nur Plausible (ohne Cookies) und das Trusted-Shops-Widget; von Datenschutz bestätigen lassen.
  Ereignisse aus dem Code: dataLayer `view_item`, `add_to_cart`, `view_cart` (GA4-Format wie im alten Theme, IDs `shopify_DE_<Produkt>_<Variante>`); Meta `PageView`, `ViewContent`, `AddToCart` (kein Purchase); Reddit `PageVisit`, `ViewContent`, `AddToCart`. Käufe messen weiter die Shopify-Apps im Checkout.
- [ ] **Neues iubenda-Konto (eingebunden 29.10.):** Einbau-Skript `794f53fb-…`, Site-ID 4741228, Cookie-Richtlinien DE 16389627 und EN 15787771 (Standardwerte im Code). Offen im iubenda-Dashboard:
  - Betreiber („ownerName“) steht auf der Vercel-Adresse; im Code mit „DoctorBox Service GmbH“ überschrieben, im Dashboard korrigieren.
  - Englisch ist hinterlegt (en-GB, Cookie-Richtlinie 15787771) und im Code eingetragen (29.10.).
  - Der Tarif erlaubt keine eigenen Farben, kein Logo und kein White-Labeling: Der Banner hat blaue Buttons und „Created with iubenda“. Die Optik des alten Themes ist im Code hinterlegt und greift, sobald der Tarif das zulässt.
  - iubenda blendet eine eigene Fußzeile („Legal Footer“, lila, „by iubenda“) unter dem Shop-Footer ein. Im Dashboard abschalten, die Links stehen schon im Shop-Footer.
  - Autoblocking, Google Consent Mode und Microsoft-UET-Consent aktiv lassen; Cookie-Richtlinie um alle Dienste ergänzen (GA4, Google Ads, Tag Manager, Meta, Reddit, TikTok, Bing, Clarity, Klaviyo, Plausible, Trusted Shops, Shopify; das Konto zählt bisher 4 Anbieter).
- [ ] **Tag Manager:** Prüfen, ob für `view_cart` ein GA4-Tag existiert (`view_item` und `add_to_cart` kamen schon aus dem alten Theme). Meta-Tags im Container gibt es nicht, es entstehen also keine Dubletten.
- [ ] **Meta-Katalog:** In Events Manager prüfen, ob `content_ids` im Format `shopify_DE_<Produkt>_<Variante>` zu den Katalog-IDs der Shopify-App passen (der alte Shop sendete Meta serverseitig, das Format war nicht einsehbar).
- [ ] **Einwilligung an den Checkout:** Der Shop übergibt die iubenda-Wahl an Shopify (Cookie `_tracking_consent` auf `doctorbox.de`). Das greift nur, wenn der Checkout auf einer Subdomain von `doctorbox.de` liegt (siehe Abschnitt 1, `checkout.doctorbox.de`). Sonst fehlen Einwilligung und Kauf-Zuordnung im Checkout.
- [ ] Google Search Console: neue Sitemap einreichen, Property bleibt dieselbe Domain.
- [ ] Ersten Tag nach dem Umzug: Vercel-Logs auf 404 und 500 beobachten.
