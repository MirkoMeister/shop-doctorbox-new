"use client";

import { useEffect, useState } from "react";

/** Days / hours / minutes / seconds until `end`; renders dashes until the client ticks. */
export function Countdown({ end, label, units }: { end: string; label: string; units: [string, string, string, string] }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(end).getTime() - Date.now()));
    const id = setInterval(tick, 1000);
    const raf = requestAnimationFrame(tick);
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, [end]);
  const parts =
    left === null
      ? ["--", "--", "--", "--"]
      : [Math.floor(left / 86_400_000), Math.floor((left / 3_600_000) % 24), Math.floor((left / 60_000) % 60), Math.floor((left / 1000) % 60)].map((n) => String(n).padStart(2, "0"));
  return (
    <div role="timer" aria-live="off" aria-label={label}>
      <p className="text-sm text-soft/70">{label}</p>
      <ol className="mt-2 flex gap-2 sm:gap-3">
        {parts.map((v, i) => (
          <li key={units[i]} className="flex min-w-[4rem] flex-col items-center rounded-2xl bg-white/10 px-3 py-2.5 sm:min-w-[4.5rem]">
            <span className="text-2xl font-semibold tabular-nums leading-none sm:text-3xl">{v}</span>
            <span className="mt-1.5 text-xs text-soft/70">{units[i]}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
