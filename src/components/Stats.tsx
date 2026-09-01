import { motion } from "motion/react";
import { stats } from "@/data/resume";
import type { Signal } from "@/types";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { InView } from "@/components/motion-primitives/in-view";

const signalText: Record<string, string> = {
  pass: "text-pass",
  flaky: "text-flaky",
  fail: "text-fail",
};

const signalVar: Record<Signal, string> = {
  pass: "var(--pass)",
  flaky: "var(--flaky)",
  fail: "var(--fail)",
};

/**
 * The three numbers from the résumé, given room to be read. They count up once,
 * on arrival — and now a small ring fills alongside each, since every one of
 * these numbers already is a percentage. Text alone was carrying weight a
 * chart could share.
 */
export default function Stats() {
  return (
    <section aria-label="Results" className="relative bg-sunk/50">
      <div className="shell">
        <hr className="hairline" />
        <InView
          once
          viewOptions={{ margin: "-15% 0px" }}
          variants={{
            hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <dl className="grid gap-px sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="flex items-start gap-5 py-10 sm:px-8 sm:first:pl-0 sm:last:pr-0"
              >
                <StatRing value={stat.value} signal={stat.signal} delay={index * 0.12} />
                <div>
                  <dd className="flex items-baseline font-display text-title font-semibold tracking-tight">
                    <span className={signalText[stat.signal]}>{stat.prefix}</span>
                    <AnimatedNumber value={stat.value} startOnView />
                    <span className={signalText[stat.signal]}>{stat.suffix}</span>
                  </dd>
                  <dt className="mt-2 font-mono text-[0.8125rem] text-ink">{stat.label}</dt>
                  <p className="measure mt-1.5 text-sm text-muted">{stat.note}</p>
                </div>
              </div>
            ))}
          </dl>
        </InView>
        <hr className="hairline" />
      </div>
    </section>
  );
}

function StatRing({ value, signal, delay }: { value: number; signal: Signal; delay: number }) {
  const size = 56;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(Math.abs(value), 100) / 100;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mt-1 size-14 flex-none -rotate-90"
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
        stroke={signalVar[signal]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        whileInView={{ strokeDashoffset: circumference * (1 - fraction) }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
