# Individuelle Sets

**Stand:** 29.10.2026 · **Seite:** `/pages/eigener-test` · **Status:** Konfigurator mit Platzhalterdaten, Bestellung per Anfrage

## Was die Seite macht

Kundinnen und Kunden wählen bis zu 15 Blutwerte. Die Seite zeigt sofort:

- Preis: Summe der Einzelwerte, Grundpreis (Set, Versand, Laborpauschale), zusätzliche Tasso-Geräte
- Röhrchen je Material (Serum, EDTA …) und Blutmenge
- Anzahl der Tasso-Geräte, mit Warnung, wenn das Maximum überschritten ist
- fertige Tests, die die Auswahl abdecken, mit Hinweis, wenn einer alles abdeckt und günstiger ist

Bis die Bestellung im Shop möglich ist, schickt die Seite das Set als Anfrage (`/api/contact`, Thema „Eigener Test“). Die Mail enthält Werte mit Kürzel, Laborcode, Material, Blutmenge und Preis, die Röhrchenaufteilung, Tasso-Anzahl und Gesamtpreis.

## Berechnung

`src/lib/kits/plan.ts`:

1. Werte werden nach Material getrennt. Werte mit unterschiedlichem Material teilen sich nie ein Röhrchen.
2. Je Material werden die Werte, größte Blutmenge zuerst, auf möglichst wenige Röhrchen verteilt. Ein Wert wird nie auf zwei Röhrchen aufgeteilt.
3. Tasso-Geräte: ein Gerät pro Röhrchen (`tassoMode: "perTube"`) oder nach Gesamtblutmenge (`"byVolume"`).
4. Preis: Grundpreis + Summe der Werte + (Tasso-Geräte − inklusive) × Preis pro zusätzlichem Gerät.

## Laborliste einspielen

1. Liste im Format von [biomarker-vorlage.csv](biomarker-vorlage.csv) speichern (Semikolon, deutsches Komma bei Preisen).
2. `node scripts/kit-import.mjs docs/individuelle-sets/<liste>.csv` ausführen. Das Skript bricht bei fehlenden Spalten, doppelten Kürzeln oder ungültigen Zahlen ab und nennt die Zeile.
3. Materialien, die in der Liste vorkommen, müssen in `src/content/kit/rules.ts` als Röhrchentyp stehen.
4. In `src/content/kit/rules.ts` die mit PLATZHALTER markierten Werte durch die Laborangaben ersetzen und `placeholder: false` setzen. Erst dann verschwindet der Vorschau-Hinweis auf der Seite.

Die aktuellen Daten sind Platzhalter: [biomarker-platzhalter.csv](biomarker-platzhalter.csv) (52 Werte aus dem bestehenden Sortiment, je 100 µl und 9,90 €).

## Offene Entscheidungen

| Frage | Platzhalter heute |
|---|---|
| Nutzbares Volumen je Röhrchentyp | 400 µl Serum, 400 µl EDTA |
| Füllt ein Tasso genau ein Röhrchen? | ja (`perTube`) |
| Höchstzahl Tasso-Geräte pro Set | 3 |
| Grundpreis Set, Versand, Labor | 29 € inkl. 1 Tasso |
| Preis je zusätzlichem Tasso | 15 € |
| Lanzette statt Tasso bei kleinen Mengen? | nicht vorgesehen |
| Bestellung im Shop | noch nicht: Shopify-Produkt „Biomarker“ mit einer Variante je Wert anlegen, dann Warenkorb anbinden |

Mit den Platzhaltern passen 15 Werte à 100 µl nicht in 3 Tasso-Geräte (1.500 µl brauchen 5 Röhrchen). Ob das Limit von 15 Werten oder die Tasso-Grenze zuerst greift, hängt von den echten Blutmengen ab.
