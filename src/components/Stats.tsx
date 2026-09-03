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
 * The three numbers from the résumé, given room to be read. They count up
 * once, on arrival, with a thin bar filling in underneath to the same
 * fraction. A ring read as "N% of the way to something" for a number that's
 * actually a delta (+50%, −15%) rather than a completion state; a bar reads
 * as a bar chart instead, which matches what the number actually means.
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
              <div key={stat.label} className="py-10 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <dd className="flex items-baseline font-display text-[clamp(2.25rem,6vw,4rem)] font-semibold tracking-tight">
                  <span className={signalText[stat.signal]}>{stat.prefix}</span>
                  <AnimatedNumber value={stat.value} startOnView />
                  <span className={signalText[stat.signal]}>{stat.suffix}</span>
                </dd>
                {/* A reduction (−15% defects) is framed as a delta, not growth toward
                    a target, so its bar reads as flaky-amber rather than the
                    pass-green every "+N%" stat uses — the same distinction the
                    number's own colour already makes via stat.signal. */}
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
        </InView>
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
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}
