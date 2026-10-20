import type { Locale } from "@/lib/i18n/config";
import { candidaEntry, hpvEntry, IGNORE_FRAGMENTS, VALUES, type Fields, type ValueTopic } from "./biomarkers.data";

const NOTE_DE = "Allgemeine Orientierungsinformationen. Sie ersetzen keine ärztliche Beratung oder Diagnose.";
const NOTE_EN = "General orientation only. This does not replace medical advice or diagnosis.";

/**
 * Editorial knowledge about analysed values, shown in the info box on product
 * pages. Texts are orientation only (no medical advice) and were taken over
 * from the existing DoctorBox storefront; English versions translated.
 *
 * Add a new value: one entry per locale under its display name. Products are
 * matched by their `custom.biomarkers` metafield (see `matchBiomarker`).
 */
export type InfoItem = { label: string; text: string };
export type BiomarkerEntry = {
  left: InfoItem[];
  right: InfoItem[];
  tags?: { label: string; values: string[] };
};
export type Topic = { kicker: string; title: string; note: string };

const sti = (
  what: string,
  symptoms: string,
  routes: string[],
  transmission: string,
  treatment: string,
  consequences: string,
  l: Locale,
): BiomarkerEntry => ({
  left: [
    { label: l === "en" ? "What is it?" : "Was ist das?", text: what },
    { label: l === "en" ? "Symptoms" : "Symptome", text: symptoms },
  ],
  tags: { label: l === "en" ? "Transmitted via" : "Ansteckung über", values: routes },
  right: [
    { label: l === "en" ? "Transmission" : "Übertragung", text: transmission },
    { label: l === "en" ? "Treatment" : "Behandlung", text: treatment },
    { label: l === "en" ? "Possible consequences" : "Mögliche Folgen", text: consequences },
  ],
});

