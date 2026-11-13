import type { Locale } from "@/lib/i18n/config";

/**
 * Supplements grouped by goal for the collection page. Handles reference the
 * Shopify catalogue; a product that is in no group lands under "Weitere".
 * Editorial, change freely.
 */
export type SupplementGroup = { key: string; title: string; text: string; handles: string[] };

export type SupplementsCopy = {
  pickTitle: string;
  pickText: string;
  measureTitle: string;
  measureText: string;
  measureCta: string;
  formulaNote: string;
  singleNote: string;
  vitaminDTitle: string;
  vitaminDText: string;
  vitaminDForms: string;
  more: string;
  groups: SupplementGroup[];
  /** image banners between the goal sections, shown before the group with this key */
  banners: SupplementBanner[];
};

export type SupplementBanner = {
  before: string;
  image: string;
  alt: string;
  title: string;
  text: string;
  /** product the banner links to (its price is added to the button), or none */
  handle?: string;
  cta?: string;
  /** short facts shown as a list */
  points?: { title: string; text: string }[];
  tone: "green" | "lind";
};

const OM3_TEXTURE = "https://cdn.shopify.com/s/files/1/0564/6991/3683/files/om3_kapseln_07_textur_1536x1536_gruen_ohne_text.jpg?v=1794576684";
const OM3_INTAKE = "https://cdn.shopify.com/s/files/1/0564/6991/3683/files/om3_kapseln_02_einnahme_1536x1536_gruen_ohne_text.jpg?v=1794576694";

/** biomo vitamin D in four forms: shown as one card */
export const VITAMIN_D_HANDLES = ["vitamin-d3-biomo®-2-000-i-e-vegan", "vitamin-d3-biomo®-2-000-i-e", "vitamin-d3-biomo®-2-000-i-e-120-tabletten", "vitamin-d3-biomo®-tropfen"];
/** tests that show the values the supplements address */
export const MEASURE_FIRST_HANDLES = ["nahrstoff-rundum-check", "vitamin-d-test"];
/** combined formulas (several actives for one goal) vs single actives */
export const FORMULA_HANDLES = ["essentials-formula", "sleep-formula", "focus-formula", "recovery-formula", "mobility-formula", "metabolism-formula", "immunity-formula", "men-formula", "fem-formula"];

const de: SupplementsCopy = {
  pickTitle: "Wonach [[suchst du]]?",
  pickText: "Nach Ziel sortiert statt nach Marke. Formeln bündeln mehrere Stoffe für ein Ziel, Einzelstoffe ergänzen gezielt, am besten nach einer Messung.",
  measureTitle: "Erst messen, [[dann ergänzen]]",
  measureText: "Ein Bluttest zeigt, was dir wirklich fehlt. Danach ergänzt du gezielt statt auf Verdacht.",
  measureCta: "Alle Nährstoff-Tests",
  formulaNote: "Formel: mehrere Stoffe für ein Ziel",
  singleNote: "Einzelstoff: gezielt ergänzen",
  vitaminDTitle: "Vitamin D3 von biomo",
  vitaminDText: "2.000 I.E. in Apothekenqualität, als vegane Kapseln, Tabletten oder Tropfen mit anpassbarer Dosierung.",
  vitaminDForms: "Darreichungsform wählen",
  more: "Weitere",
  groups: [
    { key: "schlaf", title: "Schlaf & Stress", text: "Für Abende, an denen der Kopf nicht abschaltet, und für Phasen mit viel Belastung.", handles: ["sleep-formula", "glycin-nac-kapseln", "apigenin-kapseln"] },
    { key: "energie", title: "Energie & Fokus", text: "Für Konzentration im Alltag und Leistungsfähigkeit im Training.", handles: ["focus-formula", "kreatin-pulver", "taurin-kapseln", "ubiquinol-q10-kapseln"] },
    { key: "immun", title: "Immunsystem", text: "Für die Abwehr, besonders in der dunklen Jahreshälfte.", handles: ["immunity-formula", "vitamin-d"] },
    { key: "herz", title: "Herz & Stoffwechsel", text: "Für Blutfette, Blutzucker und einen ausgeglichenen Stoffwechsel.", handles: ["omega-3-kapseln", "berberin-kapseln", "metabolism-formula", "trimethylglycin-kapseln"] },
    { key: "gelenke", title: "Gelenke & Haut", text: "Für Beweglichkeit, Bindegewebe und Hydration.", handles: ["mobility-formula", "hyaluron-kapseln"] },
    { key: "longevity", title: "Longevity & Zellschutz", text: "Für zelluläre Erneuerung, Regeneration und gesundes Altern.", handles: ["spermidin-kapseln", "akg-calcium-alphaketoglutarat", "sulphoraphan-kapseln", "recovery-formula"] },
    { key: "basis", title: "Basis, Männer & Frauen", text: "Die tägliche Grundversorgung und Formeln, die auf den männlichen oder weiblichen Hormonhaushalt abgestimmt sind.", handles: ["essentials-formula", "men-formula", "fem-formula"] },
  ],
  banners: [
    {
      before: "energie",
      image: OM3_INTAKE,
      alt: "Frau hält eine Kapsel zwischen den Fingern, daneben ein Glas Wasser",
      title: "Formel oder [[Einzelstoff]]?",
      text: "Beides findest du in jedem Bereich. So entscheidest du, was zu dir passt.",
      points: [
        { title: "Formel", text: "Mehrere aufeinander abgestimmte Stoffe für ein Ziel, in einer Tagesportion." },
        { title: "Einzelstoff", text: "Ein Wirkstoff, gezielt dosiert. Am besten, wenn ein Bluttest zeigt, was dir fehlt." },
      ],
      tone: "lind",
    },
    {
      before: "herz",
      image: OM3_TEXTURE,
      alt: "Goldgelbe Omega-3-Kapseln in einer Reihe auf grünem Grund",
      title: "Omega-3 [[in rTG-Form]]",
      text: "Hochdosiertes EPA und DHA in besonders bioverfügbarer rTG-Form.",
      handle: "omega-3-kapseln",
      cta: "Zu Omega-3",
      tone: "green",
    },
  ],
};

