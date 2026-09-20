import { motion } from "motion/react";
import { education } from "@/data/resume";
import { revealItem } from "@/lib/motion";

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="shell">
        <p className="eyebrow eyebrow-section">Education</p>

        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {education.map((item, index) => (
            <motion.li key={item.qualification} {...revealItem({ delay: index * 0.08 })}>
              <div className="card flex h-full flex-col gap-3 p-6">
                <span className="font-mono text-[0.8125rem] text-faint">{item.year}</span>
                <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
                  {item.qualification}
                </h3>
                <p className="text-sm text-muted">{item.institution}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
