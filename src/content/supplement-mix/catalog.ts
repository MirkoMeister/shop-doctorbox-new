import type { FormulaItem } from "@/lib/supplement-mix/engine";

/**
 * Types and demo pieces of the personalised mix (Riise). The sellable ingredient list is
 * content/supplement-mix/product-config.ts. No dose limits, steps or prices: the product rules are not defined yet.
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
