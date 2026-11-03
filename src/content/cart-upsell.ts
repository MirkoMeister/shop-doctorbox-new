import type { Locale } from "@/lib/i18n/config";
import type { Money, Product } from "@/lib/shopify/types";

/**
 * One-click add-on in the cart drawer, offered once something is in the cart and the product isn't.
 * Change the handle or the copy freely; without an available variant the offer is simply not shown.
 * Lines added from here carry the hidden attribute below, so orders show how often it sells.
 */
export const CART_UPSELL_HANDLE = "vitamin-d-test";
export const UPSELL_LINE_ATTRIBUTE = { key: "_upsell", value: "warenkorb" };

const copy: Record<Locale, { kicker: string; text: string; add: string; added: string }> = {
  de: {
    kicker: "Noch dazu?",
    text: "Gerade in der dunklen Jahreszeit lohnt ein Blick auf den Vitamin-D-Wert. Ein paar Tropfen Blut, Befund in der App.",
    add: "Hinzufügen",
    added: "Hinzugefügt",
  },
  en: {
    kicker: "Add this?",
    text: "In the darker months it is worth checking your vitamin D level. A few drops of blood, result in the app.",
    add: "Add",
    added: "Added",
  },
};

export type CartUpsell = {
  handle: string;
  title: string;
  variantId: string;
  price: Money;
  image: string | null;
  kicker: string;
  text: string;
  add: string;
  added: string;
};

export function cartUpsell(product: Product | null, locale: Locale): CartUpsell | null {
  const variant = product?.variants.filter((v) => v.availableForSale).sort((a, b) => Number(a.price.amount) - Number(b.price.amount))[0];
  if (!product || !variant) return null;
  return {
    handle: product.handle,
    title: product.title,
    variantId: variant.id,
    price: variant.price,
    image: product.featuredImage?.url ?? null,
    ...copy[locale],
  };
}
