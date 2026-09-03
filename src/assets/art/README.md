# Sketches & Art — drop images here

The "Sketches & Art" carousel on the About Me / Off Hours page picks up
images from this folder automatically — no data file to edit. Logic lives in
`src/data/artGallery.ts`.

## Naming convention

```
YYYY-MM-DD__Title-Words.jpg                (no medium)
YYYY-MM-DD__Title-Words__<your-medium>.jpg (medium included)
```

- **Date** (required) — controls order. Newest date shows first in the
  carousel.
- **Title** (required) — dashes become spaces, each word capitalised.
  `Botanical-Study-No-4` → "Botanical Study No 4".
- **Medium** (optional) — same word-formatting as the title, e.g.
  `__Watercolour` or `__Pencil-on-Paper`. Leave the whole `__...` part off
  the filename entirely if you don't want a medium line under the caption —
  don't type the literal word "medium" or the angle brackets, those just
  mean "put your own word here."

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Examples

```
2026-09-03__Botanical-Study-No-4__Watercolour.jpg
2026-08-20__By-the-Window.jpg
```

A file that doesn't match this pattern is skipped (not shown) — check the
browser console in dev mode (`npm run dev`) for a warning naming the exact
file if something you added isn't appearing.

If this folder has no images in it, the carousel falls back to the
placeholder gradients in `src/data/gallery.ts` — add one real file here and
the placeholders are replaced entirely.
