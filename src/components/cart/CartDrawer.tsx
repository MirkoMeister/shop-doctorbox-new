"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import type { Locale } from "@/lib/i18n/config";
import { localeHref } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import { formatMoney, shopifyImage } from "@/lib/format";
import { CloseIcon, MinusIcon, PinIcon, PlusIcon } from "@/components/ui/Icons";

export function CartDrawer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { cart, open, setOpen, update, remove, pending } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const lines = cart?.lines ?? [];
  const count = cart?.totalQuantity ?? 0;

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label={dict.nav.close}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-moss/40 backdrop-blur-[2px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={dict.cart.title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-float transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="h4">
            {dict.cart.title}{" "}
            <span className="text-ink-muted font-normal text-base">
              {count > 0 && `(${count === 1 ? dict.cart.item : fill(dict.cart.items, { n: count })})`}
            </span>
          </h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-lind"
            aria-label={dict.nav.close}
          >
            <CloseIcon />
          </button>
        </header>

        <div className={`flex-1 overflow-y-auto px-5 py-4 ${pending ? "opacity-60" : ""}`} aria-busy={pending}>
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-start justify-center gap-3">
              <p className="h4">{dict.cart.empty}</p>
              <p className="text-ink-muted">{dict.cart.emptyText}</p>
              <Link href={localeHref(locale, "/collections")} className="btn btn-primary mt-2" onClick={() => setOpen(false)}>
                {dict.cart.continue}
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {lines.map((line) => {
                const img = line.merchandise.image ?? line.merchandise.product.featuredImage;
                const variantLabel = line.merchandise.selectedOptions
                  .filter((o) => o.value !== "Default Title")
                  .map((o) => o.value)
                  .join(", ");
                return (
                  <li key={line.id} className="flex gap-4 py-4">
                    <Link
                      href={localeHref(locale, `/products/${line.merchandise.product.handle}`)}
                      onClick={() => setOpen(false)}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-surface"
                    >
                      {img && (
                        <Image src={shopifyImage(img.url, 240)} alt={img.altText ?? line.merchandise.product.title} fill sizes="80px" className="object-cover" />
                      )}
                    </Link>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Link
                        href={localeHref(locale, `/products/${line.merchandise.product.handle}`)}
                        onClick={() => setOpen(false)}
                        className="font-medium leading-snug hover:text-green"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      {variantLabel && <p className="text-sm text-ink-muted">{variantLabel}</p>}
                      {line.sellingPlanAllocation && (
                        <p className="text-sm text-green">
                          {fill(dict.cart.subscriptionLine, { plan: line.sellingPlanAllocation.sellingPlan.name })}
                        </p>
                      )}
                      <div className="mt-1 flex items-center justify-between gap-3">
                        <div className="inline-flex items-center rounded-full border border-line bg-white">
                          <button
                            type="button"
                            className="p-2 disabled:opacity-40"
                            aria-label="−"
                            disabled={pending}
                            onClick={() => update(line.id, line.quantity - 1)}
                          >
                            <MinusIcon width={16} height={16} />
                          </button>
                          <span className="min-w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                          <button
                            type="button"
                            className="p-2 disabled:opacity-40"
                            aria-label="+"
                            disabled={pending}
                            onClick={() => update(line.id, line.quantity + 1)}
                          >
                            <PlusIcon width={16} height={16} />
                          </button>
                        </div>
                        <span className="font-semibold tabular-nums">{formatMoney(line.cost.totalAmount, locale)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        disabled={pending}
                        className="self-start text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
                      >
                        {dict.cart.remove}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {lines.length > 0 && cart && (
          <footer className="border-t border-line bg-surface px-5 py-4">
            <div className="flex items-baseline justify-between">
              <span className="text-ink-muted">{dict.cart.subtotal}</span>
              <span className="text-xl font-semibold tabular-nums">{formatMoney(cart.cost.subtotalAmount, locale)}</span>
            </div>
            <p className="mt-1 flex items-start gap-2 text-sm text-ink-muted">
              <PinIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
              {dict.cart.pickupNote}
            </p>
            <a href={cart.checkoutUrl} className="btn btn-primary btn-lg mt-4 w-full">
              {dict.cart.checkout}
            </a>
            <Link
              href={localeHref(locale, "/cart")}
              onClick={() => setOpen(false)}
              className="mt-3 block text-center text-sm text-ink-muted underline underline-offset-4 hover:text-ink"
            >
              {dict.cart.viewCart}
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}
