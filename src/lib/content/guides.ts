/**
 * Editorial routing. URLs are identical to the old Shopify store so rankings
 * carry over:
 *  - blog articles  /blogs/<blog>/<slug>, blog index /blogs/<blog>
 *  - guide pages    /pages/<handle>  (everything that is not a utility page)
 *  - guide overview /pages/ratgeber, blog overview /blog (new, links to the blogs)
 * Keep this file free of server-only imports: the proxy (edge) uses it too.
 */

/** Pages that stay at /pages/<handle> because they are not articles. */
export const UTILITY_PAGES = new Set([
  "kontakt",
  "faqs",
  "mein-testergebnis",
  "gdpr-compliance",
  "appi-compliance",
  "ccpa-compliance",
  "cookies",
  "cookie-policy",
  "b2b",
  "zahlung",
  "datenschutz",
  "compare",
  "das-sagen-unsere-kunden",
  "uber-uns",
  "disposal",
  "ablauf-uber-die-feiertage",
  "buche-einen-bluttest",
  "gewinnspiel",
  "mitgliedschaft",
  "sets-komponenten",
  "doctorbox-heimtest-berater",
  "widerruf-formular",
]);

/** Overview pages that are rendered by their own routes, not as guide content. */
export const GUIDE_INDEX_PAGES = new Set(["ratgeber", "gesundheitsblog"]);

export function isGuidePage(handle: string): boolean {
  return !UTILITY_PAGES.has(handle) && !GUIDE_INDEX_PAGES.has(handle);
}

/** Guide overview with search (old Shopify page URL) */
export const GUIDE_BASE = "/pages/ratgeber";
/** Blog overview across all Shopify blogs (new; the blogs themselves keep /blogs/<blog>) */
export const BLOG_BASE = "/blog";

export const guideHref = (handle: string) => `/pages/${handle}`;
export const blogHref = (blog: string) => `/blogs/${blog}`;
export const articleHref = (blog: string, slug: string) => `/blogs/${blog}/${slug}`;

/** Blog handles → topic labels for the overview filter (Italian blog excluded). */
export const BLOG_TOPICS: Record<string, { de: string; en: string }> = {
  gesundheitswissen: { de: "Gesundheitswissen", en: "Health knowledge" },
  "blog-sexuelle-gesundheit": { de: "Sexuelle Gesundheit", en: "Sexual health" },
  hormone: { de: "Hormone", en: "Hormones" },
  mannergesundheit: { de: "Männergesundheit", en: "Men's health" },
  frauengesundheit: { de: "Frauengesundheit", en: "Women's health" },
  "nahrstoffe-vitamine": { de: "Nährstoffe & Vitamine", en: "Nutrients & vitamins" },
  "herz-kreislauf": { de: "Herz & Kreislauf", en: "Heart & circulation" },
  "longevity-fitness": { de: "Longevity & Fitness", en: "Longevity & fitness" },
  "kinderwunsch-fruchtbarkeit": { de: "Kinderwunsch & Fruchtbarkeit", en: "Fertility" },
  "dna-analysen": { de: "DNA-Analysen", en: "DNA analyses" },
  "vorsorge-fruherkennung": { de: "Vorsorge & Früherkennung", en: "Prevention & screening" },
};

/** Guide pages grouped by theme for the overview (handles of migrated/Shopify pages). */
export const PAGE_TOPICS: Record<string, { de: string; en: string; handles: string[] }> = {
  "sexuelle-gesundheit": {
    de: "Sexuelle Gesundheit",
    en: "Sexual health",
    handles: ["sti", "habe-ich-chlamydien", "habe-ich-gonorrho-tripper", "habe-ich-trichomonaden", "ratgeber-gonorrhoe", "hiv-ratgeber", "ratgeber-syphilis"],
  },
  vorsorge: {
    de: "Vorsorge & Werte",
    en: "Prevention & values",
    handles: ["ratgeber-vitamin-d", "vitamin-d", "ratgeber-darmkrebs", "ratgeber-hba1c", "ratgeber-pradiabetes", "nierengesundheit", "knochengesundheit", "entzundung", "prostata", "mannergesundheit", "herz-kreislauf-pravention-ab-35-doctorbox-ratgeber", "atherosklerose-die-stille-gefahr-in-deinen-gefassen", "wie-gut-bist-du-wirklich-mit-aminosauren-versorgt"],
  },
  alltag: {
    de: "Energie, Schlaf & Stress",
    en: "Energy, sleep & stress",
    handles: ["mudigkeit", "schlaf", "burnout", "fokus", "biohacking", "hrv", "jetlag", "kaltetherapie", "sauna", "atemtraining", "digital-detox", "lern-sprints"],
  },
  ernaehrung: {
    de: "Ernährung",
    en: "Nutrition",
    handles: ["ratgeber-intervallfasten", "ratgeber-omad", "ratgeber-adf", "ratgeber-high-protein", "ratgeber-low-carb", "keto", "ratgeber-mediterran", "ratgeber-flexitarisch", "ratgeber-vegetarisch", "ratgeber-vegan", "ratgeber-clean-eating", "ratgeber-low-fodmap", "ratgeber-glutenfrei", "ratgeber-laktosefrei", "ratgeber-fruktosearm", "ratgeber-dash-ernahrung", "ratgeber-low-gi", "ratgeber-zuckerfrei-challenge", "ratgeber-alkohol-pause", "ratgeber-nahrungserganzungen", "ratgeber-omega-3", "ratgeber-darmgesundheit", "ratgeber-hydration", "ratgeber-mealprep", "ratgeber-lebergesundheit", "ratgeber-mikronahrstoffe"],
  },
  sport: { de: "Sport & Training", en: "Sport & training", handles: [] }, // everything else
};

export function pageTopic(handle: string): string {
  for (const [key, t] of Object.entries(PAGE_TOPICS)) if (t.handles.includes(handle)) return key;
  return "sport";
}
