import type { Artwork } from "@/types";
import { artworks as placeholderArtworks } from "@/data/gallery";

/**
 * Auto-discovers real artwork from src/assets/art/ — no data file to edit.
 * Drop an image in there named:
 *
 *   YYYY-MM-DD__Title-Words.jpg              (medium omitted)
 *   YYYY-MM-DD__Title-Words__Medium-Here.jpg (medium included)
 *
 * and it appears in the carousel automatically, newest date first — dashes
 * in a segment become spaces, each word capitalised. Files that don't match
 * this pattern are skipped (logged in dev) rather than shown with a broken
 * title. Falls back to gallery.ts's placeholder set when the folder is
 * empty, so the carousel never renders broken before any real art exists —
 * add one matching file and the placeholders are replaced entirely.
 */
const files = import.meta.glob("/src/assets/art/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

interface ParsedFilename {
  date: string;
  title: string;
  medium?: string;
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
  const [datePart, titlePart, mediumPart] = stem.split("__");

  if (!datePart || !/^\d{4}-\d{2}-\d{2}$/.test(datePart) || !titlePart) return null;

  return {
    date: datePart,
    title: toWords(titlePart),
    medium: mediumPart ? toWords(mediumPart) : undefined,
  };
}

const discovered: Artwork[] = Object.entries(files)
  .flatMap(([path, url]) => {
    const parsed = parseFilename(path);
    if (!parsed) {
      if (import.meta.env.DEV) {
        console.warn(
          `[artGallery] Skipping "${path}" — name it YYYY-MM-DD__Title-Here.jpg ` +
            `(e.g. 2026-09-03__Botanical-Study.jpg) to have it picked up.`,
        );
      }
      return [];
    }
    return [{ url, parsed }];
  })
  .sort((a, b) => (a.parsed.date < b.parsed.date ? 1 : -1))
  .map(({ url, parsed }) => ({
    id: `${parsed.date}-${parsed.title.toLowerCase().replace(/\s+/g, "-")}`,
    title: parsed.title,
    medium: parsed.medium,
    year: parsed.date.slice(0, 4),
    gradient: `url("${url}") center / cover no-repeat`,
  }));

export const artworks: Artwork[] = discovered.length > 0 ? discovered : placeholderArtworks;

/** True once at least one real file has been discovered — lets Carousel3D
 * hide the "[ photo goes here ]" placeholder hint once real art exists. */
export const hasRealArtworks = discovered.length > 0;
