import { motion } from "motion/react";
import { stats } from "@/data/resume";
import type { Signal } from "@/types";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { EASE_CALM, revealItem } from "@/lib/motion";

const signalText: Record<Signal, string> = {
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
 * Counts up on arrival, with a bar filling to the same fraction. A bar, not a
 * ring: these are deltas, not completion states.
 */
export default function Stats() {
  return (
    <section aria-label="Results" className="relative bg-sunk/50">
      <div className="shell">
        <hr className="hairline" />
        <motion.div {...revealItem()}>
          <dl className="grid sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-10">
            {stats.map((stat, index) => (
              <div key={stat.label} className="py-10">
                <dd className="flex items-baseline font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold tracking-tight">
                  <span className={signalText[stat.signal]}>{stat.prefix}</span>
                  <AnimatedNumber value={stat.value} startOnView />
                  <span className={signalText[stat.signal]}>{stat.suffix}</span>
                </dd>
                {/* A reduction reads as amber rather than the pass-green of a gain. */}
                <StatBar
                  value={stat.value}
                  color={stat.prefix === "−" ? "var(--flaky)" : signalVar[stat.signal]}
                  delay={index * 0.12}
                />
                <dt className="mt-4 font-mono text-[0.8125rem] text-ink">{stat.label}</dt>
                <p className="measure mt-1.5 text-sm text-muted">{stat.note}</p>
              </div>
            ))}
          </dl>
        </motion.div>
        <hr className="hairline" />
      </div>
    </section>
  );
}

function StatBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const fraction = Math.min(Math.abs(value), 100) / 100;

  return (
    <div className="mt-4 h-[3px] w-full max-w-40 overflow-hidden rounded-full bg-line-strong">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: "0%" }}
        whileInView={{ width: `${fraction * 100}%` }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.9, delay, ease: EASE_CALM }}
      />
    </div>
  );
}
