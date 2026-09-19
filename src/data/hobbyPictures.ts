import { pictureCaptions } from "@/data/offHours";
import { parseFilename } from "@/lib/gallery";
import type { Hobby } from "@/types";

/**
 * Each Hobbies / Interests tile shows the pictures in its own folder:
 * src/assets/hobbies_interest/<hobby id>/, e.g. .../flowers/. Drop a photo in
 * and it appears on that tile — no list to edit. Files are named
 * `YYYY-MM-DD__Title-Words.webp` (run `npm run images` after adding them):
 * the date orders them, newest first, and the title becomes the caption
 * unless `pictureCaptions` has a better one.
 *
 * Sizes come from each folder's manifest.json, which `npm run images` writes,
 * so each <img> can reserve its space before it loads.
 */
const files = import.meta.glob("/src/assets/hobbies_interest/*/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const manifests = import.meta.glob("/src/assets/hobbies_interest/*/manifest.json", {
  eager: true,
  import: "default",
}) as Record<string, Record<string, { width: number; height: number }>>;

export interface ResolvedPicture {
  url: string;
  caption: string;
  width?: number;
  height?: number;
}

const FOLDER_ROOT = "/src/assets/hobbies_interest/";

/** Folder name → its pictures, newest first. Folders starting with "_" are ignored. */
const byFolder = new Map<string, (ResolvedPicture & { date: string; title: string })[]>();

for (const [path, url] of Object.entries(files)) {
  const [folder, filename] = path.slice(FOLDER_ROOT.length).split("/");
  if (!folder || !filename || folder.startsWith("_")) continue;

  const parsed = parseFilename(path);
  if (!parsed) {
    if (import.meta.env.DEV) {
      console.warn(
        `[hobbies] Skipping "${folder}/${filename}" — name it YYYY-MM-DD__Title-Here.webp ` +
          `(e.g. 2026-10-02__Tulips-At-The-Market.webp) to have it picked up.`,
      );
    }
    continue;
  }

  // The title exactly as written in the file name, for looking up a caption.
  const title = filename.replace(/\.[^.]+$/, "").split("__")[1];
  const size = manifests[`${FOLDER_ROOT}${folder}/manifest.json`]?.[filename.replace(/\.[^.]+$/, ".webp")];
  const list = byFolder.get(folder) ?? [];
  list.push({
    url,
    date: parsed.date,
    title,
    caption: pictureCaptions[title] ?? parsed.title,
    width: size?.width,
    height: size?.height,
  });
  byFolder.set(folder, list);
}

for (const list of byFolder.values()) {
  // Newest first; pictures from the same day in title order, so the order is stable.
  list.sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title) : a.date < b.date ? 1 : -1));
}

/** The pictures in this hobby's folder, newest first. Empty until some are added. */
export function picturesFor(hobby: Hobby): ResolvedPicture[] {
  return (byFolder.get(hobby.id) ?? []).map(({ url, caption, width, height }) => ({ url, caption, width, height }));
}
