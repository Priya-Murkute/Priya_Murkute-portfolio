import { motion } from "framer-motion";
import { skillGroups } from "../data/resume";

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="container">
        <motion.header
          className="section-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="eyebrow">Seed Packets</span>
          <h2>What's in the toolkit.</h2>
        </motion.header>

        <div className="skills-grid">
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.label}
              className="skill-card"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: (i % 3) * 0.08 }}
            >
              <h3>{group.label}</h3>
              <div className="skill-pills">
                {group.items.map((item) => (
                  <span className="skill-pill" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
