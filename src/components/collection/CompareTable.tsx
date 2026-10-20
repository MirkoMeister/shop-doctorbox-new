"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

const MAX_PRODUCTS = 6;
const PREVIEW_ROWS = 10;

const shortTitle = (t: string) => t.replace(/\s*[-|–]\s*.*$/, "").trim();

/**
 * Values × tests matrix for a collection.
 * Only tests that share at least one value with another test are compared (outliers such
 * as an HPV typing kit would only add rows nobody else measures). Columns form a ladder
 * from fewest to most values; rows are ordered by how many tests measure a value.
 */
export function CompareTable({ products, locale, dict }: { products: ProductCard[]; locale: Locale; dict: Dictionary }) {
  const [expanded, setExpanded] = useState(false);
  const t = dict.collection;

  const withValues = products.filter((p) => p.biomarkers.length > 0);
  const shares = (p: ProductCard) => withValues.some((o) => o.id !== p.id && o.biomarkers.some((b) => p.biomarkers.includes(b)));
  const cols = withValues
    .filter(shares)
    .sort((a, b) => a.biomarkers.length - b.biomarkers.length || parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount))
    .slice(0, MAX_PRODUCTS);
  if (cols.length < 2) return null;

  const counts = new Map<string, number>();
  for (const p of cols) for (const b of p.biomarkers) counts.set(b, (counts.get(b) ?? 0) + 1);
  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], locale))
    .map(([v]) => v);
  const shown = expanded ? rows : rows.slice(0, PREVIEW_ROWS);

  return (
    <section className="mt-16" aria-labelledby="compare-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="compare-title" className="h3">
            <Highlight text={t.compareTitle} />
          </h2>
          <p className="mt-1 text-ink-muted">{t.compareText}</p>
        </div>
        {withValues.filter(shares).length > MAX_PRODUCTS && <p className="text-sm text-ink-muted">{fill(t.compareNote, { n: MAX_PRODUCTS })}</p>}
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="align-bottom">
              <th scope="col" className="sticky left-0 z-10 w-[11rem] min-w-[9rem] bg-white px-4 pb-3 pt-4 text-left text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                {t.compareValue}
              </th>
              {cols.map((p) => (
                <th key={p.id} scope="col" className="px-3 pb-3 pt-4 text-center align-bottom font-semibold leading-snug">
                  <Link href={localeHref(locale, `/products/${p.handle}`)} className="group inline-flex flex-col items-center gap-2 hover:text-green">
                    <span className="relative h-14 w-20 overflow-hidden rounded-xl bg-surface">
                      {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 240)} alt="" fill sizes="80px" className="object-cover" />}
                    </span>
                    <span className="text-[0.9rem]">{shortTitle(p.title)}</span>
                  </Link>
                  <span className="mt-1 block text-xs font-normal text-ink-muted">
                    {fill(dict.product.valuesCount, { n: p.biomarkers.length })} · <span className="font-semibold text-green">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((value) => (
              <tr key={value} className="border-t border-line/60">
                <th scope="row" className="sticky left-0 z-10 bg-white px-4 py-2.5 text-left font-medium leading-snug">
                  {value}
                </th>
                {cols.map((p) => {
                  const has = p.biomarkers.includes(value);
                  return (
                    <td key={p.id} className={`px-3 py-2.5 text-center ${has ? "bg-lind/35" : ""}`}>
                      {has ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-green text-white">
                          <CheckIcon width={13} height={13} strokeWidth={2.4} />
                          <span className="sr-only">{shortTitle(p.title)}</span>
                        </span>
                      ) : (
                        <span className="text-ink-muted/30" aria-hidden>
                          –
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line/60">
              <td className="sticky left-0 z-10 bg-white px-4 py-3" />
              {cols.map((p) => (
                <td key={p.id} className="px-3 py-3 text-center">
                  <Link href={localeHref(locale, `/products/${p.handle}`)} className="btn btn-secondary btn-sm !h-9 !min-h-0 !px-3.5 !text-[0.7rem]">
                    {dict.guide.toTest}
                  </Link>
                </td>
              ))}
            </tr>
          </tfoot>
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
