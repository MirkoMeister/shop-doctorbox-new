import type { Locale } from "@/lib/i18n/config";

/**
 * Instructions for use: one page per kit at /ifu/<slug> with the DoctorBox instructions and the
 * manufacturers' own instructions for every component. PDFs go to public/ifu/<slug>/ (or a Shopify
 * Files URL); a component without `ifu.href` shows "folgt" when it needs instructions, "–" when not.
 */
export type IfuDoc = { href: string; label: Record<Locale, string> };

export type IfuComponent = {
  name: string;
  /** manufacturer, EU representative, importer as printed on the label */
  manufacturer: string;
  /** regulatory marking, e.g. "MD, CE 2797, steril" */
  marking: string;
  /** short use note (e.g. from the packaging), shown under the name */
  usage?: string;
  /** EU declaration of conformity (PDF) */
  conformity?: string;
  /** further manufacturer documents, e.g. a collection guide or certificates */
  extra?: IfuDoc | IfuDoc[];
  /**
   * `version`: document number and revision printed on the IFU.
   * `onPack`: no separate IFU, the instructions are printed on the packaging; `onProduct`: on the product itself.
   */
  ifu: { required: boolean; href?: string; version?: string; onPack?: boolean; onProduct?: boolean };
};

export type Ifu = {
  slug: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  /** the DoctorBox step-by-step instructions (PDF) */
  doctorbox?: string;
  /** page with more about the kit */
  related?: { href: string; label: Record<Locale, string> };
  /** the sets this instructions page belongs to (the printed instructions are in each of them) */
  kits?: IfuKit[];
  /** date of the last check of the listed documents */
  updated: string;
  /** parts grouped by sample (urine, dried blood, swab …) and shipping */
  groups: IfuGroup[];
};

export type IfuKit = { name: string; note?: Record<Locale, string>; href: string };

export type IfuGroup = { title: Record<Locale, string>; components: IfuComponent[] };

const GROUP = {
  tasso: { de: "Blutabnahme am Oberarm (Tasso+)", en: "Upper-arm blood collection (Tasso+)" },
  urine: { de: "Urinprobe", en: "Urine sample" },
  dbs: { de: "Trockenblut (DBS)", en: "Dried blood spot (DBS)" },
  rectal: { de: "Rektalabstrich", en: "Rectal swab" },
  vaginal: { de: "Vaginalabstrich", en: "Vaginal swab" },
  shipping: { de: "Versand", en: "Shipping" },
};

/** Parts that are in several kits */
const SOFT_ZELLIN: IfuComponent = {
  name: "Soft-Zellin® Alkoholtupfer",
  manufacturer: "Paul Hartmann AG, Heidenheim",
  marking: "MD, CE",
  usage: "Der gebrauchsfertige Alkoholtupfer zur Hautreinigung vor subkutanen Injektionen und vor der Entnahme von Kapillarblutproben.",
  // only an EU declaration of conformity (Kingstar Medical, OEM), no IFU: instructions on the box
  ifu: { required: false, onPack: true },
};

const DERMAPLAST: IfuComponent = {
  name: "DermaPlast® Pflaster",
  manufacturer: "Paul Hartmann AG, Heidenheim",
  marking: "MD, CE",
  usage:
    "Zur Versorgung kleinerer Verletzungen bei empfindlicher Haut bzw. besonders sensibler Körperpartien. Bei der Applikation auf trockene und saubere Haut achten.",
  // Hartmann declaration for DermaPlast water-resistant (REF 535151/535152), valid until 2030-10-31
  conformity: "/ifu/tasso/dermaplast-konformitaetserklaerung.pdf",
  ifu: { required: false, onPack: true },
};

const SICHERHEITSBEUTEL: IfuComponent = {
  name: "Sicherheitsbeutel mit Saugeinlage",
  manufacturer: "Süsse Labortechnik GmbH & Co. KG, Gudensberg",
  marking: "sonstiges Produkt",
  usage: "Für den sicheren Versand von Probenmaterial.",
  // use instructions printed on the bag (5 steps, UN 3373)
  ifu: { required: false, onPack: true },
};

const VERSANDBEUTEL: IfuComponent = { name: "Versandbeutel", manufacturer: "BB-Verpackungen GmbH, Delmenhorst", marking: "sonstiges Produkt", ifu: { required: false } };

