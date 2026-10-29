"use client";

import Link from "next/link";
import { usePublicPathname } from "@/lib/i18n/use-public-pathname";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";

/** Toggles between DE and EN while staying on the same page. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePublicPathname();
  const bare = pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const other: Locale = locale === "de" ? "en" : "de";
  return (
    <Link
      href={localeHref(other, bare)}
      hrefLang={other}
      lang={other}
      aria-label={`${label}: ${other === "de" ? "Deutsch" : "English"}`}
      className="inline-flex h-9 items-center rounded-full border border-line px-3 text-sm font-medium uppercase tracking-wide text-ink transition-colors hover:bg-lind group-data-[tone=dark]:border-white/30 group-data-[tone=dark]:text-soft group-data-[tone=dark]:hover:bg-white/10"
    >
      {other}
    </Link>
  );
}
