import type { Hobby, NowItem } from "@/types";

export const nowItems: NowItem[] = [
  { label: "Currently exploring", value: "generative art tools" },
  { label: "Reading", value: "The Creative Act — Rick Rubin" },
  { label: "Building", value: "this portfolio" },
  { label: "Listening to", value: "The Weeknd -- On Loop" },
  { label: "Seeking", value: "QA/SDET roles in the UK" },
  { label: "Cooking", value: "more than I should" },
  { label: "Missing", value: "good chai" },
  { label: "Watching", value: "whatever has subtitles" },
];

/**
 * Hobbies / Interests on the About Me page, in the order the tiles appear.
 *
 * Each tile's pictures are the files in its own folder,
 * src/assets/hobbies_interest/<id>/ — so `id` must match the folder name.
 * Drop a photo into a folder (named YYYY-MM-DD__Title-Words, then run
 * `npm run images`) and it appears on that tile. A tile with an empty folder
 * shows "Photos coming soon".
 */
export const hobbies: Hobby[] = [
  {
    id: "sketching",
    icon: "pencil",
    name: "Sketching",
    desc: "Botanical drawings, portraits, whatever's in front of me. Pencil first, always.",
    noun: { one: "sketch", many: "sketches" },
  },
  {
    id: "photography",
    icon: "camera",
    name: "Photography",
    desc: "Chasing golden hour and rainy streets. Manual mode only.",
  },
  {
    id: "travel",
    icon: "globe",
    name: "Travel",
    desc: "New city, unfamiliar bowl of something — that's the formula.",
  },
  {
    id: "music",
    icon: "note",
    name: "Music",
    desc: "Perpetually building a playlist for a road trip I haven't planned yet.",
  },
  {
    id: "sports",
    icon: "racket",
    name: "Sports",
    desc: "Badminton is my favourite way to switch off: fast, a bit competitive, and no screens.",
  },
  {
    id: "entertainment",
    icon: "ticket",
    name: "Entertainment",
    desc: "Big-screen releases, fan favourites, and the occasional souvenir I didn't need.",
  },
  {
    id: "dining-out",
    icon: "dining",
    name: "Dining Out",
    desc: "Somewhere new, good company, and always room for dessert.",
  },
  {
    id: "flowers",
    icon: "flower",
    name: "Flowers",
    desc: "Fresh bouquets, flower markets, and petals I stop to sketch. The cherry blossoms on this site aren't an accident.",
  },
  {
    id: "main-character-energy",
    icon: "sparkle",
    name: "Main Character Energy",
    desc: "Good light, a great outfit, and the confidence to own the moment.",
  },
];

/**
 * Captions that can't be written in a file name — punctuation, or a nicer
 * phrase than "Photo 11". Keyed by the title part of the file name
 * ("Photo-11" for 2026-09-01__Photo-11.webp), so a caption follows its photo
 * into whichever folder it's put in. Anything not listed here is captioned
 * from its file name: "Tulips-At-The-Market" → "Tulips At The Market".
 */
export const pictureCaptions: Record<string, string> = {
  // Sketches
  Spiderman: "Spider-Man",
  "Jinu-KPOP-Demon-Hunters": "Jinu, KPop Demon Hunters",
  "Amine-Drawing": "Anime Drawing",
  // Photos
  "Photo-01": "An evening walk",
  "Photo-02": "Meeting a panda (the plush kind)",
  "Photo-03": "Poppies at the Tower of London",
  "Photo-04": "Red dress, dinner out",
  "Photo-05": "A hilltop tower in the Cotswolds",
  "Photo-06": "Spider-Man: Brand New Day",
  "Photo-07": "Live, with flames and all",
  "Photo-08": "A church visit, with friends",
  "Photo-09": "Dinner with friends",
  "Photo-10": "A gothic monument, lit up at night",
  "Photo-11": "White cliffs and the Channel",
  "Photo-12": "Badminton night",
  "Photo-13": "A yellow supercar day out",
  "Photo-14": "A bouquet, up close",
  "Photo-15": "An evening by the water, flowers in hand",
  "Photo-16": "The White Tower in a sea of poppies",
  "Photo-21": "Wind on the hilltop",
};
