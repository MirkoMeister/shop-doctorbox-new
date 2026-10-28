import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Countdown } from "@/components/promo/Countdown";
import { CopyCode } from "@/components/promo/CopyCode";
import { DealCard } from "@/components/promo/DealCard";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon, PhoneIcon } from "@/components/ui/Icons";
import { MOVEMBER, movemberCopy, movemberPhase } from "@/content/movember";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts, getNavCollections } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = movemberCopy(locale);
  const collections = await getNavCollections(locale).catch(() => []);
  const image = collections.find((c) => c.handle === "mannergesundheit")?.image?.url;
  return { ...pageMetadata(locale, MOVEMBER.page, { title: t.metaTitle, description: t.metaDescription, image }), robots: movemberPhase() === "ended" ? { index: false } : undefined };
}

/** A moustache, the Movember mark, drawn as one stroke. */
function Moustache({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M100 38c-8-14-20-20-34-16-14 4-20 16-34 14-9-1-17-7-26-14 6 18 22 32 44 32 20 0 34-10 50-24 16 14 30 24 50 24 22 0 38-14 44-32-9 7-17 13-26 14-14 2-20-10-34-14-14-4-26 2-34 16Z" />
    </svg>
  );
}

/** Movember landing: code, facts, the all-round check, tests by topic, mental-health note, how to redeem. */
export default async function MovemberPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = movemberCopy(locale);
  const phase = movemberPhase();
  const [all, collections] = await Promise.all([getAllProducts(locale).catch(() => []), getNavCollections(locale).catch(() => [])]);
  const heroImage = collections.find((c) => c.handle === "mannergesundheit")?.image?.url ?? null;
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  const spotlight = byHandle.get(MOVEMBER.spotlight);
  const groups = MOVEMBER.groups.map((g) => ({ ...g, ...t.groups[g.key], products: g.handles.map((h) => byHandle.get(h)).filter((p): p is NonNullable<typeof p> => Boolean(p)) })).filter((g) => g.products.length > 0);
  const href = (p: string) => localeHref(locale, p);
  const dealPrice = (amount: string) => ({ amount: (parseFloat(amount) * (1 - MOVEMBER.percent / 100)).toFixed(2) });

  return (
    <>
      {/* Hero: men's health photo under a dark scrim, the moustache as the mark */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-moss-deep text-soft lg:-mt-[88px]">
        {heroImage && <Image src={shopifyImage(heroImage, 2000)} alt="" fill priority sizes="100vw" className="object-cover object-[center_30%]" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061a10] via-[#061a10]/85 to-[#061a10]/40" />
        <Moustache className="absolute -right-10 top-24 hidden w-[520px] text-soft/10 lg:block" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[8rem] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[11rem]">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-3 text-sm font-medium text-okker">
              <Moustache className="w-10 text-okker" />
              {t.kicker}
            </p>
            <h1 className="h-display mt-4 text-balance">
              <Highlight text={t.title} tone="dark" />
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-soft/85">{t.lead}</p>
          </div>

          {phase === "ended" ? (
            <div className="mt-10 max-w-xl rounded-[var(--radius-card)] bg-white/10 p-6">
              <h2 className="h3">{t.endedTitle}</h2>
              <p className="mt-2 text-soft/80">{t.endedText}</p>
              <Link href={href("/collections")} className="btn btn-on-dark mt-5">
                {t.endedCta} <ArrowRight width={16} height={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-14">
              <div className="grid gap-5">
                <CopyCode code={MOVEMBER.code} label={t.codeLabel} copy={t.copy} copied={t.copied} />
                <div className="flex flex-wrap gap-3">
                  <a href="#deals" className="btn btn-primary">
                    {t.cta} <ArrowRight width={16} height={16} />
                  </a>
                  <AskMiraButton label={dict.collection.miraCta} className="btn btn-on-dark" />
                </div>
                <p className="text-sm text-soft/60">{phase === "before" ? t.beforeNote : t.note}</p>
              </div>
              <Countdown end={phase === "before" ? MOVEMBER.start : MOVEMBER.end} label={phase === "before" ? t.startsLabel : t.countdownLabel} units={t.units} />
            </div>
          )}

          {/* Three facts */}
          <dl className="mt-14 grid gap-6 border-t border-white/15 pt-8 sm:grid-cols-3">
            {t.facts.map((f) => (
              <div key={f.value}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block text-4xl font-semibold tracking-tight text-okker">{f.value}</span>
                  <span className="mt-1 block max-w-xs text-sm text-soft/75">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs text-soft/45">{t.factsSource}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Why now */}
        <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14" aria-labelledby="why-title">
          <div>
            <h2 id="why-title" className="h2 text-balance">
              <Highlight text={t.whyTitle} />
            </h2>
            <p className="mt-4 text-lg text-ink-muted">{t.whyText}</p>
          </div>
          <ul className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {t.whyPoints.map((p) => (
              <li key={p.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lind text-moss">
                  <CheckIcon width={16} height={16} />
                </span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-ink-muted">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Spotlight: the all-round check */}
        {spotlight && (
          <section className="mt-16 overflow-hidden rounded-[var(--radius-panel)] bg-moss text-soft" aria-labelledby="spot-title">
            <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div className="relative min-h-[260px] bg-white/5">
                {spotlight.featuredImage && <Image src={shopifyImage(spotlight.featuredImage.url, 1000)} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-contain p-8" />}
              </div>
              <div className="p-6 sm:p-10">
                <p className="text-sm font-medium text-turquoise">{t.spotlightKicker}</p>
                <h2 id="spot-title" className="h2 mt-3">{t.spotlightTitle}</h2>
                <p className="mt-4 max-w-xl text-lg text-soft/85">{t.spotlightText}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {spotlight.biomarkers.map((b) => (
                    <li key={b} className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium">
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link href={href(`/products/${spotlight.handle}`)} className="btn btn-on-dark">
                    {t.spotlightCta} <ArrowRight width={16} height={16} />
                  </Link>
                  {phase !== "ended" && (
                    <p className="text-sm">
                      <span className="text-2xl font-semibold tabular-nums text-okker">{formatMoney({ ...spotlight.priceRange.minVariantPrice, ...dealPrice(spotlight.priceRange.minVariantPrice.amount) }, locale)}</span>{" "}
                      <span className="text-soft/70">
                        {t.withCode} · {t.instead} {formatMoney(spotlight.priceRange.minVariantPrice, locale)}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tests by topic */}
        <section id="deals" className="mt-16 scroll-mt-24" aria-labelledby="deals-title">
          <div className="max-w-2xl">
            <h2 id="deals-title" className="h2 text-balance">
              <Highlight text={t.dealsTitle} />
            </h2>
            <p className="mt-3 text-lg text-ink-muted">{t.dealsText}</p>
          </div>
          {groups.map((g) => (
            <div key={g.key} className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-10">
              <div>
                <h3 className="h3">{g.title}</h3>
                <p className="mt-2 text-ink-muted">{g.text}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {g.products.map((p) => (
                  <li key={p.id}>
                    <DealCard product={p} percent={MOVEMBER.percent} badge={t.dealBadge} withCode={t.withCode} instead={t.instead} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Mental health */}
        <section className="mt-16 rounded-[var(--radius-panel)] bg-soft p-6 sm:p-10" aria-labelledby="talk-title">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-center">
            <div>
              <h2 id="talk-title" className="h3 text-balance">{t.talkTitle}</h2>
              <p className="mt-3 max-w-xl text-ink-muted">{t.talkText}</p>
            </div>
            <a href={`tel:${t.talkPhone.replace(/\s/g, "")}`} className="flex items-center gap-4 rounded-[var(--radius-card)] bg-white p-5 shadow-card transition-shadow hover:shadow-float">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lind text-moss">
                <PhoneIcon width={22} height={22} />
              </span>
              <span>
                <span className="block text-2xl font-semibold tabular-nums">{t.talkPhone}</span>
                <span className="block text-sm text-ink-muted">{t.talkPhoneNote}</span>
              </span>
            </a>
          </div>
        </section>

        {/* Applies to every test + how to redeem */}
        <section className="mt-16 grid gap-10 lg:grid-cols-2" aria-labelledby="how-title">
          <div>
            <h2 className="h3 text-balance">
              <Highlight text={t.allTitle} />
            </h2>
            <p className="mt-3 text-ink-muted">{t.allText}</p>
            <Link href={href("/collections")} className="btn btn-secondary mt-5">
              {t.allCta} <ArrowRight width={16} height={16} />
            </Link>
          </div>
          <div>
            <h2 id="how-title" className="h3 text-balance">
              <Highlight text={t.howTitle} />
            </h2>
            <ol className="mt-5 space-y-4">
              {t.steps.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-moss text-sm font-semibold text-soft">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold">{s.title}</h3>
                    <p className="mt-0.5 text-sm text-ink-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs text-ink-muted">{t.finePrint}</p>
          </div>
        </section>
      </div>
    </>
  );
}
