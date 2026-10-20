import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CollectionView } from "@/components/collection/CollectionView";
import { COLLECTION_GUIDES, type SearchParamsLike } from "@/lib/catalog/filters";
import { getMigratedPage } from "@/lib/content/pages";
import { stripHtml, truncate } from "@/lib/format";
import { absoluteUrl, localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { getCollection, getCollections, getNavCollections, getPage, type ProductSort } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string; handle: string }>; searchParams: Promise<SearchParamsLike> };

export async function generateStaticParams() {
  try {
    return (await getCollections("de")).map((c) => ({ handle: c.handle }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const c = await getCollection(p.handle, locale);
  if (!c) return {};
  return pageMetadata(locale, `/collections/${c.handle}`, {
    title: c.seo.title || c.title,
    description: c.seo.description || (c.description ? truncate(stripHtml(c.description), 160) : null),
    image: c.image?.url,
  });
}

/** First sentence of the description as a short intro; the full text moves below the grid. */
function firstSentence(text: string): string | null {
  const clean = stripHtml(text).replace(/[✔👉]/g, "").trim();
  if (!clean) return null;
  const m = clean.match(/^.*?[.!?](\s|$)/);
  const s = (m ? m[0] : clean).trim();
  return truncate(s, 180);
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const sp = await searchParams;
  const sort = ((Array.isArray(sp.sort) ? sp.sort[0] : sp.sort) as ProductSort) || "relevance";
  const guideHandle = COLLECTION_GUIDES[p.handle];
  const [collection, nav, guide] = await Promise.all([
    getCollection(p.handle, locale, sort),
    getNavCollections(locale),
    guideHandle
      ? getPage(guideHandle, locale)
          .then((pg) => pg?.title ?? null)
          .catch(() => null)
          .then(async (t) => t ?? (await getMigratedPage(guideHandle, locale))?.title ?? null)
      : Promise.resolve(null),
  ]);
  if (!collection) notFound();

  const crumbs = [
    { label: dict.common.home, href: localeHref(locale, "/") },
    { label: dict.collection.all, href: localeHref(locale, "/collections") },
    { label: collection.title },
  ];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, url: absoluteUrl(locale, "/") },
          { name: dict.collection.all, url: absoluteUrl(locale, "/collections") },
          { name: collection.title, url: absoluteUrl(locale, `/collections/${collection.handle}`) },
        ])}
      />
      <CollectionView
        locale={locale}
        dict={dict}
        title={collection.title}
        intro={collection.seo.description || firstSentence(collection.descriptionHtml)}
        descriptionHtml={collection.descriptionHtml}
        handle={collection.handle}
        products={collection.products}
        sort={sort}
        searchParams={sp}
        crumbs={crumbs}
        otherCollections={nav.filter((c) => c.handle !== collection.handle)}
        guideTitle={guide ? guide.replace(/\s*\|\s*DoctorBox.*$/i, "").replace(/\s*-\s*DoctorBox Heimtests$/, "") : null}
      />
    </>
  );
}
