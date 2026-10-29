"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/shopify/types";
import { itemFromVariant, trackViewItem } from "@/lib/tracking/events";

/** view_item / ViewContent for the product page (default variant, like the old theme) */
export function TrackViewItem({ product }: { product: Pick<Product, "id" | "title" | "vendor" | "productType" | "variants"> }) {
  const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const tracked = useRef<string | null>(null);
  useEffect(() => {
    // once per product; the ref also absorbs React's double effect run in development
    if (!variant || tracked.current === variant.id) return;
    tracked.current = variant.id;
    trackViewItem(itemFromVariant(product, variant));
  }, [product, variant]);
  return null;
}
