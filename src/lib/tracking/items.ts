import type { ProductCard } from "@/lib/shopify/types";
import type { TrackItem } from "./events";

/** Product card → tracking item (first variant, lowest price); server-safe, unlike events.ts */
export function itemFromCard(p: ProductCard): TrackItem {
  return {
    productId: p.id,
    variantId: p.firstVariant?.id ?? p.id,
    handle: p.handle,
    image: p.featuredImage?.url ?? null,
    name: p.title,
    variant: null,
    brand: p.vendor,
    category: p.productType,
    sku: p.firstVariant?.sku ?? null,
    price: Number(p.priceRange.minVariantPrice.amount),
    compareAt: p.compareAtPriceRange.minVariantPrice && Number(p.compareAtPriceRange.minVariantPrice.amount) > 0 ? Number(p.compareAtPriceRange.minVariantPrice.amount) : null,
    quantity: 1,
    currency: p.priceRange.minVariantPrice.currencyCode,
  };
}
