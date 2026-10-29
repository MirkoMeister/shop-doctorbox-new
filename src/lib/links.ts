import { legacyTarget } from "@/lib/legacy-urls";

/** External DoctorBox destinations used across the shop */
export const REGISTER_TEST_URL = "https://app.doctorbox.de";
export const APP_STORE_URL = "https://apps.apple.com/de/app/doctorbox/id1448720473";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=eu.doctorbox.mobile.android.doctorbox";

/** Social profiles (from the old shop and doctorbox.de) */
export const SOCIAL_LINKS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/doctorbox.de" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/doctorbox/" },
  { label: "Facebook", href: "https://www.facebook.com/doctorbox.de" },
];

/**
 * Internal links in Shopify content carry campaign parameters (utm_source=ratgeber …).
 * GA4 would start a new session with that source on every click and drop the real one,
 * so they are removed from relative links. Works on raw and HTML-escaped (&amp;) hrefs.
 */
export function stripCampaignParams(href: string): string {
  if (!href.startsWith("/") || !/[?&;]utm_/i.test(href)) return href;
  const hashAt = href.indexOf("#");
  const hash = hashAt >= 0 ? href.slice(hashAt) : "";
  const [path, query = ""] = (hashAt >= 0 ? href.slice(0, hashAt) : href).split("?");
  const sep = query.includes("&amp;") ? "&amp;" : "&";
  const kept = query.split(/&amp;|&/).filter((p) => p && !/^utm_/i.test(p));
  return `${path}${kept.length ? `?${kept.join(sep)}` : ""}${hash}`;
}

/**
 * Repairs hrefs that editors pasted wrongly: "www.doctorbox.de" without scheme, or a whole
 * <a href="…"> snippet pasted into the href field (image credits). Other hrefs stay as they are.
 */
export function repairHref(href: string): string {
  const h = href.trim();
  if (/^(https?:|\/|#|mailto:|tel:)/i.test(h)) return h;
  if (/^www\./i.test(h)) return `https://${h}`;
  return h.match(/https?:\/\/[^\s"'<>#%&]+/i)?.[0] ?? h;
}

/** Every link in Shopify content: repaired, without campaign parameters, dead legacy targets replaced */
export function cleanContentHref(href: string): string {
  const h = stripCampaignParams(repairHref(href));
  if (!h.startsWith("/")) return h;
  const cut = h.search(/[?#]/);
  const path = cut >= 0 ? h.slice(0, cut) : h;
  const target = legacyTarget(path);
  return target ? `${target}${cut >= 0 ? h.slice(cut) : ""}` : h;
}
