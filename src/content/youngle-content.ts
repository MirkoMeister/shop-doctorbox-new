import data from "@/content/youngle-content.json";
import type { Locale } from "@/lib/i18n/config";

/**
 * Editorial content from the Youngle product pages (youngle.com), extracted on
 * 28.10.2026 with the script in docs/youngle-weiterfuehrende-inhalte.csv as the
 * readable copy. Shown on the Youngle product pages below the fold.
 */
export type YoungleBenefit = { title: string; text: string };
export type YounglePhase = { label: string; text: string };
export type YoungleActive = { name: string; dose: string; claim: string };
export type YoungleContent = {
  benefits: YoungleBenefit[];
  expect: { lead: string; phases: YounglePhase[] };
  science: { title: string; intro: string; actives: YoungleActive[] } | null;
};

const byLocale = data as Record<"de" | "en", Record<string, YoungleContent>>;

export function youngleContent(handle: string, locale: Locale): YoungleContent | null {
  return byLocale[locale === "en" ? "en" : "de"]?.[handle] ?? byLocale.de[handle] ?? null;
}
