/**
 * Converts the gallery photos to width-capped WebP, in place.
 *
 * Originals move to a gitignored `_originals/` beside them rather than being
 * deleted — the gallery glob is single-level, so a subfolder is invisible to it.
 *
 * Run after adding photos:  npm run images
 */
import { mkdir, readdir, rename, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Max width per folder, matched to how large each is ever displayed. */
const TARGETS = [
  { dir: "src/assets/interests", maxWidth: 900, quality: 78 },
  { dir: "src/assets/art", maxWidth: 820, quality: 80 },
];

const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function optimizeFolder({ dir, maxWidth, quality }) {
  const absolute = path.join(ROOT, dir);
  if (!existsSync(absolute)) {
    console.log(`· ${dir} — not present, skipping`);
    return { before: 0, after: 0, count: 0 };
  }

  const originalsDir = path.join(absolute, "_originals");
  const entries = await readdir(absolute, { withFileTypes: true });

  const images = entries
    .filter((entry) => entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name);

  if (images.length === 0) {
    console.log(`· ${dir} — no images, skipping`);
    return { before: 0, after: 0, count: 0 };
  }

  await mkdir(originalsDir, { recursive: true });

  let before = 0;
  let after = 0;

  for (const name of images) {
    const source = path.join(absolute, name);
    const stem = path.basename(name, path.extname(name));
    const destination = path.join(absolute, `${stem}.webp`);

    // metadata().size is only populated for buffer input.
    const { size } = await stat(source);
    const input = sharp(source);
    const { width } = await input.metadata();

    // Re-read from a buffer: sharp can't stream a file into itself.
    const output = await sharp(await input.toBuffer())
      .resize({ width: Math.min(width ?? maxWidth, maxWidth), withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();

    // Move before writing, so a same-named .webp source isn't clobbered mid-read.
    await rename(source, path.join(originalsDir, name));
    await writeFile(destination, output);

    before += size;
    after += output.length;
    console.log(`  ${name} → ${stem}.webp   ${formatKb(size)} → ${formatKb(output.length)}`);
  }

  console.log(`· ${dir} — ${images.length} images, ${formatKb(before)} → ${formatKb(after)}\n`);
  return { before, after, count: images.length };
}

const totals = { before: 0, after: 0, count: 0 };
for (const target of TARGETS) {
  const result = await optimizeFolder(target);
  totals.before += result.before;
  totals.after += result.after;
  totals.count += result.count;
}

if (totals.count === 0) {
  console.log("Nothing to do.");
} else {
  const saved = totals.before - totals.after;
  const percent = Math.round((saved / totals.before) * 100);
  console.log(
    `${totals.count} images: ${formatKb(totals.before)} → ${formatKb(totals.after)} ` +
      `(${percent}% smaller). Originals kept in _originals/, which is gitignored.`,
  );
}
