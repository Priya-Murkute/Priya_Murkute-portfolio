import type { Artwork } from "@/types";
import { artworks as placeholderArtworks } from "@/data/galleryPlaceholders";
import { createGallery, galleryId } from "@/lib/gallery";

/**
 * Auto-discovers real artwork from src/assets/art/ — no data file to edit.
 * Drop an image in there named:
 *
 *   YYYY-MM-DD__Title-Words.webp              (medium omitted)
 *   YYYY-MM-DD__Title-Words__Medium-Here.webp (medium included)
 *
 * and it appears in the carousel automatically, newest date first. Run
 * `npm run images` afterwards to convert it to width-capped WebP.
 *
 * The filename grammar, the sort and the placeholder fallback all live in
 * lib/gallery.ts, shared with the interests scroller.
 */
const files = import.meta.glob("/src/assets/art/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const gallery = createGallery<Artwork>({
  files,
  label: "artGallery",
  placeholders: placeholderArtworks,
  toEntry: ({ url, parsed }) => ({
    id: galleryId(parsed),
    title: parsed.title,
    medium: parsed.medium,
    year: parsed.date.slice(0, 4),
    gradient: `url("${url}") center / cover no-repeat`,
  }),
});

export const artworks = gallery.items;

/** True once at least one real file has been discovered — lets Carousel3D
 * hide the "[ photo goes here ]" placeholder hint once real art exists. */
export const hasRealArtworks = gallery.hasReal;
