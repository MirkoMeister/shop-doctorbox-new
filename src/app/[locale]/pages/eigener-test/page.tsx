import type { Metadata } from "next";
import { TestBuilder, type BuilderProduct } from "@/components/builder/TestBuilder";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { BUILDER_PAGE, builderCopy } from "@/content/test-builder";
import { KIT_MARKERS, kitGroups, kitIsPlaceholder } from "@/lib/kits/catalog";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = builderCopy(locale);
  return pageMetadata(locale, BUILDER_PAGE, { title: t.metaTitle, description: t.metaDescription });
}

/** Individual kits: pick lab values, see price, tubes and Tasso devices, request the kit. */
export default async function BuilderPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = builderCopy(locale);
  const groups = kitGroups(locale);
  const products: BuilderProduct[] = (await getAllProducts(locale).catch(() => []))
    .filter((p) => p.biomarkers.length > 0 && p.availableForSale)
    .map((p) => ({ handle: p.handle, title: p.title, price: p.priceRange.minVariantPrice, image: p.featuredImage?.url ?? null, biomarkers: p.biomarkers }));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: t.kicker }]} className="mb-5" />
      <header className="max-w-2xl">
        <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-green">
          {t.kicker}
          <span className="chip !bg-okker !text-moss !px-2.5 !py-1 !text-xs">{t.mvpBadge}</span>
        </p>
        <h1 className="h1 mt-2 text-balance">
          <Highlight text={t.title} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{t.lead}</p>
        <p className="mt-4 rounded-2xl bg-lind/50 px-4 py-3 text-sm leading-snug text-moss">{t.mvpNote}</p>
      </header>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {t.steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{i + 1}</span>
            <span>
              <span className="block font-semibold">{s.title}</span>
              <span className="block text-sm text-ink-muted">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-10">
        <TestBuilder markers={KIT_MARKERS} groups={groups} products={products} placeholder={kitIsPlaceholder} locale={locale} t={t} />
      </div>
    </div>
  );
}
