/**
 * Editorial knowledge per analysed value (non-STI). Orientation only, no diagnosis.
 * Sources behind the wording: DGE/RKI reference material, ESC/EAS lipid guidelines, KDIGO (kidney),
 * ADA/DDG (HbA1c), ETA/DGE (thyroid), WHO (HPV, allergy), S3 guidelines (CRC screening, PSA).
 *
 * Field meaning:  what – what is measured · why – who benefits from testing / risk factors ·
 *                 symptoms – possible signs of abnormal values · meaning – how to read the result ·
 *                 next – what to do with an abnormal value
 */
export type Fields = { what: string; why: string; symptoms: string; meaning: string; next: string };
export type ValueTopic =
  | "lipids"
  | "glucose"
  | "hormones"
  | "thyroid"
  | "fertility"
  | "kidney"
  | "liver"
  | "nutrients"
  | "vitamins"
  | "inflammation"
  | "blood"
  | "prostate"
  | "bowel"
  | "allergy"
  | "hpv"
  | "candida"
  | "dna"
  | "gut"
  | "aminoacids"
  | "fattyacids"
  | "longevity";

export type ValueEntry = { de: Fields; en: Fields; topic: ValueTopic; title?: { de: string; en: string }; aliases?: string[] };


export const VALUES: Record<string, ValueEntry> = {
  /* ------------------------------------------------------------------ Lipide / Herz */
  "LDL-Cholesterin": {
    topic: "lipids",
    aliases: ["LDL", "LDL cholesterol"],
    de: {
      what: "LDL-Cholesterin transportiert Cholesterin zu den Geweben. Es ist der wichtigste beeinflussbare Risikofaktor für Atherosklerose, also Ablagerungen in den Gefäßwänden.",
      why: "Sinnvoll ab dem mittleren Erwachsenenalter, bei familiärer Vorbelastung für Herzinfarkt oder Schlaganfall, Bluthochdruck, Diabetes, Rauchen oder Übergewicht.",
      symptoms: "Erhöhte Werte verursachen keine Beschwerden. Sie fallen meist erst durch Folgeerkrankungen oder gezielte Kontrollen auf.",
      meaning: "Je höher LDL über Jahre liegt, desto höher das Herz-Kreislauf-Risiko. Der Zielwert hängt vom Gesamtrisiko ab; die ESC/EAS-Leitlinien nennen für Gesunde unter 116 mg/dl (3,0 mmol/l).",
      next: "Erhöhte Werte mit ärztlicher Risikoabschätzung einordnen. Ernährung, Bewegung und Rauchstopp senken LDL; bei hohem Risiko kommen Medikamente infrage.",
    },
    en: {
      what: "LDL cholesterol carries cholesterol to the tissues. It is the most important modifiable risk factor for atherosclerosis, i.e. deposits in the vessel walls.",
      why: "Useful from middle age, with a family history of heart attack or stroke, high blood pressure, diabetes, smoking or excess weight.",
      symptoms: "High values cause no symptoms. They are usually found through complications or targeted check-ups.",
      meaning: "The higher LDL stays over the years, the higher the cardiovascular risk. Targets depend on overall risk; ESC/EAS guidelines suggest below 116 mg/dl (3.0 mmol/l) for healthy adults.",
      next: "Have high values assessed with a medical risk evaluation. Diet, exercise and quitting smoking lower LDL; medication is an option at high risk.",
    },
  },
  "HDL-Cholesterin": {
    topic: "lipids",
    aliases: ["HDL", "HDL cholesterol"],
    de: {
      what: "HDL-Cholesterin transportiert überschüssiges Cholesterin zurück zur Leber. Es wird oft als „gutes“ Cholesterin bezeichnet.",
      why: "Teil jeder Lipid-Bestimmung. Niedrige Werte treten häufig zusammen mit Übergewicht, Bewegungsmangel, Rauchen oder erhöhten Triglyceriden auf.",
      symptoms: "Keine direkten Beschwerden. Ein niedriger HDL-Wert ist ein Risikomarker, keine Erkrankung.",
      meaning: "Werte unter 40 mg/dl (Männer) bzw. 45 mg/dl (Frauen) gelten als ungünstig. Sehr hohe Werte sind nach aktueller Studienlage nicht automatisch schützend.",
      next: "HDL lässt sich vor allem durch Bewegung, Gewichtsreduktion und Rauchstopp beeinflussen. Die Bewertung erfolgt immer zusammen mit LDL und Triglyceriden.",
    },
    en: {
      what: "HDL cholesterol carries excess cholesterol back to the liver. It is often called the “good” cholesterol.",
      why: "Part of every lipid panel. Low values often go together with excess weight, inactivity, smoking or raised triglycerides.",
      symptoms: "No direct symptoms. A low HDL value is a risk marker, not a disease.",
      meaning: "Values below 40 mg/dl (men) or 45 mg/dl (women) are considered unfavourable. Very high values are not automatically protective according to current evidence.",
      next: "HDL responds mainly to exercise, weight loss and quitting smoking. It is always interpreted together with LDL and triglycerides.",
    },
  },
  Gesamtcholesterin: {
    topic: "lipids",
    aliases: ["total cholesterol", "Cholesterin"],
    de: {
      what: "Das Gesamtcholesterin fasst alle Cholesterin-Fraktionen im Blut zusammen, vor allem LDL und HDL.",
      why: "Als erster Überblick über den Fettstoffwechsel, insbesondere zusammen mit LDL, HDL und Triglyceriden.",
      symptoms: "Keine Beschwerden. Erhöhte Werte bleiben ohne Messung unbemerkt.",
      meaning: "Allein ist der Wert wenig aussagekräftig; entscheidend ist die Aufteilung in LDL und HDL. Ab etwa 200 mg/dl lohnt sich ein genauer Blick.",
      next: "Auffällige Werte zusammen mit dem gesamten Lipidprofil und weiteren Risikofaktoren ärztlich einordnen.",
    },
    en: {
      what: "Total cholesterol sums all cholesterol fractions in the blood, mainly LDL and HDL.",
      why: "As a first overview of lipid metabolism, especially together with LDL, HDL and triglycerides.",
      symptoms: "No symptoms. High values go unnoticed without a measurement.",
      meaning: "On its own the value says little; the split into LDL and HDL matters. From about 200 mg/dl a closer look is worthwhile.",
      next: "Have abnormal values interpreted together with the full lipid profile and other risk factors.",
    },
  },
  Triglyceride: {
    topic: "lipids",
    aliases: ["Triglycerides", "Triglyceride (TGC)", "TGC"],
    de: {
      what: "Triglyceride sind Nahrungs- und Speicherfette im Blut. Sie steigen nach Mahlzeiten an und spiegeln Ernährung, Alkohol und Stoffwechsel wider.",
      why: "Bei Übergewicht, Diabetes, hohem Alkoholkonsum, zuckerreicher Ernährung oder familiärer Fettstoffwechselstörung.",
      symptoms: "Meist beschwerdefrei. Sehr hohe Werte (über 500 mg/dl) können eine Bauchspeicheldrüsenentzündung begünstigen.",
      meaning: "Nüchtern gelten Werte unter 150 mg/dl (1,7 mmol/l) als normal. Dauerhaft erhöhte Werte sind ein eigenständiger Herz-Kreislauf-Risikofaktor.",
      next: "Weniger Zucker und Alkohol, mehr Bewegung und Gewichtsreduktion senken Triglyceride deutlich. Hohe Werte ärztlich abklären lassen.",
    },
    en: {
      what: "Triglycerides are dietary and storage fats in the blood. They rise after meals and reflect diet, alcohol and metabolism.",
      why: "With excess weight, diabetes, high alcohol intake, a sugar-rich diet or a familial lipid disorder.",
      symptoms: "Usually no symptoms. Very high values (above 500 mg/dl) can favour pancreatitis.",
      meaning: "Fasting values below 150 mg/dl (1.7 mmol/l) are normal. Persistently raised values are an independent cardiovascular risk factor.",
      next: "Less sugar and alcohol, more exercise and weight loss lower triglycerides markedly. Have high values assessed medically.",
    },
  },
  "Lipoprotein(a)": {
    topic: "lipids",
    aliases: ["Lp(a)"],
    de: {
      what: "Lipoprotein(a) ist ein LDL-ähnliches Partikel, dessen Konzentration überwiegend genetisch festgelegt ist und sich kaum durch den Lebensstil ändert.",
      why: "Die ESC empfiehlt, Lp(a) einmal im Leben zu bestimmen, besonders bei frühen Herzinfarkten oder Schlaganfällen in der Familie.",
      symptoms: "Keine Beschwerden. Ein hoher Wert bleibt ohne Test unerkannt.",
      meaning: "Werte über 50 mg/dl (etwa 125 nmol/l) erhöhen das Risiko für Herzinfarkt, Schlaganfall und Aortenklappenverengung unabhängig vom LDL.",
      next: "Da Lp(a) stabil ist, genügt meist eine Messung. Bei hohem Wert gilt es, die übrigen Risikofaktoren besonders konsequent zu behandeln.",
    },
    en: {
      what: "Lipoprotein(a) is an LDL-like particle whose level is largely genetic and hardly changes with lifestyle.",
      why: "The ESC recommends measuring Lp(a) once in a lifetime, especially with early heart attacks or strokes in the family.",
      symptoms: "No symptoms. A high value stays unknown without a test.",
      meaning: "Values above 50 mg/dl (about 125 nmol/l) raise the risk of heart attack, stroke and aortic valve stenosis independently of LDL.",
      next: "Since Lp(a) is stable, one measurement is usually enough. With a high value, the other risk factors should be treated particularly consistently.",
    },
  },
  "Apolipoprotein B (ApoB)": {
    topic: "lipids",
    aliases: ["ApoB", "Apolipoprotein B"],
    de: {
      what: "ApoB ist das Strukturprotein aller atherogenen Lipoproteine (LDL, VLDL, Lp(a)). Es zählt die Zahl der potenziell gefäßschädigenden Partikel.",
      why: "Besonders aussagekräftig bei erhöhten Triglyceriden, Diabetes oder Übergewicht, wenn LDL allein das Risiko unterschätzen kann.",
      symptoms: "Keine Beschwerden.",
      meaning: "Nach ESC/EAS ist ApoB ein sehr guter Risikomarker; für Gesunde gelten Werte unter 100 mg/dl als wünschenswert, bei hohem Risiko niedriger.",
      next: "Erhöhte Werte wie LDL behandeln: Lebensstil zuerst, bei hohem Gesamtrisiko medikamentöse Senkung nach ärztlicher Beratung.",
    },
    en: {
      what: "ApoB is the structural protein of all atherogenic lipoproteins (LDL, VLDL, Lp(a)). It counts the number of potentially vessel-damaging particles.",
      why: "Particularly informative with raised triglycerides, diabetes or excess weight, where LDL alone may underestimate risk.",
      symptoms: "No symptoms.",
      meaning: "According to ESC/EAS, ApoB is a very good risk marker; for healthy people values below 100 mg/dl are desirable, lower at high risk.",
      next: "Treat high values like LDL: lifestyle first, drug therapy at high overall risk after medical advice.",
    },
  },
  "NT-proBNP": {
    topic: "lipids",
    de: {
      what: "NT-proBNP wird vom Herzmuskel bei Dehnung und Druckbelastung freigesetzt. Es ist der wichtigste Labormarker für eine Herzschwäche.",
      why: "Bei Luftnot, Leistungsabfall oder Wassereinlagerungen sowie zur Einordnung des Herzrisikos bei Bluthochdruck oder Nierenerkrankung.",
      symptoms: "Kurzatmigkeit bei Belastung, geschwollene Beine, nächtlicher Harndrang und Müdigkeit können auf eine Herzschwäche hinweisen.",
      meaning: "Niedrige Werte (unter 125 pg/ml) machen eine Herzschwäche unwahrscheinlich. Der Wert steigt mit dem Alter und bei eingeschränkter Nierenfunktion.",
      next: "Erhöhte Werte zeitnah ärztlich abklären, in der Regel mit Herzultraschall. Nicht zur Selbstdiagnose geeignet.",
    },
    en: {
      what: "NT-proBNP is released by the heart muscle under stretch and pressure load. It is the key laboratory marker for heart failure.",
      why: "With breathlessness, declining performance or fluid retention, and to assess cardiac risk with high blood pressure or kidney disease.",
      symptoms: "Shortness of breath on exertion, swollen legs, night-time urination and fatigue can point to heart failure.",
      meaning: "Low values (below 125 pg/ml) make heart failure unlikely. The value rises with age and with reduced kidney function.",
      next: "Have raised values assessed promptly by a doctor, usually with an echocardiogram. Not suitable for self-diagnosis.",
    },
  },

  /* ------------------------------------------------------------------ Glukose */
  HbA1c: {
    topic: "glucose",
    aliases: ["HbA1C", "Blutzucker-Langzeitwert"],
    de: {
      what: "HbA1c ist der Anteil des Hämoglobins, an den Zucker gebunden ist. Er spiegelt den durchschnittlichen Blutzucker der letzten 8 bis 12 Wochen wider.",
      why: "Bei Übergewicht, Diabetes in der Familie, Bluthochdruck, Schwangerschaftsdiabetes in der Vorgeschichte oder ab 35 Jahren als Vorsorge.",
      symptoms: "Ein beginnender Diabetes verläuft oft unbemerkt. Durst, häufiges Wasserlassen, Müdigkeit oder Infektneigung sind späte Zeichen.",
      meaning: "Unter 5,7 % gilt als normal, 5,7 bis 6,4 % als Prädiabetes, ab 6,5 % spricht für Diabetes (ADA/DDG). Blutarmut oder Hämoglobin-Varianten können den Wert verfälschen.",
      next: "Grenzwertige oder erhöhte Werte ärztlich bestätigen lassen. Im Prädiabetes senken Gewichtsreduktion und Bewegung das Diabetesrisiko deutlich.",
    },
    en: {
      what: "HbA1c is the share of haemoglobin that has sugar bound to it. It reflects the average blood glucose of the past 8 to 12 weeks.",
      why: "With excess weight, diabetes in the family, high blood pressure, past gestational diabetes or as a check-up from age 35.",
      symptoms: "Early diabetes often goes unnoticed. Thirst, frequent urination, fatigue or frequent infections are late signs.",
      meaning: "Below 5.7 % is normal, 5.7 to 6.4 % indicates prediabetes, 6.5 % or more suggests diabetes (ADA/DDG). Anaemia or haemoglobin variants can distort the value.",
      next: "Have borderline or raised values confirmed by a doctor. In prediabetes, weight loss and exercise clearly lower the risk of diabetes.",
    },
  },
  "Glukose (nüchtern)": {
    topic: "glucose",
    aliases: ["Nüchtern-Glukose", "fasting glucose", "Glukose"],
    de: {
      what: "Die Nüchternglukose ist der Blutzucker nach mindestens 8 Stunden ohne Nahrung. Sie zeigt, wie gut der Körper den Zucker über Nacht reguliert.",
      why: "Zur Diabetesvorsorge, bei Übergewicht oder familiärer Belastung, ergänzend zum HbA1c.",
      symptoms: "Meist keine. Starke Schwankungen können Heißhunger, Zittern oder Müdigkeit auslösen.",
      meaning: "Unter 100 mg/dl (5,6 mmol/l) ist normal, 100 bis 125 mg/dl gilt als gestörte Nüchternglukose, ab 126 mg/dl spricht für Diabetes (bei Bestätigung).",
      next: "Erhöhte Werte wiederholen und mit HbA1c kombinieren. Lebensstilmaßnahmen wirken früh und gut.",
    },
    en: {
      what: "Fasting glucose is blood sugar after at least 8 hours without food. It shows how well the body regulates glucose overnight.",
      why: "For diabetes screening, with excess weight or family history, complementing HbA1c.",
      symptoms: "Usually none. Strong swings may cause cravings, shakiness or fatigue.",
      meaning: "Below 100 mg/dl (5.6 mmol/l) is normal, 100 to 125 mg/dl is impaired fasting glucose, 126 mg/dl or more suggests diabetes (if confirmed).",
      next: "Repeat raised values and combine with HbA1c. Lifestyle measures work early and well.",
    },
  },

  /* ------------------------------------------------------------------ Hormone */
  Testosteron: {
    topic: "hormones",
    aliases: ["Testosterone"],
    de: {
      what: "Testosteron ist das wichtigste männliche Geschlechtshormon und kommt in geringerer Menge auch bei Frauen vor. Es beeinflusst Muskulatur, Knochen, Libido, Stimmung und Blutbildung.",
      why: "Bei nachlassender Libido, Antriebsschwäche, Muskelabbau oder Erektionsproblemen; bei Frauen bei Zyklusstörungen, Akne oder vermehrter Behaarung.",
      symptoms: "Niedrige Werte bei Männern: Müdigkeit, geringe Lust, Muskelverlust, Stimmungstief. Hohe Werte bei Frauen: unreine Haut, Haarausfall am Kopf, unregelmäßige Zyklen.",
      meaning: "Testosteron ist morgens am höchsten und schwankt stark; eine Blutentnahme vor 10 Uhr ist aussagekräftig. Ein einzelner niedriger Wert sollte bestätigt werden.",
      next: "Auffällige Werte endokrinologisch oder urologisch bzw. gynäkologisch abklären. Schlaf, Gewicht und Krafttraining beeinflussen den Spiegel.",
    },
    en: {
      what: "Testosterone is the main male sex hormone and is present in smaller amounts in women. It affects muscle, bone, libido, mood and blood formation.",
      why: "With falling libido, low drive, muscle loss or erectile problems; in women with cycle disorders, acne or excess hair growth.",
      symptoms: "Low values in men: fatigue, low desire, muscle loss, low mood. High values in women: blemished skin, scalp hair loss, irregular cycles.",
      meaning: "Testosterone peaks in the morning and fluctuates strongly; a sample before 10 am is meaningful. A single low value should be confirmed.",
      next: "Have abnormal values assessed by endocrinology, urology or gynaecology. Sleep, weight and strength training influence the level.",
    },
  },
  SHBG: {
    topic: "hormones",
    de: {
      what: "Das Sexualhormon-bindende Globulin (SHBG) bindet Testosteron und Estradiol im Blut. Nur der ungebundene Anteil ist biologisch aktiv.",
      why: "Zur Einordnung des Testosteronwerts: Bei hohem SHBG kann das Gesamt-Testosteron normal, das freie Testosteron aber niedrig sein.",
      symptoms: "SHBG selbst macht keine Beschwerden; es verändert, wie viel Hormon wirkt.",
      meaning: "Übergewicht, Insulinresistenz und Schilddrüsenunterfunktion senken SHBG; Alter, Östrogene und Leberbelastung erhöhen es.",
      next: "Immer gemeinsam mit Testosteron bewerten. Daraus lässt sich der freie Androgen-Index berechnen.",
    },
    en: {
      what: "Sex hormone-binding globulin (SHBG) binds testosterone and estradiol in the blood. Only the unbound share is biologically active.",
      why: "To interpret the testosterone value: with high SHBG, total testosterone may be normal while free testosterone is low.",
      symptoms: "SHBG itself causes no symptoms; it changes how much hormone is active.",
      meaning: "Excess weight, insulin resistance and hypothyroidism lower SHBG; age, oestrogens and liver strain raise it.",
      next: "Always evaluate together with testosterone. The free androgen index can be calculated from both.",
    },
  },
  Cortisol: {
    topic: "hormones",
    de: {
      what: "Cortisol ist das zentrale Stresshormon der Nebennierenrinde. Es steuert Energiebereitstellung, Blutdruck, Immunsystem und den Tagesrhythmus.",
      why: "Bei anhaltendem Stress, Erschöpfung, Schlafstörungen oder unerklärter Gewichtsveränderung, um die Stressachse zu beurteilen.",
      symptoms: "Dauerhaft hohe Werte: Schlafprobleme, Bauchfett, Bluthochdruck, Infektanfälligkeit. Niedrige Werte: Schwäche, niedriger Blutdruck, Salzhunger.",
      meaning: "Cortisol folgt einem Tagesrhythmus mit Höchstwert morgens. Der Zeitpunkt der Probe ist entscheidend; ein Einzelwert zeigt eine Momentaufnahme.",
      next: "Auffällige Werte endokrinologisch abklären. Bei stressbedingten Veränderungen helfen Schlaf, Bewegung und Entlastung nachweislich.",
    },
    en: {
      what: "Cortisol is the central stress hormone of the adrenal cortex. It controls energy supply, blood pressure, the immune system and the daily rhythm.",
      why: "With ongoing stress, exhaustion, sleep problems or unexplained weight change, to assess the stress axis.",
      symptoms: "Persistently high values: sleep problems, abdominal fat, high blood pressure, frequent infections. Low values: weakness, low blood pressure, salt craving.",
      meaning: "Cortisol follows a daily rhythm with a morning peak. Sampling time is crucial; a single value is a snapshot.",
      next: "Have abnormal values assessed by endocrinology. For stress-related changes, sleep, exercise and relief are proven to help.",
    },
  },
  Prolaktin: {
    topic: "hormones",
    aliases: ["prolactin"],
    de: {
      what: "Prolaktin wird in der Hirnanhangsdrüse gebildet und steuert die Milchbildung. Außerhalb von Schwangerschaft und Stillzeit sind die Werte niedrig.",
      why: "Bei ausbleibender Regel, unerfülltem Kinderwunsch, Milchfluss ohne Stillen, Libidoverlust oder Zyklusstörungen.",
      symptoms: "Erhöhte Werte können Zyklusstörungen, Milchaustritt, Libidoverlust und bei Männern Potenzprobleme verursachen.",
      meaning: "Stress, Schlafmangel, Brustreizung und bestimmte Medikamente erhöhen Prolaktin vorübergehend. Deutlich erhöhte Werte sollten wiederholt werden.",
      next: "Bestätigt erhöhte Werte endokrinologisch abklären; häufige Ursachen sind Medikamente, Schilddrüsenunterfunktion oder gutartige Hypophysenveränderungen.",
    },
    en: {
      what: "Prolactin is produced in the pituitary gland and controls milk production. Outside pregnancy and breastfeeding the values are low.",
      why: "With absent periods, unfulfilled wish for a child, milk flow without breastfeeding, loss of libido or cycle disorders.",
      symptoms: "Raised values can cause cycle disorders, milk discharge, loss of libido and, in men, erectile problems.",
      meaning: "Stress, lack of sleep, nipple stimulation and certain medications raise prolactin temporarily. Clearly raised values should be repeated.",
      next: "Have confirmed high values assessed by endocrinology; common causes are medication, hypothyroidism or benign pituitary changes.",
    },
  },
  "Anti-Müller-Hormon": {
    topic: "fertility",
    aliases: ["AMH", "Anti-Müllerian hormone"],
    de: {
      what: "Das Anti-Müller-Hormon (AMH) wird von den kleinen Eibläschen gebildet und spiegelt die Eizellreserve der Eierstöcke wider.",
      why: "Bei Kinderwunschplanung, vor einer Kinderwunschbehandlung oder zur Einschätzung, wie viel Zeit bis zu den Wechseljahren bleibt.",
      symptoms: "AMH selbst verursacht keine Beschwerden. Ein niedriger Wert kann mit kürzeren oder unregelmäßigen Zyklen einhergehen.",
      meaning: "AMH sagt etwas über die Menge, nicht die Qualität der Eizellen. Es sinkt mit dem Alter; hohe Werte sind typisch beim PCO-Syndrom. Es sagt nicht vorher, ob eine natürliche Schwangerschaft gelingt.",
      next: "Den Wert gemeinsam mit Alter, Zyklus und Lebensplanung gynäkologisch besprechen, insbesondere vor Entscheidungen zur Familienplanung.",
    },
    en: {
      what: "Anti-Müllerian hormone (AMH) is produced by the small ovarian follicles and reflects the ovarian egg reserve.",
      why: "When planning a family, before fertility treatment or to estimate how much time remains until menopause.",
      symptoms: "AMH itself causes no symptoms. A low value can go along with shorter or irregular cycles.",
      meaning: "AMH tells you about the quantity, not the quality, of eggs. It falls with age; high values are typical of PCOS. It does not predict whether natural conception will succeed.",
      next: "Discuss the value with a gynaecologist together with age, cycle and life planning, especially before family-planning decisions.",
    },
  },
  FSH: {
    topic: "fertility",
    aliases: ["Follikelstimulierendes Hormon"],
    de: {
      what: "Das follikelstimulierende Hormon (FSH) steuert bei Frauen die Eibläschenreifung und bei Männern die Spermienbildung.",
      why: "Bei Zyklusstörungen, Kinderwunsch, Verdacht auf beginnende Wechseljahre oder bei Männern bei Fruchtbarkeitsfragen.",
      symptoms: "Hohe Werte bei Frauen gehen häufig mit unregelmäßigen Zyklen, Hitzewallungen oder Schlafstörungen einher.",
      meaning: "FSH schwankt im Zyklus; die Bestimmung am 2. bis 5. Zyklustag ist am aussagekräftigsten. Dauerhaft hohe Werte sprechen für eine nachlassende Eierstockfunktion.",
      next: "Zusammen mit LH, Estradiol und AMH gynäkologisch bzw. andrologisch einordnen.",
    },
    en: {
      what: "Follicle-stimulating hormone (FSH) controls follicle maturation in women and sperm production in men.",
      why: "With cycle disorders, wish for a child, suspected onset of menopause or, in men, fertility questions.",
      symptoms: "High values in women often go with irregular cycles, hot flushes or sleep problems.",
      meaning: "FSH varies across the cycle; sampling on cycle day 2 to 5 is most informative. Persistently high values indicate declining ovarian function.",
      next: "Interpret together with LH, estradiol and AMH with a gynaecologist or andrologist.",
    },
  },
  "LH (Lutropin)": {
    topic: "fertility",
    aliases: ["LH", "Lutropin", "LH (Luropin)", "LH (luropine)", "lutropin"],
    de: {
      what: "Das luteinisierende Hormon (LH) löst den Eisprung aus und regt bei Männern die Testosteronbildung an.",
      why: "Bei Zyklusstörungen, Kinderwunsch, PCO-Verdacht oder bei Männern zur Abklärung eines niedrigen Testosterons.",
      symptoms: "LH selbst verursacht keine Beschwerden; Auffälligkeiten zeigen sich über Zyklus oder Hormonmangel.",
      meaning: "LH schwankt stark im Zyklus mit einem Gipfel vor dem Eisprung. Ein erhöhtes LH/FSH-Verhältnis kann auf ein PCO-Syndrom hinweisen.",
      next: "Immer mit FSH, Estradiol bzw. Testosteron und dem Zyklustag bewerten.",
    },
    en: {
      what: "Luteinising hormone (LH) triggers ovulation and stimulates testosterone production in men.",
      why: "With cycle disorders, wish for a child, suspected PCOS or, in men, to clarify low testosterone.",
      symptoms: "LH itself causes no symptoms; abnormalities show up through the cycle or hormone deficiency.",
      meaning: "LH varies strongly across the cycle with a peak before ovulation. A raised LH/FSH ratio can point to PCOS.",
      next: "Always evaluate with FSH, estradiol or testosterone and the cycle day.",
    },
  },
  Estradiol: {
    topic: "fertility",
    aliases: ["Östradiol", "E2"],
    de: {
      what: "Estradiol ist das wirksamste Östrogen. Es steuert Zyklus, Gebärmutterschleimhaut, Knochendichte und wirkt auf Gefäße, Haut und Stimmung.",
      why: "Bei Zyklusstörungen, Kinderwunsch, Wechseljahresbeschwerden oder zur Einordnung von Knochengesundheit.",
      symptoms: "Niedrige Werte: Hitzewallungen, trockene Schleimhäute, Schlafstörungen. Hohe Werte: Spannungsgefühl in der Brust, Wassereinlagerungen.",
      meaning: "Estradiol schwankt im Zyklus erheblich; der Zyklustag ist für die Bewertung entscheidend. In den Wechseljahren fällt der Wert dauerhaft ab.",
      next: "Gynäkologisch zusammen mit FSH, LH und Beschwerden bewerten.",
    },
    en: {
      what: "Estradiol is the most potent oestrogen. It controls the cycle, the uterine lining and bone density and acts on vessels, skin and mood.",
      why: "With cycle disorders, wish for a child, menopausal symptoms or to assess bone health.",
      symptoms: "Low values: hot flushes, dry mucous membranes, sleep problems. High values: breast tenderness, fluid retention.",
      meaning: "Estradiol varies considerably across the cycle; the cycle day is key for interpretation. In menopause the value falls permanently.",
      next: "Evaluate with a gynaecologist together with FSH, LH and symptoms.",
    },
  },

  /* ------------------------------------------------------------------ Schilddrüse */
  TSH: {
    topic: "thyroid",
    aliases: ["TSH (sensitiv)", "TSH (sensitive)", "Thyreotropin"],
    de: {
      what: "TSH ist das Steuerhormon der Schilddrüse aus der Hirnanhangsdrüse. Es ist der empfindlichste Einzelwert, um die Schilddrüsenfunktion zu beurteilen.",
      why: "Bei Müdigkeit, Gewichtsveränderung, Frieren oder Schwitzen, Herzklopfen, Haarausfall, Zyklusstörungen oder Kinderwunsch.",
      symptoms: "Erhöhtes TSH (Unterfunktion): Müdigkeit, Gewichtszunahme, Kälteempfindlichkeit, trockene Haut. Erniedrigtes TSH (Überfunktion): Unruhe, Herzrasen, Gewichtsverlust, Schwitzen.",
      meaning: "Der Referenzbereich liegt meist bei etwa 0,4 bis 4,0 mU/l. Leichte Abweichungen sind häufig und nicht immer behandlungsbedürftig; TSH reagiert gegenläufig zu den Schilddrüsenhormonen.",
      next: "Auffällige Werte mit FT4, FT3 und ggf. Antikörpern ärztlich einordnen und nach 6 bis 8 Wochen kontrollieren.",
    },
    en: {
      what: "TSH is the thyroid's control hormone from the pituitary gland. It is the most sensitive single value for assessing thyroid function.",
      why: "With fatigue, weight change, feeling cold or sweating, palpitations, hair loss, cycle disorders or wish for a child.",
      symptoms: "Raised TSH (underactive thyroid): fatigue, weight gain, sensitivity to cold, dry skin. Low TSH (overactive): restlessness, racing heart, weight loss, sweating.",
      meaning: "The reference range is usually about 0.4 to 4.0 mU/l. Mild deviations are common and not always need treatment; TSH moves opposite to the thyroid hormones.",
      next: "Have abnormal values interpreted with FT4, FT3 and possibly antibodies, and re-check after 6 to 8 weeks.",
    },
  },
  FT4: {
    topic: "thyroid",
    aliases: ["ft4", "freies Thyroxin"],
    de: {
      what: "FT4 ist das freie, nicht an Eiweiß gebundene Thyroxin, das Speicherhormon der Schilddrüse.",
      why: "Zusammen mit TSH, um eine Über- oder Unterfunktion zu bestätigen und ihren Schweregrad einzuschätzen.",
      symptoms: "Siehe TSH: Müdigkeit und Frieren bei Mangel, Unruhe und Herzrasen bei Überschuss.",
      meaning: "Erhöhtes TSH mit niedrigem FT4 bedeutet manifeste Unterfunktion; erhöhtes TSH mit normalem FT4 eine latente Form.",
      next: "Immer im Zusammenspiel mit TSH und FT3 bewerten; Therapieentscheidungen trifft die behandelnde Praxis.",
    },
    en: {
      what: "FT4 is free, non-protein-bound thyroxine, the thyroid's storage hormone.",
      why: "Together with TSH, to confirm an over- or underactive thyroid and gauge its severity.",
      symptoms: "See TSH: fatigue and feeling cold with deficiency, restlessness and racing heart with excess.",
      meaning: "Raised TSH with low FT4 means overt hypothyroidism; raised TSH with normal FT4 a latent form.",
      next: "Always interpret with TSH and FT3; treatment decisions rest with the treating practice.",
    },
  },
  FT3: {
    topic: "thyroid",
    aliases: ["ft3", "freies Trijodthyronin"],
    de: {
      what: "FT3 ist das freie Trijodthyronin, die stoffwechselaktive Form des Schilddrüsenhormons, die größtenteils aus FT4 entsteht.",
      why: "Zur Differenzierung von Schilddrüsenstörungen, insbesondere bei Verdacht auf Überfunktion oder unter Therapie.",
      symptoms: "Erhöhte Werte: Unruhe, Gewichtsverlust, Schwitzen, Zittern. Niedrige Werte treten auch bei schweren Allgemeinerkrankungen oder strengem Fasten auf.",
      meaning: "FT3 kann bei Kalorienrestriktion und Krankheit sinken, ohne dass die Schilddrüse erkrankt ist („Low-T3-Syndrom“).",
      next: "Zusammen mit TSH und FT4 ärztlich einordnen, nicht isoliert bewerten.",
    },
    en: {
      what: "FT3 is free triiodothyronine, the metabolically active form of thyroid hormone, mostly produced from FT4.",
      why: "To differentiate thyroid disorders, especially with suspected overactivity or under therapy.",
      symptoms: "Raised values: restlessness, weight loss, sweating, tremor. Low values also occur in severe illness or strict fasting.",
      meaning: "FT3 can fall with calorie restriction and illness without thyroid disease (“low T3 syndrome”).",
      next: "Interpret with TSH and FT4 medically, never in isolation.",
    },
  },
  "TPO-Antikörper (MAK)": {
    topic: "thyroid",
    aliases: ["TPO-Antikörper", "TPO antibodies", "TPO-AK", "MAK", "TPO-Antikörper (MAK", "TPO antibodies (MAK"],
    de: {
      what: "Antikörper gegen die Thyreoperoxidase (TPO) richten sich gegen ein Enzym der Schilddrüse. Sie sind der wichtigste Marker einer Autoimmun-Schilddrüsenentzündung (Hashimoto).",
      why: "Bei erhöhtem TSH, Schilddrüsenerkrankungen in der Familie, anderen Autoimmunerkrankungen oder Kinderwunsch.",
      symptoms: "Die Entzündung selbst ist meist schmerzlos; Beschwerden entstehen durch die resultierende Unterfunktion.",
      meaning: "Positive Antikörper zeigen eine Autoimmunreaktion an, bedeuten aber nicht automatisch eine Funktionsstörung. Etwa jede zehnte gesunde Person hat niedrig positive Werte.",
      next: "Bei positiven Antikörpern TSH regelmäßig kontrollieren, in der Schwangerschaft engmaschiger. Die Therapie richtet sich nach der Funktion, nicht nach der Antikörperhöhe.",
    },
    en: {
      what: "Antibodies against thyroid peroxidase (TPO) target an enzyme of the thyroid. They are the main marker of autoimmune thyroiditis (Hashimoto's).",
      why: "With raised TSH, thyroid disease in the family, other autoimmune diseases or wish for a child.",
      symptoms: "The inflammation itself is usually painless; symptoms arise from the resulting underactivity.",
      meaning: "Positive antibodies indicate an autoimmune reaction but do not automatically mean a functional disorder. About one in ten healthy people has low positive values.",
      next: "With positive antibodies, check TSH regularly, more closely in pregnancy. Treatment follows function, not antibody level.",
    },
  },

  /* ------------------------------------------------------------------ Niere */
  Kreatinin: {
    topic: "kidney",
    aliases: ["creatinine"],
    de: {
      what: "Kreatinin ist ein Abbauprodukt des Muskelstoffwechsels, das über die Nieren ausgeschieden wird. Aus dem Wert wird die Filtrationsleistung der Niere (eGFR) geschätzt.",
      why: "Bei Bluthochdruck, Diabetes, regelmäßiger Schmerzmitteleinnahme, Nierenerkrankungen in der Familie oder ab dem mittleren Alter als Vorsorge.",
      symptoms: "Eine eingeschränkte Nierenfunktion bleibt lange unbemerkt. Spätzeichen sind Wassereinlagerungen, Müdigkeit, Juckreiz oder schäumender Urin.",
      meaning: "Kreatinin hängt von der Muskelmasse ab: Muskulöse Menschen haben höhere, ältere oder zierliche Menschen niedrigere Normalwerte. Die eGFR ist aussagekräftiger als der Rohwert.",
      next: "Erhöhte Werte wiederholen und mit Urin-Albumin kombinieren (KDIGO). Ausreichend trinken, Blutdruck und Blutzucker gut einstellen.",
    },
    en: {
      what: "Creatinine is a breakdown product of muscle metabolism excreted by the kidneys. The kidney's filtration rate (eGFR) is estimated from it.",
      why: "With high blood pressure, diabetes, regular painkiller use, kidney disease in the family or as a check-up from middle age.",
      symptoms: "Reduced kidney function goes unnoticed for a long time. Late signs are fluid retention, fatigue, itching or foamy urine.",
      meaning: "Creatinine depends on muscle mass: muscular people have higher, older or slight people lower normal values. The eGFR is more informative than the raw value.",
      next: "Repeat raised values and combine with urine albumin (KDIGO). Drink enough, keep blood pressure and blood sugar well controlled.",
    },
  },
  Harnstoff: {
    topic: "kidney",
    aliases: ["urea", "Urea"],
    de: {
      what: "Harnstoff entsteht beim Abbau von Eiweiß in der Leber und wird über die Nieren ausgeschieden.",
      why: "Ergänzend zum Kreatinin zur Beurteilung der Nierenfunktion und des Flüssigkeitshaushalts.",
      symptoms: "Stark erhöhte Werte können mit Übelkeit, Müdigkeit und Appetitlosigkeit einhergehen.",
      meaning: "Harnstoff steigt bei eiweißreicher Ernährung, Flüssigkeitsmangel, Blutungen im Magen-Darm-Trakt und Nierenschwäche. Er ist weniger spezifisch als Kreatinin.",
      next: "Trinkmenge prüfen und den Wert zusammen mit Kreatinin und eGFR ärztlich einordnen.",
    },
    en: {
      what: "Urea is formed when protein is broken down in the liver and is excreted by the kidneys.",
      why: "In addition to creatinine, to assess kidney function and fluid balance.",
      symptoms: "Strongly raised values can go with nausea, fatigue and loss of appetite.",
      meaning: "Urea rises with a protein-rich diet, dehydration, gastrointestinal bleeding and kidney weakness. It is less specific than creatinine.",
      next: "Check fluid intake and have the value interpreted together with creatinine and eGFR.",
    },
  },
  Harnsäure: {
    topic: "kidney",
    aliases: ["uric acid"],
    de: {
      what: "Harnsäure ist das Endprodukt des Purinstoffwechsels. Hohe Werte können Kristalle in Gelenken (Gicht) oder Nierensteine bilden.",
      why: "Bei Gelenkschmerzen, Gicht in der Familie, Übergewicht, Bluthochdruck, hohem Alkohol- oder Fleischkonsum sowie unter Entwässerungsmitteln.",
      symptoms: "Ein Gichtanfall zeigt sich als plötzlich stark schmerzendes, gerötetes Gelenk, häufig am Großzeh. Erhöhte Werte ohne Anfall sind beschwerdefrei.",
      meaning: "Werte über etwa 6,8 mg/dl überschreiten die Löslichkeitsgrenze. Nicht jede Erhöhung führt zu Gicht, aber das Risiko steigt mit der Höhe.",
      next: "Weniger Alkohol (vor allem Bier), Fruchtzucker und Fleisch, Gewichtsreduktion, ausreichend trinken. Bei Gichtanfällen ärztliche Therapie.",
    },
    en: {
      what: "Uric acid is the end product of purine metabolism. High values can form crystals in joints (gout) or kidney stones.",
      why: "With joint pain, gout in the family, excess weight, high blood pressure, high alcohol or meat consumption and under diuretics.",
      symptoms: "A gout attack appears as a suddenly very painful, reddened joint, often the big toe. Raised values without an attack are symptom-free.",
      meaning: "Values above about 6.8 mg/dl exceed the solubility limit. Not every rise leads to gout, but the risk grows with the level.",
      next: "Less alcohol (especially beer), fructose and meat, weight loss, enough fluids. Medical therapy for gout attacks.",
    },
  },
  "Urin-Albumin-Kreatinin-Quotient": {
    topic: "kidney",
    aliases: ["Urin-Albumin-Kreatinin-Quotienten", "UACR", "Albumin-Kreatinin-Quotient", "urine albumin-creatinine ratio"],
    de: {
      what: "Der Albumin-Kreatinin-Quotient im Urin (UACR) misst, ob die Niere vermehrt Eiweiß verliert. Er ist der empfindlichste Frühmarker für einen Nierenschaden.",
      why: "Bei Diabetes und Bluthochdruck jährlich empfohlen (KDIGO), außerdem bei Herz-Kreislauf-Erkrankungen oder Nierenerkrankungen in der Familie.",
      symptoms: "Eine leichte Albuminurie ist beschwerdefrei. Schäumender Urin oder Wassereinlagerungen treten erst bei deutlichem Eiweißverlust auf.",
      meaning: "Unter 30 mg/g gilt als normal, 30 bis 300 mg/g als mäßig erhöht, über 300 mg/g als stark erhöht. Fieber, Sport und Harnwegsinfekte können den Wert vorübergehend erhöhen.",
      next: "Erhöhte Werte innerhalb von drei Monaten wiederholen. Eine gute Blutdruck- und Blutzuckereinstellung schützt die Niere nachweislich.",
    },
    en: {
      what: "The urine albumin-creatinine ratio (UACR) measures whether the kidney is losing more protein than normal. It is the most sensitive early marker of kidney damage.",
      why: "Recommended yearly with diabetes and high blood pressure (KDIGO), also with cardiovascular disease or kidney disease in the family.",
      symptoms: "Mild albuminuria is symptom-free. Foamy urine or fluid retention appear only with marked protein loss.",
      meaning: "Below 30 mg/g is normal, 30 to 300 mg/g moderately raised, above 300 mg/g severely raised. Fever, exercise and urinary infections can raise the value temporarily.",
      next: "Repeat raised values within three months. Good blood pressure and blood sugar control is proven to protect the kidney.",
    },
  },
  Natrium: {
    topic: "kidney",
    aliases: ["Sodium", "sodium"],
    de: {
      what: "Natrium ist der wichtigste Elektrolyt im Blut und steuert den Wasserhaushalt, den Blutdruck und die Erregbarkeit von Nerven und Muskeln.",
      why: "Bei Einnahme von Entwässerungsmitteln, hohem Flüssigkeitsverlust, Nieren- oder Herzerkrankungen sowie bei älteren Menschen.",
      symptoms: "Zu niedriges Natrium: Übelkeit, Verwirrtheit, Kopfschmerzen, Gangunsicherheit. Zu hohes Natrium: Durst, Unruhe, Verwirrtheit.",
      meaning: "Der Normbereich ist eng (etwa 135 bis 145 mmol/l). Abweichungen spiegeln meist eine Störung des Wasserhaushalts wider, nicht der Salzzufuhr.",
      next: "Deutliche Abweichungen zeitnah ärztlich abklären, besonders bei Beschwerden oder unter Medikamenten.",
    },
    en: {
      what: "Sodium is the main electrolyte in blood and controls water balance, blood pressure and the excitability of nerves and muscles.",
      why: "When taking diuretics, with high fluid loss, kidney or heart disease and in older people.",
      symptoms: "Low sodium: nausea, confusion, headache, unsteady gait. High sodium: thirst, restlessness, confusion.",
      meaning: "The normal range is narrow (about 135 to 145 mmol/l). Deviations usually reflect a disturbance of water balance, not of salt intake.",
      next: "Have marked deviations assessed promptly, especially with symptoms or under medication.",
    },
  },

  /* ------------------------------------------------------------------ Leber */
  GPT: {
    topic: "liver",
    aliases: ["ALT", "ALAT", "GPT (ALT)"],
    de: {
      what: "GPT (auch ALT) ist ein Enzym, das vor allem in Leberzellen vorkommt. Steigt es im Blut an, wurden Leberzellen geschädigt.",
      why: "Bei Übergewicht, erhöhten Blutfetten, Alkoholkonsum, Medikamenteneinnahme oder zur Vorsorge auf eine Fettleber, die etwa jeden vierten Erwachsenen betrifft.",
      symptoms: "Leberschäden verlaufen lange still. Müdigkeit, Druck im rechten Oberbauch oder Appetitlosigkeit sind unspezifische Hinweise.",
      meaning: "GPT ist leberspezifischer als GOT. Die häufigste Ursache leichter Erhöhungen ist die nicht-alkoholische Fettleber; auch Medikamente, Alkohol und Virushepatitis kommen infrage.",
      next: "Erhöhte Werte wiederholen und die Ursache abklären. Gewichtsreduktion, Alkoholverzicht und Bewegung normalisieren eine Fettleber häufig.",
    },
    en: {
      what: "GPT (also ALT) is an enzyme found mainly in liver cells. If it rises in the blood, liver cells have been damaged.",
      why: "With excess weight, raised blood lipids, alcohol use, medication or to screen for fatty liver, which affects about one in four adults.",
      symptoms: "Liver damage stays silent for a long time. Fatigue, pressure in the right upper abdomen or loss of appetite are unspecific signs.",
      meaning: "GPT is more liver-specific than GOT. The most common cause of mild rises is non-alcoholic fatty liver; medication, alcohol and viral hepatitis are other possibilities.",
      next: "Repeat raised values and clarify the cause. Weight loss, avoiding alcohol and exercise often normalise a fatty liver.",
    },
  },
  "Gamma-GT": {
    topic: "liver",
    aliases: ["gamma GT", "GGT", "γ-GT"],
    de: {
      what: "Die Gamma-Glutamyltransferase (GGT) ist ein Enzym der Gallenwege und Leberzellen. Sie reagiert empfindlich auf Alkohol, Medikamente und Gallenstau.",
      why: "Zur Beurteilung der Leber- und Gallenwegsgesundheit, insbesondere bei Alkoholkonsum, Medikamenteneinnahme oder Übergewicht.",
      symptoms: "Meist beschwerdefrei. Bei Gallenstau können Juckreiz, dunkler Urin oder heller Stuhl auftreten.",
      meaning: "GGT ist sehr empfindlich, aber wenig spezifisch: Erhöhungen kommen bei Fettleber, Alkohol, vielen Medikamenten und Gallenerkrankungen vor.",
      next: "Erhöhte Werte zusammen mit GPT, AP und Bilirubin einordnen; Alkoholpause und Gewichtsreduktion senken GGT häufig innerhalb weniger Wochen.",
    },
    en: {
      what: "Gamma-glutamyltransferase (GGT) is an enzyme of the bile ducts and liver cells. It reacts sensitively to alcohol, medication and bile congestion.",
      why: "To assess liver and bile duct health, especially with alcohol use, medication or excess weight.",
      symptoms: "Usually symptom-free. With bile congestion, itching, dark urine or pale stool can occur.",
      meaning: "GGT is very sensitive but not very specific: rises occur with fatty liver, alcohol, many medications and biliary disease.",
      next: "Interpret raised values with GPT, AP and bilirubin; an alcohol break and weight loss often lower GGT within a few weeks.",
    },
  },
  Bilirubin: {
    topic: "liver",
    aliases: ["bilirubin", "Gesamtbilirubin"],
    de: {
      what: "Bilirubin ist das Abbauprodukt des roten Blutfarbstoffs. Die Leber macht es wasserlöslich und scheidet es über die Galle aus.",
      why: "Zur Beurteilung von Leber, Gallenwegen und Blutabbau, z. B. bei Gelbfärbung der Haut oder Augen.",
      symptoms: "Deutlich erhöhte Werte färben Augenweiß und Haut gelb; Urin wird dunkel, Stuhl hell.",
      meaning: "Leichte Erhöhungen ohne weitere Auffälligkeiten sind oft ein harmloses Gilbert-Meulengracht-Syndrom, das rund 5 bis 10 % der Bevölkerung betrifft.",
      next: "Erhöhte Werte zusammen mit GPT, GGT, AP und Blutbild ärztlich einordnen.",
    },
    en: {
      what: "Bilirubin is the breakdown product of the red blood pigment. The liver makes it water-soluble and excretes it via bile.",
      why: "To assess liver, bile ducts and blood breakdown, e.g. with yellowing of skin or eyes.",
      symptoms: "Clearly raised values turn the whites of the eyes and skin yellow; urine darkens, stool lightens.",
      meaning: "Mild rises without other abnormalities are often harmless Gilbert's syndrome, which affects around 5 to 10 % of the population.",
      next: "Have raised values interpreted together with GPT, GGT, AP and blood count.",
    },
  },
  Albumin: {
    topic: "liver",
    aliases: ["albumin"],
    de: {
      what: "Albumin ist das häufigste Eiweiß im Blut. Es wird in der Leber gebildet, hält Flüssigkeit in den Gefäßen und transportiert Hormone und Medikamente.",
      why: "Zur Beurteilung von Leberfunktion, Ernährungszustand und Eiweißverlust über Niere oder Darm.",
      symptoms: "Niedrige Werte können zu Wassereinlagerungen in Beinen oder Bauch führen.",
      meaning: "Albumin sinkt bei Leberschwäche, Mangelernährung, chronischer Entzündung und Eiweißverlust. Erhöhte Werte entstehen meist durch Flüssigkeitsmangel.",
      next: "Niedrige Werte ärztlich abklären; Ursache und Ernährungszustand bestimmen das weitere Vorgehen.",
    },
    en: {
      what: "Albumin is the most abundant protein in blood. It is made in the liver, keeps fluid in the vessels and transports hormones and drugs.",
      why: "To assess liver function, nutritional status and protein loss via kidney or gut.",
      symptoms: "Low values can lead to fluid retention in the legs or abdomen.",
      meaning: "Albumin falls with liver weakness, malnutrition, chronic inflammation and protein loss. Raised values usually result from dehydration.",
      next: "Have low values assessed medically; the cause and nutritional status determine the next steps.",
    },
  },
  "Alkalische Phosphatase (AP)": {
    topic: "liver",
    aliases: ["Alkalische Phosphatase", "AP", "ALP", "alkaline phosphatase"],
    de: {
      what: "Die alkalische Phosphatase (AP) ist ein Enzym aus Leber, Gallenwegen und Knochen. Sie steigt bei Gallenstau und erhöhtem Knochenumbau.",
      why: "Zur Beurteilung von Gallenwegen und Knochenstoffwechsel, auch im Rahmen von Vorsorge- und Longevity-Profilen.",
      symptoms: "Meist keine. Bei Gallenstau können Juckreiz und Gelbfärbung auftreten, bei Knochenerkrankungen Knochenschmerzen.",
      meaning: "Bei Kindern, Jugendlichen und in der Schwangerschaft ist die AP natürlicherweise erhöht. Eine Erhöhung mit GGT spricht für die Leber, ohne GGT eher für den Knochen.",
      next: "Erhöhte Werte zusammen mit GGT, Bilirubin, Calcium und Vitamin D einordnen.",
    },
    en: {
      what: "Alkaline phosphatase (AP) is an enzyme from liver, bile ducts and bone. It rises with bile congestion and increased bone turnover.",
      why: "To assess bile ducts and bone metabolism, also within check-up and longevity profiles.",
      symptoms: "Usually none. With bile congestion, itching and jaundice can occur; with bone disease, bone pain.",
      meaning: "In children, adolescents and pregnancy AP is naturally raised. A rise together with GGT points to the liver, without GGT rather to bone.",
      next: "Interpret raised values together with GGT, bilirubin, calcium and vitamin D.",
    },
  },

  /* ------------------------------------------------------------------ Nährstoffe & Mineralstoffe */
  Ferritin: {
    topic: "nutrients",
    aliases: ["ferritin"],
    de: {
      what: "Ferritin ist das Speicherprotein für Eisen und zeigt den Füllstand der Eisenspeicher an. Es ist der beste Einzelwert, um einen Eisenmangel zu erkennen.",
      why: "Bei Müdigkeit, Haarausfall, Leistungsschwäche, starker Regelblutung, vegetarischer oder veganer Ernährung, Ausdauersport oder Schwangerschaftswunsch.",
      symptoms: "Eisenmangel: Erschöpfung, Blässe, Konzentrationsprobleme, brüchige Nägel, Haarausfall, Kurzatmigkeit bei Belastung.",
      meaning: "Ferritin unter 30 µg/l spricht für leere Eisenspeicher, auch ohne Blutarmut. Da Ferritin bei Entzündungen ansteigt, sollte es mit CRP bewertet werden. Sehr hohe Werte können auf Eisenüberladung oder Leberbelastung hinweisen.",
      next: "Eisenmangel ursächlich abklären (Blutverlust, Ernährung, Aufnahme) und gezielt ausgleichen; Eisenpräparate nur bei nachgewiesenem Mangel einnehmen.",
    },
    en: {
      what: "Ferritin is the storage protein for iron and shows how full the iron stores are. It is the best single value to detect iron deficiency.",
      why: "With fatigue, hair loss, poor performance, heavy periods, a vegetarian or vegan diet, endurance sport or when planning a pregnancy.",
      symptoms: "Iron deficiency: exhaustion, pallor, concentration problems, brittle nails, hair loss, breathlessness on exertion.",
      meaning: "Ferritin below 30 µg/l indicates empty iron stores, even without anaemia. Since ferritin rises with inflammation, it should be interpreted with CRP. Very high values can point to iron overload or liver strain.",
      next: "Clarify the cause of iron deficiency (blood loss, diet, absorption) and correct it specifically; take iron supplements only with a proven deficiency.",
    },
  },
  Hämoglobin: {
    topic: "blood",
    aliases: ["hemoglobin", "haemoglobin", "Hb"],
    de: {
      what: "Hämoglobin ist der rote Blutfarbstoff, der Sauerstoff transportiert. Ein niedriger Wert bedeutet Blutarmut (Anämie).",
      why: "Bei Müdigkeit, Blässe, Kurzatmigkeit, starker Regelblutung, veganer Ernährung oder chronischen Erkrankungen.",
      symptoms: "Anämie: Erschöpfung, Blässe, Herzklopfen, Schwindel, Kurzatmigkeit bei Belastung, Kälteempfindlichkeit.",
      meaning: "Die WHO definiert Anämie bei Frauen unter 12 g/dl, bei Männern unter 13 g/dl. Die häufigste Ursache ist Eisenmangel, auch Vitamin-B12- oder Folsäuremangel und chronische Erkrankungen kommen infrage.",
      next: "Niedrige Werte ärztlich abklären: Ferritin, Vitamin B12, Folsäure und ggf. Blutungsquellen prüfen.",
    },
    en: {
      what: "Haemoglobin is the red blood pigment that carries oxygen. A low value means anaemia.",
      why: "With fatigue, pallor, breathlessness, heavy periods, a vegan diet or chronic diseases.",
      symptoms: "Anaemia: exhaustion, pallor, palpitations, dizziness, breathlessness on exertion, sensitivity to cold.",
      meaning: "The WHO defines anaemia as below 12 g/dl in women and below 13 g/dl in men. The most common cause is iron deficiency; vitamin B12 or folate deficiency and chronic disease are other causes.",
      next: "Have low values assessed medically: check ferritin, vitamin B12, folate and possible sources of bleeding.",
    },
  },
  Folsäure: {
    topic: "vitamins",
    aliases: ["Folic acid", "folic acid", "Folat", "Vitamin B9"],
    de: {
      what: "Folsäure (Vitamin B9) wird für Zellteilung, Blutbildung und den Abbau von Homocystein benötigt.",
      why: "Bei Kinderwunsch und in der Frühschwangerschaft (Vorbeugung von Neuralrohrdefekten), bei einseitiger Ernährung, Alkoholkonsum oder bestimmten Medikamenten.",
      symptoms: "Mangel: Müdigkeit, Blutarmut mit vergrößerten roten Blutkörperchen, Zungenbrennen, Konzentrationsstörungen.",
      meaning: "Der Blutwert spiegelt die Zufuhr der letzten Wochen. Ein Folsäuremangel kann einen gleichzeitigen B12-Mangel verschleiern, deshalb beide Werte zusammen betrachten.",
      next: "Grünes Gemüse, Hülsenfrüchte und Vollkorn liefern Folat. Vor und in der Schwangerschaft werden 400 µg Folsäure täglich empfohlen (DGE).",
    },
    en: {
      what: "Folic acid (vitamin B9) is needed for cell division, blood formation and the breakdown of homocysteine.",
      why: "When planning a pregnancy and in early pregnancy (prevention of neural tube defects), with a one-sided diet, alcohol use or certain medications.",
      symptoms: "Deficiency: fatigue, anaemia with enlarged red blood cells, burning tongue, concentration problems.",
      meaning: "The blood value reflects intake over the past weeks. A folate deficiency can mask a concurrent B12 deficiency, so view both values together.",
      next: "Green vegetables, legumes and whole grains provide folate. Before and during pregnancy 400 µg folic acid daily is recommended.",
    },
  },
  "Vitamin B12": {
    topic: "vitamins",
    aliases: ["Holo TC", "HoloTC", "Holo-TC", "Transcobalamin", "transcobalamin", "Vitamin B12 (Transcobalamin)", "Holotranscobalamin"],
    title: { de: "Vitamin B12 (Holo-TC)", en: "Vitamin B12 (holo-TC)" },
    de: {
      what: "Vitamin B12 ist wichtig für Blutbildung, Nervensystem und Energiestoffwechsel. Holo-Transcobalamin (Holo-TC) ist die aktive, für Zellen verfügbare Form und zeigt einen Mangel früher an als das Gesamt-B12.",
      why: "Bei veganer oder vegetarischer Ernährung, im höheren Alter, bei Magen-Darm-Erkrankungen, nach Magenoperationen oder unter Metformin bzw. Säureblockern.",
      symptoms: "Ein Mangel entwickelt sich schleichend: Müdigkeit, Konzentrationsprobleme, Kribbeln oder Taubheit in Händen und Füßen, Blutarmut, Stimmungsveränderungen.",
      meaning: "Holo-TC unter etwa 35 pmol/l spricht für eine beginnende Unterversorgung. Da B12 nur in tierischen Lebensmitteln vorkommt, ist bei pflanzlicher Ernährung eine Supplementierung notwendig.",
      next: "Mangel ausgleichen (oral hochdosiert oder als Injektion) und die Ursache klären. Nervenschäden können bei langem Mangel bleiben, deshalb früh handeln.",
    },
    en: {
      what: "Vitamin B12 matters for blood formation, the nervous system and energy metabolism. Holo-transcobalamin (holo-TC) is the active form available to cells and shows a deficiency earlier than total B12.",
      why: "With a vegan or vegetarian diet, in older age, with gastrointestinal disease, after stomach surgery or under metformin or acid blockers.",
      symptoms: "A deficiency develops gradually: fatigue, concentration problems, tingling or numbness in hands and feet, anaemia, mood changes.",
      meaning: "Holo-TC below about 35 pmol/l indicates an emerging undersupply. Since B12 occurs only in animal foods, a plant-based diet requires supplementation.",
      next: "Correct the deficiency (high-dose oral or injection) and clarify the cause. Nerve damage can persist after long deficiency, so act early.",
    },
  },
  "Vitamin D": {
    topic: "vitamins",
    aliases: ["25-OH-Vitamin D3", "25-OH vitamin D3", "Vitamin D3", "25-OH-Vitamin D", "Vitamin D (25-OH)"],
    title: { de: "Vitamin D (25-OH)", en: "Vitamin D (25-OH)" },
    de: {
      what: "Vitamin D wird überwiegend in der Haut durch UV-B-Licht gebildet und wirkt als Hormon auf Knochen, Muskeln und Immunsystem. Gemessen wird die Speicherform 25-OH-Vitamin D.",
      why: "In den Wintermonaten, bei wenig Aufenthalt im Freien, dunklerer Haut, höherem Alter, Übergewicht oder Osteoporoserisiko. Laut RKI erreichen rund 30 % der Erwachsenen in Deutschland keine ausreichende Versorgung.",
      symptoms: "Ein Mangel bleibt oft unbemerkt. Möglich sind Müdigkeit, Muskelschwäche, Knochenschmerzen, Stimmungstiefs und häufige Infekte.",
      meaning: "Unter 30 nmol/l (12 ng/ml) gilt als Mangel, 30 bis 50 nmol/l als unzureichend, ab 50 nmol/l (20 ng/ml) als ausreichend für die Knochengesundheit (RKI/IOM). Sehr hohe Werte durch Überdosierung sind schädlich.",
      next: "Bei Mangel Dosierung ärztlich abstimmen (häufig 800 bis 2000 IE täglich), nach 8 bis 12 Wochen kontrollieren. Sommersonne auf Gesicht und Arme ergänzt die Versorgung.",
    },
    en: {
      what: "Vitamin D is mainly produced in the skin by UV-B light and acts as a hormone on bones, muscles and the immune system. The storage form 25-OH vitamin D is measured.",
      why: "In the winter months, with little time outdoors, darker skin, older age, excess weight or osteoporosis risk. According to the RKI, around 30 % of adults in Germany are not sufficiently supplied.",
      symptoms: "A deficiency often goes unnoticed. Fatigue, muscle weakness, bone pain, low mood and frequent infections are possible.",
      meaning: "Below 30 nmol/l (12 ng/ml) is deficient, 30 to 50 nmol/l insufficient, 50 nmol/l (20 ng/ml) or more sufficient for bone health (RKI/IOM). Very high values from overdosing are harmful.",
      next: "With a deficiency, agree the dose with a doctor (often 800 to 2000 IU daily) and re-check after 8 to 12 weeks. Summer sun on face and arms adds to the supply.",
    },
  },
  "Vitamin B6": {
    topic: "vitamins",
    aliases: ["Pyridoxalphosphat (PLP)", "Pyridoxalphosphat (PLP", "pyridoxal phosphate (PLP", "PLP", "Pyridoxin"],
    de: {
      what: "Vitamin B6 (gemessen als Pyridoxalphosphat, PLP) ist an über 100 Enzymreaktionen beteiligt, vor allem im Eiweiß- und Nervenstoffwechsel.",
      why: "Bei einseitiger Ernährung, hohem Alkoholkonsum, chronisch-entzündlichen Erkrankungen, Nierenschwäche oder unter bestimmten Medikamenten (z. B. Isoniazid, Antibabypille).",
      symptoms: "Mangel: Hautentzündungen, eingerissene Mundwinkel, Blutarmut, Reizbarkeit, Kribbeln. Überdosierung durch Präparate kann Nervenschäden auslösen.",
      meaning: "Ein Mangel ist bei ausgewogener Ernährung selten. Hohe Dosen aus Nahrungsergänzung (über 25 mg täglich dauerhaft) sind riskanter als ein leichter Mangel.",
      next: "Vollkorn, Hülsenfrüchte, Nüsse, Fisch und Geflügel liefern B6. Ergänzen nur bei nachgewiesenem Mangel und in moderater Dosis.",
    },
    en: {
      what: "Vitamin B6 (measured as pyridoxal phosphate, PLP) is involved in over 100 enzyme reactions, mainly in protein and nerve metabolism.",
      why: "With a one-sided diet, high alcohol use, chronic inflammatory disease, kidney weakness or under certain medications (e.g. isoniazid, oral contraceptives).",
      symptoms: "Deficiency: skin inflammation, cracked corners of the mouth, anaemia, irritability, tingling. Overdosing from supplements can cause nerve damage.",
      meaning: "A deficiency is rare with a balanced diet. High doses from supplements (over 25 mg daily long-term) are riskier than a mild deficiency.",
      next: "Whole grains, legumes, nuts, fish and poultry provide B6. Supplement only with a proven deficiency and in moderate doses.",
    },
  },
  "Vitamin B1": {
    topic: "vitamins",
    aliases: ["Thiamin (Vitamin B1)", "Thiamine (vitamin B1)", "Thiamin", "Thiamine"],
    de: {
      what: "Vitamin B1 (Thiamin) ist zentral für den Kohlenhydratstoffwechsel und die Funktion von Nerven und Herz.",
      why: "Bei hohem Alkoholkonsum, sehr einseitiger oder stark kalorienreduzierter Ernährung, nach bariatrischen Operationen, bei Dialyse oder anhaltendem Erbrechen.",
      symptoms: "Mangel: Müdigkeit, Reizbarkeit, Kribbeln und Schwäche in den Beinen, Herzklopfen; schwere Formen betreffen Herz und Gehirn.",
      meaning: "Der Körper speichert nur wenig Thiamin, daher entsteht ein Mangel bei unzureichender Zufuhr innerhalb weniger Wochen. Bei ausgewogener Ernährung ist er selten.",
      next: "Vollkorn, Hülsenfrüchte, Schweinefleisch und Nüsse liefern Thiamin. Bei Risikofaktoren oder Mangel gezielt ergänzen.",
    },
    en: {
      what: "Vitamin B1 (thiamine) is central to carbohydrate metabolism and the function of nerves and heart.",
      why: "With high alcohol use, a very one-sided or strongly calorie-reduced diet, after bariatric surgery, on dialysis or with persistent vomiting.",
      symptoms: "Deficiency: fatigue, irritability, tingling and weakness in the legs, palpitations; severe forms affect heart and brain.",
      meaning: "The body stores little thiamine, so a deficiency develops within weeks of insufficient intake. It is rare with a balanced diet.",
      next: "Whole grains, legumes, pork and nuts provide thiamine. Supplement specifically with risk factors or a deficiency.",
    },
  },
  Calcium: {
    topic: "nutrients",
    aliases: ["calcium", "Kalzium"],
    de: {
      what: "Calcium ist der wichtigste Mineralstoff für Knochen und Zähne und steuert Muskelkontraktion, Nervenleitung und Blutgerinnung.",
      why: "Bei Osteoporoserisiko, Nierensteinen, Schilddrüsen- oder Nebenschilddrüsenerkrankungen, Vitamin-D-Mangel oder unter Vitamin-D-Präparaten.",
      symptoms: "Niedrige Werte: Kribbeln, Muskelkrämpfe, Herzrhythmusstörungen. Hohe Werte: Durst, Verstopfung, Müdigkeit, Nierensteine.",
      meaning: "Der Blutspiegel wird eng reguliert und sagt wenig über die Knochendichte aus. Abweichungen weisen meist auf Störungen von Nebenschilddrüse, Vitamin D oder Niere hin.",
      next: "Abweichungen ärztlich abklären, oft zusammen mit Vitamin D, Phosphat und Parathormon.",
    },
    en: {
      what: "Calcium is the key mineral for bones and teeth and controls muscle contraction, nerve conduction and blood clotting.",
      why: "With osteoporosis risk, kidney stones, thyroid or parathyroid disease, vitamin D deficiency or while taking vitamin D supplements.",
      symptoms: "Low values: tingling, muscle cramps, heart rhythm disturbances. High values: thirst, constipation, fatigue, kidney stones.",
      meaning: "The blood level is tightly regulated and says little about bone density. Deviations usually point to disorders of the parathyroid, vitamin D or kidney.",
      next: "Have deviations assessed medically, often together with vitamin D, phosphate and parathyroid hormone.",
    },
  },
  Magnesium: {
    topic: "nutrients",
    aliases: ["magnesium"],
    de: {
      what: "Magnesium ist an über 300 Enzymreaktionen beteiligt und wichtig für Muskeln, Nerven, Herzrhythmus und Knochen.",
      why: "Bei Muskelkrämpfen, Herzrhythmusstörungen, Diabetes, hohem Alkoholkonsum, Durchfallerkrankungen oder Einnahme von Entwässerungsmitteln bzw. Säureblockern.",
      symptoms: "Mangel: Wadenkrämpfe, Muskelzucken, Herzstolpern, Müdigkeit, Reizbarkeit.",
      meaning: "Nur etwa 1 % des Magnesiums befindet sich im Blut; der Serumwert kann einen Mangel daher unterschätzen. Ein niedriger Wert ist jedoch aussagekräftig.",
      next: "Vollkorn, Nüsse, Hülsenfrüchte und grünes Gemüse liefern Magnesium. Bei Mangel ergänzen; bei Nierenschwäche nur nach Rücksprache.",
    },
    en: {
      what: "Magnesium is involved in over 300 enzyme reactions and matters for muscles, nerves, heart rhythm and bone.",
      why: "With muscle cramps, heart rhythm disturbances, diabetes, high alcohol use, diarrhoeal illness or diuretics and acid blockers.",
      symptoms: "Deficiency: calf cramps, muscle twitching, palpitations, fatigue, irritability.",
      meaning: "Only about 1 % of magnesium is in the blood, so the serum value can underestimate a deficiency. A low value, however, is meaningful.",
      next: "Whole grains, nuts, legumes and green vegetables provide magnesium. Supplement with a deficiency; with kidney weakness only after medical advice.",
    },
  },
  Zink: {
    topic: "nutrients",
    aliases: ["Zinc", "zinc"],
    de: {
      what: "Zink ist ein Spurenelement für Immunsystem, Wundheilung, Haut, Haare und Hormonbildung.",
      why: "Bei häufigen Infekten, schlechter Wundheilung, Haarausfall, veganer Ernährung, chronischen Darmerkrankungen oder Leistungssport.",
      symptoms: "Mangel: Infektanfälligkeit, Hautveränderungen, Haarausfall, Geschmacksstörungen, verzögerte Wundheilung.",
      meaning: "Der Blutwert schwankt mit Mahlzeiten und Entzündungen und spiegelt den Körperbestand nur grob wider. Dauerhaft hohe Zinkzufuhr kann einen Kupfermangel auslösen.",
      next: "Fleisch, Käse, Hülsenfrüchte und Nüsse liefern Zink. Ergänzung nur bei Mangel, zeitlich begrenzt und in moderater Dosis.",
    },
    en: {
      what: "Zinc is a trace element for the immune system, wound healing, skin, hair and hormone production.",
      why: "With frequent infections, poor wound healing, hair loss, a vegan diet, chronic bowel disease or competitive sport.",
      symptoms: "Deficiency: susceptibility to infection, skin changes, hair loss, taste disturbances, delayed wound healing.",
      meaning: "The blood value varies with meals and inflammation and reflects body stores only roughly. Long-term high zinc intake can cause copper deficiency.",
      next: "Meat, cheese, legumes and nuts provide zinc. Supplement only with a deficiency, for a limited time and in moderate doses.",
    },
  },
  Selen: {
    topic: "nutrients",
    aliases: ["Selenium", "selenium"],
    de: {
      what: "Selen ist ein Spurenelement für die Schilddrüsenhormon-Aktivierung, antioxidative Enzyme und das Immunsystem.",
      why: "Bei Schilddrüsenerkrankungen, veganer Ernährung (europäische Böden sind selenarm), chronisch-entzündlichen Darmerkrankungen oder Dialyse.",
      symptoms: "Mangel: Muskelschwäche, Infektanfälligkeit, brüchige Nägel, Haarausfall. Überversorgung: Knoblauchgeruch des Atems, Haarausfall, Nagelveränderungen.",
      meaning: "Der therapeutische Bereich ist schmal: Mangel und Überschuss liegen nah beieinander. Hohe Dauerdosen aus Präparaten sind nicht empfehlenswert.",
      next: "Paranüsse, Fisch, Eier und Fleisch liefern Selen. Ergänzung nur bei nachgewiesenem Mangel und kontrolliert.",
    },
    en: {
      what: "Selenium is a trace element for thyroid hormone activation, antioxidant enzymes and the immune system.",
      why: "With thyroid disease, a vegan diet (European soils are low in selenium), chronic inflammatory bowel disease or dialysis.",
      symptoms: "Deficiency: muscle weakness, susceptibility to infection, brittle nails, hair loss. Excess: garlic breath, hair loss, nail changes.",
      meaning: "The therapeutic range is narrow: deficiency and excess lie close together. High long-term doses from supplements are not advisable.",
      next: "Brazil nuts, fish, eggs and meat provide selenium. Supplement only with a proven deficiency and under monitoring.",
    },
  },
  Kupfer: {
    topic: "nutrients",
    aliases: ["Copper", "copper"],
    de: {
      what: "Kupfer ist ein Spurenelement für Blutbildung, Bindegewebe, Nervensystem und antioxidative Enzyme.",
      why: "Bei unklarer Blutarmut, hoher Zinkeinnahme, nach Magenoperationen oder bei Verdacht auf Kupferspeicherkrankheit.",
      symptoms: "Mangel: Blutarmut, Nervenstörungen, Infektanfälligkeit. Überschuss: Leberschäden, neurologische Symptome.",
      meaning: "Kupfer steigt bei Entzündungen, in der Schwangerschaft und unter Östrogenen an. Ein niedriger Wert ist bei hoher Zinkzufuhr typisch.",
      next: "Abweichungen ärztlich einordnen, insbesondere zusammen mit Zink und Blutbild.",
    },
    en: {
      what: "Copper is a trace element for blood formation, connective tissue, the nervous system and antioxidant enzymes.",
      why: "With unexplained anaemia, high zinc intake, after stomach surgery or with suspected copper storage disease.",
      symptoms: "Deficiency: anaemia, nerve disorders, susceptibility to infection. Excess: liver damage, neurological symptoms.",
      meaning: "Copper rises with inflammation, in pregnancy and under oestrogens. A low value is typical with high zinc intake.",
      next: "Have deviations interpreted medically, especially together with zinc and blood count.",
    },
  },
  Mangan: {
    topic: "nutrients",
    aliases: ["Manganese", "manganese"],
    de: {
      what: "Mangan ist ein Spurenelement für Knochenbildung, Kohlenhydratstoffwechsel und antioxidative Enzyme.",
      why: "Im Rahmen eines umfassenden Nährstoffprofils; ein isolierter Mangel ist bei normaler Ernährung sehr selten.",
      symptoms: "Mangel ist beim Menschen kaum beschrieben. Überschuss (meist beruflich oder durch Lebererkrankungen) kann Nervensystem und Bewegung beeinträchtigen.",
      meaning: "Der Blutwert hat eine begrenzte Aussagekraft; stark erhöhte Werte sollten abgeklärt werden.",
      next: "Vollkorn, Nüsse, Hülsenfrüchte und Tee decken den Bedarf. Eine Ergänzung ist in der Regel nicht nötig.",
    },
    en: {
      what: "Manganese is a trace element for bone formation, carbohydrate metabolism and antioxidant enzymes.",
      why: "As part of a comprehensive nutrient profile; an isolated deficiency is very rare with a normal diet.",
      symptoms: "Deficiency is barely described in humans. Excess (mostly occupational or from liver disease) can affect the nervous system and movement.",
      meaning: "The blood value has limited informative value; strongly raised values should be investigated.",
      next: "Whole grains, nuts, legumes and tea cover the need. Supplementation is usually unnecessary.",
    },
  },

  /* ------------------------------------------------------------------ Entzündung & Blutbild */
  CRP: {
    topic: "inflammation",
    aliases: ["CRP (C-reaktives Protein)", "C-reaktives Protein"],
    de: {
      what: "Das C-reaktive Protein (CRP) wird von der Leber bei Entzündungen gebildet. Es steigt innerhalb von Stunden an und fällt nach Abklingen schnell wieder ab.",
      why: "Bei Verdacht auf Infektion oder Entzündung, zur Verlaufskontrolle und als Teil von Herz-Kreislauf- und Longevity-Profilen.",
      symptoms: "CRP selbst verursacht keine Beschwerden; es begleitet Infekte, Verletzungen, Entzündungen und auch Übergewicht.",
      meaning: "Werte unter 5 mg/l gelten als normal. Starke Erhöhungen sprechen für bakterielle Infektionen oder akute Entzündungen; leichte Erhöhungen sind unspezifisch.",
      next: "Erhöhte Werte im Zusammenhang mit Beschwerden ärztlich einordnen und ggf. nach 1 bis 2 Wochen kontrollieren.",
    },
    en: {
      what: "C-reactive protein (CRP) is produced by the liver during inflammation. It rises within hours and falls quickly once the inflammation subsides.",
      why: "With suspected infection or inflammation, for follow-up and as part of cardiovascular and longevity profiles.",
      symptoms: "CRP itself causes no symptoms; it accompanies infections, injuries, inflammation and also excess weight.",
      meaning: "Values below 5 mg/l are normal. Strong rises indicate bacterial infection or acute inflammation; mild rises are unspecific.",
      next: "Have raised values interpreted in the context of symptoms and re-check after 1 to 2 weeks if needed.",
    },
  },
  "hs-CRP": {
    topic: "inflammation",
    aliases: ["hsCRP", "hochsensitives CRP"],
    de: {
      what: "Hochsensitives CRP (hs-CRP) misst sehr niedrige Entzündungsgrade, die mit dem Herz-Kreislauf-Risiko zusammenhängen („stille Entzündung“).",
      why: "Zur Verfeinerung der Herz-Kreislauf-Risikoabschätzung, bei Übergewicht, metabolischem Syndrom oder zur Verlaufskontrolle von Lebensstiländerungen.",
      symptoms: "Keine. Eine niedriggradige Entzündung ist nicht spürbar.",
      meaning: "Unter 1 mg/l gilt als niedriges, 1 bis 3 mg/l als mittleres, über 3 mg/l als hohes kardiovaskuläres Zusatzrisiko (AHA/CDC). Akute Infekte verfälschen den Wert; dann einige Wochen später wiederholen.",
      next: "Gewichtsreduktion, Bewegung, Schlaf und Rauchstopp senken hs-CRP. Den Wert zusammen mit Lipiden und Blutdruck ärztlich einordnen.",
    },
    en: {
      what: "High-sensitivity CRP (hs-CRP) measures very low levels of inflammation linked to cardiovascular risk (“silent inflammation”).",
      why: "To refine cardiovascular risk assessment, with excess weight, metabolic syndrome or to follow lifestyle changes.",
      symptoms: "None. Low-grade inflammation is not felt.",
      meaning: "Below 1 mg/l is low, 1 to 3 mg/l intermediate, above 3 mg/l high additional cardiovascular risk (AHA/CDC). Acute infections distort the value; repeat a few weeks later.",
      next: "Weight loss, exercise, sleep and quitting smoking lower hs-CRP. Interpret the value with lipids and blood pressure.",
    },
  },
  Leukozyten: {
    topic: "blood",
    aliases: ["Leukocytes", "white blood cells", "weiße Blutkörperchen"],
    de: {
      what: "Leukozyten sind die weißen Blutkörperchen und Teil der Immunabwehr. Ihre Zahl steigt bei Infektionen und Entzündungen.",
      why: "Zur Beurteilung von Immunsystem, Infektionen und als Teil des Blutbilds in Vorsorge- und Longevity-Profilen.",
      symptoms: "Erhöhte Werte begleiten Infekte, Stress oder Rauchen; sehr niedrige Werte erhöhen die Infektanfälligkeit.",
      meaning: "Der Normbereich liegt bei etwa 4 bis 10 Tausend pro µl. Chronisch leicht erhöhte Werte sind mit Entzündungslast und Herz-Kreislauf-Risiko assoziiert.",
      next: "Deutliche oder anhaltende Abweichungen mit Differenzialblutbild ärztlich abklären.",
    },
    en: {
      what: "Leukocytes are the white blood cells and part of the immune defence. Their number rises with infections and inflammation.",
      why: "To assess the immune system and infections and as part of the blood count in check-up and longevity profiles.",
      symptoms: "Raised values accompany infections, stress or smoking; very low values increase susceptibility to infection.",
      meaning: "The normal range is about 4 to 10 thousand per µl. Chronically slightly raised values are associated with inflammatory burden and cardiovascular risk.",
      next: "Have marked or persistent deviations assessed with a differential blood count.",
    },
  },
  "Lymphozyten-Anteil": {
    topic: "longevity",
    aliases: ["Lymphozyten", "lymphocyte percentage", "Lymphocytes"],
    de: {
      what: "Lymphozyten sind die Immunzellen der spezifischen Abwehr (T- und B-Zellen). Ihr Anteil an den weißen Blutkörperchen ist ein Marker für Immunalter und Entzündungslast.",
      why: "Teil des biologischen Alters-Profils (PhenoAge): Ein sinkender Lymphozytenanteil ist mit beschleunigter Alterung assoziiert.",
      symptoms: "Keine direkten Beschwerden. Niedrige Anteile gehen mit erhöhter Infektanfälligkeit einher.",
      meaning: "Der Anteil liegt normalerweise bei etwa 20 bis 40 %. Akute Infekte, Stress und Kortison verschieben ihn vorübergehend.",
      next: "Isoliert wenig aussagekräftig; im Gesamtbild mit CRP, Blutbild und Lebensstilfaktoren bewerten.",
    },
    en: {
      what: "Lymphocytes are the immune cells of specific defence (T and B cells). Their share of white blood cells is a marker of immune age and inflammatory burden.",
      why: "Part of the biological age profile (PhenoAge): a falling lymphocyte share is associated with accelerated ageing.",
      symptoms: "No direct symptoms. Low shares go with increased susceptibility to infection.",
      meaning: "The share is normally about 20 to 40 %. Acute infections, stress and cortisone shift it temporarily.",
      next: "Of limited value in isolation; evaluate in the overall picture with CRP, blood count and lifestyle factors.",
    },
  },
  "MCV (mittleres Erythrozytenvolumen)": {
    topic: "longevity",
    aliases: ["MCV", "mean corpuscular volume"],
    de: {
      what: "Das MCV gibt die durchschnittliche Größe der roten Blutkörperchen an und hilft, Ursachen einer Blutarmut zu unterscheiden.",
      why: "Im Blutbild und im biologischen Alters-Profil: Ein steigendes MCV ist mit Alterungsprozessen, Alkohol und B12-/Folsäuremangel assoziiert.",
      symptoms: "Keine eigenen Beschwerden; Auffälligkeiten zeigen sich über die zugrunde liegende Ursache.",
      meaning: "Kleine Zellen (niedriges MCV) sprechen für Eisenmangel, große Zellen (hohes MCV) für B12- oder Folsäuremangel, Alkohol oder Lebererkrankungen.",
      next: "Abweichungen zusammen mit Hämoglobin, Ferritin, B12 und Folsäure ärztlich einordnen.",
    },
    en: {
      what: "MCV indicates the average size of red blood cells and helps distinguish causes of anaemia.",
      why: "In the blood count and the biological age profile: a rising MCV is associated with ageing, alcohol and B12/folate deficiency.",
      symptoms: "No symptoms of its own; abnormalities show through the underlying cause.",
      meaning: "Small cells (low MCV) point to iron deficiency, large cells (high MCV) to B12 or folate deficiency, alcohol or liver disease.",
      next: "Interpret deviations with haemoglobin, ferritin, B12 and folate.",
    },
  },
  "RDW (Erythrozyten-Verteilungsbreite)": {
    topic: "longevity",
    aliases: ["RDW", "red cell distribution width"],
    de: {
      what: "Die RDW beschreibt, wie unterschiedlich groß die roten Blutkörperchen sind. Eine hohe Streuung ist ein unspezifischer, aber robuster Marker für Belastung des Organismus.",
      why: "Im biologischen Alters-Profil: Eine hohe RDW ist in großen Studien mit höherer Sterblichkeit und Herz-Kreislauf-Risiko assoziiert, unabhängig von Blutarmut.",
      symptoms: "Keine. Die RDW ist ein reiner Laborparameter.",
      meaning: "Erhöhte Werte treten bei Eisen-, B12- oder Folsäuremangel, nach Blutverlust, bei Entzündung und Lebererkrankungen auf.",
      next: "Erhöhte RDW mit MCV, Ferritin, B12 und Folsäure einordnen; Nährstoffmängel ausgleichen.",
    },
    en: {
      what: "RDW describes how much red blood cells vary in size. High variation is an unspecific but robust marker of strain on the organism.",
      why: "In the biological age profile: high RDW is associated with higher mortality and cardiovascular risk in large studies, independent of anaemia.",
      symptoms: "None. RDW is a pure laboratory parameter.",
      meaning: "Raised values occur with iron, B12 or folate deficiency, after blood loss, with inflammation and liver disease.",
      next: "Interpret raised RDW with MCV, ferritin, B12 and folate; correct nutrient deficiencies.",
    },
  },
  Kreatinkinase: {
    topic: "blood",
    aliases: ["Creatine kinase", "CK"],
    de: {
      what: "Die Kreatinkinase (CK) ist ein Enzym der Muskelzellen. Sie steigt im Blut an, wenn Muskelfasern beansprucht oder geschädigt werden.",
      why: "Im Sport zur Beurteilung von Belastung und Regeneration, bei Muskelschmerzen, unter Statinen oder bei Verdacht auf Muskelerkrankungen.",
      symptoms: "Erhöhte Werte gehen oft mit Muskelkater, Muskelschwäche oder Schmerzen einher; sehr hohe Werte können den Urin dunkel färben.",
      meaning: "Nach intensivem Training ist CK für 2 bis 4 Tage erhöht, das ist normal. Dauerhaft hohe Werte in Ruhe oder extreme Anstiege sollten abgeklärt werden.",
      next: "Vor der Blutentnahme 2 bis 3 Tage auf intensives Training verzichten. Bei anhaltend hohen Werten ärztlich abklären, besonders unter Statinen.",
    },
    en: {
      what: "Creatine kinase (CK) is an enzyme of muscle cells. It rises in the blood when muscle fibres are stressed or damaged.",
      why: "In sport to assess load and recovery, with muscle pain, under statins or with suspected muscle disease.",
      symptoms: "Raised values often go with muscle soreness, weakness or pain; very high values can darken the urine.",
      meaning: "After intense training CK is raised for 2 to 4 days, which is normal. Persistently high values at rest or extreme rises should be investigated.",
      next: "Avoid intense training 2 to 3 days before sampling. Have persistently high values assessed, especially under statins.",
    },
  },

  /* ------------------------------------------------------------------ Prostata / Vorsorge */
  PSA: {
    topic: "prostate",
    aliases: ["prostataspezifisches Antigen", "PSA (prostataspezifisches Antigen)"],
    de: {
      what: "Das prostataspezifische Antigen (PSA) ist ein Eiweiß der Prostata. Erhöhte Werte können auf Prostatakrebs, aber auch auf gutartige Vergrößerung oder Entzündung hinweisen.",
      why: "Als individuelle Früherkennung ab 45 Jahren, bei familiärer Belastung ab 40 Jahren, nach Aufklärung über Nutzen und Risiken (S3-Leitlinie).",
      symptoms: "Prostatakrebs verursacht im Frühstadium keine Beschwerden. Häufiger Harndrang oder schwacher Strahl sprechen eher für eine gutartige Vergrößerung.",
      meaning: "Ein PSA unter 1 ng/ml im Alter von 45 bis 50 erlaubt lange Kontrollintervalle. Werte über 4 ng/ml oder ein schneller Anstieg sollten abgeklärt werden. Ejakulation, Radfahren und Entzündungen erhöhen den Wert vorübergehend.",
      next: "Erhöhte Werte nach einigen Wochen wiederholen und urologisch abklären (MRT, ggf. Biopsie). Ein einzelner Wert ist keine Diagnose.",
    },
    en: {
      what: "Prostate-specific antigen (PSA) is a protein of the prostate. Raised values can indicate prostate cancer but also benign enlargement or inflammation.",
      why: "As individual early detection from age 45, with family history from 40, after being informed about benefits and risks.",
      symptoms: "Early prostate cancer causes no symptoms. Frequent urination or a weak stream rather suggest benign enlargement.",
      meaning: "A PSA below 1 ng/ml at age 45 to 50 allows long check intervals. Values above 4 ng/ml or a rapid rise should be investigated. Ejaculation, cycling and inflammation raise the value temporarily.",
      next: "Repeat raised values after a few weeks and have them assessed by urology (MRI, biopsy if needed). A single value is not a diagnosis.",
    },
  },
  "Blut im Stuhl": {
    topic: "bowel",
    aliases: ["Blood in stool", "iFOBT", "immunologischer Stuhltest", "okkultes Blut"],
    title: { de: "Verstecktes Blut im Stuhl (iFOBT)", en: "Hidden blood in stool (FIT)" },
    de: {
      what: "Der immunologische Stuhltest (iFOBT/FIT) weist kleinste, unsichtbare Blutmengen im Stuhl nach, wie sie von Darmpolypen oder Tumoren abgegeben werden können.",
      why: "Als Darmkrebsvorsorge empfohlen ab 50 Jahren jährlich bzw. alle zwei Jahre, bei familiärer Belastung früher. Die Darmspiegelung bleibt der Goldstandard.",
      symptoms: "Darmkrebs und Polypen verursachen lange keine Beschwerden. Veränderte Stuhlgewohnheiten, sichtbares Blut oder Gewichtsverlust gehören direkt ärztlich abgeklärt.",
      meaning: "Ein negativer Test schließt Darmkrebs nicht vollständig aus. Ein positiver Test bedeutet nicht Krebs: Hämorrhoiden und Entzündungen sind häufige Ursachen, erfordern aber eine Darmspiegelung zur Klärung.",
      next: "Bei positivem Ergebnis zeitnah eine Darmspiegelung vereinbaren. Bei negativem Ergebnis den Test regelmäßig wiederholen.",
    },
    en: {
      what: "The immunological stool test (FIT) detects tiny, invisible amounts of blood in stool, as can be released by bowel polyps or tumours.",
      why: "Recommended as bowel cancer screening from age 50 yearly or every two years, earlier with family history. Colonoscopy remains the gold standard.",
      symptoms: "Bowel cancer and polyps cause no symptoms for a long time. Changed bowel habits, visible blood or weight loss need direct medical assessment.",
      meaning: "A negative test does not fully exclude bowel cancer. A positive test does not mean cancer: haemorrhoids and inflammation are common causes, but a colonoscopy is needed to clarify.",
      next: "With a positive result, arrange a colonoscopy promptly. With a negative result, repeat the test regularly.",
    },
  },
  "DNA-Stuhltest (ColoAlert)": {
    topic: "bowel",
    aliases: ["Darmkrebsvorsorge", "Colorectal Cancer Prevention", "ColoAlert"],
    de: {
      what: "ColoAlert kombiniert den Nachweis von verstecktem Blut mit der Analyse von Tumor-DNA im Stuhl (u. a. KRAS- und BRAF-Mutationen sowie DNA-Menge).",
      why: "Als Vorsorgeoption für Menschen, die eine Darmspiegelung scheuen oder das Intervall zwischen zwei Spiegelungen überbrücken möchten.",
      symptoms: "Darmkrebs verläuft lange ohne Beschwerden; deshalb ist die Vorsorge bei Gesunden so wichtig.",
      meaning: "Die Kombination erhöht die Empfindlichkeit gegenüber dem reinen Bluttest. Ein auffälliges Ergebnis ist keine Diagnose, sondern ein Hinweis, der eine Darmspiegelung erfordert.",
      next: "Auffällige Befunde gastroenterologisch abklären. Unauffällige Ergebnisse ersetzen die leitliniengerechte Vorsorge nicht dauerhaft.",
    },
    en: {
      what: "ColoAlert combines the detection of hidden blood with analysis of tumour DNA in stool (including KRAS and BRAF mutations and DNA quantity).",
      why: "As a screening option for people who avoid colonoscopy or want to bridge the interval between two colonoscopies.",
      symptoms: "Bowel cancer runs without symptoms for a long time; this is why screening healthy people matters.",
      meaning: "The combination increases sensitivity compared with the blood test alone. An abnormal result is not a diagnosis but a signal that requires a colonoscopy.",
      next: "Have abnormal findings assessed by gastroenterology. Normal results do not permanently replace guideline-based screening.",
    },
  },

  /* ------------------------------------------------------------------ Darm */
  "Methan-Atemtest (IMO)": {
    topic: "gut",
    aliases: ["Blähungen", "Verdauungsbeschwerden", "Bauchschmerzen & Krämpfe", "Verstopfung", "IMO", "bloating", "digestive complaints", "indigestion", "abdominal pain & cramps", "abdominal pain &amp", "cramps", "constipation", "flatulence"],
    de: {
      what: "Der Atemtest misst Methan, das von Archaeen im Darm gebildet wird. Eine Überwucherung (IMO, intestinal methanogen overgrowth) wird mit Verstopfung und Blähungen in Verbindung gebracht.",
      why: "Bei chronischen Blähungen, Völlegefühl, Verstopfung oder Reizdarmbeschwerden, wenn andere Ursachen ärztlich ausgeschlossen wurden.",
      symptoms: "Blähbauch, Krämpfe, träge Verdauung, Verstopfung, wechselnde Stuhlgewohnheiten.",
      meaning: "Ein Methanwert ab 10 ppm in der Atemluft gilt nach dem nordamerikanischen Konsensus als positiv. Der Test ergänzt, ersetzt aber nicht die gastroenterologische Abklärung.",
      next: "Positive Ergebnisse mit einer Ärztin oder einem Arzt besprechen; Ernährungsumstellung und gezielte Therapie können die Beschwerden lindern.",
    },
    en: {
      what: "The breath test measures methane produced by archaea in the gut. An overgrowth (IMO, intestinal methanogen overgrowth) is linked to constipation and bloating.",
      why: "With chronic bloating, fullness, constipation or irritable bowel symptoms, once other causes have been medically excluded.",
      symptoms: "Distended abdomen, cramps, sluggish digestion, constipation, changing bowel habits.",
      meaning: "A methane value of 10 ppm or more in breath is considered positive by the North American consensus. The test complements but does not replace gastroenterological assessment.",
      next: "Discuss positive results with a doctor; dietary changes and targeted therapy can ease symptoms.",
    },
  },
  "Zonulin (Stuhl)": {
    topic: "gut",
    aliases: ["Zonulin"],
    de: {
      what: "Zonulin ist ein Eiweiß, das die Verbindungen zwischen Darmzellen lockert. Erhöhte Werte im Stuhl werden als Hinweis auf eine erhöhte Durchlässigkeit der Darmschleimhaut gewertet.",
      why: "Bei Reizdarmbeschwerden, Nahrungsmittelunverträglichkeiten oder chronischen Entzündungen zur ergänzenden Einordnung.",
      symptoms: "Blähungen, Durchfall, Bauchschmerzen, Unverträglichkeiten; die Zuordnung zu Zonulin ist nicht eindeutig.",
      meaning: "Die wissenschaftliche Evidenz ist begrenzt: Zonulin-Tests sind methodisch umstritten, und „Leaky Gut“ ist keine anerkannte eigenständige Diagnose. Der Wert dient der Orientierung, nicht der Diagnose.",
      next: "Erhöhte Werte nicht isoliert behandeln. Beschwerden gastroenterologisch abklären (z. B. Zöliakie, chronisch-entzündliche Darmerkrankungen).",
    },
    en: {
      what: "Zonulin is a protein that loosens the connections between gut cells. Raised stool values are read as a hint of increased intestinal permeability.",
      why: "With irritable bowel symptoms, food intolerances or chronic inflammation, as an additional orientation.",
      symptoms: "Bloating, diarrhoea, abdominal pain, intolerances; their link to zonulin is not clear-cut.",
      meaning: "Scientific evidence is limited: zonulin tests are methodologically disputed and “leaky gut” is not a recognised diagnosis in its own right. The value serves orientation, not diagnosis.",
      next: "Do not treat raised values in isolation. Have symptoms assessed by gastroenterology (e.g. coeliac disease, inflammatory bowel disease).",
    },
  },
  "α1-Antitrypsin (Stuhl)": {
    topic: "gut",
    aliases: ["Alpha-1-Antitrypsin", "α1-Antitrypsin", "alpha-1 antitrypsin"],
    de: {
      what: "α1-Antitrypsin ist ein Eiweiß aus dem Blut. Taucht es vermehrt im Stuhl auf, geht Eiweiß über die Darmschleimhaut verloren, ein Zeichen für Entzündung oder erhöhte Durchlässigkeit.",
      why: "Bei chronischem Durchfall, unklarem Eiweißmangel oder Verdacht auf entzündliche Darmerkrankungen.",
      symptoms: "Durchfall, Wassereinlagerungen, Gewichtsverlust bei ausgeprägtem Eiweißverlust.",
      meaning: "Erhöhte Werte sind ein etablierter Marker für enteralen Eiweißverlust, z. B. bei Morbus Crohn, Zöliakie oder Infektionen. Leicht erhöhte Werte sind unspezifisch.",
      next: "Auffällige Werte gastroenterologisch abklären, oft zusammen mit Calprotectin und Blutwerten.",
    },
    en: {
      what: "α1-antitrypsin is a protein from blood. If it appears in increased amounts in stool, protein is being lost through the gut lining, a sign of inflammation or increased permeability.",
      why: "With chronic diarrhoea, unexplained protein deficiency or suspected inflammatory bowel disease.",
      symptoms: "Diarrhoea, fluid retention, weight loss with marked protein loss.",
      meaning: "Raised values are an established marker of enteric protein loss, e.g. in Crohn's disease, coeliac disease or infections. Mildly raised values are unspecific.",
      next: "Have abnormal values assessed by gastroenterology, often together with calprotectin and blood values.",
    },
  },

  /* ------------------------------------------------------------------ Allergene (Gruppen) */
  Pollen: {
    topic: "allergy",
    de: {
      what: "Getestet werden spezifische IgE-Antikörper gegen Pollen von Bäumen (z. B. Birke, Hasel, Erle), Gräsern und Kräutern (z. B. Beifuß, Ambrosia).",
      why: "Bei saisonalem Schnupfen, juckenden Augen, Niesen oder Asthma im Frühjahr und Sommer.",
      symptoms: "Fließschnupfen, verstopfte Nase, tränende Augen, Husten oder Atemnot zur Pollenflugzeit; häufig Kreuzreaktionen mit Obst und Nüssen.",
      meaning: "Ein IgE-Nachweis zeigt eine Sensibilisierung. Ob sie Beschwerden verursacht, entscheidet sich zusammen mit der Krankengeschichte, nicht allein durch den Laborwert.",
      next: "Befund allergologisch einordnen. Eine Hyposensibilisierung kann bei Pollenallergie die Beschwerden langfristig lindern.",
    },
    en: {
      what: "Specific IgE antibodies against pollen from trees (e.g. birch, hazel, alder), grasses and weeds (e.g. mugwort, ragweed) are tested.",
      why: "With seasonal sneezing, itchy eyes, runny nose or asthma in spring and summer.",
      symptoms: "Runny or blocked nose, watery eyes, cough or breathlessness during pollen season; often cross-reactions with fruit and nuts.",
      meaning: "A positive IgE shows sensitisation. Whether it causes symptoms is decided together with the medical history, not by the lab value alone.",
      next: "Have the result interpreted by an allergist. Immunotherapy can relieve pollen allergy symptoms long term.",
    },
  },
  Milben: {
    topic: "allergy",
    aliases: ["mites", "Hausstaubmilben"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen Hausstaubmilben und Vorratsmilben, die in Matratzen, Polstern und Teppichen leben.",
      why: "Bei ganzjährigem Schnupfen, morgendlichem Niesen, verstopfter Nase im Schlafzimmer oder nächtlichem Husten.",
      symptoms: "Beschwerden sind das ganze Jahr vorhanden, nachts und morgens am stärksten; auch Neurodermitis-Schübe und Asthma sind möglich.",
      meaning: "Milbenallergie ist nach Pollen die zweithäufigste Inhalationsallergie. Der IgE-Nachweis belegt eine Sensibilisierung, die klinische Relevanz prüft die Allergologie.",
      next: "Milbendichte Bettbezüge, regelmäßiges Lüften und Waschen bei 60 °C reduzieren die Belastung; eine Hyposensibilisierung ist möglich.",
    },
    en: {
      what: "IgE antibodies against house dust mites and storage mites, which live in mattresses, upholstery and carpets, are tested.",
      why: "With year-round rhinitis, morning sneezing, a blocked nose in the bedroom or night-time cough.",
      symptoms: "Symptoms persist all year, strongest at night and in the morning; eczema flares and asthma are also possible.",
      meaning: "Mite allergy is the second most common inhalant allergy after pollen. A positive IgE proves sensitisation; clinical relevance is assessed by an allergist.",
      next: "Mite-proof bedding covers, regular airing and washing at 60 °C reduce exposure; immunotherapy is possible.",
    },
  },
  "Pflanzliche Nahrungsmittel": {
    topic: "allergy",
    aliases: ["plant-based foods"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen pflanzliche Lebensmittel wie Nüsse, Erdnuss, Soja, Weizen, Obst, Gemüse und Gewürze.",
      why: "Bei Kribbeln im Mund, Schwellungen, Nesselsucht, Bauchbeschwerden oder Atemnot nach dem Essen.",
      symptoms: "Vom Jucken an Lippen und Gaumen (orales Allergiesyndrom) bis zu schweren Reaktionen wie Atemnot oder Kreislaufproblemen.",
      meaning: "Viele positive Befunde beruhen auf Kreuzreaktionen mit Pollen und sind klinisch harmlos. Ein IgE-Nachweis allein rechtfertigt keine Diät.",
      next: "Befund allergologisch einordnen, bei Bedarf mit Provokationstest. Bei schweren Reaktionen Notfallset verordnen lassen.",
    },
    en: {
      what: "IgE antibodies against plant foods such as nuts, peanut, soy, wheat, fruit, vegetables and spices are tested.",
      why: "With tingling in the mouth, swelling, hives, abdominal symptoms or breathlessness after eating.",
      symptoms: "From itching of lips and palate (oral allergy syndrome) to severe reactions such as breathlessness or circulatory problems.",
      meaning: "Many positive results are due to cross-reactions with pollen and are clinically harmless. A positive IgE alone does not justify a diet.",
      next: "Have the result interpreted by an allergist, with a challenge test if needed. With severe reactions, obtain an emergency kit.",
    },
  },
  "Tierische Nahrungsmittel": {
    topic: "allergy",
    aliases: ["animal-based foods"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen tierische Lebensmittel wie Kuhmilch, Hühnerei, Fisch, Krusten- und Schalentiere sowie Fleisch.",
      why: "Bei Beschwerden nach dem Verzehr tierischer Lebensmittel, Nesselsucht, Erbrechen oder Atemnot.",
      symptoms: "Hautreaktionen, Übelkeit, Erbrochen, Durchfall, Atemnot; Fisch- und Schalentierallergien bleiben meist lebenslang bestehen.",
      meaning: "Bei Erwachsenen sind Fisch- und Schalentierallergien häufiger als Milch- oder Eiallergie. Eine Laktoseintoleranz ist keine Allergie und wird hier nicht erfasst.",
      next: "Positive Befunde allergologisch bestätigen lassen und erst dann Lebensmittel meiden, um unnötige Diäten zu vermeiden.",
    },
    en: {
      what: "IgE antibodies against animal foods such as cow's milk, hen's egg, fish, crustaceans and shellfish and meat are tested.",
      why: "With symptoms after eating animal foods, hives, vomiting or breathlessness.",
      symptoms: "Skin reactions, nausea, vomiting, diarrhoea, breathlessness; fish and shellfish allergies usually persist for life.",
      meaning: "In adults, fish and shellfish allergies are more common than milk or egg allergy. Lactose intolerance is not an allergy and is not captured here.",
      next: "Have positive results confirmed by an allergist before avoiding foods, to prevent unnecessary diets.",
    },
  },
  "Schimmel- und Hefepilze": {
    topic: "allergy",
    aliases: ["molds and yeasts", "Schimmelpilze"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen Schimmelpilzsporen (z. B. Alternaria, Aspergillus, Cladosporium) und Hefen.",
      why: "Bei Beschwerden in feuchten Räumen, im Spätsommer und Herbst oder bei schwer einstellbarem Asthma.",
      symptoms: "Schnupfen, Husten, Atemnot, Augenjucken; Alternaria ist ein relevanter Auslöser für Asthma.",
      meaning: "Schimmelpilzsporen sind in der Außenluft saisonal, in Innenräumen bei Feuchtigkeit ganzjährig vorhanden.",
      next: "Feuchtigkeitsquellen in der Wohnung beseitigen, Befund allergologisch einordnen.",
    },
    en: {
      what: "IgE antibodies against mould spores (e.g. Alternaria, Aspergillus, Cladosporium) and yeasts are tested.",
      why: "With symptoms in damp rooms, in late summer and autumn or with difficult-to-control asthma.",
      symptoms: "Rhinitis, cough, breathlessness, itchy eyes; Alternaria is a relevant asthma trigger.",
      meaning: "Mould spores are seasonal outdoors and present year-round indoors where there is dampness.",
      next: "Remove sources of damp in the home; have the result interpreted by an allergist.",
    },
  },
  Tierhaare: {
    topic: "allergy",
    aliases: ["animal hair", "Tierepithelien"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen Allergene von Katze, Hund, Pferd, Nagetieren und anderen Tieren (Hautschuppen, Speichel, Urin).",
      why: "Bei Beschwerden im Kontakt mit Tieren oder in Haushalten mit Haustieren.",
      symptoms: "Niesen, Augenjucken, Hautausschlag oder Atemnot bei Tierkontakt; Katzenallergene halten sich lange in Räumen.",
      meaning: "Katzenallergie ist die häufigste Tierallergie. Der Nachweis von IgE gegen das Hauptallergen Fel d 1 ist besonders aussagekräftig.",
      next: "Kontakt reduzieren, Schlafzimmer tierfrei halten; eine Hyposensibilisierung ist bei Katzen- und Hundeallergie möglich.",
    },
    en: {
      what: "IgE antibodies against allergens from cat, dog, horse, rodents and other animals (dander, saliva, urine) are tested.",
      why: "With symptoms on contact with animals or in households with pets.",
      symptoms: "Sneezing, itchy eyes, rash or breathlessness on animal contact; cat allergens linger in rooms for a long time.",
      meaning: "Cat allergy is the most common animal allergy. Detection of IgE against the major allergen Fel d 1 is particularly informative.",
      next: "Reduce contact, keep the bedroom pet-free; immunotherapy is possible for cat and dog allergy.",
    },
  },
  Insektengifte: {
    topic: "allergy",
    aliases: ["insect venom", "Insektengift"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen Bienen- und Wespengift.",
      why: "Nach einer stärkeren Reaktion auf einen Stich, insbesondere mit Atemnot, Schwindel oder Kreislaufproblemen.",
      symptoms: "Normale Stichreaktion: lokale Schwellung. Allergische Reaktion: Nesselsucht am ganzen Körper, Atemnot, Kreislaufkollaps.",
      meaning: "Ein IgE-Nachweis ohne systemische Reaktion in der Vorgeschichte hat wenig Bedeutung. Nach einer schweren Reaktion ist die Abklärung dringend, da eine Hyposensibilisierung sehr wirksam schützt.",
      next: "Nach systemischen Reaktionen allergologisch vorstellen und ein Notfallset verordnen lassen.",
    },
    en: {
      what: "IgE antibodies against bee and wasp venom are tested.",
      why: "After a stronger reaction to a sting, especially with breathlessness, dizziness or circulatory problems.",
      symptoms: "Normal sting reaction: local swelling. Allergic reaction: hives all over the body, breathlessness, circulatory collapse.",
      meaning: "A positive IgE without a systemic reaction in the history has little significance. After a severe reaction, assessment is urgent, as immunotherapy protects very effectively.",
      next: "After systemic reactions, see an allergist and obtain an emergency kit.",
    },
  },
  Umweltallergene: {
    topic: "allergy",
    aliases: ["environmental allergens"],
    de: {
      what: "Getestet werden IgE-Antikörper gegen weitere Umweltallergene wie Latex, Schaben oder berufsbedingte Stoffe.",
      why: "Bei Beschwerden am Arbeitsplatz, in bestimmten Umgebungen oder bei Kontakt mit Gummi und Latex.",
      symptoms: "Kontaktreaktionen der Haut, Schnupfen oder Asthma in bestimmten Umgebungen.",
      meaning: "Der Nachweis zeigt eine Sensibilisierung; die klinische Relevanz hängt vom Expositionszusammenhang ab.",
      next: "Befund allergologisch einordnen und Auslöser gezielt meiden.",
    },
    en: {
      what: "IgE antibodies against further environmental allergens such as latex, cockroaches or occupational substances are tested.",
      why: "With symptoms at the workplace, in certain environments or on contact with rubber and latex.",
      symptoms: "Skin contact reactions, rhinitis or asthma in specific environments.",
      meaning: "Detection shows sensitisation; clinical relevance depends on the exposure context.",
      next: "Have the result interpreted by an allergist and avoid triggers specifically.",
    },
  },

  /* ------------------------------------------------------------------ Genetische Risikotests */
  "Genetisches Risiko Brustkrebs": {
    topic: "dna",
    aliases: ["2.803 häufigen genetischen Varianten", "2.803 genetische Varianten für Brustkrebs", "AnteBC"],
    de: {
      what: "Der Test berechnet aus 2.803 häufigen Genvarianten einen polygenen Risikoscore für Brustkrebs. Er erfasst nicht die seltenen Hochrisikogene BRCA1 und BRCA2.",
      why: "Für Frauen, die ihr persönliches Brustkrebsrisiko kennen und Vorsorgeintervalle individuell planen möchten.",
      symptoms: "Ein genetisches Risiko verursacht keine Beschwerden. Knoten, Hautveränderungen oder Sekret aus der Brustwarze gehören unabhängig vom Test ärztlich abgeklärt.",
      meaning: "Der Score ordnet das Risiko im Vergleich zur Bevölkerung ein (z. B. erhöht, durchschnittlich, niedrig). Ein erhöhtes Risiko ist keine Diagnose, ein niedriges keine Garantie. Familiäre Häufung spricht zusätzlich für eine humangenetische Beratung.",
      next: "Ergebnis mit Gynäkologin oder Gynäkologen besprechen und Vorsorge (Tastuntersuchung, Mammographie ab 50, ggf. früher) daran ausrichten.",
    },
    en: {
      what: "The test calculates a polygenic risk score for breast cancer from 2,803 common gene variants. It does not capture the rare high-risk genes BRCA1 and BRCA2.",
      why: "For women who want to know their personal breast cancer risk and plan screening intervals individually.",
      symptoms: "A genetic risk causes no symptoms. Lumps, skin changes or nipple discharge need medical assessment regardless of the test.",
      meaning: "The score ranks risk relative to the population (e.g. increased, average, low). An increased risk is not a diagnosis, a low one not a guarantee. Familial clustering additionally warrants genetic counselling.",
      next: "Discuss the result with a gynaecologist and align screening (palpation, mammography from 50, earlier if indicated) to it.",
    },
  },
  "Genetisches Risiko Darmkrebs": {
    topic: "dna",
    aliases: ["AnteCRC", "91 Varianten für Darmkrebs", "91 genetische Varianten für Darmkrebs"],
    de: {
      what: "Der Test berechnet aus 91 häufigen Genvarianten einen polygenen Risikoscore für Darmkrebs. Erbliche Syndrome wie Lynch oder FAP werden nicht erfasst.",
      why: "Für Menschen, die entscheiden möchten, wann und wie oft sie zur Darmkrebsvorsorge gehen.",
      symptoms: "Keine. Blut im Stuhl, veränderte Stuhlgewohnheiten oder Gewichtsverlust gehören direkt abgeklärt, unabhängig vom genetischen Risiko.",
      meaning: "Der Score vergleicht das persönliche Risiko mit dem Bevölkerungsdurchschnitt. Lebensstil (Rauchen, Alkohol, rotes Fleisch, Bewegung) beeinflusst das Risiko zusätzlich und ist veränderbar.",
      next: "Mit dem Ergebnis die Vorsorge planen: Stuhltest oder Darmspiegelung, bei erhöhtem Risiko früher und häufiger als ab 50 Jahren.",
    },
    en: {
      what: "The test calculates a polygenic risk score for bowel cancer from 91 common gene variants. Hereditary syndromes such as Lynch or FAP are not captured.",
      why: "For people who want to decide when and how often to attend bowel cancer screening.",
      symptoms: "None. Blood in stool, changed bowel habits or weight loss need direct assessment, regardless of genetic risk.",
      meaning: "The score compares personal risk with the population average. Lifestyle (smoking, alcohol, red meat, exercise) additionally influences risk and can be changed.",
      next: "Plan screening with the result: stool test or colonoscopy, earlier and more often than from age 50 if risk is increased.",
    },
  },
  "Genetisches Risiko Prostatakrebs": {
    topic: "dna",
    aliases: ["121 häufigen genetischen Varianten", "121 Varianten für Prostatakrebs", "AntePC"],
    de: {
      what: "Der Test berechnet aus 121 häufigen Genvarianten einen polygenen Risikoscore für Prostatakrebs.",
      why: "Für Männer, die den Zeitpunkt und die Häufigkeit ihrer PSA-Vorsorge individuell festlegen möchten.",
      symptoms: "Keine. Prostatakrebs verursacht im Frühstadium keine Beschwerden.",
      meaning: "Der Score ergänzt die PSA-basierte Vorsorge: Bei erhöhtem genetischem Risiko kann ein früherer Beginn der PSA-Kontrollen sinnvoll sein. Er ersetzt keine Untersuchung.",
      next: "Ergebnis urologisch besprechen und das Vorsorgeintervall gemeinsam festlegen.",
    },
    en: {
      what: "The test calculates a polygenic risk score for prostate cancer from 121 common gene variants.",
      why: "For men who want to set the timing and frequency of their PSA screening individually.",
      symptoms: "None. Early prostate cancer causes no symptoms.",
      meaning: "The score complements PSA-based screening: with increased genetic risk, starting PSA checks earlier can be sensible. It replaces no examination.",
      next: "Discuss the result with a urologist and set the screening interval together.",
    },
  },
  "Genetisches Risiko Hautmelanom": {
    topic: "dna",
    aliases: ["AnteMEL", "28 Varianten für Hautmelanom", "28 genetische Varianten für Hautmelanom"],
    de: {
      what: "Der Test berechnet aus 28 häufigen Genvarianten einen polygenen Risikoscore für das maligne Melanom (schwarzer Hautkrebs).",
      why: "Für Menschen mit heller Haut, vielen Muttermalen, Sonnenbränden in der Kindheit oder Hautkrebs in der Familie.",
      symptoms: "Ein Melanom zeigt sich als neues oder sich veränderndes Muttermal (ABCDE-Regel: asymmetrisch, unregelmäßige Begrenzung, mehrfarbig, Durchmesser über 5 mm, Entwicklung).",
      meaning: "Das genetische Risiko ergänzt die sichtbaren Risikofaktoren. UV-Schutz bleibt der wichtigste beeinflussbare Faktor.",
      next: "Bei erhöhtem Risiko regelmäßige dermatologische Hautkrebsvorsorge, konsequenter Sonnenschutz und Selbstkontrolle der Haut.",
    },
    en: {
      what: "The test calculates a polygenic risk score for malignant melanoma (skin cancer) from 28 common gene variants.",
      why: "For people with fair skin, many moles, childhood sunburns or skin cancer in the family.",
      symptoms: "A melanoma appears as a new or changing mole (ABCDE rule: asymmetry, irregular border, multiple colours, diameter over 5 mm, evolution).",
      meaning: "The genetic risk complements the visible risk factors. UV protection remains the most important modifiable factor.",
      next: "With increased risk, regular dermatological skin checks, consistent sun protection and self-examination of the skin.",
    },
  },

  /* ------------------------------------------------------------------ Aminosäuren */
  Alanin: aa("Alanin", "Alanine", "Nicht-essenzielle Aminosäure, die Muskeln mit der Leber verbindet: Sie transportiert Stickstoff und dient der Zuckerneubildung bei Belastung und Fasten.", "Non-essential amino acid linking muscle and liver: it transports nitrogen and feeds glucose production during exertion and fasting."),
  Arginin: aa("Arginin", "Arginine", "Semi-essenzielle Aminosäure und Vorstufe von Stickstoffmonoxid, das Gefäße erweitert. Beteiligt an Wundheilung, Immunfunktion und Harnstoffzyklus.", "Semi-essential amino acid and precursor of nitric oxide, which widens vessels. Involved in wound healing, immune function and the urea cycle."),
  Citrullin: aa("Citrullin", "Citrulline", "Zwischenprodukt des Harnstoffzyklus und Vorstufe von Arginin. Niedrige Werte können auf eine verminderte Darmfunktion hinweisen, da Citrullin in der Darmschleimhaut gebildet wird.", "Intermediate of the urea cycle and precursor of arginine. Low values can hint at reduced gut function, since citrulline is made in the intestinal lining."),
  Glutamin: aa("Glutamin", "Glutamine", "Häufigste freie Aminosäure im Blut und wichtigster Energielieferant für Darm- und Immunzellen. Der Spiegel sinkt bei intensiver Belastung, Verletzungen und Infekten.", "Most abundant free amino acid in blood and the main fuel for gut and immune cells. Levels fall with intense exertion, injury and infection."),
  Glycin: aa("Glycin", "Glycine", "Kleinste Aminosäure, Baustein von Kollagen, Glutathion und Kreatin. Wirkt beruhigend auf das Nervensystem und wird mit Schlafqualität in Verbindung gebracht.", "Smallest amino acid, building block of collagen, glutathione and creatine. Calms the nervous system and is linked to sleep quality."),
  Leucin: aa("Leucin", "Leucine", "Essenzielle verzweigtkettige Aminosäure (BCAA) und wichtigstes Signal für den Muskelaufbau (mTOR). Bedarf steigt bei Krafttraining und im Alter.", "Essential branched-chain amino acid (BCAA) and the key signal for muscle protein synthesis (mTOR). Needs rise with strength training and age."),
  Isoleucin: aa("Isoleucin", "Isoleucine", "Essenzielle BCAA, beteiligt an Energiegewinnung im Muskel, Blutzuckerregulation und Hämoglobinbildung.", "Essential BCAA involved in muscle energy supply, blood glucose regulation and haemoglobin formation."),
  Lysin: aa("Lysin", "Lysine", "Essenzielle Aminosäure für Kollagen, Carnitinbildung und Calciumaufnahme. In Getreide knapp, deshalb bei pflanzlicher Ernährung auf Hülsenfrüchte achten.", "Essential amino acid for collagen, carnitine formation and calcium absorption. Scarce in grains, so plant-based diets should include legumes."),
  Methionin: aa("Methionin", "Methionine", "Essenzielle schwefelhaltige Aminosäure und Methylgruppen-Spender. Ihr Abbau erzeugt Homocystein, dessen Entgiftung Folsäure, B6 und B12 benötigt.", "Essential sulphur-containing amino acid and methyl donor. Its breakdown produces homocysteine, whose clearance needs folate, B6 and B12."),
  Ornithin: aa("Ornithin", "Ornithine", "Nicht-proteinogene Aminosäure des Harnstoffzyklus, die Ammoniak entgiftet. Auffällige Werte können auf Leber- oder Stoffwechselbelastung hinweisen.", "Non-proteinogenic amino acid of the urea cycle that detoxifies ammonia. Abnormal values can hint at liver or metabolic strain."),
  Phenylalanin: aa("Phenylalanin", "Phenylalanine", "Essenzielle Aminosäure und Vorstufe von Tyrosin, Dopamin und Noradrenalin. Bei Phenylketonurie kann sie nicht abgebaut werden.", "Essential amino acid and precursor of tyrosine, dopamine and noradrenaline. In phenylketonuria it cannot be broken down."),
  Prolin: aa("Prolin", "Proline", "Nicht-essenzielle Aminosäure und Hauptbestandteil von Kollagen. Wichtig für Haut, Sehnen, Gelenke und Wundheilung.", "Non-essential amino acid and main component of collagen. Important for skin, tendons, joints and wound healing."),
  Serin: aa("Serin", "Serine", "Nicht-essenzielle Aminosäure, Baustein von Zellmembranen, Nervenbotenstoffen und beteiligt an der Bildung von Glycin und Cystein.", "Non-essential amino acid, building block of cell membranes and neurotransmitters, involved in forming glycine and cysteine."),
  Threonin: aa("Threonin", "Threonine", "Essenzielle Aminosäure für Kollagen, Elastin, Schleimhautschutz (Muzine) und Antikörper. Besonders wichtig für Darmbarriere und Immunsystem.", "Essential amino acid for collagen, elastin, mucosal protection (mucins) and antibodies. Especially important for the gut barrier and immune system."),
  Tyrosin: aa("Tyrosin", "Tyrosine", "Semi-essenzielle Aminosäure, Vorstufe von Schilddrüsenhormonen, Dopamin, Noradrenalin und Melanin. Beteiligt an Konzentration und Stressreaktion.", "Semi-essential amino acid, precursor of thyroid hormones, dopamine, noradrenaline and melanin. Involved in focus and the stress response."),
  Valin: aa("Valin", "Valine", "Essenzielle BCAA, liefert Energie im Muskel und unterstützt Regeneration und Stickstoffbilanz nach Belastung.", "Essential BCAA that supplies muscle energy and supports recovery and nitrogen balance after exertion."),

  /* ------------------------------------------------------------------ Fettsäuren */
  EPA: fa("EPA", "EPA (Eicosapentaensäure)", "EPA (eicosapentaenoic acid)", "Langkettige Omega-3-Fettsäure aus Fisch und Algen. Sie wirkt entzündungsmodulierend und senkt Triglyceride; in hohen Dosen in Studien herzschützend.", "Long-chain omega-3 fatty acid from fish and algae. It modulates inflammation and lowers triglycerides; cardioprotective at high doses in studies."),
  DHA: fa("DHA", "DHA (Docosahexaensäure)", "DHA (docosahexaenoic acid)", "Langkettige Omega-3-Fettsäure und Hauptbestandteil von Gehirn und Netzhaut. Wichtig in Schwangerschaft, Stillzeit und für die kognitive Gesundheit im Alter.", "Long-chain omega-3 fatty acid and main component of brain and retina. Important in pregnancy, breastfeeding and for cognitive health in older age."),
  DPA: fa("DPA", "DPA (Docosapentaensäure)", "DPA (docosapentaenoic acid)", "Omega-3-Zwischenprodukt zwischen EPA und DHA mit eigenen entzündungsregulierenden Eigenschaften, das bisher weniger erforscht ist.", "Omega-3 intermediate between EPA and DHA with its own inflammation-regulating properties, so far less researched."),
  ALA: fa("ALA", "ALA (Alpha-Linolensäure)", "ALA (alpha-linolenic acid)", "Pflanzliche Omega-3-Fettsäure aus Leinsamen, Walnüssen und Rapsöl. Der Körper wandelt nur wenige Prozent in EPA und DHA um.", "Plant omega-3 fatty acid from flaxseed, walnuts and rapeseed oil. The body converts only a few percent into EPA and DHA."),
  "Linolsäure (LA)": fa("Linolsäure (LA)", "Linolsäure (LA)", "Linoleic acid (LA)", "Wichtigste Omega-6-Fettsäure aus Pflanzenölen, Nüssen und Saaten. Essenziell, aber in westlicher Ernährung meist reichlich vorhanden.", "Main omega-6 fatty acid from vegetable oils, nuts and seeds. Essential, but usually abundant in Western diets."),
  "Arachidonsäure (AA)": fa("Arachidonsäure (AA)", "Arachidonsäure (AA)", "Arachidonic acid (AA)", "Omega-6-Fettsäure aus Fleisch, Eiern und Milchprodukten, Ausgangsstoff entzündungsfördernder, aber auch regulierender Botenstoffe.", "Omega-6 fatty acid from meat, eggs and dairy, precursor of pro-inflammatory but also regulatory messengers."),
  "Omega-6 : Omega-3": fa("Omega-6 : Omega-3", "Omega-6/Omega-3-Verhältnis", "Omega-6/omega-3 ratio", "Verhältnis der beiden Fettsäurefamilien in den Blutzellen. Westliche Ernährung liegt oft bei 15:1 oder höher; als günstig gelten Werte unter etwa 5:1.", "Ratio of the two fatty acid families in blood cells. Western diets often sit at 15:1 or higher; values below about 5:1 are considered favourable."),
  "AA : EPA": fa("AA : EPA", "AA/EPA-Verhältnis", "AA/EPA ratio", "Verhältnis von Arachidonsäure zu EPA als Marker der Entzündungsbalance. Niedrigere Werte spiegeln eine höhere Omega-3-Versorgung wider.", "Ratio of arachidonic acid to EPA as a marker of inflammatory balance. Lower values reflect a higher omega-3 supply."),
  "EPA : DHA": fa("EPA : DHA", "EPA/DHA-Verhältnis", "EPA/DHA ratio", "Verhältnis der beiden marinen Omega-3-Fettsäuren zueinander; es hängt von der Quelle (Fisch, Algen, Präparate) ab.", "Ratio of the two marine omega-3 fatty acids to each other; it depends on the source (fish, algae, supplements)."),
  "Omega-3-Index": fa("Omega-3-Index", "Omega-3-Index", "Omega-3 index", "Anteil von EPA und DHA an den Fettsäuren der roten Blutkörperchen. Werte über 8 % gelten als günstig, unter 4 % als ungünstig für das Herz-Kreislauf-Risiko (Harris & von Schacky).", "Share of EPA and DHA in red blood cell fatty acids. Values above 8 % are considered favourable, below 4 % unfavourable for cardiovascular risk (Harris & von Schacky)."),
};

