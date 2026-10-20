"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CloseIcon, SearchIcon } from "@/components/ui/Icons";
import { SearchResults } from "./SearchResults";
import { useSearch } from "./useSearch";

/** Compact header search: opens a full-width overlay with the same live results. */
export function HeaderSearch({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(-1);
  const { result, loading } = useSearch(query, locale);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const total = result.products.length + Math.min(result.queries.length, 5);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

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
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={dict.nav.search} className="inline-flex">
        {children}
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] bg-moss/95 backdrop-blur-sm">
          <div className="mx-auto max-w-3xl px-4 pt-6 sm:pt-16">
            <div className="flex items-center justify-between text-soft">
              <p className="text-sm text-soft/70">{dict.nav.search}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10"
                aria-label={dict.nav.close}
              >
                <CloseIcon width={24} height={24} />
              </button>
            </div>
            <form onSubmit={submit} role="search" className="mt-3">
              <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-ink shadow-float ring-2 ring-turquoise">
                <SearchIcon width={22} height={22} className="shrink-0 text-green" />
                <input
                  ref={inputRef}
                  type="search"
                  autoComplete="off"
                  enterKeyHint="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(-1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((a) => (a + 1) % Math.max(total, 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((a) => (a <= 0 ? total - 1 : a - 1));
                    }
                  }}
                  placeholder={dict.hero.placeholder}
                  className="h-12 min-w-0 flex-1 bg-transparent text-lg placeholder:text-ink-muted/70 focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                />
                <button type="submit" className="btn btn-primary !px-4" aria-label={dict.search.submit}>
                  <SearchIcon width={20} height={20} />
                </button>
              </div>
            </form>
            <div className="mt-3">
              <SearchResults
                query={query}
                result={result}
                loading={loading}
                locale={locale}
                dict={dict}
                activeIndex={active}
                onPick={() => setOpen(false)}
                onDark
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
