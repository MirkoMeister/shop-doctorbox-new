/**
 * Shopify-style discount links (/discount/CODE?redirect=/products/x): the code is kept in a cookie
 * and applied to the visitor's cart, right away when a cart exists, otherwise when the first one is created.
 */
export const CART_COOKIE = "dbx_cart";
export const DISCOUNT_COOKIE = "dbx_discount";
export const DISCOUNT_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

/** letters, digits, "-" and "_" as Shopify allows them in links; anything else is ignored */
export const isLinkCode = (code: string) => /^[\p{L}\p{N}_-]{1,64}$/u.test(code);

/** only paths on this site, never another host ("//evil.example", "/\\evil") */
export function safeRedirect(target: string | null, fallback: string): string {
  if (!target || !target.startsWith("/") || target.startsWith("//") || target.includes("\\")) return fallback;
  return target;
}
