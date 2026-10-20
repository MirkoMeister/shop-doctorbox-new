"use client";

import { useCallback, useRef, useState } from "react";
import type { ProductTeaser } from "@/app/api/assistant/route";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export type Part = { type: "text"; text: string } | { type: "products"; items: ProductTeaser[]; reason?: string };
export type Turn =
  | { id: string; role: "user"; text: string; at: number }
  | { id: string; role: "assistant"; parts: Part[]; pending: boolean; error?: string; at: number };

// crypto.randomUUID is unavailable outside secure contexts (e.g. LAN access over http)
let seq = 0;
const nextId = () => `t${Date.now().toString(36)}${(seq++).toString(36)}`;

export const plainText = (parts: Part[]) =>
  parts
    .filter((p): p is Extract<Part, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

/**
 * Conversation state + streaming transport for the Mira assistant.
 * Used by the side panel and by inline chats (e.g. collection heroes).
 * `topic` is sent along so the server can focus the advice (e.g. STI).
 */
export function useChat({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [topic, setTopicState] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const turnsRef = useRef<Turn[]>([]);
  const topicRef = useRef<string | null>(null);
  turnsRef.current = turns;
  const t = dict.assistant;

  /** Page context (e.g. the collection the visitor is on); applied to every following request */
  const setTopic = useCallback((value: string | null) => {
    topicRef.current = value;
    setTopicState(value);
  }, []);

  const send = useCallback(
    async (text: string, topicOverride?: string | null) => {
      const q = text.trim();
      if (!q || busy) return;
      if (topicOverride !== undefined) {
        topicRef.current = topicOverride;
        setTopicState(topicOverride);
      }
      const userTurn: Turn = { id: nextId(), role: "user", text: q, at: Date.now() };
      const replyId = nextId();
      const history = [...turnsRef.current, userTurn];
      setTurns([...history, { id: replyId, role: "assistant", parts: [], pending: true, at: Date.now() }]);
      setBusy(true);
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const update = (fn: (a: Extract<Turn, { role: "assistant" }>) => Partial<Extract<Turn, { role: "assistant" }>>) =>
        setTurns((prev) => prev.map((x) => (x.id === replyId && x.role === "assistant" ? { ...x, ...fn(x) } : x)));

      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: ctrl.signal,
          body: JSON.stringify({
            locale,
            topic: topicRef.current ?? undefined,
            messages: history
              .map((x) => ({ role: x.role, content: x.role === "user" ? x.text : plainText(x.parts) }))
              .filter((m) => m.content.trim()),
          }),
        });
        if (res.status === 503) {
          setUnavailable(true);
          update(() => ({ pending: false, parts: [{ type: "text", text: t.unavailable }] }));
          return;
        }
        if (!res.ok || !res.body) {
          update(() => ({ pending: false, error: res.status === 429 ? t.rateLimited : t.error }));
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const ev = JSON.parse(line) as { type: string; text?: string; items?: ProductTeaser[]; reason?: string; message?: string };
            if (ev.type === "text") {
              update((a) => {
                const last = a.parts[a.parts.length - 1];
                const parts =
                  last?.type === "text"
                    ? [...a.parts.slice(0, -1), { type: "text" as const, text: last.text + (ev.text ?? "") }]
                    : [...a.parts, { type: "text" as const, text: ev.text ?? "" }];
                return { parts };
              });
            } else if (ev.type === "products") {
              update((a) => ({ parts: [...a.parts, { type: "products", items: ev.items ?? [], reason: ev.reason }] }));
            } else if (ev.type === "error") {
              update(() => ({ error: ev.message }));
            }
          }
        }
        update(() => ({ pending: false }));
      } catch (e) {
        if ((e as Error).name !== "AbortError") update(() => ({ pending: false, error: t.error }));
      } finally {
        setBusy(false);
      }
    },
    [busy, locale, t.unavailable, t.rateLimited, t.error],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setTurns([]);
    setBusy(false);
  }, []);

  return { turns, busy, unavailable, send, reset, topic, setTopic };
}
