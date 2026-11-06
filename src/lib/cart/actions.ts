"use server";

import { cookies, headers } from "next/headers";
import type { Locale } from "@/lib/i18n/config";
import { clientIp, rateLimiter } from "@/lib/rate-limit";
import {
  addCartLines,
  createCart,
  fetchCart,
  removeCartLines,
  updateCartDiscountCodes,
  updateCartCountry,
  updateCartLines,
  type CartLineInput,
} from "@/lib/shopify/queries";
import { DEFAULT_SHIP_COUNTRY, parseShipCountry, SHIP_COUNTRY_COOKIE } from "@/lib/shipping";
import { getShippingCountries } from "@/lib/shopify/shipping-rates";
import type { Cart } from "@/lib/shopify/types";
import { CART_COOKIE, DISCOUNT_COOKIE } from "@/lib/cart/discount-link";

const COOKIE = CART_COOKIE;
const ONE_WEEK = 60 * 60 * 24 * 7;

async function readCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE)?.value;
}

/** Delivery country picked in the shop (DE when none) */
async function readCountry(): Promise<string> {
  return deliverable(parseShipCountry((await cookies()).get(SHIP_COUNTRY_COOKIE)?.value), "de");
}

/** Only countries Shopify delivers to; anything else falls back to Germany */
async function deliverable(code: string, locale: Locale): Promise<string> {
  const list = await getShippingCountries(locale).catch(() => []);
  return list.some((c) => c.code === code) ? code : DEFAULT_SHIP_COUNTRY;
}

/** Passed to Shopify so its bot protection sees the visitor, not this server */
async function buyerIp(): Promise<string | null> {
  return clientIp(await headers());
}

/** Discount codes can be guessed through the cart: a person needs a handful of tries, a script thousands */
const discountLimited = rateLimiter({ windowMs: 10 * 60 * 1000, perKey: 10 });

async function writeCartId(id: string) {
  const store = await cookies();
  store.set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

/** A new cart picks up the code from a discount link (/discount/CODE) the visitor opened before */
async function withLinkDiscount(cart: Cart, locale: Locale, ip: string | null, country: string): Promise<Cart> {
  const code = (await cookies()).get(DISCOUNT_COOKIE)?.value;
  if (!code) return cart;
  return updateCartDiscountCodes(cart.id, [code], locale, ip, country).catch(() => cart);
}

export async function getCart(locale: Locale): Promise<Cart | null> {
  const id = await readCartId();
  if (!id) return null;
  try {
    return await fetchCart(id, locale, await buyerIp(), await readCountry());
  } catch {
    return null;
  }
}

export type CartActionResult = { cart: Cart | null; error?: string };

export async function addToCart(line: CartLineInput, locale: Locale): Promise<CartActionResult> {
  try {
    const id = await readCartId();
    const ip = await buyerIp();
    const country = await readCountry();
    let cart: Cart;
    if (id) {
      try {
        cart = await addCartLines(id, [line], locale, ip, country);
      } catch (addError) {
        // Only a cart that no longer exists (expired or checked out) is replaced. Any other failure
        // (sold out, quantity, network) keeps the existing cart and reports the error, so the lines
        // already in it are not lost. If the check itself fails, nothing is replaced either.
        const existing = await fetchCart(id, locale, ip, country);
        if (existing) throw addError;
        cart = await withLinkDiscount(await createCart([line], locale, ip, country), locale, ip, country);
        await writeCartId(cart.id);
      }
    } else {
      cart = await withLinkDiscount(await createCart([line], locale, ip, country), locale, ip, country);
      await writeCartId(cart.id);
    }
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function updateLine(lineId: string, quantity: number, locale: Locale): Promise<CartActionResult> {
  const id = await readCartId();
  if (!id) return { cart: null };
  const ip = await buyerIp();
  const country = await readCountry();
  try {
    const cart =
      quantity <= 0
        ? await removeCartLines(id, [lineId], locale, ip, country)
        : await updateCartLines(id, [{ id: lineId, quantity }], locale, ip, country);
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

export async function removeLine(lineId: string, locale: Locale): Promise<CartActionResult> {
  return updateLine(lineId, 0, locale);
}

/** Applies one discount code (or none) to the cart. */
export async function setDiscountCode(code: string | null, locale: Locale): Promise<CartActionResult> {
  const id = await readCartId();
  if (!id) return { cart: null };
  const ip = await buyerIp();
  // over the limit the code counts as not applicable; removing a code is never limited
  if (code && discountLimited(ip ?? "local")) return { cart: null };
  // a code removed (or replaced) by hand must not come back from an earlier discount link
  (await cookies()).delete(DISCOUNT_COOKIE);
  try {
    const cart = await updateCartDiscountCodes(id, code ? [code.trim().toUpperCase()] : [], locale, ip, await readCountry());
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

/**
 * Remembers the delivery country and moves an existing cart to that market, so the checkout opens
 * with the country and its shipping rate preselected. The cookie is only set by this explicit choice.
 */
export async function setShipCountry(value: string, locale: Locale): Promise<CartActionResult & { country: string }> {
  const country = await deliverable(parseShipCountry(value), locale);
  const store = await cookies();
  store.set(SHIP_COUNTRY_COOKIE, country, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  const id = await readCartId();
  if (!id) return { cart: null, country };
  try {
    return { cart: await updateCartCountry(id, locale, await buyerIp(), country), country };
  } catch (e) {
    return { cart: null, country, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
