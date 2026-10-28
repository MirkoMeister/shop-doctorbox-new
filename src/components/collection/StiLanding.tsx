import Image from "next/image";
import Link from "next/link";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { Accordion } from "@/components/ui/Accordion";
import { Highlight } from "@/components/ui/Highlight";
import { ArrowRight, CheckIcon, ClockIcon, LabIcon, PhoneIcon, ShieldIcon, TruckIcon } from "@/components/ui/Icons";
import { stiCopy } from "@/content/sti-landing";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { faqJsonLd, JsonLd } from "@/lib/seo";
import type { ProductCard } from "@/lib/shopify/types";

const shortTitle = (t: string) => t.replace(/\s+[-|–]\s+.*$/, "").trim();

/**
 * Sexual-health landing blocks for the collection page: a situation picker that maps
 * four typical cases to concrete tests, the diagnostic windows, and the discretion
 * promise. The compare table and FAQ are rendered by the collection view.
 */
export function StiSituations({ products, locale, dict }: { products: ProductCard[]; locale: Locale; dict: Dictionary }) {
  const t = stiCopy(locale);
  const byHandle = new Map(products.map((p) => [p.handle, p]));
  const situations = t.situations
    .map((s) => ({ ...s, items: s.products.map((h) => byHandle.get(h)).filter((p): p is ProductCard => Boolean(p)) }))
    .filter((s) => s.items.length > 0);
  if (!situations.length) return null;

  return (
    <section className="mt-10 lg:mt-14" aria-labelledby="sti-picker">
      <div className="max-w-2xl">
        <p className="text-sm font-medium text-green">{t.pickerKicker}</p>
        <h2 id="sti-picker" className="h2 mt-2 text-balance">
          <Highlight text={t.pickerTitle} />
        </h2>
        <p className="mt-3 text-lg text-ink-muted">{t.pickerText}</p>
      </div>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {situations.map((s) => (
          <li key={s.key} className="flex flex-col rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card sm:p-6">
            <h3 className="h4">{s.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">{s.text}</p>
            {s.note && (
              <p className="mt-3 rounded-2xl bg-okker/50 px-3.5 py-2.5 text-sm leading-snug text-moss">
                <strong className="font-semibold">{locale === "en" ? "Important: " : "Wichtig: "}</strong>
                {s.note}
              </p>
            )}
            <ul className="mt-5 grid gap-2.5">
              {s.items.map((p, i) => (
                <li key={p.id}>
                  <Link
                    href={localeHref(locale, `/products/${p.handle}`)}
                    className={`group flex items-center gap-3 rounded-2xl border p-3 transition-colors ${
                      i === 0 ? "border-green/40 bg-lind/30 hover:bg-lind/50" : "border-line/70 bg-surface hover:border-ink/40"
                    }`}
                  >
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                      {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 160)} alt="" fill sizes="56px" className="object-cover" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-green">
                        {i === 0 ? t.recommended : t.alternative}
                      </span>
                      <span className="block font-semibold leading-snug">{shortTitle(p.title)}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <CheckIcon width={12} height={12} className="text-green" />
                          {fill(s.key === "women" ? dict.product.valuesCount : t.pathogens, { n: p.biomarkers.length })}
                        </span>
                        {p.sampleMaterial && <span>· {p.sampleMaterial.split("|")[0]?.trim()}</span>}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="font-semibold tabular-nums">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                      <ArrowRight width={16} height={16} className="mt-1 text-green transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <AskMiraButton label={dict.collection.miraCta} question={s.question} className="btn btn-tertiary -ml-3 btn-sm" />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <AskMiraButton label={t.askMira} className="btn btn-secondary" />
      </div>
    </section>
  );
}

export function StiWindows({ locale }: { locale: Locale }) {
  const t = stiCopy(locale);
  return (
    <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start" aria-labelledby="sti-window">
      <div className="max-w-xl">
        <h2 id="sti-window" className="h2 text-balance">
          <Highlight text={t.windowTitle} />
        </h2>
        <p className="mt-3 text-lg text-ink-muted">{t.windowText}</p>
        <p className="mt-4 text-sm leading-snug text-ink-muted">{t.windowNote}</p>
      </div>
      <ol className="divide-y divide-line/70 rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card">
        {t.windows.map((w) => (
          <li key={w.what} className="flex items-start gap-4 px-5 py-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lind text-moss">
              <ClockIcon width={16} height={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold leading-snug">{w.what}</span>
              <span className="block text-sm text-ink-muted">{w.when}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const DISCREET_ICONS = [TruckIcon, ShieldIcon, PhoneIcon, LabIcon];

export function StiDiscreet({ locale }: { locale: Locale }) {
  const t = stiCopy(locale);
  return (
    <section className="mt-16 rounded-[var(--radius-panel)] bg-moss p-6 text-soft sm:p-10" aria-labelledby="sti-discreet">
      <h2 id="sti-discreet" className="h2 max-w-xl text-balance">
        <Highlight text={t.discreetTitle} tone="dark" />
      </h2>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {t.discreet.map((d, i) => {
          const Icon = DISCREET_ICONS[i % DISCREET_ICONS.length];
          return (
            <li key={d.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-turquoise">
                <Icon width={20} height={20} />
              </span>
              <h3 className="mt-4 font-semibold">{d.title}</h3>
              <p className="mt-1.5 text-[0.95rem] leading-relaxed text-soft/80">{d.text}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function StiFaq({ locale }: { locale: Locale }) {
  const t = stiCopy(locale);
  return (
    <section className="mt-16" aria-labelledby="sti-faq">
      <JsonLd data={faqJsonLd(t.faq)} />
      <h2 id="sti-faq" className="h2 max-w-xl text-balance">
        <Highlight text={t.faqTitle} />
      </h2>
      <Accordion className="mt-6" items={t.faq.map((f, i) => ({ title: f.q, content: <p>{f.a}</p>, open: i === 0 }))} />
    </section>
  );
}
