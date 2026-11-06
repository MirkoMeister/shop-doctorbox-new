// Checks of the supplement mix (issue #12) without extra dependencies: amount parsing, exact µg→mg
// conversion and the sellable ingredient list. Run: node scripts/test-supplement-mix.mjs
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import assert from "node:assert/strict";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");
const out = mkdtempSync(join(tmpdir(), "mix-test-"));
/** transpiles one TS module to ESM, mapping "@/…" imports to files in src/ */
function load(rel, name) {
  const src = readFileSync(join(root, rel), "utf8");
  let js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  js = js.replace(/from "@\/([^"]+\.json)";/g, (_, p) => `from ${JSON.stringify(pathToFileURL(join(root, "src", p)).href)} with { type: "json" };`);
  js = js.replace(/^import type .*$/gm, "");
  const file = join(out, name);
  writeFileSync(file, js);
  return import(pathToFileURL(file).href);
}

const engine = await load("src/lib/supplement-mix/engine.ts", "engine.mjs");
const { PRODUCT_CONFIG } = await load("src/content/supplement-mix/product-config.ts", "config.mjs");
let n = 0;
const check = (fn, label) => { fn(); n++; console.log("ok", label); };

check(() => {
  assert.equal(engine.parseAmount("20"), "20");
  assert.equal(engine.parseAmount("0,5"), "0.5");
  assert.equal(engine.parseAmount("1.50"), "1.5");
  for (const bad of ["", "0", "-1", "1e3", "1.000,5", "abc", "NaN", "01"]) assert.equal(engine.parseAmount(bad), null, bad);
}, "parseAmount accepts plain decimals only");

check(() => {
  assert.equal(engine.toMg("20", "ug"), "0.02");
  assert.equal(engine.toMg("0.5", "ug"), "0.0005");
  assert.equal(engine.toMg("1500", "ug"), "1.5");
  assert.equal(engine.toMg("200", "mg"), "200");
  assert.equal(engine.fromMg("0.02", "ug"), "20");
  assert.equal(engine.toMg("0.1", "ug"), "0.0001"); // 0.1/1000 in floating point would be 0.00010000000000000002
}, "µg→mg conversion is exact (decimal strings, no floating point)");

check(() => {
  const keys = PRODUCT_CONFIG.ingredients.map((i) => i.key);
  assert.equal(new Set(keys).size, keys.length, "duplicate Riise ID");
  assert.equal(PRODUCT_CONFIG.approved, false);
  for (const excluded of ["1", "6", "8", "14", "35", "36", "38", "40", "12", "20"]) assert.ok(!keys.includes(excluded), `ID ${excluded} must not be sellable`);
  const folate = PRODUCT_CONFIG.ingredients.filter((i) => i.group === "folate").map((i) => i.key).sort();
  assert.deepEqual(folate, ["26", "33"]);
}, "ingredient list: unique IDs, draft, no botanicals/probiotics/non-B2B, folate forms exclusive");

console.log(`\n${n} checks passed`);