const de: Record<string, BiomarkerEntry> = {
  Chlamydien: sti(
    "Chlamydien sind bakterielle Infektionen der Schleimhäute und betreffen vor allem Harnröhre, Gebärmutterhals sowie Enddarm.",
    "Oft symptomlos. Mögliche Beschwerden: Ausfluss, Brennen beim Wasserlassen, Unterbauchschmerzen.",
    ["Oral", "Anal", "Vaginal"],
    "Über Schleimhautkontakt beim vaginalen, analen oder oralen Sex. Eine Übertragung bei Geburt ist möglich.",
    "Gut mit Antibiotika behandelbar. Wichtig ist die vollständige Therapie und Mitbehandlung von Partner:innen.",
    "Unbehandelt möglich: Entzündungen im Beckenbereich, Nebenhodenentzündung, verminderte Fruchtbarkeit.",
    "de",
  ),
  "Gonorrhö (Tripper)": sti(
    "Bakterielle Infektion durch Neisseria gonorrhoeae, häufig an Harnröhre, Gebärmutterhals, Enddarm und Rachen.",
    "Mögliche Beschwerden: eitriger Ausfluss, Brennen beim Wasserlassen, Rachen- oder Enddarmbeschwerden.",
    ["Oral", "Anal", "Vaginal"],
    "Durch ungeschützten vaginalen, analen oder oralen Sex.",
    "Behandlung mit Antibiotika. Die Resistenzlage macht eine gezielte Therapie wichtig.",
    "Unbehandelt Entzündungen im Beckenbereich, Nebenhodenentzündung und Fruchtbarkeitsprobleme möglich.",
    "de",
  ),
  HIV: sti(
    "HIV greift das Immunsystem an. Ohne Therapie kann die Infektion langfristig zu AIDS führen.",
    "Frühphase oft grippeähnlich, danach häufig lange ohne Beschwerden.",
    ["Blut", "Vaginal", "Anal"],
    "Über infektiöse Körperflüssigkeiten wie Blut, Sperma, Vaginal- und Rektalsekret sowie Muttermilch.",
    "Mit antiretroviraler Therapie (ART) sehr gut kontrollierbar. Bei dauerhaft unterdrückter Viruslast ist eine sexuelle Übertragung nach heutigem Wissen nicht zu erwarten (U=U).",
    "Unbehandelt schwere Immunschwäche und lebensbedrohliche Folgeinfektionen.",
    "de",
  ),
  Syphilis: sti(
    "Syphilis ist eine bakterielle Infektion (Treponema pallidum), die in mehreren Stadien verlaufen kann.",
    "Zu Beginn häufig schmerzloses Geschwür, später Hautausschlag, Fieber, Lymphknotenschwellung.",
    ["Oral", "Anal", "Vaginal"],
    "Durch direkten Kontakt mit infektiösen Läsionen beim vaginalen, analen oder oralen Sex.",
    "Früh erkannt sehr gut mit Antibiotika behandelbar.",
    "Ohne Behandlung schwere Schäden an Herz, Gefäßen und Nervensystem möglich.",
    "de",
  ),
  "Hepatitis C": sti(
    "Virale Leberinfektion durch das Hepatitis-C-Virus (HCV).",
    "Häufig lange symptomarm; möglich sind Müdigkeit, Übelkeit, Oberbauchbeschwerden.",
    ["Blut"],
    "Vor allem über Blut-zu-Blut-Kontakt (z. B. gemeinsam benutzte Nadeln). Eine sexuelle Übertragung ist möglich, aber deutlich seltener.",
    "Heute in den meisten Fällen mit direkt antiviralen Medikamenten heilbar.",
    "Unbehandelt kann es zu chronischer Leberentzündung, Leberfibrose oder Leberzirrhose kommen.",
    "de",
  ),
  Trichomonaden: sti(
    "Infektion durch den Parasiten Trichomonas vaginalis.",
    "Häufig symptomlos; möglich sind Juckreiz, Ausfluss oder Brennen.",
    ["Vaginal"],
    "Vor allem durch vaginalen Geschlechtsverkehr.",
    "Gut mit antiparasitären Medikamenten behandelbar.",
    "Unbehandelt anhaltende Beschwerden und erhöhte Anfälligkeit für weitere Infektionen.",
    "de",
  ),
  "Mycoplasma genitalium": sti(
    "Bakterielle Infektion des Urogenitaltrakts.",
    "Oft symptomlos, möglich sind Ausfluss, Reizung und Brennen.",
    ["Vaginal", "Anal"],
    "Über vaginalen und analen Sex.",
    "Mit gezielter Antibiotikatherapie behandelbar.",
    "Unbehandelt möglich: anhaltende Entzündungen und Beschwerden.",
    "de",
  ),
  "Mycoplasma hominis": sti(
    "Bakterium, das Teil der urogenitalen Flora sein kann und nicht immer krankheitsrelevant ist.",
    "Häufig symptomlos; gelegentlich Ausfluss, Reizung oder Unterbauchbeschwerden.",
    ["Vaginal", "Anal"],
    "Sexuelle Übertragung ist möglich.",
    "Eine Behandlung wird in der Regel nur bei passender Symptomatik und ärztlicher Einordnung empfohlen.",
    "Ohne klinische Relevanz oft keine unmittelbaren Folgen.",
    "de",
  ),
  "Ureaplasma parvum": sti(
    "Bakterium der Ureaplasma-Gruppe; ein Nachweis bedeutet nicht automatisch eine behandlungsbedürftige Infektion.",
    "Meist symptomlos; möglich sind unspezifische urogenitale Beschwerden.",
    ["Vaginal", "Anal"],
    "Sexuelle Übertragung ist möglich.",
    "Eine Behandlung ist meist nur bei passenden Beschwerden und ärztlicher Beurteilung sinnvoll.",
    "Häufig keine Folgen bei asymptomatischer Besiedlung.",
    "de",
  ),
  "Ureaplasma urealyticum": sti(
    "Bakterien, die im Urogenitalbereich vorkommen können; ein Nachweis bedeutet nicht immer Erkrankung.",
    "Häufig symptomlos, teils Reizung oder Ausfluss.",
    ["Vaginal", "Anal"],
    "Mögliche sexuelle Übertragung.",
    "Behandlung in der Regel nur bei klinischer Relevanz nach ärztlicher Abklärung.",
    "Ohne Beschwerden oft keine direkte Folge; die Einordnung im klinischen Kontext ist wichtig.",
    "de",
  ),
    };

