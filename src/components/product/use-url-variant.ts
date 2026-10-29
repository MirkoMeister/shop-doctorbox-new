"use client";

import { useSyncExternalStore } from "react";
import type { Product, Variant } from "@/lib/shopify/types";

/** Numeric part of a Shopify variant gid, the value Shopify uses in ?variant= */
export const variantNumericId = (id: string) => id.slice(id.lastIndexOf("/") + 1);

/** The variant named by ?variant= in a query string (Google Shopping and shared links point there) */
export function variantFromSearch(variants: Variant[], search: string): Variant | undefined {
  const id = new URLSearchParams(search).get("variant");
  return id ? variants.find((v) => variantNumericId(v.id) === id) : undefined;
}

const subscribe = (onChange: () => void) => {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
};

/**
 * Variant from the URL. Product pages are prerendered, so the server snapshot is empty and the
 * page shows the default variant until hydration, then switches to the linked one.
 */
export function useUrlVariant(product: Pick<Product, "variants">): Variant | undefined {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => "");
  return variantFromSearch(product.variants, search);
}

/** Keeps ?variant= in the address bar in step with the selection, like the Shopify theme did */
export function writeVariantToUrl(variant: Variant) {
  const url = new URL(window.location.href);
  url.searchParams.set("variant", variantNumericId(variant.id));
  window.history.replaceState(window.history.state, "", url);
}
