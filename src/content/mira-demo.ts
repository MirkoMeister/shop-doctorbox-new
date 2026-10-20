import type { Locale } from "@/lib/i18n/config";

/** Scripted mini conversations played in the Mira tile on collection pages. */
export type DemoExchange = { q: string; a: string; product?: string };

const GENERIC: Record<Locale, DemoExchange[]> = {
  de: [
    { q: "Ich bin ständig müde.", a: "Das kann an Eisen, Vitamin D oder der Schilddrüse liegen. Der Müdigkeits Check misst die wichtigsten Werte.", product: "Müdigkeits Check" },
    { q: "Welcher Test ohne Blutabnahme?", a: "Mehrere: STI Basic mit Urin, HPV per Abstrich oder die Darmkrebsvorsorge per Stuhlprobe.", product: "STI Basic Heimtest" },
    { q: "Ich möchte meine Hormone checken.", a: "Geht es um Zyklus, Schilddrüse oder Testosteron? Für Frauen passt der Hormon Check, für Männer der Testosteron Check.", product: "Hormon Check für Frauen" },
  ],
  en: [
    { q: "I'm tired all the time.", a: "Iron, vitamin D or the thyroid are common causes. The fatigue check measures the key values.", product: "Müdigkeits Check" },
    { q: "Which test without drawing blood?", a: "Several: STI Basic with urine, HPV by swab or bowel screening by stool sample.", product: "STI Basic Heimtest" },
    { q: "I'd like to check my hormones.", a: "Is it about cycle, thyroid or testosterone? Women's hormone check for women, testosterone check for men.", product: "Hormon Check für Frauen" },
  ],
};

const BY_COLLECTION: Record<string, Record<Locale, DemoExchange[]>> = {
  "sexuelle-gesundheit": {
    de: [
      { q: "Ungeschützter Sex vor 2 Wochen.", a: "Chlamydien und Gonorrhö sind jetzt nachweisbar, HIV und Syphilis erst ab Woche 6. Starte mit dem STI Basic.", product: "STI Basic Heimtest" },
      { q: "Ich will einfach alles checken.", a: "Dann der STI Pro: zehn Erreger aus Urin und Trockenblut, diskret verpackt.", product: "STI Pro Heimtest" },
      { q: "Ich habe keine Symptome.", a: "Viele Infektionen bleiben still. Für die Routinekontrolle reicht der STI Standard mit fünf Werten.", product: "STI Standard Heimtest" },
    ],
    en: [
      { q: "Unprotected sex two weeks ago.", a: "Chlamydia and gonorrhoea can be detected now, HIV and syphilis from week 6. Start with STI Basic.", product: "STI Basic Heimtest" },
      { q: "I just want to check everything.", a: "Then STI Pro: ten pathogens from urine and dried blood, discreetly packaged.", product: "STI Pro Heimtest" },
      { q: "I have no symptoms.", a: "Many infections stay silent. For a routine check, STI Standard with five values is enough.", product: "STI Standard Heimtest" },
    ],
  },
  "nahrstoffe-vitamine": {
    de: [
      { q: "Ich ernähre mich vegan.", a: "Dann lohnt sich B12 als Holo-TC, dazu Eisen und Zink. Der Nährstoff Check Premium deckt das ab.", product: "Nährstoff Check Premium" },
      { q: "Haarausfall, brüchige Nägel.", a: "Typische Werte dafür sind Ferritin, Zink und die Schilddrüse. Ich würde beim Ferritin anfangen.", product: "Nährstoff Check Premium" },
    ],
    en: [
      { q: "I eat vegan.", a: "Then B12 as holo-TC is worth it, plus iron and zinc. The nutrient check premium covers that.", product: "Nährstoff Check Premium" },
      { q: "Hair loss, brittle nails.", a: "Typical values are ferritin, zinc and the thyroid. I'd start with ferritin.", product: "Nährstoff Check Premium" },
    ],
  },
  hormone: {
    de: [
      { q: "Mein Zyklus ist unregelmäßig.", a: "Dann schauen wir auf FSH, LH, Estradiol und AMH. Der Fruchtbarkeits Check misst alle vier.", product: "Fruchtbarkeits Check für Frauen" },
      { q: "Wenig Energie, weniger Libido.", a: "Bei Männern lohnt der Blick auf Testosteron und SHBG. Der Testosteron Check ist der Einstieg.", product: "Testosteron Check" },
    ],
    en: [
      { q: "My cycle is irregular.", a: "Then we look at FSH, LH, oestradiol and AMH. The fertility check measures all four.", product: "Fruchtbarkeits Check für Frauen" },
      { q: "Low energy, less libido.", a: "For men, testosterone and SHBG are worth a look. The testosterone check is the start.", product: "Testosteron Check" },
    ],
  },
  "herz-kreislauf": {
    de: [
      { q: "Herzinfarkt in der Familie.", a: "Dann sind Blutfette und Entzündung wichtig: LDL, HDL, Triglyceride und hs-CRP. Der Herz-Kreislauf Check hat alles.", product: "Herz-Kreislauf Check" },
      { q: "Nur Cholesterin prüfen.", a: "Dafür reicht der Lipid Check mit vier Werten.", product: "Lipid Check" },
    ],
    en: [
      { q: "Heart attack in the family.", a: "Then lipids and inflammation matter: LDL, HDL, triglycerides and hs-CRP. The heart check has all of them.", product: "Herz-Kreislauf Check" },
      { q: "Just check cholesterol.", a: "The lipid check with four values is enough for that.", product: "Lipid Check" },
    ],
  },
  "energie-vitalitat": {
    de: [
      { q: "Müde, auch nach 8 Stunden Schlaf.", a: "Dann prüfen wir Vitamin D, B12, Folsäure und Cortisol. Der Müdigkeits Check misst genau die.", product: "Müdigkeits Check" },
      { q: "Konzentration lässt nach.", a: "Der Neuro Vital Check schaut auf Nährstoffe und Stresshormone, die das Denken beeinflussen.", product: "Neuro Vital Check" },
    ],
    en: [
      { q: "Tired even after 8 hours of sleep.", a: "Then we check vitamin D, B12, folate and cortisol. The fatigue check measures exactly those.", product: "Müdigkeits Check" },
      { q: "Concentration is slipping.", a: "The Neuro Vital check looks at nutrients and stress hormones that affect thinking.", product: "Neuro Vital Check" },
    ],
  },
};

export const miraDemo = (handle: string | null, locale: Locale): DemoExchange[] =>
  (handle && BY_COLLECTION[handle]?.[locale]) || GENERIC[locale];
