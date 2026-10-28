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

const FACTS = {
  de: {
    lab: "Akkreditiertes Labor in Deutschland",
    app: "Befund mit Einordnung in der App",
    pickup: "Abholung in Berlin möglich",
    blood: "Kapillarblut aus der Fingerkuppe",
    discreet: "Neutrale Verpackung, diskreter Absender",
    sub: "Als Abo 20 % günstiger",
  },
  en: {
    lab: "Accredited laboratory in Germany",
    app: "Results with context in the app",
    pickup: "Pickup in Berlin available",
    blood: "Capillary blood from a fingertip",
    discreet: "Neutral packaging, discreet sender",
    sub: "20 % off as a subscription",
  },
};

const GUARD = {
  de: "Empfiehl nur Tests aus dieser Kategorie oder eng verwandte Tests aus dem Katalog. Ton: ruhig, konkret, kurz.",
  en: "Recommend only tests from this category or closely related catalogue tests. Tone: calm, concrete, brief.",
};

export const COLLECTION_HEROES: Record<string, Record<Locale, CollectionHero>> = {
  "sexuelle-gesundheit": {
    de: {
      kicker: "Sexuelle Gesundheit",
      headline: "Diskret testen, [[Klarheit bekommen]]",
      lead: "Ohne Praxisbesuch, ohne Wartezimmer. Probe zu Hause nehmen, Analyse im akkreditierten Labor, Befund in der App. Mira hilft dir, den passenden STI-Test zu finden.",
      facts: [FACTS.de.discreet, "Urin, Abstrich oder Kapillarblut", FACTS.de.lab, FACTS.de.pickup],
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
      facts: [FACTS.en.discreet, "Urine, swab or capillary blood", FACTS.en.lab, FACTS.en.pickup],
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

  "nahrstoffe-vitamine": {
    de: {
      kicker: "Nährstoffe & Vitamine",
      headline: "Wissen statt raten, [[was dir fehlt]]",
      lead: "Vitamin D, B12, Eisen, Magnesium und mehr: Ein paar Tropfen Blut zeigen, wo du wirklich stehst, bevor du Nahrungsergänzung kaufst.",
      facts: [FACTS.de.blood, FACTS.de.lab, FACTS.de.app, FACTS.de.sub],
      chat: {
        title: "Mira, deine Nährstoff-Beratung",
        greeting:
          "Hi, ich bin Mira. Sag mir, was dich beschäftigt: Müdigkeit, Haarausfall, vegane Ernährung, viel Sport oder einfach ein Check-up? Ich zeige dir, welche Werte dazu passen und welcher Test sie misst.",
        chips: ["Ich ernähre mich vegan", "Ständig müde und schlapp", "Haarausfall, brüchige Nägel", "Einmal alles Wichtige checken"],
        placeholder: "Was möchtest du wissen?",
        topic:
          "Kategorie Nährstoffe & Vitamine. Ordne Anliegen typischen Werten zu: Müdigkeit → Ferritin, Vitamin D, B12, Folsäure; vegan → B12 (Holo-TC), Eisen, Zink; Haarausfall → Ferritin, Zink, Schilddrüse; Sport → Magnesium, Ferritin, Vitamin D. Erkläre, dass Nahrungsergänzung sinnvoller nach Messung ist und Dosierungen ärztlich abgestimmt werden sollten. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Nutrients & vitamins",
      headline: "Know instead of guessing [[what you lack]]",
      lead: "Vitamin D, B12, iron, magnesium and more: a few drops of blood show where you really stand, before you buy supplements.",
      facts: [FACTS.en.blood, FACTS.en.lab, FACTS.en.app, FACTS.en.sub],
      chat: {
        title: "Mira, your nutrient advisor",
        greeting:
          "Hi, I'm Mira. Tell me what's on your mind: tiredness, hair loss, a vegan diet, lots of sport or simply a check-up? I'll show you which values fit and which test measures them.",
        chips: ["I eat vegan", "Constantly tired", "Hair loss, brittle nails", "Check everything important once"],
        placeholder: "What would you like to know?",
        topic:
          "Category nutrients & vitamins. Map concerns to typical values: tiredness → ferritin, vitamin D, B12, folate; vegan → B12 (holo-TC), iron, zinc; hair loss → ferritin, zinc, thyroid; sport → magnesium, ferritin, vitamin D. Explain that supplementing makes more sense after measuring and that doses should be agreed with a doctor. " +
          GUARD.en,
      },
    },
  },

  hormone: {
    de: {
      kicker: "Hormone",
      headline: "Deine Hormone, [[schwarz auf weiß]]",
      lead: "Schilddrüse, Testosteron, Zyklushormone, Cortisol: Wenn Energie, Stimmung, Gewicht oder Zyklus aus dem Takt sind, lohnt ein Blick auf die Werte.",
      facts: [FACTS.de.blood, "Für Frauen und Männer", FACTS.de.lab, FACTS.de.app],
      chat: {
        title: "Mira, deine Hormon-Beratung",
        greeting:
          "Hi, ich bin Mira. Geht es um Schilddrüse, Zyklus, Testosteron oder Stress? Erzähl mir kurz, was du merkst, dann sage ich dir, welche Hormone man dafür anschaut und welcher Test passt.",
        chips: ["Unregelmäßiger Zyklus", "Wenig Energie und Libido (Mann)", "Gewicht und Frieren: Schilddrüse?", "Dauerstress, schlecht schlafen"],
        placeholder: "Was merkst du bei dir?",
        topic:
          "Kategorie Hormone. Frage, ob Frau oder Mann und welches Anliegen, falls unklar. Zyklus/Kinderwunsch → Fruchtbarkeits Check oder Hormon Check für Frauen (FSH, LH, Estradiol, AMH, Prolaktin); Mann → Hormon Check für Männer oder Testosteron Check; Schilddrüse → Schilddrüsen Check Plus (TSH, fT3, fT4); Stress → Cortisol. Weise darauf hin, dass Zyklushormone vom Zyklustag abhängen und Befunde ärztlich eingeordnet werden sollten. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Hormones",
      headline: "Your hormones, [[in black and white]]",
      lead: "Thyroid, testosterone, cycle hormones, cortisol: when energy, mood, weight or your cycle are out of rhythm, it pays to look at the values.",
      facts: [FACTS.en.blood, "For women and men", FACTS.en.lab, FACTS.en.app],
      chat: {
        title: "Mira, your hormone advisor",
        greeting:
          "Hi, I'm Mira. Is it about thyroid, cycle, testosterone or stress? Tell me briefly what you notice and I'll say which hormones are looked at and which test fits.",
        chips: ["Irregular cycle", "Low energy and libido (man)", "Weight and feeling cold: thyroid?", "Constant stress, poor sleep"],
        placeholder: "What do you notice?",
        topic:
          "Category hormones. Ask whether woman or man and what the concern is, if unclear. Cycle/fertility → fertility check or women's hormone check (FSH, LH, oestradiol, AMH, prolactin); man → men's hormone check or testosterone check; thyroid → thyroid check plus (TSH, fT3, fT4); stress → cortisol. Note that cycle hormones depend on the cycle day and results should be interpreted by a doctor. " +
          GUARD.en,
      },
    },
  },

  "herz-kreislauf": {
    de: {
      kicker: "Herz & Kreislauf",
      headline: "Risiken erkennen, [[bevor sie zählen]]",
      lead: "Blutfette, Blutzucker, Entzündung und Nierenwerte: Die Werte, die über Herz und Gefäße entscheiden, lassen sich zu Hause messen.",
      facts: [FACTS.de.blood, FACTS.de.lab, FACTS.de.app, FACTS.de.sub],
      chat: {
        title: "Mira, deine Herz-Kreislauf-Beratung",
        greeting:
          "Hi, ich bin Mira. Möchtest du nur deine Blutfette prüfen, hast du Risikofaktoren wie Bluthochdruck oder Herzinfarkte in der Familie, oder suchst du einen breiten Vorsorge-Check? Sag mir kurz Bescheid, dann finde ich den passenden Test.",
        chips: ["Cholesterin checken", "Herzinfarkt in der Familie", "Bluthochdruck und Übergewicht", "Alles Wichtige fürs Herz"],
        placeholder: "Worum geht es dir?",
        topic:
          "Kategorie Herz & Kreislauf. Blutfette → Lipid Check (Cholesterin, LDL, HDL, Triglyceride); breit → Herz-Kreislauf Check oder Rundum Check; Entzündung → Entzündungscheck (hs-CRP); Stoffwechsel/Gewicht → Stoffwechsel Check Plus (HbA1c); Nieren → Nieren Profil. Bei akuten Beschwerden (Brustschmerz, Atemnot) sofort Notruf 112, kein Heimtest. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Heart & circulation",
      headline: "Spot risks [[before they count]]",
      lead: "Blood lipids, blood sugar, inflammation and kidney values: the values that matter for heart and vessels can be measured at home.",
      facts: [FACTS.en.blood, FACTS.en.lab, FACTS.en.app, FACTS.en.sub],
      chat: {
        title: "Mira, your heart advisor",
        greeting:
          "Hi, I'm Mira. Do you just want to check your blood lipids, do you have risk factors like high blood pressure or heart attacks in the family, or are you looking for a broad check-up? Tell me briefly and I'll find the right test.",
        chips: ["Check cholesterol", "Heart attack in the family", "High blood pressure and overweight", "Everything important for the heart"],
        placeholder: "What is it about?",
        topic:
          "Category heart & circulation. Lipids → lipid check (cholesterol, LDL, HDL, triglycerides); broad → heart & circulation check or all-round check; inflammation → inflammation check (hs-CRP); metabolism/weight → metabolic check plus (HbA1c); kidneys → kidney profile. With acute symptoms (chest pain, shortness of breath) call 112 immediately, no home test. " +
          GUARD.en,
      },
    },
  },

  frauengesundheit: {
    de: {
      kicker: "Frauengesundheit",
      headline: "Vorsorge und Hormone, [[in deinem Tempo]]",
      lead: "HPV, Zyklus- und Fruchtbarkeitshormone, Intimgesundheit und genetische Risiken: Tests, die zu den Fragen passen, die Frauen sich stellen.",
      facts: ["Abstrich oder Kapillarblut, zu Hause", FACTS.de.discreet, FACTS.de.lab, FACTS.de.app],
      chat: {
        title: "Mira, deine Beratung für Frauen",
        greeting:
          "Hi, ich bin Mira. Geht es um Vorsorge wie HPV, um Zyklus und Hormone, um Beschwerden im Intimbereich oder um ein familiäres Risiko? Erzähl mir kurz, worum es geht, ich zeige dir den passenden Test.",
        chips: ["HPV-Vorsorge zu Hause", "Zyklus und Hormone verstehen", "Juckreiz oder Ausfluss", "Brustkrebs in der Familie"],
        placeholder: "Worum geht es dir?",
        topic:
          "Kategorie Frauengesundheit. HPV → HPV High Risk Test (ersetzt nicht die gynäkologische Vorsorge, ergänzt sie); Zyklus/Hormone → Hormon Check oder Fruchtbarkeits Check für Frauen, AMH für die Eizellreserve; Juckreiz/Ausfluss → Vaginalpilz-Set oder STI Complete Trio, bei starken Beschwerden Ärztin; familiäres Risiko → Gentests (Brustkrebs, Darmkrebs, Hautkrebs) als Risikoeinschätzung, keine Diagnose, Ergebnis am besten mit genetischer Beratung besprechen. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Women's health",
      headline: "Prevention and hormones, [[at your pace]]",
      lead: "HPV, cycle and fertility hormones, intimate health and genetic risks: tests that fit the questions women ask themselves.",
      facts: ["Swab or capillary blood, at home", FACTS.en.discreet, FACTS.en.lab, FACTS.en.app],
      chat: {
        title: "Mira, your advisor for women",
        greeting:
          "Hi, I'm Mira. Is it about prevention like HPV, cycle and hormones, intimate discomfort or a family risk? Tell me briefly and I'll show you the right test.",
        chips: ["HPV screening at home", "Understand cycle and hormones", "Itching or discharge", "Breast cancer in the family"],
        placeholder: "What is it about?",
        topic:
          "Category women's health. HPV → HPV high-risk test (complements, does not replace gynaecological screening); cycle/hormones → women's hormone check or fertility check, AMH for ovarian reserve; itching/discharge → vaginal yeast kit or STI Complete Trio, see a doctor with strong symptoms; family risk → genetic tests (breast, bowel, skin cancer) as risk estimation, not a diagnosis, best discussed with genetic counselling. " +
          GUARD.en,
      },
    },
  },

  mannergesundheit: {
    de: {
      kicker: "Männergesundheit",
      headline: "Vorsorge, die [[nicht wartet]]",
      lead: "Testosteron, Prostata, Herz-Kreislauf und genetische Risiken: Die Werte, die Männer selten prüfen lassen, in zehn Minuten zu Hause gemessen.",
      facts: [FACTS.de.blood, FACTS.de.discreet, FACTS.de.lab, FACTS.de.app],
      chat: {
        title: "Mira, deine Beratung für Männer",
        greeting:
          "Hi, ich bin Mira. Geht es um Energie und Testosteron, um die Prostata, einen breiten Check oder ein familiäres Risiko? Sag mir kurz, was dich beschäftigt, dann zeige ich dir den passenden Test.",
        chips: ["Wenig Energie, weniger Libido", "PSA-Wert prüfen", "Einmal alles checken", "Prostatakrebs in der Familie"],
        placeholder: "Was beschäftigt dich?",
        topic:
          "Kategorie Männergesundheit. Energie/Libido → Testosteron Check oder Hormon Check für Männer; Prostata → PSA Test (Hinweis: PSA ist ein Vorsorgewert, Auffälligkeiten urologisch abklären); breit → Rundum Check für Männer; familiäres Risiko → Gentests (Prostata-, Darm-, Hautkrebs) als Risikoeinschätzung, keine Diagnose; STI → STI Complete Trio für Männer. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Men's health",
      headline: "Prevention that [[doesn't wait]]",
      lead: "Testosterone, prostate, heart and genetic risks: the values men rarely get checked, measured at home in ten minutes.",
      facts: [FACTS.en.blood, FACTS.en.discreet, FACTS.en.lab, FACTS.en.app],
      chat: {
        title: "Mira, your advisor for men",
        greeting:
          "Hi, I'm Mira. Is it about energy and testosterone, the prostate, a broad check or a family risk? Tell me briefly what's on your mind and I'll show you the right test.",
        chips: ["Low energy, less libido", "Check PSA", "Check everything once", "Prostate cancer in the family"],
        placeholder: "What's on your mind?",
        topic:
          "Category men's health. Energy/libido → testosterone check or men's hormone check; prostate → PSA test (note: PSA is a screening value, abnormal results need urological follow-up); broad → men's all-round check; family risk → genetic tests (prostate, bowel, skin cancer) as risk estimation, not a diagnosis; STI → STI Complete Trio for men. " +
          GUARD.en,
      },
    },
  },

  longevity: {
    de: {
      kicker: "Longevity & Fitness",
      headline: "Länger fit, [[messbar]]",
      lead: "Biologisches Alter, Entzündung, Stoffwechsel, Cortisol und Leistungswerte: Die Marker, die zeigen, wie gut dein Körper altert und regeneriert.",
      facts: [FACTS.de.blood, "Verlauf in der App verfolgen", FACTS.de.lab, FACTS.de.sub],
      chat: {
        title: "Mira, deine Longevity-Beratung",
        greeting:
          "Hi, ich bin Mira. Willst du dein biologisches Alter kennen, deine Regeneration und Leistung optimieren oder stille Entzündungen aufspüren? Erzähl mir kurz dein Ziel, dann zeige ich dir die passenden Marker.",
        chips: ["Biologisches Alter bestimmen", "Besser regenerieren beim Sport", "Stille Entzündung aufspüren", "Stress und Cortisol"],
        placeholder: "Was ist dein Ziel?",
        topic:
          "Kategorie Longevity & Fitness. Biologisches Alter → Bio Age Kit; Sport/Regeneration → Fitness Check Pro (Ferritin, Magnesium, CK, Vitamin D u. a.); Entzündung → Entzündungscheck (hs-CRP); Stoffwechsel → Stoffwechsel Check Plus; Stress → Cortisol Check; breit → Rundum Check. Betone Verlaufsmessung (Abo) statt Einzelwert, keine Versprechen zu Lebensverlängerung. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Longevity & fitness",
      headline: "Fit for longer, [[measurably]]",
      lead: "Biological age, inflammation, metabolism, cortisol and performance values: the markers that show how well your body ages and recovers.",
      facts: [FACTS.en.blood, "Track trends in the app", FACTS.en.lab, FACTS.en.sub],
      chat: {
        title: "Mira, your longevity advisor",
        greeting:
          "Hi, I'm Mira. Do you want to know your biological age, optimise recovery and performance, or spot silent inflammation? Tell me your goal briefly and I'll show you the matching markers.",
        chips: ["Determine biological age", "Recover better from training", "Spot silent inflammation", "Stress and cortisol"],
        placeholder: "What is your goal?",
        topic:
          "Category longevity & fitness. Biological age → Bio Age kit; sport/recovery → Fitness Check Pro (ferritin, magnesium, CK, vitamin D etc.); inflammation → inflammation check (hs-CRP); metabolism → metabolic check plus; stress → cortisol check; broad → all-round check. Emphasise tracking over time (subscription) rather than a single value; no promises about extending life. " +
          GUARD.en,
      },
    },
  },

  vorsorge: {
    de: {
      kicker: "Vorsorge",
      headline: "Früh erkennen, [[gelassen bleiben]]",
      lead: "Darm, Prostata, HPV, Blutzucker, Leber und Herz: Vorsorgetests für zu Hause, die ärztliche Untersuchungen sinnvoll ergänzen.",
      facts: ["Blut, Stuhl oder Abstrich, je nach Test", FACTS.de.lab, FACTS.de.app, FACTS.de.pickup],
      chat: {
        title: "Mira, deine Vorsorge-Beratung",
        greeting:
          "Hi, ich bin Mira. Welche Vorsorge steht bei dir an: Darm, Prostata, HPV, Blutzucker oder ein allgemeiner Check? Sag mir dein Alter und worum es geht, dann empfehle ich dir den passenden Test.",
        chips: ["Darmkrebsvorsorge ab 50", "Blutzucker und Diabetes-Risiko", "Leber checken", "Welche Vorsorge passt zu meinem Alter?"],
        placeholder: "Welche Vorsorge meinst du?",
        topic:
          "Kategorie Vorsorge. Darm → Darmkrebsvorsorge (Stuhltest) oder ColoAlert; Prostata → PSA Test; HPV → HPV High Risk Test; Blutzucker → HbA1c-Test; Leber → Leber Check; Herz → Herz-Kreislauf Check, Lipid Check; Darmbarriere → Leaky Gut Test. Heimtests ergänzen die gesetzliche Vorsorge, sie ersetzen Koloskopie oder gynäkologische Untersuchung nicht. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Prevention",
      headline: "Detect early, [[stay calm]]",
      lead: "Bowel, prostate, HPV, blood sugar, liver and heart: at-home screening tests that sensibly complement medical check-ups.",
      facts: ["Blood, stool or swab, depending on the test", FACTS.en.lab, FACTS.en.app, FACTS.en.pickup],
      chat: {
        title: "Mira, your prevention advisor",
        greeting:
          "Hi, I'm Mira. Which screening is on your mind: bowel, prostate, HPV, blood sugar or a general check? Tell me your age and what it's about and I'll recommend the right test.",
        chips: ["Bowel cancer screening from 50", "Blood sugar and diabetes risk", "Check the liver", "Which screening fits my age?"],
        placeholder: "Which screening do you mean?",
        topic:
          "Category prevention. Bowel → bowel cancer screening (stool test) or ColoAlert; prostate → PSA test; HPV → HPV high-risk test; blood sugar → HbA1c test; liver → liver check; heart → heart & circulation check, lipid check; gut barrier → leaky gut test. Home tests complement statutory screening; they do not replace colonoscopy or gynaecological examination. " +
          GUARD.en,
      },
    },
  },

  "kinderwunsch-fruchtbarkeit": {
    de: {
      kicker: "Kinderwunsch & Fruchtbarkeit",
      headline: "Wissen, wo du stehst, [[bevor du wartest]]",
      lead: "AMH, FSH, LH, Estradiol, Prolaktin und Schilddrüse: Die Hormone, die über Zyklus und Eizellreserve Auskunft geben, aus einer kleinen Blutprobe zu Hause.",
      facts: [FACTS.de.blood, FACTS.de.lab, FACTS.de.app, FACTS.de.discreet],
      chat: {
        title: "Mira, deine Kinderwunsch-Beratung",
        greeting:
          "Hi, ich bin Mira. Versucht ihr schon länger, schwanger zu werden, möchtest du deine Eizellreserve kennen oder ist dein Zyklus unregelmäßig? Erzähl mir kurz, dann sage ich dir, welche Hormone man anschaut.",
        chips: ["Wir versuchen es seit über einem Jahr", "Eizellreserve (AMH) kennen", "Unregelmäßiger Zyklus", "Kinderwunsch mit über 35"],
        placeholder: "Erzähl mir kurz von dir …",
        topic:
          "Kategorie Kinderwunsch & Fruchtbarkeit. Eizellreserve → Anti-Müller Hormontest; Zyklus/Fruchtbarkeit umfassend → Fruchtbarkeits Check für Frauen (FSH, LH, Estradiol, AMH, Prolaktin, TSH u. a.); Basis → Hormon Check für Frauen. Hinweise: Zyklushormone zyklustagabhängig (FSH/LH/Estradiol Tag 2 bis 5), AMH jederzeit. Nach 12 Monaten erfolglosem Versuch (ab 35: 6 Monaten) gynäkologische oder reproduktionsmedizinische Abklärung empfehlen, auch den Partner (Spermiogramm). Empathisch, ohne Druck. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Fertility",
      headline: "Know where you stand [[before you wait]]",
      lead: "AMH, FSH, LH, oestradiol, prolactin and thyroid: the hormones that tell you about cycle and ovarian reserve, from a small blood sample at home.",
      facts: [FACTS.en.blood, FACTS.en.lab, FACTS.en.app, FACTS.en.discreet],
      chat: {
        title: "Mira, your fertility advisor",
        greeting:
          "Hi, I'm Mira. Have you been trying to conceive for a while, do you want to know your ovarian reserve, or is your cycle irregular? Tell me briefly and I'll say which hormones are looked at.",
        chips: ["Trying for over a year", "Know my ovarian reserve (AMH)", "Irregular cycle", "Trying to conceive over 35"],
        placeholder: "Tell me briefly about yourself …",
        topic:
          "Category fertility. Ovarian reserve → anti-Müllerian hormone test; comprehensive → women's fertility check (FSH, LH, oestradiol, AMH, prolactin, TSH etc.); basic → women's hormone check. Notes: cycle hormones depend on cycle day (FSH/LH/oestradiol day 2 to 5), AMH any time. After 12 months without success (6 months over 35) recommend gynaecological or fertility clinic assessment, including the partner (semen analysis). Empathetic, no pressure. " +
          GUARD.en,
      },
    },
  },

  dna: {
    de: {
      kicker: "DNA Testkits",
      headline: "Was in deinen Genen steht, [[verständlich erklärt]]",
      lead: "Genetische Risikotests für Brust-, Prostata-, Darm- und Hautkrebs, dazu Koffeintyp und biologisches Alter. Wangenabstrich zu Hause, Auswertung im Labor.",
      facts: ["Wangenabstrich oder Speichel", FACTS.de.lab, "Ergebnis mit Erklärung in der App", FACTS.de.discreet],
      chat: {
        title: "Mira, deine Gentest-Beratung",
        greeting:
          "Hi, ich bin Mira. Möchtest du ein familiäres Krebsrisiko besser einschätzen, dein biologisches Alter kennen oder wissen, wie dein Körper Koffein verarbeitet? Ich erkläre dir, was ein Gentest kann und was nicht.",
        chips: ["Krebs in der Familie, was kann ich testen?", "Was sagt ein Gentest aus und was nicht?", "Koffeintyp bestimmen", "Biologisches Alter"],
        placeholder: "Was möchtest du wissen?",
        topic:
          "Kategorie DNA-Tests. Erkläre klar: Genetische Risikotests schätzen ein Risiko (Veranlagung), sie stellen keine Diagnose und ein unauffälliges Ergebnis schließt Krebs nicht aus. Familiäres Risiko → Brustkrebs, Prostatakrebs, Darmkrebs, Hautkrebs Risiko Test oder Krebs Risiko Test für Frauen/Männer; Darmvorsorge → ColoAlert (DNA-Stuhltest); Koffein → COFFEEGEN; biologisches Alter → bioAge. Empfiehl bei auffälligem Ergebnis humangenetische Beratung. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "DNA test kits",
      headline: "What your genes say, [[explained clearly]]",
      lead: "Genetic risk tests for breast, prostate, bowel and skin cancer, plus caffeine type and biological age. Cheek swab at home, analysis in the lab.",
      facts: ["Cheek swab or saliva", FACTS.en.lab, "Result with explanation in the app", FACTS.en.discreet],
      chat: {
        title: "Mira, your genetic test advisor",
        greeting:
          "Hi, I'm Mira. Do you want to better assess a family cancer risk, know your biological age, or how your body processes caffeine? I'll explain what a genetic test can and cannot do.",
        chips: ["Cancer in the family, what can I test?", "What does a genetic test tell me?", "Determine caffeine type", "Biological age"],
        placeholder: "What would you like to know?",
        topic:
          "Category DNA tests. Make clear: genetic risk tests estimate a risk (predisposition), they do not diagnose, and a normal result does not rule out cancer. Family risk → breast, prostate, bowel, skin cancer risk test or cancer risk test for women/men; bowel screening → ColoAlert (DNA stool test); caffeine → COFFEEGEN; biological age → bioAge. Recommend genetic counselling for an abnormal result. " +
          GUARD.en,
      },
    },
  },

  "allergie-unvertraglichkeiten": {
    de: {
      kicker: "Allergie & Unverträglichkeiten",
      headline: "Herausfinden, [[worauf du reagierst]]",
      lead: "295 Allergene aus einer Blutprobe: Pollen, Tierhaare, Milben, Nahrungsmittel. Statt monatelang zu rätseln, bekommst du ein klares Profil.",
      facts: [FACTS.de.blood, "295 Allergene in einem Test", FACTS.de.lab, FACTS.de.app],
      chat: {
        title: "Mira, deine Allergie-Beratung",
        greeting:
          "Hi, ich bin Mira. Niesen im Frühling, juckende Augen bei der Katze, Bauchweh nach dem Essen? Erzähl mir, wann und wo du reagierst, dann sage ich dir, ob der Allergietest dafür geeignet ist.",
        chips: ["Niesen und juckende Augen im Frühling", "Reagiere auf Katze oder Hund", "Bauchprobleme nach dem Essen", "Was misst der Test genau?"],
        placeholder: "Wann reagierst du?",
        topic:
          "Kategorie Allergie & Unverträglichkeiten. Einziger Test: Allergietest mit 295 Allergenen (spezifisches IgE). Erkläre den Unterschied: IgE-Allergie (Pollen, Milben, Tierhaare, Nahrungsmittelallergie) wird gemessen; Laktose- oder Fruktoseintoleranz und Zöliakie sind keine IgE-Allergien und werden damit nicht erfasst, dafür ärztliche Abklärung. Bei Schwellungen im Gesicht oder Atemnot nach Kontakt: Notruf 112. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Allergy & intolerances",
      headline: "Find out [[what you react to]]",
      lead: "295 allergens from one blood sample: pollen, animal hair, mites, foods. Instead of guessing for months, you get a clear profile.",
      facts: [FACTS.en.blood, "295 allergens in one test", FACTS.en.lab, FACTS.en.app],
      chat: {
        title: "Mira, your allergy advisor",
        greeting:
          "Hi, I'm Mira. Sneezing in spring, itchy eyes around the cat, stomach ache after eating? Tell me when and where you react and I'll say whether the allergy test is suitable.",
        chips: ["Sneezing and itchy eyes in spring", "React to cat or dog", "Stomach trouble after eating", "What exactly does the test measure?"],
        placeholder: "When do you react?",
        topic:
          "Category allergy & intolerances. Only test: allergy test with 295 allergens (specific IgE). Explain the difference: IgE allergy (pollen, mites, animal hair, food allergy) is measured; lactose or fructose intolerance and coeliac disease are not IgE allergies and are not covered, those need medical assessment. With facial swelling or shortness of breath after contact: call 112. " +
          GUARD.en,
      },
    },
  },

  "energie-vitalitat": {
    de: {
      kicker: "Energie & Vitalität",
      headline: "Müde ist [[keine Diagnose]]",
      lead: "Eisen, Vitamin D, B12, Schilddrüse, Cortisol: Hinter Erschöpfung stecken oft messbare Ursachen. Finde heraus, welche bei dir infrage kommen.",
      facts: [FACTS.de.blood, FACTS.de.lab, FACTS.de.app, FACTS.de.sub],
      chat: {
        title: "Mira, deine Energie-Beratung",
        greeting:
          "Hi, ich bin Mira. Seit wann bist du erschöpft, und kommt etwas dazu: schlechter Schlaf, Stress, Haarausfall, Konzentrationsprobleme? Erzähl mir kurz, dann zeige ich dir, welche Werte man zuerst prüft.",
        chips: ["Ständig müde, auch nach Schlaf", "Konzentration lässt nach", "Viel Stress, schlechter Schlaf", "Vegan oder vegetarisch und erschöpft"],
        placeholder: "Wie fühlst du dich?",
        topic:
          "Kategorie Energie & Vitalität. Müdigkeit → Müdigkeits Check (Vitamin D, B12, Folsäure, Cortisol u. a.) oder Nährstoff Check Premium (mit Ferritin); Konzentration → Neuro Vital Check; vegan → B12 Holo-TC; Stress → Cortisol; Gewicht → Abnehmen Set. Nenne Schilddrüse und Eisen als häufige Ursachen. Anhaltende Erschöpfung über Wochen ärztlich abklären. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Energy & vitality",
      headline: "Tired is [[not a diagnosis]]",
      lead: "Iron, vitamin D, B12, thyroid, cortisol: exhaustion often has measurable causes. Find out which ones apply to you.",
      facts: [FACTS.en.blood, FACTS.en.lab, FACTS.en.app, FACTS.en.sub],
      chat: {
        title: "Mira, your energy advisor",
        greeting:
          "Hi, I'm Mira. Since when have you been exhausted, and is there anything else: poor sleep, stress, hair loss, trouble concentrating? Tell me briefly and I'll show you which values to check first.",
        chips: ["Always tired, even after sleep", "Concentration is slipping", "Lots of stress, poor sleep", "Vegan or vegetarian and exhausted"],
        placeholder: "How do you feel?",
        topic:
          "Category energy & vitality. Tiredness → fatigue check (vitamin D, B12, folate, cortisol etc.) or nutrient check premium (with ferritin); concentration → Neuro Vital check; vegan → B12 holo-TC; stress → cortisol; weight → weight-loss set. Name thyroid and iron as common causes. Persistent exhaustion over weeks should be assessed by a doctor. " +
          GUARD.en,
      },
    },
  },

  nahrungserganzungsmittel: {
    de: {
      kicker: "Nahrungsergänzungsmittel",
      headline: "Ergänzen, [[was wirklich fehlt]]",
      lead: "Vitamin D3 von biomo in Apothekenqualität und die Longevity-Formeln von Youngle: Omega-3, Kreatin, Spermidin, Q10 und mehr. Am sinnvollsten nach einem Test, damit du gezielt ergänzt statt auf Verdacht.",
      facts: ["Entwickelt von Ärzten, laborgeprüft in Deutschland", "Vegan, ohne unnötige Zusätze", "Passend zu deinen Blutwerten", "Versand in neutraler Verpackung"],
      chat: {
        title: "Mira, deine Nährstoff-Beratung",
        greeting:
          "Hi, ich bin Mira. Kennst du deine Werte schon? Dann helfe ich dir, das passende Präparat zu finden. Falls nicht, zeige ich dir zuerst den Test, der dir sagt, was dir wirklich fehlt.",
        chips: ["Was bringt Omega-3?", "Ich kenne meine Werte noch nicht", "Welches Präparat für besseren Schlaf?", "Kreatin auch ohne Sport?"],
        placeholder: "Was möchtest du wissen?",
        topic:
          "Kategorie Nahrungsergänzungsmittel: Vitamin D3 von biomo (Kapseln vegan, Tabletten 60/120, Tropfen) und das Youngle-Sortiment (Omega-3, Glycin & NAC, Essentials+, Sleep+, Focus+, Recovery+, Mobility+, Metabolism+, Immunity+, Men+, Fem+, Trimethylglycin, Taurin, Apigenin, Hyaluron, Sulforaphan, Kreatin, Ubiquinol Q10, Berberin, Spermidin, AKG). Erkläre, wofür ein Präparat gedacht ist, und empfiehl vor der Einnahme die Messung der passenden Werte (z. B. Omega-3-Index, Vitamin D, Ferritin). Gib keine konkreten Dosierungsempfehlungen und keine Diagnosen; bei Medikamenten, Schwangerschaft oder Vorerkrankungen ärztlich abstimmen. " +
          GUARD.de,
      },
    },
    en: {
      kicker: "Supplements",
      headline: "Supplement [[what is really missing]]",
      lead: "Vitamin D3 by biomo in pharmacy quality and the longevity formulas by Youngle: omega-3, creatine, spermidine, Q10 and more. Best after a test, so you supplement on purpose instead of on suspicion.",
      facts: ["Developed by physicians, lab-tested in Germany", "Vegan, no unnecessary additives", "Matched to your blood values", "Shipped in neutral packaging"],
      chat: {
        title: "Mira, your nutrient advisor",
        greeting:
          "Hi, I'm Mira. Do you already know your values? Then I'll help you find the right supplement. If not, I'll first show you the test that tells you what you are really missing.",
        chips: ["What does omega-3 do?", "I don't know my values yet", "Which supplement for better sleep?", "Creatine without sport?"],
        placeholder: "What would you like to know?",
        topic:
          "Category supplements: vitamin D3 by biomo (vegan capsules, tablets 60/120, drops) and the Youngle range (omega-3, glycine & NAC, Essentials+, Sleep+, Focus+, Recovery+, Mobility+, Metabolism+, Immunity+, Men+, Fem+, trimethylglycine, taurine, apigenin, hyaluron, sulforaphane, creatine, ubiquinol Q10, berberine, spermidine, AKG). Explain what a supplement is meant for and recommend measuring the matching values before taking it (e.g. omega-3 index, vitamin D, ferritin). Give no specific dosage recommendations and no diagnoses; with medication, pregnancy or conditions consult a doctor. " +
          GUARD.en,
      },
    },
  },
};

export const collectionHero = (handle: string | null, locale: Locale): CollectionHero | null =>
  handle ? (COLLECTION_HEROES[handle]?.[locale] ?? null) : null;
