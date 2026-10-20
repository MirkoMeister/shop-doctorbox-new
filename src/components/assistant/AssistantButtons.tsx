"use client";

import { useAssistant } from "./AssistantProvider";
import { MiraAvatar } from "./MiraAvatar";

/** Round icon button for the header (light on dark heroes). */
export function AssistantHeaderButton({ label }: { label: string }) {
  const { setOpen } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      title={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-lind group-data-[tone=dark]:hover:bg-white/10"
    >
      <MiraAvatar size={30} className="ring-2 ring-white/70 group-data-[tone=dark]:ring-white/30" />
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
      className="inline-flex items-center gap-2 rounded-full border border-white/30 py-1 pl-1 pr-4 text-sm font-medium text-soft transition-colors hover:border-white/60 hover:bg-white/10"
    >
      <MiraAvatar size={28} />
      {label}
    </button>
  );
}
