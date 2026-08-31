import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { assertions } from "@/data/resume";

/**
 * The signature element: the résumé's claims, written as the assertions they
 * would have to satisfy, ticking over one at a time. No terminal chrome — it
 * is set in the page's own type, as a list rather than a fake console.
 */
export default function SpecSuite() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setPassed(assertions.length);
      return;
    }

    let index = 0;
    let timer = 0;

    const advance = () => {
      index += 1;
      setPassed(index);
      if (index < assertions.length) {
        timer = window.setTimeout(advance, assertions[index].duration);
      }
    };

    timer = window.setTimeout(advance, 650);
    return () => window.clearTimeout(timer);
  }, [prefersReducedMotion]);

  const complete = passed >= assertions.length;

  return (
    <div className="card p-6 sm:p-7">
      <p className="eyebrow">What the résumé has to prove</p>
      <ul className="mt-5 space-y-3">
        {assertions.map((assertion, index) => (
          <SpecRow key={assertion.id} text={assertion.text} hasPassed={index < passed} />
        ))}
      </ul>
      <div className="mt-6 flex items-center gap-3 border-t border-line pt-4 font-mono text-xs">
        <CoverageRing passed={passed} total={assertions.length} />
        <motion.span
          animate={{ opacity: complete ? 1 : 0.45 }}
          className={complete ? "text-pass" : "text-faint"}
        >
          {passed} passing
        </motion.span>
        <span className="text-faint">·</span>
        <span className="text-faint">0 failing</span>
        <span className="text-faint">·</span>
        <span className="text-faint">3 years</span>
      </div>
    </div>
  );
}

/**
 * A small radial readout of the same tick-over state — the ring closes as
 * assertions pass, so the count above isn't the only signal of progress.
 */
function CoverageRing({ passed, total }: { passed: number; total: number }) {
  const size = 18;
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = total > 0 ? passed / total : 0;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="size-[1.125rem] flex-none -rotate-90"
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--pass)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={false}
        animate={{ strokeDashoffset: circumference * (1 - fraction) }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

function SpecRow({ text, hasPassed }: { text: string; hasPassed: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span className="relative mt-[0.3rem] flex size-3.5 flex-none items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border"
          animate={{
            borderColor: hasPassed ? "var(--pass)" : "var(--line-strong)",
            backgroundColor: hasPassed ? "var(--pass-tint)" : "transparent",
          }}
          transition={{ duration: 0.25 }}
        />
        <svg viewBox="0 0 14 14" className="relative size-2.5" fill="none" aria-hidden="true">
          <motion.path
            d="M2 7.5 L5.4 10.5 L12 3.5"
            stroke="var(--pass)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: hasPassed ? 1 : 0, opacity: hasPassed ? 1 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
      </span>
      <motion.span
        className="font-mono text-[0.8125rem] leading-relaxed"
        animate={{ color: hasPassed ? "var(--ink)" : "var(--ink-faint)" }}
        transition={{ duration: 0.25 }}
      >
        {text}
      </motion.span>
    </li>
  );
}
