# SEO-Audit Headless-Shop DoctorBox

**Stand:** 29.10.2026 · **Status:** abgeschlossen für den Stichtag, Maßnahmen noch nicht umgesetzt · **Erstellt von:** Claude (Audit), Auftraggeber Mirko Meister

## 1. Auftrag und Umfang

| Punkt | Festlegung |
|---|---|
| Ziel | Vor dem DNS-Umzug prüfen, ob der neue Headless-Shop technisch, inhaltlich und strukturell mindestens so gut auffindbar ist wie der alte Shopify-Shop. Risiken für Rankings, Crawling und Messung benennen. |
| Geprüfte Umgebung | Produktions-Build auf `https://shop-doctorbox-new.vercel.app` (Commit-Stand 29.10.2026, nach `6ffead4`). Canonicals, Sitemap und hreflang zeigen bereits auf `https://shop.doctorbox.de`. |
| Vergleich | Alter Shop `https://shop.doctorbox.de` (Shopify-Theme, live). |
| Sprachen | Deutsch (`/`) und Englisch (`/en`). |
| Grundgesamtheit | Alle 844 URLs der neuen XML-Sitemap plus alle intern verlinkten URLs (1.335 abgerufen). Alle 1.711 URLs der alten Shopify-Sitemap für die Migrationsprüfung. |
| Abruf | Eigener Crawler mit Googlebot-Kennung (Next liefert Bots die Metadaten im `<head>`), 6 parallele Anfragen, keine Anmeldung. |
| Nicht im Umfang | Google Search Console, Analytics, Server-Logs, Felddaten (CrUX), Backlinks, Wettbewerber, KI-Sichtbarkeit (kein Research Pack), Umsetzung von Änderungen. |
| Verantwortliche | Entwicklung (Code, Vercel), Content/Shopify-Pflege (Texte, Übersetzungen, Metafelder), Marketing (Messung). Namen bitte in Abschnitt 6 eintragen. |

## 2. Evidenz

| Quelle | Inhalt | Datei |
|---|---|---|
| Crawl neue Seite | 1.335 URLs: Status, Weiterleitungen, Canonical, robots, Titel, Beschreibung, H1, hreflang, JSON-LD, Bilder, Wörter, interne Links, Antwortzeit | [raw/crawl-pages.csv](raw/crawl-pages.csv) |
| Defekte interne Links | 126 Verweise auf 37 nicht erreichbare Ziele, mit Quellseite | [raw/broken-internal-links.csv](raw/broken-internal-links.csv) |
| Migration | 1.711 URLs der alten Sitemap gegen den neuen Shop | [raw/migration-old-sitemap.csv](raw/migration-old-sitemap.csv) |
| Labor-Performance | 6 Seitentypen, Handy-Emulation, 4-fach CPU-Drosselung, 1,6 Mbit/s, 150 ms Latenz, je 2 Läufe | [raw/lab-performance.json](raw/lab-performance.json) |
| Build-Manifest | `.next/prerender-manifest.json` des lokalen Produktions-Builds vom 29.10. | nicht abgelegt, Befund T1 |
| Header-Stichproben | `curl` auf Startseite, Produkt, Kollektion, Artikel | Befunde T1, T2, T3 |
| Inhaltsvergleich alt/neu | Wortzahl im Hauptbereich für 56 dünne Seiten | Befund C1 |

## 3. Das Wichtigste in Kürze

**Gut:** Die Migration ist vollständig. Alle 1.711 alten URLs führen auf eine funktionierende Seite. hreflang ist auf allen indexierbaren Seiten vollständig und wechselseitig, `lang` stimmt, jede Seite hat genau einen Titel, eine Beschreibung und ein Canonical. Strukturierte Daten parsen fehlerfrei. CLS ist auf allen gemessenen Seiten 0.

**Vor dem Umzug beheben:**

1. **Kein Caching (T1):** Keine einzige Seite wird vorab erzeugt oder am CDN zwischengespeichert. Jede Anfrage rendert neu.
2. **Server-Region USA (T2):** Die Server-Funktionen laufen in Washington (iad1), nicht in Frankfurt.
3. **Fehlende Inhalte (C1):** Fünf Seiten in zwei Sprachen verlieren gegenüber dem alten Shop den Großteil ihres Inhalts, darunter die FAQ.
4. **Defekte Links (L1):** 126 interne Links aus Ratgeber- und Blogtexten führen auf 404-Seiten.
5. **Vercel-Domain indexierbar (T3):** Nach dem Umzug bleibt `shop-doctorbox-new.vercel.app` öffentlich erreichbar und ohne `noindex`.

