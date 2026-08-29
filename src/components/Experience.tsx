import { motion } from "framer-motion";
import { experience } from "../data/resume";

export default function Experience() {
  return (
    <section className="experience" id="experience">
      <div className="container">
        <motion.header
          className="section-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="eyebrow">Growth Timeline</span>
          <h2>How the garden was planted.</h2>
        </motion.header>

        <div className="timeline">
          {experience.map((job, i) => (
            <motion.div
              key={job.role + job.organisation}
              className="timeline-item"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.1 }}
            >
              <div className="timeline-marker" aria-hidden="true">
                <span className="timeline-dot" />
                {i < experience.length - 1 && <span className="timeline-stem" />}
              </div>
              <div className="timeline-content">
                <span className="timeline-period">{job.period}</span>
                <h3>{job.role}</h3>
                <p className="timeline-org">
                  {job.organisation} · {job.location}
                </p>
                <ul>
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
