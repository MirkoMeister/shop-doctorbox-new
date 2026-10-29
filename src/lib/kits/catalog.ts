import data from "@/content/kit/biomarkers.json";
import { KIT_RULES } from "@/content/kit/rules";
import type { Locale } from "@/lib/i18n/config";
import type { KitMarker } from "./plan";

export const KIT_MARKERS = data.items as KitMarker[];

/** Prices or volumes are still assumptions (lab list or rules not confirmed) */
export const kitIsPlaceholder = data.placeholder || KIT_RULES.placeholder;

export type KitGroup = { key: string; label: string; ids: string[] };

/** Topics in list order, values sorted by name */
export function kitGroups(locale: Locale): KitGroup[] {
  const groups = new Map<string, KitGroup>();
  for (const m of KIT_MARKERS) {
    const key = m.topic.de;
    const g = groups.get(key) ?? { key, label: m.topic[locale], ids: [] };
    g.ids.push(m.id);
    groups.set(key, g);
  }
  const name = new Map(KIT_MARKERS.map((m) => [m.id, m.name[locale]]));
  return [...groups.values()].map((g) => ({ ...g, ids: g.ids.sort((a, b) => name.get(a)!.localeCompare(name.get(b)!, locale)) }));
}
