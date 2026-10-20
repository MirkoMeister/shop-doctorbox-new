import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { RichText } from "@/components/content/RichText";
import {
  BLOG_BASE,
  GUIDE_BASE,
  PAGE_TOPICS,
  isGuidePage,
  pageTopic,
} from "@/lib/content/guides";
import { prepareGuide } from "@/lib/content/guide-render";
import { GuideArticle } from "@/components/guide/GuideArticle";
import { getMigratedPage, listMigratedPages } from "@/lib/content/pages";
import { stripHtml, truncate } from "@/lib/format";
import { absoluteUrl, localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import {
  getAllArticles,
  getAllPageHandles,
  getAllProducts,
  getPage,
} from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const pages = await listMigratedPages("de");
  return pages
    .filter((p) => isGuidePage(p.handle))
    .map((p) => ({ slug: p.handle }));
}

type Resolved = {
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  html: string;
  updatedAt: string | null;
};

async function resolveSlug(
  slug: string,
  locale: Locale,
): Promise<Resolved | null> {
  if (!/^[a-z0-9-]+$/i.test(slug) || !isGuidePage(slug)) return null;
  const api = await getPage(slug, locale).catch(() => null);
  if (api && api.body.trim()) {
    return {
      title: api.title,
      seoTitle: api.seo.title,
      seoDescription: api.seo.description || truncate(stripHtml(api.body), 160),
      html: api.body,
      updatedAt: api.updatedAt,
    };
  }
  const migrated = await getMigratedPage(slug, locale);
  if (migrated && migrated.html.trim()) {
    return {
      title: api?.title ?? migrated.title,
      seoTitle: migrated.seoTitle.replace(/\s*-\s*DoctorBox Heimtests$/, ""),
      seoDescription:
        migrated.seoDescription || truncate(stripHtml(migrated.html), 160),
      html: migrated.html,
      updatedAt: migrated.updatedAt ?? null,
    };
  }
  return null;
}

/** Blog article handles that still arrive under /ratgeber go to /blog */
async function isArticle(slug: string, locale: Locale): Promise<boolean> {
  const articles = await getAllArticles(locale).catch(() => []);
  return articles.some((a) => a.handle === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const r = await resolveSlug(p.slug, locale);
  if (!r) return {};
  return pageMetadata(locale, `${GUIDE_BASE}/${p.slug}`, {
    title: r.seoTitle || r.title,
    description: r.seoDescription,
    type: "article",
  });
}

export default async function GuidePage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const r = await resolveSlug(p.slug, locale);
  if (!r) {
    if (await isArticle(p.slug, locale))
      permanentRedirect(localeHref(locale, `${BLOG_BASE}/${p.slug}`));
    notFound();
  }
  const base = localeHref(locale, GUIDE_BASE);

  // Guide page: reading layout with TOC and recommended tests
  const guide = prepareGuide(r.html);
  const title = guide.title ?? r.title;
  const topicKey = pageTopic(p.slug);
  const topicLabel = PAGE_TOPICS[topicKey]?.[locale] ?? dict.guide.title;
  const [allProducts, migratedPages, apiPages] = await Promise.all([
    guide.productHandles.length
      ? getAllProducts(locale).catch(() => [])
      : Promise.resolve([]),
    listMigratedPages(locale),
    getAllPageHandles(locale).catch(() => []),
  ]);
  const products = guide.productHandles
    .map((h) => allProducts.find((pr) => pr.handle === h))
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
  const titles = new Map<string, string>();
  for (const pg of migratedPages) titles.set(pg.handle, pg.title);
  for (const pg of apiPages) titles.set(pg.handle, pg.title);
  const related = Array.from(titles.entries())
    .filter(
      ([h]) => h !== p.slug && isGuidePage(h) && pageTopic(h) === topicKey,
    )
    .slice(0, 6)
    .map(([handle, t]) => ({
      handle,
      title: t
        .replace(/\s*\|\s*DoctorBox.*$/i, "")
        .replace(/\s*-\s*DoctorBox Heimtests$/, ""),
    }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: dict.common.home, url: absoluteUrl(locale, "/") },
            { name: dict.guide.title, url: absoluteUrl(locale, GUIDE_BASE) },
            {
              name: title,
              url: absoluteUrl(locale, `${GUIDE_BASE}/${p.slug}`),
            },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: r.seoDescription ?? undefined,
            dateModified: r.updatedAt ?? undefined,
            mainEntityOfPage: absoluteUrl(locale, `${GUIDE_BASE}/${p.slug}`),
            publisher: { "@type": "Organization", name: "DoctorBox" },
          },
        ]}
      />
      <GuideArticle
        locale={locale}
        dict={dict}
        topicLabel={topicLabel}
        topicHref={`${base}?thema=${topicKey}`}
        title={title}
        lead={guide.lead}
        readingMinutes={guide.readingMinutes}
        updatedAt={r.updatedAt}
        toc={guide.toc}
        body={
          <RichText
            html={guide.bodyHtml}
            locale={locale}
            className="prose-guide !max-w-none"
          />
        }
        products={products}
        related={related}
      />
    </>
  );
}
