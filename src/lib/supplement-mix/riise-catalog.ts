import "server-only";
import { FALLBACK_NUTRIENTS, type Nutrient } from "@/content/supplement-mix/catalog";

/** Riise's public ingredient catalogue (no key needed); read-only, cached for a day */
const URL = "https://api.weriise.de/api/ingredient/all";

type RiiseIngredient = {
  id: number | string;
  active: string;
  b2b: number | string;
  ingredient: string;
  ingredient_de: string | null;
  scientific_name: string | null;
  eu_nrv: string | null;
};

/** nutrients sold in microgram amounts (EU reference value below 1 mg); everything else in mg */
const unitFor = (r: RiiseIngredient): "mg" | "ug" => {
  const nrv = Number(r.eu_nrv);
  return nrv > 0 && nrv < 1 ? "ug" : "mg";
};

/** forms of one nutrient that may not be combined in a mix */
const groupFor = (name: string): string | undefined => {
  if (/vitamin b9|fols|folat|mthf/i.test(name)) return "folate";
  if (/vitamin b12/i.test(name)) return "b12";
  if (/^magnesium/i.test(name)) return "magnesium";
  return undefined;
};

/**
 * Active ingredients released for B2B, in Riise's current IDs. Falls back to the briefing's seven
 * nutrients when Riise is unreachable. Doses and prices are not part of this catalogue.
 */
export async function getRiiseNutrients(): Promise<{ nutrients: Nutrient[]; live: boolean }> {
  try {
    const res = await fetch(URL, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`riise ${res.status}`);
    const json = (await res.json()) as { data?: RiiseIngredient[] };
    const rows = (json.data ?? []).filter((r) => r.active === "Yes" && Number(r.b2b) === 1);
    if (!rows.length) throw new Error("riise: empty catalogue");
    const nutrients = rows
      .map((r) => {
        const label = (r.ingredient_de || r.ingredient).trim();
        return { key: String(r.id), label, form: (r.scientific_name || "").trim(), unit: unitFor(r), group: groupFor(label) };
      })
      .sort((a, b) => a.label.localeCompare(b.label, "de"));
    return { nutrients, live: true };
  } catch (err) {
    console.warn("[supplement-mix] Riise catalogue unavailable, using fallback", err instanceof Error ? err.message : err);
    return { nutrients: FALLBACK_NUTRIENTS, live: false };
  }
}
