import type { Locale } from "@/lib/i18n/config";

/**
 * Collections with a full hero and an inline Mira chat focused on the topic.
 * `topic` is sent to the assistant API as a focus hint; `greeting` and `chips`
 * are what the visitor sees first. Copy is deliberately calm and non-judgemental.
 */
export type CollectionHero = {
  kicker: string;
  headline: string;
  lead: string;
  facts: string[];
  chat: {
    title: string;
    greeting: string;
    chips: string[];
    placeholder: string;
    topic: string;
  };
};

export const COLLECTION_HEROES: Record<string, Record<Locale, CollectionHero>> = {
  "sexuelle-gesundheit": {
    de: {
      kicker: "Sexuelle Gesundheit",
      headline: "Diskret testen, [[Klarheit bekommen]]",
      lead: "Ohne Praxisbesuch, ohne Wartezimmer. Probe zu Hause nehmen, Analyse im akkreditierten Labor, Befund in der App. Mira hilft dir, den passenden STI-Test zu finden.",
      facts: ["Neutrale Verpackung, diskreter Absender", "Urin, Abstrich oder Kapillarblut", "Akkreditiertes Labor in Deutschland", "Abholung in Berlin möglich"],
      chat: {
        title: "Mira, deine STI-Beratung",
        greeting:
          "Hi, ich bin Mira. Erzähl mir kurz deine Situation: Wann war der Kontakt, hast du Symptome, was möchtest du ausschließen? Ich sage dir, welcher Test passt und ab wann er aussagekräftig ist. Alles bleibt anonym.",
        chips: ["Ungeschützter Sex vor 2 Wochen, was jetzt?", "Ich habe keine Symptome, will aber sicher sein", "Ich habe Symptome", "Welcher Test deckt am meisten ab?"],
        placeholder: "Deine Situation in einem Satz …",
        topic:
          "Kategorie Sexuelle Gesundheit (STI-Tests). Frage zuerst nach Zeitpunkt des Kontakts und Symptomen, falls nicht genannt. Erkläre das diagnostische Fenster: Chlamydien und Gonorrhö etwa 2 Wochen nach Kontakt, HIV-Labortest etwa 6 Wochen, Syphilis etwa 6 Wochen, Hepatitis B/C 6 bis 12 Wochen; vor Ablauf kann ein negatives Ergebnis trügen. Bei Symptomen (Ausfluss, Brennen, Geschwüre, Fieber) ärztliche Vorstellung empfehlen, bei Verdacht auf frischen HIV-Kontakt innerhalb von 48 Stunden auf PEP in Notaufnahme oder HIV-Schwerpunktpraxis hinweisen. Empfiehl nur STI-Tests aus dem Katalog. Ton: ruhig, ohne Wertung, kurz.",
      },
    },
    en: {
      kicker: "Sexual health",
      headline: "Test discreetly, [[get clarity]]",
      lead: "No clinic visit, no waiting room. Take the sample at home, analysis in an accredited lab, results in the app. Mira helps you find the right STI test.",
      facts: ["Neutral packaging, discreet sender", "Urine, swab or capillary blood", "Accredited laboratory in Germany", "Pickup in Berlin available"],
      chat: {
        title: "Mira, your STI advisor",
        greeting:
          "Hi, I'm Mira. Tell me briefly about your situation: when was the contact, do you have symptoms, what do you want to rule out? I'll tell you which test fits and from when it is reliable. Everything stays anonymous.",
        chips: ["Unprotected sex two weeks ago, what now?", "No symptoms, but I want to be sure", "I have symptoms", "Which test covers the most?"],
        placeholder: "Your situation in one sentence …",
        topic:
          "Category sexual health (STI tests). First ask about the time of contact and symptoms if not stated. Explain the diagnostic window: chlamydia and gonorrhoea about 2 weeks after contact, HIV lab test about 6 weeks, syphilis about 6 weeks, hepatitis B/C 6 to 12 weeks; before that a negative result can be misleading. With symptoms (discharge, burning, sores, fever) recommend seeing a doctor; for a suspected recent HIV exposure within 48 hours point to PEP at an emergency department or HIV clinic. Recommend only STI tests from the catalogue. Tone: calm, non-judgemental, brief.",
      },
    },
  },
};

export const collectionHero = (handle: string | null, locale: Locale): CollectionHero | null =>
  handle ? (COLLECTION_HEROES[handle]?.[locale] ?? null) : null;