## 4. Befunde

Einstufung: **bestätigt** = durch Abruf belegt. **Hypothese** = plausible Ursache, vor Umsetzung prüfen. **Hinweis** = kein Fehler, Verbesserung.

### 4.1 Technik und Indexierung

**T1 · Alle Seiten werden dynamisch gerendert · bestätigt · Priorität hoch · Entwicklung**
- Beleg: Alle 1.234 HTML-Antworten tragen `cache-control: private, no-cache, no-store` und `x-vercel-cache: MISS`. Das Prerender-Manifest des Produktions-Builds enthält nur 6 Einträge (Icons, robots.txt, Fehlerseiten), keine einzige Shop-Seite. Die in den Seiten gesetzten `revalidate`-Werte (300 bis 3600 Sekunden) und `generateStaticParams` wirken also nicht.
- Ursache (Hypothese): `src/app/[locale]/not-found.tsx` ruft `headers()` auf. Die 404-Seite gehört zu jedem Routenbaum unter `[locale]` und macht damit vermutlich alle Routen dynamisch.
- Wirkung: höhere Antwortzeiten, mehr Shopify-API-Anfragen pro Seitenaufruf, Lastspitzen beim Crawlen, höhere Vercel-Kosten.
- Empfehlung: Sprache in der 404-Seite ohne `headers()` bestimmen, zum Beispiel über einen eigenen `not-found` pro Sprachsegment oder einen Client-Teil. Danach Build-Ausgabe prüfen: Produkt-, Kollektions- und Artikelseiten müssen als vorab erzeugt (●) erscheinen.

**T2 · Server-Funktionen laufen in den USA · bestätigt · Priorität hoch · Entwicklung**
- Beleg: Header `x-vercel-id: fra1::iad1::…`. Die Anfrage kommt am Frankfurter Edge an, die Seite wird aber in iad1 (Washington) gerendert.
- Wirkung: Jede ungecachte Seite trägt eine Transatlantik-Strecke. Gemessene Antwortzeit (TTFB) aus Deutschland: Median 285 ms, 90 % unter 583 ms, Produktseite einzeln bis 1,0 s.
- Empfehlung: Funktionsregion in Vercel auf `fra1` stellen (Projekteinstellungen oder `regions` in `vercel.json`).

**T3 · Vercel-Domain ist indexierbar · bestätigt · Priorität mittel · Entwicklung**
- Beleg: `https://shop-doctorbox-new.vercel.app/robots.txt` erlaubt alles, Seiten senden kein `X-Robots-Tag`. Die Canonicals zeigen zwar auf `shop.doctorbox.de`, aber Google kann die Vercel-Kopie trotzdem aufnehmen, wenn sie verlinkt wird.
- Empfehlung: Für alle Hosts außer `shop.doctorbox.de` den Header `X-Robots-Tag: noindex` setzen (Proxy) und in `robots.txt` alles sperren. Das kann sofort gelten: `noindex` betrifft nur Suchmaschinen, Tests auf der Vorschau laufen weiter.

**T4 · Sonderzeichen in Produkt-URLs uneinheitlich · bestätigt · Priorität mittel · Entwicklung**
- Beleg: 5 Produkte mit „®“ im Handle (ColoAlert, Vitamin D3 biomo®) stehen in der Sitemap mit rohem `®`, im Canonical und in internen Links aber als `%C2%AE`. Je Sprache entstehen so zwei Schreibweisen derselben Seite; die Sitemap-Variante hat keine eingehenden Links.
- Empfehlung: URLs in `sitemap.ts` mit `encodeURI` ausgeben, damit Sitemap, Canonical und Links identisch sind.

**T5 · Technische Shopify-Kollektionen sind indexierbar · bestätigt · Priorität mittel · Content und Entwicklung**
- Beleg: `home-page`, `produkte`, `unsere-heimtests`, `vorsorge-kampagne` und weitere stehen in der Sitemap. Startseite und vier dieser Kollektionen teilen sich dieselbe Beschreibung („Teste deine Gesundheit bequem von zu Hause …“), je Sprache 8 Seiten. `/collections/produkte` ist mit 1 MB HTML die schwerste Seite des Shops.
- Empfehlung: Rein technische Kollektionen auf `noindex` setzen und aus der Sitemap nehmen oder auf `/collections` weiterleiten. Verbleibende Kollektionen mit eigener Beschreibung versehen.

