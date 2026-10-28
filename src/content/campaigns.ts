import { HALLOWEEN, halloweenActive, halloweenCopy } from "@/content/halloween";
import { MOVEMBER, movemberActive, movemberCopy } from "@/content/movember";
import type { Locale } from "@/lib/i18n/config";

/** What the announcement bar and the cart need from whichever campaign runs now. */
export type ActiveCampaign = { key: string; code: string; percent: number; page: string; bar: string; barCta: string; emoji: string; until: string };

export function activeCampaign(locale: Locale, now = new Date()): ActiveCampaign | null {
  if (halloweenActive(now)) {
    const t = halloweenCopy(locale);
    return { key: "halloween", code: HALLOWEEN.code, percent: HALLOWEEN.percent, page: HALLOWEEN.page, bar: t.bar, barCta: t.barCta, emoji: "🎃", until: locale === "en" ? "31 October" : "31. Oktober" };
  }
  if (movemberActive(now)) {
    const t = movemberCopy(locale);
    return { key: "movember", code: MOVEMBER.code, percent: MOVEMBER.percent, page: MOVEMBER.page, bar: t.bar, barCta: t.barCta, emoji: "👨🏻", until: locale === "en" ? "30 November" : "30. November" };
  }
  return null;
}
