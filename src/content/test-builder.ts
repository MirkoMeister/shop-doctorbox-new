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
  remove: string;
  limitReached: string;
  kitTitle: string;
  tassoLabel: string;
  bloodLabel: string;
  valuesPrice: string;
  basePriceLabel: string;
  extraTassoLabel: string;
  totalLabel: string;
  tooManyTasso: string;
  placeholderNote: string;
  cheaper: string;
};

const de: BuilderCopy = {
  metaTitle: "Eigenen Test zusammenstellen: bis zu 15 Blutwerte im individuellen Set",
  metaDescription: "Wähle bis zu 15 Blutwerte, sieh sofort Preis, Röhrchen und Tasso-Geräte deines individuellen Sets und frage es an. Fertige DoctorBox Heimtests zum Vergleich.",
  kicker: "Dein Test, deine Werte",
  title: "Stell dir deinen [[eigenen Test]] zusammen",
  lead: "Wähle bis zu 15 Blutwerte, die du wissen willst. Du siehst sofort, was dein Set kostet und wie viele Röhrchen und Tasso-Geräte du dafür bekommst.",
  mvpBadge: "Bald verfügbar",
  mvpNote: "Individuelle Sets befinden sich in Vorbereitung. Bis du sie direkt bestellen kannst, schickst du uns dein Set als Anfrage und wir melden uns mit der Bestätigung.",
  search: "Wert suchen, z. B. Ferritin, Testosteron, Vitamin D",
  groupsTitle: "Werte nach Thema",
  selectedTitle: "Deine Auswahl",
  selectedEmpty: "Noch keine Werte gewählt. Tippe in der Liste auf einen Wert.",
  showCoverage: "Abdeckung ansehen",
  selectedCount: "{n} von {max} Werten gewählt",
  clear: "Auswahl leeren",
  coverageTitle: "Beste Abdeckung heute",
  coverageText: "Diese Tests aus dem Sortiment decken deine Auswahl am weitesten ab.",
  covers: "deckt {m} von {n} ab",
  missing: "fehlt",
  allCovered: "deckt alle gewählten Werte ab",
  toProduct: "Zum Test",
  requestTitle: "Set anfragen",
  requestText: "Wir prüfen dein Set mit dem Labor und melden uns innerhalb von zwei Werktagen mit der Bestätigung und dem Bestelllink.",
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
    { title: "Werte wählen", text: "Tippe bis zu 15 Werte an. Die Suche hilft bei konkreten Namen." },
    { title: "Set prüfen", text: "Du siehst Preis, Röhrchen und Tasso-Geräte. Deckt ein fertiger Test alles ab, zeigen wir ihn dir." },
    { title: "Set anfragen", text: "Wir stellen dein Set im Labor zusammen und melden uns mit der Bestätigung." },
  ],
  remove: "entfernen",
  limitReached: "Ein Set hat höchstens {max} Werte. Entferne einen Wert, um einen anderen zu wählen.",
  kitTitle: "Dein Set",
  tassoLabel: "Tasso-Geräte",
  bloodLabel: "Blutmenge",
  valuesPrice: "Werte",
  basePriceLabel: "Set, Versand & Laborpauschale",
  extraTassoLabel: "Zusätzliche Tasso-Geräte ({n})",
  totalLabel: "Gesamt",
  tooManyTasso: "Für diese Auswahl bräuchtest du {n} Tasso-Geräte, ein Set hat höchstens {max}. Entferne Werte oder teile sie auf zwei Sets auf.",
  placeholderNote: "Vorschau: Preise, Blutmengen und Röhrchen sind vorläufig, bis die Laborliste vorliegt.",
  cheaper: "Deckt alles ab und ist günstiger als dein Set",
};

const en: BuilderCopy = {
  metaTitle: "Build your own test: up to 15 blood values in an individual kit",
  metaDescription: "Choose up to 15 blood values, see the price, tubes and Tasso devices of your individual kit instantly and request it. Ready-made DoctorBox home tests for comparison.",
  kicker: "Your test, your values",
  title: "Build your [[own test]]",
  lead: "Pick up to 15 blood values you want to know. You see instantly what your kit costs and how many tubes and Tasso devices it comes with.",
  mvpBadge: "Coming soon",
  mvpNote: "Individual kits are in preparation. Until you can order them directly, send us your kit as a request and we get back to you with the confirmation.",
  search: "Search a value, e.g. ferritin, testosterone, vitamin D",
  groupsTitle: "Values by topic",
  selectedTitle: "Your selection",
  selectedEmpty: "No values selected yet. Tap a value in the list.",
  showCoverage: "See coverage",
  selectedCount: "{n} of {max} values selected",
  clear: "Clear selection",
  coverageTitle: "Best coverage today",
  coverageText: "These tests from the range cover your selection best.",
  covers: "covers {m} of {n}",
  missing: "missing",
  allCovered: "covers every selected value",
  toProduct: "To the test",
  requestTitle: "Request a kit",
  requestText: "We check your kit with the lab and get back to you within two working days with the confirmation and an order link.",
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
    { title: "Pick values", text: "Tap up to 15 values. Search helps with specific names." },
    { title: "Check your kit", text: "You see price, tubes and Tasso devices. If a ready-made test covers everything, we show it to you." },
    { title: "Request the kit", text: "We assemble your kit in the lab and get back to you with the confirmation." },
  ],
  remove: "remove",
  limitReached: "A kit holds at most {max} values. Remove one to pick another.",
  kitTitle: "Your kit",
  tassoLabel: "Tasso devices",
  bloodLabel: "Blood volume",
  valuesPrice: "Values",
  basePriceLabel: "Kit, shipping & lab fee",
  extraTassoLabel: "Additional Tasso devices ({n})",
  totalLabel: "Total",
  tooManyTasso: "This selection would need {n} Tasso devices; a kit has at most {max}. Remove values or split them into two kits.",
  placeholderNote: "Preview: prices, blood volumes and tubes are provisional until the lab list is in.",
  cheaper: "Covers everything and costs less than your kit",
};

export const BUILDER_PAGE = "/pages/eigener-test";
export const builderCopy = (locale: Locale): BuilderCopy => (locale === "en" ? en : de);
