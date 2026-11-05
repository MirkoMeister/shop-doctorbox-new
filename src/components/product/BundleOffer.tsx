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
  const [added, setAdded] = useState(false);
  const t = dict.product;
  const seconds = variants.filter((v) => v.availableForSale);
  // the second kit defaults to the same variant; a couple often wants the other one, so both are offered
  const [secondId, setSecondId] = useState<string | null>(null);
  const second = seconds.find((v) => v.id === secondId) ?? seconds.find((v) => v.id === variant.id) ?? seconds[0];
  if (!second) return null;

  const unit = Number(variant.price.amount);
  const unit2 = Number(second.price.amount);
  // Shopify takes the discount off per kit and rounds it down to the cent
  const off = (n: number) => (Math.round(n * 100) - Math.floor(n * percent)) / 100;
  const full = unit + unit2;
  const pair = off(unit) + off(unit2);
  const money = (n: number) => formatMoney({ amount: String(Math.round(n * 100) / 100), currencyCode: variant.price.currencyCode }, locale);

  async function addPair() {
    const lines =
      second!.id === variant.id
        ? [{ merchandiseId: variant.id, quantity: 2 }]
        : [
            { merchandiseId: variant.id, quantity: 1 },
            { merchandiseId: second!.id, quantity: 1 },
          ];
    let ok = true;
    for (const line of lines) ok = (await add(line)) && ok;
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <aside className="rounded-2xl border border-green/40 bg-lind/30 p-4" aria-label={fill(t.bundleKicker, { percent })}>
      <p className="font-semibold text-moss">{fill(t.bundleKicker, { percent })}</p>
      <dl className="mt-3 grid gap-2 text-sm">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <dt className="text-ink-muted">{t.bundleYours}:</dt>
          <dd className="font-medium">{variant.title}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">{t.bundleSecond}:</dt>
          <dd className="mt-1.5 flex flex-wrap gap-2">
            {seconds.map((v) => {
              const on = v.id === second.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSecondId(v.id)}
                  aria-pressed={on}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${on ? "border-green bg-green text-white" : "border-line bg-white hover:border-ink"}`}
                >
                  {v.title}
                </button>
              );
            })}
          </dd>
        </div>
      </dl>
      <button type="button" onClick={addPair} disabled={pending} className="btn btn-secondary mt-4 w-full sm:w-auto">
        {added ? (
          <>
            <CheckIcon width={16} height={16} /> {t.added}
          </>
        ) : (
          <>
            {t.bundleAdd} <span className="opacity-80">·</span> {money(pair)} <s className="font-normal opacity-70">{money(full)}</s>
          </>
        )}
      </button>
      <p className="mt-2 text-xs text-ink-muted">{fill(t.bundleNote, { saving: money(full - pair) })}</p>
    </aside>
  );
}
