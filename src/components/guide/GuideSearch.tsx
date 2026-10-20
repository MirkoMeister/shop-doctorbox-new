"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { AskMiraButton } from "@/components/assistant/AskMiraButton";
import { ArrowRight, SearchIcon } from "@/components/ui/Icons";
import { GUIDE_BASE } from "@/lib/content/guides";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { fill, type Dictionary } from "@/lib/i18n/dictionaries";

export type GuideEntry = {
  handle: string;
  title: string;
  topic: string;
  description: string | null;
  /** first sentences of the page text */
  excerpt: string;
  /** lab values mentioned on the page */
  tags: string[];
};

const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Guide landing: instant search over all guide pages (title + description),
 * grouped by topic when nothing is typed.
 */
export function GuideSearch({
  entries,
  topics,
  topicOrder,
  locale,
  dict,
}: {
  entries: GuideEntry[];
  topics: Record<string, string>;
  topicOrder: string[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [q, setQ] = useState("");
  const query = useDeferredValue(q);
  const t = dict.guide;

  const results = useMemo(() => {
    const needle = fold(query.trim());
    if (!needle) return null;
    const words = needle.split(/\s+/).filter(Boolean);
    return entries
      .map((e) => {
        const title = fold(e.title);
        const desc = fold(e.description ?? "");
        const tags = fold(e.tags.join(" "));
        const body = fold(e.excerpt);
        let score = 0;
        for (const w of words) {
          if (title.includes(w)) score += title.startsWith(w) ? 4 : 3;
          else if (tags.includes(w)) score += 2;
          else if (desc.includes(w) || body.includes(w)) score += 1;
          else return null;
        }
        return { e, score };
      })
      .filter((x): x is { e: GuideEntry; score: number } => x !== null)
      .sort(
        (a, b) =>
          b.score - a.score || a.e.title.localeCompare(b.e.title, locale),
      )
      .map((x) => x.e);
  }, [entries, query, locale]);

  const groups = useMemo(() => {
    const map = new Map<string, GuideEntry[]>();
    for (const e of entries) map.set(e.topic, [...(map.get(e.topic) ?? []), e]);
    const rank = (k: string) => {
      const i = topicOrder.indexOf(k);
      return i === -1 ? 999 : i;
    };
    return Array.from(map.entries())
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([key, list]) => ({
        key,
        label: topics[key] ?? key,
        list: list.sort((a, b) => a.title.localeCompare(b.title, locale)),
      }));
  }, [entries, topics, topicOrder, locale]);

  const Row = ({ e }: { e: GuideEntry }) => (
    <Link
      href={localeHref(locale, `${GUIDE_BASE}/${e.handle}`)}
      className="group flex items-start justify-between gap-3 rounded-2xl border border-line/70 bg-white px-4 py-3.5 shadow-card transition-shadow hover:shadow-float"
    >
      <span className="min-w-0">
        <span className="block font-medium leading-snug group-hover:text-green">
          {e.title}
        </span>
        {e.description && (
          <span className="mt-1 line-clamp-2 block text-sm text-ink-muted">
            {e.description}
          </span>
        )}
        {e.tags.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-1">
            {e.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-lind/70 px-2 py-0.5 text-[0.7rem] font-medium text-moss"
              >
                {t}
              </span>
            ))}
          </span>
        )}
      </span>
      <ArrowRight
        width={18}
        height={18}
        className="mt-0.5 shrink-0 text-green"
      />
    </Link>
  );

  return (
    <div>
      <label className="relative block max-w-2xl">
        <span className="sr-only">{t.searchPlaceholder}</span>
        <SearchIcon
          width={20}
          height={20}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-ink-muted"
        />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t.searchPlaceholder}
          className="h-14 w-full rounded-full border border-line bg-white pl-13 pr-5 text-[1.05rem] shadow-card focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60"
          autoComplete="off"
        />
      </label>

      {results ? (
        <section className="mt-8" aria-live="polite">
          <p className="mb-4 text-sm text-ink-muted">
            {results.length === 1
              ? t.searchResult
              : fill(t.searchResults, { n: results.length })}
          </p>
          {results.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((e) => (
                <li key={e.handle}>
                  <Row e={e} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-[var(--radius-card)] bg-lind p-6 text-moss">
              <p className="font-semibold">{t.searchEmpty}</p>
              <p className="mt-1 text-moss/80">{t.searchEmptyHint}</p>
              <AskMiraButton
                label={dict.assistant.open}
                question={q}
                className="btn btn-primary mt-4"
              />
            </div>
          )}
        </section>
      ) : (
        <div className="mt-10 space-y-12">
          {groups.map((g) => (
            <section key={g.key} aria-labelledby={`topic-${g.key}`}>
              <h2 id={`topic-${g.key}`} className="h3 mb-4">
                {g.label}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {g.list.map((e) => (
                  <li key={e.handle}>
                    <Row e={e} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
