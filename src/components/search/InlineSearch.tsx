"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SearchIcon } from "@/components/ui/Icons";
import { SearchResults } from "./SearchResults";
import { useSearch } from "./useSearch";

/** Light variant of the hero search for content pages (collections). */
export function InlineSearch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const { result, loading } = useSearch(query, locale);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const total = result.products.length + Math.min(result.queries.length, 5);
  const open = focused && query.trim().length >= 2;

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (active >= 0 && active < result.products.length) {
      router.push(localeHref(locale, `/products/${result.products[active].handle}`));
    } else if (active >= result.products.length && active < total) {
      router.push(`${localeHref(locale, "/search")}?q=${encodeURIComponent(result.queries[active - result.products.length].text)}`);
    } else {
      router.push(`${localeHref(locale, "/search")}?q=${encodeURIComponent(q)}`);
    }
    setFocused(false);
  }

  return (
    <div ref={wrapRef} className="relative">
      <form onSubmit={submit} role="search">
        <label htmlFor={id} className="sr-only">
          {dict.nav.search}
        </label>
        <div
          className={`flex items-center gap-2 rounded-full border bg-white p-1 pl-4 transition-colors ${
            focused ? "border-green ring-2 ring-turquoise/60" : "border-line"
          }`}
        >
          <SearchIcon width={20} height={20} className="shrink-0 text-green" />
          <input
            id={id}
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(-1);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={(e) => {
              if (!open) return;
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => (a + 1) % Math.max(total, 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => (a <= 0 ? total - 1 : a - 1));
              } else if (e.key === "Escape") setFocused(false);
            }}
            placeholder={dict.collection.searchPlaceholder}
            role="combobox"
            aria-autocomplete="list"
            aria-controls="search-listbox"
            aria-expanded={open}
            className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] placeholder:text-ink-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="submit" className="btn btn-primary btn-sm !px-3" aria-label={dict.search.submit}>
            <SearchIcon width={16} height={16} />
          </button>
        </div>
      </form>
      <div
        className={`absolute left-0 right-0 top-full z-30 mt-2 transition-all duration-150 ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <SearchResults
          query={query}
          result={result}
          loading={loading}
          locale={locale}
          dict={dict}
          activeIndex={active}
          onPick={() => setFocused(false)}
        />
      </div>
    </div>
  );
}
