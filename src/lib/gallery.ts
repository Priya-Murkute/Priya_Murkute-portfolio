/**
 * Shared by both auto-discovered galleries. The glob stays in the data files:
 * `import.meta.glob` needs a literal path at the call site.
 */

/** `YYYY-MM-DD__Title-Words[__Medium-Words].ext` */
export interface ParsedFilename {
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

/** "2026-09-03-botanical-study" */
export function galleryId(parsed: ParsedFilename): string {
  return `${parsed.date}-${parsed.title.toLowerCase().replace(/\s+/g, "-")}`;
}

interface CreateGalleryOptions<T> {
  /** Eager `import.meta.glob` result: absolute path → asset URL. */
  files: Record<string, string>;
  /** Prefix for the dev-only skipped-file warning. */
  label: string;
  placeholders: T[];
  /** `index` is the position in the sorted, newest-first list. */
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
