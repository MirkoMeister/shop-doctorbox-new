import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowRight, ClockIcon, DropIcon } from "@/components/ui/Icons";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { formatDate, shopifyImage } from "@/lib/format";
import { GUIDE_BASE } from "@/lib/content/guides";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

export type RelatedGuide = { handle: string; title: string };

/**
 * Reading layout shared by guide pages and blog articles: calm header, optional
 * hero image, sticky table of contents, article column with a comfortable measure,
 * recommended test in the sidebar and at the end, related content to continue.
 */
export function GuideArticle({
  locale,
  dict,
  topicLabel,
  topicHref,
  title,
  lead,
  readingMinutes,
  updatedAt,
  publishedAt,
  author,
  heroImage,
  toc,
  body,
  products,
  related,
  relatedTitle,
  relatedBase = GUIDE_BASE,
}: {
  locale: Locale;
  dict: Dictionary;
  topicLabel: string;
  topicHref?: string;
  title: string;
  lead: string | null;
  readingMinutes: number;
  updatedAt?: string | null;
  publishedAt?: string | null;
  author?: string | null;
  heroImage?: { url: string; alt: string | null } | null;
  toc: { id: string; text: string }[];
  body: React.ReactNode;
  products: ProductCard[];
  related: RelatedGuide[];
  relatedTitle?: string;
  /** Route the related list and "all" link point to */
  relatedBase?: string;
}) {
  const base = localeHref(locale, relatedBase);
  const primary = products[0];
  const t = dict.guide;

  const crumbs = [{ label: dict.common.home, href: localeHref(locale, "/") }, { label: t.title, href: base }, ...(topicHref ? [{ label: topicLabel, href: topicHref }] : []), { label: title }];
  const meta = (
    <div className={`mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm ${heroImage ? "text-soft/80" : "text-ink-muted"}`}>
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon width={16} height={16} className={heroImage ? "text-turquoise" : "text-green"} />
        {fill(t.readingTime, { n: readingMinutes })}
      </span>
      {publishedAt && (
        <span>
          {dict.blog.published} {formatDate(publishedAt, locale)}
        </span>
      )}
      {!publishedAt && updatedAt && (
        <span>
          {t.updated} {formatDate(updatedAt, locale)}
        </span>
      )}
      {author && (
        <span>
          {dict.blog.by} {author}
        </span>
      )}
    </div>
  );

  return (
    <article className="pb-16">
      {heroImage ? (
        /* Photo hero: image full-bleed, moss gradient for readability, title on top */
        <header data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss text-soft lg:-mt-[88px]">
          <Image src={shopifyImage(heroImage.url, 2000)} alt={heroImage.alt ?? ""} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-moss via-moss/75 to-moss/35" />
          <div className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-[7.5rem] sm:px-6 lg:min-h-[78vh] lg:px-8 lg:pb-16 lg:pt-[10rem]">
            <Breadcrumbs items={crumbs} className="mb-6 [&_*]:text-soft/70 [&_[aria-current]]:text-soft" />
            {topicHref ? (
              <Link href={topicHref} className="text-sm font-medium text-turquoise hover:underline">
                {topicLabel}
              </Link>
            ) : (
              <p className="text-sm font-medium text-turquoise">{topicLabel}</p>
            )}
            <h1 className="h-display mt-3 max-w-4xl text-balance">{title}</h1>
            {lead && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-soft/85">{lead}</p>}
            {meta}
          </div>
        </header>
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 lg:pt-8">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <header className="mx-auto max-w-3xl lg:mx-0 lg:max-w-4xl">
            {topicHref ? (
              <Link href={topicHref} className="text-sm font-medium text-green hover:underline">
                {topicLabel}
              </Link>
            ) : (
              <p className="text-sm font-medium text-green">{topicLabel}</p>
            )}
            <h1 className="h-display mt-3 text-balance">{title}</h1>
            {lead && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-muted">{lead}</p>}
            {meta}
          </header>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[minmax(0,280px)_minmax(0,1fr)_minmax(0,280px)]">
        {/* Sidebar: table of contents */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          {toc.length > 1 && (
            <>
              <details className="rounded-2xl border border-line bg-white lg:hidden">
                <summary className="cursor-pointer list-none px-4 py-3 font-semibold [&::-webkit-details-marker]:hidden">{t.contents}</summary>
                <ol className="space-y-1 border-t border-line px-4 py-3">
                  {toc.map((h, i) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="flex gap-2 py-1 text-[0.95rem] text-ink-muted hover:text-green">
                        <span className="tabular-nums text-ink-muted/60">{String(i + 1).padStart(2, "0")}</span>
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
              <nav aria-label={t.contents} className="hidden lg:block">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{t.contents}</p>
                <ol className="mt-3 space-y-1 border-l border-line">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-[0.95rem] leading-snug text-ink-muted transition-colors hover:border-green hover:text-ink">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </>
          )}
          {primary && (
            <div className="mt-8 hidden lg:block xl:hidden">
              <TestTeaser product={primary} locale={locale} dict={dict} compact />
            </div>
          )}
        </aside>

        {/* Article */}
        <div className="min-w-0">
          {body}

          {products.length > 0 && (
            <section className="mt-14 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-8">
              <p className="text-sm font-medium text-green">{t.recommendedKicker}</p>
              <h2 className="h3 mt-1">{products.length === 1 ? t.recommendedOne : t.recommendedMany}</h2>
              <ul className={`mt-6 grid gap-4 ${products.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {products.slice(0, 2).map((p) => (
                  <li key={p.id}>
                    <TestTeaser product={p} locale={locale} dict={dict} compact={products.length > 1} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="mt-10 border-t border-line pt-4 text-xs text-ink-muted">{dict.footer.medical}</p>
        </div>

        {/* Right rail (xl): recommended test */}
        <aside className="hidden xl:block xl:sticky xl:top-28 xl:self-start">
          {primary && <TestTeaser product={primary} locale={locale} dict={dict} compact />}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <h2 className="h2">{relatedTitle ?? t.related}</h2>
            <Link href={base} className="btn btn-tertiary -mr-3">
              {relatedBase === GUIDE_BASE ? t.allGuides : dict.blog.allArticles} <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <li key={g.handle}>
                <Link
                  href={localeHref(locale, `${relatedBase}/${g.handle}`)}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-white px-4 py-3.5 shadow-card transition-shadow hover:shadow-float"
                >
                  <span className="font-medium leading-snug">{g.title}</span>
                  <ArrowRight width={18} height={18} className="shrink-0 text-green" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      </div>
    </article>
  );
}

function TestTeaser({ product, locale, dict, compact = false }: { product: ProductCard; locale: Locale; dict: Dictionary; compact?: boolean }) {
  const href = localeHref(locale, `/products/${product.handle}`);
  const sample = product.sampleMaterial?.split("|")[0]?.trim();
  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card transition-shadow hover:shadow-float ${compact ? "" : "sm:flex"}`}
    >
      <span className={`relative block bg-surface ${compact ? "aspect-[5/4]" : "aspect-[5/4] sm:w-44 sm:shrink-0 sm:aspect-auto"}`}>
        {product.featuredImage && (
          <Image src={shopifyImage(product.featuredImage.url, 480)} alt="" fill sizes="280px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        )}
      </span>
      <span className="block p-4">
        <span className="block text-xs font-medium text-green">{dict.guide.recommendedKicker}</span>
        <span className="mt-1 block font-semibold leading-snug">{product.title}</span>
        <span className="mt-1 block">
          <Rating value={product.rating} count={product.ratingCount} dict={dict} compact />
        </span>
        <span className="mt-3 flex items-end justify-between gap-3">
          <span className="flex flex-col text-xs text-ink-muted">
            {sample && (
              <span className="inline-flex items-center gap-1">
                <DropIcon width={12} height={12} className="text-green" />
                {sample}
              </span>
            )}
            {product.biomarkers.length > 0 && (
              <span>{product.biomarkers.length === 1 ? dict.product.valueCount : fill(dict.product.valuesCount, { n: product.biomarkers.length })}</span>
            )}
          </span>
          <Price price={product.priceRange.minVariantPrice} locale={locale} size="sm" />
        </span>
        <span className="btn btn-primary btn-sm mt-4 w-full">{dict.guide.toTest}</span>
      </span>
    </Link>
  );
}
