import type { Metadata } from "next";
import { CollectionView } from "@/components/collection/CollectionView";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts, getNavCollections, type ProductSort } from "@/lib/shopify/queries";
import type { SearchParamsLike } from "@/lib/catalog/filters";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<SearchParamsLike> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, "/collections", { title: dict.collection.all, description: dict.collection.allText });
}

export default async function AllProductsPage({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const sp = await searchParams;
  const sort = ((Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as ProductSort) || "relevance";
  const [products, collections] = await Promise.all([getAllProducts(locale, { sort }), getNavCollections(locale)]);

  return (
    <CollectionView
      locale={locale}
      dict={dict}
      title={dict.collection.all}
      intro={dict.collection.allText}
      handle={null}
      products={products}
      sort={sort}
      searchParams={sp}
      crumbs={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: dict.collection.all }]}
      otherCollections={collections}
    />
  );
}
