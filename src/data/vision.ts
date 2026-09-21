import type { VisionArea, VisionGoal, VisionHorizon } from "@/types";

/** Each area's dot colour, from the site's decorative accents. */
export const visionAreas: Record<VisionArea, { label: string; color: string }> = {
  career: { label: "Career", color: "var(--pass)" },
  creativity: { label: "Creativity", color: "var(--accent-violet)" },
  travel: { label: "Travel", color: "var(--accent-blue)" },
  growth: { label: "Growth", color: "var(--accent-clay)" },
  life: { label: "Life", color: "var(--accent-rose)" },
};

export const visionHorizons: VisionHorizon[] = [
  { id: "now", title: "This year", when: "2026" },
  { id: "next", title: "Next few years", when: "2027 – 2029" },
  { id: "someday", title: "Someday", when: "No rush" },
];

/**
 * The vision board: what's still being worked towards, and what has already come true.
 * A goal is manifested once it has a `done` date; add one to move it to the shelf.
 * Goals marked `example` are placeholders: swap the text, or delete `example`, once real.
 */
export const visionGoals: VisionGoal[] = [
  { id: "sdet-role", text: "Land a QA / SDET role in the UK", area: "career", horizon: "now" },
  { id: "portfolio", text: "Launch my portfolio and share it", area: "career", horizon: "now", done: "Sep 2026" },
  {
    id: "award",
    text: "Be recognised for my work",
    area: "career",
    horizon: "now",
    done: "Inspiring Performance Award, Wipro",
  },
  { id: "sketch-weekly", text: "Sketch something every week", area: "creativity", horizon: "now" },
  { id: "read-book", text: "Read a psychology book", area: "growth", horizon: "now" },

  { id: "hybrid-role", text: "Grow into a role that mixes QA and data analytics", area: "career", horizon: "next" },
  { id: "london", text: "Move to London", area: "life", horizon: "next", done: "Sep 2022" },
  { id: "msc", text: "Finish my MSc in Computer Science", area: "growth", horizon: "next", done: "Jan 2024" },
  { id: "powerbi", text: "Get certified in Power BI", area: "growth", horizon: "next" },
  {
    id: "cloud-cert",
    text: "Get certified in Microsoft Azure or AWS, in something related to data and QA",
    area: "growth",
    horizon: "next",
  },
  { id: "exhibition", text: "Show my sketches in a small exhibition", area: "creativity", horizon: "next" },
  { id: "kyoto", text: "See the cherry blossoms in Kyoto", area: "travel", horizon: "next" },

  { id: "countries", text: "Visit 30 countries", area: "travel", horizon: "someday" },
  { id: "mentor", text: "Mentor women starting out in tech", area: "life", horizon: "someday" },
  { id: "studio", text: "A home with a sunlit corner for drawing", area: "life", horizon: "someday" },
  { id: "g-wagon", text: "Get my dream G-Wagon", area: "life", horizon: "someday" },
];

/** One at a time above the board, changing every few seconds. Placeholders for now. */
export const affirmations: string[] = [
  "I'm building a career I'm proud of.",
  "Every sketch, every city and every test run makes me more me.",
  "Good things are already on their way.",
];
