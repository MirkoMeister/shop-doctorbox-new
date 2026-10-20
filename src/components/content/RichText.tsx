import type { Locale } from "@/lib/i18n/config";
import { localePrefix } from "@/lib/i18n/config";
import { GUIDE_INDEX_PAGES, isGuidePage } from "@/lib/content/guides";

/**
 * Renders Shopify-authored HTML (descriptions, pages, articles, policies).
 * Rewrites absolute links to the old shop into relative ones so the
 * visitor stays inside the new storefront and the locale prefix is kept.
 */
export function RichText({ html, locale, className = "" }: { html: string; locale: Locale; className?: string }) {
  const prefix = localePrefix(locale);
  let out = html
    // CDN assets stay absolute (the old theme served them from shop.doctorbox.de/cdn/)
    .replace(/https?:\/\/shop\.doctorbox\.de\/cdn\//g, "__DBX_CDN__/")
    .replace(/https?:\/\/shop\.doctorbox\.de\/en(\/|")/g, "/en$1")
    .replace(/https?:\/\/shop\.doctorbox\.de\//g, "/")
    .replace(/__DBX_CDN__\//g, "https://shop.doctorbox.de/cdn/")
    .replace(/href="(\/en)?\/blogs\/[^/"]+\/([^/"?#]+)[^"]*"/g, 'href="$1/blog/$2"')
    .replace(/href="(\/en)?\/blogs\/[^/"]+\/?"/g, 'href="$1/blog"')
    .replace(/href="(\/en)?\/pages\/([^/"?#]+)[^"]*"/g, (m, en, handle) => (isGuidePage(handle) || GUIDE_INDEX_PAGES.has(handle) ? `href="${en ?? ""}/ratgeber${GUIDE_INDEX_PAGES.has(handle) ? "" : `/${handle}`}"` : m))
    .replace(/\sdata-mce-[a-z-]+="[^"]*"/g, "")
    .replace(/\sdata-(?:ccp|list|aria|font|leveltext|listid|contrast)[a-z-]*='[^']*'/g, "")
    .replace(/\sdata-(?:ccp|list|aria|font|leveltext|listid|contrast)[a-z-]*="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "");
  if (prefix) {
    // keep internal links in the current language
    out = out.replace(/href="\/(products|collections|pages|policies|ratgeber|blog)(\/|")/g, `href="${prefix}/$1$2`);
  }
  return <div className={`prose-db ${className}`} dangerouslySetInnerHTML={{ __html: out }} />;
}
