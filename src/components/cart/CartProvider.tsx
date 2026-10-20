"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n/config";
import { addToCart, getCart, removeLine, updateLine } from "@/lib/cart/actions";
import type { Cart } from "@/lib/shopify/types";
import type { CartLineInput } from "@/lib/shopify/queries";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  pending: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: CartLineInput) => Promise<boolean>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  error: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let alive = true;
    getCart(locale)
      .then((c) => alive && setCart(c))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [locale]);

  const add = useCallback(
    (line: CartLineInput) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          setError(null);
          const res = await addToCart(line, locale);
          if (res.cart) {
            setCart(res.cart);
            setOpen(true);
            resolve(true);
          } else {
            setError(res.error ?? "error");
            resolve(false);
          }
        });
      }),
    [locale],
  );

  const update = useCallback(
    (lineId: string, quantity: number) =>
      new Promise<void>((resolve) => {
        startTransition(async () => {
          const res = await updateLine(lineId, quantity, locale);
          if (res.cart) setCart(res.cart);
          else if (res.error) setError(res.error);
          resolve();
        });
      }),
    [locale],
  );

  const remove = useCallback(
    (lineId: string) =>
      new Promise<void>((resolve) => {
        startTransition(async () => {
          const res = await removeLine(lineId, locale);
          if (res.cart) setCart(res.cart);
          else if (res.error) setError(res.error);
          resolve();
        });
      }),
    [locale],
  );

  const value = useMemo(
    () => ({ cart, loading, pending, open, setOpen, add, update, remove, error }),
    [cart, loading, pending, open, add, update, remove, error],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
