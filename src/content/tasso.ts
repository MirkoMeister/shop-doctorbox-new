import type { Locale } from "@/lib/i18n/config";

/**
 * Copy for the Tasso+ page (/pages/tasso) and the Tasso touchpoints across the shop.
 * Wording follows the CEO brief: "komplett schmerzfreie Entnahme".
 */
export type TassoCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  facts: string[];
  whyTitle: string;
  why: { title: string; text: string }[];
  stepsTitle: string;
  stepsText: string;
  steps: { title: string; text: string }[];
  compareTitle: string;
  compareText: string;
  compareHead: [string, string, string];
  compare: [string, string, string][];
  productsTitle: string;
  productsText: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  videoLabel: string;
};

const de: TassoCopy = {
  metaTitle: "Tasso+: Blutabnahme am Oberarm, komplett schmerzfrei",
  metaDescription: "Mit dem Tasso+ Gerät nimmst du deine Blutprobe zu Hause am Oberarm: ein Knopfdruck, keine Nadel, kein Fingerpiks. Bei vielen DoctorBox Heimtests als Variante wählbar.",
  kicker: "Blutabnahme mit Tasso+",
  title: "Blut abnehmen, [[komplett schmerzfrei]]",
  lead: "Das Tasso+ Gerät klebt am Oberarm. Ein Knopfdruck, ein leichtes Ziehen, und nach wenigen Minuten ist die Probe im Röhrchen. Kein Fingerpiks, keine sichtbare Nadel, kein Praxistermin.",
  facts: ["Keine Nadel zu sehen", "Etwa 5 Minuten", "Weniger Fehlproben als beim Fingerpiks", "Vorausgewählt, wo verfügbar"],
  whyTitle: "Warum wir Tasso+ [[empfehlen]]",
  why: [
    { title: "Komplett schmerzfrei", text: "Winzige Mikronadeln arbeiten unter der Haut, ein Vakuum zieht das Kapillarblut sanft heraus. Die meisten spüren nur ein leichtes Ziehen." },
    { title: "Für Menschen mit Nadelangst", text: "Du siehst keine Nadel und drückst selbst den Knopf. Das Gerät macht den Rest, ohne dass du hinschauen musst." },
    { title: "Zuverlässige Probenmenge", text: "Beim Fingerpiks reicht die Blutmenge oft nicht aus. Tasso+ liefert die nötige Menge für das Labor, das heißt deutlich weniger Wiederholungen." },
    { title: "Gleiche Laborqualität", text: "Die Probe wird im akkreditierten Labor wie jede Kapillarblutprobe analysiert. Dein Befund kommt wie gewohnt in die DoctorBox App." },
  ],
  stepsTitle: "So läuft die [[Entnahme]] ab",
  stepsText: "Drei Schritte, keine Vorkenntnisse. Die bebilderte Anleitung liegt im Set und ist in der App hinterlegt.",
  steps: [
    { title: "Oberarm vorbereiten", text: "Warm reiben oder kurz duschen, damit das Blut gut fließt. Gerät auf die Rückseite des Oberarms kleben." },
    { title: "Knopf drücken", text: "Der rote Knopf startet die Entnahme. Du spürst höchstens ein leichtes Ziehen, keine Nadel." },
    { title: "Röhrchen verschließen", text: "Nach etwa 5 Minuten ist das Röhrchen gefüllt. Abnehmen, verschließen, mit dem Set zurück ans Labor." },
  ],
  compareTitle: "Fingerpiks oder [[Tasso+]]?",
  compareText: "Beides sind Kapillarblutproben, die im selben Labor landen. Der Unterschied liegt in der Entnahme.",
  compareHead: ["", "Fingerpiks (Lanzette)", "Tasso+ (Oberarm)"],
  compare: [
    ["Schmerz", "Kurzer Stich in die Fingerkuppe", "Komplett schmerzfrei, leichtes Ziehen"],
    ["Nadel", "Sichtbare Lanzette", "Keine sichtbare Nadel"],
    ["Dauer", "5 bis 10 Minuten, mehrere Tropfen", "Etwa 5 Minuten, ein Knopfdruck"],
    ["Probenmenge", "Reicht manchmal nicht aus", "Zuverlässig ausreichend"],
    ["Handhabung", "Finger massieren, Tropfen auffangen", "Kleben, drücken, warten"],
  ],
  productsTitle: "Tests mit [[Tasso+]] Entnahme",
  productsText: "Bei diesen Heimtests wählst du Tasso+ als Blutabnahme. Die Variante ist vorausgewählt, der Fingerpiks bleibt als Alternative.",
  faqTitle: "Häufige Fragen zu [[Tasso+]]",
  faq: [
    { q: "Tut die Entnahme wirklich nicht weh?", a: "Die Mikronadeln sind so fein, dass die Schmerzrezeptoren der Haut kaum erreicht werden. Die allermeisten spüren nur ein leichtes Ziehen durch das Vakuum. Eine Nadel ist zu keinem Zeitpunkt sichtbar." },
    { q: "Wie lange dauert es?", a: "Vorbereiten, aufkleben, Knopf drücken: Das Röhrchen füllt sich in etwa 5 Minuten. Mit Anleitung bist du in rund 10 Minuten fertig." },
    { q: "Kann ich etwas falsch machen?", a: "Wichtig ist nur, dass der Arm warm ist und das Gerät flach aufliegt. Fließt zu wenig Blut, hilft Bewegung oder Wärme. Fehlproben kommen deutlich seltener vor als beim Fingerpiks." },
    { q: "Ist das Ergebnis genauso gut wie beim Fingerpiks?", a: "Ja. Es ist dieselbe Kapillarblutprobe und dieselbe Laboranalyse. Das Labor erhält mit Tasso+ häufiger die nötige Blutmenge, was die Auswertung sicherer macht." },
    { q: "Kostet Tasso+ extra?", a: "Den Preis siehst du direkt bei der Variante auf der Produktseite. Bei vielen Tests ist Tasso+ ohne Aufpreis enthalten." },
    { q: "Bei welchen Tests gibt es Tasso+?", a: "Bei allen Tests, die unten auf dieser Seite gelistet sind. Auf der Produktseite ist die Tasso+ Variante vorausgewählt und mit „Empfohlen“ markiert." },
  ],
  ctaTitle: "Nicht sicher, welcher Test passt?",
  ctaText: "Mira kennt alle Tests mit Tasso+ Entnahme und hilft dir bei der Auswahl.",
  videoLabel: "Video: Blutabnahme mit dem Tasso+ Gerät am Oberarm",
};