/* Compact builders for the two large families ----------------------------- */

function aa(nameDe: string, nameEn: string, whatDe: string, whatEn: string): ValueEntry {
  return {
    topic: "aminoacids",
    title: { de: nameDe, en: nameEn },
    aliases: [nameEn],
    de: {
      what: whatDe,
      why: "Als Teil eines Aminosäurenprofils bei Leistungssport, Muskelaufbau, einseitiger oder veganer Ernährung, Erschöpfung oder Regenerationsproblemen.",
      symptoms: "Ein Mangel einzelner Aminosäuren macht selten eindeutige Beschwerden; möglich sind Leistungsabfall, verzögerte Regeneration, Infektanfälligkeit oder Muskelabbau.",
      meaning: "Einzelwerte schwanken mit Mahlzeiten, Training und Tageszeit; aussagekräftig ist das Gesamtmuster. Essenzielle Aminosäuren müssen über die Nahrung aufgenommen werden.",
      next: "Auffällige Muster mit einer Ernährungsfachkraft oder ärztlich besprechen; meist genügt eine Anpassung von Eiweißmenge und -qualität.",
    },
    en: {
      what: whatEn,
      why: "As part of an amino acid profile with competitive sport, muscle building, a one-sided or vegan diet, exhaustion or recovery problems.",
      symptoms: "A deficiency of single amino acids rarely causes clear symptoms; possible are reduced performance, delayed recovery, frequent infections or muscle loss.",
      meaning: "Single values vary with meals, training and time of day; the overall pattern is what counts. Essential amino acids must come from food.",
      next: "Discuss abnormal patterns with a dietitian or doctor; usually adjusting protein quantity and quality is enough.",
    },
  };
}

