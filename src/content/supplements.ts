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
};

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
};

export const supplementsCopy = (locale: Locale): SupplementsCopy => (locale === "en" ? en : de);
