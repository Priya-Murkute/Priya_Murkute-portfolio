import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile, thinkingSteps } from "@/data/resume";
import { iconPaths } from "@/lib/iconPaths";
import { EASE_CALM } from "@/lib/motion";

/** Same accents as the Showcase tabs, so the loop reads as QA → data → outcome. */
const stepMeta: { color: string; icon: ReactNode }[] = [
  {
    color: "var(--accent-blue)",
    icon: (
      <>
        <circle cx="7" cy="7" r="4.2" />
        <path d="M10.2 10.2 13.5 13.5" />
      </>
    ),
  },
  {
    color: "var(--accent-violet)",
    icon: <path d={iconPaths.chart} />,
  },
  {
    color: "var(--pass)",
    icon: <path d="m2.5 11.5 4-4 2.5 2.5 4.5-5M10 5h3.5v3.5" />,
  },
];

/** Waits out the hero's own entrance, so the first tick-on is actually seen. */
const REVEAL_DELAY = 1500;
const REVEAL_STEP = 420;
/** How long each step holds the highlight once the loop is running. */
const CYCLE_STEP = 2200;

/**
 * Test → Analyse → Improve, ticking on one at a time like a test run, then
 * cycling the highlight for as long as the card is on screen.
 */
export default function HowIThink() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const [tick, setTick] = useState(0);

  const total = thinkingSteps.length;

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return;
    const delay = tick === 0 ? REVEAL_DELAY : tick < total ? REVEAL_STEP : CYCLE_STEP;
    const timer = window.setTimeout(() => setTick((value) => value + 1), delay);
    return () => window.clearTimeout(timer);
  }, [tick, total, isInView, prefersReducedMotion]);

  const revealed = prefersReducedMotion ? total : Math.min(tick, total);
  const active = prefersReducedMotion || tick === 0 ? -1 : (tick - 1) % total;

  return (
    <div ref={ref} className="card p-6 sm:p-7">
      <p className="eyebrow">How I think</p>
      <p className="mt-3 font-display text-xl font-semibold tracking-tight">
        {thinkingSteps.map((step) => `${step.verb}.`).join(" ")}
      </p>

      <ol className="mt-6">
        {thinkingSteps.map((step, index) => (
          <StepRow
            key={step.verb}
            verb={step.verb}
            line={step.line}
            color={stepMeta[index].color}
            icon={stepMeta[index].icon}
            isRevealed={index < revealed}
            isActive={index === active}
            isLast={index === total - 1}
          />
        ))}
      </ol>

      <div className="mt-2 flex items-center gap-3 border-t border-line pt-4 font-mono text-xs text-faint">
        <motion.svg
          viewBox="0 0 16 16"
          className="size-[1.125rem] flex-none"
          fill="none"
          stroke="var(--pass)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          animate={prefersReducedMotion ? undefined : { rotate: tick * 120 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.7 }}
        >
          <path d={iconPaths.loop} />
        </motion.svg>
        <span className={revealed === total ? "text-pass" : undefined}>on repeat</span>
        <span>·</span>
        <span>{profile.yearsExperience} years in QA</span>
      </div>
    </div>
  );
}

function StepRow({
  verb,
  line,
  color,
  icon,
  isRevealed,
  isActive,
  isLast,
}: {
  verb: string;
  line: string;
  color: string;
  icon: ReactNode;
  isRevealed: boolean;
  isActive: boolean;
  isLast: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-5">
      {isLast ? null : (
        <span aria-hidden="true" className="absolute left-4 top-9 bottom-0 w-px bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 block h-full origin-top"
            style={{ background: color }}
            initial={false}
            animate={{ scaleY: isRevealed ? 1 : 0 }}
            transition={{ duration: 0.4, ease: EASE_CALM }}
          />
        </span>
      )}

      <span className="relative flex size-8 flex-none items-center justify-center">
        {/* Soft halo marks whichever step the loop is on. */}
        <motion.span
          aria-hidden="true"
          className="absolute -inset-1 rounded-full"
          style={{ background: `color-mix(in oklab, ${color} 18%, transparent)` }}
          initial={false}
          animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.6 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border bg-surface"
          initial={false}
          animate={{ borderColor: isRevealed ? color : "var(--line-strong)" }}
          transition={{ duration: 0.25 }}
        />
        <svg
          viewBox="0 0 16 16"
          className="relative size-4"
          fill="none"
          stroke={color}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <motion.g
            initial={false}
            animate={{ opacity: isRevealed ? 1 : 0, scale: isRevealed ? 1 : 0.5 }}
            transition={{ duration: 0.3, ease: EASE_CALM }}
            style={{ transformOrigin: "8px 8px" }}
          >
            {icon}
          </motion.g>
        </svg>
      </span>

      <div className="pt-0.5">
        <motion.p
          className="font-display text-base font-semibold tracking-tight"
          initial={false}
          animate={{ color: isRevealed ? "var(--ink)" : "var(--ink-faint)" }}
          transition={{ duration: 0.25 }}
        >
          {verb}
        </motion.p>
        <motion.p
          className="mt-0.5 font-mono text-[0.8125rem] leading-relaxed"
          initial={false}
          animate={{ color: isRevealed ? "var(--ink-muted)" : "var(--ink-faint)" }}
          transition={{ duration: 0.25 }}
        >
          {line}
        </motion.p>
      </div>
    </li>
  );
}
