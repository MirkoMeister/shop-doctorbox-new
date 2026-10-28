import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/content/RichText";
import { GuideArticle } from "@/components/guide/GuideArticle";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { prepareGuide } from "@/lib/content/guide-render";
import {
  GUIDE_BASE,
  PAGE_TOPICS,
  guideHref,
  isGuidePage,
  pageTopic,
} from "@/lib/content/guides";
import { getMigratedPage, listMigratedPages } from "@/lib/content/pages";
import { stripHtml, truncate } from "@/lib/format";
import { absoluteUrl, localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import {
  getAllPageHandles,
  getAllProducts,
  getPage,
} from "@/lib/shopify/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; handle: string }> };

export async function generateStaticParams() {
  const migrated = await listMigratedPages("de");
  return migrated.map((p) => ({ handle: p.handle }));
}

type Resolved = {
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  html: string;
  updatedAt: string | null;
};

/** Shopify page (translated, live) with the migrated export as fallback */
async function loadPage(handle: string, locale: Locale): Promise<Resolved | null> {
  if (!/^[a-z0-9-]+$/i.test(handle)) return null;
  const api = await getPage(handle, locale).catch(() => null);
  if (api && api.body.trim()) {
    return {
      title: api.title,
      seoTitle: api.seo.title,
      seoDescription: api.seo.description || truncate(stripHtml(api.body), 160),
      html: api.body,
      updatedAt: api.updatedAt,
    };
  }
  const migrated = await getMigratedPage(handle, locale);
  if (migrated && migrated.html.trim()) {
    return {
      title: api?.title ?? migrated.title,
      seoTitle: migrated.seoTitle.replace(/\s*-\s*DoctorBox Heimtests$/, ""),
      seoDescription: migrated.seoDescription || truncate(stripHtml(migrated.html), 160),
      html: migrated.html,
      updatedAt: migrated.updatedAt ?? null,
    };
  }
  if (api) return { title: api.title, seoTitle: api.seo.title, seoDescription: api.seo.description, html: "", updatedAt: api.updatedAt };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const page = await loadPage(p.handle, locale);
  if (!page) return {};
  return pageMetadata(locale, guideHref(p.handle), {
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    ...(isGuidePage(p.handle) ? { type: "article" as const } : {}),
  });
}

/**
 * /pages/<handle>: the old Shopify page URLs. Guide pages (SEO content) get the
 * reading layout with TOC and recommended tests, utility pages the plain layout.
 */
export default async function ContentPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const page = await loadPage(p.handle, locale);
  if (!page) notFound();

  if (isGuidePage(p.handle)) return <GuidePage handle={p.handle} page={page} locale={locale} dict={dict} />;

  const hasOwnH1 = /<h1[\s>]/i.test(page.html);
  return (
    <article className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: page.title }]} className="mb-6" />
      <div className="mx-auto max-w-3xl">
        {!hasOwnH1 && <h1 className="h1 mb-8 text-balance">{page.title}</h1>}
        {page.html ? <RichText html={page.html} locale={locale} className="[&_h1]:h1 [&_h1]:mb-6 [&_h1]:!mt-0" /> : null}
      </div>
    </article>
  );
}

async function GuidePage({
  handle,
  page,
  locale,
  dict,
}: {
  handle: string;
  page: Resolved;
  locale: Locale;
  dict: Awaited<ReturnType<typeof resolveLocale>>["dict"];
}) {
  const guide = prepareGuide(page.html);
  const title = guide.title ?? page.title;
  const topicKey = pageTopic(handle);
  const topicLabel = PAGE_TOPICS[topicKey]?.[locale] ?? dict.guide.title;
  const [allProducts, migratedPages, apiPages] = await Promise.all([
    guide.productHandles.length ? getAllProducts(locale).catch(() => []) : Promise.resolve([]),
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
    .filter(([h]) => h !== handle && isGuidePage(h) && pageTopic(h) === topicKey)
    .slice(0, 6)
    .map(([h, t]) => ({
      href: guideHref(h),
      title: t.replace(/\s*\|\s*DoctorBox.*$/i, "").replace(/\s*-\s*DoctorBox Heimtests$/, ""),
    }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: dict.common.home, url: absoluteUrl(locale, "/") },
            { name: dict.guide.title, url: absoluteUrl(locale, GUIDE_BASE) },
            { name: title, url: absoluteUrl(locale, guideHref(handle)) },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: page.seoDescription ?? undefined,
            dateModified: page.updatedAt ?? undefined,
            mainEntityOfPage: absoluteUrl(locale, guideHref(handle)),
            publisher: { "@type": "Organization", name: "DoctorBox" },
          },
        ]}
      />
      <GuideArticle
        locale={locale}
        dict={dict}
        topicLabel={topicLabel}
        topicHref={`${localeHref(locale, GUIDE_BASE)}?thema=${topicKey}`}
        title={title}
        lead={guide.lead}
        readingMinutes={guide.readingMinutes}
        updatedAt={page.updatedAt}
        toc={guide.toc}
        body={<RichText html={guide.bodyHtml} locale={locale} className="prose-guide !max-w-none" />}
        products={products}
        related={related}
        kind="guide"
      />
    </>
  );
}
