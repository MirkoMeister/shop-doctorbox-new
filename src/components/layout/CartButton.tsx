"use client";

import { useCart } from "@/components/cart/CartProvider";
import { BagIcon } from "@/components/ui/Icons";

export function CartButton({ label }: { label: string }) {
  const { cart, setOpen } = useCart();
  const count = cart?.totalQuantity ?? 0;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={`${label}${count ? ` (${count})` : ""}`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lind group-data-[tone=dark]:text-soft group-data-[tone=dark]:hover:bg-white/10"
    >
      <BagIcon width={22} height={22} />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 text-[0.7rem] font-semibold text-white tabular-nums group-data-[tone=dark]:bg-soft group-data-[tone=dark]:text-moss">
          {count}
        </span>
      )}
    </button>
  );
}
