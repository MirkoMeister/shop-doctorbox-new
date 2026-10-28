"use client";

import Image from "next/image";
import Link from "next/link";
import type { Part, Turn } from "./useChat";
import type { ProductTeaser } from "@/app/api/assistant/route";
import { formatMoney, shopifyImage } from "@/lib/format";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";
import { ArrowRight, DoubleCheckIcon, DropIcon } from "@/components/ui/Icons";

/** Display name: drop " - Geschlechtskrankheiten-Test" style suffixes, keep "| Für Männer" qualifiers */
export const shortName = (title: string) =>
  title
    .replace(/\s*[-–]\s+.*$/, "")
    .replace(/\s*\|\s*/g, " · ")
    .trim();

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[„“"’'`]/g, "")
    .replace(/\s*[-–]\s+.*$/, "") // drop suffixes after a dash
    .replace(/\s*\|\s*/g, " ") // keep qualifiers such as "Für Männer"
    .replace(/\s+/g, " ")
    .trim();

/** Finds the recommended product a bold mention refers to (prefix or containment match). */
function matchTeaser(mention: string, teasers: ProductTeaser[]): ProductTeaser | null {
  const m = norm(mention);
  if (m.length < 4) return null;
  let best: ProductTeaser | null = null;
  for (const p of teasers) {
    const t = norm(p.title);
    const full = p.title.toLowerCase();
    if (t === m || t.startsWith(m) || m.startsWith(t) || full.includes(m)) {
      if (!best || p.title.length < best.title.length) best = p;
    }
  }
  return best;
}

/** Inline product mention: thumbnail, name and price inside the sentence. */
function InlineProduct({ p, locale, onNavigate, tone }: { p: ProductTeaser; locale: Locale; onNavigate?: () => void; tone: "light" | "surface" }) {
  return (
    <Link
      href={localeHref(locale, `/products/${p.handle}`)}
      onClick={onNavigate}
      className={`mx-0.5 inline-flex max-w-full items-center whitespace-nowrap rounded-full px-2 py-0.5 align-baseline font-semibold text-moss transition-colors hover:bg-green hover:text-white ${
        tone === "light" ? "bg-lind/70" : "border border-line bg-white hover:border-green"
      }`}
    >
      {p.image && (
        <Image src={shopifyImage(p.image, 96)} alt="" width={20} height={20} className="mr-1 h-5 w-5 shrink-0 rounded-full bg-white object-cover" />
      )}
      <span className="truncate">{shortName(p.title)}</span>
      <span className="ml-1.5 text-xs font-medium opacity-80">{formatMoney({ amount: p.price, currencyCode: p.currency }, locale)}</span>
    </Link>
  );
}

/**
 * Minimal inline markdown: **bold** only, paragraphs on blank lines.
 * Bold mentions that match a recommended product become inline product links.
 */
export function Rich({
  text,
  teasers = [],
  locale,
  onNavigate,
  tone = "surface",
  onMatch,
}: {
  text: string;
  teasers?: ProductTeaser[];
  locale: Locale;
  onNavigate?: () => void;
  tone?: "light" | "surface";
  onMatch?: (handle: string) => void;
}) {
  const paras = text.replace(/\n{3,}/g, "\n\n").trim().split(/\n\n+/);
  return (
    <>
      {paras.map((para, i) => (
        <p key={i} className={i ? "mt-2" : ""}>
          {para.split(/(\*\*[^*]+\*\*)/g).map((seg, j) => {
            if (!(seg.startsWith("**") && seg.endsWith("**"))) return seg;
            const label = seg.slice(2, -2);
            const p = teasers.length ? matchTeaser(label, teasers) : null;
            if (p) {
              onMatch?.(p.handle);
              return <InlineProduct key={j} p={p} locale={locale} onNavigate={onNavigate} tone={tone} />;
            }
            return <strong key={j}>{label}</strong>;
          })}
        </p>
      ))}
    </>
  );
}

export function TypingDots({ label, className = "bg-ink-muted/60" }: { label: string; className?: string }) {
  return (
    <span className="inline-flex gap-1" aria-label={label}>
      <i className={`h-1.5 w-1.5 animate-bounce rounded-full ${className} [animation-delay:-0.2s]`} />
      <i className={`h-1.5 w-1.5 animate-bounce rounded-full ${className} [animation-delay:-0.1s]`} />
      <i className={`h-1.5 w-1.5 animate-bounce rounded-full ${className}`} />
    </span>
  );
}

const time = (at: number, locale: Locale) => new Date(at).toLocaleTimeString(locale === "en" ? "en-GB" : "de-DE", { hour: "2-digit", minute: "2-digit" });

const teasersOf = (parts: Part[]) => parts.flatMap((p) => (p.type === "products" ? p.items : []));

/** Which recommended products are mentioned (and therefore linked) somewhere in the turn's text */
function mentioned(parts: Part[], teasers: ProductTeaser[]): Set<string> {
  const out = new Set<string>();
  for (const part of parts) {
    if (part.type !== "text") continue;
    for (const m of part.text.matchAll(/\*\*([^*]+)\*\*/g)) {
      const p = matchTeaser(m[1], teasers);
      if (p) out.add(p.handle);
    }
  }
  return out;
}

type Variant = "panel" | "messenger";

/**
 * Renders a conversation. "panel": the side panel look. "messenger": WhatsApp-like
 * bubbles with tails, timestamps and read ticks (used inside collection heroes).
 * Recommended tests are linked inline in the text; only unmentioned ones get a card.
 */
export function Thread({
  turns,
  locale,
  dict,
  onNavigate,
  variant = "panel",
}: {
  turns: Turn[];
  locale: Locale;
  dict: Dictionary;
  onNavigate?: () => void;
  variant?: Variant;
}) {
  const wa = variant === "messenger";
  const userCls = wa
    ? "relative max-w-[85%] rounded-2xl rounded-tr-sm bg-lind px-3 py-2 pb-5 text-[0.9rem] leading-relaxed text-ink shadow-[0_1px_1px_rgba(18,33,55,0.08)] before:absolute before:-right-1.5 before:top-0 before:h-3 before:w-3 before:bg-lind before:[clip-path:polygon(0_0,100%_0,0_100%)]"
    : "max-w-[85%] rounded-2xl rounded-tr-md bg-green px-4 py-3 text-[0.95rem] leading-relaxed text-white";
  const botCls = wa
    ? "relative max-w-[92%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 pb-5 text-[0.9rem] leading-[1.75] text-ink shadow-[0_1px_1px_rgba(18,33,55,0.08)] before:absolute before:-left-1.5 before:top-0 before:h-3 before:w-3 before:bg-white before:[clip-path:polygon(100%_0,0_0,100%_100%)]"
    : "max-w-[92%] rounded-2xl rounded-tl-md bg-surface px-4 py-3 text-[0.95rem] leading-[1.75]";
  const stamp = (at: number, ticks = false) =>
    wa ? (
      <span className="pointer-events-none absolute bottom-1 right-2.5 inline-flex items-center gap-0.5 text-[0.65rem] leading-none text-ink-muted/80">
        {time(at, locale)}
        {ticks && <DoubleCheckIcon width={13} height={13} className="text-green" />}
      </span>
    ) : null;

  return (
    <ol className={wa ? "space-y-2" : "space-y-3"}>
      {turns.map((turn) => {
        if (turn.role === "user") {
          return (
            <li key={turn.id} className="flex justify-end">
              <p className={userCls}>
                {turn.text}
                {stamp(turn.at, true)}
              </p>
            </li>
          );
        }
        const teasers = teasersOf(turn.parts);
        const linked = mentioned(turn.parts, teasers);
        const leftover = teasers.filter((p) => !linked.has(p.handle));
        const lastTextIndex = turn.parts.map((p) => p.type).lastIndexOf("text");
        return (
          <li key={turn.id} className={wa ? "space-y-2" : "space-y-3"}>
            {turn.pending && turn.parts.length === 0 && (
              <div className={`${botCls} !pb-2`}>
                <TypingDots label={dict.common.loading} />
              </div>
            )}
            {turn.parts.map((part, pi) =>
              part.type === "text" && part.text.trim() ? (
                <div key={pi} className={botCls}>
                  <Rich text={part.text} teasers={teasers} locale={locale} onNavigate={onNavigate} tone={wa ? "light" : "surface"} />
                  {stamp(turn.at)}
                </div>
              ) : null,
            )}
            {/* Cards only for recommended tests the text did not name; shown once the reply is complete */}
            {!turn.pending && leftover.length > 0 && lastTextIndex >= 0 && (
              <ul className={`grid gap-2 ${wa ? "max-w-[92%]" : ""}`}>
                {leftover.map((p) => (
                  <li key={p.handle}>
                    <Link
                      href={localeHref(locale, `/products/${p.handle}`)}
                      onClick={onNavigate}
                      className={`group flex gap-3 bg-white p-2.5 transition-shadow hover:shadow-float ${
                        wa ? "rounded-2xl rounded-tl-sm shadow-[0_1px_1px_rgba(18,33,55,0.08)]" : "rounded-2xl border border-line/70 p-3 shadow-card"
                      }`}
                    >
                      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface">
                        {p.image && <Image src={shopifyImage(p.image, 240)} alt="" fill sizes="56px" className="object-cover" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[0.9rem] font-semibold leading-snug text-ink">{p.title}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-ink-muted">
                          {p.sample && (
                            <span className="inline-flex items-center gap-1">
                              <DropIcon width={12} height={12} className="text-green" />
                              {p.sample}
                            </span>
                          )}
                          {p.values > 0 && <span>{p.values === 1 ? dict.product.valueCount : fill(dict.product.valuesCount, { n: p.values })}</span>}
                          <span className="ml-auto inline-flex items-center gap-1 font-semibold tabular-nums text-green">
                            {formatMoney({ amount: p.price, currencyCode: p.currency }, locale)} <ArrowRight width={12} height={12} />
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {turn.error && <p className="text-sm text-[#b42318]">{turn.error}</p>}
          </li>
        );
      })}
    </ol>
  );
}
