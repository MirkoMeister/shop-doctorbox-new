import type { Locale } from "@/lib/i18n/config";

/**
 * Black Friday to Cyber Monday: 25 % with a code on selected kits, 27 to 30 November 2026 (Berlin).
 * The kits are best sellers that are not part of Movember (those already have 20 % with MOVEMBER26 until
 * 30 November; one code per order). The BLACKFRIDAY26 discount in Shopify must cover exactly these products.
 */
export const BLACKFRIDAY = {
  code: "BLACKFRIDAY26",
  percent: 25,
  start: "2026-11-27T00:00:00+01:00",
  end: "2026-11-30T23:59:59+01:00",
  page: "/pages/black-friday",
  /** editorial groups; keys match the copy below */
  groups: [
    { key: "sti", handles: ["sti-standard-5", "sti-test-1", "sti-test-hiv-syphilis-lues-hepatitis-c-geschlechtskrankheiten-test", "sti-test", "hpv-high-risk-typen"] },
    { key: "naehrstoffe", handles: ["nahrstoff-rundum-check", "vitamin-d-test", "vitamin-b12-vegan-vegetarisch", "aminosaeuren-test", "haemoglobin-test"] },
    { key: "check", handles: ["rundum-check-fur-frauen", "schilddrusen-check-plus", "allergietest"] },
  ],
};

/** Every kit on the page. */
export const blackFridayHandles = BLACKFRIDAY.groups.flatMap((g) => g.handles);

export type BlackFridayPhase = "before" | "active" | "ended";
export function blackFridayPhase(now = new Date()): BlackFridayPhase {
  if (now < new Date(BLACKFRIDAY.start)) return "before";
  if (now > new Date(BLACKFRIDAY.end)) return "ended";
  return "active";
}
export const blackFridayActive = (now = new Date()) => blackFridayPhase(now) === "active";

export type BlackFridayCopy = {
  metaTitle: string;
  metaDescription: string;
  bar: string;
  barCta: string;
  kicker: string;
  title: string;
  lead: string;
  codeLabel: string;
  copy: string;
  copied: string;
  countdownLabel: string;
  startsLabel: string;
  units: [string, string, string, string];
  cta: string;
  note: string;
  beforeNote: string;
  perks: string[];
  dealsTitle: string;
  dealsText: string;
  groups: Record<string, { title: string; text: string }>;
  dealBadge: string;
  withCode: string;
  instead: string;
  giftTitle: string;
  giftText: string;
  howTitle: string;
  steps: { title: string; text: string }[];
  movemberTitle: string;
  movemberText: string;
  movemberCta: string;
  endedTitle: string;
  endedText: string;
  endedCta: string;
  finePrint: string;
};

const de: BlackFridayCopy = {
  metaTitle: "Black Friday: 25 % auf ausgewählte Heimtests mit Code BLACKFRIDAY26",
  metaDescription:
    "Von Black Friday bis Cyber Monday 25 % auf beliebte Heimtests: STI-Tests, Nährstoff-Checks, Schilddrüse, Allergie und mehr. Mit dem Code BLACKFRIDAY26, bis 30. November.",
  bar: "Black Friday: 25 % auf ausgewählte Heimtests mit Code BLACKFRIDAY26, bis Cyber Monday",
  barCta: "Zu den Deals",
  kicker: "Black Friday bis Cyber Monday",
  title: "25 % auf [[unsere Bestseller]]",
  lead: "Vier Tage lang gibt es die meistbestellten Heimtests 25 % günstiger. Probe zu Hause nehmen, im akkreditierten Labor auswerten lassen, Befund in der App.",
  codeLabel: "Dein Code",
  copy: "Code kopieren",
  copied: "Kopiert",
  countdownLabel: "Die Deals enden in",
  startsLabel: "Die Deals starten in",
  units: ["Tage", "Std", "Min", "Sek"],
  cta: "Zu den Deals",
  note: "Der Rabatt wird im Warenkorb abgezogen. Gültig vom 27. bis 30. November auf die Tests auf dieser Seite.",
  beforeNote: "Ab 27. November gilt der Code auf die Tests auf dieser Seite. Ansehen kannst du sie dir jetzt schon.",
  perks: ["Akkreditiertes Labor in Deutschland", "Befund digital in der App", "Kostenloser, neutraler Versand in Deutschland"],
  dealsTitle: "Die [[Black-Friday-Deals]]",
  dealsText: "Die Tests, die bei uns am häufigsten bestellt werden, nach Thema sortiert. Alle 25 % günstiger mit dem Code.",
  groups: {
    sti: {
      title: "Sexuelle Gesundheit",
      text: "Unsere meistbestellten Tests. Viele Infektionen bleiben ohne Symptome, ein Test schafft Klarheit, diskret und ohne Praxisbesuch.",
    },
    naehrstoffe: {
      title: "Nährstoffe & Blut",
      text: "Gerade im Winter fehlt oft etwas. Vitamin D, B12, Eisenwerte und Aminosäuren zeigen, ob du gut versorgt bist.",
    },
    check: {
      title: "Checks für den Überblick",
      text: "Mehrere Werte aus einer Probe: für Frauen, für die Schilddrüse und für Allergien.",
    },
  },
  dealBadge: "−25 % mit Code",
  withCode: "mit Code",
  instead: "statt",
  giftTitle: "Ein Test als [[Geschenk]]?",
  giftText: "Das Set kommt neutral verpackt, ohne Hinweis auf den Inhalt. Registriert wird der Test erst von der Person, die ihn macht, in ihrer eigenen DoctorBox App.",
  howTitle: "So löst du den [[Rabatt]] ein",
  steps: [
    { title: "Test wählen", text: "Lege einen oder mehrere Tests von dieser Seite in den Warenkorb." },
    { title: "Code eingeben", text: "Im Warenkorb auf „Rabattcode eingeben“ tippen und BLACKFRIDAY26 eintragen." },
    { title: "25 % sparen", text: "Der Rabatt wird sofort abgezogen. Versand in neutraler Verpackung wie immer." },
  ],
  movemberTitle: "Tests für Männer?",
  movemberText: "PSA, Testosteron, Herz-Kreislauf und mehr: Die gibt es noch bis 30. November mit dem Code MOVEMBER26 20 % günstiger.",
  movemberCta: "Zur Movember-Aktion",
  endedTitle: "Black Friday ist vorbei",
  endedText: "Die Aktion ist beendet. Die Tests gibt es weiterhin, und Mira hilft dir beim Auswählen.",
  endedCta: "Alle Heimtests ansehen",
  finePrint:
    "Gültig vom 27. November 2026, 0:00 Uhr, bis 30. November 2026, 23:59 Uhr, auf die auf dieser Seite gezeigten Heimtests; nicht mit anderen Codes oder Abo-Rabatten kombinierbar. Ein Code pro Bestellung.",
};

