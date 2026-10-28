import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ArticleBody } from "@/components/guide/ArticleBody";
import { GuideArticle } from "@/components/guide/GuideArticle";
import { extractArticle } from "@/lib/content/article-render";
import { articleHref, blogHref, BLOG_TOPICS } from "@/lib/content/guides";
import { stripHtml, truncate } from "@/lib/format";
import { absoluteUrl, localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  JsonLd,
  pageMetadata,
} from "@/lib/seo";
import {
  getAllArticles,
  getAllProducts,
  getArticle,
  getBlog,
} from "@/lib/shopify/queries";
import type { Article } from "@/lib/shopify/types";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string; blog: string; slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getAllArticles("de").catch(() => []);
  return articles.map((a) => ({ blog: a.blog.handle, slug: a.handle }));
}

async function resolveArticle(
  slug: string,
  locale: Locale,
): Promise<Article | null> {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const articles = await getAllArticles(locale).catch(() => []);
  const hit = articles.find((a) => a.handle === slug);
  if (!hit) return null;
  return getArticle(hit.blog.handle, slug, locale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const a = await resolveArticle(p.slug, locale);
  if (!a) return {};
  return pageMetadata(locale, articleHref(a.blog.handle, a.handle), {
    title: a.seo.title || a.title,
    description:
      a.seo.description || truncate(stripHtml(a.excerpt || a.contentHtml), 160),
    image: a.image?.url,
    type: "article",
  });
}

/**
 * Blog article at its old Shopify URL (/blogs/<blog>/<slug>): the Shopify HTML
 * is extracted into the shop's reading layout.
 */
export default async function BlogArticlePage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const article = await resolveArticle(p.slug, locale);
  if (!article) notFound();
  // an article moved to another blog keeps one canonical URL
  if (article.blog.handle !== p.blog)
    permanentRedirect(
      localeHref(locale, articleHref(article.blog.handle, article.handle)),
    );

  const extracted = extractArticle(article.contentHtml);
  const [blog, allProducts] = await Promise.all([
    getBlog(article.blog.handle, locale),
    getAllProducts(locale).catch(() => []),
  ]);
  // products linked from the article text → recommended tests
  const linked = Array.from(
    article.contentHtml.matchAll(/\/products\/([a-z0-9%\-]+)/gi),
  ).map((m) => decodeURIComponent(m[1]));
  const products = Array.from(new Set([...extracted.productHandles, ...linked]))
    .map((h) => allProducts.find((pr) => pr.handle === h))
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .slice(0, 2);
  const related = (blog?.articles ?? [])
    .filter((a) => a.handle !== article.handle)
    .slice(0, 6)
    .map((a) => ({ href: articleHref(a.blog.handle, a.handle), title: a.title }));
  const topicLabel =
    BLOG_TOPICS[article.blog.handle]?.[locale] ?? article.blog.title;
  const lead =
    extracted.lead ?? (article.excerpt ? stripHtml(article.excerpt) : null);

  return (
    <>
      <JsonLd
        data={[
          articleJsonLd(article, locale),
          breadcrumbJsonLd([
            { name: dict.common.home, url: absoluteUrl(locale, "/") },
            { name: topicLabel, url: absoluteUrl(locale, blogHref(article.blog.handle)) },
            {
              name: article.title,
              url: absoluteUrl(locale, articleHref(article.blog.handle, article.handle)),
            },
          ]),
        ]}
      />
      <GuideArticle
        locale={locale}
        dict={dict}
        topicLabel={topicLabel}
        topicHref={localeHref(locale, blogHref(article.blog.handle))}
        title={article.title}
        lead={lead}
        readingMinutes={extracted.readingMinutes}
        publishedAt={article.publishedAt}
        author={article.author}
        heroImage={
          article.image
            ? { url: article.image.url, alt: article.image.altText }
            : null
        }
        toc={extracted.toc}
        body={<ArticleBody blocks={extracted.blocks} />}
        products={products}
        related={related}
        relatedTitle={dict.blog.more}
        kind="blog"
      />
    </>
  );
}
