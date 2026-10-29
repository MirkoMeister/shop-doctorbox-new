import { KIT_RULES, type TubeType } from "@/content/kit/rules";

export type KitMarker = {
  id: string;
  name: { de: string; en: string };
  topic: { de: string; en: string };
  material: string;
  volumeUl: number;
  price: number;
  labCode?: string;
  note?: string;
};

export type KitTube = { material: string; markers: string[]; volumeUl: number };

export type KitPlan = {
  tubes: KitTube[];
  tasso: number;
  bloodUl: number;
  markersPrice: number;
  basePrice: number;
  extraTassoPrice: number;
  total: number;
  /** Selection breaks a rule; the kit cannot be ordered like this */
  problems: ("tooManyMarkers" | "tooManyTasso" | "unknownMaterial" | "volumeTooLarge")[];
};

type Rules = typeof KIT_RULES;
const cents = (n: number) => Math.round(n * 100) / 100;

/**
 * Tubes, Tasso devices and price for a selection. Values share a tube only with the same
 * material; within a material the values are packed largest first into as few tubes as fit
 * (a value never spans two tubes). Pure, so the page and the cart compute the same kit.
 */
export function planKit(markers: KitMarker[], rules: Rules = KIT_RULES): KitPlan {
  const tubeTypes = rules.tubes as Record<string, TubeType>;
  const problems: KitPlan["problems"] = [];
  const tubes: KitTube[] = [];
  const byMaterial = new Map<string, KitMarker[]>();
  for (const m of markers) byMaterial.set(m.material, [...(byMaterial.get(m.material) ?? []), m]);

  for (const [material, group] of byMaterial) {
    const type = tubeTypes[material];
    if (!type) {
      problems.push("unknownMaterial");
      continue;
    }
    const open: KitTube[] = [];
    for (const m of [...group].sort((a, b) => b.volumeUl - a.volumeUl)) {
      if (m.volumeUl > type.usableUl) problems.push("volumeTooLarge");
      const fit = open.find((t) => t.volumeUl + m.volumeUl <= type.usableUl);
      if (fit) {
        fit.markers.push(m.id);
        fit.volumeUl += m.volumeUl;
      } else open.push({ material, markers: [m.id], volumeUl: m.volumeUl });
    }
    tubes.push(...open);
  }

  const drawn = tubes.filter((t) => tubeTypes[t.material]?.collection === "tasso");
  const bloodUl = drawn.reduce((s, t) => s + t.volumeUl, 0);
  const tasso = drawn.length === 0 ? 0 : rules.tassoMode === "perTube" ? drawn.length : Math.ceil(bloodUl / rules.tassoYieldUl);

  if (markers.length > rules.maxMarkers) problems.push("tooManyMarkers");
  if (tasso > rules.maxTasso) problems.push("tooManyTasso");

  const markersPrice = cents(markers.reduce((s, m) => s + m.price, 0));
  const basePrice = markers.length ? rules.basePrice : 0;
  const extraTassoPrice = cents(Math.max(0, tasso - rules.includedTasso) * rules.extraTassoPrice);
  return { tubes, tasso, bloodUl, markersPrice, basePrice, extraTassoPrice, total: cents(markersPrice + basePrice + extraTassoPrice), problems: [...new Set(problems)] };
}
