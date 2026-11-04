import type { Locale } from "@/lib/i18n/config";
import { isSupplement } from "@/lib/shopify/reshape";
import type { ProductCard } from "@/lib/shopify/types";

/**
 * Sections of the all-products page (/collections) without active filters: every product shows up
 * once, in the first group (by `ASSIGN_ORDER`) whose Shopify collections it belongs to.
 * `OVERRIDES` pins products whose collections would put them somewhere misleading.
 * Products in none of the collections end up in "Weitere Tests"; supplements always in their own group.
 */
type GroupKey = "sti" | "naehrstoffe" | "hormone" | "herz" | "energie" | "longevity" | "dna" | "allergie" | "weitere" | "supplements";

type GroupDef = {
  key: GroupKey;
  title: Record<Locale, string>;
  text: Record<Locale, string>;
  /** Shopify collections that lead into this group */
  collections: string[];
  /** "show all" target */
  href?: string;
};

/** display order */
const GROUPS: GroupDef[] = [
  {
    key: "sti",
    title: { de: "Sexuelle Gesundheit", en: "Sexual health" },
    text: { de: "STI-Tests von Chlamydien bis HIV, HPV und Vaginalpilz.", en: "STI tests from chlamydia to HIV, HPV and vaginal thrush." },
    collections: ["sexuelle-gesundheit"],
    href: "/collections/sexuelle-gesundheit",
  },
  {
    key: "naehrstoffe",
    title: { de: "Vitamine & Nährstoffe", en: "Vitamins & nutrients" },
    text: { de: "Vitamin D, B12, Eisen und mehr: wissen, was dir fehlt.", en: "Vitamin D, B12, iron and more: know what you are missing." },
    collections: ["nahrstoffe-vitamine"],
    href: "/collections/nahrstoffe-vitamine",
  },
  {
    key: "hormone",
    title: { de: "Hormone & Fruchtbarkeit", en: "Hormones & fertility" },
    text: { de: "Schilddrüse, Testosteron, Zyklus und Kinderwunsch.", en: "Thyroid, testosterone, cycle and fertility." },
    collections: ["hormone", "kinderwunsch-fruchtbarkeit"],
    href: "/collections/hormone",
  },
  {
    key: "herz",
    title: { de: "Herz, Stoffwechsel & Organe", en: "Heart, metabolism & organs" },
    text: { de: "Blutfette, Blutzucker, Leber, Niere und Entzündungswerte.", en: "Blood lipids, blood sugar, liver, kidney and inflammation markers." },
    collections: ["herz-kreislauf", "vorsorge"],
    href: "/collections/herz-kreislauf",
  },
  {
    key: "energie",
    title: { de: "Energie, Stress & Müdigkeit", en: "Energy, stress & fatigue" },
    text: { de: "Wenn du dich ständig schlapp oder gestresst fühlst.", en: "When you constantly feel tired or stressed." },
    collections: ["energie-vitalitat"],
    href: "/collections/energie-vitalitat",
  },
  {
    key: "longevity",
    title: { de: "Rundum-Checks & Longevity", en: "Full checks & longevity" },
    text: { de: "Der große Überblick über deine Gesundheit und dein biologisches Alter.", en: "The big picture of your health and your biological age." },
    collections: ["longevity"],
    href: "/collections/longevity",
  },
  {
    key: "dna",
    title: { de: "DNA & Krebsvorsorge", en: "DNA & cancer screening" },
    text: { de: "Genetische Risiken erkennen und früh vorsorgen.", en: "Identify genetic risks and screen early." },
    collections: ["dna"],
    href: "/collections/dna",
  },
  {
    key: "allergie",
    title: { de: "Allergie, Darm & Unverträglichkeiten", en: "Allergy, gut & intolerances" },
    text: { de: "Allergien, Darmgesundheit und Unverträglichkeiten.", en: "Allergies, gut health and intolerances." },
    collections: ["allergie-unvertraglichkeiten"],
    href: "/collections/allergie-unvertraglichkeiten",
  },
  {
    key: "weitere",
    title: { de: "Weitere Tests", en: "More tests" },
    text: { de: "Einzelne Werte und besondere Tests.", en: "Single values and special tests." },
    collections: [],
  },
  {
    key: "supplements",
    title: { de: "Supplements", en: "Supplements" },
    text: { de: "Nahrungsergänzung, die zu deinen Werten passt.", en: "Supplements that match your results." },
    collections: [],
    href: "/collections/nahrungserganzungsmittel",
  },
];

/** which group wins when a product is in several collections */
const ASSIGN_ORDER: GroupKey[] = ["sti", "dna", "allergie", "hormone", "naehrstoffe", "energie", "herz", "longevity"];

const OVERRIDES: Record<string, GroupKey> = {
  "rundum-check-fur-frauen": "longevity",
  "rundum-check-fur-manner": "longevity",
  "neotes-bioage-test": "longevity",
  "cortisol-check": "energie",
  "burnout-stess-check": "energie",
  "abnehmen-set": "herz",
  "heimtest-fettstoffwechsel": "herz",
  "nierenfunktion-uacr": "herz",
  "anti-muller-hormontest": "hormone",
  "darmkrebsvorsorge": "dna",
  "psa-test-prostata-vorsorge": "dna",
  "leaky-gut": "allergie",
  "voc-imo-test": "allergie",
  "vitamin-d-test-winteraktion": "naehrstoffe",
  "sti-standard-4er-bundle": "sti",
};

export type CatalogGroup = { key: string; title: string; text: string; href?: string; products: ProductCard[] };

/** products keep their order (best-selling first) inside each group; empty groups are left out */
export function groupCatalog(products: ProductCard[], membership: Map<string, string[]>, locale: Locale): CatalogGroup[] {
  const byKey = new Map<GroupKey, ProductCard[]>(GROUPS.map((g) => [g.key, []]));
  for (const p of products) {
    let key: GroupKey | undefined = isSupplement(p) ? "supplements" : OVERRIDES[p.handle];
    if (!key) {
      const cols = membership.get(p.handle) ?? [];
      key = ASSIGN_ORDER.find((k) => GROUPS.find((g) => g.key === k)!.collections.some((c) => cols.includes(c))) ?? "weitere";
    }
    byKey.get(key)!.push(p);
  }
  return GROUPS.filter((g) => byKey.get(g.key)!.length > 0).map((g) => ({
    key: g.key,
    title: g.title[locale],
    text: g.text[locale],
    href: g.href,
    products: byKey.get(g.key)!,
  }));
}

/** the Shopify collections the groups are built from */
export const GROUP_COLLECTIONS = [...new Set(GROUPS.flatMap((g) => g.collections))];
