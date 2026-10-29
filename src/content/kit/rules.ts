/**
 * Rules for individual kits (/pages/eigener-test). The figures marked PLATZHALTER are
 * assumptions until the lab confirms them; the configurator says so on the page while
 * `placeholder` is true here or in biomarkers.json.
 */
export type Collection = "tasso" | "none";

export type TubeType = {
  label: { de: string; en: string };
  /** Blood the lab can use from one tube, after its own dead volume */
  usableUl: number;
  /** How the sample is taken: a Tasso device fills a tube, "none" = no blood draw (urine, swab …) */
  collection: Collection;
};

export const KIT_RULES = {
  placeholder: true,
  /** More values would mean more tubes than a home draw can fill */
  maxMarkers: 15,
  tubes: {
    Serum: { label: { de: "Serum-Röhrchen", en: "Serum tube" }, usableUl: 400, collection: "tasso" }, // PLATZHALTER
    EDTA: { label: { de: "EDTA-Röhrchen", en: "EDTA tube" }, usableUl: 400, collection: "tasso" }, // PLATZHALTER
  } satisfies Record<string, TubeType>,
  /** One Tasso device fills one tube (PLATZHALTER: "perTube"), or devices follow the total volume ("byVolume") */
  tassoMode: "perTube" as "perTube" | "byVolume",
  tassoYieldUl: 450, // PLATZHALTER, only used with "byVolume"
  maxTasso: 3, // PLATZHALTER
  /** Kit, shipping and lab handling; the first Tasso is included */
  basePrice: 29, // PLATZHALTER
  includedTasso: 1,
  extraTassoPrice: 15, // PLATZHALTER
};
