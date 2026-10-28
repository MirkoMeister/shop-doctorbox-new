/**
 * Trusted Shops stores product reviews under the SKU that was sold at the time.
 * Products whose variants were renamed (lancet → Tasso+) or whose SKU changed keep
 * their reviews through this map: old SKU → product handle.
 * Found by comparing the Trusted Shops SKUs with the catalogue on 2026-10-28.
 */
export const LEGACY_REVIEW_SKUS: Record<string, string> = {
  STIPOM: "sti-pro-10",
  ALEX: "allergietest",
  "FRU-L1": "fruchtbarkeits-check-fur-frauen",
  "SCP-L1": "schilddrusen-check-plus",
  "HCM-L1": "hormon-check-fur-manner",
};

/** All SKUs whose reviews belong to a product: its variant SKUs plus retired ones */
export function reviewSkusFor(handle: string, variantSkus: (string | null)[]): string[] {
  const legacy = Object.entries(LEGACY_REVIEW_SKUS)
    .filter(([, h]) => h === handle)
    .map(([sku]) => sku);
  return [...variantSkus.filter((s): s is string => Boolean(s)), ...legacy];
}
