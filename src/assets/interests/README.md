# My Interests — drop images here

The "My Interests" scroller on the About Me / Off Hours page picks up images
from this folder automatically — no data file to edit. Logic lives in
`src/data/interestsGallery.ts`.

## Naming convention

```
YYYY-MM-DD__Title-Words.jpg
```

- **Date** (required) — controls order. Newest date shows first.
- **Title** (required) — dashes become spaces, each word capitalised.

Which column a photo lands in and how tall its card renders are assigned
automatically by position — not something to encode in the filename.

Supported extensions: `.jpg`, `.jpeg`, `.png`, `.webp`.

## Example

```
2026-09-03__Golden-Hour.jpg
2026-08-20__City-After-Rain.jpg
```

A file that doesn't match this pattern is skipped (not shown) — check the
browser console in dev mode (`npm run dev`) for a warning naming the exact
file if something you added isn't appearing.

If this folder has no images in it, the scroller falls back to the
placeholder gradients in `src/data/galleryPlaceholders.ts` — add one real file here and
the placeholders are replaced entirely.

## The photos already in here

Named `Photo-NN` — real photos, generic titles. Rename any of them with a real
title whenever you have a moment, using the convention above — no code
changes needed either way.
