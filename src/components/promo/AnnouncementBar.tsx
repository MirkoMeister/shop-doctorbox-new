import Link from "next/link";
import { HALLOWEEN, halloweenCopy } from "@/content/halloween";
import { localeHref, type Locale } from "@/lib/i18n/config";

/**
 * Campaign bar above the header: the message runs as a marquee, static when the
 * visitor prefers reduced motion. Rendered only while the campaign is active.
 */
export function AnnouncementBar({ locale }: { locale: Locale }) {
  const t = halloweenCopy(locale);
  const href = localeHref(locale, HALLOWEEN.page);
  const item = (
    <span className="inline-flex items-center gap-3 px-6">
      <span aria-hidden>🎃</span>
      <span>{t.bar}</span>
      <span className="rounded-full bg-okker px-2.5 py-0.5 text-xs font-semibold tracking-[0.08em] text-moss">{HALLOWEEN.code}</span>
      <span className="font-semibold underline underline-offset-4">{t.barCta}</span>
    </span>
  );
  return (
    <Link href={href} className="promo-bar relative z-[60] block h-10 overflow-hidden bg-moss-deep text-sm text-soft hover:text-white" aria-label={`${t.bar}. ${t.barCta}`}>
      <div className="promo-track flex h-full w-max items-center whitespace-nowrap">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i} aria-hidden={i > 0}>
            {item}
          </span>
        ))}
      </div>
    </Link>
  );
}
