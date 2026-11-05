import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { HOME_PAIRS, homeSupplementsCopy, supplementsCopy } from "@/content/supplements";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { SUPPLEMENTS_COLLECTION } from "@/lib/shopify/queries";
import type { ProductCard } from "@/lib/shopify/types";

const shortTitle = (t: string) => t.replace(/\s+[-|–]\s+.*$/, "").replace(/\s*\(.*?\)\s*/g, " ").trim();

/**
 * Home section for supplements: per goal the test that measures it (1) and a supplement for it (2),
 * the idea that sets DoctorBox apart from a plain supplement shop. Pairs: HOME_PAIRS in content/supplements.ts.
 */
export function SupplementsSpotlight({ products, locale }: { products: ProductCard[]; locale: Locale }) {
  const t = homeSupplementsCopy(locale);
  const goals = supplementsCopy(locale).groups;
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const pairs = HOME_PAIRS.map((pair) => ({
    goal: goals.find((g) => g.key === pair.goal)?.title ?? "",
    test: byHandle.get(pair.test),
    supplement: byHandle.get(pair.supplement),
  })).filter((p): p is { goal: string; test: ProductCard; supplement: ProductCard } => Boolean(p.test?.availableForSale && p.supplement?.availableForSale));
  if (pairs.length < 2) return null;
  const href = (path: string) => localeHref(locale, path);

  return (
    <section className="mt-20 bg-soft py-16 sm:py-20" aria-labelledby="supplements-spotlight">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-green">{t.kicker}</p>
            <h2 id="supplements-spotlight" className="h2 mt-2 text-balance">
              <Highlight text={t.title} />
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">{t.text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={href(`/collections/${SUPPLEMENTS_COLLECTION}`)} className="btn btn-primary">
              {t.cta} <ArrowRight width={16} height={16} />
            </Link>
            <AskMiraButton label={t.mira} className="btn btn-secondary" />
          </div>
        </div>

        {/* phone: one swipeable row (four stacked cards are very long); from sm on a grid */}
        <ul className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {pairs.map((p) => (
            <li key={p.goal} className="flex w-72 shrink-0 snap-start flex-col rounded-[var(--radius-card)] bg-white p-4 shadow-card sm:w-auto">
              <p className="px-1 font-semibold">{p.goal}</p>
              <ol className="mt-3 grid gap-2">
                {[
                  { step: 1, label: t.measure, product: p.test },
                  { step: 2, label: t.supplement, product: p.supplement },
                ].map(({ step, label, product }) => (
                  <li key={step}>
                    <Link
                      href={href(`/products/${product.handle}`)}
                      className="group flex items-center gap-3 rounded-xl p-1.5 transition-colors hover:bg-soft"
                    >
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-lind/40">
                        {product.featuredImage && (
                          <Image src={shopifyImage(product.featuredImage.url, 160)} alt="" fill sizes="64px" className="object-cover" />
                        )}
                        <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-moss text-[0.7rem] font-semibold text-soft">
                          {step}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs font-medium text-green">{label}</span>
                        <span className="block text-sm font-semibold leading-snug group-hover:text-green">{shortTitle(product.title)}</span>
                        <span className="block text-sm tabular-nums text-ink-muted">{formatMoney(product.priceRange.minVariantPrice, locale)}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
