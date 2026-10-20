# DoctorBox Shop (Headless)

Neuaufbau von shop.doctorbox.de als Shopify-Headless-Storefront: Next.js 16 (App Router), React 19,
Tailwind CSS 4, TypeScript. Daten kommen live aus der Shopify Storefront API, der Checkout bleibt bei Shopify.

## Schnellstart

```bash
npm install
cp .env.example .env.local   # Werte eintragen (siehe unten)
npm run dev                  # http://localhost:3000
```

Weitere Befehle: `npm run build` (Produktions-Build), `npm run lint`, `npx tsc --noEmit`.

## Umgebungsvariablen

| Variable | Zweck |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `shop.doctorbox.de` (Custom Domain funktioniert für die API) |
| `SHOPIFY_API_VERSION` | `2025-07` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Öffentlicher Storefront-Token |
| `NEXT_PUBLIC_SITE_URL` | Kanonische URL für Canonical, hreflang, Sitemap |
| `NEXT_PUBLIC_IUBENDA_SITE_ID`, `..._POLICY_ID_DE`, `..._POLICY_ID_EN` | Cookie-Consent (iubenda, mit Autoblocking) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager (GA4, Meta, TikTok, Clarity laufen im Container) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta-Basis-Pixel, da der GTM-Container `fbq()` erwartet |
| `NEXT_PUBLIC_KLAVIYO_COMPANY_ID`, `NEXT_PUBLIC_KLAVIYO_LIST_ID` | Klaviyo Onsite + Newsletter-Formular im Footer (Formular erscheint nur mit List-ID) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible (cookieless) |
| `NEXT_PUBLIC_ETRUSTED_ENABLED`, `NEXT_PUBLIC_ETRUSTED_WIDGET_ID` | Trusted Shops Widget-Bootstrap |
| `RESEND_API_KEY`, `B2B_INQUIRY_TO`, `B2B_INQUIRY_FROM` | Zustellung des B2B-Anfrageformulars per E-Mail (ohne Key wird serverseitig nur geloggt) |
| `ANTHROPIC_API_KEY` | V2: KI-Testberater (Claude API) |

## URL-Struktur und SEO

Die URLs entsprechen 1:1 dem alten Shopify-Shop, damit das Google-Ranking erhalten bleibt:

- Deutsch ohne Präfix (`/products/vitamin-d-test`), Englisch unter `/en/...`
- Redaktionelle Inhalte liegen unter `/ratgeber/<slug>` (Blogartikel und Ratgeber-Seiten). Alte URLs leiten per 301 um:
  `/blogs/<blog>/<slug>` → `/ratgeber/<slug>`, `/blogs/<blog>` → `/ratgeber?thema=<blog>`, `/pages/<ratgeber-seite>` → `/ratgeber/<slug>`.
  Welche Pages als Ratgeber gelten, steuert `src/lib/content/guides.ts` (`UTILITY_PAGES` bleiben unter `/pages/`).
- `/de-at/*` → 301 auf `/*`, `/en-at/*` → 301 auf `/en/*`, `/collections/all` → `/collections`,
  `/blogs/ratgeber/*` → `/blogs/gesundheitswissen/*` (siehe `src/proxy.ts`)
- hreflang wie bisher: `de`, `en`, `de-AT`, `en-AT`, `x-default` sowie `en-CH`/`fr-CH`/`en-DK`/`fr-DK` auf shop.doctorbox.eu
- `sitemap.xml` und `robots.txt` werden generiert (`src/app/sitemap.ts`, `src/app/robots.ts`)
- JSON-LD: Organization, WebSite (SearchAction), Product (Offer/AggregateOffer, AggregateRating,
  Biomarker als `additionalProperty`), BreadcrumbList, Article, FAQPage
- Policies sind wie im alten Shop `noindex`

## Inhalte

| Quelle | Woher |
|---|---|
| Produkte, Collections, Blogs, Artikel, Policies | Storefront API, in beiden Sprachen via `@inContext` |
| Metafelder | `custom.biomarkers` (Analysierte Werte), `custom.sample_material`, `custom.target_group`, `reviews.rating`, `reviews.rating_count` |
| Abo | Shopify Selling Plans (20 % Rabatt, 3/6/12 Monate) → `sellingPlanId` in der Cart-Line |
| Abholung | `storeAvailability` (Standort Berlin) wird auf der Produktseite angezeigt; die Wahl erfolgt im Shopify-Checkout |
| 181 sektionsbasierte Pages | Einmalig aus dem gerenderten HTML migriert nach `src/content/pages/{de,en}/<handle>.json` (die Pages-API liefert für diese Seiten keinen Body). 22 Pages mit API-Body kommen weiterhin live aus Shopify. |
| Impressum | `src/content/policies/{de,en}/legal-notice.json` (nicht in der Storefront API) |
| Infokasten zu Biomarkern (Produktseite) | `src/content/biomarkers.data.ts` (alle Laborwerte, Allergene, HPV, Candida, genetische Scores; DE/EN) und `src/content/biomarkers.ts` (STI-Texte, Zuordnung, Themen-Headlines). Neue Werte in `VALUES` ergänzen, Schreibweisen über `aliases`. Prüfskript: `npx tsx scratchpad/check_biomarkers.ts`-Ansatz, siehe Git-Historie. |
| B2B-Seite | `src/app/[locale]/pages/b2b/page.tsx`; Marker-Portfolio aus `src/lib/catalog/markers.ts`; Anfrageformular → `src/app/api/b2b/route.ts` (Resend, Env `RESEND_API_KEY`, `B2B_INQUIRY_TO`) |

Italienische Produkte (Tag `IT`), die Collection `salute-sessuale` und der Blog `blog-salute-sessuale` sind ausgeblendet.

## Architektur

```
src/
  proxy.ts                 Locale-Rewrite (/ → /de intern), 301-Redirects alter URLs
  app/[locale]/            Alle Routen: /, products, collections, pages, blogs, policies, search, cart
  app/api/search           Predictive Search (Shopify) für die Hero-Suche
  lib/shopify/             GraphQL-Client, Fragments, Queries, Reshaping der Metafelder
  lib/cart/actions.ts      Server Actions für den Warenkorb (Cookie `dbx_cart`)
  lib/i18n/                Locale-Konfiguration, UI-Wörterbuch DE/EN, hreflang
  lib/content/pages.ts     Loader für die migrierten Seiten
  components/              Header/Footer, Hero-Suche, Produktkarten, Kaufbox, Warenkorb-Drawer, Analytics
  content/                 Migrierte Seiten und Impressum
```

Kategorieseiten (`components/collection/CollectionView.tsx`) filtern serverseitig über URL-Parameter
(`sample`, `value`, `price`, `sub`, `sort`); die Facetten werden aus den Metafeldern berechnet.

Design-Entscheidungen stehen in `DESIGN.md` (Farbtokens aus dem Styleguide, Host Grotesk, Pill-Geometrie).

## Deployment

Vercel oder jeder Node-Host. `NEXT_PUBLIC_SITE_URL` auf die Live-Domain setzen. Im Shopify-Admin
später den Headless-Kanal/Custom-Domain umstellen; der Checkout läuft unverändert über
`shop.doctorbox.de/checkouts/...`. Optional den Storefront-Scope `unauthenticated_read_product_inventory`
freischalten, um Lagerbestände anzuzeigen.

## V2 (geplant)

- KI-Testberater mit der Claude API (`ANTHROPIC_API_KEY`), Wissensbasis = Produkte + Metafelder
- Kundenkonto (Shopify Customer Account API)
- Bewertungen im Detail (aktuell nur Aggregat aus den Metafeldern)
