"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowRight, SearchIcon } from "@/components/ui/Icons";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";
import { SearchResults } from "./SearchResults";
import { POPULAR_SEARCHES } from "@/content/search-suggestions";
import { useSearch } from "./useSearch";
import { OPEN_SEARCH_EVENT } from "./HeaderSearch";

/** Phones search in the full-screen overlay of the header search instead of this field */
const onPhone = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

type Mode = "mira" | "search";

/**
 * The hero's search with a toggle: "Test suchen" (default) is the search with live product suggestions;
 * "Mira fragen" sends the text to the assistant, which also understands symptoms and vague questions.
 */
export function HeroSearch({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [mode, setMode] = useState<Mode>("search");
  const mira = mode === "mira";
  const { ask, setOpen: openMira } = useAssistant();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  // no search requests while the field is talking to Mira
  const { result, loading } = useSearch(mira ? "" : query, locale);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const total = result.products.length + Math.min(result.queries.length, 5);
  const open = !mira && focused && query.trim().length >= 2;

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
    if (mira) {
      if (q) ask(q);
      else openMira(true);
      setQuery("");
      return;
    }
    if (!q) return;
    if (active >= 0) {
      if (active < result.products.length) {
        router.push(
          localeHref(locale, `/products/${result.products[active].handle}`),
        );
      } else {
        const s = result.queries[active - result.products.length];
        router.push(
          `${localeHref(locale, "/search")}?q=${encodeURIComponent(s.text)}`,
        );
      }
    } else {
      router.push(
        `${localeHref(locale, "/search")}?q=${encodeURIComponent(q)}`,
      );
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
      <div
        role="radiogroup"
        aria-label={dict.hero.modeLabel}
        className="mb-3 inline-flex rounded-full bg-white/10 p-1 text-sm font-medium"
      >
        {(["search", "mira"] as const).map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => {
              setMode(m);
              setActive(-1);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${
              mode === m
                ? "bg-white text-moss shadow-card"
                : "text-soft/85 hover:text-soft"
            }`}
          >
            {m === "mira" ? (
              <MiraAvatar size={22} className="-ml-1.5" />
            ) : (
              <SearchIcon width={16} height={16} />
            )}
            {m === "mira" ? dict.hero.modeMira : dict.hero.modeSearch}
          </button>
        ))}
      </div>
      <form
        onSubmit={submit}
        role={mira ? undefined : "search"}
        className="relative"
      >
        <label htmlFor={id} className="sr-only">
          {dict.nav.search}
        </label>
        <div
          // phone + search mode: a tap opens the full-screen search (with keyboard) instead of typing here
          onPointerDownCapture={(e) => {
            if (!mira && onPhone()) e.preventDefault();
          }}
          onClickCapture={(e) => {
            if (mira || !onPhone()) return;
            e.preventDefault();
            e.stopPropagation();
            window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
          }}
          className={`flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-ink shadow-float ring-2 transition-shadow ${
            focused ? "ring-turquoise" : "ring-transparent"
          }`}
        >
          {mira ? (
            <MiraAvatar size={28} className="-ml-2 shrink-0" />
          ) : (
            <SearchIcon
              width={22}
              height={22}
              className="shrink-0 text-green"
            />
          )}
          <input
            id={id}
            type={mira ? "text" : "search"}
            inputMode={mira ? "text" : "search"}
            autoComplete="off"
            enterKeyHint={mira ? "send" : "search"}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(-1);
            }}
            onFocus={() => setFocused(true)}
            onKeyDown={onKey}
            placeholder={
              mira ? dict.hero.miraPlaceholder : dict.hero.placeholder
            }
            role={mira ? undefined : "combobox"}
            aria-autocomplete={mira ? undefined : "list"}
            aria-controls={mira ? undefined : "search-listbox"}
            aria-expanded={mira ? undefined : open}
            className="h-12 min-w-0 flex-1 bg-transparent text-[1.0625rem] placeholder:text-ink-muted/70 focus:outline-none sm:h-14 sm:text-lg [&::-webkit-search-cancel-button]:appearance-none"
          />
          <button
            type="submit"
            className="btn btn-primary hidden sm:inline-flex"
          >
            {mira ? dict.hero.miraSubmit : dict.search.submit}
          </button>
          <button
            type="submit"
            className="btn btn-primary !px-3 sm:hidden"
            aria-label={mira ? dict.hero.miraSubmit : dict.search.submit}
          >
            {mira ? <ArrowRight width={20} height={20} /> : <SearchIcon width={20} height={20} />}
          </button>
        </div>
      </form>

      <div
        className={`absolute left-0 right-0 top-full z-30 mt-3 origin-top transition-all duration-150 ${
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0"
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
        {mira ? (
          dict.hero.miraExamples.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => ask(q)}
              className="rounded-full border border-white/25 px-3 py-1.5 text-left text-soft transition-colors hover:border-white/60 hover:bg-white/10"
            >
              {q}
            </button>
          ))
        ) : (
          <>
            <span className="mr-1 text-soft/70">{dict.hero.popular}</span>
            {POPULAR_SEARCHES[locale].slice(0, 7).map((p) => (
              <Link
                key={p}
                href={`${localeHref(locale, "/search")}?q=${encodeURIComponent(p)}`}
                className="rounded-full border border-white/25 px-3 py-1.5 text-soft transition-colors hover:border-white/60 hover:bg-white/10"
              >
                {p}
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
