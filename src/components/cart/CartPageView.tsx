"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { useCart } from "./CartProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon, DropIcon, MinusIcon, PinIcon, PlusIcon, SearchIcon, ShieldIcon, SparkIcon, TruckIcon } from "@/components/ui/Icons";
import { activeCampaign } from "@/content/campaigns";
import { POPULAR_SEARCHES } from "@/content/search-suggestions";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { isSupplement, sampleMaterials } from "@/lib/shopify/reshape";
import type { Cart, CartLine, ProductCard as ProductCardType } from "@/lib/shopify/types";
import { trackViewCart } from "@/lib/tracking/events";

const PREVIEW = 8;

/** Analysed values of a cart line as small chips; long lists fold after a preview. */
function LineValues({ values, sample, variant, dict }: { values: string[]; sample: string | null; variant: string; dict: Dictionary }) {
  const [expanded, setExpanded] = useState(false);
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
              <button type="button" onClick={() => setExpanded(true)} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-muted hover:border-green hover:text-green">
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

function QuantityControl({ line, pending, update }: { line: CartLine; pending: boolean; update: (id: string, q: number) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-white">
      <button type="button" className="p-2.5 disabled:opacity-40" aria-label="−" disabled={pending} onClick={() => update(line.id, line.quantity - 1)}>
        <MinusIcon width={16} height={16} />
      </button>
      <span className="min-w-6 text-center text-sm tabular-nums">{line.quantity}</span>
      <button type="button" className="p-2.5 disabled:opacity-40" aria-label="+" disabled={pending} onClick={() => update(line.id, line.quantity + 1)}>
        <PlusIcon width={16} height={16} />
      </button>
    </div>
  );
}

/** One line as a card: image, title, variant, values or supplement note, quantity and price. */
function LineCard({ line, locale, dict, pending, update, remove }: { line: CartLine; locale: Locale; dict: Dictionary; pending: boolean; update: (id: string, q: number) => void; remove: (id: string) => void }) {
  const img = line.merchandise.image ?? line.merchandise.product.featuredImage;
  const product = line.merchandise.product;
  const supplement = isSupplement(product);
  const variantLabel = line.merchandise.selectedOptions
    .filter((o) => o.value !== "Default Title")
    .map((o) => o.value)
    .join(", ");
  const unit = { amount: String(parseFloat(line.cost.totalAmount.amount) / line.quantity), currencyCode: line.cost.totalAmount.currencyCode };
  const href = localeHref(locale, `/products/${product.handle}`);
  return (
    <li className="rounded-[var(--radius-card)] bg-white p-4 shadow-card sm:p-5">
      <div className="flex gap-4 sm:gap-5">
        <Link href={href} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface sm:h-28 sm:w-28">
          {img && <Image src={shopifyImage(img.url, 300)} alt="" fill sizes="112px" className="object-cover" />}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={href} className="text-[1.0625rem] font-semibold leading-snug hover:text-green">
                {product.title}
              </Link>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-muted">
                {supplement && <span className="rounded-full bg-lind px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide text-moss">{dict.search.supplementBadge}</span>}
                {variantLabel && <span>{variantLabel}</span>}
              </p>
              {line.sellingPlanAllocation && <p className="mt-1 text-sm text-green">{fill(dict.cart.subscriptionLine, { plan: line.sellingPlanAllocation.sellingPlan.name })}</p>}
            </div>
            <span className="shrink-0 text-right">
              <span className="block text-lg font-semibold tabular-nums">{formatMoney(line.cost.totalAmount, locale)}</span>
              {line.quantity > 1 && <span className="block text-xs text-ink-muted tabular-nums">{fill(dict.cart.perUnit, { n: line.quantity, price: formatMoney(unit, locale) })}</span>}
            </span>
          </div>

          {supplement ? (
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-muted">
              <TruckIcon width={14} height={14} className="text-green" />
              {dict.cart.youngleShipping}
            </p>
          ) : (
            <LineValues values={product.biomarkers} sample={product.sampleMaterial} variant={variantLabel} dict={dict} />
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <QuantityControl line={line} pending={pending} update={update} />
            <button type="button" onClick={() => remove(line.id)} disabled={pending} className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink disabled:opacity-40">
              {dict.cart.remove}
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

/** Subtotal, discount, promo, checkout and the trust points. */
function Summary({ cart, locale, dict, hasTests, pending, applyDiscount }: { cart: Cart; locale: Locale; dict: Dictionary; hasTests: boolean; pending: boolean; applyDiscount: (code: string | null) => Promise<boolean> }) {
  const [codeOpen, setCodeOpen] = useState(false);
  const [code, setCode] = useState("");
  const [invalid, setInvalid] = useState(false);
  const applied = cart.discountCodes.find((d) => d.applicable);
  const subtotal = parseFloat(cart.cost.subtotalAmount.amount);
  const total = parseFloat(cart.cost.totalAmount.amount);
  const discount = Math.max(0, subtotal - total);
  const campaign = activeCampaign(locale);
  const promo = campaign && hasTests && !applied ? campaign : null;

  async function submitCode(value: string) {
    const ok = await applyDiscount(value);
    setInvalid(!ok);
    if (ok) {
      setCode("");
      setCodeOpen(false);
    }
  }

  return (
    <aside className="h-fit rounded-[var(--radius-card)] bg-white p-6 shadow-card lg:sticky lg:top-28">
      <dl className="space-y-2 text-[0.95rem]">
        <div className="flex items-baseline justify-between">
          <dt className="text-ink-muted">{dict.cart.subtotal}</dt>
          <dd className="tabular-nums">{formatMoney(cart.cost.subtotalAmount, locale)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex items-baseline justify-between text-green">
            <dt>
              {dict.cart.discount}
              {applied && <span className="ml-1.5 rounded-full bg-lind px-2 py-0.5 text-xs font-semibold tracking-wide text-moss">{applied.code}</span>}
            </dt>
            <dd className="tabular-nums">−{formatMoney({ amount: String(discount), currencyCode: cart.cost.totalAmount.currencyCode }, locale)}</dd>
          </div>
        )}
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-semibold">{dict.cart.total}</dt>
          <dd className="text-2xl font-semibold tabular-nums">{formatMoney(cart.cost.totalAmount, locale)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-xs text-ink-muted">{dict.cart.vatNote}</p>

      {promo && (
        <div className="mt-5 rounded-2xl bg-soft p-4">
          <p className="font-semibold">{fill(dict.cart.promoTitle, { percent: promo.percent })}</p>
          <p className="mt-1 text-sm text-ink-muted">{fill(dict.cart.promoText, { code: promo.code, until: promo.until })}</p>
          <button type="button" onClick={() => submitCode(promo.code)} disabled={pending} className="btn btn-secondary btn-sm mt-3">
            {dict.cart.promoApply} · {promo.code}
          </button>
        </div>
      )}

      <div className="mt-4">
        {applied ? (
          <button type="button" onClick={() => applyDiscount(null)} disabled={pending} className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
            {dict.cart.discountRemove}
          </button>
        ) : codeOpen ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (code.trim()) submitCode(code);
            }}
            className="flex gap-2"
          >
            <input
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setInvalid(false);
              }}
              placeholder={dict.cart.discountPlaceholder}
              aria-label={dict.cart.discountToggle}
              autoFocus
              className="h-11 min-w-0 flex-1 rounded-full border border-line px-4 text-sm uppercase tracking-wide focus:border-green focus:outline-none"
            />
            <button type="submit" disabled={pending || !code.trim()} className="btn btn-secondary btn-sm">
              {dict.cart.discountApply}
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setCodeOpen(true)} className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
            {dict.cart.discountToggle}
          </button>
        )}
        {invalid && <p className="mt-2 text-sm text-red-700">{dict.cart.discountInvalid}</p>}
      </div>

      <a href={cart.checkoutUrl} className="btn btn-primary btn-lg mt-6 w-full">
        {dict.cart.checkout} <ArrowRight width={18} height={18} />
      </a>
      <p className="mt-3 flex items-start gap-2 text-xs text-ink-muted">
        <ShieldIcon width={14} height={14} className="mt-0.5 shrink-0" />
        {dict.cart.secure}
      </p>

      <ul className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        {hasTests && (
          <li className="flex items-start gap-2">
            <PinIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
            {dict.cart.pickupNote}
          </li>
        )}
        {dict.hero.usps.map((u) => (
          <li key={u} className="flex items-start gap-2">
            <CheckIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
            {u}
          </li>
        ))}
      </ul>
    </aside>
  );
}

