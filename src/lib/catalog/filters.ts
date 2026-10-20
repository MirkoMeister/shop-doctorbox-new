import { sampleMaterials } from "@/lib/shopify/reshape";
import type { ProductCard } from "@/lib/shopify/types";

export type PriceBand = "lt50" | "50-100" | "gt100";
export const PRICE_BANDS: { key: PriceBand; min: number; max: number | null }[] = [
  { key: "lt50", min: 0, max: 50 },
  { key: "50-100", min: 50, max: 100 },
  { key: "gt100", min: 100, max: null },
];

export type CatalogFilters = {
  sample: string | null;
  price: PriceBand | null;
  value: string | null; // a biomarker ("Vitamin D", "Chlamydien")
  sub: boolean; // subscription available
};

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? null;

export function parseFilters(sp: SearchParamsLike): CatalogFilters {
  const price = first(sp.price);
  return {
    sample: first(sp.sample)?.trim() || null,
    price: PRICE_BANDS.some((b) => b.key === price) ? (price as PriceBand) : null,
    value: first(sp.value)?.trim() || null,
    sub: first(sp.sub) === "1",
  };
}

export function activeFilterCount(f: CatalogFilters): number {
  return [f.sample, f.price, f.value].filter(Boolean).length + (f.sub ? 1 : 0);
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export function applyFilters(products: ProductCard[], f: CatalogFilters): ProductCard[] {
  return products.filter((p) => {
    if (f.sample && !sampleMaterials(p.sampleMaterial).some((s) => norm(s) === norm(f.sample!))) return false;
    if (f.price) {
      const band = PRICE_BANDS.find((b) => b.key === f.price)!;
      const price = parseFloat(p.priceRange.minVariantPrice.amount);
      if (price < band.min || (band.max !== null && price >= band.max)) return false;
    }
    if (f.value && !p.biomarkers.some((b) => norm(b).includes(norm(f.value!)))) return false;
    if (f.sub && !p.hasSubscription) return false;
    return true;
  });
}

export type Facets = {
  samples: { value: string; count: number }[];
  values: { value: string; count: number }[];
  prices: { key: PriceBand; count: number }[];
  subscriptionCount: number;
};

/** Facets are computed from the unfiltered set so options never disappear. */
export function computeFacets(products: ProductCard[], maxValues = 14): Facets {
  const samples = new Map<string, number>();
  const values = new Map<string, number>();
  for (const p of products) {
    for (const s of sampleMaterials(p.sampleMaterial)) samples.set(s, (samples.get(s) ?? 0) + 1);
    for (const b of p.biomarkers) values.set(b, (values.get(b) ?? 0) + 1);
  }
  const sortDesc = (m: Map<string, number>) =>
    Array.from(m.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value, "de"));
  return {
    samples: sortDesc(samples),
    values: sortDesc(values).slice(0, maxValues),
    prices: PRICE_BANDS.map((b) => ({
      key: b.key,
      count: products.filter((p) => {
        const price = parseFloat(p.priceRange.minVariantPrice.amount);
        return price >= b.min && (b.max === null || price < b.max);
      }).length,
    })),
    subscriptionCount: products.filter((p) => p.hasSubscription).length,
  };
}

/** Guide pages that deepen a collection's topic (handle → /pages/<handle>) */
export const COLLECTION_GUIDES: Record<string, string> = {
  "sexuelle-gesundheit": "sti",
  sti: "sti",
  mannergesundheit: "mannergesundheit",
  "herz-kreislauf": "herz-kreislauf-pravention-ab-35-doctorbox-ratgeber",
  "nahrstoffe-vitamine": "ratgeber-vitamin-d",
  vorsorge: "ratgeber-darmkrebs",
  longevity: "biohacking",
  "energie-vitalitat": "mudigkeit",
  hormone: "burnout",
  "allgemeine-gesundheit": "ratgeber",
};