const en: SupplementsCopy = {
  pickTitle: "What are you [[looking for]]?",
  pickText: "Sorted by goal, not by brand. Formulas bundle several actives for one goal, single actives supplement precisely, ideally after a measurement.",
  measureTitle: "Measure first, [[then supplement]]",
  measureText: "A blood test shows what you are really missing. Then you supplement on purpose instead of on suspicion.",
  measureCta: "All nutrient tests",
  formulaNote: "Formula: several actives for one goal",
  singleNote: "Single active: targeted supplementing",
  vitaminDTitle: "Vitamin D3 by biomo",
  vitaminDText: "2,000 IU in pharmacy quality, as vegan capsules, tablets or drops with adjustable dosing.",
  vitaminDForms: "Choose a form",
  more: "More",
  groups: [
    { key: "schlaf", title: "Sleep & stress", text: "For evenings when the mind won't switch off, and for demanding phases.", handles: ["sleep-formula", "glycin-nac-kapseln", "apigenin-kapseln"] },
    { key: "energie", title: "Energy & focus", text: "For concentration in everyday life and performance in training.", handles: ["focus-formula", "kreatin-pulver", "taurin-kapseln", "ubiquinol-q10-kapseln"] },
    { key: "immun", title: "Immune system", text: "For your defences, especially in the darker half of the year.", handles: ["immunity-formula", "vitamin-d"] },
    { key: "herz", title: "Heart & metabolism", text: "For blood lipids, blood sugar and a balanced metabolism.", handles: ["omega-3-kapseln", "berberin-kapseln", "metabolism-formula", "trimethylglycin-kapseln"] },
    { key: "gelenke", title: "Joints & skin", text: "For mobility, connective tissue and hydration.", handles: ["mobility-formula", "hyaluron-kapseln"] },
    { key: "longevity", title: "Longevity & cell protection", text: "For cellular renewal, recovery and healthy ageing.", handles: ["spermidin-kapseln", "akg-calcium-alphaketoglutarat", "sulphoraphan-kapseln", "recovery-formula"] },
    { key: "basis", title: "Basics, men & women", text: "Daily foundations and formulas tuned to the male or female hormone balance.", handles: ["essentials-formula", "men-formula", "fem-formula"] },
  ],
  banners: [
    {
      before: "energie",
      image: OM3_INTAKE,
      alt: "Woman holding a capsule between her fingers, a glass of water beside her",
      title: "Formula or [[single active]]?",
      text: "You will find both in every area. This is how to choose what suits you.",
      points: [
        { title: "Formula", text: "Several matched actives for one goal, in one daily serving." },
        { title: "Single active", text: "One active, dosed on purpose. Best when a blood test shows what you are missing." },
      ],
      tone: "lind",
    },
    {
      before: "herz",
      image: OM3_TEXTURE,
      alt: "Golden omega-3 capsules in a row on a green background",
      title: "Omega-3 [[in rTG form]]",
      text: "High-dose EPA and DHA in the highly bioavailable rTG form.",
      handle: "omega-3-kapseln",
      cta: "Shop omega-3",
      tone: "green",
    },
  ],
};

