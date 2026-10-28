"use client";

import { useEffect, useRef, useState } from "react";
import { useAssistant } from "./AssistantProvider";
import { Thread } from "./Thread";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CheckIcon, CloseIcon } from "@/components/ui/Icons";
import { MiraAvatar } from "./MiraAvatar";

/**
 * Side panel for Mira. Streams from /api/assistant via useChat; state lives in the tab only.
 */
export function AssistantPanel({ locale, dict, suggestions }: { locale: Locale; dict: Dictionary; suggestions: string[] }) {
  const { open, setOpen, turns, busy, unavailable, send, pageContext, consent, giveConsent } = useAssistant();
  const welcome = pageContext?.greeting ?? dict.assistant.welcome;
  const starters = pageContext?.suggestions ?? suggestions;
  const asked = new Set(turns.filter((x) => x.role === "user").map((x) => x.text));
  const remaining = starters.filter((s) => !asked.has(s));
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const t = dict.assistant;

  useEffect(() => {
    if (!open) return;
    // lock the page without a layout jump: keep the space of the vanishing scrollbar
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gutter > 0) document.body.style.paddingRight = `${gutter}px`;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    // focus after the slide-in so the browser does not fight the transform
    const id = window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(id);
    };
  }, [open, setOpen]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [turns]);

  const submit = () => {
    const q = input;
    setInput("");
    void send(q);
  };

  return (
    <div className={`fixed inset-0 overflow-hidden z-[75] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        tabIndex={-1}
        aria-label={dict.nav.close}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-moss/40 transition-opacity duration-[380ms] ease-out ${open ? "opacity-100" : "opacity-0"}`}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`absolute inset-y-0 right-0 flex w-full transform-gpu flex-col bg-white shadow-float will-change-transform transition-transform duration-[380ms] ease-[cubic-bezier(.16,1,.3,1)] sm:w-[min(100%,480px)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div className="flex items-center gap-3">
            <MiraAvatar size={40} />
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
          {consent === false && (
            <ConsentCard locale={locale} dict={dict} onAccept={giveConsent} onDecline={() => setOpen(false)} />
          )}
          {consent && turns.length === 0 && (
            <div className="mb-4">
              <p className="rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[0.95rem] leading-relaxed">{welcome}</p>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">{t.suggestions}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {starters.map((s) => (
                  <li key={s}>
                    <button type="button" onClick={() => void send(s)} className="chip chip-outline text-left hover:bg-lind">
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {consent && <Thread turns={turns} locale={locale} dict={dict} onNavigate={() => setOpen(false)} />}
          {consent && turns.length > 0 && !busy && remaining.length > 0 && (
            <ul className="mt-4 flex flex-wrap justify-end gap-2">
              {remaining.map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => void send(s)} className="rounded-full border border-green/60 bg-white px-3.5 py-1.5 text-left text-[0.85rem] font-medium text-green transition-colors hover:bg-green hover:text-white">
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {consent && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
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
                  submit();
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
        )}
      </div>
    </div>
  );
}

/** One-time, informed opt-in before the first message: what Mira does, where the text goes, what is not stored */
function ConsentCard({ locale, dict, onAccept, onDecline }: { locale: Locale; dict: Dictionary; onAccept: () => void; onDecline: () => void }) {
  const c = dict.assistant.consent;
  return (
    <div className="rounded-[var(--radius-card)] bg-soft p-5">
      <p className="font-semibold text-moss">{c.title}</p>
      <ul className="mt-3 grid gap-2 text-[0.95rem] leading-relaxed text-ink/85">
        {c.points.map((p) => (
          <li key={p} className="flex gap-2.5">
            <CheckIcon width={16} height={16} className="mt-1 shrink-0 text-green" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs leading-snug text-ink-muted">
        {c.privacyText}{" "}
        <a href={localeHref(locale, "/policies/privacy-policy")} className="underline underline-offset-2 hover:text-green" target="_blank" rel="noopener">
          {c.privacyLink}
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={onAccept} className="btn btn-primary">
          {c.accept}
        </button>
        <button type="button" onClick={onDecline} className="btn btn-tertiary">
          {c.decline}
        </button>
      </div>
      <p className="mt-3 text-xs leading-snug text-ink-muted">{c.alternative}</p>
    </div>
  );
}
