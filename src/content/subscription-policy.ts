import type { Locale } from "@/lib/i18n/config";

/** Plain-language summary shown above the legal subscription text. */
export const SUBSCRIPTION_SUMMARY: Record<
  Locale,
  {
    kicker: string;
    headline: string;
    lead: string;
    facts: { title: string; text: string }[];
    faqTitle: string;
    faq: { q: string; a: string }[];
    legalTitle: string;
    cta: string;
  }
> = {
  de: {
    kicker: "Abo-Bedingungen",
    headline: "Regelmäßig testen, [[20 % sparen]]",
    lead: "Viele Tests gibt es als Abo: Du bekommst dein Kit automatisch im gewählten Rhythmus, verfolgst deine Werte im Verlauf und zahlst bei jeder Lieferung 20 % weniger. Kündbar jederzeit.",
    facts: [
      { title: "20 % Rabatt auf jede Lieferung", text: "Der Abo-Preis gilt dauerhaft, nicht nur für die erste Lieferung." },
      { title: "Rhythmus selbst wählen", text: "Auf der Produktseite legst du das Intervall fest. Es lässt sich später ändern." },
      { title: "Jederzeit kündbar", text: "Über den Link in deiner Bestellbestätigung oder per E-Mail an uns. Keine Mindestlaufzeit." },
      { title: "Zahlung pro Lieferung", text: "Abgerechnet wird jede Lieferung einzeln mit der hinterlegten Zahlungsmethode." },
    ],
    faqTitle: "Häufige Fragen zum Abo",
    faq: [
      { q: "Wie kündige oder pausiere ich mein Abo?", a: "In deiner Bestellbestätigungs-E-Mail findest du einen Link zur Abo-Verwaltung. Dort kannst du kündigen, pausieren oder das Intervall ändern. Alternativ schreibst du an heimtest@doctorbox.eu." },
      { q: "Wann wird die nächste Lieferung berechnet?", a: "Jeweils zum Beginn des nächsten Intervalls. Du bekommst vorher eine Erinnerung per E-Mail." },
      { q: "Kann ich den Test im Abo wechseln?", a: "Ja. Kündige das bestehende Abo und bestelle den neuen Test als Abo, oder schreib uns, wir stellen um." },
      { q: "Gilt das Widerrufsrecht auch für Abo-Lieferungen?", a: "Ja, für jede Lieferung gelten die Regeln aus unserem Widerrufsrecht." },
    ],
    legalTitle: "Rechtlicher Text",
    cta: "Tests mit Abo ansehen",
  },
  en: {
    kicker: "Subscription terms",
    headline: "Test regularly, [[save 20 %]]",
    lead: "Many tests are available as a subscription: your kit arrives automatically at the interval you choose, you track your values over time and pay 20 % less on every delivery. Cancel any time.",
    facts: [
      { title: "20 % off every delivery", text: "The subscription price applies permanently, not just to the first delivery." },
      { title: "Choose your interval", text: "You set the interval on the product page and can change it later." },
      { title: "Cancel any time", text: "Via the link in your order confirmation or by e-mailing us. No minimum term." },
      { title: "Pay per delivery", text: "Each delivery is charged individually to the stored payment method." },
    ],
    faqTitle: "Subscription FAQ",
    faq: [
      { q: "How do I cancel or pause my subscription?", a: "Your order confirmation e-mail contains a link to manage the subscription. There you can cancel, pause or change the interval. Alternatively write to heimtest@doctorbox.eu." },
      { q: "When is the next delivery charged?", a: "At the start of the next interval. You receive a reminder e-mail beforehand." },
      { q: "Can I switch the test in my subscription?", a: "Yes. Cancel the existing subscription and order the new test as a subscription, or write to us and we'll switch it." },
      { q: "Does the right of withdrawal apply to subscription deliveries?", a: "Yes, each delivery is covered by the rules in our right of withdrawal." },
    ],
    legalTitle: "Legal text",
    cta: "See tests with subscription",
  },
};
