"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatMoney, shopifyImage } from "@/lib/format";
import type { SearchResult } from "@/lib/shopify/types";
import { ArrowRight, SearchIcon } from "@/components/ui/Icons";

export function SearchResults({
  query,
  result,
  loading,
  locale,
  dict,
  activeIndex,
  onPick,
  onDark = false,
}: {
  query: string;
  result: SearchResult;
  loading: boolean;
  locale: Locale;
  dict: Dictionary;
  activeIndex: number;
  onPick: () => void;
  onDark?: boolean;
}) {
  const q = query.trim();
  if (q.length < 2) return null;
  const nothing = !loading && result.products.length === 0 && result.queries.length === 0;
  const href = (p: string) => localeHref(locale, p);
  const productCount = result.products.length;

  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-card)] border bg-white text-ink shadow-float ${onDark ? "border-white/10" : "border-line"}`}
      role="listbox"
      id="search-listbox"
    >
      {loading && result.products.length === 0 && (
        <p className="px-5 py-4 text-sm text-ink-muted" aria-live="polite">
          {dict.hero.searching}…
        </p>
      )}
      {nothing && <p className="px-5 py-4 text-sm text-ink-muted">{dict.hero.noResults}</p>}

      {result.products.length > 0 && (
        <ul className="divide-y divide-line/70">
          {result.products.map((p, i) => {
            const active = i === activeIndex;
            return (
              <li key={p.id}>
                <Link
                  href={href(`/products/${p.handle}`)}
                  onClick={onPick}
                  role="option"
                  aria-selected={active}
                  className={`flex items-center gap-4 px-4 py-3 transition-colors hover:bg-surface ${active ? "bg-surface" : ""}`}
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                    {p.featuredImage && (
                      <Image
                        src={shopifyImage(p.featuredImage.url, 160)}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium leading-snug">{p.title}</span>
                    <span className="mt-0.5 block truncate text-sm text-ink-muted">
                      {p.biomarkers.length > 0
                        ? p.biomarkers.slice(0, 4).join(", ") + (p.biomarkers.length > 4 ? " …" : "")
                        : p.sampleMaterial}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-green">
                    {formatMoney(p.priceRange.minVariantPrice, locale)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {result.queries.length > 0 && (
        <ul className="flex flex-wrap gap-2 border-t border-line/70 px-4 py-3">
          {result.queries.slice(0, 5).map((s, i) => {
            const active = productCount + i === activeIndex;
            return (
              <li key={s.text}>
                <Link
                  href={`${href("/search")}?q=${encodeURIComponent(s.text)}`}
                  onClick={onPick}
                  role="option"
                  aria-selected={active}
                  className={`chip chip-outline hover:bg-lind ${active ? "bg-lind" : ""}`}
                >
                  <SearchIcon width={14} height={14} />
                  {s.text}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {(result.products.length > 0 || result.queries.length > 0) && (
        <Link
          href={`${href("/search")}?q=${encodeURIComponent(q)}`}
          onClick={onPick}
          className="flex items-center justify-between border-t border-line/70 px-5 py-3 text-sm font-medium text-green hover:bg-surface"
        >
          {dict.hero.showAll}
          <ArrowRight width={18} height={18} />
        </Link>
      )}
    </div>
  );
}
