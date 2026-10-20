"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Ctx = { open: boolean; setOpen: (v: boolean) => void; initialQuestion: string | null; ask: (q: string) => void };
const AssistantContext = createContext<Ctx | null>(null);

export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialQuestion, setInitial] = useState<string | null>(null);
  const ask = useCallback((q: string) => {
    setInitial(q);
    setOpen(true);
  }, []);
  const value = useMemo(() => ({ open, setOpen, initialQuestion, ask }), [open, initialQuestion, ask]);
  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}

export function useAssistant(): Ctx {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}
