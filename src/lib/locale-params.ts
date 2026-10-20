import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";

/** Resolves and validates the [locale] segment for a page. */
export async function resolveLocale<T extends { locale: string }>(
  params: Promise<T>,
): Promise<{ locale: Locale; dict: Dictionary; params: T }> {
  const p = await params;
  if (!isLocale(p.locale)) notFound();
  return { locale: p.locale, dict: getDictionary(p.locale), params: p };
}
