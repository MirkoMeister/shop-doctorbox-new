export const locales = ["de", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Shopify language code for @inContext */
export function shopifyLanguage(locale: Locale): "DE" | "EN" {
  return locale === "en" ? "EN" : "DE";
}

/** Public URL prefix: German has none, English lives under /en */
export function localePrefix(locale: Locale): string {
  return locale === defaultLocale ? "" : `/${locale}`;
}

/** Build a public href for a path inside a locale. `path` must start with "/". */
export function localeHref(locale: Locale, path: string): string {
  const p = path === "/" ? "" : path;
  const href = `${localePrefix(locale)}${p}`;
  return href === "" ? "/" : href;
}

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://shop.doctorbox.de";

export function absoluteUrl(locale: Locale, path: string): string {
  return `${siteUrl}${localeHref(locale, path)}`;
}

/** hreflang alternates mirroring the old Shopify setup */
export function alternates(path: string) {
  const de = absoluteUrl("de", path);
  const en = absoluteUrl("en", path);
  const euPath = path === "/" ? "" : path;
  return {
    canonical: undefined as string | undefined,
    languages: {
      "x-default": de,
      de,
      en,
      "de-AT": de,
      "en-AT": en,
      "en-CH": `https://shop.doctorbox.eu${euPath}`,
      "fr-CH": `https://shop.doctorbox.eu/fr${euPath}`,
      "en-DK": `https://shop.doctorbox.eu${euPath}`,
      "fr-DK": `https://shop.doctorbox.eu/fr${euPath}`,
    },
  };
}
