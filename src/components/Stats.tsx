import { stats } from "@/data/resume";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { InView } from "@/components/motion-primitives/in-view";

const signalText: Record<string, string> = {
  pass: "text-pass",
  flaky: "text-flaky",
  fail: "text-fail",
};

/**
 * The three numbers from the résumé, given room to be read. They count up once,
 * on arrival — the only ornament here is the counting itself.
 */
export default function Stats() {
  return (
    <section aria-label="Results" className="relative">
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
            {stats.map((stat) => (
              <div key={stat.label} className="py-10 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <dd className="flex items-baseline font-display text-title font-semibold tracking-tight">
                  <span className={signalText[stat.signal]}>{stat.prefix}</span>
                  <AnimatedNumber value={stat.value} startOnView />
                  <span className={signalText[stat.signal]}>{stat.suffix}</span>
                </dd>
                <dt className="mt-2 font-mono text-[0.8125rem] text-ink">{stat.label}</dt>
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
