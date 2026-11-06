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
  updateCartLines,
  type CartLineInput,
} from "@/lib/shopify/queries";
import type { Cart } from "@/lib/shopify/types";
import { CART_COOKIE, DISCOUNT_COOKIE } from "@/lib/cart/discount-link";

const COOKIE = CART_COOKIE;
const ONE_WEEK = 60 * 60 * 24 * 7;

async function readCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE)?.value;
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
async function withLinkDiscount(cart: Cart, locale: Locale, ip: string | null): Promise<Cart> {
  const code = (await cookies()).get(DISCOUNT_COOKIE)?.value;
  if (!code) return cart;
  return updateCartDiscountCodes(cart.id, [code], locale, ip).catch(() => cart);
}

export async function getCart(locale: Locale): Promise<Cart | null> {
  const id = await readCartId();
  if (!id) return null;
  try {
    return await fetchCart(id, locale, await buyerIp());
  } catch {
    return null;
  }
}

export type CartActionResult = { cart: Cart | null; error?: string };

export async function addToCart(line: CartLineInput, locale: Locale): Promise<CartActionResult> {
  try {
    const id = await readCartId();
    const ip = await buyerIp();
    let cart: Cart;
    if (id) {
      try {
        cart = await addCartLines(id, [line], locale, ip);
      } catch (addError) {
        // Only a cart that no longer exists (expired or checked out) is replaced. Any other failure
        // (sold out, quantity, network) keeps the existing cart and reports the error, so the lines
        // already in it are not lost. If the check itself fails, nothing is replaced either.
        const existing = await fetchCart(id, locale, ip);
        if (existing) throw addError;
        cart = await withLinkDiscount(await createCart([line], locale, ip), locale, ip);
        await writeCartId(cart.id);
      }
    } else {
      cart = await withLinkDiscount(await createCart([line], locale, ip), locale, ip);
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
  try {
    const cart =
      quantity <= 0 ? await removeCartLines(id, [lineId], locale, ip) : await updateCartLines(id, [{ id: lineId, quantity }], locale, ip);
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
    const cart = await updateCartDiscountCodes(id, code ? [code.trim().toUpperCase()] : [], locale, ip);
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
