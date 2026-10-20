"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useChat, type Turn } from "./useChat";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  /** One conversation per visit, shared by the side panel, hero chats and CTAs */
  turns: Turn[];
  busy: boolean;
  unavailable: boolean;
  send: (text: string, topic?: string | null) => Promise<void>;
  reset: () => void;
  topic: string | null;
  setTopic: (value: string | null) => void;
  /** Open the panel and send a question (optionally with a page context) */
  ask: (q: string, topic?: string) => void;
};
const AssistantContext = createContext<Ctx | null>(null);

export function AssistantProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const chat = useChat({ locale, dict });
  const { send } = chat;
  const ask = useCallback(
    (q: string, topic?: string) => {
      setOpen(true);
      void send(q, topic);
    },
    [send],
  );
  const value = useMemo(() => ({ open, setOpen, ...chat, ask }), [open, chat, ask]);
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): Ctx {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}
