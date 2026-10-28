import type { Money } from "@/lib/shopify/types";

export type UnitPrice = { price: Money; unit: "capsule" | "tablet" | "piece" | "per100"; measure?: string };

/**
 * Price per capsule/tablet or per 100 g/ml, derived from the variant name
 * ("30 Kapseln", "300 g"). Shopify's own unitPrice stays empty as long as no
 * Grundpreis measurement is maintained in the admin, so this is the fallback.
 */
export function unitPriceOf(variantTitle: string, price: Money): UnitPrice | null {
  const amount = parseFloat(price.amount);
  if (!amount) return null;
  const pieces = variantTitle.match(/(\d+)\s*(kapseln?|capsules?|tabletten?|tablets?|stück|pcs?)\b/i);
  if (pieces) {
    const n = Number(pieces[1]);
    if (!n) return null;
    const kind = pieces[2].toLowerCase();
    const unit = kind.startsWith("kap") || kind.startsWith("cap") ? "capsule" : kind.startsWith("tab") ? "tablet" : "piece";
    return { price: { amount: (amount / n).toFixed(2), currencyCode: price.currencyCode }, unit };
  }
  const mass = variantTitle.match(/(\d+(?:[.,]\d+)?)\s*(g|ml)\b/i);
  if (mass) {
    const n = parseFloat(mass[1].replace(",", "."));
    if (!n) return null;
    return { price: { amount: ((amount / n) * 100).toFixed(2), currencyCode: price.currencyCode }, unit: "per100", measure: mass[2].toLowerCase() };
  }
  return null;
}
