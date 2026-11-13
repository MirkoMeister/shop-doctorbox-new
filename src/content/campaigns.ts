import { BLACKFRIDAY, blackFridayActive, blackFridayCopy, blackFridayHandles } from "@/content/blackfriday";
import { HALLOWEEN, halloweenActive, halloweenCopy } from "@/content/halloween";
import { MOVEMBER, movemberActive, movemberCopy, movemberHandles } from "@/content/movember";
import type { Locale } from "@/lib/i18n/config";

/** What the announcement bar and the cart need from whichever campaign runs now. `handles`: the products the code applies to (none: every test). */
export type ActiveCampaign = { key: string; code: string; percent: number; page: string; bar: string; barCta: string; emoji: string; until: string; handles?: string[] };

export function activeCampaign(locale: Locale, now = new Date()): ActiveCampaign | null {
  if (halloweenActive(now)) {
    const t = halloweenCopy(locale);
    return { key: "halloween", code: HALLOWEEN.code, percent: HALLOWEEN.percent, page: HALLOWEEN.page, bar: t.bar, barCta: t.barCta, emoji: "🎃", until: locale === "en" ? "31 October" : "31. Oktober" };
  }
  // Black Friday wins the bar over Movember (27 to 30 November); the Movember page and code keep running
  if (blackFridayActive(now)) {
    const t = blackFridayCopy(locale);
    return { key: "blackfriday", code: BLACKFRIDAY.code, percent: BLACKFRIDAY.percent, page: BLACKFRIDAY.page, bar: t.bar, barCta: t.barCta, emoji: "🖤", until: locale === "en" ? "30 November" : "30. November", handles: blackFridayHandles };
  }
  if (movemberActive(now)) {
    const t = movemberCopy(locale);
    return { key: "movember", code: MOVEMBER.code, percent: MOVEMBER.percent, page: MOVEMBER.page, bar: t.bar, barCta: t.barCta, emoji: "👨🏻", until: locale === "en" ? "30 November" : "30. November", handles: movemberHandles };
  }
  return null;
}
