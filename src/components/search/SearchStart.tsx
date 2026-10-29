"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { ArrowRight, ClockIcon, SearchIcon, SparkIcon } from "@/components/ui/Icons";
import { clearRecentSearches, POPULAR_SEARCHES, readRecentSearches, SEARCH_TOPICS } from "@/content/search-suggestions";
import { shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Collection } from "@/lib/shopify/types";

/**
 * What the search overlay shows before the visitor types: recent searches,
 * frequent terms, topic tiles and the way to Mira.
 */
export function SearchStart({ locale, dict, collections, onPickTerm, onClose }: { locale: Locale; dict: Dictionary; collections: Collection[]; onPickTerm: (term: string) => void; onClose: () => void }) {
  const [recent, setRecent] = useState<string[]>([]);
  const { setOpen } = useAssistant();
  const href = (p: string) => localeHref(locale, p);

  useEffect(() => {
    // read after mount, storage is browser-only
    const id = requestAnimationFrame(() => setRecent(readRecentSearches()));
    return () => cancelAnimationFrame(id);
  }, []);

  const byHandle = new Map(collections.map((c) => [c.handle, c]));
  const topics = SEARCH_TOPICS.map((h) => byHandle.get(h)).filter((c): c is Collection => Boolean(c));
  const popular = POPULAR_SEARCHES[locale].filter((p) => !recent.some((r) => r.toLowerCase() === p.toLowerCase())).slice(0, 9);

  return (
    <div className="text-soft">
      {recent.length > 0 && (
        <section className="mt-6" aria-label={dict.search.recent}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-soft/70">{dict.search.recent}</h2>
            <button
              type="button"
              onClick={() => {
                clearRecentSearches();
                setRecent([]);
              }}
              className="text-xs text-soft/60 underline-offset-2 hover:text-soft hover:underline"
            >
              {dict.search.clearRecent}
            </button>
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {recent.map((r) => (
              <li key={r}>
                <button type="button" onClick={() => onPickTerm(r)} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-sm transition-colors hover:border-white/60 hover:bg-white/10">
                  <ClockIcon width={14} height={14} className="text-soft/70" />
                  {r}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-6" aria-label={dict.hero.popular}>
        <h2 className="text-sm font-medium text-soft/70">{dict.hero.popular}</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {popular.map((p) => (
            <li key={p}>
              <button type="button" onClick={() => onPickTerm(p)} className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-sm transition-colors hover:border-white/60 hover:bg-white/10">
                <SearchIcon width={14} height={14} className="text-soft/70" />
                {p}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {topics.length > 0 && (
        <section className="mt-8" aria-label={dict.nav.categories}>
          <h2 className="text-sm font-medium text-soft/70">{dict.nav.categories}</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {topics.map((c) => (
              <li key={c.handle}>
                <Link href={href(`/collections/${c.handle}`)} onClick={onClose} className="group flex h-full items-center gap-3 rounded-2xl bg-white/[0.07] p-2 pr-3 transition-colors hover:bg-white/[0.14]">
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10">
                    {c.image && <Image src={shopifyImage(c.image.url, 120)} alt="" fill sizes="48px" className="object-cover" />}
                  </span>
                  <span className="min-w-0 hyphens-auto break-words text-sm font-medium leading-snug">{c.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5">
        <button
          type="button"
          onClick={() => {
            onClose();
            setOpen(true);
          }}
          className="inline-flex items-center gap-2 text-sm font-medium text-turquoise hover:underline"
        >
          <SparkIcon width={16} height={16} />
          {dict.search.askMira}
        </button>
        <Link href={href("/collections")} onClick={onClose} className="inline-flex items-center gap-1.5 text-sm text-soft/80 hover:text-soft">
          {dict.nav.shop} <ArrowRight width={16} height={16} />
        </Link>
      </div>
    </div>
  );
}
