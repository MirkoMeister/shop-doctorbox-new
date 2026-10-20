"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const COMPANY = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID;
const LIST = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;

export function NewsletterForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "ok" | "err">("idle");

  if (!COMPANY || !LIST) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${COMPANY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", revision: "2024-10-15" },
        body: JSON.stringify({
          data: {
            type: "subscription",
            attributes: {
              custom_source: "Shop Footer",
              profile: { data: { type: "profile", attributes: { email, properties: { locale } } } },
            },
            relationships: { list: { data: { type: "list", id: LIST } } },
          },
        }),
      });
      setState(res.ok || res.status === 202 ? "ok" : "err");
    } catch {
      setState("err");
    }
  }

  if (state === "ok") return <p className="mt-3 text-sm text-turquoise">✓</p>;

  return (
    <form onSubmit={submit} className="mt-3 flex max-w-sm gap-2">
      <label className="sr-only" htmlFor="newsletter-email">
        {dict.footer.newsletterPlaceholder}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={dict.footer.newsletterPlaceholder}
        className="h-11 min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-soft/50 focus:border-turquoise focus:outline-none"
      />
      <button type="submit" className="btn btn-on-dark btn-sm" disabled={state === "busy"}>
        {dict.footer.newsletterSubmit}
      </button>
      {state === "err" && <p className="text-xs text-okker">{dict.common.error}</p>}
    </form>
  );
}
