import { education } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="shell">
        <p className="eyebrow eyebrow-section">Education</p>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {education.map((item, index) => (
            <InView
              key={item.qualification}
              as="li"
              once
              viewOptions={{ margin: "-10% 0px" }}
              variants={{
                hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="card flex h-full flex-col gap-3 p-6">
                <span className="font-mono text-[0.8125rem] text-faint">{item.year}</span>
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                  {item.qualification}
                </h3>
                <p className="text-sm text-muted">{item.institution}</p>
              </div>
            </InView>
          ))}
        </ol>
      </div>
    </section>
  );
}
