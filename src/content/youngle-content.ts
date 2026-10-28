import data from "@/content/youngle-content.json";
import type { Locale } from "@/lib/i18n/config";

/**
 * Below-the-fold content of the Youngle product pages. Structure and doses come
 * from youngle.com (original texts: docs/youngle-content-original.json), the
 * wording was rewritten to authorised EU health claims and neutral facts
 * (docs/youngle-health-claims.md). The intake timeline is the same for all.
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

/**
 * Products that show the sections. Content exists for all 21 Youngle handles
 * (keys of the JSON); add handles here to roll it out, or set to null for all.
 */
export const YOUNGLE_CONTENT_ENABLED: string[] | null = null;

export function youngleContent(handle: string, locale: Locale): YoungleContent | null {
  if (YOUNGLE_CONTENT_ENABLED && !YOUNGLE_CONTENT_ENABLED.includes(handle)) return null;
  return byLocale[locale === "en" ? "en" : "de"]?.[handle] ?? byLocale.de[handle] ?? null;
}
