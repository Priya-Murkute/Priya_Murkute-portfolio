import type { InterestPhoto } from "@/types";
import { interestPhotos as placeholderInterestPhotos } from "@/data/gallery";

/**
 * Auto-discovers real photos from src/assets/interests/ — no data file to
 * edit. Drop an image in there named:
 *
 *   YYYY-MM-DD__Title-Words.jpg
 *
 * and it appears in the scroller automatically, newest date first — dashes
 * in the title become spaces, each word capitalised. Files that don't match
 * this pattern are skipped (logged in dev) rather than shown with a broken
 * title. `height`/`column` (which column, how tall the card renders) are
 * layout details assigned automatically by position, not something to name
 * in the filename. Falls back to gallery.ts's placeholder set when the
 * folder is empty, so the scroller never renders broken before any real
 * photos exist — add one matching file and the placeholders are replaced
 * entirely.
 */
const files = import.meta.glob("/src/assets/interests/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const HEIGHTS: InterestPhoto["height"][] = ["tall", "med", "short"];

interface ParsedFilename {
  date: string;
  title: string;
}

function toWords(segment: string): string {
  return segment
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function parseFilename(path: string): ParsedFilename | null {
  const filename = path.split("/").pop() ?? "";
  const stem = filename.replace(/\.[^.]+$/, "");
  const [datePart, titlePart] = stem.split("__");

  if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart) || !titlePart) return null;

  return {
    date: datePart,
    title: toWords(titlePart),
  };
}

function toInterestPhoto(url: string, parsed: ParsedFilename, index: number): InterestPhoto {
  return {
    id: `${parsed.date}-${parsed.title.toLowerCase().replace(/\s+/g, "-")}`,
    title: parsed.title,
    year: parsed.date.slice(0, 4),
    // A bare URL, not a CSS background value — real photos render as an
    // <img> sized to their own aspect ratio (see MyInterests.tsx), not
    // cropped into gallery.ts's fixed-height placeholder boxes.
    gradient: url,
    height: HEIGHTS[index % HEIGHTS.length],
    column: index % 2 === 0 ? "left" : "right",
  };
}

const discovered: InterestPhoto[] = Object.entries(files)
  .flatMap(([path, url]) => {
    const parsed = parseFilename(path);
    if (!parsed) {
      if (import.meta.env.DEV) {
        console.warn(
          `[interestsGallery] Skipping "${path}" — name it YYYY-MM-DD__Title-Here.jpg ` +
            `(e.g. 2026-09-03__Golden-Hour.jpg) to have it picked up.`,
        );
      }
      return [];
    }
    return [{ url, parsed }];
  })
  .sort((a, b) => (a.parsed.date < b.parsed.date ? 1 : -1))
  .map(({ url, parsed }, index) => toInterestPhoto(url, parsed, index));

export const interestPhotos: InterestPhoto[] =
  discovered.length > 0 ? discovered : placeholderInterestPhotos;

/** True once at least one real file has been discovered — MyInterests uses
 * this to switch from fixed-height placeholder boxes (with the "[ photo
 * goes here ]" hint) to real <img>s sized to their own aspect ratio. */
export const hasRealInterestPhotos = discovered.length > 0;
