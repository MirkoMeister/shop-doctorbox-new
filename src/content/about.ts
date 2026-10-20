import type { Locale } from "@/lib/i18n/config";

/**
 * Copy for /pages/uber-uns. Text follows the live page on shop.doctorbox.de
 * (mission, three principles, customer quote, app teaser); no new claims added.
 */
export type AboutCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  headline: string;
  lead: string;
  intro: string;
  ctaTests: string;
  ctaB2b: string;
  principlesTitle: string;
  principles: { title: string; text: string }[];
  howTitle: string;
  how: { title: string; text: string }[];
  quote: { text: string; author: string; source: string };
  appTitle: string;
  appText: string;
  appStore: string;
  playStore: string;
  reviewsCta: string;
  contactCta: string;
  missionTitle: string;
  missionText: string;
};

export const ABOUT: Record<Locale, AboutCopy> = {
  de: {
    metaTitle: "Über uns: Gesundheit selbst in die Hand nehmen",
    metaDescription:
      "DoctorBox macht Laboranalysen von zu Hause aus einfach: Testkit bestellen oder in Berlin abholen, Probe nehmen, Befund digital in der App. Lerne uns kennen.",
    kicker: "Über uns",
    headline: "Gesundheit selbst in die [[Hand nehmen]]",
    lead: "Das Leben kann kompliziert sein. Sich um sich selbst zu kümmern, sollte es nicht sein.",
    intro:
      "Bei DoctorBox bekommst du genau das, was du brauchst: Tests für deine Gesundheit, bequem von zu Hause aus. Du wählst den Test, der zu deiner Frage passt, nimmst die Probe selbst und bekommst den Laborbefund digital. Ohne Wartezimmer, ohne Verzögerung, mit der Kontrolle über deine Gesundheitsentscheidungen in deiner Hand.",
    ctaTests: "Zu unseren Heimtests",
    ctaB2b: "Für Unternehmen",
    principlesTitle: "Woran wir [[glauben]]",
    principles: [
      {
        title: "Weil deine Gesundheit wichtig ist",
        text: "Gesundheitsversorgung sollte bedingungslos sein. Du verdienst es, schnell und mit geringem Aufwand versorgt zu werden. Deshalb setzen wir uns für eine neue Art der Versorgung ein: einfacher, zeitgemäßer, digitaler, mit relevanten Tests, die für alle zugänglich und erschwinglich sind.",
      },
      {
        title: "Hallo Freiheit, hallo DoctorBox",
        text: "Niemand hat Zeit und Lust, in Apotheke oder Praxis Schlange zu stehen. Und einen Arzttermin rechtzeitig zu bekommen, ist oft nicht leicht. DoctorBox macht es jedem leicht, schnell, diskret und erschwinglich an Tests zu kommen, unabhängig von den Umständen.",
      },
      {
        title: "Gesundheitsversorgung umdenken",
        text: "Wir gestalten die Zukunft der Gesundheitsversorgung für Patientinnen, Patienten und medizinisches Fachpersonal neu. Begleite uns auf dem Weg, Versorgung zu digitalisieren, zeitgemäßer zu gestalten und zugänglicher zu machen.",
      },
    ],
    howTitle: "So arbeiten [[wir]]",
    how: [
      { title: "Testkit nach Hause oder zur Abholung", text: "Neutral verpackt per Post oder direkt bei uns in Berlin abholen." },
      { title: "Probe selbst nehmen", text: "Kapillarblut, Urin, Speichel oder Abstrich, mit Schritt-für-Schritt-Anleitung im Kit und in der App." },
      { title: "Analyse im akkreditierten Labor", text: "Unsere Partnerlabore in Deutschland werten deine Probe aus." },
      { title: "Befund digital in der App", text: "Mit Referenzbereichen und Erklärungen. Verfolge deine Werte im Zeitverlauf." },
    ],
    quote: {
      text: "Super praktische Gesundheitsüberwachung! Das Heimtest-Kit ist unglaublich benutzerfreundlich und liefert schnell und einfach wertvolle Erkenntnisse über meine Gesundheit.",
      author: "Madu C.",
      source: "auf Google",
    },
    appTitle: "Deine Werte, [[im Blick]]",
    appText:
      "In der DoctorBox App registrierst du dein Testkit, bekommst den Befund und verfolgst deine Werte im Laufe der Zeit mit der Verlaufsübersicht. So behältst du den Überblick über deine Gesundheit.",
    appStore: "Im App Store laden",
    playStore: "Bei Google Play laden",
    reviewsCta: "Das sagen unsere Kunden",
    contactCta: "Kontakt aufnehmen",
    missionTitle: "DoctorBox: Gesund länger leben",
    missionText:
      "Wir glauben, dass relevante Gesundheitsdaten jedem zugänglich sein sollten. Dafür entwickeln wir Testkits, arbeiten mit akkreditierten Laboren zusammen und liefern Befunde dorthin, wo du sie brauchst: auf dein Smartphone.",
  },
  en: {
    metaTitle: "About us: take health into your own hands",
    metaDescription:
      "DoctorBox makes lab analysis from home simple: order a test kit or pick it up in Berlin, take the sample, get your results digitally in the app. Get to know us.",
    kicker: "About us",
    headline: "Take health into your [[own hands]]",
    lead: "Life can be complicated. Taking care of yourself shouldn't be.",
    intro:
      "At DoctorBox you get exactly what you need: health tests, conveniently from home. You choose the test that answers your question, take the sample yourself and receive the lab results digitally. No waiting room, no delays, and the control over your health decisions stays in your hands.",
    ctaTests: "To our home tests",
    ctaB2b: "For businesses",
    principlesTitle: "What we [[believe in]]",
    principles: [
      {
        title: "Because your health matters",
        text: "Healthcare should be unconditional. You deserve to be looked after quickly and with minimal effort. That's why we're committed to a new kind of care: simpler, more modern, digital, with relevant tests that are accessible and affordable for everyone.",
      },
      {
        title: "Hello freedom, hello DoctorBox",
        text: "Nobody has the time or desire to queue at a pharmacy or doctor's office, and getting an appointment in time is often hard. DoctorBox makes it easy for anyone to get tested quickly, discreetly and affordably, whatever their circumstances.",
      },
      {
        title: "Rethinking healthcare",
        text: "We are reimagining the future of healthcare for patients and medical professionals. Join us as we work to digitalise, modernise and open up care for everyone.",
      },
    ],
    howTitle: "How we [[work]]",
    how: [
      { title: "Test kit to your door or for pickup", text: "Shipped in neutral packaging, or collect it directly from us in Berlin." },
      { title: "Take the sample yourself", text: "Capillary blood, urine, saliva or swab, with step-by-step instructions in the kit and in the app." },
      { title: "Analysis in an accredited lab", text: "Our partner laboratories in Germany analyse your sample." },
      { title: "Results digitally in the app", text: "With reference ranges and explanations. Track your values over time." },
    ],
    quote: {
      text: "Super convenient health monitoring! The home test kit is incredibly user-friendly and provides valuable insights into my health quickly and easily.",
      author: "Madu C.",
      source: "on Google",
    },
    appTitle: "Your values, [[at a glance]]",
    appText:
      "In the DoctorBox app you register your test kit, receive your results and track your values over time with the history overview. That way you keep an eye on your health.",
    appStore: "Download on the App Store",
    playStore: "Get it on Google Play",
    reviewsCta: "What our customers say",
    contactCta: "Get in touch",
    missionTitle: "DoctorBox: live longer and healthier",
    missionText:
      "We believe relevant health data should be accessible to everyone. So we develop test kits, work with accredited laboratories and deliver results to where you need them: your smartphone.",
  },
};
