import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Countdown } from "@/components/promo/Countdown";
import { CopyCode } from "@/components/promo/CopyCode";
import { DealCard } from "@/components/promo/DealCard";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight } from "@/components/ui/Icons";
import { HALLOWEEN, halloweenActive, halloweenCopy } from "@/content/halloween";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = halloweenCopy(locale);
  return { ...pageMetadata(locale, HALLOWEEN.page, { title: t.metaTitle, description: t.metaDescription, image: HALLOWEEN.hero }), robots: halloweenActive() ? undefined : { index: false } };
}

/** Halloween campaign landing: code, countdown, the eight deals and how to redeem. */
export default async function HalloweenPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = halloweenCopy(locale);
  const active = halloweenActive();
  const all = await getAllProducts(locale).catch(() => []);
  const deals = HALLOWEEN.products.map((h) => all.find((p) => p.handle === h)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <>
      {/* Night hero on the pumpkin photo */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss-deep text-soft lg:-mt-[88px]">
        <Image src={HALLOWEEN.hero} alt="" fill priority sizes="100vw" className="object-cover object-[center_40%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#061a10] via-[#061a10]/80 to-[#061a10]/35" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[8rem] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[11rem]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-okker">{t.kicker}</p>
            <h1 className="h-display mt-3 text-balance">
              <Highlight text={t.title} tone="dark" />
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-soft/85">{t.lead}</p>
          </div>
          {active ? (
            <div className="mt-10 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-14">
              <div className="grid gap-5">
                <CopyCode code={HALLOWEEN.code} label={t.codeLabel} copy={t.copy} copied={t.copied} />
                <div className="flex flex-wrap gap-3">
                  <a href="#deals" className="btn btn-primary">
                    {t.cta} <ArrowRight width={16} height={16} />
                  </a>
                  <AskMiraButton label={dict.collection.miraCta} className="btn btn-on-dark" />
                </div>
                <p className="text-sm text-soft/60">{t.note}</p>
              </div>
              <Countdown end={HALLOWEEN.end} label={t.countdownLabel} units={t.units} />
            </div>
          ) : (
            <div className="mt-10 max-w-xl rounded-[var(--radius-card)] bg-white/10 p-6">
              <h2 className="h3">{t.endedTitle}</h2>
              <p className="mt-2 text-soft/80">{t.endedText}</p>
              <Link href={localeHref(locale, "/collections")} className="btn btn-on-dark mt-5">
                {t.endedCta} <ArrowRight width={16} height={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Deals */}
        <section id="deals" className="mt-16 scroll-mt-24" aria-labelledby="deals-title">
          <div className="max-w-2xl">
            <h2 id="deals-title" className="h2 text-balance">
              <Highlight text={t.dealsTitle} />
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{t.dealsText}</p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((p) => (
              <li key={p.id}>
                <DealCard product={p} percent={HALLOWEEN.percent} badge={t.dealBadge} withCode={t.withCode} instead={t.instead} locale={locale} dict={dict} />
              </li>
            ))}
          </ul>
        </section>

        {/* How to redeem */}
        <section className="mt-20 rounded-[var(--radius-panel)] bg-soft p-6 sm:p-10" aria-labelledby="how-title">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
            <div>
              <h2 id="how-title" className="h2 text-balance">
                <Highlight text={t.howTitle} />
              </h2>
              <div className="mt-6">
                <div className="inline-flex items-center gap-3 rounded-[var(--radius-card)] bg-moss px-5 py-3 text-soft">
                  <span className="text-sm text-soft/70">{t.codeLabel}</span>
                  <span className="font-semibold tracking-[0.12em] text-okker">{HALLOWEEN.code}</span>
                </div>
              </div>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {t.steps.map((s, i) => (
                <li key={s.title} className="rounded-[var(--radius-card)] bg-white p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-okker text-sm font-semibold text-moss">{i + 1}</span>
                  <h3 className="mt-4 font-semibold text-moss">{s.title}</h3>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 text-xs leading-snug text-ink-muted">{t.finePrint}</p>
        </section>
      </div>
    </>
  );
}
