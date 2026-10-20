"use client";

import { useEffect, useRef, useState } from "react";
import { Thread } from "@/components/assistant/Thread";
import { useChat } from "@/components/assistant/useChat";
import { SparkIcon } from "@/components/ui/Icons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CollectionHero } from "@/content/collection-heroes";

/**
 * Inline Mira chat inside a collection hero. The conversation runs right here,
 * with a topic focus sent to the API; product cards appear in the thread.
 */
export function HeroChat({ locale, dict, chat }: { locale: Locale; dict: Dictionary; chat: CollectionHero["chat"] }) {
  const { turns, busy, unavailable, send } = useChat({ locale, dict, topic: chat.topic });
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = dict.assistant;
  const started = turns.length > 0;

  useEffect(() => {
    if (started) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, started]);

  const submit = (q: string) => {
    setInput("");
    void send(q);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-panel)] bg-white text-ink shadow-float">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lind text-moss">
          <SparkIcon width={18} height={18} />
        </span>
        <div className="min-w-0">
          <p className="font-semibold leading-tight">{chat.title}</p>
          <p className="truncate text-xs text-ink-muted">{t.subtitle}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-ink-muted">
          <span className="h-2 w-2 rounded-full bg-green" aria-hidden />
          {t.online}
        </span>
      </div>

      <div ref={listRef} className={`px-5 py-4 ${started ? "max-h-[420px] overflow-y-auto" : ""}`}>
        <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-surface px-3.5 py-2.5 text-[0.9rem] leading-relaxed">{chat.greeting}</div>
        {!started && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {chat.chips.map((c) => (
              <li key={c}>
                <button type="button" onClick={() => submit(c)} className="chip chip-outline !py-1.5 text-left !text-[0.85rem] hover:bg-lind">
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
        {started && (
          <div className="mt-3">
            <Thread turns={turns} locale={locale} dict={dict} compact />
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-line px-4 py-3"
      >
        <div className="flex items-center gap-2 rounded-full border border-line bg-white p-1 pl-4 focus-within:border-green focus-within:ring-2 focus-within:ring-turquoise/60">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={2000}
            placeholder={unavailable ? t.unavailableShort : chat.placeholder}
            disabled={busy || unavailable}
            className="h-10 min-w-0 flex-1 bg-transparent text-[0.95rem] focus:outline-none disabled:opacity-60"
            aria-label={chat.placeholder}
          />
          <button type="submit" className="btn btn-primary !h-9 !min-h-0 !px-4 !text-xs" disabled={busy || unavailable || !input.trim()}>
            {t.send}
          </button>
        </div>
        <p className="mt-2 text-[0.7rem] leading-snug text-ink-muted">{t.disclaimer}</p>
      </form>
    </div>
  );
}
