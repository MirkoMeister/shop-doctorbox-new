"use client";

import { usePublicPathname } from "@/lib/i18n/use-public-pathname";
import { useEffect, useRef } from "react";
import { trackPageView } from "@/lib/tracking/events";

/** Meta PageView and Reddit PageVisit on client-side navigation (GTM uses its history trigger) */
export function RouteTracker() {
  const pathname = usePublicPathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);
  return null;
}
