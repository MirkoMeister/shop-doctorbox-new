"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  initialQuestion: string | null;
  /** Optional focus (e.g. a collection) attached to a question handed over from a page */
  topic: string | null;
  ask: (q: string, topic?: string) => void;
};
const AssistantContext = createContext<Ctx | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialQuestion, setInitial] = useState<string | null>(null);
  const [topic, setTopic] = useState<string | null>(null);
  const ask = useCallback((q: string, t?: string) => {
    setInitial(q);
    setTopic(t ?? null);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ open, setOpen, initialQuestion, topic, ask }), [open, initialQuestion, topic, ask]);
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): Ctx {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}