/** Dried blood spot set: card, lancets, swabs, plasters, compress, zip bag (also in the STI kits) */
const DBS_PARTS: IfuComponent[] = [
  {
    name: "TFN BioSample Card 8.460.0050.A",
    manufacturer: "Ahlstrom Germany GmbH, Bärenstein",
    marking: "IVD, CE",
    usage: "Probenbehältnis für die Aufnahme, den Transport und die Lagerung von menschlichen Vollblutproben.",
    // Ahlstrom IFU "TFN-Specimen Collection Card" (S6_FB_0003, Rev. 14, 2025-04)
    ifu: { required: true, href: "/ifu/dbs/tfn-biosample-card-gebrauchsanweisung-de.pdf", version: "Rev. 14" },
  },
  {
    name: "Unistik® Touch 16G, REF P002816A1",
    manufacturer: "Owen Mumford Ltd, UK; EU-Bev./Importeur: Owen Mumford GmbH",
    marking: "MD, CE 1639, steril",
    usage: "Einweg-Sicherheitslanzette zur Entnahme von Kapillarblutproben.",
    // multilingual Owen Mumford IFU (incl. German), covers 16G REF P002816A1
    ifu: { required: true, href: "/ifu/dbs/unistik-touch-gebrauchsinformation.pdf", version: "IFU MCC 0220/04" },
  },
  { ...SOFT_ZELLIN },
  { ...DERMAPLAST },
  // no IFU; EU declaration of conformity under MDR (class I sterile, REF 61200-61204/61207-61212, valid until
  // 2029-01-16) plus the TÜV Rheinland certificates (MDR HZ 1007442-1, ISO 13485 SX 1007442-1)
  {
    name: "LEINASAN Wundkompresse",
    manufacturer: "Leina-Werke, Windeck",
    marking: "MD, CE 0197, steril",
    conformity: "/ifu/dbs/leinasan-konformitaetserklaerung-2024.pdf",
    extra: [
      { href: "/ifu/dbs/leina-mdr-zertifikat-hz-1007442-1.pdf", label: { de: "EU-Zertifikat MDR (TÜV Rheinland, bis 16.01.2029)", en: "EU MDR certificate (TÜV Rheinland, until 2029-01-16)" } },
      { href: "/ifu/dbs/leina-iso-13485-zertifikat-sx-1007442-1.pdf", label: { de: "Zertifikat ISO 13485 (TÜV Rheinland, bis 04.08.2028)", en: "ISO 13485 certificate (TÜV Rheinland, until 2028-08-04)" } },
    ],
    ifu: { required: false },
  },
  {
    name: "Druckverschlussbeutel mit Trockenmittelbeutel",
    manufacturer: "Elke Plastic GmbH; TROPACK Packmittel GmbH",
    marking: "sonstige Produkte",
    ifu: { required: false },
  },
];

/** Rectal swab set (STI kits) */
const RECTAL_PARTS: IfuComponent[] = [
  {
    name: "Rectal Self FLOQSwab®, REF 5U173S01",
    manufacturer: "Copan Italia S.p.A., Brescia",
    marking: "MD, CE 0123, steril",
    usage: "Tupfer für die Entnahme von Rektalproben.",
    // Copan patient IFU HPI068R00 (2023-11, multilingual incl. German)
    ifu: { required: true, href: "/ifu/rektal/rectal-self-floqswab-gebrauchsanweisung.pdf", version: "HPI068R00 (2023-11)" },
  },
  // no IFU from the manufacturer, only a technical data sheet (TD-MaiMed-Copolymer-sterile-20260715-REV02)
  {
    name: "MaiMed® Copolymer Untersuchungshandschuh, steril",
    manufacturer: "B. MaiMed® GmbH, Neuenkirchen",
    marking: "MD, CE 0123",
    extra: { href: "/ifu/rektal/maimed-copolymer-datenblatt.pdf", label: { de: "Technisches Datenblatt", en: "Technical data sheet" } },
    ifu: { required: false },
  },
  { name: "Leerröhrchen 12 × 80 mm", manufacturer: "Copan Italia S.p.A.", marking: "sonstiges Produkt (Zubehör)", ifu: { required: false } },
];

