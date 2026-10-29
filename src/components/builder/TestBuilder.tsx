"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckIcon, CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import type { BuilderCopy } from "@/content/test-builder";
import { KIT_RULES } from "@/content/kit/rules";
import type { KitGroup } from "@/lib/kits/catalog";
import { planKit, type KitMarker, type KitPlan } from "@/lib/kits/plan";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill } from "@/lib/i18n/dictionaries";
import type { Money } from "@/lib/shopify/types";

export type BuilderProduct = {
  handle: string;
  title: string;
  price: Money;
  image: string | null;
  biomarkers: string[];
};

/** "LDL-Cholesterin (LDL)" → "ldl cholesterin": compare marker names loosely */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-z0-9äöüß]+/g, " ")
    .trim();
const matches = (marker: string, biomarker: string) => {
  const a = norm(marker);
  const b = norm(biomarker);
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.includes(short);
};

const euro = (n: number, locale: Locale) => formatMoney({ amount: String(n), currencyCode: "EUR" }, locale);

/**
 * Individual kit configurator: pick up to KIT_RULES.maxMarkers lab values, see price, tubes and
 * Tasso devices live (planKit), compare with ready-made tests, then request the kit.
 */
export function TestBuilder({
  markers,
  groups,
  products,
  placeholder,
  locale,
  t,
}: {
  markers: KitMarker[];
  groups: KitGroup[];
  products: BuilderProduct[];
  placeholder: boolean;
  locale: Locale;
  t: BuilderCopy;
}) {
  const byId = useMemo(() => new Map(markers.map((m) => [m.id, m])), [markers]);
  const nameOf = (id: string) => byId.get(id)?.name[locale] ?? id;
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups.slice(0, 2).map((g) => g.key)));
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const q = norm(query);
  const visible = useMemo(
    () =>
      groups
        .map((g) => ({ ...g, ids: q ? g.ids.filter((id) => norm(byId.get(id)?.name[locale] ?? id).includes(q)) : g.ids }))
        .filter((g) => g.ids.length > 0),
    [groups, q, byId, locale],
  );
  const chosen = useMemo(() => selected.map((id) => byId.get(id)).filter((m): m is KitMarker => Boolean(m)), [selected, byId]);
  const plan = useMemo(() => planKit(chosen), [chosen]);
  const full = selected.length >= KIT_RULES.maxMarkers;

  const coverage = useMemo(() => {
    if (!selected.length) return [];
    return products
      .map((p) => {
        const covered = selected.map(nameOf).filter((m) => p.biomarkers.some((b) => matches(m, b)));
        return { product: p, covered, missing: selected.map(nameOf).filter((m) => !covered.includes(m)) };
      })
      .filter((c) => c.covered.length > 0)
      .sort((a, b) => b.covered.length - a.covered.length || a.product.biomarkers.length - b.product.biomarkers.length || parseFloat(a.product.price.amount) - parseFloat(b.product.price.amount))
      .slice(0, 3);
    // nameOf only reads byId and locale
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, selected, byId, locale]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= KIT_RULES.maxMarkers ? s : [...s, id]));
  const toggleGroup = (k: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected.length) {
      setError(t.errorEmpty);
      return;
    }
    setState("busy");
    setError(null);
    const data = new FormData(e.currentTarget);
    const message = [kitSummary(chosen, plan, locale, t), "", String(data.get("note") ?? "").trim()].join("\n");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: t.mailSubject, name: data.get("name"), email: data.get("email"), message, website: data.get("website"), locale }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) setState("ok");
      else {
        setState("error");
        setError(json.error === "email" ? t.errorEmail : t.errorGeneric);
      }
    } catch {
      setState("error");
      setError(t.errorGeneric);
    }
  }

  const field = "h-12 w-full rounded-2xl border border-line bg-white px-4 text-[0.95rem] focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60";
  const label = "mb-1.5 block text-sm font-medium";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start">
      {/* Picker */}
      <div>
        <label className="relative block">
          <span className="sr-only">{t.search}</span>
          <SearchIcon width={18} height={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-full border border-line bg-white py-3.5 pl-11 pr-4 text-[0.95rem] shadow-card focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60"
          />
        </label>
        <h2 className="h4 mt-8">{t.groupsTitle}</h2>
        <ul className="mt-3 divide-y divide-line/70 rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card">
          {visible.map((g) => {
            const isOpen = Boolean(q) || open.has(g.key);
            const picked = g.ids.filter((id) => selected.includes(id)).length;
            return (
              <li key={g.key}>
                <button type="button" onClick={() => toggleGroup(g.key)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left" aria-expanded={isOpen}>
                  <span className="font-semibold">
                    {g.label}
                    <span className="ml-2 text-sm font-normal text-ink-muted">
                      {picked > 0 ? `${picked} / ` : ""}
                      {g.ids.length}
                    </span>
                  </span>
                  <span className={`text-ink-muted transition-transform ${isOpen ? "rotate-45" : ""}`} aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 2v12M2 8h12" /></svg>
                  </span>
                </button>
                {isOpen && (
                  <ul className="flex flex-wrap gap-2 px-5 pb-5">
                    {g.ids.map((id) => {
                      const on = selected.includes(id);
                      const m = byId.get(id)!;
                      return (
                        <li key={id}>
                          <button
                            type="button"
                            onClick={() => toggle(id)}
                            aria-pressed={on}
                            disabled={!on && full}
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                              on ? "border-green bg-green text-white" : "border-line bg-white hover:border-ink"
                            }`}
                          >
                            {on && <CheckIcon width={14} height={14} />}
                            {m.name[locale]}
                            <span className={`font-normal ${on ? "text-white/80" : "text-ink-muted"}`}>{euro(m.price, locale)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          {visible.length === 0 && <li className="px-5 py-6 text-ink-muted">–</li>}
        </ul>
      </div>

      {/* Mobile: the summary sits below the long list, so a bar keeps the selection in view */}
      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 shadow-float backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <span className="text-sm font-medium">
              {fill(t.selectedCount, { n: selected.length, max: KIT_RULES.maxMarkers })} · {euro(plan.total, locale)}
            </span>
            <a href="#builder-summary" className="btn btn-sm btn-primary">
              {t.showCoverage}
            </a>
          </div>
        </div>
      )}

      {/* Summary */}
      <aside id="builder-summary" className="grid scroll-mt-24 gap-5 lg:sticky lg:top-28">
        <section className="rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="h4">{t.selectedTitle}</h2>
              <p className="mt-1 text-sm text-ink-muted">{selected.length ? fill(t.selectedCount, { n: selected.length, max: KIT_RULES.maxMarkers }) : t.selectedEmpty}</p>
            </div>
            {selected.length > 0 && (
              <button type="button" onClick={() => setSelected([])} className="shrink-0 text-sm font-medium text-green hover:underline">
                {t.clear}
              </button>
            )}
          </div>
          {chosen.length > 0 && (
            <ul className="mt-4 divide-y divide-line/70 text-sm">
              {chosen.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2">
                  <span className="min-w-0">{m.name[locale]}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    <span className="tabular-nums">{euro(m.price, locale)}</span>
                    <button type="button" onClick={() => toggle(m.id)} aria-label={`${m.name[locale]}: ${t.remove}`} className="text-ink-muted hover:text-ink">
                      <CloseIcon width={12} height={12} />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
          {full && <p className="mt-3 rounded-xl bg-okker/50 px-3 py-2 text-sm leading-snug text-moss">{fill(t.limitReached, { max: KIT_RULES.maxMarkers })}</p>}
        </section>

        {chosen.length > 0 && <KitCard plan={plan} placeholder={placeholder} locale={locale} t={t} />}

        {coverage.length > 0 && (
          <section className="rounded-[var(--radius-card)] bg-lind p-5 text-moss sm:p-6">
            <h2 className="h4">
              <Highlight text={t.coverageTitle} />
            </h2>
            <p className="mt-1 text-sm text-moss/80">{t.coverageText}</p>
            <ol className="mt-4 grid gap-3">
              {coverage.map(({ product: p, covered, missing }, i) => (
                <li key={p.handle} className={`rounded-2xl bg-white/80 p-3.5 ${i === 0 ? "ring-2 ring-green/50" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white">
                      {p.image && <Image src={shopifyImage(p.image, 120)} alt="" fill sizes="48px" className="object-contain p-0.5" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug">{p.title}</span>
                      <span className="block text-sm text-moss/80">
                        {missing.length === 0 ? t.allCovered : fill(t.covers, { m: covered.length, n: selected.length })} · {formatMoney(p.price, locale)}
                      </span>
                      {missing.length === 0 && parseFloat(p.price.amount) < plan.total && <span className="mt-1 block text-xs font-semibold text-green">{t.cheaper}</span>}
                    </span>
                    <Link href={localeHref(locale, `/products/${p.handle}`)} className="btn btn-sm btn-primary shrink-0">
                      {t.toProduct}
                    </Link>
                  </div>
                  {missing.length > 0 && (
                    <p className="mt-2 text-xs leading-snug text-moss/70">
                      {t.missing}: {missing.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="rounded-[var(--radius-card)] border border-line/70 bg-surface p-5 sm:p-6">
          {state === "ok" ? (
            <div>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green text-white">
                <CheckIcon />
              </span>
              <h2 className="h4 mt-4">{t.successTitle}</h2>
              <p className="mt-2 text-ink-muted">{t.successText}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-4" noValidate>
              <div>
                <h2 className="h4">{t.requestTitle}</h2>
                <p className="mt-1 text-sm text-ink-muted">{t.requestText}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="b-name" className={label}>{t.name} *</label>
                  <input id="b-name" name="name" required minLength={2} autoComplete="name" className={field} />
                </div>
                <div>
                  <label htmlFor="b-email" className={label}>{t.email} *</label>
                  <input id="b-email" name="email" type="email" required autoComplete="email" className={field} />
                </div>
              </div>
              <div>
                <label htmlFor="b-note" className={label}>{t.note}</label>
                <textarea id="b-note" name="note" rows={3} placeholder={t.notePlaceholder} className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-[0.95rem] focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60" />
              </div>
              <div className="hidden" aria-hidden>
                <label htmlFor="b-website">Website</label>
                <input id="b-website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={state === "busy"}>
                {t.submit}
              </button>
              <p className="text-xs leading-snug text-ink-muted">{t.privacy}</p>
              {error && (
                <p className="text-sm text-[#b42318]" role="alert">
                  {error}
                </p>
              )}
            </form>
          )}
        </section>
      </aside>
    </div>
  );
}

/** Tubes, Tasso devices, blood volume and price of the current selection */
function KitCard({ plan, placeholder, locale, t }: { plan: KitPlan; placeholder: boolean; locale: Locale; t: BuilderCopy }) {
  const tubeTypes = KIT_RULES.tubes as Record<string, { label: { de: string; en: string } }>;
  const tubeCounts = Object.entries(
    plan.tubes.reduce<Record<string, number>>((acc, tube) => ({ ...acc, [tube.material]: (acc[tube.material] ?? 0) + 1 }), {}),
  );
  const row = "flex items-baseline justify-between gap-3 py-1.5";
  return (
    <section className="rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card sm:p-6">
      <h2 className="h4">{t.kitTitle}</h2>
      <dl className="mt-3 text-sm">
        {tubeCounts.map(([material, n]) => (
          <div key={material} className={row}>
            <dt className="text-ink-muted">{tubeTypes[material]?.label[locale] ?? material}</dt>
            <dd className="tabular-nums">{n} ×</dd>
          </div>
        ))}
        <div className={row}>
          <dt className="text-ink-muted">{t.tassoLabel}</dt>
          <dd className="tabular-nums">{plan.tasso} ×</dd>
        </div>
        <div className={row}>
          <dt className="text-ink-muted">{t.bloodLabel}</dt>
          <dd className="tabular-nums">{plan.bloodUl} µl</dd>
        </div>
      </dl>
      <dl className="mt-3 border-t border-line/70 pt-3 text-sm">
        <div className={row}>
          <dt className="text-ink-muted">{t.valuesPrice}</dt>
          <dd className="tabular-nums">{euro(plan.markersPrice, locale)}</dd>
        </div>
        <div className={row}>
          <dt className="text-ink-muted">{t.basePriceLabel}</dt>
          <dd className="tabular-nums">{euro(plan.basePrice, locale)}</dd>
        </div>
        {plan.extraTassoPrice > 0 && (
          <div className={row}>
            <dt className="text-ink-muted">{fill(t.extraTassoLabel, { n: plan.tasso - KIT_RULES.includedTasso })}</dt>
            <dd className="tabular-nums">{euro(plan.extraTassoPrice, locale)}</dd>
          </div>
        )}
        <div className={`${row} mt-1 border-t border-line/70 pt-3 text-base font-semibold`}>
          <dt>{t.totalLabel}</dt>
          <dd className="tabular-nums">{euro(plan.total, locale)}</dd>
        </div>
      </dl>
      {plan.problems.includes("tooManyTasso") && (
        <p className="mt-3 rounded-xl bg-[#fde8e6] px-3 py-2 text-sm leading-snug text-[#8a1c12]" role="alert">
          {fill(t.tooManyTasso, { n: plan.tasso, max: KIT_RULES.maxTasso })}
        </p>
      )}
      {placeholder && <p className="mt-3 text-xs leading-snug text-ink-muted">{t.placeholderNote}</p>}
    </section>
  );
}

/** Plain-text kit for the request mail: what to pack and what it costs */
function kitSummary(markers: KitMarker[], plan: KitPlan, locale: Locale, t: BuilderCopy): string {
  const tubeTypes = KIT_RULES.tubes as Record<string, { label: { de: string; en: string } }>;
  return [
    `${t.mailIntro} (${markers.length}):`,
    ...markers.map((m) => `- ${m.name[locale]} [${m.id}${m.labCode ? ` / ${m.labCode}` : ""}] · ${m.material} ${m.volumeUl} µl · ${euro(m.price, locale)}`),
    "",
    ...plan.tubes.map((tube, i) => `${tubeTypes[tube.material]?.label[locale] ?? tube.material} ${i + 1}: ${tube.markers.join(", ")} (${tube.volumeUl} µl)`),
    `${t.tassoLabel}: ${plan.tasso} · ${t.bloodLabel}: ${plan.bloodUl} µl`,
    `${t.totalLabel}: ${euro(plan.total, locale)}${plan.problems.length ? ` · ${plan.problems.join(", ")}` : ""}`,
  ].join("\n");
}
