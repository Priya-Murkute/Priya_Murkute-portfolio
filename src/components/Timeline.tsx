import { motion } from "motion/react";
import { revealBlock } from "@/lib/motion";

/** A badge's colour is a meaning (pass = a good thing, flaky = an honour); the classes are spelled out so Tailwind sees them. */
const BADGE_TONES = {
  pass: "border-pass-tint bg-pass-tint text-pass",
  flaky: "border-flaky-tint bg-flaky-tint text-flaky",
};

interface TimelineEntry {
  period: string;
  location: string;
  role: string;
  organisation: string;
  badge?: { label: string; tone: keyof typeof BADGE_TONES };
  /** A line under the organisation, before the bullets. */
  note?: string;
  bullets?: string[];
  /** A paragraph in place of bullets. */
  summary?: string;
}

/**
 * A run of roles down the page, each a row: when and where on the left, what
 * and for whom on the right. Experience and Volunteering are both this, so an
 * unpaid role can never look like a paid one by being drawn differently — the
 * badge is what tells them apart.
 */
export default function Timeline({
  id,
  eyebrow,
  entries,
}: {
  /** The section's anchor, for the nav. */
  id?: string;
  eyebrow: string;
  entries: TimelineEntry[];
}) {
  return (
    <section id={id} className="section">
      <div className="shell">
        <p className="eyebrow eyebrow-section">{eyebrow}</p>

        <div className="mt-10 space-y-px">
          {entries.map((entry, index) => (
            <motion.article
              key={`${entry.organisation}-${entry.period}`}
              className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-10"
              {...revealBlock({ delay: index * 0.1 })}
            >
              <div className="lg:col-span-4">
                <p className="font-mono text-[0.8125rem] text-ink">{entry.period}</p>
                <p className="mono-label mt-1 text-faint">{entry.location}</p>
              </div>

              <div className="lg:col-span-8">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{entry.role}</h3>
                  {entry.badge ? (
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] ${BADGE_TONES[entry.badge.tone]}`}
                    >
                      {entry.badge.label}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-muted">{entry.organisation}</p>

                {entry.note ? <p className="measure mt-3 text-sm leading-relaxed text-faint">{entry.note}</p> : null}

                {entry.summary ? (
                  <p className="measure mt-6 text-[0.9375rem] leading-relaxed text-muted">{entry.summary}</p>
                ) : null}

                {entry.bullets ? (
                  <ul className="measure mt-6 space-y-2.5">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[0.9375rem] text-muted">
                        <span aria-hidden="true" className="mt-2 h-px w-3 flex-none bg-line-strong" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