function fa(key: string, titleDe: string, titleEn: string, whatDe: string, whatEn: string): ValueEntry {
  return {
    topic: "fattyacids",
    title: { de: titleDe, en: titleEn },
    aliases: [key],
    de: {
      what: whatDe,
      why: "Zur Beurteilung der Omega-3-Versorgung und Entzündungsbalance, bei wenig Fischkonsum, veganer Ernährung, Herz-Kreislauf-Risiko, Schwangerschaft oder entzündlichen Erkrankungen.",
      symptoms: "Eine ungünstige Fettsäurebalance verursacht keine akuten Beschwerden; sie ist ein langfristiger Risikofaktor für Herz-Kreislauf-Erkrankungen und Entzündungsprozesse.",
      meaning: "Die Messung in den roten Blutkörperchen spiegelt die Versorgung der letzten Wochen bis Monate wider und ist stabiler als ein Blutplasma-Wert.",
      next: "Zwei Portionen fetter Seefisch pro Woche oder Algen-/Fischölpräparate verbessern die Werte innerhalb von etwa drei Monaten; danach kontrollieren.",
    },
    en: {
      what: whatEn,
      why: "To assess omega-3 supply and inflammatory balance, with little fish intake, a vegan diet, cardiovascular risk, pregnancy or inflammatory disease.",
      symptoms: "An unfavourable fatty acid balance causes no acute symptoms; it is a long-term risk factor for cardiovascular disease and inflammatory processes.",
      meaning: "Measurement in red blood cells reflects supply over the past weeks to months and is more stable than a plasma value.",
      next: "Two portions of oily sea fish per week or algae/fish oil supplements improve values within about three months; re-check afterwards.",
    },
  };
}

