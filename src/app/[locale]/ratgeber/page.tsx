import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/home/Sections";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { listMigratedPages } from "@/lib/content/pages";
import { BLOG_TOPICS, GUIDE_BASE, PAGE_TOPICS, isGuidePage, pageTopic } from "@/lib/content/guides";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllArticles, getAllPageHandles } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ thema?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, GUIDE_BASE, { title: dict.guide.title, description: dict.guide.text });
}

const cleanTitle = (t: string) => t.replace(/\s*\|\s*DoctorBox.*$/i, "").replace(/\s*-\s*DoctorBox Heimtests$/, "").trim();

export default async function GuideIndex({ params, searchParams }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const { thema } = await searchParams;
  const [articles, apiPages, migrated] = await Promise.all([
    getAllArticles(locale).catch(() => []),
    getAllPageHandles(locale).catch(() => []),
    listMigratedPages(locale),
  ]);

  // Guide pages: title from the API (translated) else from the migrated file
  const titles = new Map<string, string>();
  for (const p of migrated) titles.set(p.handle, p.title);
  for (const p of apiPages) titles.set(p.handle, p.title);
  const pages = Array.from(titles.entries())
    .filter(([h]) => isGuidePage(h))
    .map(([handle, title]) => ({ handle, title: cleanTitle(title), topic: pageTopic(handle) }));

  const blogTopics = Object.entries(BLOG_TOPICS).filter(([h]) => articles.some((a) => a.blog.handle === h));
  const pageTopics = Object.entries(PAGE_TOPICS).filter(([k]) => pages.some((p) => p.topic === k));
  const active = thema ?? null;
  const base = localeHref(locale, GUIDE_BASE);

  const shownArticles = active && BLOG_TOPICS[active] ? articles.filter((a) => a.blog.handle === active) : active ? [] : articles;
  const shownPages = active && PAGE_TOPICS[active] ? pages.filter((p) => p.topic === active) : active ? [] : pages;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: dict.guide.title }]} className="mb-5" />
      <header className="max-w-2xl">
        <h1 className="h1 text-balance">
          <Highlight text={dict.guide.headline} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{dict.guide.text}</p>
      </header>

      <nav aria-label={dict.guide.topics} className="mt-8">
        <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          <li>
            <Link href={base} scroll={false} className={`chip whitespace-nowrap ${active ? "chip-outline hover:bg-lind" : "!bg-moss !text-soft"}`}>
              {dict.common.all}
            </Link>
          </li>
          {blogTopics.map(([h, t]) => (
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
          {pageTopics.map(([k, t]) => (
            <li key={k}>
              <Link
                href={`${base}?thema=${k}`}
                scroll={false}
                className={`chip whitespace-nowrap ${active === k ? "!bg-moss !text-soft" : "chip-outline hover:bg-lind"}`}
              >
                {t[locale]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {shownArticles.length > 0 && (
        <section className="mt-10">
          {!active && <h2 className="h3 mb-6">{dict.guide.articles}</h2>}
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {shownArticles.map((a) => (
              <li key={a.handle}>
                <ArticleCard article={a} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {shownPages.length > 0 && (
        <section className="mt-16">
          {!active && <h2 className="h3 mb-2">{dict.guide.pages}</h2>}
          {!active && <p className="mb-6 text-ink-muted">{dict.guide.pagesText}</p>}
          {(active ? [active] : Object.keys(PAGE_TOPICS)).map((k) => {
            const group = shownPages.filter((p) => p.topic === k);
            if (!group.length) return null;
            return (
              <div key={k} className="mb-10">
                <h3 className="h4 mb-3">{PAGE_TOPICS[k][locale]}</h3>
                <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((g) => (
                    <li key={g.handle}>
                      <Link
                        href={localeHref(locale, `${GUIDE_BASE}/${g.handle}`)}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-white px-4 py-3.5 shadow-card transition-shadow hover:shadow-float"
                      >
                        <span className="font-medium leading-snug">{g.title}</span>
                        <ArrowRight width={18} height={18} className="shrink-0 text-green" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      )}

      {shownArticles.length === 0 && shownPages.length === 0 && <p className="mt-10 text-ink-muted">{dict.collection.empty}</p>}
    </div>
  );
}
