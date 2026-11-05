import type { Product, Variant } from "@/lib/shopify/types";

export const isTasso = (value: string) => /tasso/i.test(value);
export const isTassoVariant = (v: Pick<Variant, "selectedOptions"> | null | undefined) => Boolean(v?.selectedOptions.some((o) => isTasso(o.value)));

/**
 * The variant a product page starts with: the Tasso+ upper-arm variant when it exists and costs no more
 * than the cheapest available variant (a dearer option must be chosen actively), else the cheapest
 * available, else the first. Shared by the purchase form and the gallery's Tasso overlay.
 */
export function defaultVariant(product: Pick<Product, "variants">): Variant {
  const available = product.variants.filter((v) => v.availableForSale);
  const cheapest = available.reduce<Variant | null>((m, v) => (!m || parseFloat(v.price.amount) < parseFloat(m.price.amount) ? v : m), null);
  const tassoVariant = available.find(isTassoVariant);
  return (
    (tassoVariant && cheapest && parseFloat(tassoVariant.price.amount) <= parseFloat(cheapest.price.amount) ? tassoVariant : null) ??
    cheapest ??
    product.variants[0]
  );
}
