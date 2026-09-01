import type { Hobby, NowItem } from "@/types";

export const nowItems: NowItem[] = [
  { label: "Reading", value: "The Ministry for the Future" },
  { label: "Listening", value: "Mitski · Be the Cowboy" },
  { label: "Watching", value: "The Bear, Season 3" },
  { label: "Sketching", value: "Botanical illustrations" },
  { label: "Dreaming of", value: "Japan — next autumn" },
  { label: "Eating", value: "Everything in Lisbon" },
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
