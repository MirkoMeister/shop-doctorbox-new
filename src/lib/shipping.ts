/**
 * Delivery country the visitor picked (footer, cart, product page). It decides which Shopify market
 * the cart belongs to, so the checkout opens with that country and its shipping rate. Countries and
 * rates come from Shopify (Markets and Settings → Shipping), see lib/shopify/shipping-rates.ts.
 */
export type ShippingCountry = {
  /** ISO code, e.g. "AT" */
  code: string;
  /** localized name from Shopify, e.g. "Österreich" */
  name: string;
  /** standard rate for one kit; amount "0.0" = free */
  shipping: { amount: string; currencyCode: string };
};

export const DEFAULT_SHIP_COUNTRY = "DE";

/** Not httpOnly: the client reads it on load to show the right country before any cart exists */
export const SHIP_COUNTRY_COOKIE = "db_ship_country";

/** A two-letter country code, or the default. Shopify rejects codes it does not deliver to. */
export function parseShipCountry(value: string | null | undefined): string {
  return value && /^[A-Z]{2}$/.test(value) ? value : DEFAULT_SHIP_COUNTRY;
}

/** Client side: the country from the cookie (DE when none was chosen) */
export function readShipCountryCookie(): string {
  if (typeof document === "undefined") return DEFAULT_SHIP_COUNTRY;
  const match = document.cookie.match(new RegExp(`(?:^|; )${SHIP_COUNTRY_COOKIE}=([^;]*)`));
  return parseShipCountry(match?.[1]);
}
