"use client";

import { useState } from "react";
import type { ContactCopy } from "@/content/contact";
import type { Locale } from "@/lib/i18n/config";
import { CheckIcon } from "@/components/ui/Icons";

export function ContactForm({ locale, t }: { locale: Locale; t: ContactCopy["form"] }) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError(null);
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, locale }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) setState("ok");
      else {
        setState("error");
        setError(data.error === "email" ? t.errorEmail : t.errorGeneric);
      }
    } catch {
      setState("error");
      setError(t.errorGeneric);
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-[var(--radius-card)] bg-lind p-8 text-moss">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green text-white">
          <CheckIcon />
        </span>
        <h3 className="h4 mt-4">{t.successTitle}</h3>
        <p className="mt-2 text-moss/80">{t.successText}</p>
      </div>
    );
  }

  const field = "h-12 w-full rounded-2xl border border-line bg-white px-4 text-[0.95rem] focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60";
  const label = "mb-1.5 block text-sm font-medium";

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className={label}>
          {t.topic} *
        </label>
        <select id="c-topic" name="topic" required className={field} defaultValue="">
          <option value="" disabled>
            …
          </option>
          {t.topics.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-name" className={label}>
          {t.name} *
        </label>
        <input id="c-name" name="name" required minLength={2} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="c-email" className={label}>
          {t.email} *
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-order" className={label}>
          {t.order} <span className="font-normal text-ink-muted">({t.orderHint})</span>
        </label>
        <input id="c-order" name="order" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className={label}>
          {t.message} *
        </label>
        <textarea
          id="c-message"
          name="message"
          required
          minLength={10}
          rows={5}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-[0.95rem] focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60"
        />
      </div>
      {/* honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-snug text-ink-muted">{t.privacy}</p>
        <button type="submit" className="btn btn-primary shrink-0" disabled={state === "busy"}>
          {t.submit}
        </button>
      </div>
      {error && (
        <p className="sm:col-span-2 text-sm text-[#b42318]" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
