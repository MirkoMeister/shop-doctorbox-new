import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Highlight } from "@/components/ui/Highlight";
import { LabIcon, PhoneIcon, SparkIcon, TruckIcon } from "@/components/ui/Icons";
import { ABOUT } from "@/content/about";
import { localeHref } from "@/lib/i18n/config";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/links";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = ABOUT[locale];
  return pageMetadata(locale, "/pages/uber-uns", { title: t.metaTitle, description: t.metaDescription });
}

export default async function AboutPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = ABOUT[locale];
  const href = (p: string) => localeHref(locale, p);
  const icons = [TruckIcon, SparkIcon, LabIcon, PhoneIcon];

  return (
    <>
      {/* Hero */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss text-soft lg:-mt-[88px]">
        <Image
          src="/brand/shape-circle.svg"
          alt=""
          width={369}
          height={369}
          aria-hidden
          className="pointer-events-none absolute -right-28 -top-24 w-[360px] opacity-[0.16] lg:-right-16 lg:w-[560px]"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-[7.5rem] sm:px-6 lg:px-8 lg:pb-28 lg:pt-[10rem]">
          <Breadcrumbs
            items={[{ label: dict.common.home, href: href("/") }, { label: t.kicker }]}
            className="mb-6 [&_*]:text-soft/70 [&_[aria-current]]:text-soft"
          />
          <p className="text-sm font-medium text-turquoise">{t.kicker}</p>
          <h1 className="h-display mt-3 max-w-4xl text-balance">
            <Highlight text={t.headline} tone="dark" />
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-soft/90">{t.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={href("/collections")} className="btn btn-on-dark">
              {t.ctaTests}
            </Link>
            <Link href={href("/pages/b2b")} className="btn btn-secondary !border-soft/40 !text-soft hover:!bg-white/10">
              {t.ctaB2b}
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <h2 className="h2 text-balance">{t.missionTitle}</h2>
          <div className="space-y-5 text-lg leading-relaxed text-ink-muted">
            <p>{t.intro}</p>
            <p>{t.missionText}</p>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <h2 className="h2">
          <Highlight text={t.principlesTitle} />
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {t.principles.map((p, i) => (
            <li key={p.title} className="flex flex-col rounded-[var(--radius-card)] border border-line/70 bg-white p-7 shadow-card">
              <span className="text-sm font-semibold tabular-nums text-green">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="h4 mt-3">{p.title}</h3>
              <p className="mt-3 leading-relaxed text-ink-muted">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <figure className="relative overflow-hidden rounded-[var(--radius-panel)] bg-lind px-6 py-12 text-moss sm:px-12 lg:px-20 lg:py-16">
          <Image
            src="/brand/shape-star.svg"
            alt=""
            width={369}
            height={369}
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-16 w-[260px] opacity-20 lg:w-[380px]"
          />
          <blockquote className="relative max-w-3xl">
            <p className="h3 text-balance font-medium leading-snug">„{t.quote.text}“</p>
          </blockquote>
          <figcaption className="relative mt-6 flex items-center gap-3 text-sm">
            <span className="stars" style={{ ["--pct" as string]: "100%" }} aria-hidden />
            <span className="font-semibold">{t.quote.author}</span>
            <span className="text-moss/70">{t.quote.source}</span>
          </figcaption>
        </figure>
      </section>

      {/* How we work */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <h2 className="h2">
          <Highlight text={t.howTitle} />
        </h2>
        <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.how.map((s, i) => {
            const Icon = icons[i];
            return (
              <li key={s.title} className="flex gap-4 lg:block">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-moss text-soft lg:mb-4">
                  <Icon width={20} height={20} />
                </span>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* App + CTAs */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] bg-moss px-6 py-12 text-soft sm:px-12 lg:px-20 lg:py-16">
          <Image
            src="/brand/shape-tunnel.svg"
            alt=""
            width={369}
            height={369}
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/2 w-[320px] -translate-y-1/2 opacity-[0.16] lg:w-[460px]"
          />
          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
            <div>
              <h2 className="h2 text-balance">
                <Highlight text={t.appTitle} tone="dark" />
              </h2>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-soft/85">{t.appText}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={APP_STORE_URL} target="_blank" rel="noopener" className="btn btn-on-dark">
                  {t.appStore}
                </a>
                <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="btn btn-secondary !border-soft/40 !text-soft hover:!bg-white/10">
                  {t.playStore}
                </a>
              </div>
            </div>
            <ul className="flex flex-col gap-2 lg:items-end">
              <li>
                <Link href={href("/pages/das-sagen-unsere-kunden")} className="text-soft underline-offset-4 hover:underline">
                  {t.reviewsCta}
                </Link>
              </li>
              <li>
                <Link href={href("/pages/kontakt")} className="text-soft underline-offset-4 hover:underline">
                  {t.contactCta}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
