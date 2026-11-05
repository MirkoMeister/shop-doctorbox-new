import type { ProductCard } from "@/lib/shopify/types";

/**
 * Overall rating of the shop: product ratings (Trusted Shops, Shopify metafield as fallback)
 * weighted by their number of reviews. Shared by the home hero and the footer so both agree.
 */
export function shopRating(products: Pick<ProductCard, "rating" | "ratingCount">[]): { value: number; count: number } | null {
  const rated = products.filter((p) => p.rating && p.ratingCount > 0);
  const count = rated.reduce((s, p) => s + p.ratingCount, 0);
  return count > 0 ? { value: rated.reduce((s, p) => s + (p.rating ?? 0) * p.ratingCount, 0) / count, count } : null;
}
