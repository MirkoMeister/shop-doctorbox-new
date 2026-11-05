"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon } from "@/components/ui/Icons";
import { formatMoney } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Money, Variant } from "@/lib/shopify/types";

export type Bundle = {
  handle: string;
  title: string;
  variants: { id: string; title: string; price: Money; availableForSale: boolean }[];
};

/**
 * Box under the add-to-cart button: the bundle of this test (content/bundles.ts) with its saving
 * against buying the selected variant twice. Picks the bundle variant with the same sample material.
 */
export function BundleOffer({ bundle, variant, locale, dict }: { bundle: Bundle; variant: Variant; locale: Locale; dict: Dictionary }) {
  const { add, pending } = useCart();
  const [added, setAdded] = useState(false);
  const available = bundle.variants.filter((v) => v.availableForSale);
  const match = available.find((v) => v.title === variant.title) ?? available[0];
  if (!match) return null;

  const price = Number(match.price.amount);
  const double = Number(variant.price.amount) * 2;
  const saving = Math.round((double - price) * 100) / 100;
  const money = (n: number) => formatMoney({ amount: String(n), currencyCode: match.price.currencyCode }, locale);
  const t = dict.product;

  async function addBundle() {
    if (await add({ merchandiseId: match!.id, quantity: 1 })) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <aside className="rounded-2xl border border-green/40 bg-lind/30 p-4" aria-label={bundle.title}>
      <p className="font-semibold text-moss">{t.bundleKicker}</p>
      <p className="mt-1 text-sm leading-snug text-ink">
        {saving > 0
          ? fill(t.bundleSave, { title: bundle.title, price: money(price), double: money(double), saving: money(saving) })
          : fill(t.bundlePlain, { title: bundle.title, price: money(price) })}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" onClick={addBundle} disabled={pending} className="btn btn-secondary btn-sm">
          {added ? (
            <>
              <CheckIcon width={16} height={16} /> {t.added}
            </>
          ) : (
            t.bundleAdd
          )}
        </button>
        <Link href={localeHref(locale, `/products/${bundle.handle}`)} className="text-sm font-medium text-green underline underline-offset-4">
          {t.bundleMore}
        </Link>
      </div>
    </aside>
  );
}
