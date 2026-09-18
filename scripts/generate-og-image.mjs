/**
 * Renders public/og-image.png, the 1200×630 social preview card.
 *
 * SVG rasterised with sharp, so it needs no browser. The type is a generic
 * stack — the rasteriser only has system fonts, not the site's webfonts.
 *
 * Run after changing the name, title or palette:  npm run og
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", "og-image.png");

const WIDTH = 1200;
const HEIGHT = 630;

// Kept in step with :root in src/styles.css.
const PAPER = "#fafaf7";
const INK = "#14171a";
const INK_MUTED = "#6b7078";
const PASS = "#2e6b4f";
const LINE = "#e8e7e1";

const NAME = "Priya Murkute";
const TITLE = "QA Automation Engineer";
const LOCATION = "United Kingdom";
const LINE_1 = "Testing is a design activity,";
const LINE_2 = "not a phase at the end.";

const SANS = "Segoe UI, DejaVu Sans, Helvetica, Arial, sans-serif";
const MONO = "Consolas, DejaVu Sans Mono, Menlo, monospace";

const WAVE = "M0 96C160 40 320 152 480 96S800 24 960 96 1280 160 1440 96";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>

  <g transform="translate(0 ${HEIGHT - 210}) scale(0.834 1)" fill="none" stroke="${LINE}" stroke-width="1.6">
    ${[0, 18, 36, 54, 72].map((offset) => `<path d="${WAVE}" transform="translate(0 ${offset})"/>`).join("\n    ")}
  </g>

  <rect x="0" y="0" width="14" height="${HEIGHT}" fill="${PASS}"/>

  <g transform="translate(96 150)">
    <circle cx="6" cy="-6" r="6" fill="${PASS}"/>
    <text x="26" y="0" font-family="${MONO}" font-size="21" letter-spacing="3.2" fill="${PASS}">
      OPEN TO NEW OPPORTUNITIES
    </text>
  </g>

  <text x="96" y="278" font-family="${SANS}" font-size="82" font-weight="700"
        letter-spacing="-2" fill="${INK}">${NAME}</text>

  <text x="96" y="336" font-family="${MONO}" font-size="25" letter-spacing="2.4" fill="${INK_MUTED}">
    ${TITLE.toUpperCase()} · ${LOCATION.toUpperCase()}
  </text>

  <text x="96" y="438" font-family="${SANS}" font-size="42" font-weight="600"
        letter-spacing="-0.8" fill="${INK}">${LINE_1}</text>
  <text x="96" y="492" font-family="${SANS}" font-size="42" font-weight="600"
        letter-spacing="-0.8" fill="${INK}">${LINE_2}</text>

  <g transform="translate(96 ${HEIGHT - 72})" font-family="${MONO}" font-size="21" fill="${INK_MUTED}">
    <text x="0" y="0" fill="${PASS}">3 passing</text>
    <text x="118" y="0">· 0 failing</text>
    <text x="248" y="0">· 3 years</text>
  </g>
</svg>
`;

await mkdir(path.dirname(OUTPUT), { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(OUTPUT);

console.log(`Wrote ${path.relative(ROOT, OUTPUT)} (${WIDTH}×${HEIGHT})`);
