import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { certifications, showcaseProjects } from "@/data/resume";
import type { Track } from "@/types";
import { Spotlight } from "@/components/motion-primitives/spotlight";
import { LayeredWaves } from "@/components/Backgrounds";
import { cn } from "@/lib/utils";

const tabs: { track: Track; label: string; color: string }[] = [
  { track: "qa", label: "QA & Automation", color: "var(--accent-blue)" },
  { track: "data", label: "Data & Analytics", color: "var(--accent-violet)" },
];

/** Curated projects and certificates, split into the two tracks from the hero. */
export default function Showcase() {
  const [active, setActive] = useState<Track>("qa");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeTab = tabs.find((tab) => tab.track === active) ?? tabs[0];
  const projects = showcaseProjects.filter((project) => project.track === active);
  const certs = certifications.filter((cert) => cert.track === active);

  /** WAI-ARIA tabs pattern: arrows move between tabs, Home/End jump to the ends. */
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = tabs.length - 1;
    const next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : event.key === "ArrowLeft"
          ? (index - 1 + tabs.length) % tabs.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(tabs[next].track);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="certifications" className="section relative">
      <LayeredWaves className="absolute inset-x-0 top-0 h-24 opacity-50" />

      <div className="shell relative">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Projects & certifications</p>
            <h2 className="text-title mt-3 max-w-[22ch] font-display font-semibold">
              Two tracks, one habit.
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Project track"
            className="flex gap-1 rounded-full border border-line bg-surface p-1"
          >
            {tabs.map((tab, index) => {
              const isActive = tab.track === active;
              return (
                <button
                  key={tab.track}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`showcase-tab-${tab.track}`}
                  aria-selected={isActive}
                  aria-controls="showcase-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.track)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm transition-colors",
                    isActive ? "text-paper" : "text-muted hover:text-ink",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="showcase-tab-pill"
                      className="absolute inset-0 rounded-full bg-ink"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.45 }}
                    />
                  ) : null}
                  <span className="relative">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </header>

        <div
          role="tabpanel"
          id="showcase-panel"
          aria-labelledby={`showcase-tab-${active}`}
          className="mt-12"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {projects.map((project) => (
                  <article key={project.id} className="card relative flex h-full flex-col gap-4 p-6">
                    <Spotlight
                      size={260}
                      color={`color-mix(in oklab, ${activeTab.color} 22%, transparent)`}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                      <span
                        className="whitespace-nowrap font-mono text-[0.6875rem] uppercase tracking-[0.14em]"
                        style={{ color: activeTab.color }}
                      >
                        {project.kind}
                      </span>
                      <span className="font-mono text-[0.6875rem] text-faint">
                        {project.organisation}
                      </span>
                    </div>

                    <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                      {project.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-muted">{project.summary}</p>

                    <ul className="mt-auto flex flex-wrap gap-2 border-t border-line pt-4">
                      {project.tools.map((tool) => (
                        <li
                          key={tool}
                          className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-muted"
                        >
                          {tool}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>

              {certs.length > 0 ? (
                <div className="mt-10">
                  <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                    Certifications
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {certs.map((cert) => (
                      <li
                        key={cert.name}
                        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink"
                      >
                        <span
                          aria-hidden="true"
                          className="status-dot"
                          style={{ background: activeTab.color }}
                        />
                        {cert.name}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
