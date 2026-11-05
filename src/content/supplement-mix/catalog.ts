import type { FormulaItem } from "@/lib/supplement-mix/engine";

/**
 * Demo catalogue of the personalised mix (Riise), from the briefing (section 6, 05.11.2026).
 * Names, forms, Riise ingredient IDs and display units only: no dose limits, steps or prices,
 * because the product rulebook (product-rules.template.json) is still inactive.
 */
export type Nutrient = {
  key: string;
  label: string;
  /** form that Riise produces; shown so the label matches the product */
  form: string;
  /** current Riise ingredient ID; null while the form is undecided (not orderable) */
  riiseId: string | null;
  unit: "mg" | "ug";
  note?: string;
};

export const NUTRIENTS: Nutrient[] = [
  { key: "vitamin-d", label: "Vitamin D3", form: "Cholecalciferol", riiseId: "28", unit: "ug" },
  { key: "b12", label: "Vitamin B12", form: "Methylcobalamin", riiseId: "34", unit: "ug" },
  { key: "magnesium", label: "Magnesium", form: "Magnesiumbisglycinat", riiseId: "39", unit: "mg" },
  { key: "iron", label: "Eisen", form: "Eisengluconat", riiseId: "11", unit: "mg" },
  { key: "zinc", label: "Zink", form: "Zinkbisglycinat", riiseId: "31", unit: "mg" },
  { key: "folate", label: "Folat", form: "Folsäure oder L-5-MTHF, Form noch festzulegen", riiseId: null, unit: "ug", note: "Die Form (Riise-ID 26 oder 33) ist noch nicht festgelegt." },
  { key: "selenium", label: "Selen", form: "Natriumselenit", riiseId: "17", unit: "ug" },
];

/** Separate, separately priced product: fish oil softgels, 3 months (Riise order.omega3) */
export const OMEGA3 = {
  label: "Omega-3 (Fischöl-Softgels)",
  months: "3",
  /** confirmed from the briefing: fish oil, so excluded by fish allergy and vegetarian/vegan choice */
  tags: ["contains_fish", "non_vegetarian", "non_vegan"],
};

/** The briefing's example structure (DEMO_EXAMPLE), not a personal recommendation */
export const DEMO_EXAMPLE: FormulaItem[] = [
  { nutrientKey: "vitamin-d", amount: "20", unit: "ug" },
  { nutrientKey: "magnesium", amount: "200", unit: "mg" },
];

/** Mix runtime of the MVP: one pack, three months, one-time purchase */
export const MIX_MONTHS = "3";
