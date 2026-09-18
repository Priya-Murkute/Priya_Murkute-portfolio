import type { InterestPhoto } from "@/types";
import { interestPhotos as placeholderInterestPhotos } from "@/data/galleryPlaceholders";
import { createGallery, galleryId } from "@/lib/gallery";

/**
 * Auto-discovers src/assets/interests/. Drop in a file named
 * `YYYY-MM-DD__Title-Words.webp`, then run `npm run images`.
 * `height`/`column` are assigned by position, not named in the filename.
 */
const files = import.meta.glob("/src/assets/interests/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const HEIGHTS: InterestPhoto["height"][] = ["tall", "med", "short"];

const gallery = createGallery<InterestPhoto>({
  files,
  label: "interestsGallery",
  placeholders: placeholderInterestPhotos,
  toEntry: ({ url, parsed, index }) => ({
    id: galleryId(parsed),
    title: parsed.title,
    year: parsed.date.slice(0, 4),
    // A bare URL, not a CSS background: real photos render as an <img>.
    gradient: url,
    height: HEIGHTS[index % HEIGHTS.length],
    column: index % 2 === 0 ? "left" : "right",
  }),
});

export const interestPhotos = gallery.items;

/** Switches MyInterests from fixed-height placeholder boxes to real <img>s. */
export const hasRealInterestPhotos = gallery.hasReal;
