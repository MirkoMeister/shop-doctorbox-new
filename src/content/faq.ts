import type { Locale } from "@/lib/i18n/config";

/**
 * The FAQ page (/pages/faqs). Replaces the Shopify page "FAQ Heimtests", which only listed questions.
 * Answers are taken from texts the shop already uses: shipping and refund policy, the "Mein Testergebnis"
 * page, the Tasso+, subscription and STI pages and the product FAQ. Change freely, but keep facts in
 * line with those sources (and no medical promises).
 */

export const FAQ_PAGE = "/pages/faqs";

export type FaqItem = { q: string; a: string; link?: { label: string; href: string } };
export type FaqGroup = { key: string; title: string; items: FaqItem[] };

export type FaqCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  jump: string;
  groups: FaqGroup[];
  moreTitle: string;
  moreText: string;
  mira: string;
  contact: string;
  email: string;
  phone: string;
};

export const CONTACT_EMAIL = "info@doctorbox.de";
export const CONTACT_PHONE = "+49 30 34045468";

const de: FaqCopy = {
  metaTitle: "Häufige Fragen zu Heimtests, Versand und Befund",
  metaDescription:
    "Antworten zu Bestellung, Versand, Probenahme, Labor und Befund in der DoctorBox App, Datenschutz, Abo und Widerruf.",
  kicker: "Hilfe",
  title: "[[Häufige]] Fragen",
  lead: "Von der Bestellung bis zum Befund in der App: die wichtigsten Antworten auf einen Blick. Fehlt deine Frage, schreib uns oder frag Mira.",
  jump: "Springe zu",
  groups: [
    {
      key: "bestellung",
      title: "Bestellung & Versand",
      items: [
        {
          q: "Wie lange dauert die Lieferung?",
          a: "Innerhalb Deutschlands 3 bis 5 Werktage: 1 Werktag Bearbeitung, dann 2 bis 4 Werktage mit DHL. Die Lieferzeit zählt ab der Zahlungsbestätigung. Sobald das Paket unterwegs ist, bekommst du eine E-Mail mit der Sendungsnummer.",
          link: { label: "Versandbedingungen", href: "/policies/shipping-policy" },
        },
        {
          q: "Was kostet der Versand?",
          a: "Innerhalb Deutschlands ist der Versand kostenlos. Für Lieferungen ins Ausland siehst du die Versandkosten schon im Warenkorb, sobald du dort das Lieferland wählst.",
        },
        {
          q: "Wie diskret ist der Versand?",
          a: "Das Paket ist neutral und ohne Hinweis auf den Inhalt. Auch auf der Rechnung erscheint nur DoctorBox.",
        },
        {
          q: "Kann ich den Test in Berlin abholen?",
          a: "Ja. Wähle im Checkout die Abholung. Meist ist dein Set innerhalb von zwei Stunden abholbereit, bei uns in der Taubenstraße 26, 10117 Berlin.",
        },
        {
          q: "Liefert ihr an eine Packstation?",
          a: "Ja, innerhalb Deutschlands. Gib deine PostNummer im Feld „Adresse“ ein und „Packstation“ mit der Stationsnummer im Feld „Adresszusatz“.",
        },
        {
          q: "Wie kann ich bezahlen?",
          a: "Alle verfügbaren Zahlungsarten siehst du im Checkout, zum Beispiel PayPal, Google Pay und Shop Pay.",
        },
      ],
    },
    {
      key: "probe",
      title: "Probenahme",
      items: [
        {
          q: "Wie läuft ein Heimtest ab?",
          a: "Lade die DoctorBox App herunter und lege dein Gesundheitskonto an. Registriere dann deinen Test: Unter „Heimtests“ scannst du den Barcode von der Barcodekarte im Set. Danach nimmst du die Probe wie in der Anleitung beschrieben und schickst sie im beiliegenden Umschlag ans Labor.",
          link: { label: "Mehr zu deinem Testergebnis", href: "/pages/mein-testergebnis" },
        },
        {
          q: "Ist die Probenahme schwierig?",
          a: "Nein. Jedes Set enthält eine bebilderte Anleitung, die auch in der App hinterlegt ist. Für Kapillarblut nutzt du eine Lanzette oder optional das Tasso+ Gerät, mit dem die Blutabnahme nahezu schmerzfrei ist.",
        },
        {
          q: "Was ist Tasso+?",
          a: "Ein kleines Gerät, das du auf den Oberarm klebst. Ein Knopfdruck startet die Entnahme, feine Mikronadeln und ein Vakuum ziehen das Blut sanft heraus. Du siehst keine Nadel, nach etwa 5 Minuten ist das Röhrchen gefüllt. Das Labor bekommt so häufiger die nötige Blutmenge als beim Fingerpiks.",
          link: { label: "Alles über Tasso+", href: "/pages/tasso" },
        },
        {
          q: "Wie schicke ich die Probe ans Labor?",
          a: "Im Set liegt ein vorbereiteter Rücksendeumschlag mit Versandaufkleber. Damit geht die Probe ohne zusätzliche Kosten ans Labor, aus jedem Lieferland. In der App siehst du, sobald sie dort angekommen ist.",
        },
      ],
    },
    {
      key: "befund",
      title: "Labor & Befund",
      items: [
        {
          q: "Wie erhalte ich mein Ergebnis?",
          a: "In der DoctorBox App, Ende-zu-Ende verschlüsselt. Dort siehst du auch jederzeit den Status deines Tests. Sobald der Befund vorliegt, benachrichtigen wir dich über die App oder per E-Mail.",
        },
        {
          q: "Wie schnell bekomme ich mein Ergebnis?",
          a: "Nach Eingang im Labor dauert die Analyse je nach Test zwischen 2 und 10 Tagen. PCR-basierte STI-Tests sind meist innerhalb von 72 Stunden ausgewertet.",
        },
        {
          q: "Wo wird meine Probe untersucht?",
          a: "In akkreditierten Laboren in Deutschland, mit denselben Verfahren wie bei einer Probe aus der Arztpraxis.",
        },
        {
          q: "Was mache ich, wenn ein Wert auffällig ist?",
          a: "Ein Heimtest ersetzt keine ärztliche Diagnose. Besprich auffällige Werte mit deiner Ärztin oder deinem Arzt und nimm den Befund aus der App mit.",
        },
      ],
    },
    {
      key: "datenschutz",
      title: "Datenschutz",
      items: [
        {
          q: "Sind meine Gesundheitsdaten sicher?",
          a: "Dein Befund liegt Ende-zu-Ende verschlüsselt in deinem Gesundheitskonto in der App. Das Labor arbeitet mit deiner Test-ID, nicht mit deinem Namen.",
          link: { label: "Datenschutzerklärung", href: "/policies/privacy-policy" },
        },
        {
          q: "Bekomme ich den Befund per Post oder E-Mail?",
          a: "Nein. Per E-Mail kommt höchstens die Nachricht, dass dein Befund vorliegt. Den Befund selbst liest du nur in der DoctorBox App.",
        },
      ],
    },
    {
      key: "abo",
      title: "Abo",
      items: [
        {
          q: "Wo wähle ich das Abo aus?",
          a: "Auf der Produktseite unter „Kaufoption“. Voreingestellt ist Einzelkauf, daneben findest du das Abo. Sobald du es auswählst, sinkt der Preis um den Abo-Rabatt und du legst das Intervall fest.",
          link: { label: "So funktioniert das Abo", href: "/pages/doctorbox-abo" },
        },
        {
          q: "Gibt es eine Mindestlaufzeit?",
          a: "Nein. Du kannst das Abo jederzeit pausieren oder kündigen.",
        },
        {
          q: "Wie pausiere oder kündige ich mein Abo?",
          a: "In deinem Kundenkonto unter „Mein Abo verwalten“. Dort kannst du auch das Intervall ändern.",
        },
      ],
    },
    {
      key: "widerruf",
      title: "Widerruf & Rückgabe",
      items: [
        {
          q: "Kann ich meine Bestellung widerrufen?",
          a: "Ja, innerhalb von 14 Tagen ab Erhalt der Ware und ohne Angabe von Gründen. Eine kurze E-Mail an info@doctorbox.de genügt. Die Kosten der Rücksendung trägst du, den Kaufpreis erstatten wir mit derselben Zahlungsart.",
          link: { label: "Widerrufsbelehrung", href: "/policies/refund-policy" },
        },
      ],
    },
  ],
  moreTitle: "Deine Frage [[war nicht dabei]]?",
  moreText: "Mira kennt jeden Test und antwortet sofort. Für Fragen zu deiner Bestellung erreichst du unser Team per E-Mail oder Telefon.",
  mira: "Mira fragen",
  contact: "Zum Kontakt",
  email: "E-Mail",
  phone: "Telefon",
};

