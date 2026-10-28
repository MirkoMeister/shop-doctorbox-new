"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import { formatMoney } from "@/lib/format";
import type { Money, Product, Variant } from "@/lib/shopify/types";
import { CheckIcon, MinusIcon, PinIcon, PlusIcon, TruckIcon } from "@/components/ui/Icons";
import { TassoNote } from "@/components/product/TassoNote";
import { unitPriceOf, type UnitPrice } from "@/lib/unit-price";

type Mode = "once" | "subscription";

export function PurchaseForm({
  product,
  locale,
  dict,
  onVariantChange,
}: {
  product: Product;
  locale: Locale;
  dict: Dictionary;
  onVariantChange?: (v: Variant) => void;
}) {
  const { add, pending } = useCart();
  // Default: the Tasso+ upper-arm variant when it exists and costs no more than the cheapest available
  // variant (a dearer option must be chosen actively), else the cheapest available, else the first
  const available = product.variants.filter((v) => v.availableForSale);
  const cheapest = available.reduce<Variant | null>((m, v) => (!m || parseFloat(v.price.amount) < parseFloat(m.price.amount) ? v : m), null);
  const tassoVariant = available.find((v) => v.selectedOptions.some((o) => isTasso(o.value)));
  const firstAvailable =
    (tassoVariant && cheapest && parseFloat(tassoVariant.price.amount) <= parseFloat(cheapest.price.amount) ? tassoVariant : null) ??
    cheapest ??
    product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(firstAvailable.selectedOptions.map((o) => [o.name, o.value])),
  );
  const [qty, setQty] = useState(1);
  const plans = product.sellingPlanGroups.flatMap((g) => g.sellingPlans);
  const hasPlans = plans.length > 0;
  const [mode, setMode] = useState<Mode>("once");
  const [planId, setPlanId] = useState<string>(plans[0]?.id ?? "");
  const [justAdded, setJustAdded] = useState(false);

  const variant = useMemo(() => {
    const match = product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value));
    return match ?? firstAvailable;
  }, [product.variants, selected, firstAvailable]);

  const allocation = variant.sellingPlanAllocations.find((a) => a.sellingPlan.id === planId);
  const subPrice: Money | null = allocation?.priceAdjustments[0]?.price ?? null;
  const subCompare: Money | null = allocation?.priceAdjustments[0]?.compareAtPrice ?? null;
  const activePrice = mode === "subscription" && subPrice ? subPrice : variant.price;
  const activeCompare = mode === "subscription" && subPrice ? subCompare : process.env.NEXT_PUBLIC_SHOW_COMPARE_PRICES !== "false" ? variant.compareAtPrice : null;
  const pct = plans[0]?.priceAdjustments[0]?.adjustmentValue;
  const savePct = pct && pct.__typename === "SellingPlanPercentagePriceAdjustment" ? Math.round(pct.adjustmentPercentage) : null;
  const pickup = variant.storeAvailability.find((s) => s.available);
  const unit = unitPriceOf(variant.title, activePrice);
  const unitLabel = (u: UnitPrice) =>
    u.unit === "per100" ? fill(dict.product.unitPer100, { unit: u.measure ?? "g" }) : dict.product[u.unit === "capsule" ? "unitCapsule" : u.unit === "tablet" ? "unitTablet" : "unitPiece"];
  const total = { amount: String(parseFloat(activePrice.amount) * qty), currencyCode: activePrice.currencyCode };

  function choose(name: string, value: string) {
    const next = { ...selected, [name]: value };
    setSelected(next);
    const v = product.variants.find((v) => v.selectedOptions.every((o) => next[o.name] === o.value));
    if (v) onVariantChange?.(v);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await add({
      merchandiseId: variant.id,
      quantity: qty,
      ...(mode === "subscription" && planId ? { sellingPlanId: planId } : {}),
    });
    if (ok) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col gap-6">
      {/* Price */}
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[1.75rem] font-semibold tabular-nums text-green">{formatMoney(activePrice, locale)}</span>
        {activeCompare && parseFloat(activeCompare.amount) > parseFloat(activePrice.amount) && (
          <s className="text-base tabular-nums text-ink-muted">{formatMoney(activeCompare, locale)}</s>
        )}
        {mode === "subscription" && <span className="text-sm text-ink-muted">{dict.product.perDelivery}</span>}
        <span className="basis-full text-xs text-ink-muted">
          inkl. MwSt.
          {unit && (
            <>
              {" · "}
              <span className="tabular-nums">{formatMoney(unit.price, locale)}</span> {unitLabel(unit)}
            </>
          )}
        </span>
      </div>

      {/* Variants */}
      {product.options.map((opt) => (
        <fieldset key={opt.name}>
          <legend className="mb-2 text-sm font-medium">{dict.product.chooseVariant}</legend>
          <div className="flex flex-wrap gap-2">
            {opt.values.map((val) => {
              const isSel = selected[opt.name] === val;
              const exists = product.variants.some(
                (v) =>
                  v.selectedOptions.some((o) => o.name === opt.name && o.value === val) &&
                  v.selectedOptions.every((o) => o.name === opt.name || selected[o.name] === o.value),
              );
              const avail = product.variants.find(
                (v) =>
                  v.selectedOptions.some((o) => o.name === opt.name && o.value === val) &&
                  v.selectedOptions.every((o) => o.name === opt.name || selected[o.name] === o.value),
              )?.availableForSale;
              return (
                <label
                  key={val}
                  className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                    isSel ? "border-green bg-green text-white" : "border-line bg-white hover:border-ink"
                  } ${exists && avail === false ? "line-through opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name={opt.name}
                    value={val}
                    checked={isSel}
                    onChange={() => choose(opt.name, val)}
                    className="sr-only"
                  />
                  {val}
                  {(() => {
                    const v = product.variants.find((x) => x.selectedOptions.some((o) => o.name === opt.name && o.value === val));
                    const u = v ? unitPriceOf(v.title, v.price) : null;
                    return u ? (
                      <span className={`ml-1.5 text-xs tabular-nums ${isSel ? "text-white/80" : "text-ink-muted"}`}>
                        {formatMoney(u.price, locale)} {unitLabel(u)}
                      </span>
                    ) : null;
                  })()}
                  {isTasso(val) && (
                    <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.1em] ${isSel ? "bg-white/20 text-white" : "bg-lind text-moss"}`}>
                      {dict.product.recommended}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      {variant.selectedOptions.some((o) => isTasso(o.value)) && <TassoNote locale={locale} dict={dict} />}

      {/* Purchase option */}
      {hasPlans && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium">{dict.product.purchaseOption}</legend>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`flex cursor-pointer flex-col gap-0.5 rounded-2xl border p-3.5 transition-colors ${
                mode === "once" ? "border-ink bg-white" : "border-line bg-surface hover:border-ink/50"
              }`}
            >
              <input type="radio" name="mode" className="sr-only" checked={mode === "once"} onChange={() => setMode("once")} />
              <span className="font-semibold">{dict.product.oneTime}</span>
              <span className="text-xs text-ink-muted">{dict.product.oneTimeHint}</span>
            </label>
            <label
              className={`flex cursor-pointer flex-col gap-0.5 rounded-2xl border p-3.5 transition-colors ${
                mode === "subscription" ? "border-green bg-white" : "border-line bg-surface hover:border-ink/50"
              }`}
            >
              <input
                type="radio"
                name="mode"
                className="sr-only"
                checked={mode === "subscription"}
                onChange={() => setMode("subscription")}
              />
              <span className="flex items-center gap-2 font-semibold">
                {dict.product.subscription}
                {savePct && <span className="rounded-full bg-okker px-2 py-0.5 text-xs font-semibold text-moss">−{savePct} %</span>}
              </span>
              <span className="text-xs text-ink-muted">{dict.product.subscriptionHint}</span>
            </label>
          </div>
          {mode === "subscription" && (
            <fieldset className="mt-3 rounded-2xl border border-green/40 bg-surface p-3">
              <legend className="sr-only">{dict.product.interval}</legend>
              <p className="mb-2 text-xs font-medium text-ink-muted">{dict.product.interval}</p>
              <div className="grid grid-cols-3 gap-2">
                {plans.map((p) => {
                  const selected = planId === p.id;
                  const short = planLabel(p, locale);
                  return (
                    <label
                      key={p.id}
                      className={`flex cursor-pointer flex-col items-center rounded-xl border px-2 py-2.5 text-center transition-colors ${
                        selected ? "border-green bg-green text-white" : "border-line bg-white hover:border-ink/50"
                      }`}
                    >
                      <input type="radio" name="plan" value={p.id} checked={selected} onChange={() => setPlanId(p.id)} className="sr-only" />
                      <span className="text-base font-semibold leading-tight">{short.value}</span>
                      <span className={`text-[0.7rem] ${selected ? "text-white/85" : "text-ink-muted"}`}>{short.unit}</span>
                    </label>
                  );
                })}
              </div>
              {savePct && (
                <p className="mt-2 text-xs text-ink-muted">{fill(dict.product.subscriptionSaving, { pct: savePct })}</p>
              )}
            </fieldset>
          )}
        </fieldset>
      )}

      {/* Quantity + CTA */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="inline-flex h-14 w-fit items-center rounded-full border border-line bg-white">
          <button
            type="button"
            className="inline-flex h-full w-12 items-center justify-center rounded-l-full hover:bg-surface"
            aria-label="−"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            <MinusIcon />
          </button>
          <span className="min-w-8 text-center font-medium tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="inline-flex h-full w-12 items-center justify-center rounded-r-full hover:bg-surface"
            aria-label="+"
            onClick={() => setQty((q) => Math.min(10, q + 1))}
          >
            <PlusIcon />
          </button>
        </div>
        <button type="submit" className="btn btn-primary btn-lg flex-1" disabled={!variant.availableForSale || pending}>
          {justAdded ? (
            <>
              <CheckIcon width={18} height={18} /> {dict.product.added}
            </>
          ) : !variant.availableForSale ? (
            dict.product.soldOut
          ) : pending ? (
            `${dict.product.adding}…`
          ) : (
            <>
              {dict.product.addToCart} <span className="opacity-80">·</span> {formatMoney(total, locale)}
            </>
          )}
        </button>
      </div>

      {/* Delivery & pickup */}
      <ul className="space-y-2 text-sm text-ink-muted">
        <li className="flex items-start gap-2.5">
          <TruckIcon width={18} height={18} className="mt-0.5 shrink-0 text-green" />
          <span>{dict.product.shippingHint}</span>
        </li>
        {pickup && (
          <li className="flex items-start gap-2.5">
            <PinIcon width={18} height={18} className="mt-0.5 shrink-0 text-green" />
            <span>
              <span className="font-medium text-ink">{fill(dict.product.pickupAvailable, { location: pickup.location.name })}</span>
              {pickup.pickUpTime && <> · {localizePickup(pickup.pickUpTime, locale)}</>}
              <br />
              <span>{dict.product.pickupHint}</span>
            </span>
          </li>
        )}
      </ul>
    </form>
  );
}

/** "Alle 3 Monate liefern, 20 % Rabatt" → { value: "3", unit: "Monate" } */
const isTasso = (value: string) => /tasso/i.test(value);

function planLabel(plan: { name: string; options: { name: string; value: string }[] }, locale: Locale): { value: string; unit: string } {
  const source = plan.options[0]?.value ?? plan.name;
  const m = source.match(/(\d+)\s*(Monat|Monate|month|months|Woche|Wochen|week|weeks)/i);
  if (m) {
    const n = Number(m[1]);
    const isWeek = /woche|week/i.test(m[2]);
    const unit = locale === "en" ? (isWeek ? (n === 1 ? "week" : "weeks") : n === 1 ? "month" : "months") : isWeek ? (n === 1 ? "Woche" : "Wochen") : n === 1 ? "Monat" : "Monate";
    return { value: locale === "en" ? `Every ${n}` : `Alle ${n}`, unit };
  }
  return { value: source, unit: "" };
}

/** Shopify localises pickUpTime via @inContext ("Gewöhnlich fertig in 2 Stunden"). Keep it short. */
function localizePickup(text: string, locale: Locale): string {
  const t = text.replace(/^Usually ready /i, "").replace(/^Gewöhnlich fertig /i, "").trim();
  if (!t) return text;
  return locale === "en" ? `Ready ${t}` : `Abholbereit ${t}`;
}
