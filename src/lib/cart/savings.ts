import type { Cart, CartLine } from "@/lib/shopify/types";

/** Price of a line before product discounts (codes like MOVEMBER26, automatic ones like VITAMIND WINTER) */
export const lineOriginal = (line: CartLine) => Number(line.cost.subtotalAmount.amount);

/**
 * Everything discounts take off the cart: product discounts sit on the lines (line subtotal − total),
 * order discounts between cart subtotal and total.
 */
export function cartSavings(cart: Cart): number {
  const onLines = cart.lines.reduce((s, l) => s + Math.max(0, lineOriginal(l) - Number(l.cost.totalAmount.amount)), 0);
  const onOrder = Math.max(0, Number(cart.cost.subtotalAmount.amount) - Number(cart.cost.totalAmount.amount));
  return Math.round((onLines + onOrder) * 100) / 100;
}

/** the code Shopify accepted, if any */
export const activeCode = (cart: Cart) => cart.discountCodes.find((d) => d.applicable)?.code ?? null;
