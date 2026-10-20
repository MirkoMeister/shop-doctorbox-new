import type { Locale } from "@/lib/i18n/config";
import type { Money } from "@/lib/shopify/types";

export function formatMoney(money: Money | { amount: string | number; currencyCode?: string }, locale: Locale): string {
  const amount = typeof money.amount === "string" ? parseFloat(money.amount) : money.amount;
  return new Intl.NumberFormat(locale === "en" ? "en-DE" : "de-DE", {
    style: "currency",
    currency: money.currencyCode ?? "EUR",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function percentOff(price: Money, compareAt: Money | null | undefined): number | null {
  if (!compareAt) return null;
  const p = parseFloat(price.amount);
  const c = parseFloat(compareAt.amount);
  if (!c || c <= p) return null;
  return Math.round(((c - p) / c) * 100);
}

/** Shopify CDN image resize helper (keeps the version query) */
export function shopifyImage(url: string, width: number): string {
  try {
    const u = new URL(url);
    u.searchParams.set("width", String(width));
    return u.toString();
  } catch {
    return url;
  }
}

export function stripHtml(html: string): string {
  return html
    .replace(/<(style|script|noscript|template)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}
