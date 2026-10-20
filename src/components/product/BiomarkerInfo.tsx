"use client";

import { useState } from "react";
import type { BiomarkerEntry, Topic } from "@/content/biomarkers";
import { Highlight } from "@/components/ui/Highlight";
import { ChevronDown } from "@/components/ui/Icons";

export type BiomarkerInfoItem = { name: string; entry: BiomarkerEntry };

/**
 * Info box on product pages: one tab per analysed value, two calm columns on
 * desktop and an accordion on phones. Content comes from src/content/biomarkers.ts.
 */
export function BiomarkerInfo({ items, topic }: { items: BiomarkerInfoItem[]; topic: Topic }) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;
  const current = items[Math.min(active, items.length - 1)];

  return (
    <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8" aria-labelledby="biomarker-info-title">
      <p className="text-sm font-medium text-green">{topic.kicker}</p>
      <h2 id="biomarker-info-title" className="h2 mt-2">
        <Highlight text={topic.title} />
      </h2>

      <div className="mt-8 rounded-[var(--radius-panel)] bg-lind p-5 text-moss sm:p-8">
        {items.length > 1 && (
          <div role="tablist" aria-label="Analysierte Werte" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {items.map((it, i) => (
              <button
                key={it.name}
                role="tab"
                type="button"
                aria-selected={i === active}
                aria-controls="biomarker-panel"
                onClick={() => setActive(i)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  i === active ? "bg-green text-white" : "bg-white/60 text-moss hover:bg-white"
                }`}
              >
                {it.name}
              </button>
            ))}
          </div>
        )}

        <div id="biomarker-panel" role="tabpanel" className={items.length > 1 ? "mt-6" : ""}>
          {items.length === 1 && <h3 className="h4 mb-4">{current.name}</h3>}

          {/* Desktop: two columns */}
          <div className="hidden gap-10 md:grid md:grid-cols-2">
            <div className="space-y-6">
              {current.entry.left.map((item) => (
                <div key={item.label}>
                  <h4 className="text-xl font-semibold">{item.label}</h4>
                  <p className="mt-1.5 text-[1.0625rem] leading-relaxed text-moss/90">{item.text}</p>
                </div>
              ))}
              {current.entry.tags && (
                <div>
                  <p className="font-semibold">{current.entry.tags.label}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {current.entry.tags.values.map((v) => (
                      <li key={v} className="rounded-full bg-lind-deep px-3 py-1 text-sm">
                        {v}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-6">
              {current.entry.right.map((item) => (
                <div key={item.label} className="contents">
                  <dt className="pt-0.5 text-xl font-semibold leading-tight">{item.label}</dt>
                  <dd className="text-[1.0625rem] leading-relaxed text-moss/90">{item.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Phone: accordion */}
          <div className="divide-y divide-lind-deep md:hidden">
            {[...current.entry.left, ...(current.entry.tags ? [{ label: current.entry.tags.label, text: current.entry.tags.values.join(", ") }] : []), ...current.entry.right].map(
              (item, i) => (
                <details key={item.label} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-3.5 font-semibold [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-4 leading-relaxed text-moss/90">{item.text}</p>
                </details>
              ),
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-moss/70">{topic.note}</p>
      </div>
    </section>
  );
}
