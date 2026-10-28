"use server";

import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n/config";
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
    return await fetchCart(id, locale);
  } catch {
    return null;
  }
}

export type CartActionResult = { cart: Cart | null; error?: string };

export async function addToCart(line: CartLineInput, locale: Locale): Promise<CartActionResult> {
  try {
    const id = await readCartId();
    let cart: Cart;
    if (id) {
      try {
        cart = await addCartLines(id, [line], locale);
      } catch {
        // stale/expired cart → start a new one
        cart = await createCart([line], locale);
        await writeCartId(cart.id);
      }
    } else {
      cart = await createCart([line], locale);
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
  try {
    const cart =
      quantity <= 0 ? await removeCartLines(id, [lineId], locale) : await updateCartLines(id, [{ id: lineId, quantity }], locale);
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
  try {
    const cart = await updateCartDiscountCodes(id, code ? [code.trim().toUpperCase()] : [], locale);
    return { cart };
  } catch (e) {
    return { cart: null, error: e instanceof Error ? e.message : "Unknown error" };
  }
}
