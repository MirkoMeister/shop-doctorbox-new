import "server-only";
import type { Nutrient } from "@/content/supplement-mix/catalog";
import { PRODUCT_CONFIG } from "@/content/supplement-mix/product-config";

/** Riise's public ingredient catalogue (no key needed); read-only, cached for a day */
const URL = "https://api.weriise.de/api/ingredient/all";

type RiiseIngredient = { id: number | string; active: string; b2b: number | string; scientific_name: string | null };

export type MixCatalog = {
  nutrients: Nutrient[];
  /** true when Riise's catalogue was reachable and checked */
  live: boolean;
  /** configured ingredients that Riise currently lists as inactive, not B2B or not at all */
  unavailable: string[];
  version: string;
};

/**
 * The configured ingredient list (PRODUCT_CONFIG), checked against Riise's live catalogue: entries that
 * Riise no longer offers for B2B drop out, the form name comes from Riise. The catalogue never adds
 * ingredients. When Riise is unreachable, the configured list is used as is.
 */
export async function getMixCatalog(): Promise<MixCatalog> {
  const configured = PRODUCT_CONFIG.ingredients;
  const version = PRODUCT_CONFIG.version;
  try {
    const res = await fetch(URL, { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`riise ${res.status}`);
    const json = (await res.json()) as { data?: RiiseIngredient[] };
    const byId = new Map((json.data ?? []).map((r) => [String(r.id), r]));
    if (!byId.size) throw new Error("riise: empty catalogue");
    const nutrients: Nutrient[] = [];
    const unavailable: string[] = [];
    for (const n of configured) {
      const r = byId.get(n.key);
      if (r && r.active === "Yes" && Number(r.b2b) === 1) nutrients.push({ ...n, form: (r.scientific_name || n.form).trim() });
      else unavailable.push(n.label);
    }
    if (unavailable.length) console.warn("[supplement-mix] configured but not available at Riise:", unavailable.join(", "));
    return { nutrients, live: true, unavailable, version };
  } catch (err) {
    console.warn("[supplement-mix] Riise catalogue unavailable, using the configured list", err instanceof Error ? err.message : err);
    return { nutrients: configured, live: false, unavailable: [], version };
  }
}
