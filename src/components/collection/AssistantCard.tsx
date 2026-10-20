"use client";

import { useEffect, useRef, useState } from "react";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import { TypingDots } from "@/components/assistant/Thread";
import { ArrowRight } from "@/components/ui/Icons";
import type { DemoExchange } from "@/content/mira-demo";

type Phase = "ask" | "typing" | "answer" | "hold";
const TIMING: Record<Phase, number> = { ask: 900, typing: 1300, answer: 3600, hold: 500 };

/**
 * Grid tile that plays a scripted mini conversation (question, typing, answer with a
 * product chip) on a loop while visible, then opens the Mira drawer on click.
 * Honours prefers-reduced-motion by showing the first exchange statically.
 */
export function AssistantCard({ title, cta, online, demo }: { title: string; cta: string; online: string; demo: DemoExchange[] }) {
  const { setOpen } = useAssistant();
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<Phase>("ask");
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  // play only while on screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!active || reduced || demo.length === 0) return;
    const id = window.setTimeout(() => {
      if (phase === "ask") setPhase("typing");
      else if (phase === "typing") setPhase("answer");
      else if (phase === "answer") setPhase("hold");
      else {
        setI((n) => (n + 1) % demo.length);
        setPhase("ask");
      }
    }, TIMING[phase]);
    return () => window.clearTimeout(id);
  }, [active, reduced, phase, demo.length]);

  const ex = demo[i] ?? demo[0];
  const showAnswer = reduced || phase === "answer" || phase === "hold";
  const showTyping = !reduced && phase === "typing";
  const fade = phase === "hold" ? "opacity-0 translate-y-1" : "opacity-100 translate-y-0";

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen(true)}
      className="group flex h-full w-full flex-col rounded-[var(--radius-card)] bg-moss p-5 text-left text-soft shadow-card transition-shadow hover:shadow-float sm:p-6"
      aria-label={cta}
    >
      <span className="flex items-center gap-3">
        <MiraAvatar size={40} className="ring-2 ring-white/20" />
        <span className="min-w-0">
          <span className="block font-semibold leading-tight">Mira</span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-soft/70">
            <span className="h-1.5 w-1.5 rounded-full bg-turquoise" aria-hidden />
            {online}
          </span>
        </span>
      </span>

      {/* simulated thread */}
      <span className={`mt-5 flex min-h-[9.5rem] flex-col gap-2 transition-all duration-300 ${fade}`} aria-hidden>
        <span className="rise max-w-[88%] self-end rounded-2xl rounded-tr-sm bg-white/15 px-3 py-2 text-[0.85rem] leading-snug" key={`q${i}`}>
          {ex?.q}
        </span>
        {showTyping && (
          <span className="rise self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2.5" key={`t${i}`}>
            <TypingDots label="…" className="bg-moss/50" />
          </span>
        )}
        {showAnswer && (
          <span className="rise max-w-[92%] self-start rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[0.85rem] leading-snug text-ink" key={`a${i}`}>
            {ex?.a}
            {ex?.product && (
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-lind/80 px-2 py-0.5 text-xs font-semibold text-moss">
                {ex.product} <ArrowRight width={11} height={11} />
              </span>
            )}
          </span>
        )}
      </span>

      <span className="mt-auto pt-5">
        <span className="block text-[0.95rem] font-medium leading-snug text-soft/85">{title}</span>
        <span className="btn btn-on-dark mt-3 !h-10 !min-h-0 !px-4 !text-xs">{cta}</span>
      </span>
    </button>
  );
}
