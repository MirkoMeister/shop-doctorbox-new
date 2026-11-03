import type { Locale } from "@/lib/i18n/config";
import type { Money, Product } from "@/lib/shopify/types";

/**
 * One-click add-on in the cart drawer, offered once something is in the cart and the product isn't.
 * Change the handle or the copy freely; without an available variant the offer is simply not shown.
 * Lines added from here carry the hidden attribute below, so orders show how often it sells.
 */
export const CART_UPSELL_HANDLE = "vitamin-d-test";
/**
 * Must match the automatic Shopify discount "VITAMIND WINTER" (buy any product, get the test 20 % off);
 * the card shows the price the cart will have. 0 = no offer price, show the normal price.
 */
export const UPSELL_PERCENT_OFF = 20;
export const UPSELL_LINE_ATTRIBUTE = { key: "_upsell", value: "warenkorb" };

const copy: Record<Locale, { kicker: string; text: string; add: string; added: string; instead: string }> = {
  de: {
    kicker: UPSELL_PERCENT_OFF ? `Noch dazu? Mit deinem Einkauf ${UPSELL_PERCENT_OFF} % günstiger` : "Noch dazu?",
    text: "Gerade in der dunklen Jahreszeit lohnt ein Blick auf den Vitamin-D-Wert. Ein paar Tropfen Blut, Befund in der App.",
    add: "Hinzufügen",
    added: "Hinzugefügt",
    instead: "statt",
  },
  en: {
    kicker: UPSELL_PERCENT_OFF ? `Add this? ${UPSELL_PERCENT_OFF}% off with your order` : "Add this?",
    text: "In the darker months it is worth checking your vitamin D level. A few drops of blood, result in the app.",
    add: "Add",
    added: "Added",
    instead: "instead of",
  },
};

export type CartUpsell = {
  handle: string;
  title: string;
  variantId: string;
  price: Money;
  /** price with the add-on discount (null without one) */
  offerPrice: Money | null;
  image: string | null;
  kicker: string;
  text: string;
  add: string;
  added: string;
  instead: string;
};

export function cartUpsell(product: Product | null, locale: Locale): CartUpsell | null {
  const variant = product?.variants.filter((v) => v.availableForSale).sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0];
  if (!product || !variant) return null;
  return {
    handle: product.handle,
    title: product.title,
    variantId: variant.id,
    price: variant.price,
    // Shopify rounds the discount down to the cent: 20 % of 29,99 € = 5,99 € off → 24,00 €
    offerPrice: UPSELL_PERCENT_OFF
      ? { ...variant.price, amount: ((Math.round(Number(variant.price.amount) * 100) - Math.floor(Number(variant.price.amount) * UPSELL_PERCENT_OFF)) / 100).toFixed(2) }
      : null,
    image: product.featuredImage?.url ?? null,
    ...copy[locale],
  };
}
