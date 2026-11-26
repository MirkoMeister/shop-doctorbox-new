"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { Highlight } from "@/components/ui/Highlight";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { sampleMaterials } from "@/lib/shopify/reshape";
import type { ProductCard } from "@/lib/shopify/types";

const MAX_PRODUCTS = 6;
const PREVIEW_ROWS = 10;

const shortTitle = (t: string) => t.replace(/\s+[-|–]\s+.*$/, "").trim();

/**
 * Values × tests matrix for a collection, laid out like a pricing table:
 * quiet row lines, plain green ticks, one highlighted column (the most-reviewed test).
 * Only tests that share at least one value with another test are compared; columns
 * form a ladder from fewest to most values.
 */
export function CompareTable({
  products,
  locale,
  dict,
  id = "compare",
  title,
  text,
  className = "mt-16",
  fixed = false,
  mobileCards = false,
}: {
  products: ProductCard[];
  locale: Locale;
  dict: Dictionary;
  id?: string;
  title?: string;
  text?: string;
  className?: string;
  /** above the filters (sexual health): the note must not point to filters */
  fixed?: boolean;
  /** below md: one swipeable card per test instead of the wide table */
  mobileCards?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(0);
  const track = useRef<HTMLUListElement>(null);
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
  // cards on mobile: the best seller first, then the ladder
  const cardCols = [star, ...cols.filter((p) => p.id !== star.id)];
  const hl = (p: ProductCard) => (p.id === star.id ? "bg-lind/30" : "");

  return (
    <section id={id} className={`${className} scroll-mt-24`} aria-labelledby="compare-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="compare-title" className="h3">
            <Highlight text={title ?? t.compareTitle} />
          </h2>
          <p className="mt-1 text-ink-muted">{text ?? t.compareText}</p>
        </div>
        {comparable.length > MAX_PRODUCTS && <p className="text-sm text-ink-muted">{fill(fixed ? t.compareNoteFixed : t.compareNote, { n: MAX_PRODUCTS })}</p>}
      </div>

      {mobileCards && (
        <div className="md:hidden">
          <ul
            ref={track}
            onScroll={(e) => {
              const el = e.currentTarget;
              const card = el.firstElementChild as HTMLElement | null;
              if (card) setActive(Math.round(el.scrollLeft / (card.offsetWidth + 12)));
            }}
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 pt-3"
            aria-label={title?.replace(/\[\[|\]\]/g, "") ?? t.compareTitle}
          >
            {cardCols.map((p) => {
              const isStar = p.id === star.id;
              return (
                <li key={p.id} className={`relative flex w-[82%] shrink-0 snap-center flex-col rounded-[var(--radius-card)] border p-5 shadow-card ${isStar ? "border-green/40 bg-lind/30" : "border-line/70 bg-white"}`}>
                  {isStar && (
                    <span className="absolute -top-2.5 left-5 rounded-full bg-moss px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-soft">{t.bestseller}</span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                      {p.featuredImage && <Image src={shopifyImage(p.featuredImage.url, 240)} alt="" fill sizes="80px" className="object-cover" />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold leading-snug">{shortTitle(p.title)}</p>
                      <p className="mt-0.5 flex items-baseline gap-2">
                        <span className="text-lg font-semibold tabular-nums text-green">{formatMoney(p.priceRange.minVariantPrice, locale)}</span>
                        <span className="text-xs text-ink-muted">{fill(dict.product.valuesCount, { n: p.biomarkers.length })}</span>
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-ink-muted">
                    {dict.product.sampleMaterial}: {sampleMaterials(p.sampleMaterial)[0] ?? "–"}
                  </p>
                  <ul className="mt-3 flex-1 divide-y divide-line/60 border-y border-line/60">
                    {rows.map((value) => {
                      const has = p.biomarkers.includes(value);
                      return (
                        <li key={value} className={`flex items-center justify-between gap-3 py-2 text-sm ${has ? "font-medium" : "text-ink-muted/60"}`}>
                          <span>{value}</span>
                          {has ? (
                            <CheckIcon width={18} height={18} strokeWidth={2.4} className="shrink-0 text-green" />
                          ) : (
                            <span className="inline-block h-px w-3 shrink-0 bg-line" aria-hidden />
                          )}
                          <span className="sr-only">{has ? "✓" : "–"}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <Link href={localeHref(locale, `/products/${p.handle}`)} className={`btn mt-4 w-full ${isStar ? "btn-primary" : "btn-secondary"}`}>
                    {dict.guide.toTest}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 flex justify-center gap-1.5" aria-hidden>
            {cardCols.map((p, i) => (
              <button
                key={p.id}
                type="button"
                tabIndex={-1}
                onClick={() => {
                  const el = track.current;
                  const card = el?.children[i] as HTMLElement | undefined;
                  if (el && card) el.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
                }}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-green" : "w-1.5 bg-ink/20"}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className={`overflow-x-auto rounded-[var(--radius-card)] border border-line/70 bg-white shadow-card [contain:paint] ${mobileCards ? "hidden md:block" : ""}`}>
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
