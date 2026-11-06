"use client";

import { useId } from "react";
import { useCart } from "@/components/cart/CartProvider";
import type { Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { formatMoney } from "@/lib/format";
import type { ShippingCountry } from "@/lib/shipping";
import { ChevronDown, TruckIcon } from "@/components/ui/Icons";

/** "Lieferung nach: Deutschland ▾" with every country Shopify delivers to. Moves the cart right away. */
export function ShipCountrySelect({ dict, tone = "light", className = "" }: { dict: Dictionary; tone?: "light" | "dark"; className?: string }) {
  const { country, setCountry, countries, countryPending } = useCart();
  const id = useId();
  // nothing to choose when Shopify could not be asked or delivers to one country only
  if (countries.length < 2) return null;
  const dark = tone === "dark";
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${dark ? "text-soft/80" : "text-ink-muted"} ${className}`}>
      <label htmlFor={id}>{dict.cart.shipTo}</label>
      <span className="relative inline-flex">
        <select
          id={id}
          value={countries.some((c) => c.code === country) ? country : countries[0].code}
          disabled={countryPending}
          onChange={(e) => setCountry(e.target.value)}
          className={`h-9 cursor-pointer appearance-none rounded-full border py-0 pl-3.5 pr-8 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 disabled:cursor-wait disabled:opacity-60 ${
            dark
              ? "border-white/25 bg-white/5 text-soft hover:border-white/50 focus-visible:ring-turquoise"
              : "border-line bg-white text-ink hover:border-ink/40 focus-visible:ring-green"
          }`}
        >
          {countries.map((c) => (
            // the open list is drawn by the OS: keep it dark-on-light in the footer too
            <option key={c.code} value={c.code} className="bg-white text-ink">
              {c.name}
            </option>
          ))}
        </select>
        <ChevronDown
          width={14}
          height={14}
          aria-hidden
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${dark ? "text-soft/70" : "text-ink-muted"}`}
        />
      </span>
    </span>
  );
}

const isFree = (c: ShippingCountry) => Number(c.shipping.amount) === 0;

/** "Versand innerhalb Deutschlands kostenlos" or "Versand nach Österreich: 12,99 €" */
export function shippingText(c: ShippingCountry | null, dict: Dictionary, locale: Locale): string {
  if (!c || isFree(c)) return c && c.code !== "DE" ? fill(dict.cart.shippingFreeTo, { country: c.name }) : dict.cart.shippingFree;
  return fill(dict.cart.shippingCost, { country: c.name, amount: formatMoney(c.shipping, locale) });
}

/** Short form for the trust strip under the add-to-cart button */
export function shippingShort(c: ShippingCountry | null, dict: Dictionary, locale: Locale): string {
  if (!c || isFree(c)) return dict.product.trustFreeShipping;
  return fill(dict.product.trustShippingCost, { country: c.name, amount: formatMoney(c.shipping, locale) });
}

/**
 * Cheapest rate outside Germany ("Lieferung ins Ausland ab 5,99 €"), in euros only so the
 * number reads the same as the prices on the page. Null when Shopify could not be asked.
 */
export function cheapestAbroad(countries: ShippingCountry[]): ShippingCountry["shipping"] | null {
  const abroad = countries.filter((c) => c.code !== "DE" && c.shipping.currencyCode === "EUR");
  if (!abroad.length) return null;
  return abroad.map((c) => c.shipping).sort((a, b) => Number(a.amount) - Number(b.amount))[0];
}

/** Shipping line plus the country choice, for the cart drawer and cart page. */
export function CartShipping({ dict, locale, className = "" }: { dict: Dictionary; locale: Locale; className?: string }) {
  const { countryInfo } = useCart();
  return (
    <div className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-sm ${className}`}>
      <span className="inline-flex items-center gap-2 text-ink-muted">
        <TruckIcon width={16} height={16} className="shrink-0 text-green" />
        {shippingText(countryInfo, dict, locale)}
      </span>
      <ShipCountrySelect dict={dict} />
    </div>
  );
}