/* HPV high-risk types: one shared text, type-specific first line ---------- */
export function hpvEntry(type: string): ValueEntry {
  const strong = ["16", "18"].includes(type);
  const noteDe = strong
    ? `HPV ${type} gehört zu den beiden Typen, die zusammen rund 70 % aller Gebärmutterhalskarzinome verursachen.`
    : `HPV ${type} ist ein Hochrisikotyp, der seltener als die Typen 16 und 18, aber ebenfalls an Zellveränderungen beteiligt sein kann.`;
  const noteEn = strong
    ? `HPV ${type} is one of the two types that together cause around 70 % of all cervical cancers.`
    : `HPV ${type} is a high-risk type that is involved in cell changes less often than types 16 and 18 but can still contribute.`;
  return {
    topic: "hpv",
    title: { de: `HPV Typ ${type}`, en: `HPV type ${type}` },
    de: {
      what: `Humane Papillomviren (HPV) sind sexuell übertragbare Viren. ${noteDe} Der Test weist die Virus-DNA im Abstrich nach.`,
      why: "Für Frauen ab 30 Jahren ist der HPV-Test Teil der gesetzlichen Früherkennung (alle drei Jahre mit Pap-Abstrich). Auch bei unklaren Abstrichbefunden oder zur Kontrolle nach Behandlung.",
      symptoms: "Eine HPV-Infektion verursacht keine Beschwerden. Zellveränderungen entwickeln sich über Jahre und werden nur durch Vorsorge entdeckt.",
      meaning: "Die meisten Infektionen heilen innerhalb von ein bis zwei Jahren von selbst aus. Ein positiver Befund bedeutet nicht Krebs, erfordert aber eine gynäkologische Kontrolle (Pap-Abstrich, ggf. Kolposkopie).",
      next: "Positiven Befund gynäkologisch abklären und Kontrollintervall festlegen. Die HPV-Impfung schützt vor den wichtigsten Hochrisikotypen.",
    },
    en: {
      what: `Human papillomaviruses (HPV) are sexually transmitted viruses. ${noteEn} The test detects viral DNA in the swab.`,
      why: "For women from age 30 the HPV test is part of statutory screening in Germany (every three years with a Pap smear). Also with unclear smear results or for follow-up after treatment.",
      symptoms: "An HPV infection causes no symptoms. Cell changes develop over years and are only found through screening.",
      meaning: "Most infections clear on their own within one to two years. A positive result does not mean cancer but requires gynaecological follow-up (Pap smear, colposcopy if needed).",
      next: "Have a positive result assessed by a gynaecologist and set the follow-up interval. HPV vaccination protects against the main high-risk types.",
    },
  };
}

