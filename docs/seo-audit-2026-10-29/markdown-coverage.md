# Markdown-Abdeckung und Entdeckbarkeit für Sprachmodelle

**Stand:** 29.10.2026 · **Status:** abgeschlossen (Bestandsaufnahme), keine Umsetzung · **Gehört zu:** [site-audit.md](site-audit.md)

## Worum es geht

Das Audit-Verfahren prüft neben klassischem SEO, ob der Shop seine Inhalte zusätzlich als Markdown anbietet. Gemeint sind eine `llms.txt`, eine `sitemap.md` und je indexierbarer Seite eine `.md`-Fassung mit demselben Inhalt. Das ist eine Anforderung, die der Betreiber für sich festlegen kann. Weder Google noch andere Suchmaschinen oder KI-Anbieter verlangen sie, und niemand garantiert, dass ein Modell diese Dateien liest oder zitiert.

## Bestand

| Element | Zustand am 29.10. |
|---|---|
| `/llms.txt` | vorhanden, Englisch, 20 Links, alle 20 erreichbar (Status 200). Verweist auf Kollektionen, Ratgeber-Übersicht, Blog, Service, `agents.md`, UCP-Profil und XML-Sitemap. |
| `/agents.md` | vorhanden, `text/markdown; charset=utf-8`. Anleitung für Einkaufs-Agenten (Shop-Skill, UCP). |
| `/.well-known/ucp` | vorhanden, JSON, von Shopify durchgereicht. |
| `/sitemap.md` | fehlt (404). |
| `.md`-Fassungen der Seiten | fehlen. Stichproben `/products/sti-standard-5.md` und `/index.md` liefern 404. |
| `/en/llms.txt` | fehlt (404). Die eine `llms.txt` ist englisch und deckt beide Sprachen ab. |
| Hinweise in `robots.txt` und XML-Sitemap auf Markdown | keine. |

## Grundgesamtheit

848 indexierbare Seiten mit eigenem Canonical (ohne Weiterleitungen, ohne Parameter, ohne `noindex`):

| Seitentyp | Anzahl |
|---|---|
| Seiten und Ratgeber | 410 |
| Blogartikel | 200 |
| Produkte | 172 |
| Kollektionen | 44 |
| Blog-Übersichten | 18 |
| Startseite und Blog | 4 |

Davon haben 0 eine Markdown-Fassung. Die Abdeckung ist also 0 von 848.

## Befunde

- **MD1 · Keine Markdown-Fassungen · bestätigt · Entscheidung offen:** Ob DoctorBox Markdown-Fassungen anbieten will, ist eine Betreiber-Entscheidung. Für einen Shop mit 410 Ratgeberseiten könnte es sinnvoll sein, Ratgeber und Produktinformationen sauber lesbar anzubieten. Ein messbarer Nutzen ist nicht belegt.
- **MD2 · `llms.txt` verweist auf gesperrte Seiten · bestätigt · Priorität niedrig:** Versand- und Rückgabeseiten liegen unter `/policies/`, das in `robots.txt` gesperrt ist. Für Menschen und Agenten ist der Link nützlich, Crawler, die `robots.txt` beachten, lesen die Seiten aber nicht.
- **MD3 · Abhängigkeit von C1 · bestätigt:** Eine Markdown-Fassung der FAQ- oder Testergebnis-Seiten wäre derzeit genauso unvollständig wie die HTML-Seite (siehe Befund C1 im Audit). Erst die Inhalte vervollständigen.

## Falls umgesetzt werden soll

1. Entscheidung treffen, welche Seitentypen eine Markdown-Fassung bekommen. Vorschlag: Ratgeber, Blogartikel, Produkte, Kollektionen.
2. Markdown aus denselben Shopify-Daten erzeugen wie das HTML, damit Inhalt und Stand übereinstimmen. Preise und Verfügbarkeit mit Zeitstempel.
3. `sitemap.md` mit allen Markdown-Fassungen und je eine Zeile in `llms.txt`, `robots.txt` (Kommentar) und XML-Sitemap (Kommentar), die darauf verweist. Bestehende Regeln bleiben unverändert.
4. Ausgabe mit `text/markdown; charset=utf-8`, Canonical-Strategie festlegen (die HTML-Seite bleibt kanonisch).
5. Pflege festlegen: Wer prüft nach Inhaltsänderungen, dass beide Fassungen übereinstimmen.

## Grenzen

- Geprüft wurde die Vercel-Domain. Nach dem DNS-Umzug die Links in `llms.txt` erneut abrufen.
- Ob und wie KI-Systeme `llms.txt` oder Markdown-Fassungen nutzen, wurde nicht gemessen.
