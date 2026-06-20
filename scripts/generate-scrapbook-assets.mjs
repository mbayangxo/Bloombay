/**
 * Generates transparent scrapbook PNG layers from SVG (reference-only recreation).
 * Run: node scripts/generate-scrapbook-assets.mjs
 */

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/assets/bloombay");

const PAPER = "#f7f3ec";
const PAPER_EDGE = "#e8e0d4";
const PINK = "#e8a4b8";
const PINK_DEEP = "#d4738f";
const INK = "#2a1a14";
const SHADOW = "rgba(26,10,20,0.14)";

async function exportPng(name, svg, width, height) {
  const outPath = path.join(OUT, `${name}.png`);
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(outPath);
  console.log(`✓ ${name}.png (${width}×${height})`);
}

/** Torn paper path helper */
function tornRect(w, h, seed = 1) {
  const j = (n) => ((seed * n * 17) % 7) - 3;
  return `
    M ${8 + j(1)} ${4 + j(2)}
    L ${w - 10 + j(3)} ${6 + j(4)}
    L ${w - 4 + j(5)} ${h - 12 + j(6)}
    L ${12 + j(7)} ${h - 6 + j(8)}
    L ${4 + j(9)} ${18 + j(10)} Z`;
}

const heroPaperNote = (w = 520, h = 620) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
    <filter id="paperTex">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.88  0 0 0 0.04 0" in="n" result="t"/>
      <feBlend in="SourceGraphic" in2="t" mode="multiply"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <rect width="${w}" height="${h}" fill="${PAPER}" opacity="0"/>
    <path d="${tornRect(w - 24, h - 24, 3)}" transform="translate(12,12)" fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="1.2" filter="url(#paperTex)"/>
    <!-- safety pin -->
    <g transform="translate(${w / 2 - 18}, 28)">
      <ellipse cx="18" cy="10" rx="14" ry="8" fill="none" stroke="#c9a227" stroke-width="2.5"/>
      <path d="M6 10 L6 42 Q6 52 18 52 Q30 52 30 42 L30 10" fill="none" stroke="#c9a227" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="18" cy="6" r="4" fill="#d4af37"/>
    </g>
  </g>
</svg>`;

const polaroidFrame = (w = 380, h = 460) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <rect x="20" y="20" width="340" height="420" rx="4" fill="#faf8f5" stroke="#e5ddd2" stroke-width="1"/>
    <!-- transparent photo window -->
    <rect x="44" y="44" width="292" height="292" fill="none"/>
    <path d="M44 44 H336 V336 H44 Z" fill="transparent"/>
    <!-- pink tape -->
    <rect x="130" y="8" width="120" height="36" rx="2" fill="${PINK}" opacity="0.55" transform="rotate(-2 190 26)"/>
    <rect x="132" y="10" width="116" height="32" rx="1" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1" transform="rotate(-2 190 26)"/>
  </g>
  <!-- cut transparent hole for photo -->
  <rect x="44" y="44" width="292" height="292" fill="#000" opacity="0"/>
</svg>`;

const calendarStrip = (w = 900, h = 200) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-10%" y="-30%" width="120%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
    <filter id="paperTex">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.88  0 0 0 0.03 0" in="n" result="t"/>
      <feBlend in="SourceGraphic" in2="t" mode="multiply"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <path d="M 8 28 Q 40 18 80 24 L 820 20 Q 860 16 892 30 L 888 168 Q 850 182 800 176 L 60 180 Q 20 184 12 160 Z"
      fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="1" filter="url(#paperTex)"/>
    <!-- day columns (blank template lines) -->
    ${[0, 1, 2, 3, 4, 5, 6]
      .map((i) => {
        const x = 70 + i * 112;
        return `<g transform="translate(${x}, 0)">
          <rect x="0" y="52" width="72" height="72" rx="36" fill="none" stroke="rgba(42,26,20,0.08)" stroke-width="1" stroke-dasharray="4 3"/>
          <line x1="36" y1="58" x2="36" y2="118" stroke="rgba(42,26,20,0.06)" stroke-width="1"/>
        </g>`;
      })
      .join("")}
  </g>
