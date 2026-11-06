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
  stepsLabel: string;
  next: string;
  toRequest: string;
  back: string;
  editValues: string;
  kitLine: string;
  pickHint: string;
};

const de: BuilderCopy = {
  metaTitle: "Eigenen Test zusammenstellen: bis zu 15 Blutwerte im individuellen Set",
  metaDescription: "Wähle bis zu 15 Blutwerte, sieh sofort Preis, Röhrchen und Tasso-Geräte deines individuellen Sets und merke dein Interesse vor. Individuelle Sets sind noch nicht bestellbar. Fertige DoctorBox Heimtests zum Vergleich.",
  kicker: "Dein Test, deine Werte",
  title: "Stell dir deinen [[eigenen Test]] zusammen",
  lead: "Wähle bis zu 15 Blutwerte, die du wissen willst. Du siehst sofort, was dein Set kostet und wie viele Röhrchen und Tasso-Geräte du dafür bekommst.",
  mvpBadge: "Noch nicht bestellbar",
  mvpNote: "Individuelle Sets gibt es noch nicht: Du kannst sie weder bestellen noch anfragen. Stell dir hier schon dein Set zusammen und merk dein Interesse vor, dann sagen wir dir Bescheid, sobald die Funktion verfügbar ist. Bis dahin zeigen wir dir fertige Tests, die deine Auswahl abdecken.",
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
  requestTitle: "Interesse vormerken",
  requestText: "Individuelle Sets sind noch nicht bestellbar. Wir merken uns deine Auswahl und schreiben dir, sobald du eigene Sets bestellen kannst. Das ist keine Bestellung und keine Anfrage.",
  name: "Name",
  email: "E-Mail",
  note: "Anmerkung",
  notePlaceholder: "Optional: Warum diese Werte, Vorerkrankungen, Wunschtermin …",
  submit: "Interesse vormerken",
  privacy: "Deine Angaben nutzen wir nur, um dich über den Start individueller Sets zu informieren.",
  successTitle: "Vorgemerkt",
  successText: "Wir schreiben dir, sobald individuelle Sets bestellbar sind. Bis dahin findest du oben den fertigen Test, der deine Auswahl heute am besten abdeckt.",
  errorGeneric: "Das hat nicht geklappt. Bitte versuch es noch einmal oder schreib an heimtest@doctorbox.eu.",
  errorEmail: "Bitte prüfe die E-Mail-Adresse.",
  errorEmpty: "Wähle mindestens einen Wert aus.",
  mailSubject: "Eigener Test: Interesse (Funktion noch nicht verfügbar)",
  mailIntro: "Gewünschte Werte",
  steps: [
    { title: "Werte wählen", text: "Tippe bis zu 15 Werte an. Die Suche hilft bei konkreten Namen." },
    { title: "Set prüfen", text: "Preis, Röhrchen und Tasso-Geräte. Deckt ein fertiger Test alles ab, zeigen wir ihn dir." },
    { title: "Interesse vormerken", text: "Bestellen geht noch nicht. Wir sagen dir Bescheid, sobald es individuelle Sets gibt." },
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
  stepsLabel: "Fortschritt",
  next: "Weiter: Set prüfen",
  toRequest: "Weiter: Interesse vormerken",
  back: "Zurück",
  editValues: "Werte ändern",
  kitLine: "Dein Set: {n} Werte · {total}",
  pickHint: "Tippe die Werte an, die du wissen willst.",
};

const en: BuilderCopy = {
  metaTitle: "Build your own test: up to 15 blood values in an individual kit",
  metaDescription: "Choose up to 15 blood values, see the price, tubes and Tasso devices of your individual kit instantly and register your interest. Individual kits cannot be ordered yet. Ready-made DoctorBox home tests for comparison.",
  kicker: "Your test, your values",
  title: "Build your [[own test]]",
  lead: "Pick up to 15 blood values you want to know. You see instantly what your kit costs and how many tubes and Tasso devices it comes with.",
  mvpBadge: "Not available yet",
  mvpNote: "Individual kits are not available yet: you can neither order nor request them. Put your kit together here and register your interest, and we will let you know once the feature is live. Meanwhile we show you ready-made tests that cover your selection.",
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
  requestTitle: "Register interest",
  requestText: "Individual kits cannot be ordered yet. We keep your selection and write to you once you can order your own kit. This is not an order or a request.",
  name: "Name",
  email: "E-mail",
  note: "Note",
  notePlaceholder: "Optional: why these values, conditions, preferred date …",
  submit: "Register interest",
  privacy: "We use your details only to tell you when individual kits launch.",
  successTitle: "Noted",
  successText: "We will write to you once individual kits can be ordered. Meanwhile, the ready-made test that covers your selection best today is shown above.",
  errorGeneric: "That didn't work. Please try again or write to heimtest@doctorbox.eu.",
  errorEmail: "Please check the e-mail address.",
  errorEmpty: "Select at least one value.",
  mailSubject: "Custom test: interest (feature not available yet)",
  mailIntro: "Requested values",
  steps: [
    { title: "Pick values", text: "Tap up to 15 values. Search helps with specific names." },
    { title: "Check your kit", text: "You see price, tubes and Tasso devices. If a ready-made test covers everything, we show it to you." },
    { title: "Register interest", text: "Ordering is not possible yet. We let you know once individual kits are available." },
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
  stepsLabel: "Progress",
  next: "Next: check your kit",
  toRequest: "Next: register interest",
  back: "Back",
  editValues: "Change values",
  kitLine: "Your kit: {n} values · {total}",
  pickHint: "Tap the values you want to know.",
};

export const BUILDER_PAGE = "/pages/eigener-test";
export const builderCopy = (locale: Locale): BuilderCopy => (locale === "en" ? en : de);
