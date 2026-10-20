"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAssistant } from "./AssistantProvider";
import type { ProductTeaser } from "@/app/api/assistant/route";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { fill } from "@/lib/i18n/dictionaries";
import { ArrowRight, CloseIcon, DropIcon, SparkIcon } from "@/components/ui/Icons";

type Part = { type: "text"; text: string } | { type: "products"; items: ProductTeaser[]; reason?: string };
type Turn =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; parts: Part[]; pending: boolean; error?: string };

// crypto.randomUUID is unavailable outside secure contexts (e.g. LAN access over http)
let seq = 0;
const nextId = () => `t${Date.now().toString(36)}${(seq++).toString(36)}`;

const plainText = (parts: Part[]) =>
  parts
    .filter((p): p is Extract<Part, { type: "text" }> => p.type === "text")
    .map((p) => p.text)
    .join("");

/** Minimal inline markdown: **bold** only, paragraphs on blank lines. */
function Rich({ text }: { text: string }) {
  const paras = text.replace(/\n{3,}/g, "\n\n").trim().split(/\n\n+/);
  return (
    <>
      {paras.map((para, i) => (
        <p key={i} className={i ? "mt-2" : ""}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
            seg.startsWith("**") && seg.endsWith("**") ? <strong key={j}>{seg.slice(2, -2)}</strong> : seg,
          )}
        </p>
      ))}
    </>
  );
}

/**
 * Chat panel for the test advisor. Streams NDJSON from /api/assistant:
 * text deltas, product card events, done/error. State lives in the tab only.
 */
export function AssistantPanel({ locale, dict, suggestions }: { locale: Locale; dict: Dictionary; suggestions: string[] }) {
  const { open, setOpen, initialQuestion } = useAssistant();
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const t = dict.assistant;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(id);
    };
  }, [open, setOpen]);

  // A question handed over from the hero starts the conversation
  const [handled, setHandled] = useState<string | null>(null);
  useEffect(() => {
    if (open && initialQuestion && initialQuestion !== handled) {
      const id = requestAnimationFrame(() => {
        setHandled(initialQuestion);
        void send(initialQuestion);
      });
      return () => cancelAnimationFrame(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuestion]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    const userTurn: Turn = { id: nextId(), role: "user", text: q };
    const replyId = nextId();
    const history = [...turns, userTurn];
    setTurns([...history, { id: replyId, role: "assistant", parts: [], pending: true }]);
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
          } else if (ev.type === "products") update((a) => ({ parts: [...a.parts, { type: "products", items: ev.items ?? [], reason: ev.reason }] }));
          else if (ev.type === "error") update(() => ({ error: ev.message }));
        }
      }
      update(() => ({ pending: false }));
    } catch (e) {
      if ((e as Error).name !== "AbortError") update(() => ({ pending: false, error: t.error }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={`fixed inset-0 z-[75] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={dict.nav.close}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-moss/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-float transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)] sm:w-[min(100%,480px)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lind text-moss">
              <SparkIcon width={20} height={20} />
            </span>
            <div>
              <h2 className="font-semibold leading-tight">{t.title}</h2>
              <p className="text-xs text-ink-muted">{t.subtitle}</p>
            </div>
          </div>
          <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-lind" aria-label={dict.nav.close}>
            <CloseIcon />
          </button>
        </header>

        <div ref={listRef} className="flex-1 overflow-y-auto px-5 py-5">
          {turns.length === 0 && (
            <div>
              <p className="rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[0.95rem] leading-relaxed">{t.welcome}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{t.suggestions}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => void send(s)} className="chip chip-outline text-left hover:bg-lind">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ol className="space-y-4">
            {turns.map((turn) =>
              turn.role === "user" ? (
                <li key={turn.id} className="flex justify-end">
                  <p className="max-w-[85%] rounded-2xl rounded-tr-md bg-green px-4 py-2.5 text-[0.95rem] leading-relaxed text-white">{turn.text}</p>
                </li>
              ) : (
                <li key={turn.id} className="space-y-3">
                  {turn.pending && turn.parts.length === 0 && (
                    <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-surface px-4 py-3">
                      <span className="inline-flex gap-1" aria-label={dict.common.loading}>
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60 [animation-delay:-0.2s]" />
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60 [animation-delay:-0.1s]" />
                        <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60" />
                      </span>
                    </div>
                  )}
                  {turn.parts.map((part, pi) =>
                    part.type === "text" ? (
                      part.text.trim() ? (
                        <div key={pi} className="max-w-[92%] rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[0.95rem] leading-relaxed">
                          <Rich text={part.text} />
                        </div>
                      ) : null
                    ) : (
                      <ul key={pi} className="grid gap-2">
                        {part.items.map((p) => (
                          <li key={p.handle}>
                            <Link
                              href={localeHref(locale, `/products/${p.handle}`)}
                              onClick={() => setOpen(false)}
                              className="group flex gap-3 rounded-2xl border border-line/70 bg-white p-3 shadow-card transition-shadow hover:shadow-float"
                            >
                              <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface">
                                {p.image && <Image src={shopifyImage(p.image, 240)} alt="" fill sizes="80px" className="object-cover" />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-semibold leading-snug">{p.title}</span>
                                <span className="mt-1 flex flex-wrap gap-x-3 text-xs text-ink-muted">
                                  {p.sample && (
                                    <span className="inline-flex items-center gap-1">
                                      <DropIcon width={12} height={12} className="text-green" />
                                      {p.sample}
                                    </span>
                                  )}
                                  {p.values > 0 && <span>{p.values === 1 ? dict.product.valueCount : fill(dict.product.valuesCount, { n: p.values })}</span>}
                                </span>
                                <span className="mt-2 flex items-center justify-between">
                                  <span className="font-semibold tabular-nums text-green">{formatMoney({ amount: p.price, currencyCode: p.currency }, locale)}</span>
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green">
                                    {dict.guide.toTest} <ArrowRight width={14} height={14} />
                                  </span>
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                  {turn.error && <p className="text-sm text-[#b42318]">{turn.error}</p>}
                </li>
              ),
            )}
          </ol>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="border-t border-line bg-white px-4 py-3"
        >
          <div className="flex items-end gap-2 rounded-3xl border border-line bg-white p-1.5 pl-4 focus-within:border-green focus-within:ring-2 focus-within:ring-turquoise/60">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              maxLength={2000}
              placeholder={unavailable ? t.unavailableShort : t.placeholder}
              disabled={busy || unavailable}
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent py-2 text-[0.95rem] focus:outline-none disabled:opacity-60"
            />
            <button type="submit" className="btn btn-primary !h-10 !min-h-0 !px-4" disabled={busy || unavailable || !input.trim()}>
              {t.send}
            </button>
          </div>
          <p className="mt-2 text-[0.7rem] leading-snug text-ink-muted">{t.disclaimer}</p>
        </form>
      </div>
    </div>
  );
}
