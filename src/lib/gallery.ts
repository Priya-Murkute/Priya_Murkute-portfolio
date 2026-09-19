/**
 * The picture file-name grammar, used by the Hobbies / Interests folders
 * (src/data/hobbyPictures.ts).
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

export function parseFilename(path: string): ParsedFilename | null {
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
