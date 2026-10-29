/**
 * Lab biomarker list (CSV, ";"-separated, German decimals) → src/content/kit/biomarkers.json
 *
 *   node scripts/kit-import.mjs docs/individuelle-sets/<liste>.csv [--placeholder]
 *
 * Columns: kuerzel;name_de;name_en;thema;thema_en;material;blutmenge_ul;preis_eur;laborcode;hinweis
 * (thema_en, laborcode and hinweis are optional)
 * Materials must exist in src/content/kit/rules.ts. Stops on any invalid row.
 */
import fs from "node:fs";

const [file, flag] = process.argv.slice(2);
if (!file) {
  console.error("usage: node scripts/kit-import.mjs <csv> [--placeholder]");
  process.exit(1);
}
const lines = fs.readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
const head = lines.shift().split(";").map((h) => h.trim().toLowerCase());
const need = ["kuerzel", "name_de", "name_en", "thema", "material", "blutmenge_ul", "preis_eur"];
const missing = need.filter((c) => !head.includes(c));
if (missing.length) {
  console.error(`missing columns: ${missing.join(", ")}`);
  process.exit(1);
}
const num = (v) => Number(String(v).trim().replace(/\s|€/g, "").replace(/\.(?=\d{3}\b)/g, "").replace(",", "."));
const errors = [];
const ids = new Set();
const items = lines.map((line, i) => {
  const cells = line.split(";");
  const row = Object.fromEntries(head.map((h, j) => [h, (cells[j] ?? "").trim()]));
  const at = `row ${i + 2} (${row.kuerzel || "?"})`;
  const volumeUl = num(row.blutmenge_ul);
  const price = num(row.preis_eur);
  if (!row.kuerzel) errors.push(`${at}: kuerzel empty`);
  if (ids.has(row.kuerzel)) errors.push(`${at}: kuerzel twice`);
  ids.add(row.kuerzel);
  if (!row.name_de) errors.push(`${at}: name_de empty`);
  if (!row.material) errors.push(`${at}: material empty`);
  if (!Number.isFinite(volumeUl) || volumeUl < 0) errors.push(`${at}: blutmenge_ul "${row.blutmenge_ul}"`);
  if (!Number.isFinite(price) || price <= 0) errors.push(`${at}: preis_eur "${row.preis_eur}"`);
  return {
    id: row.kuerzel,
    name: { de: row.name_de, en: row.name_en || row.name_de },
    topic: { de: row.thema || "Weitere Werte", en: row.thema_en || row.thema || "Other values" },
    material: row.material,
    volumeUl,
    price: Math.round(price * 100) / 100,
    ...(row.laborcode ? { labCode: row.laborcode } : {}),
    ...(row.hinweis ? { note: row.hinweis } : {}),
  };
});
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const out = { source: file.split("/").pop(), placeholder: flag === "--placeholder", importedAt: new Date().toISOString().slice(0, 10), items };
fs.writeFileSync("src/content/kit/biomarkers.json", JSON.stringify(out, null, 1) + "\n");
console.log(`${items.length} biomarkers → src/content/kit/biomarkers.json${out.placeholder ? " (placeholder)" : ""}`);
