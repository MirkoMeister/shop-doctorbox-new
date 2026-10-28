import type { Locale } from "@/lib/i18n/config";

/** Movember: men's health month, 20 % with a code, 1 to 30 November 2026 (Berlin). */
export const MOVEMBER = {
  code: "MOVEMBER26",
  percent: 20,
  start: "2026-11-01T00:00:00+01:00",
  end: "2026-11-30T23:59:59+01:00",
  page: "/pages/movember",
  /** the all-in-one check, shown large */
  spotlight: "rundum-check-fur-manner",
  /** editorial groups; keys match the copy below */
  groups: [
    { key: "vorsorge", handles: ["psa-test-prostata-vorsorge", "darmkrebsvorsorge"] },
    { key: "herz", handles: ["herz-kreislauf-check", "blutzucker-hba1c", "leber-check"] },
    { key: "hormone", handles: ["testosteron-test", "hormon-check-fur-manner"] },
    { key: "kopf", handles: ["cortisol-check", "burnout-stess-check"] },
    { key: "sex", handles: ["sti-pro-10", "sti-complete-trio-fur-manner"] },
  ],
};

export type MovemberPhase = "before" | "active" | "ended";
export function movemberPhase(now = new Date()): MovemberPhase {
  if (now < new Date(MOVEMBER.start)) return "before";
  if (now > new Date(MOVEMBER.end)) return "ended";
  return "active";
}
export const movemberActive = (now = new Date()) => movemberPhase(now) === "active";

export type MovemberCopy = {
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
  facts: { value: string; label: string }[];
  factsSource: string;
  whyTitle: string;
  whyText: string;
  whyPoints: { title: string; text: string }[];
  spotlightKicker: string;
  spotlightTitle: string;
  spotlightText: string;
  spotlightCta: string;
  dealsTitle: string;
  dealsText: string;
  groups: Record<string, { title: string; text: string }>;
  dealBadge: string;
  withCode: string;
  instead: string;
  talkTitle: string;
  talkText: string;
  talkPhone: string;
  talkPhoneNote: string;
  howTitle: string;
  steps: { title: string; text: string }[];
  endedTitle: string;
  endedText: string;
  endedCta: string;
  finePrint: string;
  allTitle: string;
  allText: string;
  allCta: string;
};

