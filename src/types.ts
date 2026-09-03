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
  /** One clause tying the metric to how it was actually achieved, so the
   * number reads as evidence rather than a bare claim. */
  metricContext?: string;
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
  /** Short framing line for a role whose tenure needs context at a glance. */
  note?: string;
  /** A named award earned during this role, shown as a small badge. */
  honors?: string;
}

/** Unpaid work — kept structurally distinct from ExperienceItem so it can
 * never accidentally render in the paid-roles timeline. */
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
}

/** A photo in the About Me "My Interests" scroller. `column` and `height`
 * drive the dual-column masonry layout; `gradient` stands in for a real
 * photo. */
export interface InterestPhoto {
  id: string;
  title: string;
  year: string;
  gradient: string;
  height: "tall" | "med" | "short";
  column: "left" | "right";
}

/** A piece in the Off Hours 3D art carousel. `medium` is optional — the
 * auto-discovered entries (see src/data/artGallery.ts) only have one when
 * the filename encodes it. */
export interface Artwork {
  id: string;
  title: string;
  medium?: string;
  year: string;
  gradient: string;
}

/** One entry in the Off Hours "currently" ticker. */
export interface NowItem {
  label: string;
  value: string;
}

/** One card in the Off Hours hobbies grid. */
export interface Hobby {
  icon: string;
  name: string;
  desc: string;
}
