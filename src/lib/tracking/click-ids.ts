"use client";

import { useSyncExternalStore } from "react";

/**
 * Google Ads click IDs for the checkout: read from the landing page URL, kept only in memory
 * (no cookie, no localStorage: without consent nothing may be stored) and appended to the
 * checkout links, so Google can attribute the purchase on the checkout domain.
 *
 * Read once when this module first runs in the browser, i.e. on the first page view of a page
 * load, before any client-side navigation changes the URL. A full reload loses them.
 */
const KEYS = ["gclid", "gbraid", "wbraid"] as const;

/** e.g. "gclid=abc&wbraid=xyz"; empty without click IDs (and always on the server) */
let clickIds = "";

if (typeof window !== "undefined") {
  const landing = new URLSearchParams(window.location.search);
  const found = new URLSearchParams();
  for (const key of KEYS) {
    const value = landing.get(key);
    if (value) found.set(key, value);
  }
  clickIds = found.toString();
}

/** `url` with the click IDs added; unchanged without click IDs or when `url` already carries one */
export function withClickIds(url: string, ids: string = clickIds): string {
  if (!ids) return url;
  try {
    const target = new URL(url);
    new URLSearchParams(ids).forEach((value, key) => {
      if (!target.searchParams.has(key)) target.searchParams.set(key, value);
    });
    return target.toString();
  } catch {
    return url;
  }
}

const subscribe = () => () => {};

/**
 * Checkout URL for a link's href. The server renders it without click IDs; after hydration the
 * browser's value takes over, so there is no hydration mismatch.
 */
export function useCheckoutUrl(url: string): string {
  const ids = useSyncExternalStore(
    subscribe,
    () => clickIds,
    () => "",
  );
  return withClickIds(url, ids);
}
