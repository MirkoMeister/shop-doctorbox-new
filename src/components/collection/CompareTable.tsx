"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import { formatMoney } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

const MAX_PRODUCTS = 8;
const PREVIEW_ROWS = 12;

/**
 * Values × tests matrix for a collection. Rows are ordered by how many tests
 * measure a value (shared values first), long lists fold after a preview.
 */
export function CompareTable({ products, locale, dict }: { products: ProductCard[]; locale: Locale; dict: Dictionary }) {
  const [expanded, setExpanded] = useState(false);
  const cols = products.slice(0, MAX_PRODUCTS);
  const counts = new Map<string, number>();
  for (const p of cols) for (const b of p.biomarkers) counts.set(b, (counts.get(b) ?? 0) + 1);
  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], locale))
    .map(([v]) => v);
  if (cols.length < 2 || rows.length === 0) return null;
  const shown = expanded ? rows : rows.slice(0, PREVIEW_ROWS);
  const t = dict.collection;

  return (
    <section className="mt-16" aria-labelledby="compare-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="compare-title" className="h3">
            <Highlight text={t.compareTitle} />
          </h2>
          <p className="mt-1 text-ink-muted">{t.compareText}</p>
        </div>
        {products.length > MAX_PRODUCTS && <p className="text-sm text-ink-muted">{fill(t.compareNote, { n: MAX_PRODUCTS })}</p>}
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="align-bottom">
              <th scope="col" className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                {t.compareValue}
              </th>
              {cols.map((p) => (
                <th key={p.id} scope="col" className="min-w-[132px] px-3 py-3 text-left align-bottom font-semibold leading-snug">
                  <Link href={localeHref(locale, `/products/${p.handle}`)} className="hover:text-green">
                    {p.title}
                  </Link>
                  <span className="mt-1 block text-xs font-normal text-ink-muted">
                    {fill(dict.product.valuesCount, { n: p.biomarkers.length })} · {formatMoney(p.priceRange.minVariantPrice, locale)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((value, i) => (
              <tr key={value} className={i % 2 ? "bg-surface/60" : ""}>
                <th scope="row" className={`sticky left-0 z-10 px-4 py-2.5 text-left font-medium ${i % 2 ? "bg-[#fafaf8]" : "bg-white"}`}>
                  {value}
                </th>
                {cols.map((p) => {
                  const has = p.biomarkers.includes(value);
                  return (
                    <td key={p.id} className="px-3 py-2.5 text-center">
                      {has ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-lind text-moss">
                          <CheckIcon width={14} height={14} />
                          <span className="sr-only">{p.title}</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted/40" aria-hidden>
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length > PREVIEW_ROWS && (
        <button type="button" onClick={() => setExpanded((v) => !v)} className="btn btn-tertiary mt-4">
          {expanded ? t.compareLess : fill(t.compareMore, { n: rows.length })}
        </button>
      )}
    </section>
  );
}
