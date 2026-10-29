"use client";

import { usePathname } from "next/navigation";

/**
 * The URL path as the visitor sees it. German pages are rewritten internally to /de/…,
 * and prerendered pages bake that internal path into usePathname(); public German URLs
 * have no prefix (the proxy redirects /de/… away), so the prefix is dropped here.
 */
export function usePublicPathname(): string {
  const pathname = usePathname() ?? "/";
  return pathname.replace(/^\/de(?=\/|$)/, "") || "/";
}
