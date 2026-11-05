"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon } from "@/components/ui/Icons";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Variant } from "@/lib/shopify/types";

/**
 * Box under the add-to-cart button for tests with a multi-buy discount (content/bundles.ts):
 * from two kits on every kit costs `percent` less. One tap puts the selected kit and a second
 * one (same or other variant) into the cart; the automatic Shopify discount does the rest.
 */
export function BundleOffer({
  percent,
  variant,
  variants,
  locale,
  dict,
}: {
  percent: number;
  variant: Variant;
  variants: Variant[];
  locale: Locale;
  dict: Dictionary;
}) {
  const { add, pending } = useCart();
  const [added, setAdded] = useState<string | null>(null);
  const t = dict.product;
  const unit = Number(variant.price.amount);
  // Shopify takes the discount off per kit and rounds it down to the cent
  const offer = (Math.round(unit * 100) - Math.floor(unit * percent)) / 100;
  const money = (n: number) => formatMoney({ amount: String(n), currencyCode: variant.price.currencyCode }, locale);
  const seconds = variants.filter((v) => v.availableForSale);

  async function addPair(second: Variant) {
    const lines = second.id === variant.id ? [{ merchandiseId: variant.id, quantity: 2 }] : [{ merchandiseId: variant.id, quantity: 1 }, { merchandiseId: second.id, quantity: 1 }];
    let ok = true;
    for (const line of lines) ok = (await add(line)) && ok;
    if (ok) {
      setAdded(second.id);
      setTimeout(() => setAdded(null), 2000);
    }
  }

  return (
    <aside className="rounded-2xl border border-green/40 bg-lind/30 p-4" aria-label={t.bundleKicker}>
      <p className="font-semibold text-moss">{t.bundleKicker}</p>
      <p className="mt-1 text-sm leading-snug text-ink">
        {fill(t.bundleSave, { percent, price: money(offer * 2), double: money(unit * 2), saving: money(unit * 2 - offer * 2) })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {seconds.map((v) => (
          <button key={v.id} type="button" onClick={() => addPair(v)} disabled={pending} className="btn btn-secondary btn-sm">
            {added === v.id ? (
              <>
                <CheckIcon width={16} height={16} /> {t.added}
              </>
            ) : seconds.length > 1 ? (
              fill(t.bundleAddSecond, { variant: v.title })
            ) : (
              t.bundleAdd
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
