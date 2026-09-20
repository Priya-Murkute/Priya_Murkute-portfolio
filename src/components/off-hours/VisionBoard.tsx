import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import FallingPetals from "@/components/FallingPetals";
import Quoted from "@/components/Quoted";
import { affirmations, visionAreas, visionGoals, visionHorizons } from "@/data/vision";
import { PETAL_PATH } from "@/lib/cherryBlossom";

/** The board's petals: plenty of them, falling on through the section, and pink or pale. */
const PETAL_FIRST_MS: [number, number] = [1100, 1100];
const PETAL_GAP_MS: [number, number] = [1100, 1100];
const PETAL_SPEED: [number, number] = [80, 120];
const PETAL_SIZE: [number, number] = [11, 24];

const AFFIRMATION_EVERY_MS = 6500;
const AFFIRMATION_FADE_MS = 600;

/** A meter fills, and its count climbs, over this long; each column starts a beat after the last. */
const METER_SECONDS = 1.1;
const METER_START = 0.35;
const METER_STAGGER = 0.17;
const EASE = [0.22, 1, 0.36, 1] as const;

/** The washi tape pinning each column to the board: a colour and a tilt apiece. */
const TAPES: CSSProperties[] = [
  { "--tape": "var(--accent-rose)", "--tilt": "-3deg" } as CSSProperties,
  { "--tape": "var(--pass)", "--tilt": "2deg" } as CSSProperties,
  { "--tape": "var(--accent-violet)", "--tilt": "-1deg" } as CSSProperties,
];

const manifested = visionGoals.filter((goal) => goal.done);

/**
 * Vision board: what I'm working towards, in three horizons, and what has already come true.
 * It is read-only: a goal is manifested once it has a `done` date in the data (src/data/vision.ts).
 */
