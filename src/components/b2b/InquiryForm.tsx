"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { CheckIcon } from "@/components/ui/Icons";

export function InquiryForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const t = dict.b2b.form;
  const [state, setState] = useState<"idle" | "busy" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/b2b", {
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
        <label htmlFor="b2b-company" className={label}>
          {t.company} *
        </label>
        <input id="b2b-company" name="company" required minLength={2} autoComplete="organization" className={field} />
      </div>
      <div>
        <label htmlFor="b2b-name" className={label}>
          {t.name} *
        </label>
        <input id="b2b-name" name="name" required minLength={2} autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="b2b-email" className={label}>
          {t.email} *
        </label>
        <input id="b2b-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="b2b-phone" className={label}>
          {t.phone}
        </label>
        <input id="b2b-phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor="b2b-interest" className={label}>
          {t.interest} *
        </label>
        <select id="b2b-interest" name="interest" required defaultValue="" className={field}>
          <option value="" disabled>
            {t.interestPlaceholder}
          </option>
          {t.interestOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="b2b-volume" className={label}>
          {t.volume}
        </label>
        <select id="b2b-volume" name="volume" defaultValue="" className={field}>
          <option value="">{t.volumePlaceholder}</option>
          {t.volumeOptions.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="b2b-message" className={label}>
          {t.message}
        </label>
        <textarea id="b2b-message" name="message" rows={5} className={`${field} h-auto py-3`} placeholder={t.messagePlaceholder} />
      </div>
      {/* honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="b2b-website">Website</label>
        <input id="b2b-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-ink-muted">{t.consent}</p>
        <button type="submit" className="btn btn-primary" disabled={state === "busy"}>
          {state === "busy" ? `${t.sending}…` : t.submit}
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