**T6 · Sitemap unvollständig · bestätigt · Priorität mittel · Entwicklung**
- Beleg: Die eigenen Seiten `/pages/tasso`, `/pages/apotheken` und `/pages/eigener-test` (je DE und EN) sind indexierbar, auf jeder Seite verlinkt, fehlen aber in der Sitemap.
- Empfehlung: Eigene Routen in `sitemap.ts` aufnehmen.

**T7 · Doppeltes Produkt „Winteraktion“ · bestätigt · Priorität niedrig · Content**
- Beleg: `/products/vitamin-d-test-winteraktion` hat denselben Titel und dieselbe Beschreibung wie `/products/vitamin-d-test` (DE und EN), beide mit eigenem Canonical.
- Empfehlung: Kampagnenprodukt nach Ende auf das Hauptprodukt weiterleiten oder Canonical auf das Hauptprodukt setzen.

**Hinweis · robots.txt:** Die Sperren für Warenkorb, Suche, Checkout, Sortier-Parameter und `/policies/` entsprechen dem Shopify-Standard. Die Zeile `Host:` wird von Google ignoriert und kann bleiben.

### 4.2 Performance

**P1 · LCP der Startseite knapp über dem Zielwert · bestätigt (Labor) · Priorität mittel · Entwicklung**

| Seitentyp | LCP | FCP | CLS | TBT | Transfer | davon JS |
|---|---|---|---|---|---|---|
| Startseite | 2,9 s (2. Lauf 3,8 s) | 1,9 s | 0 | 166 ms | 626 KB | 312 KB |
| Kollektion | 2,0 s | 1,8 s | 0 | 161 ms | 548 KB | 316 KB |
| Produkt | 2,4 s | 2,0 s | 0 | 194 ms | 525 KB | 316 KB |
| Blogartikel | 1,4 s | 1,4 s | 0 | 161 ms | 494 KB | 311 KB |
| Ratgeber | 1,8 s | 1,8 s | 0 | 164 ms | 473 KB | 311 KB |
| Supplements | 2,1 s | 1,6 s | 0 | 166 ms | 524 KB | 316 KB |

- Das LCP-Element der Startseite ist das Hero-Bild. Google wertet LCP bis 2,5 s als gut.
- Empfehlung: Hero-Bild mit hoher Ladepriorität und passenden `sizes` ausliefern, kleinere Bildvariante für Mobil. Zusammen mit T1 und T2 sinkt auch die Startzeit.
- Grenze: Labormessung, keine Felddaten. Vor einer Bewertung CrUX bzw. Search Console „Core Web Vitals“ nach dem Umzug prüfen.

**P2 · Sehr große HTML-Antworten · bestätigt · Priorität niedrig · Entwicklung**
- Beleg: Median 289 KB HTML, `/collections/produkte` 1.049 KB, `/collections` und `/pages/unsere-heimtests` rund 900 KB. Ursache ist die mitgelieferte Produktdatenmenge.
- Empfehlung: Produktlisten auf großen Übersichten begrenzen oder nachladen, nur benötigte Felder übergeben.

### 4.3 Migration und Weiterleitungen

**M1 · Migration vollständig · bestätigt**
- 1.711 alte URLs: 841 direkt erreichbar, 854 nach einer Weiterleitung, 16 nach zwei Weiterleitungen, keine Fehler. Zwei Länder-Startseiten (`/de-at`, `/en-at`) führen auf die Startseite, das ist passend.

**M2 · Zweistufige Weiterleitungen · bestätigt · Priorität niedrig · Entwicklung**
- 16 alte URLs mit `/de-at`-Präfix leiten zweimal weiter (zum Beispiel `/de-at/pages/unsere-heimtests` → `/pages/unsere-heimtests` → `/collections`). Empfehlung: direkt auf das Endziel leiten.

