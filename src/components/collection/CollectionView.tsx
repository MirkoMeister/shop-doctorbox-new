import { guideHref } from "@/lib/content/guides";
import { existsSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Suspense } from "react";
import { AssistantCard } from "@/components/collection/AssistantCard";
import { CollectionHero } from "@/components/collection/CollectionHero";
import { collectionHero } from "@/content/collection-heroes";
import { CompareTable } from "@/components/collection/CompareTable";
import { StickyMiraCta } from "@/components/collection/StickyMiraCta";
import { StiDiscreet, StiFaq, StiSituations, StiWindows } from "@/components/collection/StiLanding";
import { STI_COLLECTION, stiCopy } from "@/content/sti-landing";
import { isSupplement } from "@/lib/shopify/reshape";
import { miraDemo } from "@/content/mira-demo";
import { FilterBar } from "@/components/collection/FilterBar";
import { RichText } from "@/components/content/RichText";
import { ProductGrid } from "@/components/product/ProductCard";
import { InlineSearch } from "@/components/search/InlineSearch";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import {
  ArrowRight,
  CheckIcon,
  LabIcon,
  PhoneIcon,
  PinIcon,
  ShieldIcon,
} from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import {
  COLLECTION_GUIDES,
  applyFilters,
  computeFacets,
  parseFilters,
  type SearchParamsLike,
} from "@/lib/catalog/filters";
import { stripHtml, truncate } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Collection, ProductCard } from "@/lib/shopify/types";
import type { ProductSort } from "@/lib/shopify/queries";

/**
 * Shared layout for /collections and /collections/[handle].
 * Order follows what works for home-test shops: short intro + trust,
 * a value search, a small filter row, calm cards, explanation and FAQ last.
 */
