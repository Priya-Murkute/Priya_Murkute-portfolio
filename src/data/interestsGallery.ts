import type { InterestPhoto } from "@/types";
import { interestPhotos as placeholderInterestPhotos } from "@/data/galleryPlaceholders";
import { createGallery, galleryId } from "@/lib/gallery";

/**
 * Auto-discovers real photos from src/assets/interests/ — no data file to
 * edit. Drop an image in there named:
 *
 *   YYYY-MM-DD__Title-Words.webp
 *
 * and it appears in the scroller automatically, newest date first. Run
 * `npm run images` afterwards to convert it to width-capped WebP.
 *
 * `height`/`column` are layout details assigned by position, not something to
 * name in the filename. The filename grammar, the sort and the placeholder
 * fallback all live in lib/gallery.ts, shared with the art carousel.
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
    // A bare URL, not a CSS background value — real photos render as an
    // <img> sized to their own aspect ratio (see MyInterests.tsx), not
    // cropped into the placeholders' fixed-height boxes.
    gradient: url,
    height: HEIGHTS[index % HEIGHTS.length],
    column: index % 2 === 0 ? "left" : "right",
  }),
});

export const interestPhotos = gallery.items;

/** True once at least one real file has been discovered — MyInterests uses
 * this to switch from fixed-height placeholder boxes (with the "[ photo
 * goes here ]" hint) to real <img>s sized to their own aspect ratio. */
export const hasRealInterestPhotos = gallery.hasReal;
