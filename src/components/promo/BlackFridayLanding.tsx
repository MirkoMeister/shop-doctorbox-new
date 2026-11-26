import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Countdown } from "@/components/promo/Countdown";
import { CopyCode } from "@/components/promo/CopyCode";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon } from "@/components/ui/Icons";
import { BLACKFRIDAY, blackFridayCopy, type BlackFridayGroup, type BlackFridayPhase } from "@/content/blackfriday";
import { MOVEMBER, movemberActive } from "@/content/movember";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Props = {
  locale: Locale;
  phase: BlackFridayPhase;
  group?: BlackFridayGroup;
  children?: ReactNode;
};

/** Sets the campaign code in running text apart as an okker pill. */
function withCode(text: string): ReactNode {
  const [before, ...rest] = text.split(BLACKFRIDAY.code);
  if (rest.length === 0) return text;
  return (
    <>
      {before}
      <span className="whitespace-nowrap rounded-md bg-okker px-1.5 py-0.5 font-semibold tracking-[0.06em] text-moss">{BLACKFRIDAY.code}</span>
      {rest.join(BLACKFRIDAY.code)}
    </>
  );
}

export function BlackFridayLanding({ locale, phase, group, children }: Props) {
  const t = blackFridayCopy(locale);
  const dict = getDictionary(locale);
  const topic = group && t.groups[group.key];
  const href = (path: string) => localeHref(locale, path);

  return (
    <>
      <section data-hero="dark" className="relative -mt-[72px] overflow-hidden bg-[#06110b] text-soft lg:-mt-[88px]">
        {phase !== "ended" && (
          <span
            aria-hidden
            className="pointer-events-none absolute -right-6 bottom-[-0.18em] select-none text-[clamp(12rem,34vw,30rem)] font-semibold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:2px_rgba(236,211,168,0.22)]"
          >
            −{BLACKFRIDAY.percent}%
          </span>
        )}
        <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pb-16 lg:pt-36">
          <div className="max-w-2xl">
            {group ? (
              <Link href={href(BLACKFRIDAY.page)} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-okker hover:underline">
                <ArrowRight width={15} height={15} className="rotate-180" /> {t.allTopics}
              </Link>
            ) : (
              <p className="text-sm font-medium text-okker">{t.kicker}</p>
            )}
            <h1 className="h-display mt-4 text-balance">
              <Highlight text={topic?.title ?? (phase === "ended" ? t.endedTitle : t.title)} tone="dark" />
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-soft/85">{withCode(topic?.text ?? (phase === "ended" ? t.endedText : t.lead))}</p>
          </div>

          {!group && (
            <nav id="deals" aria-label={t.allTopics} className="mt-6 grid scroll-mt-24 gap-3 lg:grid-cols-3">
              {BLACKFRIDAY.groups.map((item) => (
                <a
                  key={item.key}
                  href={`#deals-${item.slug}`}
                  className="flex items-center gap-4 rounded-[var(--radius-card)] border border-white/20 bg-white/10 p-2.5 pr-4 text-soft transition-colors hover:bg-white/20"
                >
                  <Image src={`/hero/collections/${item.image}`} alt="" width={80} height={64} className="h-14 w-16 shrink-0 rounded-lg object-cover sm:h-16 sm:w-20" />
                  <span className="flex-1 text-lg font-semibold leading-tight">{t.groups[item.key].title}</span>
                  <ArrowRight width={18} height={18} className="shrink-0 rotate-90" />
                </a>
              ))}
            </nav>
          )}

          {phase === "ended" ? (
            <div className="mt-10 max-w-xl rounded-[var(--radius-card)] bg-white/10 p-6">
              {group && (
                <>
                  <h2 className="h3">{t.endedTitle}</h2>
                  <p className="mt-2 text-soft/80">{t.endedText}</p>
                </>
              )}
              <Link href={href("/collections")} className="btn btn-on-dark mt-5">
                {t.endedCta} <ArrowRight width={16} height={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-end lg:gap-14">
              <div className="grid gap-5">
                <CopyCode code={BLACKFRIDAY.code} label={t.codeLabel} copy={t.copy} copied={t.copied} coupon />
                <div className="flex flex-wrap gap-3">
                  {group && (
                    <a href="#deals" className="btn btn-primary">
                      {t.cta} <ArrowRight width={16} height={16} />
                    </a>
                  )}
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
        {children}

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
        {phase !== "ended" && (
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
        )}
      </div>
    </>
  );
}