const en: TassoCopy = {
  metaTitle: "Tasso+: upper-arm blood collection, completely painless",
  metaDescription: "With the Tasso+ device you take your blood sample at home on the upper arm: one button press, no needle, no finger prick. Available as an option on many DoctorBox home tests.",
  kicker: "Blood collection with Tasso+",
  title: "Draw blood, [[completely painless]]",
  lead: "The Tasso+ device sticks to your upper arm. One button press, a slight pull, and after a few minutes the sample is in the tube. No finger prick, no visible needle, no clinic appointment.",
  facts: ["No needle in sight", "About 5 minutes", "Fewer failed samples than a finger prick", "Preselected where available"],
  whyTitle: "Why we [[recommend]] Tasso+",
  why: [
    { title: "Completely painless", text: "Tiny microneedles work beneath the skin and a vacuum gently draws out the capillary blood. Most people feel only a slight pull." },
    { title: "For people afraid of needles", text: "You never see a needle and press the button yourself. The device does the rest, no need to look." },
    { title: "Reliable sample volume", text: "With a finger prick the blood volume is often insufficient. Tasso+ delivers what the lab needs, so repeats are far rarer." },
    { title: "Same lab quality", text: "The sample is analysed in the accredited laboratory like any capillary sample. Your result arrives in the DoctorBox app as usual." },
  ],
  stepsTitle: "How the [[collection]] works",
  stepsText: "Three steps, no prior knowledge. The illustrated instructions are in the kit and in the app.",
  steps: [
    { title: "Prepare the upper arm", text: "Rub it warm or take a quick shower so the blood flows well. Stick the device on the back of the upper arm." },
    { title: "Press the button", text: "The red button starts the collection. You feel at most a slight pull, no needle." },
    { title: "Close the tube", text: "After about 5 minutes the tube is full. Remove, close, and send it back to the lab with the kit." },
  ],
  compareTitle: "Finger prick or [[Tasso+]]?",
  compareText: "Both are capillary samples analysed in the same lab. The difference is the collection.",
  compareHead: ["", "Finger prick (lancet)", "Tasso+ (upper arm)"],
  compare: [
    ["Pain", "Short sting in the fingertip", "Completely painless, slight pull"],
    ["Needle", "Visible lancet", "No visible needle"],
    ["Duration", "5 to 10 minutes, several drops", "About 5 minutes, one button press"],
    ["Sample volume", "Sometimes insufficient", "Reliably sufficient"],
    ["Handling", "Massage finger, catch drops", "Stick, press, wait"],
  ],
  productsTitle: "Tests with [[Tasso+]] collection",
  productsText: "On these home tests you choose Tasso+ as the blood collection. The option is preselected, the finger prick remains as an alternative.",
  faqTitle: "Common questions about [[Tasso+]]",
  faq: [
    { q: "Does it really not hurt?", a: "The microneedles are so fine that the skin's pain receptors are barely reached. The vast majority feel only a slight pull from the vacuum. A needle is never visible." },
    { q: "How long does it take?", a: "Prepare, stick on, press the button: the tube fills in about 5 minutes. With the instructions you are done in around 10 minutes." },
    { q: "Can I do something wrong?", a: "All that matters is a warm arm and a device lying flat. If too little blood flows, movement or warmth helps. Failed samples are far rarer than with a finger prick." },
    { q: "Is the result as good as with a finger prick?", a: "Yes. It is the same capillary blood sample and the same laboratory analysis. With Tasso+ the lab more often receives the required volume, which makes the analysis more reliable." },
    { q: "Does Tasso+ cost extra?", a: "You see the price directly on the variant on the product page. On many tests Tasso+ is included at no extra charge." },
    { q: "Which tests offer Tasso+?", a: "All tests listed at the bottom of this page. On the product page the Tasso+ option is preselected and marked as recommended." },
  ],
  ctaTitle: "Not sure which test fits?",
  ctaText: "Mira knows every test with Tasso+ collection and helps you choose.",
  videoLabel: "Video: blood collection with the Tasso+ device on the upper arm",
};

export const TASSO_PAGE = "/pages/tasso";
export const TASSO_VIDEO = "/videos/banner-tasso-web.mp4";
export const TASSO_POSTER = "/videos/banner-tasso-poster.jpg";
export const tassoCopy = (locale: Locale): TassoCopy => (locale === "en" ? en : de);
