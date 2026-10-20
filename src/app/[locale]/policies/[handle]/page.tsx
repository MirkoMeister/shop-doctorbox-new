import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { promises as fs } from "node:fs";
import path from "node:path";
import { RichText } from "@/components/content/RichText";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getPolicy, POLICY_HANDLES } from "@/lib/shopify/queries";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; handle: string }> };

export function generateStaticParams() {
  return POLICY_HANDLES.map((handle) => ({ handle }));
}

async function loadPolicy(handle: string, locale: Locale): Promise<{ title: string; body: string } | null> {
  if (!(POLICY_HANDLES as readonly string[]).includes(handle)) return null;
  // Impressum is not exposed by the Storefront API → migrated content
  if (handle === "legal-notice") {
    for (const loc of [locale, "de"] as Locale[]) {
      try {
        const raw = await fs.readFile(path.join(process.cwd(), "src", "content", "policies", loc, "legal-notice.json"), "utf8");
        return JSON.parse(raw) as { title: string; body: string };
      } catch {
        /* try next */
      }
    }
    return null;
  }
  const policy = await getPolicy(handle, locale);
  return policy ? { title: policy.title, body: policy.body } : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, params: p } = await resolveLocale(params);
  const policy = await loadPolicy(p.handle, locale);
  if (!policy) return {};
  // old robots.txt disallowed /policies/ – keep them out of the index
  return pageMetadata(locale, `/policies/${p.handle}`, { title: policy.title, noIndex: true });
}

export default async function PolicyPage({ params }: Props) {
  const { locale, dict, params: p } = await resolveLocale(params);
  const policy = await loadPolicy(p.handle, locale);
  if (!policy) notFound();
  return (
    <article className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: policy.title }]} className="mb-6" />
      <div className="mx-auto max-w-3xl">
        <h1 className="h1 mb-8">{policy.title}</h1>
        <RichText html={policy.body} locale={locale} />
      </div>
    </article>
  );
}
