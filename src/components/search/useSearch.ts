"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { SearchResult } from "@/lib/shopify/types";

const empty: SearchResult = { products: [], queries: [], collections: [] };

/** Debounced predictive search against /api/search with request de-duplication. */
export function useSearch(query: string, locale: Locale, delay = 180) {
  const [state, setState] = useState<{ key: string; result: SearchResult; loading: boolean }>({
    key: "",
    result: empty,
    loading: false,
  });
  const cache = useRef(new Map<string, SearchResult>());
  const abort = useRef<AbortController | null>(null);

  const q = query.trim();
  const key = q.length < 2 ? "" : `${locale}:${q.toLowerCase()}`;

  useEffect(() => {
    if (!key) return;
    const t = setTimeout(async () => {
      const cached = cache.current.get(key);
      if (cached) {
        setState({ key, result: cached, loading: false });
        return;
      }
      setState((s) => ({ ...s, loading: true }));
      abort.current?.abort();
      const ctrl = new AbortController();
      abort.current = ctrl;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${locale}`, { signal: ctrl.signal });
        const data = (await res.json()) as SearchResult;
        cache.current.set(key, data);
        if (!ctrl.signal.aborted) setState({ key, result: data, loading: false });
      } catch (e) {
        if ((e as Error).name !== "AbortError") setState({ key, result: empty, loading: false });
      }
    }, delay);
    return () => clearTimeout(t);
  }, [key, q, locale, delay]);

  // Derive: results only count when they belong to the current query
  const current = key && state.key === key;
  return {
    result: key ? (current ? state.result : state.result) : empty,
    loading: Boolean(key) && (!current || state.loading),
  };
}
