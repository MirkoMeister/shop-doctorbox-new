// Pre-sizes the raster images in public/ for next/image (see src/lib/image-loader.ts):
// public/<path>.jpg|png → public/_img/<path>-<width>.webp for every width the loader can ask for.
// Runs before `next dev` and `next build`; unchanged sources are skipped.
import { copyFile, mkdir, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.resolve("public");
const OUT = path.join(PUBLIC, "_img");
const WIDTHS = JSON.parse(await readFile(path.resolve("src/lib/image-widths.json"), "utf8"));
const QUALITY = 75; // next/image default

async function* rasterFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (full !== OUT) yield* rasterFiles(full);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      yield full;
    }
  }
}

const mtime = (file) => stat(file).then((s) => s.mtimeMs, () => 0);

let written = 0;
for await (const file of rasterFiles(PUBLIC)) {
  const rel = path.relative(PUBLIC, file).replace(/\.(jpe?g|png)$/i, "");
  const target = (w) => path.join(OUT, `${rel}-${w}.webp`);
  const sourceTime = await mtime(file);
  if ((await mtime(target(WIDTHS[WIDTHS.length - 1]))) > sourceTime) continue;

  await mkdir(path.dirname(target(WIDTHS[0])), { recursive: true });
  const { width: original } = await sharp(file).metadata();
  let full = null; // widths at or above the original share one file
  for (const w of WIDTHS) {
    if (w >= original && full) {
      await copyFile(full, target(w));
      continue;
    }
    await sharp(file).resize({ width: Math.min(w, original) }).webp({ quality: QUALITY }).toFile(target(w));
    if (w >= original) full = target(w);
    written++;
  }
}
console.log(`build-images: ${written} images written to public/_img`);