/* Candida species: shared text with species-specific first line ------------ */
const CANDIDA_NOTES: Record<string, { de: string; en: string }> = {
  albicans: { de: "Candida albicans verursacht etwa 80 bis 90 % aller Scheidenpilzinfektionen und spricht in der Regel gut auf Standardtherapien an.", en: "Candida albicans causes about 80 to 90 % of all vaginal yeast infections and usually responds well to standard therapy." },
  glabrata: { de: "Candida glabrata ist der zweithäufigste Erreger, verursacht oft mildere, aber hartnäckige Beschwerden und ist häufig gegen gängige Azol-Antimykotika weniger empfindlich.", en: "Candida glabrata is the second most common species, often causes milder but persistent symptoms and is frequently less sensitive to common azole antifungals." },
  krusei: { de: "Candida krusei ist selten, aber von Natur aus resistent gegen Fluconazol, weshalb der Nachweis die Therapiewahl beeinflusst.", en: "Candida krusei is rare but intrinsically resistant to fluconazole, so detection influences the choice of therapy." },
  tropicalis: { de: "Candida tropicalis ist ein seltener Erreger, der bei wiederkehrenden Infektionen oder geschwächter Abwehr häufiger vorkommt.", en: "Candida tropicalis is a rarer species that occurs more often with recurrent infections or weakened defences." },
  parapsilosis: { de: "Candida parapsilosis ist ein seltener Erreger vaginaler Infektionen und spricht meist gut auf Standardtherapien an.", en: "Candida parapsilosis is a rare cause of vaginal infections and usually responds well to standard therapy." },
  dubliniensis: { de: "Candida dubliniensis ist eng mit C. albicans verwandt, seltener und mit Standardtests leicht zu verwechseln.", en: "Candida dubliniensis is closely related to C. albicans, rarer and easily confused with it in standard tests." },
  lusitaniae: { de: "Candida lusitaniae ist ein seltener Erreger, der eine Resistenz gegen Amphotericin B entwickeln kann.", en: "Candida lusitaniae is a rare species that can develop resistance to amphotericin B." },
};

