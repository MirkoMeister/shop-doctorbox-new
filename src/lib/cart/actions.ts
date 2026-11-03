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

const COOKIE = "dbx_cart";
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
      } catch {
        // stale/expired cart → start a new one
        cart = await createCart([line], locale, ip);
        await writeCartId(cart.id);
      }
    } else {
      cart = await createCart([line], locale, ip);
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
  try {
    const cart = await updateCartDiscountCodes(id, code ? [code.trim().toUpperCase()] : [], locale, ip);
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
