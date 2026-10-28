"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { TASSO_PAGE, TASSO_POSTER, TASSO_VIDEO } from "@/content/tasso";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/**
 * Shown on the product page while the Tasso+ variant is selected: what the painless
 * upper-arm collection is, the three steps, and the video on demand.
 */
export function TassoNote({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [play, setPlay] = useState(false);
  const t = dict.product.tasso;
  const steps = dict.home.tasso.steps;
  return (
    <aside className="rounded-2xl border border-green/40 bg-lind/30 p-3.5" aria-label={t.title}>
      <div className="flex gap-3.5">
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-moss"
          aria-label={t.play}
        >
          {play ? (
            <video className="absolute inset-0 h-full w-full object-cover" src={TASSO_VIDEO} poster={TASSO_POSTER} autoPlay muted loop playsInline />
          ) : (
            <>
              <Image src={TASSO_POSTER} alt="" fill sizes="112px" className="object-cover" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-moss">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.5v9l7-4.5z" fill="currentColor" /></svg>
                </span>
              </span>
            </>
          )}
        </button>
        <div className="min-w-0">
          <p className="font-semibold leading-snug text-moss">{t.title}</p>
          <p className="mt-1 text-sm leading-snug text-ink-muted">{t.text}</p>
        </div>
      </div>
      <ol className="mt-3 grid gap-1.5 text-sm text-moss sm:grid-cols-3">
        {steps.map((s) => (
          <li key={s} className="flex items-start gap-1.5 leading-snug">
            <CheckIcon width={14} height={14} className="mt-0.5 shrink-0 text-green" />
            <span>{s}</span>
          </li>
        ))}
      </ol>
      <Link href={localeHref(locale, TASSO_PAGE)} className="mt-3 inline-block text-sm font-medium text-green hover:underline">
        {t.more} →
      </Link>
    </aside>
  );
}
