# Anleitungsseiten (IFU): Stand und offene Punkte

Stand: 06.11.2026

## Seiten

| Seite | Für welche Sets | Status |
|---|---|---|
| [/ifu/tasso](https://shop.doctorbox.de/ifu/tasso) | Tests mit Tasso+ (Serum und EDTA) | **live** |
| /ifu/dbs | Trockenblut-Tests (u. a. Vitamin B12) | **live, nicht verlinkt** |
| /ifu/urin-dbs-rektal | STI Complete Trio Männer, STI Pro (Urin + Trockenblut), STI Standard (Urin + Trockenblut), STI Basic (Rektal), STI Basic (Urin), STI Essential (Urin), STI Select | **live, nicht verlinkt** |
| /ifu/vaginal-dbs-rektal | STI Complete Trio Frauen, STI Pro (Vaginal + Trockenblut), STI Standard (Vaginal + Trockenblut), STI Basic (Vaginalabstrich), STI Essential (Vaginalabstrich) | **live, nicht verlinkt** |

Übersicht aller Seiten: `/ifu`.

## Offen

### Dokumente, die fehlen

| # | Was | Wo es fehlt | Wer / Status |
|---|---|---|---|
| 1 | **DoctorBox-Schritt-für-Schritt-Anleitungen (PDF)** | alle 4 Seiten; oben steht „Anleitung öffnen (PDF): folgt“ | intern, PDFs liefern |
| 2 | **Gebrauchsanweisung BD Microtainer® K2EDTA-Röhrchen (lila Kappe)**, deutsch | /ifu/tasso („folgt“) | bei BD angefragt (Frau Schlüter), dabei auch gefragt: Darf das PDF auf die Website? Ist die Serum-IFU (Version 01, 2022-02) noch aktuell? |
| 3 | **Aktuelle Konformitätserklärung LEINASAN Wundkompresse** | DBS-Teil (alle Seiten außer Tasso) | bei Leina-Werke angefragt. Die hinterlegte vom 07.03.2022 (MDD 93/42/EWG) ist seit 04.08.2023 abgelaufen und sollte **nicht live** gehen. Mit der neuen Erklärung die CE-Nummer prüfen (bisher 0197). |
| 4 | **Copan HPC146R05** (zweites Dokument zum Self Vaginal FLOQSwab®, REF 552C.80) | /ifu/vaginal-dbs-rektal | klären: Gibt es das als eigenes PDF oder ist es durch HPI031R05 abgedeckt? Eingebaut ist nur HPI031R05. |

### Vor dem Livegang klären

| # | Was |
|---|---|
| 5 | **Regulatory-Check der Hinweise in den Hersteller-PDFs:** Tasso+ IFU enthält „Nur auf Rezept“, Aptima-IFU enthält „Nur zum US-Export“. |
| 6 | **LEINASAN-Link:** erledigt, Link ist raus (06.11.2026); die abgelaufene Erklärung liegt nur lokal (`public/ifu/dbs/leinasan-konformitaetserklaerung.pdf`, nicht im Repo). Mit der neuen Erklärung wieder `conformity` setzen. |
| 7 | **Vaginal-IFU verkleinern:** `self-vaginal-floqswab-gebrauchsanweisung.pdf` ist 16 MB, lädt auf dem Handy langsam. |
| 8 | ~~Freigabe~~ erledigt: alle Seiten live seit 06.11.2026, bewusst nirgends verlinkt (nicht in Navigation, Footer, Sitemap). |

## Geklärt (keine Dokumente nötig oder vorhanden)

- **Keine IFU vom Hersteller:** MaiMed® Handschuh (nur technisches Datenblatt, verlinkt; CE 0123 laut Datenblatt), LEINASAN, Leerröhrchen 12 × 80 mm, Versandbeutel, Druckverschlussbeutel mit Trockenmittel.
- **Angaben auf der Verpackung:** Soft-Zellin®, DermaPlast® (zusätzlich Konformitätserklärung verlinkt), Wärmebeutel (MD, CE 1936), Sicherheitsbeutel.
- **Angaben auf dem Produkt:** Safe2Pcanter Urinbecher (zusätzlich technisches Datenblatt, englisch).
- **Hersteller-IFU vorhanden:** Tasso+ (PN0762-01 Rev. 03), BD Serum (Version 01, 2022-02), TFN BioSample Card (Rev. 14), Unistik® Touch (IFU MCC 0220/04), Aptima Urin (AW-26251-801 Rev. 001, plus Entnahmeanleitung), Rectal Self FLOQSwab® (HPI068R00, 2023-11), Self Vaginal FLOQSwab® (HPI031R05, 2022-05).
- **Produktbilder** und **Stückzahlen** sind bewusst raus (04.11.2026), auf /ifu/tasso auch live.

## Technik: wo was liegt

- Inhalte aller Seiten: `src/content/ifu.ts` (Bestandteile, Gruppen nach Probenahme, Set-Listen `kits`, Texte de/en).
- Seitenlayout: `src/app/[locale]/ifu/[slug]/page.tsx`, Übersicht: `src/app/[locale]/ifu/page.tsx`.
- PDFs: `public/ifu/<ordner>/` (tasso, dbs, urin, rektal, vaginal).
- Neue Hersteller-IFU einbauen: PDF nach `public/ifu/<ordner>/` legen, beim Bestandteil `ifu.href` und `ifu.version` setzen.
- DoctorBox-Anleitung einbauen: PDF ablegen und beim Set `doctorbox: "/ifu/<ordner>/<datei>.pdf"` setzen.
- Konformitätserklärung: Feld `conformity`; weiteres Dokument (Datenblatt, Entnahmeanleitung): Feld `extra`.
