import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RichText } from "@/components/content/RichText";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { getMigratedPage, listMigratedPages } from "@/lib/content/pages";
import { isGuidePage } from "@/lib/content/guides";
import { stripHtml, truncate } from "@/lib/format";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getPage } from "@/lib/shopify/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; handle: string }> };

export async function generateStaticParams() {
  const migrated = await listMigratedPages("de");
  return migrated.filter((p) => !isGuidePage(p.handle)).map((p) => ({ handle: p.handle }));
}

async function loadPage(handle: string, locale: "de" | "en") {
  const api = await getPage(handle, locale).catch(() => null);
  if (api && api.body.trim()) {
    return { title: api.title, seoTitle: api.seo.title, seoDescription: api.seo.description || truncate(stripHtml(api.body), 160), html: api.body, source: "api" as const };
  }
  const migrated = await getMigratedPage(handle, locale);
  if (migrated && migrated.html.trim()) {
    return {
      title: migrated.title,
      seoTitle: migrated.seoTitle.replace(/\s*-\s*DoctorBox Heimtests$/, ""),
      seoDescription: migrated.seoDescription || truncate(stripHtml(migrated.html), 160),
      html: migrated.html,
      source: "migrated" as const,
    };
  }
  if (api) return { title: api.title, seoTitle: api.seo.title, seoDescription: api.seo.description, html: "", source: "api" as const };
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const page = await loadPage(p.handle, locale);
  if (!page) return {};
  return pageMetadata(locale, `/pages/${p.handle}`, { title: page.seoTitle || page.title, description: page.seoDescription });
}

export default async function ContentPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  if (isGuidePage(p.handle)) notFound();
  const page = await loadPage(p.handle, locale);
  if (!page) notFound();

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
