import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import { formatMoney, shopifyImage } from "@/lib/format";
import { isSupplement, sampleMaterials } from "@/lib/shopify/reshape";
import type { ProductCard as ProductCardType } from "@/lib/shopify/types";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { DropIcon, RepeatIcon } from "@/components/ui/Icons";
import { BiomarkerChips } from "@/components/ui/Chips";

/** Evaluated once per server render/module load; cards are server components. */
const NOW = Date.now();

/**
 * Calm card: image, title, rating, one line that says who the test is for,
 * three key values as chips (the kits look alike, the values tell them apart),
 * then sample and value count next to the price with the subscription anchor.
 */
export function ProductCard({
  product,
  locale,
  dict,
  priority = false,
  bestseller = false,
  now = NOW,
}: {
  product: ProductCardType;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
  bestseller?: boolean;
  now?: number;
}) {
  const href = localeHref(locale, `/products/${product.handle}`);
  const samples = sampleMaterials(product.sampleMaterial);
  const isNew = now - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 60;
  const hasRange = product.priceRange.minVariantPrice.amount !== product.priceRange.maxVariantPrice.amount;
  const subPrice =
    product.hasSubscription && product.subscriptionPercent
      ? {
          amount: (parseFloat(product.priceRange.minVariantPrice.amount) * (1 - product.subscriptionPercent / 100)).toFixed(2),
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        }
      : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card transition-shadow hover:shadow-float">
      <Link href={href} className="relative block aspect-[5/4] overflow-hidden bg-surface" tabIndex={-1} aria-hidden>
        {product.featuredImage ? (
          <Image
            src={shopifyImage(product.featuredImage.url, 800)}
            alt=""
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-muted">DoctorBox</div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          {bestseller && <span className="chip !bg-moss !text-soft !px-2.5 !py-1 !text-xs">{dict.collection.bestseller}</span>}
          {isNew && <span className="chip !bg-okker !text-moss !px-2.5 !py-1 !text-xs">{dict.product.new}</span>}
          {product.tasso && <span className="chip !bg-white/90 !text-moss !px-2.5 !py-1 !text-xs">{dict.product.tassoChip}</span>}
          {!product.availableForSale && (
            <span className="chip !bg-white/90 !text-ink-muted !px-2.5 !py-1 !text-xs">{dict.product.soldOut}</span>
          )}
        </div>
        {product.hasSubscription && (
          <span
            className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-green"
            title={dict.product.subscription}
          >
            <RepeatIcon width={14} height={14} />
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-4 sm:p-5">
        <h3 className="text-[1.0625rem] font-semibold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-green">
            {product.title}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.ratingCount} dict={dict} compact />

        {isSupplement(product) ? (
          <>
            {product.vendor && <p className="text-xs font-medium uppercase tracking-[0.12em] text-green">{product.vendor.replace(/\s+GmbH$/i, "")}</p>}
            {product.excerpt && <p className="mt-1 line-clamp-3 text-sm leading-snug text-ink-muted">{product.excerpt}</p>}
          </>
        ) : (
          product.targetGroup && <p className="mt-1 line-clamp-2 text-sm leading-snug text-ink-muted">{product.targetGroup}</p>
        )}
        {product.biomarkers.length > 0 && <BiomarkerChips values={product.biomarkers} max={3} size="sm" className="relative z-10 mt-2.5" />}

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <dl className="flex min-w-0 flex-col gap-0.5 text-sm text-ink-muted">
            {samples.length > 0 && (
              <div className="inline-flex items-center gap-1.5 truncate">
                <DropIcon width={14} height={14} className="shrink-0 text-green" />
                <dt className="sr-only">{dict.product.sampleMaterial}</dt>
                <dd className="truncate">{samples[0]}</dd>
              </div>
            )}
            {product.biomarkers.length > 0 && (
              <div className="text-xs" title={product.biomarkers.join(", ")}>
                <dt className="sr-only">{dict.product.analysedValues}</dt>
                <dd>
                  {product.biomarkers.length === 1
                    ? dict.product.valueCount
                    : fill(dict.product.valuesCount, { n: product.biomarkers.length })}
                </dd>
              </div>
            )}
          </dl>
          <div className="flex shrink-0 flex-col items-end">
            <Price
              price={product.priceRange.minVariantPrice}
              compareAt={product.compareAtPriceRange.minVariantPrice}
              prefix={hasRange ? dict.product.priceFrom : undefined}
              locale={locale}
            />
            {subPrice && (
              <span className="text-xs tabular-nums text-ink-muted">{fill(dict.product.subscriptionFrom, { price: formatMoney(subPrice, locale) })}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({
  products,
  locale,
  dict,
  priorityCount = 0,
  bestsellerIds,
  insert,
}: {
  products: ProductCardType[];
  locale: Locale;
  dict: Dictionary;
  priorityCount?: number;
  bestsellerIds?: Set<string>;
  /** Extra tile (e.g. the Mira card) placed at this index */
  insert?: { index: number; node: React.ReactNode };
}) {
  const items: React.ReactNode[] = products.map((p, i) => (
    <li key={p.id}>
      <ProductCard product={p} locale={locale} dict={dict} priority={i < priorityCount} bestseller={bestsellerIds?.has(p.id)} />
    </li>
  ));
  if (insert && products.length >= insert.index) items.splice(insert.index, 0, <li key="__insert">{insert.node}</li>);
  return <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">{items}</ul>;
}
