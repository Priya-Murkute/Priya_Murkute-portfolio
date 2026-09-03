/**
 * The shared half of the two auto-discovered galleries.
 *
 * src/data/artGallery.ts and src/data/interestsGallery.ts had near-identical
 * copies of all of this — the same filename grammar, the same dev warning,
 * the same newest-first sort, the same fall back to placeholders. Only the
 * glob path and the shape of the entry they build actually differ, so those
 * are the two things a caller supplies.
 *
 * The glob itself has to stay in the data files: `import.meta.glob` needs a
 * literal path at the call site, so it can't be parameterised from here.
 */

/** `YYYY-MM-DD__Title-Words[__Medium-Words].ext` */
export interface ParsedFilename {
  date: string;
  title: string;
  /** Only present when the filename carries a third segment. */
  medium?: string;
}

/** "Title-Words" → "Title Words", each word capitalised. */
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

/** A stable, readable id: "2026-09-03-botanical-study". */
export function galleryId(parsed: ParsedFilename): string {
  return `${parsed.date}-${parsed.title.toLowerCase().replace(/\s+/g, "-")}`;
}

interface CreateGalleryOptions<T> {
  /** The eager `import.meta.glob` result: absolute path → asset URL. */
  files: Record<string, string>;
  /** Prefix for the dev-only warning about skipped files. */
  label: string;
  /** Used verbatim when the folder holds no matching files. */
  placeholders: T[];
  /** Builds one entry. `index` is the position in the sorted, newest-first list. */
  toEntry: (input: { url: string; parsed: ParsedFilename; index: number }) => T;
}

export interface Gallery<T> {
  items: T[];
  /** False while the folder is empty and `items` is the placeholder set. */
  hasReal: boolean;
}

export function createGallery<T>({
  files,
  label,
  placeholders,
  toEntry,
}: CreateGalleryOptions<T>): Gallery<T> {
  const discovered = Object.entries(files)
    .flatMap(([path, url]) => {
      const parsed = parseFilename(path);
      if (!parsed) {
        if (import.meta.env.DEV) {
          console.warn(
            `[${label}] Skipping "${path}" — name it YYYY-MM-DD__Title-Here.webp ` +
              `(e.g. 2026-09-03__Botanical-Study.webp) to have it picked up.`,
          );
        }
        return [];
      }
      return [{ url, parsed }];
    })
    .sort((a, b) => (a.parsed.date < b.parsed.date ? 1 : -1))
    .map(({ url, parsed }, index) => toEntry({ url, parsed, index }));

  return {
    items: discovered.length > 0 ? discovered : placeholders,
    hasReal: discovered.length > 0,
  };
}
