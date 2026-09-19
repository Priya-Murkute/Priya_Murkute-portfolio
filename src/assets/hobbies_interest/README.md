# Hobbies / Interests — one folder per tile

Each folder here is one tile in the Hobbies / Interests section of the About
Me page. Put a picture in a folder and it appears on that tile — there's no
list to edit.

```
sketching/   photography/   travel/   music/   sports/
entertainment/   dining-out/   flowers/   main-character-energy/
```

The folder names must match the hobby `id`s in `src/data/offHours.ts`
(the tests check this). A folder with no pictures shows "Photos coming soon".

## Adding a picture

1. Name it `YYYY-MM-DD__Title-Words.jpg` — for example
   `2026-10-02__Tulips-At-The-Market.jpg`.
   - **Date** orders the gallery: newest first.
   - **Title** becomes the caption: dashes become spaces, each word
     capitalised — "Tulips At The Market".
2. Drop it into the right folder.
3. Run `npm run images`. It shrinks the picture to a web-friendly `.webp`,
   keeps your original in that folder's `_originals/`, and records its size.

`.jpg`, `.jpeg`, `.png` and `.webp` all work. A file that doesn't follow the
naming pattern is skipped (and the tests fail, naming it).

## Captions a file name can't hold

For punctuation (`Spider-Man: Brand New Day`) or a nicer phrase than the file
name, add the title to `pictureCaptions` in `src/data/offHours.ts`:

```ts
"Photo-06": "Spider-Man: Brand New Day",
```

The caption follows the photo into whichever folder it's in.

## One picture, one folder

Each picture lives in exactly one folder. To show it on two tiles, pick the
one it fits best.