**M3 · Interne Links auf Weiterleitungen · bestätigt · Priorität niedrig · Content**
- `/pages/unsere-heimtests` ist je Sprache 7-mal verlinkt und leitet auf `/collections`. Dazu kommen alte Blog-Pfade in Artikeltexten. Empfehlung: Links auf das Ziel ändern.

### 4.4 Interne Links

**L1 · Defekte interne Links · bestätigt · Priorität hoch · Content und Entwicklung**
- 126 Links auf 37 Ziele mit 404, vollständige Liste in [raw/broken-internal-links.csv](raw/broken-internal-links.csv).
- **Englische Produkt-Handles (70 404-URLs, 17 Handles):** Englische Ratgeber- und Blogtexte verlinken auf übersetzte Handles wie `/en/products/bloodsugar-hba1c`, `liver-check`, `kidney-check`, `hormone-check-for-men`, `nutrient-all-round-check`. Diese gab es auch im alten Shop nie; sie sind dort ebenfalls 404.
- **Entfernte Produkte und Seiten:** `proaktiv`, `proaktiv-manner`, `proaktiv-frauen`, `proaktiv-darmcheck`, `prostata-vorsorge`, `darmgesundheits-check`, `sti-essential`, `allergietest-inhalationsallergene` sowie fünf `/pages/proaktiv*`-Seiten. Dazu drei Blogartikel-Pfade, die nicht mehr existieren.
- **Kaputte Links im Text:** `href="www.doctorbox.de"` ohne Protokoll (6 Verweise) und ein Bildnachweis von Freepik, dessen HTML als Link-Ziel gespeichert ist.
- Empfehlung: Für die 17 englischen Handles und die entfernten Produkte Weiterleitungen auf das passende Produkt anlegen. Die Texte in Shopify bereinigen.

**L2 · Interne Links mit UTM-Parametern · bestätigt · Priorität mittel · Content oder Entwicklung**
- 397 interne Links auf rund 165 Ratgeberseiten tragen `utm_source=ratgeber` bzw. `utm_source=counselor`.
- Wirkung: In GA4 startet bei jedem Klick eine neue Sitzung mit falscher Quelle, die ursprüngliche Herkunft (zum Beispiel Google organisch) geht verloren. Für Suchmaschinen entstehen Duplikat-URLs, die per Canonical aufgefangen werden.
- Empfehlung: UTM-Parameter beim Rendern aus internen Links entfernen oder in den Shopify-Texten löschen. Für Auswertungen interner Klicks ein GA4-Ereignis statt UTM verwenden.

### 4.5 Seiteninhalte

**C1 · Inhalte aus Theme-Abschnitten fehlen · bestätigt · Priorität hoch · Entwicklung und Content**

| Seite | Wörter alt | Wörter neu |
|---|---|---|
| `/pages/faqs` (EN) | 916 (902) | 115 (140) |
| `/pages/mein-testergebnis` (EN) | 847 (908) | 156 (180) |
| `/pages/sets-komponenten` (EN) | 479 (613) | 14 (20) |
| `/pages/collab` (EN) | 526 (589) | 79 (93) |
| `/pages/doctorbox-heimtest-berater` (EN) | 190 (212) | 47 (55) |

- Ursache: Im alten Theme kamen diese Inhalte aus Theme-Abschnitten (Akkordeons, Blöcke), nicht aus dem Seitentext. Der neue Shop rendert nur den Seitentext. Auf der FAQ-Seite stehen deshalb nur die Fragen ohne Antworten.
- Empfehlung: Inhalte in den Seitentext oder in Metaobjekte übernehmen und rendern. FAQ zusätzlich mit `FAQPage`-Daten auszeichnen, wie es auf den Produktseiten schon geschieht.

**C2 · Leere Ratgeber-Seiten · bestätigt · Priorität mittel · Content**
- 5 Ratgeberseiten je Sprache haben nur rund 20 Wörter Inhalt, auch schon im alten Shop: `aktive-regeneration-zone-2-mobility`, `sport-in-der-schwangerschaft`, `pool-schwimmen-technik-intervalle`, `rosazea-rotungen-triggers-managen`, `hautschutz-beim-sport-sonne-kalte-reibung`.
- Empfehlung: Füllen oder bis dahin auf `noindex` setzen.

**C3 · Dünne Blog-Kategorien · bestätigt · Priorität niedrig · Content**
- `/blogs/dna-analysen` (59 Wörter), `/blogs/frauengesundheit` (139), `/blogs/vorsorge-fruherkennung` (176) haben kaum eigenen Text. Empfehlung: kurze Einleitung pro Kategorie.