const en: Record<string, BiomarkerEntry> = {
  Chlamydia: sti(
    "Chlamydia is a bacterial infection of the mucous membranes, mainly affecting the urethra, cervix and rectum.",
    "Often without symptoms. Possible complaints: discharge, burning when urinating, lower abdominal pain.",
    ["Oral", "Anal", "Vaginal"],
    "Through mucous-membrane contact during vaginal, anal or oral sex. Transmission at birth is possible.",
    "Treats well with antibiotics. Completing the full course and treating partners is important.",
    "Untreated it can lead to pelvic inflammation, epididymitis and reduced fertility.",
    "en",
  ),
  Gonorrhea: sti(
    "Bacterial infection caused by Neisseria gonorrhoeae, commonly in the urethra, cervix, rectum and throat.",
    "Possible complaints: purulent discharge, burning when urinating, throat or rectal symptoms.",
    ["Oral", "Anal", "Vaginal"],
    "Through unprotected vaginal, anal or oral sex.",
    "Treated with antibiotics. Growing resistance makes targeted therapy important.",
    "Untreated it can cause pelvic inflammation, epididymitis and fertility problems.",
    "en",
  ),
  HIV: sti(
    "HIV attacks the immune system. Without therapy the infection can lead to AIDS in the long term.",
    "The early phase often feels like flu, followed by a long period without symptoms.",
    ["Blood", "Vaginal", "Anal"],
    "Through infectious body fluids such as blood, semen, vaginal and rectal fluids and breast milk.",
    "Very well controllable with antiretroviral therapy (ART). With a durably suppressed viral load, sexual transmission is not expected (U=U).",
    "Untreated: severe immune deficiency and life-threatening secondary infections.",
    "en",
  ),
  Syphilis: sti(
    "Syphilis is a bacterial infection (Treponema pallidum) that can progress in several stages.",
    "Often a painless sore at first, later rash, fever and swollen lymph nodes.",
    ["Oral", "Anal", "Vaginal"],
    "Through direct contact with infectious lesions during vaginal, anal or oral sex.",
    "Detected early, it treats very well with antibiotics.",
    "Without treatment, serious damage to the heart, vessels and nervous system is possible.",
    "en",
  ),
  "Hepatitis C": sti(
    "Viral liver infection caused by the hepatitis C virus (HCV).",
    "Often few symptoms for a long time; fatigue, nausea and upper abdominal discomfort are possible.",
    ["Blood"],
    "Mainly through blood-to-blood contact (e.g. shared needles). Sexual transmission is possible but much rarer.",
    "Today curable in most cases with direct-acting antiviral medication.",
    "Untreated it can lead to chronic hepatitis, liver fibrosis or cirrhosis.",
    "en",
  ),
  Trichomonas: sti(
    "Infection with the parasite Trichomonas vaginalis.",
    "Often without symptoms; itching, discharge or burning are possible.",
    ["Vaginal"],
    "Mainly through vaginal intercourse.",
    "Treats well with antiparasitic medication.",
    "Untreated: persistent complaints and higher susceptibility to further infections.",
    "en",
  ),
  "Mycoplasma genitalium": sti(
    "Bacterial infection of the urogenital tract.",
    "Often without symptoms; discharge, irritation and burning are possible.",
    ["Vaginal", "Anal"],
    "Through vaginal and anal sex.",
    "Treatable with targeted antibiotic therapy.",
    "Untreated: persistent inflammation and complaints are possible.",
    "en",
  ),
  "Mycoplasma hominis": sti(
    "A bacterium that can be part of the normal urogenital flora and is not always disease-relevant.",
    "Usually without symptoms; occasionally discharge, irritation or lower abdominal discomfort.",
    ["Vaginal", "Anal"],
    "Sexual transmission is possible.",
    "Treatment is usually only recommended with matching symptoms and medical assessment.",
    "Without clinical relevance there are often no immediate consequences.",
    "en",
  ),
  "Ureaplasma parvum": sti(
    "A bacterium of the Ureaplasma group; a positive result does not automatically mean an infection needs treatment.",
    "Mostly without symptoms; unspecific urogenital complaints are possible.",
    ["Vaginal", "Anal"],
    "Sexual transmission is possible.",
    "Treatment usually only makes sense with matching complaints and medical assessment.",
    "Asymptomatic colonisation often has no consequences.",
    "en",
  ),
  "Ureaplasma urealyticum": sti(
    "Bacteria that can occur in the urogenital area; detection does not always mean disease.",
    "Often without symptoms, sometimes irritation or discharge.",
    ["Vaginal", "Anal"],
    "Sexual transmission is possible.",
    "Treatment usually only when clinically relevant, after medical assessment.",
    "Without complaints often no direct consequence; interpretation in the clinical context matters.",
    "en",
  ),
    };

