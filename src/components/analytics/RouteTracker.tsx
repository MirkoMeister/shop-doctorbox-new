"use client";

import { usePublicPathname } from "@/lib/i18n/use-public-pathname";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/tracking/events";
import { shopifyPageView } from "@/lib/tracking/shopify";

/**
 * Meta PageView and Reddit PageVisit on client-side navigation (GTM uses its history trigger);
 * Shopify page view on load and on every navigation (product pages report from TrackViewItem)
 */
export function RouteTracker() {
  const pathname = usePublicPathname();
  const first = useRef(true);
  useEffect(() => {
    shopifyPageView();
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);
  return null;
}