**C4 · Mehrere H1 auf Produktseiten · bestätigt · Priorität mittel · Entwicklung**
- 105 Produktseiten (DE und EN) haben zwei H1. Die zweite stammt aus dem Shopify-Beschreibungstext. Empfehlung: Überschriften der Beschreibung beim Rendern um eine Stufe absenken (H1 → H2).

**C5 · HTML in Meta-Beschreibungen · bestätigt · Priorität niedrig · Entwicklung**
- 4 Seiten (`vitamin-d-test`, `vitamin-d-test-winteraktion`, DE und EN) beginnen die Beschreibung mit `<p>`. Empfehlung: HTML aus SEO-Beschreibungen entfernen.

**C6 · Lange Titel · Hinweis · Priorität niedrig · Content**
- 488 indexierbare Seiten haben Titel über 60 Zeichen, vor allem Ratgeber (325) und Blogartikel (145). Google kürzt sie in den Suchergebnissen. Kein Fehler, aber das Ende „| DoctorBox“ fällt meist weg.

**C7 · Gesundheitsinhalte ohne benannte Autoren · bestätigt · Priorität mittel · Content**
- Artikel- und Ratgeberseiten nennen als Autor nur die Organisation, ohne fachliche Prüfung und ohne Änderungsdatum. Bei Gesundheitsthemen gewichtet Google Expertise und Vertrauen besonders.
- Empfehlung: Wo vorhanden, Autorin oder Autor und fachliche Prüfung mit Qualifikation nennen und ein „Zuletzt geprüft“-Datum zeigen.

### 4.6 Internationalisierung

**I1 · hreflang korrekt · bestätigt**
- Alle indexierbaren Seiten haben `de`, `en` und `x-default`. Alle Verweise sind wechselseitig und zeigen auf erreichbare, indexierbare Seiten. `lang` stimmt auf allen Seiten.

**I2 · Englische Seiten mit deutschen Metadaten · bestätigt · Priorität mittel · Content**
- 73 englische Seiten haben denselben Titel und 72 dieselbe Beschreibung wie die deutsche Version, oft auf Deutsch. Betroffen sind 27 Produkte, 37 Blogartikel, 5 Kollektionen und 3 Seiten. Beispiel: `/en/products/nierenfunktion-uacr` beschreibt sich mit „Überprüfe deine Nierengesundheit …“.
- Empfehlung: SEO-Titel und -Beschreibungen in Shopify (Translate & Adapt) übersetzen. Liste über [raw/crawl-pages.csv](raw/crawl-pages.csv) filterbar.

### 4.7 Strukturierte Daten

**S1 · Produktdaten ohne Versand und Rückgabe · bestätigt · Priorität mittel · Entwicklung**
- Alle 172 indexierbaren Produktseiten haben `Product` mit Angebot, Preis, Währung und Verfügbarkeit. Es fehlen auf allen `shippingDetails` und `hasMerchantReturnPolicy`; Google meldet das für Händlereinträge als Warnung. Keine GTIN oder MPN (Eigenmarke, unkritisch). Bewertungen stehen nur dort, wo es welche gibt.
- Empfehlung: Rückgaberichtlinie einmal an der Organisation hinterlegen, Versanddetails je Angebot ergänzen.

**S2 · Weitere Auszeichnungen · bestätigt**
- Startseite: `Organization` und `WebSite`. Kollektionen: `BreadcrumbList`. Artikel und Ratgeber: `Article` und `BreadcrumbList`. Produkte zusätzlich `FAQPage`; Google zeigt FAQ-Ergebnisse seit 2023 nur noch für ausgewählte Behörden- und Gesundheitsportale, ein Nachteil entsteht nicht.

### 4.8 Bilder und Teilen

**B1 · Fehlende Alt-Texte · bestätigt · Priorität niedrig · Content**
- 18 Bilder ohne `alt`-Attribut auf 12 Seiten (10 Ratgeber, 2 Produkte). Leere Alt-Texte bei Galerie-Vorschaubildern sind gewollt.

