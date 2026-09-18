import type { Artwork } from "@/types";
import { artworks as placeholderArtworks } from "@/data/galleryPlaceholders";
import { createGallery, galleryId } from "@/lib/gallery";

/**
 * Auto-discovers src/assets/art/. Drop in a file named
 * `YYYY-MM-DD__Title-Words[__Medium-Here].webp`, then run `npm run images`.
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

/** Lets Carousel3D drop the "[ photo goes here ]" hint. */
export const hasRealArtworks = gallery.hasReal;
