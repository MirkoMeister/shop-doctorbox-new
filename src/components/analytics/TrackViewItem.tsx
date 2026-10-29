"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/shopify/types";
import { itemFromVariant, trackViewItem } from "@/lib/tracking/events";
import { variantFromSearch } from "@/components/product/use-url-variant";

/** view_item / ViewContent for the product page: the variant from ?variant= (Shopping links), else the default */
export function TrackViewItem({ product }: { product: Pick<Product, "id" | "title" | "vendor" | "productType" | "variants"> }) {
  const tracked = useRef<string | null>(null);
  useEffect(() => {
    const variant = variantFromSearch(product.variants, window.location.search) ?? product.variants.find((v) => v.availableForSale) ?? product.variants[0];
    // once per product; the ref also absorbs React's double effect run in development
    if (!variant || tracked.current === product.id) return;
    tracked.current = product.id;
    trackViewItem(itemFromVariant(product, variant));
  }, [product]);
  return null;
}