const de: MovemberCopy = {
  metaTitle: "Movember: 20 % auf Heimtests für Männer mit Code MOVEMBER26",
  metaDescription: "Männergesundheit im November: PSA, Testosteron, Herz-Kreislauf, Darmkrebsvorsorge und mehr, 20 % günstiger mit dem Code MOVEMBER26. Messen statt aufschieben.",
  bar: "Movember: 20 % auf alle Heimtests mit Code MOVEMBER26, den ganzen November",
  barCta: "Zur Aktion",
  kicker: "Movember, der Monat der Männergesundheit",
  title: "Männer, [[macht den Check]].",
  lead: "Männer gehen seltener zur Vorsorge und sterben im Schnitt rund fünf Jahre früher als Frauen. Im November gibt es 20 % auf alle Heimtests: Blut abnehmen, einschicken, Befund in der App. Ohne Wartezimmer.",
  codeLabel: "Dein Code",
  copy: "Code kopieren",
  copied: "Kopiert",
  countdownLabel: "Die Aktion läuft noch",
  startsLabel: "Die Aktion startet in",
  units: ["Tage", "Std", "Min", "Sek"],
  cta: "Zu den Tests",
  note: "Der Rabatt wird im Warenkorb abgezogen. Gültig vom 1. bis 30. November auf alle DoctorBox Heimtests.",
  beforeNote: "Ab 1. November gilt der Code auf alle DoctorBox Heimtests. Die Tests kannst du dir jetzt schon ansehen.",
  facts: [
    { value: "5 Jahre", label: "früher sterben Männer in Deutschland im Schnitt als Frauen" },
    { value: "Nr. 1", label: "Prostatakrebs ist die häufigste Krebsart bei Männern" },
    { value: "ab 45", label: "empfiehlt die Krebsfrüherkennung den Prostata-Check, ab 50 den Darmkrebs-Stuhltest" },
  ],
  factsSource: "Quellen: Statistisches Bundesamt (Sterbetafel), Robert Koch-Institut (Zentrum für Krebsregisterdaten), Gemeinsamer Bundesausschuss (Krebsfrüherkennungs-Richtlinie).",
  whyTitle: "Warum [[gerade jetzt]]?",
  whyText: "Movember macht jedes Jahr im November auf Prostatakrebs, Hodenkrebs und die seelische Gesundheit von Männern aufmerksam. Das Prinzip ist einfach: hinschauen, bevor etwas weh tut. Genau dafür sind Heimtests gemacht.",
  whyPoints: [
    { title: "Kein Termin, kein Wartezimmer", text: "Test bestellen, Probe zu Hause nehmen, Befund digital. Der Arztbesuch kommt erst, wenn ein Wert auffällig ist, und dann mit Zahlen in der Hand." },
    { title: "Werte statt Bauchgefühl", text: "Müdigkeit, Bauch, Antrieb: Vieles schieben Männer auf Stress. PSA, Testosteron, Blutzucker und Blutfette sagen, was wirklich dahintersteckt." },
    { title: "Einordnung inklusive", text: "Jeder Befund kommt mit Referenzbereich und Erklärung. Bei Fragen hilft Mira, bei auffälligen Werten die Ärztin oder der Arzt." },
  ],
  spotlightKicker: "Der Check für alle, die es einmal richtig wissen wollen",
  spotlightTitle: "Rundum Check für Männer",
  spotlightText: "Neun Werte aus einer Probe: Testosteron, PSA, Blutfette, Blutzucker, Leber, Niere, Schilddrüse, Vitamin D und Entzündung. Die Basis, mit der du weißt, wo du stehst.",
  spotlightCta: "Zum Rundum Check",
  dealsTitle: "Die Tests zum [[Movember]]",
  dealsText: "Nach Thema sortiert, alle 20 % günstiger mit dem Code. Wenn du nicht weißt, wo du anfangen sollst: Der Rundum Check oben deckt die wichtigsten Werte ab.",
  groups: {
    vorsorge: { title: "Prostata & Darm", text: "Die zwei Krebsarten, bei denen Früherkennung nachweislich Leben rettet. PSA aus dem Blut, Darmkrebsvorsorge aus einer Stuhlprobe." },
    herz: { title: "Herz & Stoffwechsel", text: "Herz-Kreislauf-Erkrankungen sind Todesursache Nummer eins. Blutfette, Blutzucker und Leberwerte zeigen das Risiko lange vorher." },
    hormone: { title: "Hormone & Antrieb", text: "Weniger Energie, weniger Lust, schlechter Schlaf: Testosteron und die Hormonachse geben Antworten." },
    kopf: { title: "Kopf & Stress", text: "Dauerstress hinterlässt Spuren in den Werten. Cortisol und der Burnout-Stress-Check machen sie sichtbar." },
    sex: { title: "Sexuelle Gesundheit", text: "Viele Infektionen bleiben ohne Symptome. Ein Test schafft Klarheit, diskret und ohne Praxisbesuch." },
  },
  dealBadge: "−20 % mit Code",
  withCode: "mit Code",
  instead: "statt",
  talkTitle: "Reden hilft. Auch das gehört zur Männergesundheit.",
  talkText: "Movember steht auch für die seelische Gesundheit von Männern. Wenn es dir gerade nicht gut geht, musst du das nicht allein tragen. Die Telefonseelsorge ist rund um die Uhr erreichbar, kostenlos und anonym.",
  talkPhone: "0800 111 0 111",
  talkPhoneNote: "oder 0800 111 0 222, rund um die Uhr, kostenlos",
  howTitle: "So löst du den [[Rabatt]] ein",
  steps: [
    { title: "Test wählen", text: "Lege einen oder mehrere Heimtests in den Warenkorb." },
    { title: "Code eingeben", text: "Im Warenkorb auf „Rabattcode eingeben“ tippen und MOVEMBER26 eintragen." },
    { title: "20 % sparen", text: "Der Rabatt wird sofort abgezogen. Versand in neutraler Verpackung wie immer." },
  ],
  endedTitle: "Der Movember ist vorbei, die Vorsorge nicht",
  endedText: "Die Aktion ist beendet. Die Tests gibt es weiterhin, und Mira hilft dir beim Auswählen.",
  endedCta: "Alle Heimtests ansehen",
  finePrint: "Gültig vom 1. bis 30. November 2026, 23:59 Uhr, auf alle DoctorBox Heimtests; nicht mit anderen Codes oder Abo-Rabatten kombinierbar. Ein Code pro Bestellung.",
  allTitle: "Gilt für [[jeden Heimtest]]",
  allText: "Nicht nur für die Auswahl oben: Mit MOVEMBER26 ist jeder DoctorBox Heimtest 20 % günstiger, auch die Rundum Checks für Frauen.",
  allCta: "Alle Heimtests ansehen",
};

