import type { Locale } from "@/lib/i18n/config";

/** Copy of the subscription page (/pages/doctorbox-abo). Texts from the old Shopify page, rewritten. */
export const SUBSCRIPTION_PAGE = "/pages/doctorbox-abo";

type Copy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  /** {pct} = largest subscription discount measured from Shopify */
  title: string;
  lead: string;
  heroAlt: string;
  ctaTests: string;
  ctaManage: string;
  stepsTitle: string;
  steps: { title: string; text: string }[];
  benefitsTitle: string;
  benefits: { title: string; text: string }[];
  testsTitle: string;
  testsText: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  contact: string;
  contactLink: string;
};

const de: Copy = {
  metaTitle: "DoctorBox Abo: Heimtests regelmäßig und günstiger",
  metaDescription:
    "Heimtests im Abo: {pct} % Rabatt auf jede Lieferung, Intervall frei wählbar, ohne Mindestlaufzeit, jederzeit pausierbar und kündbar.",
  kicker: "DoctorBox Abo",
  title: "Regelmäßig testen und [[{pct} % sparen]]",
  lead: "Dein Heimtest kommt automatisch im Intervall, das du wählst. Ohne Mindestlaufzeit: Du kannst jederzeit anpassen, pausieren oder kündigen.",
  heroAlt: "DoctorBox Probenahme-Set auf einem Tisch im Sonnenlicht",
  ctaTests: "Tests mit Abo ansehen",
  ctaManage: "Mein Abo verwalten",
  stepsTitle: "So funktioniert das Abo",
  steps: [
    { title: "Test wählen", text: "Auf der Produktseite unter „Kaufoption“ statt Einzelkauf das Abo auswählen." },
    { title: "Intervall festlegen", text: "Du bestimmst, wie oft der Test kommt. Der Abo-Preis gilt für jede Lieferung." },
    { title: "Automatisch geliefert", text: "Der Test kommt diskret verpackt zu dir. Änderungen machst du jederzeit in deinem Kundenkonto." },
  ],
  benefitsTitle: "Deine Vorteile",
  benefits: [
    { title: "{pct} % auf jede Lieferung", text: "Der Rabatt gilt dauerhaft, solange das Abo läuft." },
    { title: "Kostenlos & diskret", text: "Innerhalb Deutschlands versandkostenfrei, in neutraler Verpackung." },
    { title: "Flexibles Intervall", text: "Wähle, wie oft du testen willst, und ändere es jederzeit." },
    { title: "Keine Mindestlaufzeit", text: "Pausieren oder kündigen geht jederzeit im Kundenkonto." },
  ],
  testsTitle: "Diese Tests gibt es im Abo",
  testsText: "Auf der Produktseite findest du die Abo-Option direkt neben dem Einzelkauf.",
  faqTitle: "Häufige Fragen zum Abo",
  faq: [
    { q: "Wo wähle ich das Abo aus?", a: "Auf der Produktseite unter „Kaufoption“. Voreingestellt ist Einzelkauf, daneben findest du das Abo. Sobald du es auswählst, sinkt der Preis um den Abo-Rabatt und du legst das Intervall fest." },
    { q: "Was ist der Unterschied zwischen Einzelkauf und Abo?", a: "Beim Einzelkauf bestellst du den Test einmal. Im Abo bekommst du denselben Test regelmäßig im gewählten Intervall und zahlst jedes Mal den reduzierten Preis. Inhalt und Laboranalyse sind gleich." },
    { q: "Gibt es eine Mindestlaufzeit?", a: "Nein. Du kannst das Abo jederzeit pausieren oder kündigen." },
    { q: "Wie pausiere oder kündige ich mein Abo?", a: "In deinem Kundenkonto unter „Mein Abo verwalten“. Dort kannst du auch das Intervall ändern." },
    { q: "Kann ich mehrere Tests im Abo haben?", a: "Ja. Jeder Test läuft als eigenes Abo und lässt sich separat verwalten." },
    { q: "Kostet der Versand im Abo extra?", a: "Innerhalb Deutschlands ist der Versand immer kostenlos und diskret verpackt. Bei Lieferungen ins Ausland können Versandkosten anfallen; sie stehen transparent im Checkout." },
  ],
  contact: "Noch Fragen zum Abo?",
  contactLink: "Schreib uns",
};

const en: Copy = {
  metaTitle: "DoctorBox subscription: home tests regularly and for less",
  metaDescription:
    "Home tests on subscription: {pct} % off every delivery, choose your interval, no minimum term, pause or cancel anytime.",
  kicker: "DoctorBox subscription",
  title: "Test regularly and [[save {pct} %]]",
  lead: "Your home test arrives automatically at the interval you choose. No minimum term: adjust, pause or cancel anytime.",
  heroAlt: "DoctorBox sample collection kit on a table in sunlight",
  ctaTests: "See tests with subscription",
  ctaManage: "Manage my subscription",
  stepsTitle: "How the subscription works",
  steps: [
    { title: "Pick a test", text: "On the product page, choose subscription instead of one-time purchase under “Purchase option”." },
    { title: "Set the interval", text: "You decide how often the test arrives. The subscription price applies to every delivery." },
    { title: "Delivered automatically", text: "The test arrives in discreet packaging. Change anything anytime in your customer account." },
  ],
  benefitsTitle: "Your benefits",
  benefits: [
    { title: "{pct} % off every delivery", text: "The discount applies for as long as the subscription runs." },
    { title: "Free & discreet", text: "Free shipping within Germany, in neutral packaging." },
    { title: "Flexible interval", text: "Choose how often you want to test and change it anytime." },
    { title: "No minimum term", text: "Pause or cancel anytime in your customer account." },
  ],
  testsTitle: "Tests available on subscription",
  testsText: "You find the subscription option on the product page right next to the one-time purchase.",
  faqTitle: "Subscription FAQ",
  faq: [
    { q: "Where do I choose the subscription?", a: "On the product page under “Purchase option”. One-time purchase is preselected; the subscription is right next to it. Once selected, the price drops by the subscription discount and you set the interval." },
    { q: "What is the difference between one-time purchase and subscription?", a: "A one-time purchase is a single order. With a subscription you receive the same test regularly at your chosen interval and pay the reduced price each time. Contents and lab analysis are the same." },
    { q: "Is there a minimum term?", a: "No. You can pause or cancel the subscription anytime." },
    { q: "How do I pause or cancel?", a: "In your customer account under “Manage my subscription”. You can change the interval there too." },
    { q: "Can I subscribe to several tests?", a: "Yes. Each test runs as its own subscription and can be managed separately." },
    { q: "Does shipping cost extra?", a: "Within Germany, shipping is always free and discreetly packaged. Deliveries abroad may incur shipping costs, shown transparently at checkout." },
  ],
  contact: "Questions about the subscription?",
  contactLink: "Write to us",
};

export const subscriptionCopy = (locale: Locale): Copy => (locale === "en" ? en : de);