**B2 · Fehlendes Vorschaubild beim Teilen · bestätigt · Priorität niedrig · Entwicklung**
- 440 Seiten ohne `og:image`, darunter Startseite, Kollektionen, Blog-Übersichten und Ratgeber. Empfehlung: Standardbild setzen, für Kollektionen und Ratgeber das jeweilige Titelbild.

### 4.9 KI-Suche und Agenten

- Vorhanden: `llms.txt` (Englisch, 20 Links), `agents.md`, UCP-Profil unter `/.well-known/ucp`, `Link`-Header mit `rel="ucp"`.
- `llms.txt` verlinkt Versand- und Rückgabeseiten unter `/policies/`, die in `robots.txt` gesperrt sind.
- Markdown-Fassungen der Seiten und eine `sitemap.md` gibt es nicht. Details in [markdown-coverage.md](markdown-coverage.md).
- Eine Aussage zur Sichtbarkeit in KI-Antworten ist ohne Messung nicht möglich.

## 5. Grenzen

- Keine Search-Console-, Analytics- oder Logdaten. Indexierungsstand, Rankings und echte Nutzerwerte sind nicht bewertet.
- Performance nur im Labor, Felddaten fehlen.
- Der Crawl folgt Links in HTML. Inhalte, die erst im Browser per JavaScript nachgeladen werden, sind nicht erfasst.
- Shopify-Inhalte (Texte, Übersetzungen) wurden in der ausgelieferten Form geprüft, nicht im Shopify-Admin.
- Wortzahlen messen Umfang, nicht Qualität.
- Der Stand gilt für die Vercel-Domain. Nach dem DNS-Umzug sollten T3, M1 und I1 auf `shop.doctorbox.de` erneut geprüft werden.

## 6. Maßnahmen nach Priorität

| Prio | ID | Maßnahme | Verantwortlich | Aufwand | Vor Umzug |
|---|---|---|---|---|---|
| hoch | T1 | Caching wiederherstellen (404-Seite ohne `headers()`), Build-Ausgabe prüfen | Entwicklung | klein | ja |
| hoch | T2 | Vercel-Funktionsregion `fra1` | Entwicklung | sehr klein | ja |
| hoch | C1 | FAQ, Mein Testergebnis, Sets & Komponenten, Collab, Heimtest-Berater vervollständigen | Entwicklung + Content | mittel | ja |
| hoch | L1 | Weiterleitungen für 17 englische Handles und entfernte Produkte, Texte bereinigen | Entwicklung + Content | mittel | ja |
| mittel | T3 | `noindex` für alle Hosts außer `shop.doctorbox.de` | Entwicklung | klein | mit Umzug |
| mittel | L2 | UTM-Parameter aus internen Links entfernen | Entwicklung | klein | ja |
| mittel | C4 | H1 in Produktbeschreibungen absenken | Entwicklung | klein | nein |
| mittel | T4, T6 | Sitemap: URLs kodieren, eigene Seiten aufnehmen | Entwicklung | klein | ja |
| mittel | T5 | Technische Kollektionen aus Index und Sitemap nehmen | Content + Entwicklung | klein | nein |
| mittel | S1 | Versand- und Rückgabedaten im Produkt-Schema | Entwicklung | klein | nein |
| mittel | I2 | Englische SEO-Titel und -Beschreibungen übersetzen | Content | mittel | nein |
| mittel | C2, C7 | Leere Ratgeber füllen oder `noindex`; Autoren und Prüfung nennen | Content | mittel | nein |
| mittel | P1 | Hero-Bild der Startseite optimieren, danach Felddaten prüfen | Entwicklung | klein | nein |
| niedrig | M2, M3, T7, C3, C5, C6, B1, B2, P2 | Einzelkorrekturen laut Abschnitt 4 | gemischt | klein | nein |

Die Maßnahmen sind Vorschläge. Umgesetzt wird erst nach Freigabe.

## 7. Nächste Schritte

1. Verantwortliche in Abschnitt 6 eintragen und die Punkte „vor Umzug“ freigeben.
2. Nach Umsetzung von T1 und T2 die Labormessung wiederholen ([raw/lab-performance.json](raw/lab-performance.json) als Ausgangswert).
3. Nach dem DNS-Umzug: Crawl und Migrationsprüfung auf `shop.doctorbox.de` wiederholen, Sitemap in der Search Console einreichen, Abdeckung und Core Web Vitals nach 2 bis 4 Wochen ansehen.
