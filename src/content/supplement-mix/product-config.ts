import type { Nutrient } from "@/content/supplement-mix/catalog";

/**
 * Sellable ingredient list of the personalised mix (issue #12, Julian 05.11.2026): only what is listed
 * here can be configured. Riise's catalogue alone does not extend the offer ("active" and "b2b" are not
 * enough). The live catalogue only confirms that each entry is still active and released for B2B and
 * supplies the current form name.
 *
 * DRAFT, not approved: the list covers the vitamins and minerals with an EU reference value (NRV) in
 * Riise's catalogue. Botanicals, probiotics and other substances (Ashwagandha, Kurkuma, Coenzym Q10,
 * MSM, Bacillus coagulans, Lutein, Phytosterine, Alpha-Liponsäure) are left out of the start scope.
 * No amounts, limits, steps, combinations or prices here: those need the product rules, which are not
 * defined yet. Riise's `limit_riise`, `eu_nrv`, `quantity` and `unit` are deliberately not used.
 *
 * Open per entry (to be documented, not guessed): vegan/allergen status, and whether the mg amount
 * refers to the daily portion, the active substance or the raw material.
 */
export const PRODUCT_CONFIG = {
  version: "2026-11-06-draft",
  approved: false,
  ingredients: [
    { key: "28", label: "Vitamin D3", form: "Vitamin D3 aus Rentierflechte", unit: "ug" },
    { key: "18", label: "Vitamin A", form: "Retinyl acetate", unit: "ug" },
    { key: "29", label: "Vitamin E", form: "400 IU natural acetate", unit: "mg" },
    { key: "30", label: "Vitamin K2 (MK-7)", form: "Vitamin K2 MK-7 (MenaQ7®)", unit: "ug" },
    { key: "27", label: "Vitamin C", form: "L-ascorbic acid", unit: "mg" },
    { key: "19", label: "Vitamin B1", form: "Thiamine hydrochloride", unit: "mg" },
    { key: "21", label: "Vitamin B2", form: "Riboflavin", unit: "mg" },
    { key: "22", label: "Vitamin B3 (Niacin)", form: "Nicotinamide", unit: "mg" },
    { key: "23", label: "Vitamin B5 (Pantothensäure)", form: "Calcium D-pantothenate", unit: "mg" },
    { key: "24", label: "Vitamin B6", form: "Pyridoxal 5'-phosphate (P-5-P)", unit: "mg" },
    { key: "25", label: "Vitamin B7 (Biotin)", form: "D-biotin", unit: "ug" },
    { key: "26", label: "Vitamin B9 (Folsäure)", form: "Pteroylmonoglutamic acid", unit: "ug", group: "folate" },
    { key: "33", label: "Vitamin B9 (L-5-MTHF)", form: "L-5-MTHF", unit: "ug", group: "folate" },
    { key: "34", label: "Vitamin B12 (Methylcobalamin)", form: "Methylcobalamin", unit: "ug" },
    { key: "39", label: "Magnesium (Bisglycinat)", form: "Magnesium bisglycinate", unit: "mg" },
    { key: "4", label: "Kalzium", form: "Calcium carbonate", unit: "mg" },
    { key: "16", label: "Kalium", form: "Potassium chloride", unit: "mg" },
    { key: "11", label: "Eisen", form: "Ferrous gluconate", unit: "mg" },
    { key: "31", label: "Zink", form: "Zinc bisglycinate", unit: "mg" },
    { key: "17", label: "Selen", form: "Sodium selenite", unit: "ug" },
    { key: "7", label: "Kupfer", form: "Copper di-D-gluconate", unit: "mg" },
    { key: "13", label: "Mangan", form: "Manganese sulfate monohydrate", unit: "mg" },
    { key: "5", label: "Chrom", form: "Chromium picolinate", unit: "ug" },
    // algae extract (Fucus vesiculosus): allergen and vegan status especially open
    { key: "37", label: "Jod (aus Fucus)", form: "Fucus vesiculosus P.E.", unit: "ug" },
  ] satisfies Nutrient[],
};
