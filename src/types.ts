export type Signal = "pass" | "flaky" | "fail";

/** Kept separate from `Signal`: "flaky" must never label her work. */
export type WorkStatus = "measured" | "ongoing";

export interface Metric {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface WorkItem {
  id: string;
  name: string;
  category: string;
  organisation: string;
  summary: string;
  /** Shown when the card opens. */
  detail: string;
  metric?: Metric;
  /** Ties the metric to how it was achieved, so it reads as evidence. */
  metricContext?: string;
  tools: string[];
  status: WorkStatus;
}

/** A résumé achievement rewritten as the assertion it would have to satisfy. */
export interface Assertion {
  id: string;
  text: string;
  /** Milliseconds this "test" takes to tick over. */
  duration: number;
}

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

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  summary: string;
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
