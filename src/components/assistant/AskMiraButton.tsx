"use client";

import { useAssistant } from "./AssistantProvider";
import { MiraAvatar } from "./MiraAvatar";

/** Light-background button that opens Mira, optionally with a first question. */
export function AskMiraButton({ label, question, className = "btn btn-primary" }: { label: string; question?: string; className?: string }) {
  const { setOpen, ask } = useAssistant();
  return (
    <button type="button" onClick={() => (question ? ask(question) : setOpen(true))} className={className}>
      <MiraAvatar size={24} className="-ml-1 ring-2 ring-white/40" />
      {label}
    </button>
  );
}
