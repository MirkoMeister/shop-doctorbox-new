"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { sampleMaterials } from "@/lib/shopify/reshape";
import type { ProductCard } from "@/lib/shopify/types";

const MAX_PRODUCTS = 6;
const PREVIEW_ROWS = 10;

const shortTitle = (t: string) => t.replace(/\s*[-|–]\s*.*$/, "").trim();

/**
 * Values × tests matrix for a collection, laid out like a pricing table:
 * quiet row lines, plain green ticks, one highlighted column (the most-reviewed test).
 * Only tests that share at least one value with another test are compared; columns
 * form a ladder from fewest to most values.
 */
export function CompareTable({ products, locale, dict }: { products: ProductCard[]; locale: Locale; dict: Dictionary }) {
  const [expanded, setExpanded] = useState(false);
  const t = dict.collection;

  const withValues = products.filter((p) => p.biomarkers.length > 0);
  const shares = (p: ProductCard) => withValues.some((o) => o.id !== p.id && o.biomarkers.some((b) => p.biomarkers.includes(b)));
  const comparable = withValues.filter(shares);
  const cols = [...comparable]
    .sort((a, b) => a.biomarkers.length - b.biomarkers.length || parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount))
    .slice(0, MAX_PRODUCTS);
  if (cols.length < 2) return null;

  const star = cols.reduce((best, p) => (p.ratingCount > best.ratingCount ? p : best), cols[0]);
  const counts = new Map<string, number>();
  for (const p of cols) for (const b of p.biomarkers) counts.set(b, (counts.get(b) ?? 0) + 1);
  const rows = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], locale))
    .map(([v]) => v);
  const shown = expanded ? rows : rows.slice(0, PREVIEW_ROWS);
  const hl = (p: ProductCard) => (p.id === star.id ? "bg-lind/30" : "");

  return (
    <section className="mt-16" aria-labelledby="compare-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="compare-title" className="h3">
            <Highlight text={t.compareTitle} />
          </h2>
          <p className="mt-1 text-ink-muted">{t.compareText}</p>
        </div>
        {comparable.length > MAX_PRODUCTS && <p className="text-sm text-ink-muted">{fill(t.compareNote, { n: MAX_PRODUCTS })}</p>}
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card [contain:paint]">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-[12rem] min-w-[10rem] bg-white px-5 pb-4 pt-6 text-left align-bottom text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                {t.compareValue}
              </th>
              {cols.map((p) => (
                <th key={p.id} scope="col" className={`relative px-3 pb-4 pt-6 text-center align-bottom font-normal ${p.id === star.id ? "rounded-t-2xl bg-lind/30" : ""}`}>
                  {p.id === star.id && (
                    <span className="absolute left-1/2 top-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-moss px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-soft">
                      {t.bestseller}
                    </span>
                  )}
                  <Link href={localeHref(locale, `/products/${p.handle}`)} className="group inline-flex flex-col items-center hover:text-green">
                    <span className="relative mt-3 h-16 w-24 overflow-hidden rounded-xl">
                      {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 240)} alt="" fill sizes="96px" className="object-cover" />}
                    </span>
                    <span className="mt-2 text-[0.95rem] font-semibold leading-snug">{shortTitle(p.title)}</span>
                  </Link>
                  <span className="mt-1 block text-lg font-semibold tabular-nums text-green">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                  <span className="block text-xs text-ink-muted">{fill(dict.product.valuesCount, { n: p.biomarkers.length })}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-line/70">
              <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3 text-left text-xs font-medium uppercase tracking-[0.12em] text-ink-muted">
                {dict.product.sampleMaterial}
              </th>
              {cols.map((p) => (
                <td key={p.id} className={`px-3 py-3 text-center text-xs text-ink-muted ${hl(p)}`}>
                  {sampleMaterials(p.sampleMaterial)[0] ?? "–"}
                </td>
              ))}
            </tr>
            {shown.map((value) => (
              <tr key={value} className="border-t border-line/60">
                <th scope="row" className="sticky left-0 z-10 bg-white px-5 py-3 text-left font-medium leading-snug">
                  {value}
                </th>
                {cols.map((p) => {
                  const has = p.biomarkers.includes(value);
                  return (
                    <td key={p.id} className={`px-3 py-3 text-center ${hl(p)}`}>
                      {has ? (
                        <>
                          <CheckIcon width={18} height={18} strokeWidth={2.4} className="inline-block text-green" />
                          <span className="sr-only">{shortTitle(p.title)}</span>
                        </>
                      ) : (
                        <span className="inline-block h-px w-3 bg-line align-middle" aria-hidden />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-line/70">
              <td className="sticky left-0 z-10 bg-white px-5 py-4" />
              {cols.map((p) => (
                <td key={p.id} className={`px-3 py-4 text-center ${p.id === star.id ? "rounded-b-2xl bg-lind/30" : ""}`}>
                  <Link
                    href={localeHref(locale, `/products/${p.handle}`)}
                    className={`btn btn-sm !h-9 !min-h-0 !px-4 !text-[0.7rem] ${p.id === star.id ? "btn-primary" : "btn-secondary"}`}
                  >
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
