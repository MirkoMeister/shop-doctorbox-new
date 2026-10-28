"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CloseIcon } from "@/components/ui/Icons";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { ProductCard } from "@/lib/shopify/types";

/**
 * The article's recommended test, kept in reach while reading: a bar on phones,
 * a small card bottom-right on desktop. Its top edge is the reading progress.
 * Shows once the reader is past the table of contents (#article-start) and
 * steps aside when the recommendation block (#recommended) comes into view.
 */
export function ReadingCompanion({ product, locale, dict, articleKey }: { product: ProductCard; locale: Locale; dict: Dictionary; articleKey: string }) {
  const [pastStart, setPastStart] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dismissed, setDismissed] = useState(true); // assume dismissed until the client has checked
  const storageKey = `companion:${articleKey}`;

  useEffect(() => {
    // deferred: the stored choice is read once the client is up, not during hydration
    const id = requestAnimationFrame(() => {
      try {
        setDismissed(sessionStorage.getItem(storageKey) === "1");
      } catch {
        setDismissed(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [storageKey]);

  useEffect(() => {
    const start = document.getElementById("article-start");
    const end = document.getElementById("recommended");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === start) setPastStart(!e.isIntersecting && e.boundingClientRect.top < 0);
          if (e.target === end) setAtEnd(e.isIntersecting);
        }
      },
      { threshold: 0 },
    );
    if (start) io.observe(start);
    if (end) io.observe(end);
    const onScroll = () => {
      const s = start?.getBoundingClientRect().top ?? 0;
      const f = end?.getBoundingClientRect().top ?? document.body.scrollHeight;
      const span = f - s;
      setProgress(span > 0 ? Math.min(1, Math.max(0, -s / span)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const visible = pastStart && !atEnd && !dismissed;
  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(storageKey, "1");
    } catch {
      /* private mode: just hide for now */
    }
  };
  const href = localeHref(locale, `/products/${product.handle}`);
  const price = formatMoney(product.priceRange.minVariantPrice, locale);

  return (
    <aside
      aria-label={dict.guide.companion}
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-30 transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[400px] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="relative overflow-hidden border-t border-line/70 bg-white shadow-float sm:rounded-[var(--radius-card)] sm:border">
        {/* reading progress as the top edge */}
        <span className="absolute inset-x-0 top-0 h-[3px] bg-lind" aria-hidden>
          <span className="block h-full bg-green transition-[width] duration-150 ease-out motion-reduce:transition-none" style={{ width: `${Math.round(progress * 100)}%` }} />
        </span>
        <div className="flex items-center gap-3 px-4 pb-3 pt-4 sm:gap-4 sm:p-4 sm:pt-5">
          <Link href={href} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-16 sm:w-16" tabIndex={-1} aria-hidden>
            {product.featuredImage && <Image src={shopifyImage(product.featuredImage.url, 160)} alt="" fill sizes="64px" className="object-cover" />}
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-ink-muted">{dict.guide.companion}</p>
            <p className="line-clamp-2 font-semibold leading-snug">
              <Link href={href} className="hover:text-green">
                {product.title.replace(/\s+[-|–]\s+.*$/, "")}
              </Link>
            </p>
            <p className="mt-0.5 text-sm tabular-nums text-ink-muted">{price}</p>
          </div>
          <Link href={href} className="btn btn-primary btn-sm shrink-0">
            {dict.guide.toTest}
          </Link>
          <button
            type="button"
            onClick={dismiss}
            aria-label={dict.nav.close}
            className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-ink"
          >
            <CloseIcon width={14} height={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