/** EN display name for a DE key (products are matched on the DE metafield when needed). */
const EN_ALIAS: Record<string, string> = {
  Chlamydien: "Chlamydia",
  "Gonorrhö (Tripper)": "Gonorrhea",
  Trichomonaden: "Trichomonas",
};

const STI: Record<Locale, Record<string, BiomarkerEntry>> = { de, en };

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, " ")
    .replace(/\bsuchtest\b|\blues\b|\*/g, " ")
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9α ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Accepted spellings per STI entry key (DE key), normalised. */
const STI_SYNONYMS: Record<string, string[]> = {
  Chlamydien: ["chlamydien", "chlamydia"],
  "Gonorrhö (Tripper)": ["gonorrho", "gonorrhoe", "gonorrhoe tripper", "gonorrhea", "gonorrhoea", "gonorrhea the clap", "tripper"],
  HIV: ["hiv", "hiv 1 2", "hiv suchtest"],
  Syphilis: ["syphilis", "syphilis lues", "lues"],
  "Hepatitis C": ["hepatitis c", "hcv"],
  Trichomonaden: ["trichomonaden", "trichomonas", "trichomonas vaginalis", "trichomoniasis"],
  "Mycoplasma genitalium": ["mycoplasma genitalium", "mykoplasma genitalium"],
  "Mycoplasma hominis": ["mycoplasma hominis", "mykoplasma hominis"],
  "Ureaplasma parvum": ["ureaplasma parvum"],
  "Ureaplasma urealyticum": ["ureaplasma urealyticum"],
};

export type Matched = { key: string; title: string; topic: ValueTopic | "sti"; entry: BiomarkerEntry };

function fromFields(f: Fields, l: Locale): BiomarkerEntry {
  return {
    left: [
      { label: l === "en" ? "What is it?" : "Was ist das?", text: f.what },
      { label: l === "en" ? "Who should test" : "Für wen sinnvoll", text: f.why },
      { label: l === "en" ? "Possible signs" : "Mögliche Hinweise", text: f.symptoms },
    ],
    right: [
      { label: l === "en" ? "How to read it" : "Bedeutung", text: f.meaning },
      { label: l === "en" ? "Next steps" : "Nächste Schritte", text: f.next },
    ],
  };
}

/** Finds the editorial entry for a biomarker as written in the metafield (DE or EN). */
export function matchBiomarker(name: string, locale: Locale): Matched | null {
  const raw = name.trim();
  if (!raw || IGNORE_FRAGMENTS.some((f) => norm(f) === norm(raw))) return null;
  const n = norm(raw);

  // STI
  for (const [deKey, spellings] of Object.entries(STI_SYNONYMS)) {
    if (!spellings.some((sp) => norm(sp) === n)) continue;
    const key = locale === "en" ? (EN_ALIAS[deKey] ?? deKey) : deKey;
    const entry = STI[locale][key];
    return entry ? { key, title: key, topic: "sti", entry } : null;
  }
  // HPV types ("Typ 16" / "Type 16")
  const hpv = n.match(/^(?:typ|type|hpv)\s*(\d{2})$/);
  if (hpv) {
    const e = hpvEntry(hpv[1]);
    return { key: `hpv-${hpv[1]}`, title: e.title![locale], topic: "hpv", entry: fromFields(e[locale], locale) };
  }
  // Candida species ("Candida glabrata (CG)")
  const cand = n.match(/^candida\s+([a-z]+)/);
  if (cand) {
    const e = candidaEntry(cand[1]);
    if (e) return { key: `candida-${cand[1]}`, title: e.title![locale], topic: "candida", entry: fromFields(e[locale], locale) };
  }
  // Everything else
  for (const [key, e] of Object.entries(VALUES)) {
    const spellings = [key, e.title?.de, e.title?.en, ...(e.aliases ?? [])].filter(Boolean) as string[];
    if (spellings.some((sp) => norm(sp) === n)) {
      const title = e.title?.[locale] ?? (locale === "en" ? e.aliases?.find((a) => /^[A-Za-z]/.test(a) && a !== key) ?? key : key);
      return { key, title, topic: e.topic, entry: fromFields(e[locale], locale) };
    }
  }
  return null;
}