export default function VisionBoard() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const onScreen = useInView(sectionRef, { amount: 0.1 });

  return (
    <section id="vision" ref={sectionRef} className="section overflow-hidden" aria-labelledby="vision-title">
      <FallingPetals
        active={onScreen && !reduced}
        lands={false}
        atStart={5}
        max={24}
        firstMs={PETAL_FIRST_MS}
        gapMs={PETAL_GAP_MS}
        speed={PETAL_SPEED}
        size={PETAL_SIZE}
        minPink={0}
        opacity={0.8}
      />

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="eyebrow eyebrow-section">Manifesting</p>
            <h2 id="vision-title" className="text-title mt-3 font-display font-semibold">
              Vision board
            </h2>
          </div>
          <p className="max-w-[46ch] text-sm text-muted">What I'm working towards, and what's already come true.</p>
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <Affirmation reduced={reduced} />
          <span className="font-mono text-[0.6875rem] tracking-[0.04em] text-faint">
            <b className="font-medium text-pass">{manifested.length}</b> manifested ·{" "}
            {visionGoals.length - manifested.length} still dreaming
          </span>
        </div>

        <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,18.75rem),1fr))] gap-5 pt-2">
          {visionHorizons.map((horizon, index) => {
            const goals = visionGoals.filter((goal) => goal.horizon === horizon.id);
            const done = goals.filter((goal) => goal.done).length;
            const open = goals.filter((goal) => !goal.done);
            return (
              <motion.article
                key={horizon.id}
                className="card vision-note grid content-start gap-3 px-[1.125rem] pt-[1.375rem] pb-3.5"
                style={TAPES[index % TAPES.length]}
                aria-labelledby={`vision-${horizon.id}`}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-baseline justify-between gap-2.5">
                  <h3 id={`vision-${horizon.id}`} className="font-display text-[1.1875rem] font-semibold tracking-tight">
                    {horizon.title}
                  </h3>
                  <span className="font-mono text-[0.65625rem] tracking-[0.04em] text-faint">{horizon.when}</span>
                </div>

                <Meter done={done} total={goals.length} delay={METER_START + index * METER_STAGGER} />

                {open.length > 0 ? (
                  <ul className="grid gap-0.5">
                    {open.map((goal) => {
                      const area = visionAreas[goal.area];
                      return (
                        <li key={goal.id} className="vision-item" style={{ "--area": area.color } as CSSProperties}>
                          <svg viewBox="0 0 24 24" className="vision-bullet" aria-hidden="true">
                            <path d={PETAL_PATH} />
                          </svg>
                          <span className="vision-text">{goal.text}</span>
                          <span className="vision-meta">
                            <span className="vision-area">{area.label}</span>
                            {goal.example ? <span className="vision-example">example</span> : null}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="p-2 text-[0.8125rem] text-faint">All manifested. Time to dream bigger.</p>
                )}
              </motion.article>
            );
          })}
        </div>

        <motion.div
          className="mt-5 grid gap-3 rounded-[1.125rem] border border-line-strong p-[1.125rem]"
          style={{ backgroundImage: "linear-gradient(135deg, var(--surface) 0%, var(--surface-sunk) 100%)" }}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 16 16" className="size-[1.125rem] text-[var(--accent-rose)]" fill="currentColor" aria-hidden="true">
              <path d="M8 1.5 9.3 6.7 14.5 8 9.3 9.3 8 14.5 6.7 9.3 1.5 8 6.7 6.7Z" />
            </svg>
            <h3 id="vision-manifested" className="font-display text-[1.1875rem] font-semibold">
              Manifested
            </h3>
          </div>

          <ul className="flex flex-wrap gap-2" aria-labelledby="vision-manifested">
            {manifested.map((goal) => (
              <li key={goal.id} className="vision-shelf-item">
                <span className="vision-shelf-done" aria-hidden="true">
                  <svg viewBox="0 0 12 12">
                    <path d="M2.5 6.3 5 8.6l4.5-5" />
                  </svg>
                </span>
                <span className="text-sm text-ink">{goal.text}</span>
                <span className="font-mono text-[0.65625rem] text-pass">{goal.done}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * A column's progress bar. Once it scrolls into view it fills from empty while its count climbs
 * to the real figure; with reduced motion, or before it is seen, nothing animates. The count
 * is drawn for the eye only, and the true figure is always in the text a screen reader gets.
 */
function Meter({ done, total, delay }: { done: number; total: number; delay: number }) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.9 });
  const [count, setCount] = useState(0);
  const percent = total ? Math.round((done / total) * 100) : 0;

  useEffect(() => {
    if (reduced || !seen) return;
    const climb = animate(0, done, {
      duration: METER_SECONDS,
      delay,
      ease: EASE,
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return () => climb.stop();
  }, [reduced, seen, done, delay]);

  return (
    <div ref={ref} className="grid gap-1.5">
      <div className="h-1 overflow-hidden rounded-full bg-sunk">
        <motion.div
          data-meter-fill=""
          className="h-full rounded-[inherit]"
          style={{ backgroundImage: "linear-gradient(90deg, var(--accent-rose), var(--pass))" }}
          initial={{ width: reduced ? `${percent}%` : "0%" }}
          animate={{ width: reduced || seen ? `${percent}%` : "0%" }}
          transition={{ duration: reduced ? 0 : METER_SECONDS, delay: reduced ? 0 : delay, ease: EASE }}
        />
      </div>
      <span className="sr-only">
        {done} of {total} manifested
      </span>
      <span aria-hidden="true" data-meter-count="" className="font-mono text-[0.65625rem] text-faint tabular-nums">
        {reduced ? done : count} of {total} manifested
      </span>
    </div>
  );
}

/** One affirmation at a time, changing every few seconds; still while the pointer is on it. */
function Affirmation({ reduced }: { reduced: boolean }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    if (reduced || affirmations.length < 2) return;
    let swap: number | undefined;
    const every = window.setInterval(() => {
      if (hovering.current) return;
      setFading(true);
      swap = window.setTimeout(() => {
        setIndex((current) => (current + 1) % affirmations.length);
        setFading(false);
      }, AFFIRMATION_FADE_MS);
    }, AFFIRMATION_EVERY_MS);
    return () => {
      window.clearInterval(every);
      window.clearTimeout(swap);
    };
  }, [reduced]);

  return (
    <p
      className={`quote-text min-h-[2.5em] max-w-[34ch] text-[clamp(1.25rem,2.4vw,1.75rem)] transition-[opacity,transform] duration-[600ms] ${
        fading ? "translate-y-1.5 opacity-0" : ""
      }`}
      aria-live="polite"
      onMouseEnter={() => {
        hovering.current = true;
      }}
      onMouseLeave={() => {
        hovering.current = false;
      }}
    >
      <Quoted>{affirmations[index]}</Quoted>
    </p>
  );
}
