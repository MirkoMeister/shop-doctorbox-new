import type { Locale } from "@/lib/i18n/config";

/**
 * Shipping and returns for Youngle products (fulfilled by Youngle via Shopify
 * Collective). Wording to be confirmed with operations, see docs/GO-LIVE-TODO.md.
 */
export type YoungleShipping = { title: string; short: string; points: string[] };

const de: YoungleShipping = {
  title: "Versand & Rückgabe",
  short: "Versand direkt von Youngle, in der Regel in 1 bis 2 Werktagen. Keine Abholung in Berlin.",
  points: [
    "Youngle-Produkte verschickt Youngle direkt an dich, in einem eigenen Paket mit eigener Sendungsverfolgung.",
    "Lieferung innerhalb Deutschlands in der Regel in 1 bis 2 Werktagen.",
    "Bestellst du Tests und Supplements zusammen, kommen zwei Pakete. Du bezahlst trotzdem nur einmal.",
    "Abholung in Berlin ist für Supplements nicht möglich.",
    "Rückgabe innerhalb von 14 Tagen nach Erhalt, ungeöffnet und originalverpackt. Details stehen im Widerrufsrecht.",
  ],
};

const en: YoungleShipping = {
  title: "Shipping & returns",
  short: "Shipped directly by Youngle, usually within 1 to 2 working days. No pickup in Berlin.",
  points: [
    "Youngle products are shipped to you directly by Youngle, in a separate parcel with its own tracking.",
    "Delivery within Germany usually takes 1 to 2 working days.",
    "If you order tests and supplements together, two parcels arrive. You still pay only once.",
    "Pickup in Berlin is not available for supplements.",
    "Returns within 14 days of receipt, unopened and in the original packaging. See the right of withdrawal for details.",
  ],
};

export const youngleShipping = (locale: Locale): YoungleShipping => (locale === "en" ? en : de);
