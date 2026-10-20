"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Transparent header that overlays the top of the page and scrolls away with it
 * (not sticky). Over a dark hero (data-hero="dark") it uses light colours; on other
 * pages it is a plain white bar. Children style themselves via `group-data-[tone=dark]`.
 */
export function HeaderShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [darkHero, setDarkHero] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setDarkHero(Boolean(document.querySelector('[data-hero="dark"]'))));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <header
      data-tone={darkHero ? "dark" : "light"}
      className={`group absolute inset-x-0 top-0 z-50 ${darkHero ? "bg-transparent" : "border-b border-line/60 bg-white"}`}
    >
      {children}
    </header>
  );
}
