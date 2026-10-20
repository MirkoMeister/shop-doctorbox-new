import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/home/Sections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { BLOG_BASE, BLOG_TOPICS } from "@/lib/content/guides";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ thema?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, BLOG_BASE, {
    title: dict.blog.title,
    description: dict.blog.text,
  });
}

/** Health blog: the Shopify blog articles, filterable by blog (topic). */
export default async function BlogIndex({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const { thema } = await searchParams;
  const articles = await getAllArticles(locale).catch(() => []);
  const topics = Object.entries(BLOG_TOPICS).filter(([h]) =>
    articles.some((a) => a.blog.handle === h),
  );
  const active = thema && BLOG_TOPICS[thema] ? thema : null;
  const shown = active
    ? articles.filter((a) => a.blog.handle === active)
    : articles;
  const base = localeHref(locale, BLOG_BASE);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: localeHref(locale, "/") },
          { label: dict.blog.title },
        ]}
        className="mb-5"
      />
      <header className="max-w-2xl">
        <h1 className="h1 text-balance">
          <Highlight text={dict.blog.headline} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{dict.blog.text}</p>
      </header>

      <nav aria-label={dict.guide.topics} className="mt-8">
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <li>
            <Link
              href={base}
              scroll={false}
              className={`chip whitespace-nowrap ${active ? "chip-outline hover:bg-lind" : "!bg-moss !text-soft"}`}
            >
              {dict.common.all}
            </Link>
          </li>
          {topics.map(([h, t]) => (
            <li key={h}>
              <Link
                href={`${base}?thema=${h}`}
                scroll={false}
                className={`chip whitespace-nowrap ${active === h ? "!bg-moss !text-soft" : "chip-outline hover:bg-lind"}`}
              >
                {t[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {shown.length > 0 ? (
        <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <li key={a.handle}>
              <ArticleCard article={a} locale={locale} dict={dict} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-ink-muted">{dict.collection.empty}</p>
      )}
    </div>
  );
}