function EmptyCart({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { setOpen } = useAssistant();
  const href = (p: string) => localeHref(locale, p);
  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
      <div>
        <h1 className="h1 text-balance">
          <Highlight text={dict.cart.emptyTitle} />
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-muted">{dict.cart.emptyLead}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={href("/collections")} className="btn btn-primary">
            {dict.cart.continue}
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="btn btn-secondary">
            <SparkIcon width={16} height={16} /> {dict.cart.emptyMira}
          </button>
        </div>
      </div>
      <div className="rounded-[var(--radius-panel)] bg-soft p-6">
        <p className="text-sm font-medium text-ink-muted">{dict.hero.popular}</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES[locale].map((t) => (
            <li key={t}>
              <Link href={`${href("/search")}?q=${encodeURIComponent(t)}`} className="chip chip-outline bg-white hover:bg-lind">
                <SearchIcon width={14} height={14} />
                {t}
              </Link>
            </li>
          ))}
        </ul>
        <Link href={href("/collections/nahrungserganzungsmittel")} className="btn btn-tertiary -ml-3 mt-4">
          {dict.cart.emptySupplements} <ArrowRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}

export function CartPageView({ locale, dict, suggestions = [] }: { locale: Locale; dict: Dictionary; suggestions?: ProductCardType[] }) {
  const { cart, loading, pending, update, remove, applyDiscount } = useCart();
  // view_cart once per visit of the cart page, as soon as the cart is known
  const viewTracked = useRef(false);
  useEffect(() => {
    if (viewTracked.current || !cart?.lines.length) return;
    viewTracked.current = true;
    trackViewCart(cart);
  }, [cart]);
  const lines = cart?.lines ?? [];
  const count = cart?.totalQuantity ?? 0;
  const hasTests = lines.some((l) => !isSupplement(l.merchandise.product));
  const hasSupplements = lines.some((l) => isSupplement(l.merchandise.product));
  const inCart = new Set(lines.map((l) => l.merchandise.product.handle));
  const picks = suggestions.filter((p) => !inCart.has(p.handle)).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-16">
      {loading ? (
        <>
          <h1 className="h1">{dict.cart.title}</h1>
          <p className="mt-8 text-ink-muted">{dict.common.loading}…</p>
        </>
      ) : lines.length === 0 || !cart ? (
        <EmptyCart locale={locale} dict={dict} />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="h1">
              {dict.cart.title} <span className="text-xl font-normal text-ink-muted">({count === 1 ? dict.cart.item : fill(dict.cart.items, { n: count })})</span>
            </h1>
            <Link href={localeHref(locale, "/collections")} className="text-sm font-medium text-green hover:underline">
              {dict.cart.continue}
            </Link>
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div>
              <ul className={`space-y-4 ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
                {lines.map((line) => (
                  <LineCard key={line.id} line={line} locale={locale} dict={dict} pending={pending} update={update} remove={remove} />
                ))}
              </ul>
              {hasTests && hasSupplements && (
                <p className="mt-4 flex items-start gap-2 rounded-2xl bg-soft px-4 py-3 text-sm text-ink-muted">
                  <TruckIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
                  {dict.cart.splitShipping}
                </p>
              )}
            </div>
            <Summary cart={cart} locale={locale} dict={dict} hasTests={hasTests} pending={pending} applyDiscount={applyDiscount} />
          </div>

          {hasTests && (
            <section className="mt-16" aria-labelledby="cart-next">
              <h2 id="cart-next" className="h3">
                <Highlight text={dict.cart.nextTitle} />
              </h2>
              <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {dict.home.steps.map((s, i) => (
                  <li key={s.title} className="relative pt-5">
                    <span className="absolute left-0 top-0 h-1 w-full rounded-full bg-moss/10" aria-hidden />
                    <span className="absolute left-0 top-0 h-1 rounded-full bg-green" style={{ width: `${((i + 1) / dict.home.steps.length) * 100}%` }} aria-hidden />
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {picks.length > 0 && (
            <section className="mt-16" aria-labelledby="cart-picks">
              <h2 id="cart-picks" className="h3">
                <Highlight text={dict.product.related} />
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {picks.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Mobile: total and checkout always within reach */}
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
              <span>
                <span className="block text-xs text-ink-muted">{dict.cart.total}</span>
                <span className="block text-lg font-semibold tabular-nums">{formatMoney(cart.cost.totalAmount, locale)}</span>
              </span>
              <a href={cart.checkoutUrl} className="btn btn-primary">
                {dict.cart.checkout} <ArrowRight width={16} height={16} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
