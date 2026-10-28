"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/ui/Icons";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const CONFIGURED = Boolean(process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID);

/** E-mail sign-up for the Klaviyo list; `tone` adapts it to the moss footer or a light panel. */
export function NewsletterForm({ dict, locale, tone = "dark", source = "Shop Footer" }: { dict: Dictionary; locale: Locale; tone?: "dark" | "light"; source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);
  const t = dict.footer;
  if (!CONFIGURED) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale, source, website: data.get("website") }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (json.ok) setState("ok");
      else {
        setState("err");
        setError(json.error === "email" ? t.newsletterErrorEmail : t.newsletterError);
      }
    } catch {
      setState("err");
      setError(t.newsletterError);
    }
  }

  const dark = tone === "dark";
  if (state === "ok") {
    return (
      <p className={`mt-3 flex items-start gap-2 text-sm ${dark ? "text-soft" : "text-moss"}`} role="status">
        <CheckIcon width={16} height={16} className={`mt-0.5 shrink-0 ${dark ? "text-turquoise" : "text-green"}`} />
        <span>
          <span className="font-semibold">{t.newsletterSuccess}</span> {t.newsletterSuccessText}
        </span>
      </p>
    );
  }
  const id = `newsletter-${tone}`;
  return (
    <form onSubmit={submit} className="mt-3 max-w-md" noValidate>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor={id}>
          {t.newsletterPlaceholder}
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.newsletterPlaceholder}
          className={`h-12 min-w-0 flex-1 rounded-full border px-4 text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-turquoise/60 ${
            dark ? "border-white/20 bg-white/10 text-white placeholder:text-soft/50 focus:border-turquoise" : "border-line bg-white text-ink placeholder:text-ink-muted focus:border-green"
          }`}
        />
        <button type="submit" className={`btn shrink-0 ${dark ? "btn-on-dark" : "btn-primary"}`} disabled={state === "busy"}>
          {t.newsletterSubmit}
        </button>
      </div>
      <div className="hidden" aria-hidden>
        <label htmlFor={`${id}-website`}>Website</label>
        <input id={`${id}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <p className={`mt-2 text-xs leading-snug ${dark ? "text-soft/60" : "text-ink-muted"}`}>
        {t.newsletterConsent.split(t.newsletterPrivacyWord).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <a href={localeHref(locale, "/policies/privacy-policy")} className="underline underline-offset-2 hover:text-green">
                {t.newsletterPrivacyWord}
              </a>
            )}
          </span>
        ))}
      </p>
      {error && (
        <p className={`mt-2 text-sm ${dark ? "text-okker" : "text-[#b42318]"}`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
