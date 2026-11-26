"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * The discount code with a one-tap copy; falls back to selecting the text where the clipboard is blocked.
 * `coupon` draws it as a voucher (dashed okker edge, large code) for campaign heroes on dark backgrounds.
 */
export function CopyCode({ code, label, copy, copied, coupon = false }: { code: string; label: string; copy: string; copied: string; coupon?: boolean }) {
  const [done, setDone] = useState(false);
  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch {
      const el = document.getElementById("promo-code");
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  }
  return (
    <div
      className={
        coupon
          ? "inline-flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[var(--radius-card)] border-2 border-dashed border-okker bg-okker/15 p-3 pl-5"
          : "inline-flex flex-wrap items-center gap-3 rounded-[var(--radius-card)] bg-white/10 p-2 pl-5"
      }
    >
      <span className="text-sm text-soft/70">{label}</span>
      <span id="promo-code" className={coupon ? "select-all text-2xl font-semibold tracking-[0.12em] text-okker sm:text-3xl" : "font-semibold tracking-[0.12em] text-okker sm:text-lg"}>
        {code}
      </span>
      <button type="button" onClick={onCopy} className={coupon ? "btn btn-sm bg-okker text-moss hover:bg-okker/90" : "btn btn-on-dark btn-sm"} aria-live="polite">
        {done ? (
          <>
            <CheckIcon width={14} height={14} /> {copied}
          </>
        ) : (
          copy
        )}
      </button>
    </div>
  );
}
