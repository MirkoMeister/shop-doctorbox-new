"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import { formatMoney, shopifyImage } from "@/lib/format";
import { DropIcon, MinusIcon, PinIcon, PlusIcon, ShieldIcon } from "@/components/ui/Icons";
import { sampleMaterials } from "@/lib/shopify/reshape";
import { useState } from "react";

const PREVIEW = 8;

/** Analysed values of a cart line as small chips; long lists fold after a preview. */
function LineValues({ values, sample, variant, dict }: { values: string[]; sample: string | null; variant: string; dict: Dictionary }) {
  const [expanded, setExpanded] = useState(false);
  // "A | B" holds one material per variant; show it only when unambiguous and not already the variant label
  const materials = sampleMaterials(sample);
  const material = materials.length === 1 && materials[0] !== variant ? materials[0] : null;
  if (!values.length && !material) return null;
  const shown = expanded ? values : values.slice(0, PREVIEW);
  const rest = values.length - shown.length;
  return (
    <div className="mt-2">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
        {material && (
          <span className="inline-flex items-center gap-1">
            <DropIcon width={12} height={12} className="text-green" />
            {material}
          </span>
        )}
        {values.length > 0 && <span>{values.length === 1 ? dict.product.valueCount : fill(dict.product.valuesCount, { n: values.length })}</span>}
      </p>
      {values.length > 0 && (
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {shown.map((v) => (
            <li key={v} className="rounded-full bg-lind/60 px-2.5 py-1 text-xs font-medium text-moss">
              {v}
            </li>
          ))}
          {rest > 0 && (
            <li>
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-green hover:text-green"
              >
                {fill(dict.cart.showValues, { n: rest })}
              </button>
            </li>
          )}
          {expanded && values.length > PREVIEW && (
            <li>
              <button type="button" onClick={() => setExpanded(false)} className="px-2 py-1 text-xs text-ink-muted underline underline-offset-4 hover:text-ink">
                {dict.cart.hideValues}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

export function CartPageView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { cart, loading, pending, update, remove } = useCart();
  const lines = cart?.lines ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <h1 className="h1">{dict.cart.title}</h1>

      {loading ? (
        <p className="mt-8 text-ink-muted">{dict.common.loading}…</p>
      ) : lines.length === 0 ? (
        <div className="mt-8 max-w-md">
          <p className="h4">{dict.cart.empty}</p>
          <p className="mt-2 text-ink-muted">{dict.cart.emptyText}</p>
          <Link href={localeHref(locale, "/collections")} className="btn btn-primary mt-6">
            {dict.cart.continue}
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
          <ul className={`divide-y divide-line ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
            {lines.map((line) => {
              const img = line.merchandise.image ?? line.merchandise.product.featuredImage;
              const variantLabel = line.merchandise.selectedOptions
                .filter((o) => o.value !== "Default Title")
                .map((o) => o.value)
                .join(", ");
              return (
                <li key={line.id} className="flex gap-5 py-6">
                  <Link
                    href={localeHref(locale, `/products/${line.merchandise.product.handle}`)}
                    className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-surface"
                  >
                    {img && <Image src={shopifyImage(img.url, 300)} alt="" fill sizes="112px" className="object-cover" />}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link
                      href={localeHref(locale, `/products/${line.merchandise.product.handle}`)}
                      className="text-lg font-semibold leading-snug hover:text-green"
                    >
                      {line.merchandise.product.title}
                    </Link>
                    {variantLabel && <p className="text-sm text-ink-muted">{variantLabel}</p>}
                    {line.sellingPlanAllocation && (
                      <p className="text-sm text-green">
                        {fill(dict.cart.subscriptionLine, { plan: line.sellingPlanAllocation.sellingPlan.name })}
                      </p>
                    )}
                    <LineValues values={line.merchandise.product.biomarkers} sample={line.merchandise.product.sampleMaterial} variant={variantLabel} dict={dict} />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center rounded-full border border-line bg-white">
                        <button type="button" className="p-2.5" aria-label="−" disabled={pending} onClick={() => update(line.id, line.quantity - 1)}>
                          <MinusIcon width={16} height={16} />
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button type="button" className="p-2.5" aria-label="+" disabled={pending} onClick={() => update(line.id, line.quantity + 1)}>
                          <PlusIcon width={16} height={16} />
                        </button>
                      </div>
                      <span className="text-lg font-semibold tabular-nums">{formatMoney(line.cost.totalAmount, locale)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.id)}
                      className="mt-1 self-start text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
                    >
                      {dict.cart.remove}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="h-fit rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card lg:sticky lg:top-24">
            <div className="flex items-baseline justify-between">
              <span className="text-ink-muted">{dict.cart.subtotal}</span>
              <span className="text-2xl font-semibold tabular-nums">{cart && formatMoney(cart.cost.subtotalAmount, locale)}</span>
            </div>
            <p className="mt-2 text-sm text-ink-muted">{dict.cart.shippingNote}</p>
            <p className="mt-3 flex items-start gap-2 text-sm">
              <PinIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
              {dict.cart.pickupNote}
            </p>
            {cart && (
              <a href={cart.checkoutUrl} className="btn btn-primary btn-lg mt-6 w-full">
                {dict.cart.checkout}
              </a>
            )}
            <p className="mt-4 flex items-start gap-2 text-xs text-ink-muted">
              <ShieldIcon width={14} height={14} className="mt-0.5 shrink-0" />
              {dict.cart.secure}
            </p>
            <Link href={localeHref(locale, "/collections")} className="mt-4 block text-center text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
              {dict.cart.continue}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