export function CollectionView({
  locale,
  dict,
  title,
  intro,
  descriptionHtml,
  handle,
  products,
  sort,
  searchParams,
  crumbs,
  otherCollections,
  guideTitle,
}: {
  locale: Locale;
  dict: Dictionary;
  title: string;
  intro: string | null;
  descriptionHtml?: string | null;
  handle: string | null;
  products: ProductCard[];
  sort: ProductSort;
  searchParams: SearchParamsLike;
  crumbs: Crumb[];
  otherCollections: Collection[];
  guideTitle?: string | null;
}) {
  const filters = parseFilters(searchParams);
  const facets = computeFacets(products);
  const filtered = applyFilters(products, filters);
  const bestsellers = new Set(
    sort === "relevance" ? products.slice(0, 2).map((p) => p.id) : [],
  );
  const guideHandle = handle ? COLLECTION_GUIDES[handle] : null;
  const href = (p: string) => localeHref(locale, p);
  const hero = collectionHero(handle, locale);
  const sti = handle === STI_COLLECTION ? stiCopy(locale) : null;
  const supplements = products.length > 0 && products.every(isSupplement);
  const heroImage =
    handle &&
    existsSync(
      path.join(
        process.cwd(),
        "public",
        "hero",
        "collections",
        `${handle}.jpg`,
      ),
    )
      ? `/hero/collections/${handle}.jpg`
      : null;

  const trust = [
    { icon: LabIcon, text: dict.collection.trustLab },
    { icon: PhoneIcon, text: dict.collection.trustResult },
    { icon: ShieldIcon, text: dict.collection.trustDiscreet },
    { icon: PinIcon, text: dict.collection.trustPickup },
  ];

  return (
    <>
      {hero && (
        <CollectionHero
          locale={locale}
          dict={dict}
          copy={hero}
          crumbs={crumbs}
          image={heroImage}
        />
      )}
      <div
        className={`mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 ${hero ? "pt-10 lg:pt-14" : "pt-5 lg:pt-8"}`}
      >
        {!hero && <Breadcrumbs items={crumbs} className="mb-5" />}

        {/* Sexual health: situation picker and pathogen comparison before the grid */}
        {sti && (
          <>
            <StiSituations products={products} locale={locale} dict={dict} />
            <CompareTable products={products} locale={locale} dict={dict} id="vergleich" title={sti.compareTitle} text={sti.compareText} />
            <StiWindows locale={locale} />
            <div className="mt-16" />
          </>
        )}

        {hero ? (
          <header className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
            <h2 className="h2">{supplements ? dict.collection.allProductsIn : dict.collection.allIn}</h2>
            <div>
              <p className="mb-2 text-sm font-medium text-ink">
                {dict.collection.searchHint}
              </p>
              <InlineSearch locale={locale} dict={dict} />
            </div>
          </header>
        ) : (
          /* Header: title, one-sentence intro, value search; trust as a single quiet line */
          <header className="mb-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="h1 text-balance">{title}</h1>
              {intro && (
                <p className="mt-2 text-[1.0625rem] leading-relaxed text-ink-muted">
                  {intro}
                </p>
              )}
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
                {trust.map(({ icon: Icon, text }) => (
                  <li key={text} className="inline-flex items-center gap-1.5">
                    <Icon
                      width={15}
                      height={15}
                      className="shrink-0 text-green"
                    />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-ink">
                {dict.collection.searchHint}
              </p>
              <InlineSearch locale={locale} dict={dict} />
            </div>
          </header>
        )}

        <Suspense>
          <FilterBar
            dict={dict}
            facets={facets}
            filters={filters}
            sort={sort}
            resultCount={filtered.length}
          />
        </Suspense>

        {filtered.length ? (
          <ProductGrid
            products={filtered}
            locale={locale}
            dict={dict}
            priorityCount={4}
            bestsellerIds={bestsellers}
            insert={{
              index: Math.min(2, filtered.length),
              node: (
                <AssistantCard
                  title={dict.collection.miraTitle}
                  cta={dict.collection.miraCta}
                  online={dict.assistant.online}
                  demo={miraDemo(handle, locale)}
                />
              ),
            }}
          />
        ) : (
          <div className="rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
            <p className="h4">{dict.collection.emptyFiltered}</p>
            <p className="mt-2 text-ink-muted">
              {dict.collection.emptyFilteredText}
            </p>
            <Link
              href={
                handle ? href(`/collections/${handle}`) : href("/collections")
              }
              className="btn btn-primary mt-5"
            >
              {dict.collection.reset}
            </Link>
          </div>
        )}

        {/* Values × tests matrix: answers "which one measures what?" */}
        {handle && !sti && filtered.length >= 2 && (
          <CompareTable products={filtered} locale={locale} dict={dict} />
        )}
        {sti && (
          <>
            <StiDiscreet locale={locale} />
            <StiFaq locale={locale} />
          </>
        )}

        {/* Unsure? Supplements: measure first, then supplement */}
        {supplements ? (
          <section className="mt-16 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-10">
            <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <h2 className="h3">
                  <Highlight text={dict.collection.supplementsTitle} />
                </h2>
                <p className="mt-2 max-w-xl text-moss/80">{dict.collection.supplementsText}</p>
              </div>
              <Link href={href("/collections/nahrstoffe-vitamine")} className="btn btn-primary">
                {dict.collection.supplementsCta} <ArrowRight width={16} height={16} />
              </Link>
            </div>
          </section>
        ) : (
        <section className="mt-16 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-10">
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 className="h3">
                <Highlight text={dict.collection.unsureTitle} />
              </h2>
              <p className="mt-2 max-w-xl text-moss/80">
                {dict.collection.unsureText}
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                {dict.collection.unsureSteps.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <CheckIcon
                      width={16}
                      height={16}
                      className="mt-0.5 shrink-0"
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              {guideHandle && (
                <Link
                  href={href(guideHref(guideHandle))}
                  className="btn btn-primary"
                >
                  {guideTitle
                    ? truncate(guideTitle, 28)
                    : dict.collection.readGuide}{" "}
                  <ArrowRight width={16} height={16} />
                </Link>
              )}
              <Link href={href("/pages/kontakt")} className="btn btn-tertiary">
                {dict.collection.askUs}
              </Link>
            </div>
          </div>
        </section>
        )}

        {/* Explanation (SEO text from Shopify) + FAQ, after the products */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {descriptionHtml && stripHtml(descriptionHtml).length > 0 && (
            <section>
              <h2 className="h3 mb-4">{dict.collection.aboutTitle}</h2>
              <RichText
                html={descriptionHtml}
                locale={locale}
                className="!text-[1rem]"
              />
            </section>
          )}
          <section>
            <h2 className="h3 mb-4">
              <Highlight text={dict.product.faqTitle} />
            </h2>
            <Accordion
              items={(supplements ? dict.collection.supplementsFaq : dict.collection.faq).map((f) => ({
                title: f.q,
                content: <p>{f.a}</p>,
              }))}
            />
          </section>
        </div>

        {otherCollections.length > 0 && (
          <section className="mt-16">
            <h2 className="h4 mb-4">{dict.collection.browse}</h2>
            <ul className="flex flex-wrap gap-2">
              {otherCollections.map((c) => (
                <li key={c.handle}>
                  <Link
                    href={href(`/collections/${c.handle}`)}
                    className="chip hover:bg-lind-deep"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {hero && (
        <StickyMiraCta label={dict.collection.miraSticky} watch="hero-cta" />
      )}
    </>
  );
}
