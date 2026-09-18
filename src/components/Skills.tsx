import type { CSSProperties, ReactNode } from "react";
import { skillGroups } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

/**
 * One glyph and accent per group. Uses --accent-* rather than the
 * pass/flaky/fail vocabulary (a skills list isn't a test result) or the
 * --halo-* tones (tuned for background washes, invisible at stroke contrast).
 */
const groupMeta: Record<string, { color: string; icon: ReactNode }> = {
  "Testing types": {
    color: "var(--pass)",
    icon: (
      <>
        <circle cx="8" cy="8" r="6" />
        <path d="M5.2 8.3 7 10l3.8-4.2" />
      </>
    ),
  },
  Automation: {
    color: "var(--accent-blue)",
    icon: (
      <>
        <circle cx="8" cy="8" r="2.3" />
        <path d="M8 1.6v1.7M8 12.7v1.7M14.4 8h-1.7M3.3 8H1.6M12.4 3.6l-1.2 1.2M4.8 11.2l-1.2 1.2M12.4 12.4l-1.2-1.2M4.8 4.8 3.6 3.6" />
      </>
    ),
  },
  "API tooling": {
    color: "var(--accent-teal)",
    icon: (
      <>
        <path d="M5.5 2.5v3M10.5 2.5v3M4 5.5h8v2a4 4 0 0 1-8 0v-2Z" />
        <path d="M8 11.5v2" />
      </>
    ),
  },
  "Test & defect management": {
    color: "var(--accent-clay)",
    icon: (
      <>
        <path d="M4 2v12" />
        <path d="M4 3h7l-2 2.4L11 7.8H4" />
      </>
    ),
  },
  Process: {
    color: "var(--ink-muted)",
    icon: (
      <>
        <path d="M2.8 8a5.2 5.2 0 0 1 8.9-3.7M13.2 8a5.2 5.2 0 0 1-8.9 3.7" />
        <path d="M11 1.8v3h-3M5 14.2v-3h3" />
      </>
    ),
  },
  "CI/CD & data": {
    color: "var(--accent-violet)",
    icon: (
      <>
        <circle cx="3" cy="8" r="1.3" />
        <circle cx="8" cy="8" r="1.3" />
        <circle cx="13" cy="8" r="1.3" />
        <path d="M4.3 8h2.3M9.4 8h2.3" />
      </>
    ),
  },
};

export default function Skills() {
  return (
    <section id="skills" className="section bg-sunk/50">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Toolkit</p>
            <h2 className="mt-3 max-w-[22ch] font-display text-2xl font-semibold tracking-tight">
              What I reach for.
            </h2>
          </div>
        </div>

        <dl className="mt-12">
          {skillGroups.map((group, index) => {
            const meta = groupMeta[group.label];
            const accent = meta?.color ?? "var(--pass)";
            return (
              <InView
                key={group.label}
                once
                viewOptions={{ margin: "-8% 0px" }}
                variants={{
                  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
                  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="grid gap-4 border-t border-line py-6 sm:grid-cols-12 sm:gap-8">
                  <dt className="flex items-center gap-2.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint sm:col-span-4 sm:pt-1">
                    {meta ? (
                      <svg
                        viewBox="0 0 16 16"
                        className="size-4 flex-none"
                        fill="none"
                        stroke={meta.color}
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        {meta.icon}
                      </svg>
                    ) : null}
                    {group.label}
                  </dt>
                  <dd className="sm:col-span-8">
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          style={{ "--group-accent": accent } as CSSProperties}
                          className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-[var(--group-accent)] hover:text-[var(--group-accent)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </InView>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
