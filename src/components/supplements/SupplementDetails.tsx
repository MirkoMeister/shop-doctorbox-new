import { Highlight } from "@/components/ui/Highlight";
import { CheckIcon } from "@/components/ui/Icons";
import type { YoungleContent } from "@/content/youngle-content";
import type { Locale } from "@/lib/i18n/config";

const COPY = {
  de: {
    how: "Gut zu [[wissen]]",
    expect: "Einnahme im [[Zeitverlauf]]",
    actives: "Inhaltsstoffe [[im Detail]]",
  },
  en: {
    how: "Good to [[know]]",
    expect: "Taking it [[over time]]",
    actives: "Ingredients [[in detail]]",
  },
};

/** Below-the-fold content of a Youngle product: facts about the ingredients, a neutral intake timeline, ingredient list. Wording follows the EU register of health claims, see docs/youngle-health-claims.md. */
export function SupplementDetails({ content, locale, productTitle }: { content: YoungleContent; locale: Locale; productTitle: string }) {
  const t = COPY[locale === "en" ? "en" : "de"];
  const { benefits, expect, science } = content;
  const timeline = expect.phases.length > 1;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {benefits.length > 0 && (
        <section className="mt-16" aria-labelledby="supp-how">
          <h2 id="supp-how" className="h2">
            <Highlight text={t.how} />
          </h2>
          <ul className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {benefits.map((b) => (
              <li key={b.title} className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lind text-moss">
                  <CheckIcon width={18} height={18} />
                </span>
                <div>
                  <h3 className="text-[1.0625rem] font-semibold leading-snug">{b.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {expect.phases.length > 0 && (
        <section className="mt-16 rounded-[var(--radius-panel)] bg-soft p-6 sm:p-10" aria-labelledby="supp-expect">
          <div className="max-w-2xl">
            <h2 id="supp-expect" className="h2">
              <Highlight text={t.expect} />
            </h2>
            {expect.lead && <p className="mt-3 text-lg text-ink-muted">{expect.lead}</p>}
          </div>
          {timeline ? (
            <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {expect.phases.map((p, i) => (
                <li key={p.label} className="relative pt-5">
                  {/* progress edge: fills further for later phases */}
                  <span className="absolute left-0 top-0 h-1 w-full rounded-full bg-moss/10" aria-hidden />
                  <span className="absolute left-0 top-0 h-1 rounded-full bg-green" style={{ width: `${((i + 1) / expect.phases.length) * 100}%` }} aria-hidden />
                  <h3 className="text-lg font-semibold text-moss">{p.label}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{p.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-6 max-w-3xl">
              <h3 className="text-lg font-semibold text-moss">{expect.phases[0].label}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{expect.phases[0].text}</p>
            </div>
          )}
        </section>
      )}

      {science && science.actives.length > 0 && (
        <section className="mt-16" aria-labelledby="supp-actives">
          <div className="max-w-2xl">
            <h2 id="supp-actives" className="h2">
              <Highlight text={t.actives} />
            </h2>
            {science.intro && <p className="mt-3 text-lg text-ink-muted">{science.intro}</p>}
          </div>
          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {science.actives.map((a) => (
              <li key={a.name} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,3fr)] sm:gap-6">
                <span className="font-semibold">{a.name}</span>
                <span className="text-ink-muted tabular-nums">{a.dose}</span>
                <span className="text-[0.95rem] text-ink-muted">{a.claim}</span>
              </li>
            ))}
          </ul>
          <p className="sr-only">{productTitle}</p>
        </section>
      )}
    </div>
  );
}
