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

/** `column` and `height` drive the masonry layout; `gradient` is a URL or a CSS value. */
export interface InterestPhoto {
  id: string;
  title: string;
  year: string;
  gradient: string;
  height: "tall" | "med" | "short";
  column: "left" | "right";
  /** Real photos only, from the optimize-images manifest — lets the <img>
   * reserve its aspect ratio before it loads instead of shifting layout. */
  width?: number;
  imageHeight?: number;
}

export interface Artwork {
  id: string;
  title: string;
  /** Only set when the filename encodes one. */
  medium?: string;
  year: string;
  gradient: string;
}

export interface NowItem {
  label: string;
  value: string;
}

export interface Hobby {
  icon: string;
  name: string;
  desc: string;
}
