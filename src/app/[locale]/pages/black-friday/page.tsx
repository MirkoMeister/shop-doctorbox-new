import type { Metadata } from "next";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Countdown } from "@/components/promo/Countdown";
import { CopyCode } from "@/components/promo/CopyCode";
import { DealCard } from "@/components/promo/DealCard";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon } from "@/components/ui/Icons";
import { BLACKFRIDAY, blackFridayCopy, blackFridayPhase } from "@/content/blackfriday";
import { MOVEMBER, movemberActive } from "@/content/movember";
import { localeHref } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/locale-params";
import { pageMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/shopify/queries";

export const revalidate = 300;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await resolveLocale(params);
  const t = blackFridayCopy(locale);
  return { ...pageMetadata(locale, BLACKFRIDAY.page, { title: t.metaTitle, description: t.metaDescription }), robots: blackFridayPhase() === "ended" ? { index: false } : undefined };
}

/** Black Friday landing: the code and countdown on a dark, typographic hero, the kits by topic, how to redeem. */
export default async function BlackFridayPage({ params }: Props) {
  const { locale, dict } = await resolveLocale(params);
  const t = blackFridayCopy(locale);
  const phase = blackFridayPhase();
  const all = await getAllProducts(locale).catch(() => []);
  const byHandle = new Map(all.map((p) => [p.handle, p]));
  const groups = BLACKFRIDAY.groups
    .map((g) => ({ ...g, ...t.groups[g.key], products: g.handles.map((h) => byHandle.get(h)).filter((p): p is NonNullable<typeof p> => Boolean(p) && p!.availableForSale) }))
    .filter((g) => g.products.length > 0);
  const href = (p: string) => localeHref(locale, p);

  return (
    <>
      {/* Hero: the discount itself is the picture */}
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-[#06110b] text-soft lg:-mt-[88px]">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 bottom-[-0.18em] select-none text-[clamp(12rem,34vw,30rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_rgba(236,211,168,0.22)]"
        >
          −{BLACKFRIDAY.percent}%
        </span>
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[8rem] sm:px-6 lg:px-8 lg:pb-24 lg:pt-[11rem]">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-okker">{t.kicker}</p>
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
                <CopyCode code={BLACKFRIDAY.code} label={t.codeLabel} copy={t.copy} copied={t.copied} />
                <div className="flex flex-wrap gap-3">
                  <a href="#deals" className="btn btn-primary">
                    {t.cta} <ArrowRight width={16} height={16} />
                  </a>
                  <AskMiraButton label={dict.collection.miraCta} className="btn btn-on-dark" />
                </div>
                <p className="text-sm text-soft/60">{phase === "before" ? t.beforeNote : t.note}</p>
              </div>
              <Countdown end={phase === "before" ? BLACKFRIDAY.start : BLACKFRIDAY.end} label={phase === "before" ? t.startsLabel : t.countdownLabel} units={t.units} />
            </div>
          )}

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-8 text-sm text-soft/80">
            {t.perks.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <CheckIcon width={16} height={16} className="text-okker" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Kits by topic */}
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
                    <DealCard product={p} percent={BLACKFRIDAY.percent} badge={t.dealBadge} withCode={t.withCode} instead={t.instead} locale={locale} dict={dict} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Gift + Movember pointer */}
        <section className="mt-16 grid gap-4 lg:grid-cols-2">
          <div className="rounded-[var(--radius-panel)] bg-lind p-6 text-moss sm:p-8">
            <h2 className="h3 text-balance">
              <Highlight text={t.giftTitle} />
            </h2>
            <p className="mt-3 max-w-lg text-moss/80">{t.giftText}</p>
          </div>
          {movemberActive() && (
            <div className="flex flex-col rounded-[var(--radius-panel)] bg-moss p-6 text-soft sm:p-8">
              <h2 className="h3">{t.movemberTitle}</h2>
              <p className="mt-3 max-w-lg text-soft/80">{t.movemberText}</p>
              <Link href={href(MOVEMBER.page)} className="btn btn-on-dark mt-6 self-start">
                {t.movemberCta} <ArrowRight width={16} height={16} />
              </Link>
            </div>
          )}
        </section>

        {/* How to redeem */}
        <section className="mt-16 max-w-2xl" aria-labelledby="how-title">
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
        </section>
      </div>
    </>
  );
}
