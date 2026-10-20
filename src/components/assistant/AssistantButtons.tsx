"use client";

import { useAssistant } from "./AssistantProvider";
import { SparkIcon } from "@/components/ui/Icons";

/** Round icon button for the header (light on dark heroes). */
export function AssistantHeaderButton({ label }: { label: string }) {
  const { setOpen } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lind group-data-[tone=dark]:text-soft group-data-[tone=dark]:hover:bg-white/10"
    >
      <SparkIcon width={22} height={22} />
    </button>
  );
}

/** Text entry point for the hero: opens the panel, optionally with a first question. */
export function AssistantHeroButton({ label, question }: { label: string; question?: string }) {
  const { setOpen, ask } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => (question ? ask(question) : setOpen(true))}
      className="inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-soft transition-colors hover:border-white/60 hover:bg-white/10"
    >
      <SparkIcon width={16} height={16} className="text-turquoise" />
      {label}
    </button>
  );
}
