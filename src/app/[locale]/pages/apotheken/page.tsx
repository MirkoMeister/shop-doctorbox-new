import type { Metadata } from "next";
import Link from "next/link";
import { PharmacyFinder } from "@/components/pharmacies/PharmacyFinder";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { PHARMACIES, PHARMACIES_PAGE, PHARMACIES_UPDATED, pharmacyCopy } from "@/content/pharmacies";
import { formatDate } from "@/lib/format";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { faqJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = pharmacyCopy(locale);
  return pageMetadata(locale, PHARMACIES_PAGE, { title: t.metaTitle, description: t.metaDescription });
}

/** Partner pharmacies for pickup and on-site sampling (list from pharmacies.json). */
export default async function PharmaciesPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = pharmacyCopy(locale);
  const partners = PHARMACIES.filter((l) => l.services.includes("sampling") || !/doctorbox/i.test(l.name));

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-5 sm:px-6 lg:px-8 lg:pt-8">
      <JsonLd data={faqJsonLd(t.faq)} />
      <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: t.kicker }]} className="mb-5" />
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-green">{t.kicker}</p>
        <h1 className="h1 mt-2 text-balance">
          <Highlight text={t.title} />
        </h1>
        <p className="mt-3 text-lg text-ink-muted">{t.lead}</p>
      </header>

      <ol className="mt-10 grid gap-5 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:grid-cols-3 sm:p-8">
        {t.steps.map((s, i) => (
          <li key={s.title} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{i + 1}</span>
            <span>
              <span className="block font-semibold">{s.title}</span>
              <span className="block text-sm text-moss/80">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-14" aria-label={t.kicker}>
        {partners.length === 0 && (
          <div className="mb-8 rounded-[var(--radius-card)] border border-okker bg-okker/30 p-5 text-moss">
            <p className="font-semibold">{t.noneYet}</p>
            <p className="mt-1 text-sm">{t.noneYetText}</p>
          </div>
        )}
        <PharmacyFinder locations={PHARMACIES} t={t} />
        <p className="mt-6 text-xs text-ink-muted">
          {t.updated}: {formatDate(PHARMACIES_UPDATED, locale)} ·{" "}
          <Link href={localeHref(locale, "/pages/kontakt")} className="text-green hover:underline">
            {t.contact}
          </Link>
        </p>
      </section>

      <section className="mt-16" aria-labelledby="pharmacy-faq">
        <h2 id="pharmacy-faq" className="h2 max-w-xl text-balance">
          <Highlight text={t.faqTitle} />
        </h2>
        <Accordion className="mt-6" items={t.faq.map((f, i) => ({ title: f.q, content: <p>{f.a}</p>, open: i === 0 }))} />
      </section>
    </div>
  );
}
