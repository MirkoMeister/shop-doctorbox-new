import "server-only";
import { VALUES } from "@/content/biomarkers.data";
import type { Locale } from "@/lib/i18n/config";
import { sampleMaterials } from "@/lib/shopify/reshape";
import { getAllProducts, getNavCollections } from "@/lib/shopify/queries";
import type { ProductCard } from "@/lib/shopify/types";

/**
 * Knowledge the assistant reasons over. It is rendered into the (cached) system
 * prompt, so the model knows every test without a retrieval step.
 */
export type Knowledge = { text: string; products: ProductCard[] };

const money = (amount: string) => `${Number(amount).toFixed(2).replace(".", ",")} €`;

export async function buildKnowledge(locale: Locale): Promise<Knowledge> {
  const [products, collections] = await Promise.all([getAllProducts(locale), getNavCollections(locale).catch(() => [])]);
  const lines: string[] = [];

  lines.push(locale === "en" ? "## Product catalogue (all active tests)" : "## Produktkatalog (alle aktiven Tests)");
  lines.push(
    locale === "en"
      ? "Format: handle | title | price | sample material | subscription? | collections | target group | analysed values | blood collection"
      : "Format: handle | Titel | Preis | Probenmaterial | Abo? | Kategorien | Zielgruppe | analysierte Werte | Blutabnahme",
  );
  for (const p of products) {
    const price = money(p.priceRange.minVariantPrice.amount);
    const samples = sampleMaterials(p.sampleMaterial).join(" / ") || "–";
    const sub = p.hasSubscription ? (locale === "en" ? "yes (-20%)" : "ja (-20 %)") : locale === "en" ? "no" : "nein";
    lines.push(
      `${p.handle} | ${p.title} | ${price}${p.availableForSale ? "" : locale === "en" ? " (currently unavailable)" : " (derzeit nicht verfügbar)"} | ${samples} | ${sub} | ${p.productType || "–"} | ${p.targetGroup ?? "–"} | ${p.biomarkers.join(", ") || "–"} | ${p.tasso ? (locale === "en" ? "Tasso+ upper arm available (preselected)" : "Tasso+ Oberarm wählbar (vorausgewählt)") : "–"}`,
    );
  }

  lines.push("");
  lines.push(locale === "en" ? "## Categories" : "## Kategorien");
  for (const c of collections) lines.push(`${c.handle} | ${c.title}`);

  lines.push("");
  lines.push(locale === "en" ? "## Analysed values (short reference)" : "## Analysierte Werte (Kurzreferenz)");
  for (const [key, e] of Object.entries(VALUES)) {
    const f = e[locale];
    const name = e.title?.[locale] ?? key;
    lines.push(`${name}: ${f.what} ${locale === "en" ? "Relevant for:" : "Sinnvoll für:"} ${f.why}`);
  }

  return { text: lines.join("\n"), products };
}
