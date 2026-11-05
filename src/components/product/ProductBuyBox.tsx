"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Product, Variant } from "@/lib/shopify/types";
import { defaultVariant, isTassoVariant } from "./default-variant";
import { Gallery } from "./Gallery";
import type { Bundle } from "./BundleOffer";
import { PurchaseForm } from "./PurchaseForm";
import { TassoNote } from "./TassoNote";
import { useUrlVariant } from "./use-url-variant";

/**
 * Couples the gallery with the purchase form so a variant with its own
 * image (e.g. "Vaginalabstrich & Trockenblut") brings its picture forward, and the
 * Tasso+ hint shows on the first photo while the Tasso+ variant is selected.
 */
export function ProductBuyBox({
  product,
  locale,
  dict,
  children,
  bundle = null,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
  bundle?: Bundle | null;
}) {
  const [variant, setVariant] = useState<Variant | null>(null);
  const urlVariant = useUrlVariant(product);
  const shown = variant ?? urlVariant ?? defaultVariant(product);
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
      <Gallery
        images={product.images}
        title={product.title}
        activeImageUrl={(variant ?? urlVariant)?.image?.url}
        // the kit photo comes first: the Tasso+ hint sits on its lower edge while Tasso+ is selected
        firstSlideOverlay={isTassoVariant(shown) ? <TassoNote locale={locale} dict={dict} compact /> : null}
      />
      <div>
        {children}
        <PurchaseForm product={product} locale={locale} dict={dict} onVariantChange={setVariant} bundle={bundle} />
      </div>
    </div>
  );
}
