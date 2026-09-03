import { certifications } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

export default function Certifications() {
  if (certifications.length === 0) return null;

  return (
    <section className="section bg-sunk/50">
      <div className="shell">
        <p className="eyebrow">Certifications</p>
        <h2 className="mt-3 max-w-[22ch] font-display text-2xl font-semibold tracking-tight">
          Credentials on file.
        </h2>

        <InView
          once
          viewOptions={{ margin: "-8% 0px" }}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ul className="mt-8 flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <li
                key={cert}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-[0.8125rem] text-ink transition-colors hover:border-pass hover:text-pass"
              >
                {cert}
              </li>
            ))}
          </ul>
        </InView>
      </div>
    </section>
  );
}
