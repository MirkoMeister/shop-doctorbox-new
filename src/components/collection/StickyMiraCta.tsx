"use client";

import { useEffect, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";

/**
 * Mobile-only bar pinned to the bottom of the screen on collection pages.
 * It appears once the hero CTA has scrolled out of view and opens the Mira
 * drawer (greeting and presets live there). Hidden on large screens.
 */
export function StickyMiraCta({ label, watch }: { label: string; watch: string }) {
  const { open, setOpen } = useAssistant();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById(watch);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [watch]);

  const visible = show && !open;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-[120%]"
      }`}
      aria-hidden={!visible}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        tabIndex={visible ? 0 : -1}
        className="btn btn-primary w-full !h-12 shadow-float"
      >
        <MiraAvatar size={26} className="-ml-1 ring-2 ring-white/40" />
        {label}
      </button>
    </div>
  );
}
