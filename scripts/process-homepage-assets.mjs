/**
 * Fix homepage PNGs that have checkerboard or black baked in instead of real alpha.
 *
 * Run: node scripts/process-homepage-assets.mjs
 * Input:  public/homepageobjects/*.PNG
 * Output: public/assets/homepage-processed/*.png
 */

import sharp from "sharp";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN_DIR = path.join(__dirname, "../public/homepageobjects");
const OUT_DIR = path.join(__dirname, "../public/assets/homepage-processed");

/** Typical checkerboard light/dark squares from export previews */
function isCheckerboard(r, g, b) {
  const avg = (r + g + b) / 3;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (spread > 12) return false;
  const light = avg >= 180 && avg <= 255;
  const dark = avg >= 100 && avg <= 170;
  return light || dark;
}

function isNearBlack(r, g, b, a) {
  if (a < 8) return true;
  return r < 24 && g < 24 && b < 24;
}

async function processOne(file) {
  const inPath = path.join(IN_DIR, file);
  const outName = file.replace(/\.PNG$/i, ".png").toLowerCase();
  const outPath = path.join(OUT_DIR, outName);

  const { data, info } = await sharp(inPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isNearBlack(r, g, b, a) || isCheckerboard(r, g, b)) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, { raw: { width, height, channels } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);

  console.log(`✓ ${file} → ${outName}`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(IN_DIR)).filter((f) => /\.png$/i.test(f));
  if (!files.length) {
    console.error("No PNG files in public/homepageobjects/");
    process.exit(1);
  }
  for (const file of files) {
    await processOne(file);
  }
  console.log(`\nDone — ${files.length} files → public/assets/homepage-processed/`);
  console.log("Next: map each file to a layout slot in lib/homepage-scrapbook-manifest.ts");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
