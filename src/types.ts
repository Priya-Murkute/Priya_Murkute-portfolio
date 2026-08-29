/** The three states anything on this site can be in, borrowed from test runs. */
export type Signal = "pass" | "flaky" | "fail";

/**
 * Whether a piece of work has a number attached to it or is a practice she
 * kept up. Kept separate from `Signal` on purpose — "flaky" means something
 * specific and unflattering to a tester, so it never labels her work.
 */
export type WorkStatus = "measured" | "ongoing";

export interface Metric {
  /** The number itself, so it can count up. */
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
  /** One or two lines, shown on the card. */
  summary: string;
  /** The fuller story, shown when the card opens. */
  detail: string;
  metric?: Metric;
  tools: string[];
  status: WorkStatus;
}

/** A résumé achievement rewritten as the assertion it would have to satisfy. */
export interface Assertion {
  id: string;
  text: string;
  /** Milliseconds this "test" takes to tick over, purely for texture. */
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
  phone: string;
  linkedin: string;
  summary: string;
  cvPath: string;
}
