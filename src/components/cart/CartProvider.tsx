"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Locale } from "@/lib/i18n/config";
import { addToCart, getCart, removeLine, setDiscountCode, setShipCountry, updateLine } from "@/lib/cart/actions";
import { DEFAULT_SHIP_COUNTRY, readShipCountryCookie, type ShippingCountry } from "@/lib/shipping";
import type { Cart } from "@/lib/shopify/types";
import type { CartLineInput } from "@/lib/shopify/queries";
import { itemFromLine, trackAddToCart, trackRemoveFromCart } from "@/lib/tracking/events";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  pending: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: CartLineInput) => Promise<boolean>;
  update: (lineId: string, quantity: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
  /** resolves to true when Shopify accepted the code; null removes the code */
  applyDiscount: (code: string | null) => Promise<boolean>;
  error: string | null;
  /** delivery country picked in the shop; decides the Shopify market of the cart */
  country: string;
  countryPending: boolean;
  setCountry: (country: string) => Promise<void>;
  /** countries Shopify delivers to, with their standard rate (Germany first) */
  countries: ShippingCountry[];
  /** the chosen country with its rate; null when Shopify could not be asked */
  countryInfo: ShippingCountry | null;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  locale,
  countries = [],
  children,
}: {
  locale: Locale;
  countries?: ShippingCountry[];
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [country, setCountryState] = useState<string>(DEFAULT_SHIP_COUNTRY);
  // own transition: switching the country must not show "adding…" on the add-to-cart button
  const [countryPending, startCountryTransition] = useTransition();
  // the cart before a change, for remove_from_cart (the callbacks stay stable)
  const cartRef = useRef<Cart | null>(null);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  useEffect(() => {
    let alive = true;
    // the cookie is read after hydration, so server and first client render agree (DE)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCountryState(readShipCountryCookie());
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
            const added = res.cart.lines.find(
              (l) => l.merchandise.id === line.merchandiseId && (l.sellingPlanAllocation?.sellingPlan.id ?? undefined) === line.sellingPlanId,
            );
            if (added) trackAddToCart(itemFromLine(added, line.quantity), res.cart);
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
          const before = cartRef.current?.lines.find((l) => l.id === lineId);
          const res = await updateLine(lineId, quantity, locale);
          if (res.cart) {
            setCart(res.cart);
            if (before && quantity < before.quantity) trackRemoveFromCart(itemFromLine(before, before.quantity - quantity));
            if (before && quantity > before.quantity) trackAddToCart(itemFromLine(before, quantity - before.quantity), res.cart);
          }
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
          const before = cartRef.current?.lines.find((l) => l.id === lineId);
          const res = await removeLine(lineId, locale);
          if (res.cart) {
            setCart(res.cart);
            if (before) trackRemoveFromCart(itemFromLine(before));
          }
          else if (res.error) setError(res.error);
          resolve();
        });
      }),
    [locale],
  );

  const applyDiscount = useCallback(
    (code: string | null) =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          const res = await setDiscountCode(code, locale);
          if (res.cart) {
            setCart(res.cart);
            resolve(!code || res.cart.discountCodes.some((d) => d.applicable && d.code.toUpperCase() === code.trim().toUpperCase()));
          } else {
            if (res.error) setError(res.error);
            resolve(false);
          }
        });
      }),
    [locale],
  );

  const setCountry = useCallback(
    (next: string) =>
      new Promise<void>((resolve) => {
        setCountryState(next);
        startCountryTransition(async () => {
          const res = await setShipCountry(next, locale);
          setCountryState(res.country);
          if (res.cart) setCart(res.cart);
          else if (res.error) setError(res.error);
          resolve();
        });
      }),
    [locale],
  );

  const countryInfo = countries.find((c) => c.code === country) ?? countries.find((c) => c.code === DEFAULT_SHIP_COUNTRY) ?? null;

  const value = useMemo(
    () => ({ cart, loading, pending, open, setOpen, add, update, remove, applyDiscount, error, country, countryPending, setCountry, countries, countryInfo }),
    [cart, loading, pending, open, add, update, remove, applyDiscount, error, country, countryPending, setCountry, countries, countryInfo],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
