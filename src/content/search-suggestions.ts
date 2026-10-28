import type { Locale } from "@/lib/i18n/config";

/** Terms offered before the visitor types: tests first, then supplements. */
export const POPULAR_SEARCHES: Record<Locale, string[]> = {
  de: ["Vitamin D", "Chlamydien", "Testosteron", "Schilddrüse", "Ferritin", "Cortisol", "Blutzucker", "Omega-3", "Kreatin", "Magnesium"],
  en: ["Vitamin D", "Chlamydia", "Testosterone", "Thyroid", "Ferritin", "Cortisol", "Blood sugar", "Omega-3", "Creatine", "Magnesium"],
};

/** Collections shown as topic tiles in the empty search; order matters, max 8 */
export const SEARCH_TOPICS = ["sexuelle-gesundheit", "nahrstoffe-vitamine", "hormone", "herz-kreislauf", "frauengesundheit", "mannergesundheit", "longevity", "nahrungserganzungsmittel"];

export const RECENT_SEARCHES_KEY = "recent-searches";
export const RECENT_SEARCHES_MAX = 6;

export function readRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((x): x is string => typeof x === "string").slice(0, RECENT_SEARCHES_MAX) : [];
  } catch {
    return [];
  }
}

export function rememberSearch(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  try {
    const next = [t, ...readRecentSearches().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, RECENT_SEARCHES_MAX);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable */
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch {
    /* storage unavailable */
  }
}