export const IFUS: Ifu[] = [
  {
    slug: "tasso",
    title: {
      de: "Tasso-Anleitung (Oberarmblutabnahme Serum und EDTA)",
      en: "Tasso instructions (upper-arm blood collection, serum and EDTA)",
    },
    intro: {
      de: "Für Tests mit Blutabnahme am Oberarm mit dem Tasso+ Gerät. Hier findest du unsere Schritt-für-Schritt-Anleitung und die Gebrauchsanweisungen der Hersteller aller Bestandteile des Sets.",
      en: "For tests with upper-arm blood collection using the Tasso+ device. Here you find our step-by-step instructions and the manufacturers' instructions for use for every part of the kit.",
    },
    related: { href: "/pages/tasso", label: { de: "Mehr zu Tasso+", en: "More about Tasso+" } },
    updated: "2026-11-04",
    groups: [
      {
        title: GROUP.tasso,
        components: [
          {
            name: "Tasso+ Blutentnahmehilfe",
            manufacturer: "Tasso, Inc., Seattle, USA; EU-Bev.: Emergo Europe BV; Importeur: MedEnvoy",
            marking: "MD, CE 2797, steril",
            usage: "Ermöglicht die Selbstentnahme einer Kapillarblutprobe in Verbindung mit einem kompatiblen Probenentnahmegefäß.",
            // translations: https://www.tassoinc.com/eu/tassoplus-kit-ifu
            ifu: { required: true, href: "/ifu/tasso/tasso-plus-gebrauchsanweisung-de.pdf", version: "PN0762-01, Rev. 03" },
          },
          {
            name: "BD Microtainer® Serumröhrchen (rote Kappe)",
            manufacturer: "Becton, Dickinson and Company, USA; EU-Bev.: Becton Dickinson Ireland Ltd.",
            marking: "IVD, CE",
            usage: "BD Microtainer® Röhrchen werden verwendet, um kapilläre Blutproben zu sammeln, zu transportieren und aufzubewahren.",
            // BD IFU for the chemistry tubes (serum, SST, lithium heparin, PST, fluoride)
            ifu: { required: true, href: "/ifu/tasso/bd-microtainer-serum-gebrauchsanweisung-de.pdf", version: "Version 01, 2022-02" },
          },
          {
            name: "BD Microtainer® K2EDTA-Röhrchen (lila Kappe)",
            manufacturer: "Becton, Dickinson and Company, USA; EU-Bev.: Becton Dickinson Ireland Ltd.",
            marking: "IVD, CE",
            usage: "BD Microtainer® Röhrchen werden verwendet, um kapilläre Blutproben zu sammeln, zu transportieren und aufzubewahren.",
            // separate BD IFU for the EDTA tube, not yet available
            ifu: { required: true },
          },
          SOFT_ZELLIN,
          DERMAPLAST,
          {
            name: "Einweg-Wärmebeutel",
            manufacturer: "Dispotech Srl, Gordona, Italien",
            marking: "MD, CE 1936",
            usage: "Selbstwärmende Kompresse.",
            // instructions, warnings and indications printed on the pack
            ifu: { required: false, onPack: true },
          },
        ],
      },
      { title: GROUP.shipping, components: [SICHERHEITSBEUTEL, VERSANDBEUTEL] },
    ],
  },
  {
    slug: "vaginal-dbs-rektal",
    title: {
      de: "Anleitung Vaginalabstrich, Trockenblut und Rektalabstrich",
      en: "Instructions vaginal swab, dried blood spot and rectal swab",
    },
    intro: {
      de: "Je nach Set nimmst du einen Vaginalabstrich, Trockenblut aus der Fingerkuppe oder einen Rektalabstrich. Hier findest du unsere Schritt-für-Schritt-Anleitung und die Gebrauchsanweisungen der Hersteller aller Bestandteile.",
      en: "Depending on the kit you take a vaginal swab, dried blood from the fingertip or a rectal swab. Here you find our step-by-step instructions and the manufacturers' instructions for use for every part.",
    },
    kits: [
      { name: "STI Complete Trio Frauen", href: "/products/sti-complete-trio-fur-frauen" },
      { name: "STI Pro", note: { de: "Vaginal + Trockenblut", en: "vaginal + dried blood" }, href: "/products/sti-pro-10" },
      { name: "STI Standard", note: { de: "Vaginal + Trockenblut", en: "vaginal + dried blood" }, href: "/products/sti-standard-5" },
      { name: "STI Basic", note: { de: "Vaginalabstrich", en: "vaginal swab" }, href: "/products/sti-test-1" },
      { name: "STI Essential", note: { de: "Vaginalabstrich", en: "vaginal swab" }, href: "/products/sti-test" },
    ],
    updated: "2026-11-04",
    groups: [
      {
        title: GROUP.vaginal,
        components: [
          {
            name: "Self Vaginal FLOQSwab®, REF 552C.80",
            manufacturer: "Copan Italia S.p.A., Brescia",
            marking: "MD, CE 0123, steril",
            usage: "Abstrichtupfer für die eigenständige vaginale Probenahme.",
            // patient IFU HPI031R05 (2022-05, multilingual incl. German); HPC146R05 still to add
            ifu: { required: true, href: "/ifu/vaginal/self-vaginal-floqswab-gebrauchsanweisung.pdf", version: "HPI031R05 (2022-05)" },
          },
        ],
      },
      { title: GROUP.dbs, components: DBS_PARTS },
      // the MaiMed glove of the vaginal set is the same as in the rectal set, listed once there
      { title: GROUP.rectal, components: RECTAL_PARTS },
      { title: GROUP.shipping, components: [SICHERHEITSBEUTEL, VERSANDBEUTEL] },
    ],
  },
  {
    slug: "urin-dbs-rektal",
    title: {
      de: "Anleitung Urin, Trockenblut und Rektalabstrich",
      en: "Instructions urine, dried blood spot and rectal swab",
    },
    intro: {
      de: "Je nach Set nimmst du eine Urinprobe, Trockenblut aus der Fingerkuppe oder einen Rektalabstrich. Hier findest du unsere Schritt-für-Schritt-Anleitung und die Gebrauchsanweisungen der Hersteller aller Bestandteile.",
      en: "Depending on the kit you take a urine sample, dried blood from the fingertip or a rectal swab. Here you find our step-by-step instructions and the manufacturers' instructions for use for every part.",
    },
    kits: [
      { name: "STI Complete Trio Männer", href: "/products/sti-complete-trio-fur-manner" },
      { name: "STI Pro", note: { de: "Urin + Trockenblut", en: "urine + dried blood" }, href: "/products/sti-pro-10" },
      { name: "STI Standard", note: { de: "Urin + Trockenblut", en: "urine + dried blood" }, href: "/products/sti-standard-5" },
      { name: "STI Basic", note: { de: "Rektal", en: "rectal" }, href: "/products/sti-test-1" },
      { name: "STI Basic", note: { de: "Urin", en: "urine" }, href: "/products/sti-test-1" },
      { name: "STI Essential", note: { de: "Urin", en: "urine" }, href: "/products/sti-test" },
      { name: "STI Select", href: "/products/sti-test-hiv-syphilis-lues-hepatitis-c-geschlechtskrankheiten-test" },
    ],
    updated: "2026-11-04",
    groups: [
      {
        title: GROUP.urine,
        components: [
          {
            name: "Aptima™ Urinprobenentnahmekit, Best.-Nr. 301040",
            manufacturer: "Hologic, Inc., USA; EU-Bev.: Hologic BV, Belgien",
            marking: "IVD, CE",
            usage: "Probentransportröhrchen mit Einwegpipette für die Entnahme und den Transport von Urinproben.",
            // package insert (IVDR, 2022-05); the one-page collection guide DS-01697-DEU-DE Rev 001 as an extra
            ifu: { required: true, href: "/ifu/urin/aptima-urin-gebrauchsanweisung-de.pdf", version: "AW-26251-801 Rev. 001" },
            extra: { href: "/ifu/urin/aptima-urin-entnahmeanleitung-de.pdf", label: { de: "Entnahmeanleitung", en: "Collection guide" } },
          },
          {
            name: "Safe2Pcanter Urinbecher, REF PCAN01",
            manufacturer: "REAL Digital International Ltd, UK; EU-Bev.: Casus Europe B.V.",
            marking: "MD, CE",
            usage: "Urinbecher zur Selbstentnahme einer Urinprobe, zum einmaligen Gebrauch, nicht steril.",
            // pictorial instructions printed on the cup; RDi technical information sheet TIS-1.0 Issue 4 (2025-12, English)
            ifu: { required: false, onProduct: true },
            extra: { href: "/ifu/urin/safe2pcanter-datenblatt-en.pdf", label: { de: "Technisches Datenblatt (englisch)", en: "Technical information sheet" } },
          },
        ],
      },
      { title: GROUP.dbs, components: DBS_PARTS },
      { title: GROUP.rectal, components: RECTAL_PARTS },
      { title: GROUP.shipping, components: [SICHERHEITSBEUTEL, VERSANDBEUTEL] },
    ],
  },
  {
    slug: "dbs",
    title: {
      de: "DBS-Anleitung (Blutproben DBS, u. a. Vitamin B12)",
      en: "DBS instructions (dried blood spot samples, e.g. vitamin B12)",
    },
    intro: {
      de: "Für Tests mit Trockenblut (DBS): ein paar Tropfen Kapillarblut aus der Fingerkuppe auf der Trockenblutkarte, unter anderem für den Vitamin-B12-Test. Hier findest du unsere Schritt-für-Schritt-Anleitung und die Gebrauchsanweisungen der Hersteller aller Bestandteile des Sets.",
      en: "For dried blood spot (DBS) tests: a few drops of capillary blood from the fingertip on the blood spot card, among others for the vitamin B12 test. Here you find our step-by-step instructions and the manufacturers' instructions for use for every part of the kit.",
    },
    updated: "2026-11-04",
    groups: [
      { title: GROUP.dbs, components: DBS_PARTS },
      { title: GROUP.shipping, components: [{ ...VERSANDBEUTEL }] },
    ],
  },
];

