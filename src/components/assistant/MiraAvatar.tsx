"use client";

import { useEffect, useState } from "react";

/** Mira's portrait lives at /assistant/mira.jpg; until it exists a brand initial is shown. */
export const MIRA_AVATAR = "/assistant/mira.jpg";

let probe: Promise<boolean> | null = null;
const available = () =>
  (probe ??= new Promise<boolean>((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    const img = new window.Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = MIRA_AVATAR;
  }));

export function MiraAvatar({ size = 40, className = "" }: { size?: number; className?: string }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let live = true;
    void available().then((v) => live && setOk(v));
    return () => {
      live = false;
    };
  }, []);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-lind text-moss ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {ok ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={MIRA_AVATAR} alt="" width={size} height={size} className="h-full w-full object-cover" />
      ) : (
        <span className="font-semibold" style={{ fontSize: size * 0.42 }}>
          M
        </span>
      )}
    </span>
  );
}
