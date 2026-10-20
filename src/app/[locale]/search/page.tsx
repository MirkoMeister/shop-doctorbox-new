import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product/ProductCard";
import { SearchIcon } from "@/components/ui/Icons";
import { localeHref } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getNavCollections, searchProducts } from "@/lib/shopify/queries";

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  const { q } = await searchParams;
  return pageMetadata(locale, "/search", { title: q ? fill(dict.search.resultsFor, { q }) : dict.search.title, noIndex: true });
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const { q = "" } = await searchParams;
  const query = q.trim();
  const [products, collections] = await Promise.all([
    query ? searchProducts(query, locale).catch(() => []) : Promise.resolve([]),
    getNavCollections(locale),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <form action={localeHref(locale, "/search")} role="search" className="max-w-2xl">
        <label htmlFor="q" className="h1 block text-balance">
          {query ? fill(dict.search.resultsFor, { q: query }) : dict.search.label}
        </label>
        <div className="mt-6 flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-card ring-1 ring-line focus-within:ring-2 focus-within:ring-turquoise">
          <SearchIcon width={22} height={22} className="shrink-0 text-green" />
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={query}
            placeholder={dict.hero.placeholder}
            autoComplete="off"
            className="h-12 min-w-0 flex-1 bg-transparent text-lg focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="submit" className="btn btn-primary">
            {dict.search.submit}
          </button>
        </div>
      </form>

      <div className="mt-10">
        {query && products.length === 0 && (
          <div className="max-w-xl">
            <p className="h4">{dict.search.noResults}</p>
            <p className="mt-2 text-ink-muted">{dict.search.tryAgain}</p>
          </div>
        )}
        {products.length > 0 && (
          <>
            <p className="mb-6 text-sm text-ink-muted">
              {products.length === 1 ? dict.collection.countOne : fill(dict.collection.count, { n: products.length })}
            </p>
            <ProductGrid products={products} locale={locale} dict={dict} priorityCount={4} />
          </>
        )}
      </div>

      <section className="mt-16">
        <h2 className="h4 mb-4">{dict.collection.browse}</h2>
        <ul className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <li key={c.handle}>
              <Link href={localeHref(locale, `/collections/${c.handle}`)} className="chip hover:bg-lind-deep">
                {c.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
