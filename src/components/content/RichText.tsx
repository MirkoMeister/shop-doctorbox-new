import type { Locale } from "@/lib/i18n/config";
import { localePrefix } from "@/lib/i18n/config";
import { normalizeHtml } from "@/lib/content/html-tree";

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
    .replace(/\sdata-mce-[a-z-]+="[^"]*"/g, "")
    .replace(/\sdata-(?:ccp|list|aria|font|leveltext|listid|contrast)[a-z-]*='[^']*'/g, "")
    .replace(/\sdata-(?:ccp|list|aria|font|leveltext|listid|contrast)[a-z-]*="[^"]*"/g, "")
    .replace(/\sstyle="[^"]*"/g, "");
  if (prefix) {
    // keep internal links in the current language
    out = out.replace(/href="\/(products|collections|pages|policies|blogs|blog)(\/|")/g, `href="${prefix}/$1$2`);
  }
  // legacy theme HTML is not always valid: close tags and lift blocks out of <p> so the browser keeps the structure
  return <div className={`prose-db ${className}`} dangerouslySetInnerHTML={{ __html: normalizeHtml(out) }} />;
}
