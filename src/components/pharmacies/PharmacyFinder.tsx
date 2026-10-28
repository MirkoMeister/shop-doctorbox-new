"use client";

import { useMemo, useState } from "react";
import { PinIcon, SearchIcon, ClockIcon, PhoneIcon } from "@/components/ui/Icons";
import type { Pharmacy, PharmacyCopy } from "@/content/pharmacies";
import { fill } from "@/lib/i18n/dictionaries";

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

/** Searchable list of partner pharmacies, grouped by city. */
export function PharmacyFinder({ locations, t }: { locations: Pharmacy[]; t: PharmacyCopy }) {
  const [query, setQuery] = useState("");
  const q = norm(query);
  const hits = useMemo(
    () => (q ? locations.filter((l) => norm(`${l.name} ${l.city} ${l.zip} ${l.street}`).includes(q)) : locations),
    [locations, q],
  );
  const cities = useMemo(() => {
    const map = new Map<string, Pharmacy[]>();
    for (const l of hits) map.set(l.city, [...(map.get(l.city) ?? []), l]);
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0], "de"));
  }, [hits]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative block w-full sm:max-w-md">
          <span className="sr-only">{t.search}</span>
          <SearchIcon width={18} height={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-full border border-line bg-white py-3.5 pl-11 pr-4 text-[0.95rem] shadow-card focus:border-green focus:outline-none focus:ring-2 focus:ring-turquoise/60"
          />
        </label>
        <p className="text-sm text-ink-muted">{hits.length === 1 ? t.countOne : fill(t.count, { n: hits.length })}</p>
      </div>

      {hits.length === 0 ? (
        <div className="mt-8 rounded-[var(--radius-card)] border border-line bg-surface p-8 text-center">
          <p className="h4">{t.empty}</p>
          <p className="mt-2 text-ink-muted">{t.emptyText}</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-10">
          {cities.map(([city, list]) => (
            <section key={city} aria-labelledby={`city-${city}`}>
              <h3 id={`city-${city}`} className="h4 flex items-center gap-2">
                <PinIcon width={18} height={18} className="text-green" />
                {city}
              </h3>
              <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {list.map((l) => {
                  const address = `${l.street}, ${l.zip} ${l.city}`;
                  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${l.name}, ${address}`)}`;
                  return (
                    <li key={`${l.name}-${l.street}`} className="flex flex-col rounded-[var(--radius-card)] border border-line/70 bg-white p-5 shadow-card">
                      <div className="flex flex-wrap gap-1.5">
                        {l.services.map((s) => (
                          <span key={s} className={`chip !px-2.5 !py-1 !text-xs ${s === "sampling" ? "!bg-moss !text-soft" : ""}`}>
                            {t.services[s]}
                          </span>
                        ))}
                      </div>
                      <h4 className="mt-3 font-semibold leading-snug">{l.name}</h4>
                      <p className="mt-1 text-sm text-ink-muted">{address}</p>
                      <dl className="mt-3 grid gap-1.5 text-sm">
                        {l.hours && (
                          <div className="flex items-start gap-2">
                            <dt className="sr-only">{t.hours}</dt>
                            <ClockIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
                            <dd>{l.hours}</dd>
                          </div>
                        )}
                        {l.phone && (
                          <div className="flex items-start gap-2">
                            <dt className="sr-only">Telefon</dt>
                            <PhoneIcon width={16} height={16} className="mt-0.5 shrink-0 text-green" />
                            <dd>
                              <a href={`tel:${l.phone.replace(/\s+/g, "")}`} className="hover:text-green">{l.phone}</a>
                            </dd>
                          </div>
                        )}
                      </dl>
                      {l.note && <p className="mt-3 text-xs leading-snug text-ink-muted">{l.note}</p>}
                      <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-4 text-sm font-medium">
                        <a href={maps} target="_blank" rel="noopener" className="text-green hover:underline">{t.map} →</a>
                        {l.website && (
                          <a href={l.website} target="_blank" rel="noopener" className="text-green hover:underline">Website →</a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
