import type { Metadata } from "next";
import Link from "next/link";
import { BlackFridayDealGrid, blackFridayProducts } from "@/components/promo/BlackFridayDeals";
import { BlackFridayLanding } from "@/components/promo/BlackFridayLanding";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { BLACKFRIDAY, blackFridayCopy, blackFridayGroupPath, blackFridayPhase } from "@/content/blackfriday";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = blackFridayCopy(locale);
  return pageMetadata(locale, BLACKFRIDAY.page, {
    title: t.metaTitle,
    description: t.metaDescription,
    noIndex: blackFridayPhase() === "ended",
  });
}

/** Overview: every campaign kit right on the page, one section per topic; the hero tiles jump to these sections. */
export default async function BlackFridayPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = blackFridayCopy(locale);
  const phase = blackFridayPhase();
  const all = await getAllProducts(locale).catch(() => []);

  return (
    <BlackFridayLanding locale={locale} phase={phase}>
      <h2 className="h2 mt-14 text-balance">
        <Highlight text={t.dealsTitle} />
      </h2>
      {BLACKFRIDAY.groups.map((group) => (
        <section key={group.key} id={`deals-${group.slug}`} className="mt-10 scroll-mt-24" aria-labelledby={`deals-${group.slug}-title`}>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div className="max-w-2xl">
              <h3 id={`deals-${group.slug}-title`} className="h3">
                {t.groups[group.key].title}
              </h3>
              <p className="mt-1 text-ink-muted">{t.groups[group.key].text}</p>
            </div>
            <Link href={localeHref(locale, blackFridayGroupPath(group))} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-green hover:underline">
              {t.topicMore} <ArrowRight width={14} height={14} />
            </Link>
          </div>
          <BlackFridayDealGrid products={blackFridayProducts(group, all)} phase={phase} locale={locale} dict={dict} />
        </section>
      ))}
    </BlackFridayLanding>
  );
}
