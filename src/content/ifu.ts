import type { Locale } from "@/lib/i18n/config";

/**
 * Instructions for use: one page per kit at /ifu/<slug> with the DoctorBox instructions and the
 * manufacturers' own instructions for every component. PDFs go to public/ifu/<slug>/ (or a Shopify
 * Files URL); a component without `ifu.href` shows "folgt" when it needs instructions, "–" when not.
 */
export type IfuComponent = {
  name: string;
  /** manufacturer, EU representative, importer as printed on the label */
  manufacturer: string;
  /** regulatory marking, e.g. "MD, CE 2797, steril" */
  marking: string;
  /** product photo under public/ifu/<slug>/ (jpg/png are pre-sized at build, webp is served as is) */
  image?: string;
  /** short use note (e.g. from the packaging), shown under the name */
  usage?: string;
  /** EU declaration of conformity (PDF) */
  conformity?: string;
  /**
   * `version`: document number and revision printed on the IFU.
   * `onPack`: no separate IFU, the instructions are printed on the packaging.
   */
  ifu: { required: boolean; href?: string; version?: string; onPack?: boolean };
};

export type Ifu = {
  slug: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  /** the DoctorBox step-by-step instructions (PDF) */
  doctorbox?: string;
  /** page with more about the kit */
  related?: { href: string; label: Record<Locale, string> };
  /** date of the last check of the listed documents */
  updated: string;
  components: IfuComponent[];
};

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
    components: [
      {
        name: "Tasso+ Blutentnahmehilfe",
        manufacturer: "Tasso, Inc., Seattle, USA; EU-Bev.: Emergo Europe BV; Importeur: MedEnvoy",
        marking: "MD, CE 2797, steril",
        image: "/ifu/tasso/tasso-plus.webp",
        usage: "Ermöglicht die Selbstentnahme einer Kapillarblutprobe in Verbindung mit einem kompatiblen Probenentnahmegefäß.",
        // translations: https://www.tassoinc.com/eu/tassoplus-kit-ifu
        ifu: { required: true, href: "/ifu/tasso/tasso-plus-gebrauchsanweisung-de.pdf", version: "PN0762-01, Rev. 03" },
      },
      {
        name: "BD Microtainer® Serumröhrchen (rote Kappe)",
        manufacturer: "Becton, Dickinson and Company, USA; EU-Bev.: Becton Dickinson Ireland Ltd.",
        marking: "IVD, CE",
        image: "/ifu/tasso/bd-microtainer-serum.jpg",
        usage: "BD Microtainer® Röhrchen werden verwendet, um kapilläre Blutproben zu sammeln, zu transportieren und aufzubewahren.",
        // BD IFU for the chemistry tubes (serum, SST, lithium heparin, PST, fluoride)
        ifu: { required: true, href: "/ifu/tasso/bd-microtainer-serum-gebrauchsanweisung-de.pdf", version: "Version 01, 2022-02" },
      },
      {
        name: "BD Microtainer® K2EDTA-Röhrchen (lila Kappe)",
        manufacturer: "Becton, Dickinson and Company, USA; EU-Bev.: Becton Dickinson Ireland Ltd.",
        marking: "IVD, CE",
        image: "/ifu/tasso/bd-microtainer-edta.jpg",
        usage: "BD Microtainer® Röhrchen werden verwendet, um kapilläre Blutproben zu sammeln, zu transportieren und aufzubewahren.",
        // separate BD IFU for the EDTA tube, not yet available
        ifu: { required: true },
      },
      {
        name: "Soft-Zellin® Alkoholtupfer",
        manufacturer: "Paul Hartmann AG, Heidenheim",
        marking: "MD, CE",
        image: "/ifu/tasso/soft-zellin.jpg",
        usage: "Der gebrauchsfertige Alkoholtupfer zur Hautreinigung vor subkutanen Injektionen und vor der Entnahme von Kapillarblutproben.",
        // only an EU declaration of conformity (Kingstar Medical, OEM), no IFU: instructions on the box
        ifu: { required: false, onPack: true },
      },
      {
        name: "DermaPlast® Pflaster",
        manufacturer: "Paul Hartmann AG, Heidenheim",
        marking: "MD, CE",
        image: "/ifu/tasso/dermaplast.jpg",
        usage:
          "Zur Versorgung kleinerer Verletzungen bei empfindlicher Haut bzw. besonders sensibler Körperpartien. Bei der Applikation auf trockene und saubere Haut achten.",
        // Hartmann declaration for DermaPlast water-resistant (REF 535151/535152), valid until 2030-10-31
        conformity: "/ifu/tasso/dermaplast-konformitaetserklaerung.pdf",
        ifu: { required: false, onPack: true },
      },
      {
        name: "Einweg-Wärmebeutel",
        manufacturer: "Dispotech Srl, Gordona, Italien",
        marking: "MD, CE 1936",
        image: "/ifu/tasso/waermekompresse.jpg",
        usage: "Selbstwärmende Kompresse.",
        // instructions, warnings and indications printed on the pack
        ifu: { required: false, onPack: true },
      },
      {
        name: "Sicherheitsbeutel mit Saugeinlage",
        manufacturer: "Süsse Labortechnik GmbH & Co. KG, Gudensberg",
        marking: "sonstiges Produkt",
        image: "/ifu/tasso/sicherheitsbeutel.jpg",
        usage: "Für den sicheren Versand von Probenmaterial.",
        // use instructions printed on the bag (5 steps, UN 3373)
        ifu: { required: false, onPack: true },
      },
      { name: "Versandbeutel", manufacturer: "BB-Verpackungen GmbH, Delmenhorst", marking: "sonstiges Produkt", ifu: { required: false } },
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
    ours: string;
    oursText: string;
    oursCta: string;
    pending: string;
    componentsTitle: string;
    photo: string;
    component: string;
    manufacturer: string;
    marking: string;
    ifu: string;
    ifuLink: string;
    notRequired: string;
    onPack: string;
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
    ours: "Unsere Anleitung",
    oursText: "Schritt für Schritt von der Vorbereitung bis zum Rückversand, so wie sie auch im Set liegt.",
    oursCta: "Anleitung öffnen (PDF)",
    pending: "folgt",
    componentsTitle: "Bestandteile und Herstelleranleitungen",
    photo: "Produktbild",
    component: "Bestandteil",
    manufacturer: "Hersteller",
    marking: "Kennzeichnung",
    ifu: "Herstelleranleitung",
    ifuLink: "PDF öffnen",
    notRequired: "–",
    onPack: "Angaben auf der Verpackung",
    conformity: "Konformitätserklärung",
    legend: "MD: Medizinprodukt. IVD: In-vitro-Diagnostikum. CE mit Nummer: Kennnummer der benannten Stelle. „–“: Für diesen Bestandteil gibt es keine eigene Gebrauchsanweisung.",
    updated: "Stand",
    open: "Zur Anleitung",
  },
  en: {
    indexTitle: "Instructions",
    indexIntro: "For every sample kit there are our step-by-step instructions and the manufacturers' instructions for use for its parts.",
    crumb: "Instructions",
    ours: "Our instructions",
    oursText: "Step by step from preparation to sending the sample back, the same as in the kit.",
    oursCta: "Open instructions (PDF)",
    pending: "to follow",
    componentsTitle: "Parts and manufacturer instructions",
    photo: "Product photo",
    component: "Part",
    manufacturer: "Manufacturer",
    marking: "Marking",
    ifu: "Manufacturer instructions",
    ifuLink: "Open PDF",
    notRequired: "–",
    onPack: "Printed on the packaging",
    conformity: "Declaration of conformity",
    legend: "MD: medical device. IVD: in vitro diagnostic device. CE with number: identification number of the notified body. \"–\": this part has no instructions of its own.",
    updated: "Last checked",
    open: "Open instructions",
  },
};
