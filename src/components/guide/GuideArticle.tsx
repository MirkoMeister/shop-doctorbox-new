import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { ArticleCard } from "@/components/home/Sections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ReadingCompanion } from "@/components/guide/ReadingCompanion";
import { ArrowRight, ClockIcon, DropIcon } from "@/components/ui/Icons";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { formatDate, shopifyImage } from "@/lib/format";
import { BLOG_BASE, GUIDE_BASE } from "@/lib/content/guides";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import type { Article, ProductCard } from "@/lib/shopify/types";

export type RelatedGuide = { href: string; title: string };

/**
 * Reading layout for blog articles and guide pages. Magazine opener on cream
 * (category, headline, lead, byline; the photo breaks out of the cream band),
 * chapters as jump chips, one reading column with breakouts for figures,
 * recommended test on moss, byline box with Mira, related articles as cards.
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
  relatedArticles,
  relatedTitle,
  kind = "guide",
  allHref,
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
  /** blog: full articles for image cards instead of the plain title list */
  relatedArticles?: Article[];
  relatedTitle?: string;
  /** guide page (/pages/<handle>) or blog article (/blogs/<blog>/<slug>): drives breadcrumb and "all" labels */
  kind?: "guide" | "blog";
  /** Overview the "all" link and breadcrumb root point to (defaults to the guide/blog overview) */
  allHref?: string;
}) {
  const base = allHref ?? localeHref(locale, kind === "guide" ? GUIDE_BASE : BLOG_BASE);
  const t = dict.guide;
  const rootLabel = kind === "guide" ? t.title : dict.blog.title;
  const crumbs = [{ label: dict.common.home, href: localeHref(locale, "/") }, { label: rootLabel, href: base }, ...(topicHref ? [{ label: topicLabel, href: topicHref }] : []), { label: title }];
  const dateLine = publishedAt ? formatDate(publishedAt, locale) : updatedAt ? `${t.updated} ${formatDate(updatedAt, locale)}` : null;

  const byline = (
    <p className="mt-7 flex flex-wrap items-center gap-x-2 text-sm text-ink-muted">
      <span className="inline-flex items-center gap-1.5">
        <ClockIcon width={16} height={16} className="text-green" />
        {fill(t.readingTime, { n: readingMinutes })}
      </span>
      {dateLine && (
        <>
          <span aria-hidden className="text-line">|</span>
          <span>{dateLine}</span>
        </>
      )}
      {author && (
        <>
          <span aria-hidden className="text-line">|</span>
          <span>
            {dict.blog.by} <span className="font-medium text-ink">{author}</span>
          </span>
        </>
      )}
    </p>
  );

  return (
    <article className="pb-16">
      {/* Opener on cream: the photo breaks out of the band */}
      <header className="bg-soft">
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">
          <Breadcrumbs items={crumbs} className="mb-8" />
          <div className={heroImage ? "grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center lg:gap-14" : ""}>
            <div className="max-w-3xl">
              {topicHref ? (
                <Link href={topicHref} className="chip chip-soft !bg-white text-moss hover:!bg-lind">
                  {topicLabel}
                </Link>
              ) : (
                <span className="chip chip-soft !bg-white text-moss">{topicLabel}</span>
              )}
              <h1 className="h-display mt-5 text-balance text-moss">{title}</h1>
              {lead && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/80">{lead}</p>}
              {byline}
            </div>
            {heroImage && (
              <figure className="relative lg:-mb-28">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-panel)] bg-lind shadow-float lg:aspect-[4/5]">
                  <Image src={shopifyImage(heroImage.url, 1400)} alt={heroImage.alt ?? ""} fill priority sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
                </div>
              </figure>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Chapters as jump chips */}
        {toc.length > 1 && (
          <nav aria-label={t.contents} className={`mt-8 lg:mt-10 ${heroImage ? "lg:max-w-[58%]" : ""}`}>
            <p className="text-sm font-medium text-ink-muted">{t.contents}</p>
            <ol className="mt-3 flex flex-wrap gap-2">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="chip chip-outline hover:bg-lind">
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mx-auto mt-12 max-w-5xl lg:mt-24">
          {/* Article (the sentinel tells the reading companion when the text begins) */}
          <div id="article-start" aria-hidden className="h-px" />
          <div className="min-w-0">
            <div className="[&>.prose-db]:article-measure">{body}</div>

            {products.length > 0 && (
              <section id="recommended" className="mt-16 scroll-mt-24 rounded-[var(--radius-panel)] bg-moss p-6 text-soft sm:p-8 lg:p-10">
                <p className="text-sm font-medium text-turquoise">{t.recommendedKicker}</p>
                <h2 className="h3 mt-1">{products.length === 1 ? t.recommendedOne : t.recommendedMany}</h2>
                <ul className={`mt-6 grid gap-4 ${products.length > 1 ? "sm:grid-cols-2" : "sm:max-w-xl"}`}>
                  {products.slice(0, 2).map((p) => (
                    <li key={p.id}>
                      <TestTeaser product={p} locale={locale} dict={dict} compact={products.length > 1} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Byline box with the way to Mira */}
            <section className="article-measure mt-12 flex flex-col gap-5 rounded-[var(--radius-card)] bg-soft p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {author ? (
                  <p className="font-semibold text-moss">
                    {dict.blog.by} {author}
                  </p>
                ) : (
                  <p className="font-semibold text-moss">DoctorBox</p>
                )}
                <p className="mt-1 text-sm text-ink-muted">{dateLine ? `${dateLine} · ` : ""}{dict.footer.medical}</p>
              </div>
              <AskMiraButton label={dict.collection.miraCta} className="btn btn-secondary shrink-0" />
            </section>
          </div>
        </div>

        {products[0] && <ReadingCompanion product={products[0]} locale={locale} dict={dict} articleKey={title} />}

        {relatedArticles && relatedArticles.length > 0 ? (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="h2">{relatedTitle ?? t.related}</h2>
              <Link href={base} className="btn btn-tertiary -mr-3">
                {dict.blog.allArticles} <ArrowRight width={16} height={16} />
              </Link>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.slice(0, 3).map((a) => (
                <li key={a.handle}>
                  <ArticleCard article={a} locale={locale} dict={dict} />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-end justify-between gap-4">
                <h2 className="h2">{relatedTitle ?? t.related}</h2>
                <Link href={base} className="btn btn-tertiary -mr-3">
                  {kind === "guide" ? t.allGuides : dict.blog.allArticles} <ArrowRight width={16} height={16} />
                </Link>
              </div>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((g) => (
                  <li key={g.href}>
                    <Link
                      href={localeHref(locale, g.href)}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-white px-4 py-3.5 shadow-card transition-shadow hover:shadow-float"
                    >
                      <span className="font-medium leading-snug">{g.title}</span>
                      <ArrowRight width={18} height={18} className="shrink-0 text-green" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )
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
      className={`group block overflow-hidden rounded-[var(--radius-card)] border border-line/70 bg-white text-ink shadow-card transition-shadow hover:shadow-float ${compact ? "" : "sm:flex"}`}
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
