import { skillGroups } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Toolkit</p>
            <h2 className="text-title mt-3 max-w-[22ch] font-display font-semibold">
              What I reach for.
            </h2>
          </div>
        </div>

        <dl className="mt-12">
          {skillGroups.map((group, index) => (
            <InView
              key={group.label}
              once
              viewOptions={{ margin: "-8% 0px" }}
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="grid gap-4 border-t border-line py-6 sm:grid-cols-12 sm:gap-8">
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint sm:col-span-4 sm:pt-1">
                  {group.label}
                </dt>
                <dd className="sm:col-span-8">
                  <ul className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-pass hover:text-pass"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </InView>
          ))}
        </dl>
      </div>
    </section>
  );
}
