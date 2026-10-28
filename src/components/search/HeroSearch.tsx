"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { SearchIcon } from "@/components/ui/Icons";
import { AssistantHeroButton } from "@/components/assistant/AssistantButtons";
import { SearchResults } from "./SearchResults";
import { POPULAR_SEARCHES } from "@/content/search-suggestions";
import { useSearch } from "./useSearch";


/** The hero's intelligent search: big pill input with live product suggestions. */
export function HeroSearch({ locale, dict }: { locale: Locale; dict: Dictionary }) {
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

  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (active >= 0) {
      if (active < result.products.length) {
        router.push(localeHref(locale, `/products/${result.products[active].handle}`));
      } else {
        const s = result.queries[active - result.products.length];
        router.push(`${localeHref(locale, "/search")}?q=${encodeURIComponent(s.text)}`);
      }
    } else {
      router.push(`${localeHref(locale, "/search")}?q=${encodeURIComponent(q)}`);
    }
    setFocused(false);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(total, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a <= 0 ? total - 1 : a - 1));
    } else if (e.key === "Escape") {
      setFocused(false);
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl">
      <form onSubmit={submit} role="search" className="relative">
        <label htmlFor={id} className="sr-only">
          {dict.nav.search}
        </label>
        <div
          className={`flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-ink shadow-float ring-2 transition-shadow ${
            focused ? "ring-turquoise" : "ring-transparent"
          }`}
        >
          <SearchIcon width={22} height={22} className="shrink-0 text-green" />
          <input
            id={id}
            type="search"
            inputMode="search"
            autoComplete="off"
            enterKeyHint="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(-1);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKey}
            placeholder={dict.hero.placeholder}
            role="combobox"
            aria-autocomplete="list"
            aria-controls="search-listbox"
            aria-expanded={open}
            className="h-12 min-w-0 flex-1 bg-transparent text-[1.0625rem] placeholder:text-ink-muted/70 focus:outline-none sm:h-14 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button type="submit" className="btn btn-primary hidden sm:inline-flex">
            {dict.search.submit}
          </button>
          <button type="submit" className="btn btn-primary !px-3 sm:hidden" aria-label={dict.search.submit}>
            <SearchIcon width={20} height={20} />
          </button>
        </div>
      </form>

      <div
        className={`absolute left-0 right-0 top-full z-30 mt-3 origin-top transition-all duration-150 ${
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
          onDark
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <AssistantHeroButton label={dict.assistant.heroCta} />
        <span className="ml-2 mr-1 text-soft/70">{dict.hero.popular}</span>
        {POPULAR_SEARCHES[locale].slice(0, 7).map((p) => (
          <Link
            key={p}
            href={`${localeHref(locale, "/search")}?q=${encodeURIComponent(p)}`}
            className="rounded-full border border-white/25 px-3 py-1.5 text-soft transition-colors hover:border-white/60 hover:bg-white/10"
          >
            {p}
          </Link>
        ))}
      </div>
    </div>
  );
}