export function candidaEntry(species: string): ValueEntry | null {
  const key = species.toLowerCase();
  const note = CANDIDA_NOTES[key];
  if (!note) return null;
  const name = `Candida ${key}`;
  return {
    topic: "candida",
    title: { de: name, en: name },
    de: {
      what: `${note.de} Der Test weist die Hefe per PCR im Vaginalabstrich nach und unterscheidet die Art.`,
      why: "Bei Juckreiz, Brennen und krümelig-weißem Ausfluss, besonders bei wiederkehrenden Beschwerden (mehr als vier Episoden pro Jahr) oder wenn Standardtherapien nicht wirken.",
      symptoms: "Juckreiz, Brennen, Rötung, Schwellung der Vulva, weißlicher Ausfluss, Schmerzen beim Sex oder Wasserlassen.",
      meaning: "Hefepilze gehören in geringer Menge zur normalen Scheidenflora; ein Nachweis ohne Beschwerden ist meist nicht behandlungsbedürftig. Die Artbestimmung hilft, bei wiederkehrenden Infektionen das passende Antimykotikum zu wählen.",
      next: "Befund gynäkologisch besprechen. Bei wiederkehrenden Infektionen Auslöser prüfen (Antibiotika, Diabetes, Hormone) und gezielt behandeln.",
    },
    en: {
      what: `${note.en} The test detects the yeast by PCR in a vaginal swab and distinguishes the species.`,
      why: "With itching, burning and crumbly white discharge, especially with recurrent symptoms (more than four episodes a year) or when standard therapy fails.",
      symptoms: "Itching, burning, redness, swelling of the vulva, whitish discharge, pain during sex or urination.",
      meaning: "Yeasts are part of the normal vaginal flora in small amounts; detection without symptoms usually needs no treatment. Species identification helps choose the right antifungal in recurrent infections.",
      next: "Discuss the result with a gynaecologist. With recurrent infections, check triggers (antibiotics, diabetes, hormones) and treat specifically.",
    },
  };
}

/** Fragments produced by splitting on commas that should not become tabs. */
export const IGNORE_FRAGMENTS = ["aktive Form von Vitamin B6)", "active form of vitamin B6)"];