</svg>`;

const invitationEnvelope = (w = 420, h = 340) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
    <filter id="paperTex">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.95  0 0 0 0 0.93  0 0 0 0 0.88  0 0 0 0.03 0" in="n" result="t"/>
      <feBlend in="SourceGraphic" in2="t" mode="multiply"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <!-- back flap -->
    <path d="M 40 120 L 210 60 L 380 120 L 380 280 Q 380 300 360 300 L 60 300 Q 40 300 40 280 Z"
      fill="#efe9df" stroke="${PAPER_EDGE}" stroke-width="1" filter="url(#paperTex)"/>
    <!-- card peeking -->
    <rect x="95" y="95" width="230" height="175" rx="3" fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="1" filter="url(#paperTex)"/>
    <!-- front flap -->
    <path d="M 40 120 L 210 200 L 380 120 L 380 155 L 210 235 L 40 155 Z"
      fill="#f3ede4" stroke="${PAPER_EDGE}" stroke-width="1" opacity="0.95"/>
    <!-- decorative lines on card (no text — layer in HTML) -->
    <line x1="130" y1="150" x2="290" y2="150" stroke="rgba(42,26,20,0.12)" stroke-width="2"/>
    <line x1="150" y1="185" x2="270" y2="185" stroke="rgba(42,26,20,0.08)" stroke-width="1.5"/>
    <line x1="170" y1="215" x2="250" y2="215" stroke="rgba(42,26,20,0.06)" stroke-width="1"/>
  </g>
</svg>`;

const pinkStickyNote = (w = 280, h = 280) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <!-- backing torn paper -->
    <path d="M 24 40 Q 20 20 44 16 L 250 24 Q 268 22 262 48 L 256 248 Q 260 268 236 264 L 36 256 Q 16 258 20 236 Z"
      fill="${PAPER}" stroke="${PAPER_EDGE}" stroke-width="1"/>
    <!-- pink note -->
    <path d="M 48 56 L 232 52 L 228 228 L 52 232 Z" fill="#f4b8c8" stroke="#e8a0b4" stroke-width="1"/>
    <path d="M 48 56 L 52 232 L 40 220 L 44 60 Z" fill="#e8a8bc" opacity="0.5"/>
    <!-- thumbtack -->
    <g transform="translate(118, 32)">
      <circle cx="22" cy="18" r="16" fill="#c0c4c8" stroke="#9aa0a6" stroke-width="1"/>
      <circle cx="22" cy="18" r="8" fill="#e8eaec"/>
      <path d="M22 34 L22 58" stroke="#8a9098" stroke-width="3" stroke-linecap="round"/>
      <path d="M18 58 L26 58" stroke="#8a9098" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

