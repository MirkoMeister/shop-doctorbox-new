import type { Locale } from "@/lib/i18n/config";

/** Copy for the "create your own test" MVP (/pages/eigener-test). */
export type BuilderCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  mvpBadge: string;
  mvpNote: string;
  search: string;
  groupsTitle: string;
  selectedTitle: string;
  selectedEmpty: string;
  selectedCount: string;
  showCoverage: string;
  clear: string;
  coverageTitle: string;
  coverageText: string;
  covers: string;
  missing: string;
  allCovered: string;
  toProduct: string;
  requestTitle: string;
  requestText: string;
  name: string;
  email: string;
  note: string;
  notePlaceholder: string;
  submit: string;
  privacy: string;
  successTitle: string;
  successText: string;
  errorGeneric: string;
  errorEmail: string;
  errorEmpty: string;
  mailSubject: string;
  mailIntro: string;
  steps: { title: string; text: string }[];
};

const de: BuilderCopy = {
  metaTitle: "Eigenen Test zusammenstellen: Biomarker wählen, Set anfragen",
  metaDescription: "Wähle die Werte, die dich interessieren, sieh sofort, welcher DoctorBox Heimtest sie heute abdeckt, und frage dein individuelles Set an.",
  kicker: "Dein Test, deine Werte",
  title: "Stell dir deinen [[eigenen Test]] zusammen",
  lead: "Wähle aus über 200 Werten, was du wissen willst. Wir zeigen dir sofort, welcher Test heute am besten passt, und du kannst dein individuelles Set anfragen.",
  mvpBadge: "Bald verfügbar",
  mvpNote: "Individuelle Sets befinden sich in Vorbereitung. Bis dahin legen wir dein Panel auf Anfrage an und melden uns mit Preis und Verfügbarkeit.",
  search: "Wert suchen, z. B. Ferritin, Testosteron, Vitamin D",
  groupsTitle: "Werte nach Thema",
  selectedTitle: "Deine Auswahl",
  selectedEmpty: "Noch keine Werte gewählt. Tippe in der Liste auf einen Wert.",
  showCoverage: "Abdeckung ansehen",
  selectedCount: "{n} Werte gewählt",
  clear: "Auswahl leeren",
  coverageTitle: "Beste Abdeckung heute",
  coverageText: "Diese Tests aus dem Sortiment decken deine Auswahl am weitesten ab.",
  covers: "deckt {m} von {n} ab",
  missing: "fehlt",
  allCovered: "deckt alle gewählten Werte ab",
  toProduct: "Zum Test",
  requestTitle: "Set anfragen",
  requestText: "Wir prüfen, ob sich dein Panel im Labor zusammenstellen lässt, und melden uns innerhalb von zwei Werktagen mit Preis und Probenmaterial.",
  name: "Name",
  email: "E-Mail",
  note: "Anmerkung",
  notePlaceholder: "Optional: Warum diese Werte, Vorerkrankungen, Wunschtermin …",
  submit: "Set unverbindlich anfragen",
  privacy: "Deine Angaben nutzen wir nur für die Beantwortung dieser Anfrage.",
  successTitle: "Anfrage ist raus",
  successText: "Wir melden uns innerhalb von zwei Werktagen. In der Zwischenzeit findest du oben den Test, der deine Auswahl heute am besten abdeckt.",
  errorGeneric: "Das hat nicht geklappt. Bitte versuch es noch einmal oder schreib an heimtest@doctorbox.eu.",
  errorEmail: "Bitte prüfe die E-Mail-Adresse.",
  errorEmpty: "Wähle mindestens einen Wert aus.",
  mailSubject: "Eigener Test",
  mailIntro: "Gewünschte Werte",
  steps: [
    { title: "Werte wählen", text: "Tippe die Werte an, die du messen möchtest. Suche hilft bei konkreten Namen." },
    { title: "Abdeckung prüfen", text: "Rechts siehst du sofort, welcher bestehende Test deine Auswahl heute abdeckt." },
    { title: "Set anfragen", text: "Fehlt etwas, fragst du dein individuelles Panel an. Wir melden uns mit Preis und Material." },
  ],
};

const en: BuilderCopy = {
  metaTitle: "Build your own test: pick biomarkers, request a kit",
  metaDescription: "Choose the values you care about, see instantly which DoctorBox home test covers them today, and request your individual kit.",
  kicker: "Your test, your values",
  title: "Build your [[own test]]",
  lead: "Pick from over 200 values what you want to know. We show you instantly which test fits best today, and you can request your individual kit.",
  mvpBadge: "Coming soon",
  mvpNote: "Individual kits are in preparation. Until then we set up your panel on request and get back to you with price and availability.",
  search: "Search a value, e.g. ferritin, testosterone, vitamin D",
  groupsTitle: "Values by topic",
  selectedTitle: "Your selection",
  selectedEmpty: "No values selected yet. Tap a value in the list.",
  showCoverage: "See coverage",
  selectedCount: "{n} values selected",
  clear: "Clear selection",
  coverageTitle: "Best coverage today",
  coverageText: "These tests from the range cover your selection best.",
  covers: "covers {m} of {n}",
  missing: "missing",
  allCovered: "covers every selected value",
  toProduct: "To the test",
  requestTitle: "Request a kit",
  requestText: "We check whether your panel can be assembled in the lab and get back to you within two working days with price and sample material.",
  name: "Name",
  email: "E-mail",
  note: "Note",
  notePlaceholder: "Optional: why these values, conditions, preferred date …",
  submit: "Request kit, no obligation",
  privacy: "We use your details only to answer this request.",
  successTitle: "Request sent",
  successText: "We get back to you within two working days. Meanwhile, the test that covers your selection best today is shown above.",
  errorGeneric: "That didn't work. Please try again or write to heimtest@doctorbox.eu.",
  errorEmail: "Please check the e-mail address.",
  errorEmpty: "Select at least one value.",
  mailSubject: "Custom test",
  mailIntro: "Requested values",
  steps: [
    { title: "Pick values", text: "Tap the values you want measured. Search helps with specific names." },
    { title: "Check coverage", text: "On the right you see instantly which existing test covers your selection today." },
    { title: "Request a kit", text: "If something is missing, request your individual panel. We get back to you with price and material." },
  ],
};

export const BUILDER_PAGE = "/pages/eigener-test";
export const builderCopy = (locale: Locale): BuilderCopy => (locale === "en" ? en : de);
