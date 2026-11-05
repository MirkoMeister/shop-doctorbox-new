"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CheckIcon, ChevronDown } from "@/components/ui/Icons";
import { formatMoney } from "@/lib/format";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Variant } from "@/lib/shopify/types";

/**
 * Box under the add-to-cart button for tests with a multi-buy discount (content/bundles.ts):
 * from two kits on every kit costs `percent` less. A collapsed bar "Als Paar testen" above the purchase
 * option opens every pair of variants (A + B first, then 2 × A, 2 × B); one tap puts the chosen pair into the
 * cart and the automatic Shopify discount does the rest.
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
  const [open, setOpen] = useState(false);
  const t = dict.product;
  const available = variants.filter((v) => v.availableForSale);
  // every pair of kits: A + B, 2 × A, 2 × B … (order does not matter); mixed pairs first, the common
  // case for a heterosexual couple (urine for him, vaginal swab for her)
  const pairs = available
    .flatMap((a, i) => available.slice(i).map((b) => [a, b] as const))
    .sort((x, y) => Number(x[0].id === x[1].id) - Number(y[0].id === y[1].id));
  const [pick, setPick] = useState<string | null>(null);
  const key = (p: readonly [Variant, Variant]) => `${p[0].id}|${p[1].id}`;
  // start with the first pair (the mixed one)
  const chosen = pairs.find((p) => key(p) === pick) ?? pairs[0];
  if (!chosen) return null;

  // Shopify takes the discount off per kit and rounds it down to the cent
  const off = (n: number) =>
    (Math.round(n * 100) - Math.floor(n * percent)) / 100;
  const full = (p: readonly [Variant, Variant]) =>
    Number(p[0].price.amount) + Number(p[1].price.amount);
  const pairPrice = (p: readonly [Variant, Variant]) =>
    off(Number(p[0].price.amount)) + off(Number(p[1].price.amount));
  const money = (n: number) =>
    formatMoney(
      {
        amount: String(Math.round(n * 100) / 100),
        currencyCode: variant.price.currencyCode,
      },
      locale,
    );
  // per-row prices only when the pairs cost different amounts
  const samePrice =
    new Set(pairs.map((p) => pairPrice(p).toFixed(2))).size === 1;
  const label = (p: readonly [Variant, Variant]) =>
    p[0].id === p[1].id ? `2 × ${p[0].title}` : `${p[0].title} + ${p[1].title}`;

  async function addPair() {
    const [a, b] = chosen!;
    const lines =
      a.id === b.id
        ? [{ merchandiseId: a.id, quantity: 2 }]
        : [
            { merchandiseId: a.id, quantity: 1 },
            { merchandiseId: b.id, quantity: 1 },
          ];
    let ok = true;
    for (const line of lines) ok = (await add(line)) && ok;
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  }

  return (
    <aside
      className={`rounded-2xl border transition-colors ${open ? "border-green/50 bg-lind/30" : "border-line bg-surface"}`}
      aria-label={fill(t.bundleKicker, { percent }).replace(/\[\[|\]\]/g, "")}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="couple-offer"
        className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left"
      >
        <span className="font-semibold">
          {/* the saving in the okker pill used for discounts elsewhere (Abo −20 %) */}
          {fill(t.bundleKicker, { percent })
            .split(/\[\[(.+?)\]\]/)
            .map((part, i) =>
              i % 2 ? (
                <span key={i} className="mx-0.5 rounded-full bg-okker px-2 py-0.5 text-moss">
                  {part}
                </span>
              ) : (
                part
              ),
            )}
        </span>
        <ChevronDown
          width={18}
          height={18}
          className={`shrink-0 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div id="couple-offer" className="px-3.5 pb-4">
          <fieldset>
            <legend className="text-sm text-ink-muted">{t.bundlePick}</legend>
            <div className="mt-2 grid gap-2 lg:grid-cols-2">
              {pairs.map((p) => {
                const on = key(p) === key(chosen);
                return (
                  <label
                    key={key(p)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                      on
                        ? "border-green bg-white font-semibold"
                        : "border-line bg-white/70 hover:border-ink/50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="bundle-pair"
                        checked={on}
                        onChange={() => setPick(key(p))}
                        className="accent-[var(--color-green)]"
                      />
                      {label(p)}
                    </span>
                    {!samePrice && (
                      <span className="shrink-0 tabular-nums">
                        {money(pairPrice(p))}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <button
            type="button"
            onClick={addPair}
            disabled={pending}
            className="btn btn-secondary mt-3 w-full sm:w-auto"
          >
            {added ? (
              <>
                <CheckIcon width={16} height={16} /> {t.added}
              </>
            ) : (
              <>
                {t.bundleAdd} <span className="opacity-80">·</span>{" "}
                {money(pairPrice(chosen))}{" "}
                <s className="font-normal opacity-70">{money(full(chosen))}</s>
              </>
            )}
          </button>
          <p className="mt-2 text-xs text-ink-muted">
            {fill(t.bundleNote, {
              saving: money(full(chosen) - pairPrice(chosen)),
            })}
          </p>
        </div>
      )}
    </aside>
  );
}
