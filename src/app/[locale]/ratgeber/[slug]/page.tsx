import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/content/RichText";
import { GUIDE_BASE, PAGE_TOPICS, isGuidePage, pageTopic } from "@/lib/content/guides";
import { prepareGuide } from "@/lib/content/guide-render";
import { GuideArticle } from "@/components/guide/GuideArticle";
import { ArticleBody } from "@/components/guide/ArticleBody";
import { extractArticle } from "@/lib/content/article-render";
import { BLOG_TOPICS } from "@/lib/content/guides";
import { getMigratedPage, listMigratedPages } from "@/lib/content/pages";
import { stripHtml, truncate } from "@/lib/format";
import { absoluteUrl, localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { articleJsonLd, breadcrumbJsonLd, JsonLd, pageMetadata } from "@/lib/seo";
import { getAllArticles, getAllPageHandles, getAllProducts, getArticle, getBlog, getPage } from "@/lib/shopify/queries";
import type { Article } from "@/lib/shopify/types";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const [articles, pages] = await Promise.all([getAllArticles("de").catch(() => []), listMigratedPages("de")]);
  return [...articles.map((a) => ({ slug: a.handle })), ...pages.filter((p) => isGuidePage(p.handle)).map((p) => ({ slug: p.handle }))];
}

type Resolved =
  | { kind: "article"; article: Article }
  | { kind: "page"; title: string; seoTitle: string | null; seoDescription: string | null; html: string; updatedAt: string | null };

async function resolveSlug(slug: string, locale: Locale): Promise<Resolved | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  // 1) blog article (handles are unique across blogs)
  const articles = await getAllArticles(locale).catch(() => []);
  const hit = articles.find((a) => a.handle === slug);
  if (hit) {
    const article = await getArticle(hit.blog.handle, slug, locale);
    if (article) return { kind: "article", article };
  }
  // 2) guide page (Shopify body or migrated HTML)
  if (!isGuidePage(slug)) return null;
  const api = await getPage(slug, locale).catch(() => null);
  if (api && api.body.trim()) {
    return { kind: "page", title: api.title, seoTitle: api.seo.title, seoDescription: api.seo.description || truncate(stripHtml(api.body), 160), html: api.body, updatedAt: api.updatedAt };
  }
  const migrated = await getMigratedPage(slug, locale);
  if (migrated && migrated.html.trim()) {
    return {
      kind: "page",
      title: api?.title ?? migrated.title,
      seoTitle: migrated.seoTitle.replace(/\s*-\s*DoctorBox Heimtests$/, ""),
      seoDescription: migrated.seoDescription || truncate(stripHtml(migrated.html), 160),
      html: migrated.html,
      updatedAt: migrated.updatedAt ?? null,
    };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const r = await resolveSlug(p.slug, locale);
  if (!r) return {};
  if (r.kind === "article") {
    const a = r.article;
    return pageMetadata(locale, `${GUIDE_BASE}/${a.handle}`, {
      title: a.seo.title || a.title,
      description: a.seo.description || truncate(stripHtml(a.excerpt || a.contentHtml), 160),
      image: a.image?.url,
      type: "article",
    });
  }
  return pageMetadata(locale, `${GUIDE_BASE}/${p.slug}`, { title: r.seoTitle || r.title, description: r.seoDescription, type: "article" });
}

export default async function GuidePage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const r = await resolveSlug(p.slug, locale);
  if (!r) notFound();
  const base = localeHref(locale, GUIDE_BASE);

  if (r.kind === "article") {
    const article = r.article;
    const extracted = extractArticle(article.contentHtml);
    const [blog, allProducts] = await Promise.all([getBlog(article.blog.handle, locale), getAllProducts(locale).catch(() => [])]);
    // products linked from the article text → recommended tests
    const linked = Array.from(article.contentHtml.matchAll(/\/products\/([a-z0-9%\-]+)/gi)).map((m) => decodeURIComponent(m[1]));
    const products = Array.from(new Set(linked))
      .map((h) => allProducts.find((pr) => pr.handle === h))
      .filter((x): x is NonNullable<typeof x> => Boolean(x))
      .slice(0, 2);
    const related = (blog?.articles ?? []).filter((a) => a.handle !== article.handle).slice(0, 6).map((a) => ({ handle: a.handle, title: a.title }));
    const topicLabel = BLOG_TOPICS[article.blog.handle]?.[locale] ?? article.blog.title;
    const topicHref = `${base}?thema=${article.blog.handle}`;
    const lead = extracted.lead ?? (article.excerpt ? stripHtml(article.excerpt) : null);
    return (
      <>
        <JsonLd
          data={[
            articleJsonLd(article, locale),
            breadcrumbJsonLd([
              { name: dict.common.home, url: absoluteUrl(locale, "/") },
              { name: dict.guide.title, url: absoluteUrl(locale, GUIDE_BASE) },
              { name: article.title, url: absoluteUrl(locale, `${GUIDE_BASE}/${article.handle}`) },
            ]),
          ]}
        />
        <GuideArticle
          locale={locale}
          dict={dict}
          topicLabel={topicLabel}
          topicHref={topicHref}
          title={article.title}
          lead={lead}
          readingMinutes={extracted.readingMinutes}
          publishedAt={article.publishedAt}
          author={article.author}
          heroImage={article.image ? { url: article.image.url, alt: article.image.altText } : null}
          toc={extracted.toc}
          body={<ArticleBody blocks={extracted.blocks} />}
          products={products}
          related={related}
          relatedTitle={dict.blog.more}
        />
      </>
    );
  }

  // Guide page: reading layout with TOC and recommended tests
  const guide = prepareGuide(r.html);
  const title = guide.title ?? r.title;
  const topicKey = pageTopic(p.slug);
  const topicLabel = PAGE_TOPICS[topicKey]?.[locale] ?? dict.guide.title;
  const [allProducts, migratedPages, apiPages] = await Promise.all([
    guide.productHandles.length ? getAllProducts(locale).catch(() => []) : Promise.resolve([]),
    listMigratedPages(locale),
    getAllPageHandles(locale).catch(() => []),
  ]);
  const products = guide.productHandles.map((h) => allProducts.find((pr) => pr.handle === h)).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const titles = new Map<string, string>();
  for (const pg of migratedPages) titles.set(pg.handle, pg.title);
  for (const pg of apiPages) titles.set(pg.handle, pg.title);
  const related = Array.from(titles.entries())
    .filter(([h]) => h !== p.slug && isGuidePage(h) && pageTopic(h) === topicKey)
    .slice(0, 6)
    .map(([handle, t]) => ({ handle, title: t.replace(/\s*\|\s*DoctorBox.*$/i, "").replace(/\s*-\s*DoctorBox Heimtests$/, "") }));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: dict.common.home, url: absoluteUrl(locale, "/") },
            { name: dict.guide.title, url: absoluteUrl(locale, GUIDE_BASE) },
            { name: title, url: absoluteUrl(locale, `${GUIDE_BASE}/${p.slug}`) },
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
        body={<RichText html={guide.bodyHtml} locale={locale} className="prose-guide !max-w-none" />}
        products={products}
        related={related}
      />
    </>
  );
}
