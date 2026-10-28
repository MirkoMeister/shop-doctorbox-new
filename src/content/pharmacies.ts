import type { Locale } from "@/lib/i18n/config";
import data from "@/content/pharmacies.json";

/**
 * Partner pharmacies and pickup points. The list lives in pharmacies.json
 * (the CEO supplies it); every entry needs name, street, zip, city and services.
 *
 * Example entry:
 * {
 *   "name": "Apotheke am Markt",
 *   "street": "Marktplatz 1",
 *   "zip": "10115",
 *   "city": "Berlin",
 *   "services": ["pickup", "sampling"],
 *   "hours": "Mo–Fr 8–19 Uhr, Sa 9–14 Uhr",
 *   "phone": "+49 30 1234567",
 *   "website": "https://example.de",
 *   "note": "Blutabnahme nach Terminvereinbarung"
 * }
 */
export type PharmacyService = "pickup" | "sampling";
export type Pharmacy = {
  name: string;
  street: string;
  zip: string;
  city: string;
  services: PharmacyService[];
  hours?: string;
  phone?: string;
  website?: string;
  note?: string;
};

export const PHARMACIES: Pharmacy[] = (data as { locations: Pharmacy[] }).locations;
export const PHARMACIES_UPDATED: string = (data as { updated: string }).updated;

export type PharmacyCopy = {
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  title: string;
  lead: string;
  services: Record<PharmacyService, string>;
  steps: { title: string; text: string }[];
  search: string;
  count: string;
  countOne: string;
  empty: string;
  emptyText: string;
  noneYet: string;
  noneYetText: string;
  contact: string;
  map: string;
  hours: string;
  updated: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
};

const de: PharmacyCopy = {
  metaTitle: "Apotheken vor Ort: Heimtest abholen oder Probe nehmen lassen",
  metaDescription: "Hol deinen DoctorBox Heimtest in einer Partnerapotheke ab oder lass die Probe direkt vor Ort nehmen. Alle Standorte mit Öffnungszeiten.",
  kicker: "Vor Ort",
  title: "Test abholen oder Probe [[vor Ort nehmen]]",
  lead: "Du möchtest nicht auf den Versand warten oder die Blutabnahme lieber in fachkundige Hände geben? In unseren Partnerapotheken holst du dein Set ab, in vielen wird die Probe direkt vor Ort genommen.",
  services: { pickup: "Abholung", sampling: "Probenentnahme vor Ort" },
  steps: [
    { title: "Online bestellen", text: "Bestell deinen Test wie gewohnt im Shop und wähle im Checkout die Abholung in der Apotheke." },
    { title: "Benachrichtigung abwarten", text: "Sobald dein Set in der Apotheke liegt, bekommst du eine Nachricht. Das dauert meist ein bis zwei Werktage." },
    { title: "Abholen oder Probe nehmen", text: "Zeig deine Bestellbestätigung. Bei Standorten mit Probenentnahme nimmt das Apothekenteam die Probe direkt ab." },
  ],
  search: "Stadt, PLZ oder Apotheke",
  count: "{n} Standorte",
  countOne: "1 Standort",
  empty: "Kein Standort gefunden",
  emptyText: "Probiere eine andere Stadt oder Postleitzahl. Die Liste wächst laufend.",
  noneYet: "Die Partnerapotheken kommen in Kürze",
  noneYetText: "Wir ergänzen die Standorte gerade. Bis dahin holst du dein Set bei DoctorBox in Berlin ab oder lässt es dir in neutraler Verpackung schicken.",
  contact: "Du bist Apotheke und möchtest Partner werden? Schreib uns.",
  map: "Auf der Karte",
  hours: "Öffnungszeiten",
  updated: "Stand",
  faqTitle: "Häufige Fragen zur [[Abholung]]",
  faq: [
    { q: "Kostet die Abholung etwas?", a: "Nein. Die Abholung in der Apotheke ist kostenfrei, du sparst den Versand." },
    { q: "Wie läuft die Probenentnahme vor Ort ab?", a: "Das Apothekenteam nimmt die Kapillarblutprobe mit dem Set, das du bestellt hast. Du registrierst den Test vorher in der DoctorBox App, die Probe geht wie gewohnt ins Labor." },
    { q: "Bleibt die Bestellung diskret?", a: "Ja. Das Set ist neutral verpackt, die Apotheke sieht nur deinen Namen und die Bestellnummer. Den Befund siehst du ausschließlich in der App." },
    { q: "Wie lange liegt das Set bereit?", a: "In der Regel zwei Wochen. Danach geht es an uns zurück, und wir erstatten den Kauf." },
  ],
};

const en: PharmacyCopy = {
  metaTitle: "Pharmacies near you: pick up your test or have the sample taken",
  metaDescription: "Pick up your DoctorBox home test at a partner pharmacy or have the sample taken on site. All locations with opening hours.",
  kicker: "On site",
  title: "Pick up your test or have the sample [[taken on site]]",
  lead: "Don't want to wait for shipping, or prefer an expert to draw the blood? At our partner pharmacies you pick up your kit, and at many the sample is taken right there.",
  services: { pickup: "Pickup", sampling: "Sampling on site" },
  steps: [
    { title: "Order online", text: "Order your test in the shop as usual and choose pharmacy pickup at checkout." },
    { title: "Wait for the notification", text: "As soon as your kit is at the pharmacy you get a message. Usually one to two working days." },
    { title: "Pick up or get sampled", text: "Show your order confirmation. At locations with sampling, the pharmacy team takes the sample right away." },
  ],
  search: "City, postcode or pharmacy",
  count: "{n} locations",
  countOne: "1 location",
  empty: "No location found",
  emptyText: "Try another city or postcode. The list keeps growing.",
  noneYet: "Partner pharmacies are coming soon",
  noneYetText: "We are adding the locations right now. Until then, pick up your kit at DoctorBox in Berlin or have it shipped in neutral packaging.",
  contact: "You run a pharmacy and want to become a partner? Write to us.",
  map: "On the map",
  hours: "Opening hours",
  updated: "As of",
  faqTitle: "Common questions about [[pickup]]",
  faq: [
    { q: "Does pickup cost anything?", a: "No. Pickup at the pharmacy is free, you save the shipping." },
    { q: "How does sampling on site work?", a: "The pharmacy team takes the capillary blood sample with the kit you ordered. You register the test in the DoctorBox app beforehand, and the sample goes to the lab as usual." },
    { q: "Does the order stay discreet?", a: "Yes. The kit is packed neutrally, the pharmacy only sees your name and order number. You see the result exclusively in the app." },
    { q: "How long is the kit held?", a: "Usually two weeks. After that it comes back to us and we refund the purchase." },
  ],
};

export const PHARMACIES_PAGE = "/pages/apotheken";
export const pharmacyCopy = (locale: Locale): PharmacyCopy => (locale === "en" ? en : de);
