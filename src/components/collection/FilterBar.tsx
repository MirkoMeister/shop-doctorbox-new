"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { usePublicPathname } from "@/lib/i18n/use-public-pathname";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import type { CatalogFilters, Facets, PriceBand } from "@/lib/catalog/filters";
import { activeFilterCount } from "@/lib/catalog/filters";
import { CheckIcon, ChevronDown, CloseIcon } from "@/components/ui/Icons";

type Group = {
  key: "sample" | "price" | "value";
  label: string;
  options: { value: string; label: string; count: number }[];
};

export function FilterBar({
  dict,
  facets,
  filters,
  sort,
  resultCount,
}: {
  dict: Dictionary;
  facets: Facets;
  filters: CatalogFilters;
  sort: string;
  resultCount: number;
}) {
  const router = useRouter();
  const pathname = usePublicPathname();
  const params = useSearchParams();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  useEffect(() => {
    document.body.style.overflow = sheet ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheet]);

  function hrefWith(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }
  const go = (changes: Record<string, string | null>) => router.replace(hrefWith(changes), { scroll: false });

  const priceLabel: Record<PriceBand, string> = {
    lt50: dict.collection.priceLt50,
    "50-100": dict.collection.price50to100,
    gt100: dict.collection.priceGt100,
  };

  const groups: Group[] = [
    facets.samples.length > 1
      ? {
          key: "sample",
          label: dict.collection.filterSample,
          options: facets.samples.map((s) => ({ value: s.value, label: s.value, count: s.count })),
        }
      : null,
    facets.values.length > 1
      ? {
          key: "value",
          label: dict.collection.filterValue,
          options: facets.values.map((v) => ({ value: v.value, label: v.value, count: v.count })),
        }
      : null,
    {
      key: "price",
      label: dict.collection.filterPrice,
      options: facets.prices.filter((p) => p.count > 0).map((p) => ({ value: p.key, label: priceLabel[p.key], count: p.count })),
    },
  ].filter((g): g is Group => Boolean(g) && g!.options.length > 1);

  const active = activeFilterCount(filters);
  const activeChips: { key: string; label: string }[] = [
    filters.sample ? { key: "sample", label: filters.sample } : null,
    filters.value ? { key: "value", label: filters.value } : null,
    filters.price ? { key: "price", label: priceLabel[filters.price] } : null,
    filters.sub ? { key: "sub", label: dict.collection.filterSubscription } : null,
  ].filter((c): c is { key: string; label: string } => Boolean(c));

  const current = (g: Group) => (g.key === "sample" ? filters.sample : g.key === "value" ? filters.value : filters.price);

  const sortSelect = (
    <label className="flex items-center gap-2 text-sm text-ink-muted">
      <span className="hidden sm:inline">{dict.collection.sort}</span>
      <select
        value={sort}
        onChange={(e) => go({ sort: e.target.value === "relevance" ? null : e.target.value })}
        className="h-10 rounded-full border border-line bg-white px-3 text-sm text-ink focus:border-green focus:outline-none"
        aria-label={dict.collection.sort}
      >
        <option value="relevance">{dict.collection.sortRelevance}</option>
        <option value="price-asc">{dict.collection.sortPriceAsc}</option>
        <option value="price-desc">{dict.collection.sortPriceDesc}</option>
        <option value="new">{dict.collection.sortNew}</option>
      </select>
    </label>
  );

  const optionList = (g: Group, onPick?: () => void) => (
    <ul className="max-h-72 overflow-y-auto py-1">
      {g.options.map((o) => {
        const selected = current(g) === o.value;
        return (
          <li key={o.value}>
            <Link
              href={hrefWith({ [g.key]: selected ? null : o.value })}
              replace
              scroll={false}
              onClick={onPick}
              className={`flex items-center justify-between gap-3 px-4 py-2.5 text-[0.95rem] hover:bg-surface ${selected ? "font-semibold text-moss" : ""}`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${selected ? "border-green bg-green text-white" : "border-line"}`}
                >
                  {selected && <CheckIcon width={12} height={12} />}
                </span>
                {o.label}
              </span>
              <span className="text-xs tabular-nums text-ink-muted">{o.count}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div ref={barRef} className="mb-6">
      {/* Desktop: popover groups in one row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {groups.map((g) => {
            const sel = current(g);
            const isOpen = openGroup === g.key;
            return (
              <div key={g.key} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : g.key)}
                  aria-expanded={isOpen}
                  className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
                    sel ? "border-moss bg-moss text-soft" : "border-line bg-white hover:border-ink"
                  }`}
                >
                  {sel ? g.options.find((o) => o.value === sel)?.label ?? g.label : g.label}
                  <ChevronDown width={16} height={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="absolute left-0 top-full z-30 mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-float">
                    {optionList(g, () => setOpenGroup(null))}
                  </div>
                )}
              </div>
            );
          })}
          {facets.subscriptionCount > 0 && (
            <Link
              href={hrefWith({ sub: filters.sub ? null : "1" })}
              replace
              scroll={false}
              className={`inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-colors ${
                filters.sub ? "border-moss bg-moss text-soft" : "border-line bg-white hover:border-ink"
              }`}
            >
              {dict.collection.filterSubscription}
            </Link>
          )}
        </div>

        {/* Mobile: one button that opens a sheet */}
        <button
          type="button"
          onClick={() => setSheet(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-medium md:hidden"
        >
          {dict.collection.filter}
          {active > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 text-xs font-semibold text-white">
              {active}
            </span>
          )}
        </button>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm text-ink-muted tabular-nums">
            {resultCount === 1 ? dict.collection.countOne : fill(dict.collection.count, { n: resultCount })}
          </span>
          {sortSelect}
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeChips.map((c) => (
            <Link
              key={c.key}
              href={hrefWith({ [c.key]: null })}
              replace
              scroll={false}
              className="inline-flex items-center gap-1.5 rounded-full bg-lind px-3 py-1.5 text-sm font-medium text-moss hover:bg-lind-deep"
            >
              {c.label}
              <CloseIcon width={14} height={14} />
            </Link>
          ))}
          <Link href={pathname} replace scroll={false} className="text-sm text-ink-muted underline underline-offset-4 hover:text-ink">
            {dict.collection.reset}
          </Link>
        </div>
      )}

      {/* Mobile sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[85] md:hidden">
          <button type="button" aria-label={dict.nav.close} onClick={() => setSheet(false)} className="absolute inset-0 bg-moss/40" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dict.collection.filter}
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-[var(--radius-panel)] bg-white pb-6 shadow-float"
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <h2 className="h4">{dict.collection.filter}</h2>
              <button type="button" onClick={() => setSheet(false)} className="rounded-full p-2 hover:bg-lind" aria-label={dict.nav.close}>
                <CloseIcon />
              </button>
            </div>
            {groups.map((g) => (
              <section key={g.key} className="border-b border-line">
                <h3 className="px-5 pb-1 pt-4 text-sm font-semibold text-ink-muted">{g.label}</h3>
                {optionList(g)}
              </section>
            ))}
            {facets.subscriptionCount > 0 && (
              <Link
                href={hrefWith({ sub: filters.sub ? null : "1" })}
                replace
                scroll={false}
                className="flex items-center justify-between px-5 py-4 text-[0.95rem]"
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${filters.sub ? "border-green bg-green text-white" : "border-line"}`}
                  >
                    {filters.sub && <CheckIcon width={12} height={12} />}
                  </span>
                  {dict.collection.filterSubscription}
                </span>
                <span className="text-xs tabular-nums text-ink-muted">{facets.subscriptionCount}</span>
              </Link>
            )}
            <div className="flex gap-3 px-5 pt-4">
              <Link href={pathname} replace scroll={false} onClick={() => setSheet(false)} className="btn btn-secondary flex-1">
                {dict.collection.reset}
              </Link>
              <button type="button" onClick={() => setSheet(false)} className="btn btn-primary flex-1">
                {fill(dict.collection.showResults, { n: resultCount })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
