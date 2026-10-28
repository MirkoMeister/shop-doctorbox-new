import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon } from "@/components/ui/Icons";
import { STI_COLLECTION, stiCopy } from "@/content/sti-landing";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

const shortTitle = (t: string) => t.replace(/\s+[-|–]\s+.*$/, "").trim();

/**
 * Home spotlight for sexual health (the majority of orders): the three STI tests as a
 * coverage ladder, the discretion promise and the way into the landing page and Mira.
 */
export function StiSpotlight({ products, locale, dict }: { products: ProductCard[]; locale: Locale; dict: Dictionary }) {
  const t = stiCopy(locale).spotlight;
  const ladder = t.ladder.map((h) => products.find((p) => p.handle === h)).filter((p): p is ProductCard => Boolean(p));
  if (ladder.length < 2) return null;
  const collection = localeHref(locale, `/collections/${STI_COLLECTION}`);
  const max = Math.max(...ladder.map((p) => p.biomarkers.length));

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="sti-spotlight">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
        <div>
          <p className="text-sm font-medium text-green">{t.kicker}</p>
          <h2 id="sti-spotlight" className="h2 mt-2 text-balance">
            <Highlight text={t.title} />
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">{t.text}</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink">
            {t.usps.map((u) => (
              <li key={u} className="inline-flex items-center gap-1.5">
                <CheckIcon width={14} height={14} className="text-green" />
                {u}
              </li>
            ))}
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={collection} className="btn btn-primary">
              {t.cta} <ArrowRight width={16} height={16} />
            </Link>
            <AskMiraButton label={dict.collection.miraCta} className="btn btn-secondary" />
          </div>
        </div>

        <ol className="grid gap-3 sm:grid-cols-3">
          {ladder.map((p, i) => {
            const top = i === ladder.length - 1;
            return (
              <li key={p.id}>
                <Link
                  href={localeHref(locale, `/products/${p.handle}`)}
                  className={`group flex h-full flex-col rounded-[var(--radius-card)] border p-4 transition-shadow hover:shadow-float ${
                    top ? "border-moss bg-moss text-soft" : "border-line/70 bg-white shadow-card"
                  }`}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-lind/40">
                    {p.featuredImage && (
                      <Image src={shopifyImage(p.featuredImage.url, 480)} alt="" fill sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 90vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                    )}
                  </span>
                  <span className="mt-4 block font-semibold leading-snug">{shortTitle(p.title)}</span>
                  <span className={`mt-1 block text-sm ${top ? "text-soft/75" : "text-ink-muted"}`}>
                    {fill(dict.product.valuesCount, { n: p.biomarkers.length })}
                  </span>
                  <span className={`mt-2 block h-1.5 overflow-hidden rounded-full ${top ? "bg-white/15" : "bg-lind/60"}`} aria-hidden>
                    <span className={`block h-full rounded-full ${top ? "bg-turquoise" : "bg-green"}`} style={{ width: `${Math.round((p.biomarkers.length / max) * 100)}%` }} />
                  </span>
                  <span className="mt-auto flex items-end justify-between pt-4">
                    <span className="font-semibold tabular-nums">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                    <ArrowRight width={16} height={16} className={`transition-transform group-hover:translate-x-0.5 ${top ? "text-turquoise" : "text-green"}`} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <p className="mt-4 text-sm">
        <Link href={`${collection}#vergleich`} className="font-medium text-green hover:underline">
          {t.compare} →
        </Link>
      </p>
    </section>
  );
}
