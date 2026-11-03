import type { ProductCard } from "@/lib/shopify/types";

/**
 * Re-ranks Shopify's product search. Shopify searches fuzzily and by meaning: for "Chlamydien" it
 * returns the eight STI tests plus 36 unrelated products. Here a product counts as a hit when its own
 * text (title, analysed values, tags and type, target group and sample, description start) contains
 * every search word; hits are ordered by where the words occur, ties keep Shopify's order. When no
 * product contains the words at all (e.g. "erschöpft"), Shopify's own results are kept, shortened.
 */
const WEIGHT = { title: 8, biomarkers: 6, tags: 4, meta: 3, excerpt: 2 };
/** words that say nothing about which test is meant (unless they are the whole query) */
const STOPWORDS = new Set([
  "test", "tests", "heimtest", "heimtests", "check", "fur", "und", "oder", "der", "die", "das", "den", "dem", "des",
  "mit", "von", "zu", "ich", "mein", "meine", "bei", "ein", "eine", "im", "in", "auf",
  "home", "the", "for", "and", "with", "my", "a", "of",
]);
const FALLBACK_COUNT = 12;
/** the whole query inside the title ("Vitamin D" in "Vitamin D Test"); single letters are no search words */
const PHRASE_BONUS = 10;
/**
 * Everyday words for what the catalogue names by its values (normalised: lower case, no umlauts).
 * A search word also counts as found where one of its synonyms occurs. Editorial, extend freely.
 */
const SYNONYMS: Record<string, string[]> = {
  eisen: ["ferritin", "hamoglobin", "transferrin"],
  eisenmangel: ["ferritin", "hamoglobin"],
  schilddruse: ["tsh", "ft3", "ft4"],
  cholesterin: ["ldl", "hdl", "lipid", "triglyceride"],
  blutfette: ["ldl", "hdl", "lipid", "triglyceride"],
  zucker: ["hba1c", "blutzucker", "glukose"],
  diabetes: ["hba1c", "blutzucker"],
  tripper: ["gonorrho"],
  kinderwunsch: ["fruchtbarkeit", "amh"],
  fruchtbarkeit: ["amh"],
  prostata: ["psa"],
  stress: ["cortisol", "burnout"],
  wechseljahre: ["ostradiol", "fsh", "hormon"],
  entzundung: ["crp"],
  niere: ["kreatinin", "uacr", "nieren"],
  leber: ["gamma", "gpt", "got"],
  // English shop
  iron: ["ferritin", "haemoglobin", "hemoglobin", "transferrin"],
  thyroid: ["tsh", "ft3", "ft4"],
  cholesterol: ["ldl", "hdl", "lipid", "triglyceride"],
  sugar: ["hba1c", "glucose"],
  fertility: ["amh"],
  menopause: ["oestradiol", "estradiol", "fsh", "hormone"],
  inflammation: ["crp"],
  kidney: ["creatinine", "uacr"],
  liver: ["gamma", "gpt", "got"],
};

const normalize = (s: string) => s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const words = (s: string) => normalize(s).split(/[^a-z0-9]+/).filter(Boolean);

/**
 * Tolerates German endings ("Chlamydie" / "Chlamydien", "müde" / "Müdigkeit") and, for longer words,
 * compounds ("vorsorge" in "Darmkrebsvorsorge"). Short words (HIV, PSA, B12) must start a word.
 */
function matches(token: string, fieldWords: string[]): boolean {
  const stem = token.length >= 6 ? token.slice(0, -2) : token.length >= 4 ? token.slice(0, -1) : token;
  return fieldWords.some((w) => (token.length >= 5 ? w.includes(stem) : w.startsWith(stem)));
}

export function rankSearchResults<T extends ProductCard>(query: string, products: T[]): T[] {
  const phrase = words(query).join(" ");
  const all = words(query).filter((t) => t.length >= 2);
  const meaningful = all.filter((t) => !STOPWORDS.has(t));
  const tokens = meaningful.length ? meaningful : all;
  if (!tokens.length) return products;

  const scored = products.map((p, index) => {
    const fields: [number, string[]][] = [
      [WEIGHT.title, words(p.title)],
      [WEIGHT.biomarkers, p.biomarkers.flatMap(words)],
      [WEIGHT.tags, [...p.tags, p.productType].flatMap(words)],
      [WEIGHT.meta, words(`${p.targetGroup ?? ""} ${p.sampleMaterial ?? ""}`)],
      [WEIGHT.excerpt, words(p.excerpt ?? "")],
    ];
    let score = 0;
    let found = 0;
    for (const t of tokens) {
      const variants = [t, ...(SYNONYMS[t] ?? [])];
      const best = Math.max(0, ...fields.filter(([, ws]) => variants.some((v) => matches(v, ws))).map(([w]) => w));
      if (best) {
        found++;
        score += best;
      }
    }
    if (phrase.includes(" ") && ` ${words(p.title).join(" ")} `.includes(` ${phrase}`)) score += PHRASE_BONUS;
    return { p, index, score, found };
  });

  const complete = scored.filter((s) => s.found === tokens.length);
  const partial = scored.filter((s) => s.found > 0);
  const hits = complete.length ? complete : partial;
  if (!hits.length) return products.slice(0, FALLBACK_COUNT);
  return hits.sort((a, b) => b.score - a.score || a.index - b.index).map((s) => s.p);
}
