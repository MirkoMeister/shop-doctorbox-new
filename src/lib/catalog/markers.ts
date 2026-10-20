import type { Locale } from "@/lib/i18n/config";
import { VALUES, type ValueTopic } from "@/content/biomarkers.data";

/**
 * The complete marker portfolio across all kits, grouped for the B2B page.
 * Built from the editorial knowledge base so it stays in sync with the product pages.
 */
export type MarkerGroup = { key: string; label: string; markers: string[] };

const GROUP_LABELS: Record<ValueTopic | "sti", { de: string; en: string }> = {
  sti: { de: "Sexuell übertragbare Infektionen (PCR & Suchtests)", en: "Sexually transmitted infections (PCR & screening)" },
  hpv: { de: "HPV-Hochrisikotypen", en: "HPV high-risk types" },
  candida: { de: "Candida-Arten (PCR)", en: "Candida species (PCR)" },
  lipids: { de: "Herz-Kreislauf & Blutfette", en: "Cardiovascular & lipids" },
  glucose: { de: "Blutzucker", en: "Blood glucose" },
  hormones: { de: "Hormone", en: "Hormones" },
  thyroid: { de: "Schilddrüse", en: "Thyroid" },
  fertility: { de: "Fruchtbarkeit & Zyklus", en: "Fertility & cycle" },
  kidney: { de: "Niere & Elektrolyte", en: "Kidney & electrolytes" },
  liver: { de: "Leber", en: "Liver" },
  vitamins: { de: "Vitamine", en: "Vitamins" },
  nutrients: { de: "Mineralstoffe & Spurenelemente", en: "Minerals & trace elements" },
  inflammation: { de: "Entzündung", en: "Inflammation" },
  blood: { de: "Blutbild & Muskel", en: "Blood count & muscle" },
  longevity: { de: "Biologisches Alter", en: "Biological age" },
  prostate: { de: "Prostata", en: "Prostate" },
  bowel: { de: "Darmkrebsvorsorge (Stuhl)", en: "Bowel cancer screening (stool)" },
  gut: { de: "Darmgesundheit", en: "Gut health" },
  allergy: { de: "Allergene (spezifisches IgE, 295 Einzelallergene)", en: "Allergens (specific IgE, 295 single allergens)" },
  dna: { de: "Genetische Risikoscores", en: "Polygenic risk scores" },
  aminoacids: { de: "Aminosäuren (Trockenblut)", en: "Amino acids (dried blood)" },
  fattyacids: { de: "Fettsäuren & Omega-3-Index", en: "Fatty acids & omega-3 index" },
};

const STI_MARKERS = {
  de: ["Chlamydien", "Gonorrhö", "Trichomonaden", "HIV", "Syphilis", "Hepatitis C", "Mycoplasma genitalium", "Mycoplasma hominis", "Ureaplasma parvum", "Ureaplasma urealyticum"],
  en: ["Chlamydia", "Gonorrhoea", "Trichomonas", "HIV", "Syphilis", "Hepatitis C", "Mycoplasma genitalium", "Mycoplasma hominis", "Ureaplasma parvum", "Ureaplasma urealyticum"],
};
const HPV_TYPES = ["16", "18", "31", "33", "35", "39", "45", "51", "52", "56", "58", "59"];
const CANDIDA = ["albicans", "glabrata", "krusei", "tropicalis", "parapsilosis", "dubliniensis", "lusitaniae"];

const ORDER: (ValueTopic | "sti")[] = [
  "lipids", "glucose", "liver", "kidney", "thyroid", "hormones", "fertility", "vitamins", "nutrients", "inflammation", "blood", "longevity",
  "aminoacids", "fattyacids", "sti", "hpv", "candida", "prostate", "bowel", "gut", "allergy", "dna",
];

export function markerGroups(locale: Locale): MarkerGroup[] {
  const byTopic = new Map<ValueTopic | "sti", string[]>();
  for (const [key, e] of Object.entries(VALUES)) {
    const name = e.title?.[locale] ?? (locale === "en" ? e.aliases?.find((a) => /^[A-Z]/.test(a) && a !== key) ?? key : key);
    byTopic.set(e.topic, [...(byTopic.get(e.topic) ?? []), name]);
  }
  byTopic.set("sti", STI_MARKERS[locale]);
  byTopic.set("hpv", HPV_TYPES.map((t) => (locale === "en" ? `HPV type ${t}` : `HPV Typ ${t}`)));
  byTopic.set("candida", CANDIDA.map((c) => `Candida ${c}`));
  return ORDER.filter((t) => byTopic.has(t)).map((t) => ({
    key: t,
    label: GROUP_LABELS[t][locale],
    markers: Array.from(new Set(byTopic.get(t))).sort((a, b) => a.localeCompare(b, locale)),
  }));
}

export function markerCount(locale: Locale): number {
  return markerGroups(locale).reduce((n, g) => n + g.markers.length, 0);
}
