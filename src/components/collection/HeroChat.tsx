"use client";

import { useEffect, useRef, useState } from "react";
import { MiraAvatar } from "@/components/assistant/MiraAvatar";
import { Thread } from "@/components/assistant/Thread";
import { useChat } from "@/components/assistant/useChat";
import { SendIcon } from "@/components/ui/Icons";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { CollectionHero } from "@/content/collection-heroes";

const time = (locale: Locale) => new Date().toLocaleTimeString(locale === "en" ? "en-GB" : "de-DE", { hour: "2-digit", minute: "2-digit" });

/**
 * Messenger-style Mira chat inside a collection hero: avatar + online status,
 * bubbles with tails and timestamps, quick replies, round send button.
 * The conversation runs right here with a topic focus sent to the API.
 */
export function HeroChat({ locale, dict, chat }: { locale: Locale; dict: Dictionary; chat: CollectionHero["chat"] }) {
  const { turns, busy, unavailable, send } = useChat({ locale, dict, topic: chat.topic });
  const [input, setInput] = useState("");
  const [openedAt] = useState(() => time(locale));
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = dict.assistant;
  const started = turns.length > 0;

  useEffect(() => {
    if (started) listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, started]);

  const submit = (q: string) => {
    if (!q.trim()) return;
    setInput("");
    void send(q);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-[var(--radius-panel)] bg-white text-ink shadow-float">
      {/* Header like a chat contact */}
      <div className="flex items-center gap-3 bg-moss px-4 py-3 text-soft">
        <MiraAvatar size={42} className="ring-2 ring-white/20" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-tight">{chat.title}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-soft/80" aria-live="polite">
            {busy ? (
              <span className="text-turquoise">{t.typing}</span>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-turquoise" aria-hidden />
                {t.online}
              </>
            )}
          </p>
        </div>
        <span className="hidden text-[0.7rem] text-soft/60 sm:block">{t.anonymous}</span>
      </div>

      {/* Conversation on the soft, patterned background */}
      <div
        ref={listRef}
        className={`bg-soft px-3 py-4 sm:px-4 ${started ? "max-h-[440px] overflow-y-auto" : ""}`}
        style={{
          backgroundImage:
            "radial-gradient(rgba(14,77,47,0.07) 1px, transparent 1px), radial-gradient(rgba(14,77,47,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px, 22px 22px",
          backgroundPosition: "0 0, 11px 11px",
        }}
      >
        <p className="mb-3 text-center">
          <span className="rounded-lg bg-white/80 px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-ink-muted shadow-[0_1px_1px_rgba(18,33,55,0.06)]">
            {locale === "en" ? "Today" : "Heute"}
          </span>
        </p>
        <div className="relative max-w-[88%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 pb-5 text-[0.9rem] leading-relaxed shadow-[0_1px_1px_rgba(18,33,55,0.08)] before:absolute before:-left-1.5 before:top-0 before:h-3 before:w-3 before:bg-white before:[clip-path:polygon(100%_0,0_0,100%_100%)]">
          {chat.greeting}
          <span className="pointer-events-none absolute bottom-1 right-2.5 text-[0.65rem] leading-none text-ink-muted/80">{openedAt}</span>
        </div>
        {!started && (
          <ul className="mt-3 flex flex-wrap justify-end gap-2">
            {chat.chips.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => submit(c)}
                  className="rounded-full border border-green/60 bg-white px-3.5 py-1.5 text-left text-[0.85rem] font-medium text-green transition-colors hover:bg-green hover:text-white"
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
        {started && (
          <div className="mt-2">
            <Thread turns={turns} locale={locale} dict={dict} variant="messenger" />
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-line bg-white px-3 py-2.5"
      >
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={2000}
            placeholder={unavailable ? t.unavailableShort : chat.placeholder}
            disabled={busy || unavailable}
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-surface px-4 text-[0.95rem] focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60 disabled:opacity-60"
            aria-label={chat.placeholder}
          />
          <button
            type="submit"
            aria-label={t.send}
            disabled={busy || unavailable || !input.trim()}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green text-white transition-colors hover:bg-moss disabled:opacity-40"
          >
            <SendIcon width={20} height={20} />
          </button>
        </div>
        <p className="mt-2 text-[0.68rem] leading-snug text-ink-muted">{t.disclaimer}</p>
      </form>
    </div>
  );
}