export const ifuBySlug = (slug: string) => IFUS.find((i) => i.slug === slug) ?? null;

export const IFU_COPY: Record<
  Locale,
  {
    indexTitle: string;
    indexIntro: string;
    crumb: string;
    kits: string;
    ours: string;
    oursText: string;
    oursCta: string;
    pending: string;
    componentsTitle: string;
    componentsPending: string;
    component: string;
    manufacturer: string;
    marking: string;
    ifu: string;
    ifuLink: string;
    notRequired: string;
    onPack: string;
    onProduct: string;
    conformity: string;
    legend: string;
    updated: string;
    open: string;
  }
> = {
  de: {
    indexTitle: "Anleitungen",
    indexIntro: "Zu jedem Probenset gibt es unsere Schritt-für-Schritt-Anleitung und die Gebrauchsanweisungen der Hersteller der einzelnen Bestandteile.",
    crumb: "Anleitungen",
    kits: "Diese Anleitung liegt folgenden Sets bei",
    ours: "Unsere Anleitung",
    oursText: "Schritt für Schritt von der Vorbereitung bis zum Rückversand, so wie sie auch im Set liegt.",
    oursCta: "Anleitung öffnen (PDF)",
    pending: "folgt",
    componentsTitle: "Bestandteile und Herstelleranleitungen",
    componentsPending: "Die Übersicht der Bestandteile mit den Herstelleranleitungen folgt in Kürze.",
    component: "Bestandteil",
    manufacturer: "Hersteller",
    marking: "Kennzeichnung",
    ifu: "Herstelleranleitung",
    ifuLink: "PDF öffnen",
    notRequired: "–",
    onPack: "Angaben auf der Verpackung",
    onProduct: "Angaben auf dem Produkt",
    conformity: "Konformitätserklärung",
    legend: "MD: Medizinprodukt. IVD: In-vitro-Diagnostikum. CE mit Nummer: Kennnummer der benannten Stelle. „–“: Für diesen Bestandteil gibt es keine eigene Gebrauchsanweisung.",
    updated: "Stand",
    open: "Zur Anleitung",
  },
  en: {
    indexTitle: "Instructions",
    indexIntro: "For every sample kit there are our step-by-step instructions and the manufacturers' instructions for use for its parts.",
    crumb: "Instructions",
    kits: "These instructions come with",
    ours: "Our instructions",
    oursText: "Step by step from preparation to sending the sample back, the same as in the kit.",
    oursCta: "Open instructions (PDF)",
    pending: "to follow",
    componentsTitle: "Parts and manufacturer instructions",
    componentsPending: "The list of parts with the manufacturer instructions will follow shortly.",
    component: "Part",
    manufacturer: "Manufacturer",
    marking: "Marking",
    ifu: "Manufacturer instructions",
    ifuLink: "Open PDF",
    notRequired: "–",
    onPack: "Printed on the packaging",
    onProduct: "Printed on the product",
    conformity: "Declaration of conformity",
    legend: "MD: medical device. IVD: in vitro diagnostic device. CE with number: identification number of the notified body. \"–\": this part has no instructions of its own.",
    updated: "Last checked",
    open: "Open instructions",
  },
};
