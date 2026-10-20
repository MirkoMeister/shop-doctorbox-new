"use client";

import { useAssistant } from "@/components/assistant/AssistantProvider";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";

/** Grid tile that opens Mira with a question about the current collection. */
export function AssistantCard({ title, text, cta }: { title: string; text: string; cta: string }) {
  const { setOpen } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="group flex h-full w-full flex-col justify-between rounded-[var(--radius-card)] bg-moss p-5 text-left text-soft shadow-card transition-shadow hover:shadow-float sm:p-6"
    >
      <MiraAvatar size={48} className="ring-2 ring-white/20" />
      <span className="mt-8">
        <span className="block text-[1.25rem] font-semibold leading-snug">{title}</span>
        <span className="mt-2 block text-[0.95rem] leading-relaxed text-soft/80">{text}</span>
        <span className="btn btn-on-dark mt-5 !h-10 !min-h-0 !px-4 !text-xs">{cta}</span>
      </span>
    </button>
  );
}
