"use client";

import { useAssistant } from "./AssistantProvider";
import { SparkIcon } from "@/components/ui/Icons";

/** Light-background button that opens Mira, optionally with a first question. */
export function AskMiraButton({ label, question, className = "btn btn-primary" }: { label: string; question?: string; className?: string }) {
  const { setOpen, ask } = useAssistant();
  return (
    <button type="button" onClick={() => (question ? ask(question) : setOpen(true))} className={className}>
      <SparkIcon width={16} height={16} />
      {label}
    </button>
  );
}
