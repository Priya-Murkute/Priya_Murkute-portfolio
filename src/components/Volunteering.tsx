import { volunteering } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

/**
 * Unpaid work, given its own section rather than folded into Experience — a
 * "Volunteer" tag distinguishes it at a glance so it never reads as a paid
 * role padding out the timeline.
 */
export default function Volunteering() {
  if (volunteering.length === 0) return null;

  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Volunteering</p>

        <div className="mt-10 space-y-px">
          {volunteering.map((item, index) => (
            <InView
              key={`${item.organisation}-${item.period}`}
              once
              viewOptions={{ margin: "-12% 0px" }}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <article className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-4">
                  <p className="font-mono text-[0.8125rem] text-ink">{item.period}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                    {item.location}
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <h3 className="font-display text-xl font-semibold tracking-tight">
                      {item.role}
                    </h3>
                    <span className="rounded-full border border-pass-tint bg-pass-tint px-2.5 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-pass">
                      Volunteer
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted">{item.organisation}</p>
                  <p className="measure mt-6 text-[0.9375rem] leading-relaxed text-muted">
                    {item.summary}
                  </p>
                </div>
              </article>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
