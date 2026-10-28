import type { Locale } from "@/lib/i18n/config";

/** Halloween campaign: 20 % with a code, until 31 October 2026, 23:59 (Berlin). */
export const HALLOWEEN = {
  code: "HALLOWEEN26",
  percent: 20,
  start: "2026-10-20T00:00:00+02:00",
  end: "2026-10-31T23:59:59+01:00",
  page: "/pages/halloween",
  hero: "/hero/halloween.jpg",
  products: [
    "vitamin-rundum-check",
    "stoffwechsel-check-plus",
    "nahrstoff-rundum-check",
    "herz-kreislauf-check",
    "sti-pro-10",
    "allergietest",
    "rundum-check-fur-manner",
    "rundum-check-fur-frauen",
  ],
};

export function halloweenActive(now = new Date()): boolean {
  return now >= new Date(HALLOWEEN.start) && now <= new Date(HALLOWEEN.end);
}

export type HalloweenCopy = {
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
  units: [string, string, string, string];
  cta: string;
  note: string;
  dealsTitle: string;
  dealsText: string;
  dealBadge: string;
  withCode: string;
  instead: string;
  howTitle: string;
  steps: { title: string; text: string }[];
  endedTitle: string;
  endedText: string;
  endedCta: string;
  finePrint: string;
  allTitle: string;
  allText: string;
  allCta: string;
  searchHint: string;
};

const de: HalloweenCopy = {
  metaTitle: "Halloween-Special: 20 % auf Heimtests mit Code HALLOWEEN26",
  metaDescription: "Nur bis 31. Oktober: 20 % Rabatt auf ausgewählte DoctorBox Heimtests mit dem Code HALLOWEEN26. Rundum Checks, STI Pro, Allergietest und mehr.",
  bar: "Halloween-Special: 20 % auf alle Heimtests mit Code HALLOWEEN26, nur bis 31. Oktober",
  barCta: "Zu den Angeboten",
  kicker: "Halloween-Special bis 31. Oktober",
  title: "Gruselig gute [[Heimtest-Deals]]",
  lead: "20 % auf alle DoctorBox Heimtests, bevor die Geisterstunde schlägt. Code kopieren, Test wählen, im Warenkorb einlösen.",
  codeLabel: "Dein Code",
  copy: "Code kopieren",
  copied: "Kopiert",
  countdownLabel: "Die Aktion endet in",
  units: ["Tage", "Std.", "Min.", "Sek."],
  cta: "Zu den Angeboten",
  note: "Der Rabatt wird im Warenkorb abgezogen. Gültig bis 31. Oktober, 23:59 Uhr.",
  dealsTitle: "Die [[beliebtesten]] Deals",
  dealsText: "Acht Checks, mit denen die meisten starten. Der Preis mit Code gilt nach Eingabe von HALLOWEEN26 im Warenkorb, und er gilt genauso für jeden anderen Heimtest.",
  dealBadge: "−20 % mit Code",
  withCode: "mit Code",
  instead: "statt",
  howTitle: "So löst du den [[Rabatt]] ein",
  steps: [
    { title: "Test wählen", text: "Leg einen oder mehrere der Angebote in den Warenkorb." },
    { title: "Code eingeben", text: "Im Warenkorb oder Checkout das Feld „Rabattcode“ öffnen und HALLOWEEN26 eintragen." },
    { title: "20 % sparen", text: "Der Rabatt wird sofort abgezogen. Versand in neutraler Verpackung wie immer." },
  ],
  endedTitle: "Die Geisterstunde ist vorbei",
  endedText: "Das Halloween-Special ist beendet. Unsere Heimtests gibt es weiterhin, und Mira hilft dir, den passenden zu finden.",
  endedCta: "Alle Heimtests ansehen",
  finePrint: "Gültig bis 31.10.2026, 23:59 Uhr, auf alle DoctorBox Heimtests, nicht kombinierbar mit anderen Codes oder Abo-Rabatten. Ein Code pro Bestellung.",
  allTitle: "Gilt für [[alle Heimtests]]",
  allText: "Nicht nur die acht oben: Jeder DoctorBox Heimtest ist mit HALLOWEEN26 20 % günstiger. Such nach einem Wert oder stöbere nach Thema.",
  allCta: "Alle Heimtests ansehen",
  searchHint: "Welchen Wert möchtest du prüfen?",
};

const en: HalloweenCopy = {
  metaTitle: "Halloween special: 20% off home tests with code HALLOWEEN26",
  metaDescription: "Until 31 October only: 20% off selected DoctorBox home tests with the code HALLOWEEN26. All-round checks, STI Pro, allergy test and more.",
  bar: "Halloween special: 20% off all home tests with code HALLOWEEN26, until 31 October only",
  barCta: "See the deals",
  kicker: "Halloween special until 31 October",
  title: "Spookily good [[home test deals]]",
  lead: "20% off every DoctorBox home test before the witching hour strikes. Copy the code, pick a test, redeem it in the cart.",
  codeLabel: "Your code",
  copy: "Copy code",
  copied: "Copied",
  countdownLabel: "The offer ends in",
  units: ["days", "hrs", "min", "sec"],
  cta: "See the deals",
  note: "The discount is deducted in the cart. Valid until 31 October, 23:59.",
  dealsTitle: "The [[most popular]] deals",
  dealsText: "Eight checks most people start with. The code price applies after entering HALLOWEEN26 in the cart, and it applies to every other home test just the same.",
  dealBadge: "−20% with code",
  withCode: "with code",
  instead: "instead of",
  howTitle: "How to redeem the [[discount]]",
  steps: [
    { title: "Pick a test", text: "Add one or more of the deals to your cart." },
    { title: "Enter the code", text: "Open the “Discount code” field in the cart or checkout and enter HALLOWEEN26." },
    { title: "Save 20%", text: "The discount is deducted right away. Shipped in neutral packaging as always." },
  ],
  endedTitle: "The witching hour has passed",
  endedText: "The Halloween special has ended. Our home tests are still here, and Mira helps you find the right one.",
  endedCta: "See all home tests",
  finePrint: "Valid until 31 Oct 2026, 23:59, on all DoctorBox home tests; cannot be combined with other codes or subscription discounts. One code per order.",
  allTitle: "Applies to [[every home test]]",
  allText: "Not just the eight above: every DoctorBox home test is 20% cheaper with HALLOWEEN26. Search for a value or browse by topic.",
  allCta: "See all home tests",
  searchHint: "Which value do you want to check?",
};

export const halloweenCopy = (locale: Locale): HalloweenCopy => (locale === "en" ? en : de);
