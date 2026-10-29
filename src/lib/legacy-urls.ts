/**
 * Dead targets found in Shopify content (SEO audit 29.10.2026, finding L1). Old texts link
 * translated English handles that never existed, renamed products and moved articles.
 * The proxy answers them with a 301 (for outside links); content links are rewritten
 * to the target directly. Paths without locale prefix, decoded.
 */
const PRODUCT_RENAMES: Record<string, string> = {
  "metabolism-check-plus": "stoffwechsel-check-plus",
  "nutrient-all-round-check": "nahrstoff-rundum-check",
  "cardiovascular-check": "herz-kreislauf-check",
  "bloodsugar-hba1c": "blutzucker-hba1c",
  "home-test-lipid metabolism": "heimtest-fettstoffwechsel",
  "sti-test-hiv-syphilis-lues-hepatitis-c-sexually transmitted diseases-test": "sti-test-hiv-syphilis-lues-hepatitis-c-geschlechtskrankheiten-test",
  "sti-test-hiv-syphilis-lues-hepatitis-c-std-test": "sti-test-hiv-syphilis-lues-hepatitis-c-geschlechtskrankheiten-test",
  "liver-check": "leber-check",
  "vitamin-b12-vegan-vegetarian": "vitamin-b12-vegan-vegetarisch",
  "burnout-stress-check": "burnout-stess-check",
  "fatigue-check": "mudigkeits-check",
  "kidney-check": "nieren-check",
  "hormone-check-for-men": "hormon-check-fur-manner",
  "hormone-check-fur-frauen": "hormon-check-fur-frauen",
  "ignition check": "enzundungscheck",
  "prostate-prevention": "psa-test-prostata-vorsorge",
  "prostata-vorsorge": "psa-test-prostata-vorsorge",
  "sti-essential": "sti-test",
};

const PATH_RENAMES: Record<string, string> = {
  "/blogs/gesundheitswissen/stress-cortisol-dauerstress-koerper-alarm": "/blogs/longevity-fitness/stress-cortisol-wenn-der-korper-auf-alarm-steht",
  "/blogs/blog-sexuelle-gesundheit/looksmaxxing-testosteron-booster-was-bringt-es": "/blogs/mannergesundheit/looksmaxxing-testosteron-hype-was-booster-wirklich-bringen",
  "/blogs/blog-sexuelle-gesundheit/festivalsaison-symptome-nach-festival":
    "/blogs/blog-sexuelle-gesundheit/festival-saison-diese-symptome-nach-einem-festival-solltest-du-nicht-ignorieren",
  "/policies/contact-information": "/pages/kontakt",
  // ProAktiv subscription is discontinued: the launch article goes to its blog, the offer pages to the subscription page
  "/blogs/vorsorge-fruherkennung/proaktiv_blog_vorsorge": "/blogs/vorsorge-fruherkennung",
  "/blogs/gesundheitswissen/proaktiv_blog_vorsorge": "/blogs/vorsorge-fruherkennung",
  ...Object.fromEntries(
    ["/pages/proaktiv", "/pages/proaktiv-deine-heimtests-im-abo", "/pages/proaktiv-hpv", "/pages/proaktiv-psa", "/pages/proaktiv-darmkrebsvorsorge",
     "/products/proaktiv", "/products/proaktiv-frauen", "/products/proaktiv-manner", "/products/proaktiv-darmcheck"].map((p) => [p, "/pages/doctorbox-abo"]),
  ),
};

const decode = (p: string) => {
  try {
    return decodeURIComponent(p);
  } catch {
    return p;
  }
};

/** New path for a dead legacy path (locale prefix kept), or null. Expects a path without query. */
export function legacyTarget(pathname: string): string | null {
  const en = pathname === "/en" || pathname.startsWith("/en/");
  const bare = decode(en ? pathname.slice(3) : pathname).replace(/\/$/, "");
  const product = bare.match(/^\/products\/(.+)$/)?.[1];
  const target = (product && PRODUCT_RENAMES[product] && `/products/${PRODUCT_RENAMES[product]}`) || PATH_RENAMES[bare];
  return target ? `${en ? "/en" : ""}${target}` : null;
}
