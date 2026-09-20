import { useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { certifications } from "@/data/resume";
import type { Track } from "@/types";
import { LayeredWaves } from "@/components/Backgrounds";
import Quoted from "@/components/Quoted";
import { cn } from "@/lib/utils";

const tabs: { track: Track; label: string; color: string }[] = [
  { track: "qa", label: "QA & Automation", color: "var(--accent-blue)" },
  { track: "data", label: "Data & Analytics", color: "var(--accent-violet)" },
  { track: "other", label: "Others", color: "var(--accent-teal)" },
];

/** Certifications, split into the two tracks from the hero plus "others". */
export default function Showcase() {
  const [active, setActive] = useState<Track>("qa");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeTab = tabs.find((tab) => tab.track === active) ?? tabs[0];
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
    <section id="certifications" className="section relative z-10">
      <LayeredWaves className="absolute inset-x-0 top-0 h-24 opacity-50" />

      <div className="shell relative">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow eyebrow-section">Certifications</p>
            <h2 className="quote-text mt-3 max-w-[22ch]">
              <Quoted>
                Two tracks, <em>one habit.</em>
              </Quoted>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Certification track"
            className="flex max-w-full gap-1 rounded-full border border-line bg-surface p-1"
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
                    "relative whitespace-nowrap rounded-full px-3 py-2 text-[0.8125rem] transition-colors max-[359px]:whitespace-normal max-[359px]:px-2 sm:px-4 sm:text-sm",
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
              {certs.length === 0 ? (
                <p className="rounded-[1.125rem] border border-dashed border-line px-6 py-10 text-center text-sm text-muted">
                  Nothing here yet — certifications outside QA and data will land in this tab.
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {certs.map((cert) => {
                    const inner = (
                      <>
                        <span
                          aria-hidden="true"
                          className="status-dot mt-[0.4rem] flex-none"
                          style={{ background: activeTab.color }}
                        />
                        <span className="cert-title min-w-0 flex-1 text-[0.8125rem] leading-snug text-ink">
                          {cert.name}
                        </span>
                        {cert.url ? (
                          <>
                            <span aria-hidden="true" className="flex-none text-faint">
                              ↗
                            </span>
                            <span className="sr-only"> (opens in a new tab)</span>
                            <span aria-hidden="true" className="cert-pop">
                              <span className="cert-pop-card">
                                <span className="block font-display text-sm font-semibold leading-snug tracking-tight text-ink">
                                  {cert.name}
                                </span>
                                <span className="mt-2 block font-mono text-[0.6875rem] text-faint">
                                  View certificate ↗
                                </span>
                              </span>
                            </span>
                          </>
                        ) : null}
                      </>
                    );
                    const chipClass =
                      "cert-card card flex h-full items-start gap-2.5 rounded-[0.875rem] px-3.5 py-2.5";
                    return (
                      <li key={cert.name}>
                        {cert.url ? (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={chipClass}
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className={chipClass} title={cert.name}>
                            {inner}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
