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

export const hobbies: Hobby[] = [
  {
    icon: "✏️",
    name: "Sketching",
    desc: "Botanical drawings, portraits, whatever's in front of me. Pencil first, always.",
  },
  {
    icon: "📷",
    name: "Photography",
    desc: "Chasing golden hour and rainy streets. Manual mode only.",
  },
  {
    icon: "🌍",
    name: "Travel",
    desc: "New city, unfamiliar bowl of something — that's the formula.",
  },
  {
    icon: "📖",
    name: "Reading",
    desc: "Literary fiction and the occasional rabbit hole I didn't expect to love.",
  },
  {
    icon: "🍳",
    name: "Cooking",
    desc: "Slow weekend mornings, a new recipe, something that fills the flat with smell.",
  },
  {
    icon: "🎵",
    name: "Music",
    desc: "Perpetually building a playlist for a road trip I haven't planned yet.",
  },
];
