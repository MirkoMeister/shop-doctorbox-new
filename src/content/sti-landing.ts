import type { Locale } from "@/lib/i18n/config";

/**
 * Copy for the sexual-health landing (collection "sexuelle-gesundheit") and the
 * STI spotlight on the home page. Product handles reference the Shopify catalogue;
 * a missing product simply drops out of the layout.
 *
 * Medical orientation values (diagnostic windows) follow the RKI/DSTIG guidance
 * used in Mira's topic brief; they are orientation, not a diagnosis.
 */
export type StiSituation = {
  key: string;
  title: string;
  text: string;
  /** primary recommendation first, then an alternative */
  products: string[];
  note?: string;
  question: string;
};

export type StiCopy = {
  pickerKicker: string;
  pickerTitle: string;
  pickerText: string;
  situations: StiSituation[];
  recommended: string;
  alternative: string;
  pathogens: string;
  askMira: string;
  compareTitle: string;
  compareText: string;
  windowTitle: string;
  windowText: string;
  windows: { what: string; when: string }[];
  windowNote: string;
  discreetTitle: string;
  discreet: { title: string; text: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  spotlight: {
    kicker: string;
    title: string;
    text: string;
    ladder: string[]; // product handles, few → many pathogens
    cta: string;
    compare: string;
    usps: string[];
  };
};

export const STI_LADDER = ["sti-test-1", "sti-standard-5", "sti-pro-10"];

const de: StiCopy = {
  pickerKicker: "Welcher STI-Test passt?",
  pickerTitle: "Sag uns kurz, [[was dich beschäftigt]]",
  pickerText: "Vier typische Situationen, vier klare Empfehlungen. Wenn deine Lage anders ist, fragst du Mira, anonym und ohne Wertung.",
  situations: [
    {
      key: "routine",
      title: "Routine-Check ohne Symptome",
      text: "Neue Beziehung, neuer Lebensabschnitt oder einfach Gewissheit: Der Standard-Test deckt die fünf wichtigsten Infektionen ab, inklusive HIV und Syphilis.",
      products: ["sti-standard-5", "sti-pro-10"],
      question: "Ich habe keine Symptome, will aber sicher sein. Welcher STI-Test passt?",
    },
    {
      key: "contact",
      title: "Nach ungeschütztem Kontakt",
      text: "Ein Risiko-Kontakt liegt hinter dir. Der Pro-Test prüft zehn Erreger auf einmal. Wichtig ist der richtige Zeitpunkt, siehe unten.",
      products: ["sti-pro-10", "sti-standard-5"],
      note: "Liegt der Kontakt weniger als 48 Stunden zurück und bestand ein HIV-Risiko, geh sofort in eine Notaufnahme oder HIV-Schwerpunktpraxis (PEP).",
      question: "Ich hatte vor kurzem ungeschützten Sex. Welcher Test und ab wann?",
    },
    {
      key: "symptoms",
      title: "Ich habe Beschwerden",
      text: "Ausfluss, Brennen oder Jucken: Chlamydien, Gonorrhö, Trichomonaden und Mykoplasmen sind die häufigsten Ursachen. Lass dich bei Beschwerden parallel ärztlich untersuchen.",
      products: ["sti-test-1", "sti-test"],
      question: "Ich habe Symptome im Intimbereich. Welcher Test ist sinnvoll?",
    },
    {
      key: "women",
      title: "Für Frauen: HPV & Vaginalpilz",
      text: "HPV-Hochrisikotypen sind die Ursache fast aller Gebärmutterhalskrebs-Fälle, wiederkehrender Pilz hat oft einen konkreten Erreger. Beides lässt sich per Abstrich zu Hause testen.",
      products: ["hpv-high-risk-typen", "vaginalpilz"],
      question: "Ich möchte mich auf HPV testen. Was muss ich wissen?",
    },
  ],
  recommended: "Unsere Empfehlung",
  alternative: "Alternative",
  pathogens: "{n} Erreger",
  askMira: "Meine Situation ist anders, Mira fragen",
  compareTitle: "Welcher Test prüft [[welche Erreger]]?",
  compareText: "Alle STI-Tests nebeneinander: vom Basis-Test bis zum Complete Trio mit zehn Erregern.",
  windowTitle: "Ab wann ist ein Test [[aussagekräftig]]?",
  windowText: "Erreger brauchen Zeit, bis sie nachweisbar sind. Testest du zu früh, kann ein negatives Ergebnis trügen.",
  windows: [
    { what: "Chlamydien, Gonorrhö, Trichomonaden, Mykoplasmen (PCR)", when: "ab etwa 2 Wochen nach dem Kontakt" },
    { what: "HIV (Labortest der 4. Generation)", when: "ab 6 Wochen" },
    { what: "Syphilis", when: "ab 6 Wochen, sicher nach 12 Wochen" },
    { what: "Hepatitis C", when: "6 bis 12 Wochen" },
  ],
  windowNote: "Orientierungswerte nach RKI und DSTIG. Bei Symptomen oder Unsicherheit sprich zusätzlich mit einer Ärztin oder einem Arzt.",
  discreetTitle: "Diskret, [[von Anfang bis Ende]]",
  discreet: [
    { title: "Neutrale Verpackung", text: "Außen steht nur der Absender, kein Produktname. Auf Wunsch holst du das Set in Berlin ab." },
    { title: "Anonyme Auswertung", text: "Das Labor kennt nur deine Test-ID. Dein Name taucht auf keiner Probe auf." },
    { title: "Befund nur in der App", text: "Kein Brief, keine E-Mail mit Diagnose. Du liest den Befund mit Einordnung in der DoctorBox App." },
    { title: "Akkreditiertes Labor", text: "PCR-Verfahren wie in der Praxis, ausgewertet in Deutschland. Meist innerhalb von 72 Stunden nach Laboreingang." },
  ],
  faqTitle: "Häufige Fragen zu [[STI-Tests]]",
  faq: [
    {
      q: "Wie diskret läuft die Bestellung?",
      a: "Das Set kommt in neutraler Verpackung ohne Produktnamen. Das Labor arbeitet nur mit deiner Test-ID, und den Befund siehst du ausschließlich in der DoctorBox App. In Berlin kannst du das Set auch abholen.",
    },
    {
      q: "Welcher STI-Test ist der richtige für mich?",
      a: "Ohne Symptome reicht meist der STI Standard mit fünf Erregern inklusive HIV, Syphilis und Hepatitis C. Nach einem Risikokontakt empfehlen wir den STI Pro mit zehn Erregern. Bei Beschwerden prüft der STI Basic die häufigsten Ursachen, zusätzlich solltest du ärztlich abklären lassen. Mira hilft dir bei der Auswahl.",
    },
    {
      q: "Wie nehme ich die Probe?",
      a: "Je nach Test per Erststrahl-Urin, Vaginal- oder Rektalabstrich und wenigen Tropfen Blut aus der Fingerkuppe (Trockenblut). Die bebilderte Anleitung liegt im Set und ist in der App hinterlegt.",
    },
    {
      q: "Wie lange dauert das Ergebnis?",
      a: "PCR-basierte STI-Tests sind meist innerhalb von 72 Stunden nach Laboreingang ausgewertet. Du bekommst eine Benachrichtigung in der App.",
    },
    {
      q: "Was passiert bei einem positiven Befund?",
      a: "Der Befund enthält eine Einordnung und die nächsten Schritte. Fast alle sexuell übertragbaren Infektionen sind gut behandelbar, dafür brauchst du ein ärztliches Rezept. Informiere deine Partnerinnen oder Partner, damit sie sich ebenfalls testen lassen.",
    },
    {
      q: "Ist der Heimtest so zuverlässig wie in der Praxis?",
      a: "Die Analyse läuft im akkreditierten Labor mit denselben PCR- und Suchtest-Verfahren wie bei einer Ärztin oder einem Arzt. Entscheidend ist der Zeitpunkt: Innerhalb des diagnostischen Fensters kann ein Test noch negativ sein.",
    },
  ],
  spotlight: {
    kicker: "Sexuelle Gesundheit",
    title: "Diskret auf STIs testen, [[ohne Praxisbesuch]]",
    text: "Probe zu Hause nehmen, PCR-Analyse im akkreditierten Labor, Befund in der App. Drei Tests, drei Abdeckungen: Du entscheidest, wie umfassend.",
    ladder: STI_LADDER,
    cta: "Alle STI-Tests ansehen",
    compare: "Tests vergleichen",
    usps: ["Neutrale Verpackung", "Anonyme Test-ID", "Ergebnis meist in 72 Stunden"],
  },
};

const en: StiCopy = {
  pickerKicker: "Which STI test fits?",
  pickerTitle: "Tell us briefly [[what's on your mind]]",
  pickerText: "Four typical situations, four clear recommendations. If yours is different, ask Mira, anonymously and without judgement.",
  situations: [
    {
      key: "routine",
      title: "Routine check without symptoms",
      text: "New relationship, new chapter or simply peace of mind: the Standard test covers the five most important infections, including HIV and syphilis.",
      products: ["sti-standard-5", "sti-pro-10"],
      question: "I have no symptoms but want to be sure. Which STI test fits?",
    },
    {
      key: "contact",
      title: "After unprotected contact",
      text: "A risk contact is behind you. The Pro test checks ten pathogens at once. Timing matters, see below.",
      products: ["sti-pro-10", "sti-standard-5"],
      note: "If the contact was less than 48 hours ago and there was an HIV risk, go to an emergency department or HIV clinic right away (PEP).",
      question: "I recently had unprotected sex. Which test and from when?",
    },
    {
      key: "symptoms",
      title: "I have symptoms",
      text: "Discharge, burning or itching: chlamydia, gonorrhoea, trichomonas and mycoplasma are the most common causes. With symptoms, also see a doctor.",
      products: ["sti-test-1", "sti-test"],
      question: "I have symptoms in the genital area. Which test makes sense?",
    },
    {
      key: "women",
      title: "For women: HPV & vaginal yeast",
      text: "High-risk HPV types cause almost all cervical cancers, recurring yeast often has one specific pathogen. Both can be tested at home with a swab.",
      products: ["hpv-high-risk-typen", "vaginalpilz"],
      question: "I want to test for HPV. What do I need to know?",
    },
  ],
  recommended: "Our recommendation",
  alternative: "Alternative",
  pathogens: "{n} pathogens",
  askMira: "My situation is different, ask Mira",
  compareTitle: "Which test checks [[which pathogens]]?",
  compareText: "All STI tests side by side: from the basic test to the Complete Trio with ten pathogens.",
  windowTitle: "From when is a test [[reliable]]?",
  windowText: "Pathogens need time to become detectable. Test too early and a negative result can be misleading.",
  windows: [
    { what: "Chlamydia, gonorrhoea, trichomonas, mycoplasma (PCR)", when: "from about 2 weeks after contact" },
    { what: "HIV (4th generation lab test)", when: "from 6 weeks" },
    { what: "Syphilis", when: "from 6 weeks, conclusive after 12 weeks" },
    { what: "Hepatitis C", when: "6 to 12 weeks" },
  ],
  windowNote: "Orientation values after RKI and DSTIG guidance. With symptoms or doubts, also talk to a doctor.",
  discreetTitle: "Discreet, [[from start to finish]]",
  discreet: [
    { title: "Neutral packaging", text: "Only the sender is on the outside, no product name. In Berlin you can pick the kit up." },
    { title: "Anonymous analysis", text: "The lab only knows your test ID. Your name is on no sample." },
    { title: "Result only in the app", text: "No letter, no e-mail with a diagnosis. You read the result with context in the DoctorBox app." },
    { title: "Accredited laboratory", text: "PCR methods as in a clinic, analysed in Germany. Usually within 72 hours of arrival at the lab." },
  ],
  faqTitle: "Common questions about [[STI tests]]",
  faq: [
    {
      q: "How discreet is the order?",
      a: "The kit arrives in neutral packaging without a product name. The lab works only with your test ID, and you see the result exclusively in the DoctorBox app. In Berlin you can also pick the kit up.",
    },
    {
      q: "Which STI test is right for me?",
      a: "Without symptoms the STI Standard with five pathogens including HIV, syphilis and hepatitis C is usually enough. After a risk contact we recommend the STI Pro with ten pathogens. With symptoms the STI Basic checks the most common causes, and you should also see a doctor. Mira helps you choose.",
    },
    {
      q: "How do I take the sample?",
      a: "Depending on the test: first-stream urine, a vaginal or rectal swab and a few drops of blood from the fingertip (dried blood). The illustrated instructions are in the kit and in the app.",
    },
    {
      q: "How long does the result take?",
      a: "PCR-based STI tests are usually analysed within 72 hours of arrival at the lab. You get a notification in the app.",
    },
    {
      q: "What happens if the result is positive?",
      a: "The result includes context and the next steps. Almost all sexually transmitted infections are easily treatable, for which you need a prescription. Inform your partners so they can get tested too.",
    },
    {
      q: "Is the home test as reliable as at the clinic?",
      a: "The analysis runs in an accredited laboratory with the same PCR and screening methods a doctor uses. Timing is decisive: within the diagnostic window a test can still be negative.",
    },
  ],
  spotlight: {
    kicker: "Sexual health",
    title: "Test for STIs discreetly, [[no clinic visit]]",
    text: "Take the sample at home, PCR analysis in an accredited lab, result in the app. Three tests, three coverages: you decide how comprehensive.",
    ladder: STI_LADDER,
    cta: "See all STI tests",
    compare: "Compare tests",
    usps: ["Neutral packaging", "Anonymous test ID", "Result usually within 72 hours"],
  },
};

export const STI_COLLECTION = "sexuelle-gesundheit";
export const stiCopy = (locale: Locale): StiCopy => (locale === "en" ? en : de);
