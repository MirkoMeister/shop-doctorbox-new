# Offene Punkte nach dem Livegang

Stand: 06.11.2026. Laufende Liste für alles, was nach dem Umzug auf den Headless-Shop noch ansteht.
Die Checkliste vor dem Umzug steht in [GO-LIVE-TODO.md](GO-LIVE-TODO.md), die Anleitungsseiten in [IFU-OFFEN.md](IFU-OFFEN.md).
Erledigtes abhaken und Datum dazuschreiben.

## Shop (Code)

- [ ] **Versandkosten in die Summe auf der Warenkorb-Seite einrechnen.** Heute zeigt „Gesamt“ den Betrag ohne Versand, die Versandkosten des gewählten Lieferlands stehen in einer eigenen Zeile darunter.
  Umsetzung: Beim Anlegen oder Wechseln des Lieferlands das Land als Lieferadresse am Warenkorb hinterlegen (`deliveryAddressPreferences`, nur Land), dann `deliveryGroups → deliveryOptions → estimatedCost` mit abfragen und alle Versandgruppen addieren. So stimmt die Summe auch bei mehreren Paketen (z. B. DoctorBox-Kit plus Youngle) und bei geänderten Tarifen in Shopify. Abholung bleibt Wahl im Checkout. Aufwand etwa 1 Stunde.
- [ ] **Hinweis zur Abholung bei Lieferung ins Ausland:** Im Warenkorb steht bei jedem Land „Abholung in Berlin oder Versand“. Entscheiden, ob er außerhalb Deutschlands ausgeblendet wird.

## Shopify (Admin)

- [ ] **Versandseite und Versandzonen angleichen** (`/policies/shipping-policy`, Stand 06.11.):
  - Luxemburg (5,99 €) und Italien (12,99 €) stehen auf der Seite, Shopify liefert aber nicht dorthin (keine Versandzone; Luxemburg hängt im Admin am Markt „Belgien“). Entweder Versandzone anlegen oder von der Seite streichen.
  - Dänemark steht mit 12,99 €, der Markt rechnet in Kronen (100 DKK). Seite anpassen oder den Markt auf Euro stellen.
- [ ] **Tarife prüfen:** Belgien und Frankreich 5,99 €, Niederlande und Österreich 12,99 €, Schweiz 20,99 €. Ist das gewollt, oder fehlt bei Belgien und Frankreich der Aufschlag für die Rücksendung der Probe?
- [ ] **Markt der Schweiz** heißt intern „italy“, vermutlich ein umbenannter alter Markt. Aufräumen.
- [ ] **Dänemark:** Produktname erscheint dort als „Vitamin D test“ (andere Übersetzung im Markt).

## Datenschutz

- [ ] **Cookie `db_ship_country`** (Länderwahl im Warenkorb, seit 06.11. live) bei iubenda und in der Datenschutzerklärung als funktionales Cookie eintragen: speichert nur den Ländercode, 1 Jahr, wird erst bei aktiver Auswahl gesetzt.

## Google Merchant Center

Geprüft am 09.11. (Claude in Chrome, nur lesend). Konto 662769470.

- [x] **Direktkauf-Link** lieferte 404. Seit 09.11. leitet der Shop `/cart/{id}:1` (auch mit Feed-ID `shopify_DE_<Produkt>_<Variante>`) zum Shopify-Checkout weiter.
- [x] **Kasse-URL** (09.11. erledigt, Google-Prüfung läuft 24 h) zurückgestellt auf `https://shop.doctorbox.de/cart/{id}:1` (Einstellungen → Informationen zum Unternehmen → Kasse). `checkout.doctorbox.de/cart/{id}:1` funktioniert nicht, weil Shopify die Feed-ID nicht versteht. Danach „Test der URL-Struktur“.
- [x] **Onlineshop** (09.11. auf `shop.doctorbox.de` umgestellt). Stand vorher auf `checkout.doctorbox.de`. Deshalb zeigt der Bericht „Onlineshop“ seit ~02.11. 0 organische Klicks; laut Search Console ist der Traffic stabil. Nach ein paar Tagen prüfen, ob der Shopify-Kanal es zurückschreibt.
- [ ] **Lokale Angebote:** 92 Produkte ohne `link_template`, 115 ohne lokales Inventar (Abholung Berlin). Entweder im Shopify-Kanal einrichten oder lokale Angebote unter Marketing → Marketingmethoden abschalten.
- [ ] **Streichpreise im Feed** (z. B. STI Standard 80 statt 135 €, Allergietest 209 statt 229 €) in Shopify entfernen; der Shop zeigt sie seit 28.10. nicht mehr.
- [ ] Quadratisches Logo unter Marketing → Marke hochladen (aktuell „ungültig“).
- [ ] 31 nicht genehmigte Produkte durchgehen; Produktbild Rundum Check sagt „Schmerzfreie Blutabnahme“ statt „nahezu schmerzfrei“.
- [ ] Gibt es einen Feed bzw. ein Zielland Österreich? Wie viele Produkte sind dort aktiv, wie viele abgelehnt?
- [ ] Welche Versandkosten sind für Österreich hinterlegt (kostenlos oder 12,99 €)? Eine Abweichung zum Shop führt zu Ablehnungen.
- [ ] Diagnose seit dem Relaunch: „Landingpage nicht erreichbar“, „Preis stimmt nicht überein“ o. Ä. (alte `/de-at/`-Links leiten seit dem Relaunch auf die deutschen URLs weiter).
- [ ] Klicks und Impressionen in Österreich vor und nach dem Relaunch vergleichen.

## Auswertung Österreich

Anlass: kaum noch Bestellungen aus Österreich. Ursache vermutlich: Shop versprach „Kostenloser Versand“, im Checkout kamen 12,99 € dazu. Seit 06.11. zeigt der Shop die Auslandskosten vorab.

- [ ] In 1–2 Wochen in Shopify vergleichen: Umsatz nach Rechnungsland Österreich, Sitzungen aus Österreich, abgebrochene Checkouts mit Land Österreich (vorher/nachher).

## Sonstiges

- [x] **Antwort an Julian in Issue #12** gepostet (09.11.). Als Nächstes: Shopify-Plan, Checkout-Validierung und Quelle des Riise-Einkaufspreises pro Rezeptur prüfen und im Issue dokumentieren.
- [ ] **Anfrage „Eigener Test“:** Der Person, die über `/pages/eigener-test` schon ein individuelles Set angefragt hat, antworten (Funktion gibt es noch nicht).
- [ ] **`RESEND_API_KEY`** in Scalingo löschen (Resend ist seit dem Wechsel zu Brevo raus).
- [ ] **Allergietest:** Hat in Shopify eine Abo-Option. Gewollt?
- [ ] **Trusted Shops:** `ETRUSTED_CHANNEL_ID` und Zugangsdaten in Scalingo setzen (siehe GO-LIVE-TODO, Abschnitt 5).
- [ ] **Clarity** im Tag Manager einbinden.
