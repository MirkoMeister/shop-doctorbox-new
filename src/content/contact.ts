import type { Locale } from "@/lib/i18n/config";

export const CONTACT = {
  company: "DoctorBox Service GmbH",
  street: "Taubenstr. 26",
  city: "10117 Berlin",
  country: { de: "Deutschland", en: "Germany" },
  email: "heimtest@doctorbox.eu",
  phone: "+49 30 34045468",
  phoneHref: "tel:+493034045468",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Taubenstr.+26,+10117+Berlin",
};

export type ContactCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  headline: string;
  lead: string;
  cards: { email: { title: string; text: string }; phone: { title: string; text: string }; pickup: { title: string; text: string; cta: string } };
  quickTitle: string;
  quick: { mira: string; miraText: string; faq: string; result: string; shipping: string; refund: string };
  formTitle: string;
  formText: string;
  form: {
    topic: string;
    topics: { value: string; label: string }[];
    name: string;
    email: string;
    order: string;
    orderHint: string;
    message: string;
    submit: string;
    privacy: string;
    successTitle: string;
    successText: string;
    errorGeneric: string;
    errorEmail: string;
  };
  socialTitle: string;
};

export const CONTACT_COPY: Record<Locale, ContactCopy> = {
  de: {
    metaTitle: "Kontakt: Wir sind für dich da",
    metaDescription: "Fragen zu Bestellung, Testkit oder Befund? Schreib uns, ruf an oder hol dein Testkit in Berlin ab. DoctorBox Service GmbH, Taubenstr. 26, 10117 Berlin.",
    kicker: "Kontakt",
    headline: "Wir sind [[für dich da]]",
    lead: "Fragen zur Bestellung, zum Testkit oder zum Befund? Schreib uns, ruf an oder komm in Berlin vorbei. Für schnelle Antworten kennt Mira jeden Test.",
    cards: {
      email: { title: "E-Mail", text: "Für alles rund um Bestellung, Kit und Befund. Wir antworten so schnell wie möglich." },
      phone: { title: "Telefon", text: "Wenn es schneller gehen soll oder du lieber sprichst." },
      pickup: { title: "Abholung in Berlin", text: "Testkits kannst du direkt bei uns in Berlin-Mitte abholen. Wähle im Checkout einfach Abholung.", cta: "Route planen" },
    },
    quickTitle: "Schnelle Hilfe",
    quick: {
      mira: "Mira fragen",
      miraText: "Welcher Test passt, was bedeutet ein Wert, wie läuft die Probe? Mira antwortet sofort.",
      faq: "Häufige Fragen",
      result: "Mein Testergebnis",
      shipping: "Versand & Abholung",
      refund: "Widerruf & Rückgabe",
    },
    formTitle: "Schreib uns",
    formText: "Beschreib kurz dein Anliegen. Bei Fragen zu einer Bestellung hilft uns die Bestellnummer aus deiner Bestätigungs-E-Mail.",
    form: {
      topic: "Worum geht es?",
      topics: [
        { value: "order", label: "Bestellung oder Lieferung" },
        { value: "kit", label: "Testkit und Probenahme" },
        { value: "result", label: "Befund und App" },
        { value: "product", label: "Frage zu einem Test" },
        { value: "subscription", label: "Abo ändern oder kündigen" },
        { value: "b2b", label: "Unternehmen und Partner" },
        { value: "other", label: "Etwas anderes" },
      ],
      name: "Name",
      email: "E-Mail",
      order: "Bestellnummer",
      orderHint: "optional, z. B. #12345",
      message: "Deine Nachricht",
      submit: "Nachricht senden",
      privacy: "Mit dem Absenden stimmst du der Verarbeitung deiner Angaben zur Bearbeitung der Anfrage zu. Details in der Datenschutzerklärung.",
      successTitle: "Danke, deine Nachricht ist bei uns.",
      successText: "Wir melden uns so schnell wie möglich per E-Mail.",
      errorGeneric: "Das hat leider nicht geklappt. Bitte versuch es noch einmal oder schreib direkt an heimtest@doctorbox.eu.",
      errorEmail: "Bitte prüfe deine E-Mail-Adresse.",
    },
    socialTitle: "Folge uns",
  },
  en: {
    metaTitle: "Contact: we're here for you",
    metaDescription: "Questions about your order, test kit or results? Write to us, call us or pick up your kit in Berlin. DoctorBox Service GmbH, Taubenstr. 26, 10117 Berlin.",
    kicker: "Contact",
    headline: "We're [[here for you]]",
    lead: "Questions about your order, the test kit or your results? Write to us, call us or drop by in Berlin. For quick answers, Mira knows every test.",
    cards: {
      email: { title: "E-mail", text: "For everything about orders, kits and results. We reply as quickly as we can." },
      phone: { title: "Phone", text: "If it needs to be quick or you prefer to talk." },
      pickup: { title: "Pickup in Berlin", text: "You can collect test kits directly from us in Berlin-Mitte. Simply choose pickup at checkout.", cta: "Get directions" },
    },
    quickTitle: "Quick help",
    quick: {
      mira: "Ask Mira",
      miraText: "Which test fits, what a value means, how sampling works: Mira answers right away.",
      faq: "FAQ",
      result: "My test result",
      shipping: "Shipping & pickup",
      refund: "Cancellation & returns",
    },
    formTitle: "Write to us",
    formText: "Describe your request briefly. For order questions, the order number from your confirmation e-mail helps us.",
    form: {
      topic: "What is it about?",
      topics: [
        { value: "order", label: "Order or delivery" },
        { value: "kit", label: "Test kit and sampling" },
        { value: "result", label: "Results and app" },
        { value: "product", label: "Question about a test" },
        { value: "subscription", label: "Change or cancel subscription" },
        { value: "b2b", label: "Business and partners" },
        { value: "other", label: "Something else" },
      ],
      name: "Name",
      email: "E-mail",
      order: "Order number",
      orderHint: "optional, e.g. #12345",
      message: "Your message",
      submit: "Send message",
      privacy: "By sending you agree to the processing of your details to handle the request. See the privacy policy for details.",
      successTitle: "Thanks, your message has reached us.",
      successText: "We'll get back to you by e-mail as soon as possible.",
      errorGeneric: "That didn't work. Please try again or write directly to heimtest@doctorbox.eu.",
      errorEmail: "Please check your e-mail address.",
    },
    socialTitle: "Follow us",
  },
};
