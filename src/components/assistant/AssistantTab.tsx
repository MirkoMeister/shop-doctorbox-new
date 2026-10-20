"use client";

import { MiraAvatar } from "./MiraAvatar";
import { useAssistant } from "./AssistantProvider";

/**
 * Small tab docked to the right edge of the screen once a conversation exists and
 * the drawer is closed, so Mira can be reopened from anywhere on the page.
 */
export function AssistantTab({ label }: { label: string }) {
  const { open, setOpen, turns } = useAssistant();
  const visible = !open && turns.length > 0;
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={label}
      title={label}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col items-center gap-2 rounded-l-2xl bg-moss py-3 pl-2 pr-1.5 text-soft shadow-float transform-gpu transition-transform duration-[380ms] ease-[cubic-bezier(.16,1,.3,1)] hover:bg-green ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <MiraAvatar size={32} className="ring-2 ring-white/20" />
      <span className="text-xs font-semibold uppercase tracking-[0.16em] [writing-mode:vertical-rl]">Mira</span>
      <span className="h-2 w-2 rounded-full bg-turquoise" aria-hidden />
    </button>
  );
}
