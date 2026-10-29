"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Product, Variant } from "@/lib/shopify/types";
import { Gallery } from "./Gallery";
import { PurchaseForm } from "./PurchaseForm";
import { useUrlVariant } from "./use-url-variant";

/**
 * Couples the gallery with the purchase form so a variant with its own
 * image (e.g. "Vaginalabstrich & Trockenblut") brings its picture forward.
 */
export function ProductBuyBox({
  product,
  locale,
  dict,
  children,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const urlVariant = useUrlVariant(product);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
      <Gallery images={product.images} title={product.title} activeImageUrl={(variant ?? urlVariant)?.image?.url} />
      <div>
        {children}
        <PurchaseForm product={product} locale={locale} dict={dict} onVariantChange={setVariant} />
      </div>
    </div>
  );
}