const en: MovemberCopy = {
  metaTitle: "Movember: 20% off home tests for men with code MOVEMBER26",
  metaDescription: "Men's health in November: PSA, testosterone, heart and metabolism, bowel cancer screening and more, 20% off with the code MOVEMBER26. Measure instead of postponing.",
  bar: "Movember: 20% off all home tests with code MOVEMBER26, all November long",
  barCta: "See the campaign",
  kicker: "Movember, the month of men's health",
  title: "Men, [[get checked]].",
  lead: "Men see the doctor less often and die about five years earlier than women on average. In November, every home test is 20% off: take a sample, send it in, read your result in the app. No waiting room.",
  codeLabel: "Your code",
  copy: "Copy code",
  copied: "Copied",
  countdownLabel: "The campaign runs for another",
  startsLabel: "The campaign starts in",
  units: ["days", "hrs", "min", "sec"],
  cta: "See the tests",
  note: "The discount is deducted in the cart. Valid 1 to 30 November on all DoctorBox home tests.",
  beforeNote: "From 1 November the code applies to all DoctorBox home tests. You can browse the tests now.",
  facts: [
    { value: "5 years", label: "earlier is how much sooner men in Germany die than women, on average" },
    { value: "No. 1", label: "prostate cancer is the most common cancer in men" },
    { value: "from 45", label: "statutory screening recommends the prostate check, bowel cancer stool test from 50" },
  ],
  factsSource: "Sources: Federal Statistical Office (life tables), Robert Koch Institute (German Centre for Cancer Registry Data), Federal Joint Committee (cancer screening directive).",
  whyTitle: "Why [[right now]]?",
  whyText: "Every November, Movember draws attention to prostate cancer, testicular cancer and men's mental health. The principle is simple: look before it hurts. That is exactly what home tests are for.",
  whyPoints: [
    { title: "No appointment, no waiting room", text: "Order a test, take the sample at home, get the result digitally. The doctor comes in only if a value is off, and then with numbers in hand." },
    { title: "Values instead of gut feeling", text: "Tiredness, belly, drive: men blame a lot on stress. PSA, testosterone, blood sugar and lipids tell you what is really behind it." },
    { title: "Interpretation included", text: "Every result comes with reference ranges and an explanation. Mira helps with questions, your doctor with abnormal values." },
  ],
  spotlightKicker: "The check for everyone who wants to know properly, once",
  spotlightTitle: "All-round check for men",
  spotlightText: "Nine values from one sample: testosterone, PSA, lipids, blood sugar, liver, kidney, thyroid, vitamin D and inflammation. The baseline that tells you where you stand.",
  spotlightCta: "See the all-round check",
  dealsTitle: "The tests for [[Movember]]",
  dealsText: "Sorted by topic, all 20% off with the code. Not sure where to start? The all-round check above covers the key values.",
  groups: {
    vorsorge: { title: "Prostate & bowel", text: "The two cancers where early detection demonstrably saves lives. PSA from blood, bowel cancer screening from a stool sample." },
    herz: { title: "Heart & metabolism", text: "Cardiovascular disease is the number one cause of death. Lipids, blood sugar and liver values show the risk long before." },
    hormone: { title: "Hormones & drive", text: "Less energy, less desire, poorer sleep: testosterone and the hormone axis give answers." },
    kopf: { title: "Mind & stress", text: "Chronic stress leaves traces in your values. Cortisol and the burnout stress check make them visible." },
    sex: { title: "Sexual health", text: "Many infections stay without symptoms. A test brings clarity, discreetly and without a visit." },
  },
  dealBadge: "−20% with code",
  withCode: "with code",
  instead: "instead of",
  talkTitle: "Talking helps. That is part of men's health too.",
  talkText: "Movember also stands for men's mental health. If you are not doing well right now, you do not have to carry it alone. The Telefonseelsorge helpline is available around the clock, free and anonymous.",
  talkPhone: "0800 111 0 111",
  talkPhoneNote: "or 0800 111 0 222, around the clock, free of charge",
  howTitle: "How to redeem the [[discount]]",
  steps: [
    { title: "Pick a test", text: "Add one or more home tests to your cart." },
    { title: "Enter the code", text: "Tap “Enter a discount code” in the cart and enter MOVEMBER26." },
    { title: "Save 20%", text: "The discount is deducted right away. Shipped in neutral packaging as always." },
  ],
  endedTitle: "Movember is over, prevention is not",
  endedText: "The campaign has ended. The tests are still here, and Mira helps you choose.",
  endedCta: "See all home tests",
  finePrint: "Valid 1 to 30 November 2026, 23:59, on all DoctorBox home tests; cannot be combined with other codes or subscription discounts. One code per order.",
  allTitle: "Applies to [[every home test]]",
  allText: "Not only the selection above: with MOVEMBER26 every DoctorBox home test is 20% off, including the all-round checks for women.",
  allCta: "See all home tests",
};

export const movemberCopy = (locale: Locale): MovemberCopy => (locale === "en" ? en : de);
