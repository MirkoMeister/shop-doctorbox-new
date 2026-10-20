import type { Product, ProductCard, Variant } from "./types";

/* Raw shapes coming back from GraphQL (only what we touch) */
type RawMeta = { value: string } | null;
type Edges<T> = { edges: { node: T }[] } | null | undefined;

export type RawProductCard = Omit<
  ProductCard,
  "biomarkers" | "sampleMaterial" | "targetGroup" | "rating" | "ratingCount" | "hasSubscription" | "subscriptionPercent" | "tasso"
> & {
  options: { name: string; values: string[] }[];
  biomarkers: RawMeta;
  sampleMaterial: RawMeta;
  targetGroup: RawMeta;
  rating: RawMeta;
  ratingCount: RawMeta;
  subscriptionPlans: Edges<{
    sellingPlans: Edges<{ priceAdjustments: { adjustmentValue: { __typename: string; adjustmentPercentage?: number } }[] }>;
  }>;
};

type RawVariant = Omit<Variant, "sellingPlanAllocations" | "storeAvailability"> & {
  sellingPlanAllocations: Edges<Variant["sellingPlanAllocations"][number]>;
  storeAvailability: Edges<Variant["storeAvailability"][number]>;
};

export type RawProduct = RawProductCard &
  Omit<Product, keyof ProductCard | "images" | "variants" | "sellingPlanGroups" | "collections"> & {
    images: Edges<Product["images"][number]>;
    variants: Edges<RawVariant>;
    collections: Edges<{ handle: string; title: string }>;
    sellingPlanGroups: Edges<{
      name: string;
      options: { name: string; values: string[] }[];
      sellingPlans: Edges<Product["sellingPlanGroups"][number]["sellingPlans"][number]>;
    }>;
  };

const edgesToArray = <T>(c: Edges<T>): T[] => c?.edges.map((e) => e.node) ?? [];

/** Shopify translations occasionally return HTML-escaped titles ("Nährstoffe &amp; Vitamine"). */
export function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/** Collection titles sometimes carry an SEO suffix in the translation. */
export function cleanTitle(text: string): string {
  return decodeEntities(text).replace(/\s*\|\s*DoctorBox.*$/i, "").trim();
}

/** "Chlamydien, Gonorrhö (Tripper), HIV" or newline separated → string[] */
export function parseBiomarkers(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/\r?\n|,|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);
}

function parseRating(value: string | null | undefined): number | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as { value?: string | number };
    const n = Number(parsed.value);
    return Number.isFinite(n) ? n : null;
  } catch {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
}

/** Percentage discount of the first selling plan, e.g. 20 for "20 % Rabatt" */
function subscriptionPercent(raw: RawProductCard): number | null {
  const group = edgesToArray(raw.subscriptionPlans)[0];
  const plan = group ? edgesToArray(group.sellingPlans)[0] : undefined;
  const adj = plan?.priceAdjustments?.[0]?.adjustmentValue;
  if (adj?.__typename === "SellingPlanPercentagePriceAdjustment" && typeof adj.adjustmentPercentage === "number" && adj.adjustmentPercentage > 0) {
    return Math.round(adj.adjustmentPercentage);
  }
  return null;
}

export function reshapeProductCard(raw: RawProductCard): ProductCard {
  const ratingCount = Number(raw.ratingCount?.value ?? 0) || 0;
  const rating = parseRating(raw.rating?.value);
  return {
    id: raw.id,
    handle: raw.handle,
    title: decodeEntities(raw.title),
    availableForSale: raw.availableForSale,
    productType: raw.productType,
    tags: raw.tags,
    createdAt: raw.createdAt,
    featuredImage: raw.featuredImage,
    priceRange: raw.priceRange,
    compareAtPriceRange: raw.compareAtPriceRange,
    biomarkers: parseBiomarkers(raw.biomarkers?.value),
    sampleMaterial: raw.sampleMaterial?.value?.trim() || null,
    targetGroup: raw.targetGroup?.value?.trim() || null,
    rating: ratingCount > 0 ? rating : null,
    ratingCount,
    hasSubscription: edgesToArray(raw.subscriptionPlans).length > 0,
    subscriptionPercent: subscriptionPercent(raw),
    tasso: (raw.options ?? []).some((o) => o.values.some((v) => /tasso/i.test(v))),
  };
}

export function reshapeProduct(raw: RawProduct): Product {
  const card = reshapeProductCard(raw);
  return {
    ...card,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    seo: raw.seo,
    options: raw.options.filter((o) => !(o.name === "Title" && o.values.length === 1 && o.values[0] === "Default Title")),
    images: edgesToArray(raw.images),
    updatedAt: raw.updatedAt,
    collections: edgesToArray(raw.collections),
    sellingPlanGroups: edgesToArray(raw.sellingPlanGroups).map((g) => ({
      name: g.name,
      options: g.options,
      sellingPlans: edgesToArray(g.sellingPlans),
    })),
    variants: edgesToArray(raw.variants).map((v) => ({
      ...v,
      sellingPlanAllocations: edgesToArray(v.sellingPlanAllocations),
      storeAvailability: edgesToArray(v.storeAvailability),
    })),
  };
}

/** Italian catalogue is out of scope for this storefront */
export const EXCLUDED_TAGS = ["IT"];
export const EXCLUDED_COLLECTIONS = ["salute-sessuale"];

export function isVisibleProduct(p: { tags: string[] }): boolean {
  return !p.tags.some((t) => EXCLUDED_TAGS.includes(t));
}

/** Sample material metafield may hold "A | B" (one per variant) */
export function sampleMaterials(value: string | null): string[] {
  if (!value) return [];
  return value
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}
