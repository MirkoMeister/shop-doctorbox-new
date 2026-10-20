"use client";

/**
 * Three lines that morph into an "x". Used in the header (closed) and in the drawer's
 * top row (open) at the same position, so the two read as one button animating.
 */
export function Burger({ open, className = "" }: { open: boolean; className?: string }) {
  const line = "absolute left-0 h-[2px] w-full rounded-full bg-current transition-[transform,opacity,top] duration-[400ms] ease-[cubic-bezier(.2,.7,.2,1)]";
  return (
    <span className={`relative block h-[18px] w-[26px] ${className}`} aria-hidden="true">
      <span className={`${line} ${open ? "top-[8px] rotate-45" : "top-0"}`} />
      <span className={`${line} top-[8px] ${open ? "scale-x-0 opacity-0" : ""}`} />
      <span className={`${line} ${open ? "top-[8px] -rotate-45" : "top-[16px]"}`} />
    </span>
  );
}
