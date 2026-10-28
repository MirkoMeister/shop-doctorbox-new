import Image from "next/image";
import Link from "next/link";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

/** A deal: regular price struck through, the code price large, the badge on the image. */
export function DealCard({ product, percent, badge, withCode, instead, locale, dict }: { product: ProductCard; percent: number; badge: string; withCode: string; instead: string; locale: Locale; dict: Dictionary }) {
  const price = product.priceRange.minVariantPrice;
  const deal = { amount: (parseFloat(price.amount) * (1 - percent / 100)).toFixed(2), currencyCode: price.currencyCode };
  const href = localeHref(locale, `/products/${product.handle}`);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white text-ink shadow-card transition-shadow hover:shadow-float">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-white" tabIndex={-1} aria-hidden>
        {product.featuredImage && (
          <Image src={shopifyImage(product.featuredImage.url, 800)} alt="" fill sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 50vw" className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-okker px-2.5 py-1 text-xs font-semibold text-moss">{badge}</span>
      </Link>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[1.0625rem] font-semibold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-green">
            {product.title.replace(/\s+[-|–]\s+.*$/, "")}
          </Link>
        </h3>
        {product.biomarkers.length > 0 && (
          <p className="mt-1 text-sm text-ink-muted">{product.biomarkers.length === 1 ? dict.product.valueCount : fill(dict.product.valuesCount, { n: product.biomarkers.length })}</p>
        )}
        <p className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-xl font-semibold tabular-nums text-green">{formatMoney(deal, locale)}</span>
          <span className="text-xs text-ink-muted">{withCode}</span>
          <s className="ml-auto text-sm tabular-nums text-ink-muted">
            <span className="sr-only">{instead} </span>
            {formatMoney(price, locale)}
          </s>
        </p>
      </div>
    </article>
  );
}
