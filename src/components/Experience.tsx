import { experience } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="shell">
        <p className="eyebrow">Experience</p>

        <div className="mt-10 space-y-px">
          {experience.map((role, index) => (
            <InView
              key={`${role.organisation}-${role.period}`}
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
                  <p className="font-mono text-[0.8125rem] text-ink">{role.period}</p>
                  <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                    {role.location}
                  </p>
                </div>

                <div className="lg:col-span-8">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {role.role}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{role.organisation}</p>

                  {role.note ? (
                    <p className="measure mt-3 text-sm leading-relaxed text-faint">{role.note}</p>
                  ) : null}

                  <ul className="measure mt-6 space-y-2.5">
                    {role.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[0.9375rem] text-muted">
                        <span aria-hidden="true" className="mt-2 h-px w-3 flex-none bg-line-strong" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