export const supplementsCopy = (locale: Locale): SupplementsCopy => (locale === "en" ? en : de);

/**
 * Home tests shown first under "Passt dazu" on a supplement page: tests that measure what the
 * supplement's goal is about. By group key, single products override. Editorial, change freely.
 */
const GROUP_TESTS: Record<string, string[]> = {
  schlaf: ["cortisol-check", "burnout-stess-check"],
  energie: ["mudigkeits-check", "fitness-check-pro"],
  immun: ["vitamin-d-test", "nahrstoff-rundum-check"],
  herz: ["lipid-check", "blutzucker-hba1c"],
  gelenke: ["enzundungscheck", "osteotest-home"],
  longevity: ["bio-age-kit", "enzundungscheck"],
  basis: ["nahrstoff-rundum-check", "vitamin-d-test"],
};
const PRODUCT_TESTS: Record<string, string[]> = {
  "men-formula": ["hormon-check-fur-manner", "nahrstoff-rundum-check"],
  "fem-formula": ["hormon-check-fur-frauen", "nahrstoff-rundum-check"],
  "focus-formula": ["neuro-vital-check", "mudigkeits-check"],
  "kreatin-pulver": ["fitness-check-pro", "aminosaeuren-test"],
  "taurin-kapseln": ["aminosaeuren-test", "fitness-check-pro"],
  "recovery-formula": ["fitness-check-pro", "enzundungscheck"],
  ...Object.fromEntries(VITAMIN_D_HANDLES.map((h) => [h, ["vitamin-d-test", "nahrstoff-rundum-check"]])),
};

export function testsForSupplement(handle: string): string[] {
  if (PRODUCT_TESTS[handle]) return PRODUCT_TESTS[handle];
  const group = de.groups.find((g) => g.handles.includes(handle));
  return (group && GROUP_TESTS[group.key]) ?? MEASURE_FIRST_HANDLES;
}

/**
 * Supplements shown first under "Passt dazu" on a home-test page (test handle → supplement handles).
 * Editorial, change freely; tests without an entry show only Shopify's test recommendations.
 */
const TEST_SUPPLEMENTS: Record<string, string[]> = {
  "heimtest-fettstoffwechsel": ["omega-3-kapseln"],
  "vitamin-d-test": ["vitamin-d3-biomo®-2-000-i-e"],
  "vitamin-d-test-winteraktion": ["vitamin-d3-biomo®-2-000-i-e"],
};

export const supplementsForTest = (handle: string): string[] => TEST_SUPPLEMENTS[handle] ?? [];

/** The other products of the supplement's goal group (empty when it is in no group) */
export const sameGoalSupplements = (handle: string): string[] => de.groups.find((g) => g.handles.includes(handle))?.handles ?? [];

/**
 * Home section "Erst messen, dann ergänzen": per goal the test that measures it and one supplement for it.
 * Editorial, change freely; a pair whose test or supplement is not for sale is left out.
 */
export const HOME_PAIRS: { goal: string; test: string; supplement: string }[] = [
  { goal: "immun", test: "vitamin-d-test", supplement: "vitamin-d3-biomo®-2-000-i-e" },
  { goal: "herz", test: "heimtest-fettstoffwechsel", supplement: "omega-3-kapseln" },
  { goal: "schlaf", test: "cortisol-check", supplement: "sleep-formula" },
  { goal: "longevity", test: "bio-age-kit", supplement: "spermidin-kapseln" },
];

export const homeSupplementsCopy = (locale: Locale) =>
  locale === "en"
    ? {
        kicker: "Supplements",
        title: "Measure first, [[then supplement]]",
        text: "A blood test shows where you stand. Then you supplement on purpose instead of on suspicion, with formulas and single actives sorted by goal.",
        measure: "Measure",
        supplement: "Supplement",
        cta: "All supplements",
        mira: "Ask Mira",
      }
    : {
        kicker: "Supplements",
        title: "Erst messen, [[dann ergänzen]]",
        text: "Ein Bluttest zeigt, wo du stehst. Danach ergänzt du gezielt statt auf Verdacht, mit Formeln und Einzelstoffen nach Ziel sortiert.",
        measure: "Messen",
        supplement: "Ergänzen",
        cta: "Alle Supplements",
        mira: "Mira fragen",
      };