function maskingTape(w, h, variant = "cream") {
  const fill =
    variant === "grid"
      ? `url(#grid)`
      : variant === "pink"
        ? PINK
        : "#ebe4d6";
  const opacity = variant === "pink" ? 0.55 : variant === "grid" ? 0.72 : 0.82;
  const gridDef =
    variant === "grid"
      ? `<defs><pattern id="grid" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="#f5f2ea" opacity="0.9"/>
        <path d="M12 0 V12 M0 12 H12" stroke="rgba(42,26,20,0.12)" stroke-width="0.6"/>
      </pattern></defs>`
      : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${gridDef}
  <path d="M 8 18 Q 4 14 10 10 L ${w - 14} 8 Q ${w - 4} 6 ${w - 6} 16 L ${w - 10} ${h - 10} Q ${w - 14} ${h - 4} ${w - 22} ${h - 8} L 14 ${h - 6} Q 4 ${h - 2} 6 ${h - 14} Z"
    fill="${fill}" opacity="${opacity}" stroke="rgba(255,255,255,0.25)" stroke-width="0.8"/>
</svg>`;
}

const flowerSticker = (w = 200, h = 200) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="petal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f8c0d0"/>
      <stop offset="100%" stop-color="#e890a8"/>
    </radialGradient>
    <radialGradient id="center" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5d88a"/>
      <stop offset="100%" stop-color="#e8b84a"/>
    </radialGradient>
  </defs>
  <g transform="translate(100, 100)">
    ${[0, 45, 90, 135, 180, 225, 270, 315]
      .map(
        (deg) =>
          `<ellipse cx="0" cy="-38" rx="22" ry="34" fill="url(#petal)" transform="rotate(${deg})" opacity="0.95"/>`
      )
      .join("")}
    <circle cx="0" cy="0" r="22" fill="url(#center)"/>
    <ellipse cx="28" cy="42" rx="14" ry="22" fill="#8fbc8f" transform="rotate(25 28 42)" opacity="0.9"/>
  </g>
</svg>`;

/** Polaroid with true alpha hole — sharp dest-out cut */
async function exportPolaroid() {
  const w = 380;
  const h = 460;
  const hole = { x: 44, y: 44, size: 292 };
  const frameSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.08)"/>
    </filter>
  </defs>
  <g filter="url(#shadow)">
    <rect x="20" y="20" width="340" height="420" rx="4" fill="#faf8f5" stroke="#e5ddd2" stroke-width="1"/>
    <rect x="130" y="8" width="120" height="36" rx="2" fill="${PINK}" opacity="0.55" transform="rotate(-2 190 26)"/>
  </g>
</svg>`;
  const frameBuf = await sharp(Buffer.from(frameSvg)).resize(w, h).png().toBuffer();
  const holeBuf = await sharp({
    create: {
      width: hole.size,
      height: hole.size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  await sharp(frameBuf)
    .ensureAlpha()
    .composite([{ input: holeBuf, left: hole.x, top: hole.y, blend: "dest-out" }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(OUT, "polaroid-frame.png"));
  console.log(`✓ polaroid-frame.png (${w}×${h}) — transparent photo hole`);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  await exportPng("hero-paper-note", heroPaperNote(), 520, 620);
  await exportPolaroid();
  await exportPng("calendar-strip", calendarStrip(), 900, 200);
  await exportPng("invitation-envelope", invitationEnvelope(), 420, 340);
  await exportPng("pink-sticky-note", pinkStickyNote(), 280, 280);

  await exportPng("masking-tape-cream-1", maskingTape(200, 56, "cream"), 200, 56);
  await exportPng("masking-tape-cream-2", maskingTape(180, 48, "cream"), 180, 48);
  await exportPng("masking-tape-grid-1", maskingTape(190, 52, "grid"), 190, 52);
  await exportPng("masking-tape-grid-2", maskingTape(170, 46, "grid"), 170, 46);
  await exportPng("masking-tape-pink", maskingTape(160, 40, "pink"), 160, 40);

  await exportPng("flower-sticker", flowerSticker(), 200, 200);

  // Manifest for collage system
  const manifest = {
    version: 1,
    assets: [
      { id: "hero-paper-note", file: "hero-paper-note.png", width: 520, height: 620 },
      { id: "polaroid-frame", file: "polaroid-frame.png", width: 380, height: 460, photoHole: { x: 44, y: 44, w: 292, h: 292 } },
      { id: "calendar-strip", file: "calendar-strip.png", width: 900, height: 200 },
      { id: "invitation-envelope", file: "invitation-envelope.png", width: 420, height: 340 },
      { id: "pink-sticky-note", file: "pink-sticky-note.png", width: 280, height: 280 },
      { id: "masking-tape-cream-1", file: "masking-tape-cream-1.png", width: 200, height: 56 },
      { id: "masking-tape-cream-2", file: "masking-tape-cream-2.png", width: 180, height: 48 },
      { id: "masking-tape-grid-1", file: "masking-tape-grid-1.png", width: 190, height: 52 },
      { id: "masking-tape-grid-2", file: "masking-tape-grid-2.png", width: 170, height: 46 },
      { id: "masking-tape-pink", file: "masking-tape-pink.png", width: 160, height: 40 },
      { id: "flower-sticker", file: "flower-sticker.png", width: 200, height: 200 },
    ],
  };
  await writeFile(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log("✓ manifest.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
