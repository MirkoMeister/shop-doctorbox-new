import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { InquiryForm } from "@/components/b2b/InquiryForm";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon, LabIcon, PhoneIcon, ShieldIcon, SparkIcon, TruckIcon, PinIcon } from "@/components/ui/Icons";
import { markerCount, markerGroups } from "@/lib/catalog/markers";
import { localeHref } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";
import { resolveLocale } from "@/lib/locale-params";
import { JsonLd, pageMetadata, faqJsonLd } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, dict } = await resolveLocale(params);
  return pageMetadata(locale, "/pages/b2b", { title: dict.b2b.metaTitle, description: dict.b2b.metaDescription });
}

export default async function B2BPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = dict.b2b;
  const groups = markerGroups(locale);
  const total = markerCount(locale);
  const icons = [SparkIcon, LabIcon, PhoneIcon, TruckIcon, ShieldIcon, PinIcon];

  return (
    <>
      <JsonLd data={faqJsonLd(t.faq)} />

      {/* Hero */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss text-soft lg:-mt-[88px]">
        <Image src="/brand/shape-triangle.svg" alt="" width={369} height={369} aria-hidden className="pointer-events-none absolute -right-24 -top-16 w-[320px] opacity-[0.18] lg:w-[520px]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-[7.5rem] sm:px-6 lg:px-8 lg:pb-28 lg:pt-[10rem]">
          <Breadcrumbs items={[{ label: dict.common.home, href: localeHref(locale, "/") }, { label: t.title }]} className="mb-6 [&_*]:text-soft/70 [&_[aria-current]]:text-soft" />
          <p className="text-sm font-medium text-turquoise">{t.kicker}</p>
          <h1 className="h-display mt-3 max-w-4xl text-balance">
            <Highlight text={t.headline} tone="dark" />
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-soft/85">{t.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#anfrage" className="btn btn-on-dark">
              {t.cta}
            </a>
            <a href="#biomarker" className="btn btn-secondary !border-soft/40 !text-soft hover:!bg-white/10">
              {fill(t.ctaMarkers, { n: total })}
            </a>
          </div>
          <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt className="text-sm text-soft/70">{s.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tabular-nums">{s.value === "{n}" ? total : s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Offering */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <h2 className="h2 max-w-3xl text-balance">
          <Highlight text={t.offerTitle} />
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-muted">{t.offerText}</p>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.offers.map((o, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={o.title} className="rounded-[var(--radius-card)] border border-line/70 bg-white p-6 shadow-card">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lind text-moss">
                  <Icon width={22} height={22} />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{o.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{o.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* White label */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-green">{t.whiteLabelKicker}</p>
            <h2 className="h2 mt-2 text-balance">
              <Highlight text={t.whiteLabelTitle} />
            </h2>
            <p className="mt-4 text-moss/85">{t.whiteLabelText}</p>
            <a href="#anfrage" className="btn btn-primary mt-6">
              {t.cta}
            </a>
          </div>
          <ol className="space-y-4">
            {t.whiteLabelSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4 rounded-2xl bg-white/70 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{i + 1}</span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-moss/80">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Marker portfolio */}
      <section id="biomarker" className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2 className="h2 text-balance">
              <Highlight text={fill(t.markersTitle, { n: total })} />
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{t.markersText}</p>
          </div>
          <p className="text-sm text-ink-muted">{fill(t.markersNote, { groups: groups.length })}</p>
        </div>
        <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {groups.map((g) => (
            <section key={g.key} className="rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card">
              <h3 className="flex items-baseline justify-between gap-3 font-semibold">
                {g.label}
                <span className="text-xs font-normal tabular-nums text-ink-muted">{g.markers.length}</span>
              </h3>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {g.markers.map((m) => (
                  <li key={m} className="chip !px-2.5 !py-1 !text-[0.8125rem]">
                    {m}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-muted">{t.markersFooter}</p>
      </section>

      {/* Use cases */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="h2 text-balance">
          <Highlight text={t.useCasesTitle} />
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.useCases.map((u) => (
            <li key={u.title} className="rounded-2xl bg-surface p-5">
              <h3 className="font-semibold">{u.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{u.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Inquiry */}
      <section id="anfrage" className="mx-auto mt-20 max-w-7xl scroll-mt-24 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <h2 className="h2 text-balance">
              <Highlight text={t.form.title} />
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{t.form.text}</p>
            <ul className="mt-6 space-y-2 text-[0.95rem]">
              {t.form.promises.map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckIcon width={18} height={18} className="mt-0.5 shrink-0 text-green" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl bg-surface p-5 text-sm">
              <p className="font-semibold">{t.form.directTitle}</p>
              <p className="mt-1 text-ink-muted">
                <a href="mailto:heimtest@doctorbox.eu?subject=B2B-Anfrage" className="text-green hover:underline">
                  heimtest@doctorbox.eu
                </a>
                <br />
                <a href="tel:+493034045468" className="hover:text-ink">
                  +49 30 34045468
                </a>
              </p>
            </div>
          </div>
          <div className="rounded-[var(--radius-panel)] border border-line/70 bg-white p-6 shadow-card sm:p-8">
            <InquiryForm locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto mt-20 max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="h2 mb-6">
          <Highlight text={dict.product.faqTitle} />
        </h2>
        <Accordion items={t.faq.map((f) => ({ title: f.q, content: <p>{f.a}</p> }))} />
        <p className="mt-8 text-sm text-ink-muted">
          {t.consumerHint}{" "}
          <Link href={localeHref(locale, "/collections")} className="text-green underline underline-offset-4">
            {dict.collection.all}
          </Link>
        </p>
      </section>
    </>
  );
}
