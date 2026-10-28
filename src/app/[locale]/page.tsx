import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import {
  BlogTeasers,
  CategoryField,
  HowItWorks,
  SectionHeading,
  TrustBand,
} from "@/components/home/Sections";
import { StiSpotlight } from "@/components/home/StiSpotlight";
import { TassoBanner } from "@/components/home/TassoBanner";
import { ProductGrid } from "@/components/product/ProductCard";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import {
  getAllProducts,
  getCollection,
  getLatestArticles,
  getNavCollections,
  TOP_PICKS_COLLECTION,
} from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return {
    ...pageMetadata(locale, "/", { title: dict.meta.defaultTitle }),
    title: { absolute: dict.meta.defaultTitle },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const [collections, topPicks, allProducts, articles] = await Promise.all([
    getNavCollections(locale),
    getCollection(TOP_PICKS_COLLECTION, locale),
    getAllProducts(locale),
    getLatestArticles(locale, 3),
  ]);

  // Aggregate rating across the catalogue (from the reviews metafields)
  const rated = allProducts.filter((p) => p.rating && p.ratingCount > 0);
  const count = rated.reduce((s, p) => s + p.ratingCount, 0);
  const rating =
    count > 0
      ? {
          value:
            rated.reduce((s, p) => s + (p.rating ?? 0) * p.ratingCount, 0) /
            count,
          count,
        }
      : null;

  const picks = (
    topPicks?.products.length
      ? topPicks.products
      : allProducts.filter((p) => p.ratingCount > 0)
  ).slice(0, 8);
  const tassoProducts = ["rundum-check-fur-frauen", "rundum-check-fur-manner"]
    .map((h) => allProducts.find((p) => p.handle === h))
    .filter((p): p is (typeof allProducts)[number] => Boolean(p));

  return (
    <>
      <Hero locale={locale} dict={dict} rating={rating} />
      <CategoryField collections={collections} locale={locale} dict={dict} />
      <StiSpotlight products={allProducts} locale={locale} dict={dict} />

      {tassoProducts.length > 0 && (
        <TassoBanner locale={locale} dict={dict} products={tassoProducts} />
      )}

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title={dict.home.topPicksTitle}
          text={dict.home.topPicksText}
          action={{
            label: dict.home.allTests,
            href: localeHref(locale, "/collections"),
          }}
        />
        <ProductGrid
          products={picks}
          locale={locale}
          dict={dict}
          priorityCount={4}
        />
      </section>

      <HowItWorks dict={dict} />
      <TrustBand dict={dict} />
      <BlogTeasers articles={articles} locale={locale} dict={dict} />
    </>
  );
}
