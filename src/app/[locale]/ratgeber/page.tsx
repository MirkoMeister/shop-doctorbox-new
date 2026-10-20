import type { Metadata } from "next";
import { GuideSearch, type GuideEntry } from "@/components/guide/GuideSearch";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { getMigratedPage, listMigratedPages } from "@/lib/content/pages";
import { VALUES } from "@/content/biomarkers.data";
import { stripHtml } from "@/lib/format";
import {
  GUIDE_BASE,
  PAGE_TOPICS,
  isGuidePage,
  pageTopic,
} from "@/lib/content/guides";
import { fill } from "@/lib/i18n/dictionaries";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { getAllPageHandles } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, GUIDE_BASE, {
    title: dict.guide.title,
    description: dict.guide.text,
  });
}

const cleanTitle = (t: string) =>
  t
    .replace(/\s*\|\s*DoctorBox.*$/i, "")
    .replace(/\s*-\s*DoctorBox Heimtests$/, "")
    .trim();

/**
 * Guide landing: the SEO guide pages (migrated from Shopify) with an instant search.
 * Linked from the footer only; the health blog is the editorial entry point on the site.
 */
export default async function GuideIndex({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const [apiPages, migrated] = await Promise.all([
    getAllPageHandles(locale).catch(() => []),
    listMigratedPages(locale),
  ]);

  // title from the API (translated) else from the migrated file; description from the migrated SEO data
  const meta = new Map<string, { title: string; description: string | null }>();
  for (const p of migrated)
    meta.set(p.handle, { title: p.title, description: p.seoDescription });
  for (const p of apiPages)
    meta.set(p.handle, {
      title: p.title,
      description: meta.get(p.handle)?.description ?? null,
    });
  // Search index: title, SEO description, a short excerpt and the lab values the page talks about
  const valueNames = Object.entries(VALUES).map(
    ([key, v]) => v.title?.[locale] ?? key,
  );
  const entries: GuideEntry[] = await Promise.all(
    Array.from(meta.entries())
      .filter(([h]) => isGuidePage(h))
      .map(async ([handle, m]) => {
        const page = await getMigratedPage(handle, locale);
        const text = page
          ? stripHtml(page.html).replace(/\s+/g, " ").trim()
          : "";
        const lower = text.toLowerCase();
        const tags = valueNames
          .filter((n) => lower.includes(n.toLowerCase()))
          .slice(0, 10);
        return {
          handle,
          title: cleanTitle(m.title),
          topic: pageTopic(handle),
          description: m.description,
          excerpt: text.slice(0, 280),
          tags,
        };
      }),
  );
  entries.sort((a, b) => a.title.localeCompare(b.title, locale));
  const topics = Object.fromEntries(
    Object.entries(PAGE_TOPICS).map(([k, t]) => [k, t[locale]]),
  );
  const topicOrder = Object.keys(PAGE_TOPICS);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: dict.guide.title,
          description: dict.guide.text,
          hasPart: entries.slice(0, 50).map((e) => ({
            "@type": "Article",
            headline: e.title,
            url: `${GUIDE_BASE}/${e.handle}`,
          })),
        }}
      />
      <Breadcrumbs
        items={[
          { label: dict.common.home, href: localeHref(locale, "/") },
          { label: dict.guide.title },
        ]}
        className="mb-5"
      />
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-green">
          {fill(dict.guide.count, { n: entries.length })}
        </p>
        <h1 className="h1 mt-2 text-balance">
          <Highlight text={dict.guide.headline} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{dict.guide.text}</p>
      </header>
      <div className="mt-8">
        <GuideSearch
          entries={entries}
          topics={topics}
          topicOrder={topicOrder}
          locale={locale}
          dict={dict}
        />
      </div>
    </div>
  );
}