const en: BlackFridayCopy = {
  metaTitle: "Black Friday: 25% off selected home tests with code BLACKFRIDAY26",
  metaDescription:
    "From Black Friday to Cyber Monday, 25% off popular home tests: STI tests, nutrient checks, thyroid, allergy and more. With the code BLACKFRIDAY26, until 30 November.",
  bar: "Black Friday: 25% off selected home tests with code BLACKFRIDAY26, until Cyber Monday",
  barCta: "See the deals",
  kicker: "Black Friday to Cyber Monday",
  title: "25% off [[our best sellers]]",
  lead: "For four days, our most-ordered home tests are 25% off. Take the sample at home, have it analysed in an accredited lab, read your result in the app.",
  codeLabel: "Your code",
  copy: "Copy code",
  copied: "Copied",
  countdownLabel: "The deals end in",
  startsLabel: "The deals start in",
  units: ["days", "hrs", "min", "sec"],
  cta: "See the deals",
  note: "The discount is deducted in the cart. Valid 27 to 30 November on the tests on this page.",
  beforeNote: "From 27 November the code applies to the tests on this page. You can browse them now.",
  perks: ["Accredited lab in Germany", "Result digitally in the app", "Free, neutral shipping within Germany"],
  dealsTitle: "The [[Black Friday deals]]",
  dealsText: "The tests our customers order most, sorted by topic. All 25% off with the code.",
  groups: {
    sti: {
      title: "Sexual health",
      text: "Our most-ordered tests. Many infections stay without symptoms; a test brings clarity, discreetly and without a visit.",
    },
    naehrstoffe: {
      title: "Nutrients & blood",
      text: "Especially in winter, something is often missing. Vitamin D, B12, iron values and amino acids show whether you are well supplied.",
    },
    check: {
      title: "Checks for the big picture",
      text: "Several values from one sample: for women, for the thyroid and for allergies.",
    },
  },
  dealBadge: "−25% with code",
  withCode: "with code",
  instead: "instead of",
  giftTitle: "A test as a [[gift]]?",
  giftText: "The kit arrives in neutral packaging with no hint of its contents. The test is registered only by the person who takes it, in their own DoctorBox app.",
  howTitle: "How to redeem the [[discount]]",
  steps: [
    { title: "Pick a test", text: "Add one or more tests from this page to your cart." },
    { title: "Enter the code", text: "Tap “Enter a discount code” in the cart and enter BLACKFRIDAY26." },
    { title: "Save 25%", text: "The discount is deducted right away. Shipped in neutral packaging as always." },
  ],
  movemberTitle: "Tests for men?",
  movemberText: "PSA, testosterone, heart and more are 20% off until 30 November with the code MOVEMBER26.",
  movemberCta: "See the Movember campaign",
  endedTitle: "Black Friday is over",
  endedText: "The campaign has ended. The tests are still here, and Mira helps you choose.",
  endedCta: "See all home tests",
  finePrint:
    "Valid from 27 November 2026, 00:00, to 30 November 2026, 23:59, on the home tests shown on this page; cannot be combined with other codes or subscription discounts. One code per order.",
};

export const blackFridayCopy = (locale: Locale): BlackFridayCopy => (locale === "en" ? en : de);