const en: FaqCopy = {
  metaTitle: "Frequently asked questions about home tests, shipping and results",
  metaDescription:
    "Answers on ordering, shipping, sample collection, the lab and your result in the DoctorBox app, data protection, subscriptions and withdrawal.",
  kicker: "Help",
  title: "[[Frequently]] asked questions",
  lead: "From your order to your result in the app: the key answers at a glance. If your question is missing, write to us or ask Mira.",
  jump: "Jump to",
  groups: [
    {
      key: "bestellung",
      title: "Order & shipping",
      items: [
        {
          q: "How long does delivery take?",
          a: "Within Germany 3 to 5 working days: 1 working day processing, then 2 to 4 working days with DHL. Delivery time counts from payment confirmation. Once the parcel is on its way, you get an e-mail with the tracking number.",
          link: { label: "Shipping policy", href: "/policies/shipping-policy" },
        },
        {
          q: "How much is shipping?",
          a: "Shipping within Germany is free. For deliveries abroad you see the shipping costs in the cart as soon as you choose the destination country there.",
        },
        {
          q: "How discreet is the shipping?",
          a: "The parcel is neutral with no hint of its contents. The invoice only shows DoctorBox.",
        },
        {
          q: "Can I pick up the test in Berlin?",
          a: "Yes. Choose pickup at checkout. Your kit is usually ready within two hours, at our office at Taubenstraße 26, 10117 Berlin.",
        },
        {
          q: "Do you deliver to a Packstation?",
          a: "Yes, within Germany. Enter your PostNummer in the “Address” field and “Packstation” with the station number in the “Address line 2” field.",
        },
        {
          q: "How can I pay?",
          a: "You see all available payment methods at checkout, for example PayPal, Google Pay and Shop Pay.",
        },
      ],
    },
    {
      key: "probe",
      title: "Sample collection",
      items: [
        {
          q: "How does a home test work?",
          a: "Download the DoctorBox app and create your health account. Then register your test: under “Home tests” you scan the barcode on the barcode card in the kit. Then take the sample as described in the instructions and send it to the lab in the enclosed envelope.",
          link: { label: "More about your test result", href: "/pages/mein-testergebnis" },
        },
        {
          q: "Is taking the sample difficult?",
          a: "No. Every kit includes illustrated instructions, which are also in the app. For capillary blood you use a lancet or optionally the Tasso+ device, which makes blood collection virtually painless.",
        },
        {
          q: "What is Tasso+?",
          a: "A small device you stick to your upper arm. One button press starts the collection; fine microneedles and a vacuum gently draw the blood. You never see a needle, and the tube is full after about 5 minutes. The lab gets the required amount of blood more often than with a finger prick.",
          link: { label: "All about Tasso+", href: "/pages/tasso" },
        },
        {
          q: "How do I send the sample to the lab?",
          a: "The kit includes a prepared return envelope with a shipping label. It takes your sample to the lab at no extra cost, from every delivery country. The app shows you when it has arrived.",
        },
      ],
    },
    {
      key: "befund",
      title: "Lab & result",
      items: [
        {
          q: "How do I get my result?",
          a: "In the DoctorBox app, end-to-end encrypted. There you can also check the status of your test at any time. As soon as your result is ready, we notify you in the app or by e-mail.",
        },
        {
          q: "How quickly do I get my result?",
          a: "After the sample arrives at the lab, analysis takes between 2 and 10 days depending on the test. PCR-based STI tests are usually done within 72 hours.",
        },
        {
          q: "Where is my sample analysed?",
          a: "In accredited laboratories in Germany, using the same methods as for a sample from a doctor's practice.",
        },
        {
          q: "What do I do if a value is out of range?",
          a: "A home test does not replace a medical diagnosis. Discuss values outside the range with your doctor and bring the result from the app.",
        },
      ],
    },
    {
      key: "datenschutz",
      title: "Data protection",
      items: [
        {
          q: "Is my health data safe?",
          a: "Your result is stored end-to-end encrypted in your health account in the app. The lab works with your test ID, not your name.",
          link: { label: "Privacy policy", href: "/policies/privacy-policy" },
        },
        {
          q: "Do I get the result by post or e-mail?",
          a: "No. At most, an e-mail tells you that your result is ready. You read the result itself only in the DoctorBox app.",
        },
      ],
    },
    {
      key: "abo",
      title: "Subscription",
      items: [
        {
          q: "Where do I choose the subscription?",
          a: "On the product page under “Purchase option”. One-time purchase is preselected; the subscription is next to it. Once you select it, the price drops by the subscription discount and you set the interval.",
          link: { label: "How the subscription works", href: "/pages/doctorbox-abo" },
        },
        {
          q: "Is there a minimum term?",
          a: "No. You can pause or cancel the subscription at any time.",
        },
        {
          q: "How do I pause or cancel my subscription?",
          a: "In your customer account under “Manage my subscription”. You can also change the interval there.",
        },
      ],
    },
    {
      key: "widerruf",
      title: "Withdrawal & returns",
      items: [
        {
          q: "Can I withdraw from my order?",
          a: "Yes, within 14 days of receiving the goods and without giving reasons. A short e-mail to info@doctorbox.de is enough. You bear the cost of returning the goods; we refund the purchase price using the same payment method.",
          link: { label: "Withdrawal policy", href: "/policies/refund-policy" },
        },
      ],
    },
  ],
  moreTitle: "Your question [[wasn't here]]?",
  moreText: "Mira knows every test and answers instantly. For questions about your order, reach our team by e-mail or phone.",
  mira: "Ask Mira",
  contact: "Contact",
  email: "E-mail",
  phone: "Phone",
};

export const faqCopy = (locale: Locale): FaqCopy => (locale === "en" ? en : de);
