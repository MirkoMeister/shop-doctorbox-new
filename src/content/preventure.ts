/**
 * PREVENTURE 2026 (Health Festival, 10.11.2026, CURIO-HAUS Hamburg): slideshow for the tablet on our
 * stand at /pages/preventure. Not linked anywhere, noindex. Installable as an app in Chrome
 * (public/preventure.webmanifest), so it runs fullscreen without the address bar.
 *
 * The discount code must exist in Shopify (Rabatte → 20 % auf die Heimtests). Visitors scan the QR
 * code: /discount/<CODE> stores the code and leads to all home tests; the cart applies it.
 */
export const PREVENTURE = {
  page: "/pages/preventure",
  code: "PREVENTURE26",
  percent: 20,
  /** landing page behind the QR code: the six sets the code applies to */
  landing: "/pages/preventure-vorsorge",
  /** where the QR code leads; public/preventure/qr.svg encodes exactly this (scripts/preventure-qr.py) */
  qrUrl:
    "https://shop.doctorbox.de/discount/PREVENTURE26?redirect=%2Fpages%2Fpreventure-vorsorge%3Futm_source%3Dpreventure%26utm_medium%3Dqr%26utm_campaign%3Dpreventure26",
  qrImage: "/preventure/qr.svg",
  /** Movember slide: QR to the Movember page with its code (public/preventure/qr-movember.svg) */
  movemberQrUrl:
    "https://shop.doctorbox.de/discount/MOVEMBER26?redirect=%2Fpages%2Fmovember%3Futm_source%3Dpreventure%26utm_medium%3Dqr%26utm_campaign%3Dmovember26",
  movemberQrImage: "/preventure/qr-movember.svg",
  /** photos from the Shopify files (steps slide) */
  images: {
    kit: "https://cdn.shopify.com/s/files/1/0564/6991/3683/files/Sexuelle_Gesundheit_Kits_0cf42336-13da-4c0a-abac-16c0b97ceb93.png?v=1769442006",
    tasso: "https://cdn.shopify.com/s/files/1/0564/6991/3683/files/Tasso_ohne_text.jpg?v=1773752734",
  },
  /** the sets PREVENTURE26 applies to (set up so in Shopify): sets slide and landing page, in this order */
  sets: ["rundum-check-fur-frauen", "rundum-check-fur-manner", "herz-kreislauf-check", "darmkrebsvorsorge", "blutzucker-hba1c", "psa-test-prostata-vorsorge"],
  /** shown under the QR code for people who prefer typing */
  shortUrl: "shop.doctorbox.de",
  /** seconds per slide; the video slide lasts as long as the video */
  seconds: { steps: 9, wheel: 11, pharmacy: 12, sets: 12, offer: 18, movember: 14 },
  /** the prize on the wheel slide (green field on the wheel at the stand) */
  wheelPrize: "darmkrebsvorsorge",
} as const;

export const preventureCopy = {
  metaTitle: "DoctorBox auf der PREVENTURE 2026",
  event: "PREVENTURE 2026 · Hamburg",
  video: {
    title: "Blut abnehmen, [[nahezu schmerzfrei]].",
    text: "Tasso+ klebt am Oberarm. Ein Knopfdruck, keine sichtbare Nadel, nach etwa 5 Minuten ist die Probe im Röhrchen.",
    label: "Video: Blutabnahme mit dem Tasso+ Gerät am Oberarm",
  },
  steps: {
    title: "Laborwerte [[von zu Hause]].",
    items: [
      { title: "Bestellen", text: "Test online wählen, das Set kommt in neutraler Verpackung." },
      { title: "Probe nehmen", text: "Zu Hause, mit Tasso+ oder Fingerpiks. Anleitung liegt bei." },
      { title: "Befund in der App", text: "Analyse im akkreditierten Labor, Ergebnis in der DoctorBox App." },
    ],
  },
  pharmacy: {
    title: "Blutabnahme [[in der Apotheke]].",
    text: "Lieber nicht selbst? In Partnerapotheken in ganz Deutschland nimmt das Apothekenteam deine Probe ab. Test im Shop bestellen, vor Ort abnehmen lassen, Befund in der App.",
    legend: "Partnerapotheken mit Probenentnahme",
    one: "1 Apotheke",
    more: "mehrere in der Nähe",
    mapLabel: "Deutschlandkarte mit den Partnerapotheken, die Proben abnehmen",
  },
  wheel: {
    kicker: "Hier am Stand",
    title: "Dreh am Rad und gewinn [[ein Darmkrebsvorsorge\u2011Set]].", // non-breaking hyphen
    text: "Landet das Rad auf Grün, nimmst du das Set gleich mit.",
    prize: "Der Gewinn",
    label: "Glücksrad mit einem grünen Gewinnfeld",
  },
  sets: {
    title: "Die Klassiker der [[Vorsorge]].",
    note: "Mit Code {code} {percent} % auf diese sechs Sets.",
    values: "{n} Laborwerte",
    value: "1 Laborwert",
    from: "ab {price}",
  },
  offer: {
    kicker: "Nur für Besucher der PREVENTURE",
    title: "[[{percent} %]] auf die Klassiker der Vorsorge.",
    text: "Rundum Check, Herz-Kreislauf, Darmkrebs, Blutzucker und PSA. QR-Code scannen, der Code ist im Warenkorb schon eingetragen.",
    codeLabel: "Oder Code im Warenkorb eingeben",
  },
  movember: {
    kicker: "Movember, der Monat der Männergesundheit",
    title: "Männer, [[macht den Check]].",
    text: "Den ganzen November {percent} % auf die Heimtests für Männer: Vorsorge, Hormone, Herz, Stress und sexuelle Gesundheit.",
    until: "Code gilt bis 30. November",
  },
  corner: "{percent} % mit Code",
  landing: {
    metaTitle: "PREVENTURE 2026: 20 % auf die Klassiker der Vorsorge",
    kicker: "Für Besucher der PREVENTURE 2026",
    title: "[[{percent} %]] auf die Klassiker der Vorsorge.",
    text: "Mit dem Code {code} sparst du {percent} % auf diese sechs Sets. Kamst du über den QR-Code am Stand, ist der Code im Warenkorb schon eingetragen.",
    codeLabel: "Dein Code",
    copy: "Kopieren",
    copied: "Kopiert",
    note: "Der Code gilt nur für die Sets auf dieser Seite.",
  },
  fullscreen: "Vollbild",
};