/* Headlines above the box, chosen by the dominant topic of the matched values */
const TOPICS: Record<Locale, Record<string, Topic>> = {
  de: {
    sti: { kicker: "Infektionen verlaufen oft symptomlos", title: "Jeden Tag infizieren sich weltweit über [[1 Million]] Menschen mit STIs", note: NOTE_DE },
    hpv: { kicker: "Fast jeder Mensch infiziert sich im Leben mit HPV", title: "Zellveränderungen entstehen [[über Jahre]] und werden nur durch Vorsorge entdeckt", note: NOTE_DE },
    candida: { kicker: "Drei von vier Frauen erleben mindestens einmal einen Scheidenpilz", title: "Die [[Candida-Art]] entscheidet über die passende Behandlung", note: NOTE_DE },
    vitamins: { kicker: "Viele Menschen haben unerkannte Mangelwerte", title: "Vitamine wirken leise, ein Mangel bleibt oft [[lange unbemerkt]]", note: NOTE_DE },
    nutrients: { kicker: "Mineralstoffe und Spurenelemente", title: "Gut essen reicht nicht immer: [[stille Nährstoffmängel]] sind häufig", note: NOTE_DE },
    lipids: { kicker: "Herz-Kreislauf-Erkrankungen sind Todesursache Nummer eins", title: "Blutfette lassen sich [[Jahrzehnte]] vor dem Infarkt erkennen und senken", note: NOTE_DE },
    glucose: { kicker: "Jede fünfte Person mit Diabetes weiß nichts davon", title: "Der Blutzucker erzählt die [[Geschichte]] der letzten drei Monate", note: NOTE_DE },
    hormones: { kicker: "Hormone steuern Energie, Stimmung und Stoffwechsel", title: "Ein Hormonwert ist eine [[Momentaufnahme]] und braucht den richtigen Zeitpunkt", note: NOTE_DE },
    thyroid: { kicker: "Schilddrüsenstörungen sind häufig und gut behandelbar", title: "Die Schilddrüse bestimmt das [[Tempo]] deines Stoffwechsels", note: NOTE_DE },
    fertility: { kicker: "Fruchtbarkeit verstehen statt raten", title: "Hormone zeigen, wo dein Zyklus und deine [[Eizellreserve]] stehen", note: NOTE_DE },
    kidney: { kicker: "Die Niere arbeitet still", title: "Nierenschäden bleiben lange unbemerkt, [[Früherkennung]] schützt die Funktion", note: NOTE_DE },
    liver: { kicker: "Etwa jeder vierte Erwachsene hat eine Fettleber", title: "Die Leber schmerzt nicht, ihre [[Werte]] sprechen für sie", note: NOTE_DE },
    inflammation: { kicker: "Stille Entzündung", title: "Niedriggradige Entzündung ist nicht spürbar, aber [[messbar]]", note: NOTE_DE },
    blood: { kicker: "Das Blutbild als Basis", title: "Blutbildung und Sauerstofftransport zeigen, wie [[belastbar]] dein Körper ist", note: NOTE_DE },
    prostate: { kicker: "Prostatakrebs ist die häufigste Krebsart bei Männern", title: "Früh erkannt ist Prostatakrebs in den meisten Fällen [[gut behandelbar]]", note: NOTE_DE },
    bowel: { kicker: "Darmkrebs entsteht über Jahre aus Polypen", title: "Vorsorge erkennt Vorstufen, [[bevor]] daraus Krebs wird", note: NOTE_DE },
    allergy: { kicker: "Allergien betreffen rund ein Drittel der Erwachsenen", title: "Der Nachweis von IgE zeigt, worauf dein Immunsystem [[reagiert]]", note: NOTE_DE },
    dna: { kicker: "Genetik ist ein Teil des Risikos, Lebensstil der andere", title: "Polygene Risikoscores helfen, Vorsorge [[persönlich]] zu planen", note: NOTE_DE },
    gut: { kicker: "Der Darm im Fokus", title: "Verdauungsbeschwerden haben Ursachen, die sich [[eingrenzen]] lassen", note: NOTE_DE },
    aminoacids: { kicker: "Bausteine des Lebens", title: "Aminosäuren zeigen, wie gut dein Körper mit [[Eiweiß]] versorgt ist", note: NOTE_DE },
    fattyacids: { kicker: "Omega-3 und Omega-6 im Gleichgewicht", title: "Die Fettsäurebalance beeinflusst Herz, Gehirn und [[Entzündung]]", note: NOTE_DE },
    longevity: { kicker: "Biologisches Alter", title: "Neun Blutwerte zeigen, wie [[alt]] dein Körper wirklich ist", note: NOTE_DE },
    generic: { kicker: "Gut zu wissen", title: "Was dieser Test [[misst]] und warum es zählt", note: NOTE_DE },
  },
  en: {
    sti: { kicker: "Infections often cause no symptoms", title: "Every day more than [[1 million]] people worldwide contract an STI", note: NOTE_EN },
    hpv: { kicker: "Almost everyone contracts HPV at some point", title: "Cell changes develop [[over years]] and are only found through screening", note: NOTE_EN },
    candida: { kicker: "Three in four women experience a vaginal yeast infection at least once", title: "The [[Candida species]] determines the right treatment", note: NOTE_EN },
    vitamins: { kicker: "Many people have undetected low values", title: "Vitamins work quietly, a deficiency often goes [[unnoticed]] for a long time", note: NOTE_EN },
    nutrients: { kicker: "Minerals and trace elements", title: "Eating well is not always enough: [[silent nutrient gaps]] are common", note: NOTE_EN },
    lipids: { kicker: "Cardiovascular disease is the number one cause of death", title: "Blood lipids can be detected and lowered [[decades]] before a heart attack", note: NOTE_EN },
    glucose: { kicker: "One in five people with diabetes does not know it", title: "Blood sugar tells the [[story]] of the past three months", note: NOTE_EN },
    hormones: { kicker: "Hormones steer energy, mood and metabolism", title: "A hormone value is a [[snapshot]] and needs the right timing", note: NOTE_EN },
    thyroid: { kicker: "Thyroid disorders are common and treatable", title: "The thyroid sets the [[pace]] of your metabolism", note: NOTE_EN },
    fertility: { kicker: "Understand fertility instead of guessing", title: "Hormones show where your cycle and your [[egg reserve]] stand", note: NOTE_EN },
    kidney: { kicker: "The kidney works silently", title: "Kidney damage stays unnoticed for a long time, [[early detection]] protects function", note: NOTE_EN },
    liver: { kicker: "About one in four adults has a fatty liver", title: "The liver does not hurt, its [[values]] speak for it", note: NOTE_EN },
    inflammation: { kicker: "Silent inflammation", title: "Low-grade inflammation cannot be felt, but it can be [[measured]]", note: NOTE_EN },
    blood: { kicker: "The blood count as a foundation", title: "Blood formation and oxygen transport show how [[resilient]] your body is", note: NOTE_EN },
    prostate: { kicker: "Prostate cancer is the most common cancer in men", title: "Detected early, prostate cancer is in most cases [[highly treatable]]", note: NOTE_EN },
    bowel: { kicker: "Bowel cancer develops from polyps over years", title: "Screening finds precursors [[before]] they turn into cancer", note: NOTE_EN },
    allergy: { kicker: "Allergies affect around a third of adults", title: "IgE detection shows what your immune system [[reacts]] to", note: NOTE_EN },
    dna: { kicker: "Genetics is one part of risk, lifestyle the other", title: "Polygenic risk scores help plan screening [[personally]]", note: NOTE_EN },
    gut: { kicker: "Focus on the gut", title: "Digestive complaints have causes that can be [[narrowed down]]", note: NOTE_EN },
    aminoacids: { kicker: "Building blocks of life", title: "Amino acids show how well your body is supplied with [[protein]]", note: NOTE_EN },
    fattyacids: { kicker: "Omega-3 and omega-6 in balance", title: "Fatty acid balance influences heart, brain and [[inflammation]]", note: NOTE_EN },
    longevity: { kicker: "Biological age", title: "Nine blood values show how [[old]] your body really is", note: NOTE_EN },
    generic: { kicker: "Good to know", title: "What this test [[measures]] and why it matters", note: NOTE_EN },
  },
};

/** Picks the headline from the most frequent topic among the matched values. */
export function resolveTopic(matched: Pick<Matched, "topic">[], locale: Locale): Topic {
  const t = TOPICS[locale];
  if (!matched.length) return t.generic;
  const counts = new Map<string, number>();
  for (const m of matched) counts.set(m.topic, (counts.get(m.topic) ?? 0) + 1);
  const [best] = Array.from(counts.entries()).sort((a, b) => b[1] - a[1])[0];
  return t[best] ?? t.generic;
}

export { VALUES };
