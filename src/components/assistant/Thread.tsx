"use client";

import Image from "next/image";
import Link from "next/link";
import type { Turn } from "./useChat";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowRight, DropIcon } from "@/components/ui/Icons";

/** Minimal inline markdown: **bold** only, paragraphs on blank lines. */
export function Rich({ text }: { text: string }) {
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

export function TypingDots({ label }: { label: string }) {
  return (
    <span className="inline-flex gap-1" aria-label={label}>
      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60 [animation-delay:-0.2s]" />
      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60 [animation-delay:-0.1s]" />
      <i className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-muted/60" />
    </span>
  );
}

/** Renders a conversation: user bubbles right, Mira bubbles + product cards left. */
export function Thread({
  turns,
  locale,
  dict,
  onNavigate,
  compact = false,
}: {
  turns: Turn[];
  locale: Locale;
  dict: Dictionary;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  const bubble = compact ? "px-3.5 py-2.5 text-[0.9rem]" : "px-4 py-3 text-[0.95rem]";
  return (
    <ol className="space-y-3">
      {turns.map((turn) =>
        turn.role === "user" ? (
          <li key={turn.id} className="flex justify-end">
            <p className={`max-w-[85%] rounded-2xl rounded-tr-md bg-green leading-relaxed text-white ${bubble}`}>{turn.text}</p>
          </li>
        ) : (
          <li key={turn.id} className="space-y-3">
            {turn.pending && turn.parts.length === 0 && (
              <div className={`max-w-[92%] rounded-2xl rounded-tl-md bg-surface ${bubble}`}>
                <TypingDots label={dict.common.loading} />
              </div>
            )}
            {turn.parts.map((part, pi) =>
              part.type === "text" ? (
                part.text.trim() ? (
                  <div key={pi} className={`max-w-[92%] rounded-2xl rounded-tl-md bg-surface leading-relaxed ${bubble}`}>
                    <Rich text={part.text} />
                  </div>
                ) : null
              ) : (
                <ul key={pi} className="grid gap-2">
                  {part.items.map((p) => (
                    <li key={p.handle}>
                      <Link
                        href={localeHref(locale, `/products/${p.handle}`)}
                        onClick={onNavigate}
                        className="group flex gap-3 rounded-2xl border border-line/70 bg-white p-3 shadow-card transition-shadow hover:shadow-float"
                      >
                        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-20 sm:w-20">
                          {p.image && <Image src={shopifyImage(p.image, 240)} alt="" fill sizes="80px" className="object-cover" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold leading-snug text-ink">{p.title}</span>
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
  );
}
