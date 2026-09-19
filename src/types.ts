export type Signal = "pass" | "flaky" | "fail";

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
  signal: Signal;
}

export interface ExperienceItem {
  role: string;
  organisation: string;
  location: string;
  period: string;
  bullets: string[];
  note?: string;
  honors?: string;
}

/** Structurally distinct from ExperienceItem so it can never render in the paid timeline. */
export interface VolunteerItem {
  role: string;
  organisation: string;
  location: string;
  period: string;
  summary: string;
}

export interface EducationItem {
  qualification: string;
  institution: string;
  year: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

/** The two halves of the profile — each project and certificate belongs to one. */
export type Track = "qa" | "data";

export interface ShowcaseProject {
  id: string;
  title: string;
  organisation: string;
  /** "Job simulation", "Professional work" — sets expectations about scope. */
  kind: string;
  summary: string;
  tools: string[];
  track: Track;
}

export interface Certification {
  name: string;
  track: Track;
}

/** One step of the Test → Analyse → Improve loop. */
export interface ThinkingStep {
  verb: string;
  line: string;
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
  /** Hero only — the one-line positioning statement under the name. */
  headline: string;
  tagline: string;
  keywords: string[];
  cvPath: string;
  yearsExperience: number;
  /** CV-only: printed by scripts/generate-cv.ts, never shown on the site. */
  phone: string;
}

export interface NowItem {
  label: string;
  value: string;
}

export type HobbyIcon =
  | "pencil"
  | "camera"
  | "globe"
  | "note"
  | "racket"
  | "ticket"
  | "dining"
  | "flower"
  | "sparkle";

export interface Place {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  /** "visited" places are pinned on the map; "bucket" ones are listed beside it. */
  status: "visited" | "bucket";
  /** One line about the place — shown on the bucket list. */
  note?: string;
}

export interface Hobby {
  /** Also the name of its picture folder: src/assets/hobbies_interest/<id>/. */
  id: string;
  icon: HobbyIcon;
  name: string;
  desc: string;
  /** What the pictures are called in the count: "8 sketches". Defaults to photo/photos. */
  noun?: { one: string; many: string };
}
