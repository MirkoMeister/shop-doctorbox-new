"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type Turn } from "./useChat";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type PageContext = { greeting: string; suggestions: string[]; title?: string };

type Ctx = {
  open: boolean;
  /** Greeting and starter questions supplied by the current page (e.g. a collection hero) */
  pageContext: PageContext | null;
  setPageContext: (ctx: PageContext | null) => void;
  setOpen: (v: boolean) => void;
  /** One conversation per visit, shared by the side panel, hero chats and CTAs */
  turns: Turn[];
  busy: boolean;
  unavailable: boolean;
  send: (text: string, topic?: string | null) => Promise<void>;
  reset: () => void;
  topic: string | null;
  setTopic: (value: string | null) => void;
  /** Open the panel and send a question (optionally with a page context); waits for consent first */
  ask: (q: string, topic?: string) => void;
  /** null until the stored choice is read, then whether the visitor agreed to the AI processing */
  consent: boolean | null;
  giveConsent: () => void;
};
const CONSENT_KEY = "mira-consent";
const AssistantContext = createContext<Ctx | null>(null);

export function AssistantProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext | null>(null);
  const chat = useChat({ locale, dict });
  const { send } = chat;
  const [consent, setConsent] = useState<boolean | null>(null);
  // a question asked before consent, sent right after the visitor agrees
  const pending = useRef<{ q: string; topic?: string } | null>(null);

  useEffect(() => {
    // deferred: read the stored choice once the client is up, not during hydration
    const id = requestAnimationFrame(() => {
      try {
        setConsent(localStorage.getItem(CONSENT_KEY) === "1");
      } catch {
        setConsent(false);
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const giveConsent = useCallback(() => {
    setConsent(true);
    try {
      localStorage.setItem(CONSENT_KEY, "1");
      localStorage.setItem(`${CONSENT_KEY}-at`, new Date().toISOString());
    } catch {
      /* private mode: consent holds for this page view */
    }
    const p = pending.current;
    pending.current = null;
    if (p) void send(p.q, p.topic);
  }, [send]);

  const ask = useCallback(
    (q: string, topic?: string) => {
      setOpen(true);
      if (consent) void send(q, topic);
      else pending.current = { q, topic };
    },
    [consent, send],
  );
  const value = useMemo(() => ({ open, setOpen, pageContext, setPageContext, ...chat, ask, consent, giveConsent }), [open, pageContext, chat, ask, consent, giveConsent]);
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): Ctx {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}
