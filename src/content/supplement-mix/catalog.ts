import type { FormulaItem } from "@/lib/supplement-mix/engine";

/**
 * Ingredient catalogue of the personalised mix (Riise). Names, forms and Riise IDs come live from
 * Riise's public catalogue (lib/supplement-mix/riise-catalog.ts); this file holds the fallback and the
 * demo pieces. No dose limits, steps or prices: the product rulebook is still inactive.
 */
export type Nutrient = {
  /** Riise ingredient ID */
  key: string;
  label: string;
  /** form that Riise produces (scientific name from the catalogue) */
  form: string;
  /** display unit; the canonical amount sent to Riise is always mg */
  unit: "mg" | "ug";
  /** forms of the same nutrient that may not be combined (e.g. folic acid and L-5-MTHF) */
  group?: string;
};

/** Fallback when Riise's catalogue cannot be loaded: the seven nutrients of the briefing (05.11.2026) */
export const FALLBACK_NUTRIENTS: Nutrient[] = [
  { key: "28", label: "Vitamin D3", form: "Vitamin D3 aus Rentierflechte", unit: "ug" },
  { key: "34", label: "Vitamin B12 (Methylcobalamin)", form: "Methylcobalamin", unit: "ug", group: "b12" },
  { key: "39", label: "Magnesium (Bisglycinat)", form: "Magnesium bisglycinate", unit: "mg", group: "magnesium" },
  { key: "11", label: "Eisen", form: "Ferrous gluconate", unit: "mg" },
  { key: "31", label: "Zink", form: "Zinc bisglycinate", unit: "mg" },
  { key: "26", label: "Vitamin B9 (Folsäure)", form: "Pteroylmonoglutamic acid", unit: "ug", group: "folate" },
  { key: "33", label: "Vitamin B9 (L-5-MTHF)", form: "L-5-MTHF", unit: "ug", group: "folate" },
  { key: "17", label: "Selen", form: "Sodium selenite", unit: "ug" },
];

/** Separate, separately priced product: fish oil softgels, 3 months (Riise order.omega3) */
export const OMEGA3 = {
  label: "Omega-3 (Fischöl-Softgels)",
  months: "3",
  /** confirmed from the briefing: fish oil, so excluded by fish allergy and vegetarian/vegan choice */
  tags: ["contains_fish", "non_vegetarian", "non_vegan"],
};

/** The briefing's example structure (DEMO_EXAMPLE), not a personal recommendation: Vitamin D3 and magnesium bisglycinate */
export const DEMO_EXAMPLE: FormulaItem[] = [
  { nutrientKey: "28", amount: "20", unit: "ug" },
  { nutrientKey: "39", amount: "200", unit: "mg" },
];

/** Mix runtime of the MVP: one pack, three months, one-time purchase */
export const MIX_MONTHS = "3";
