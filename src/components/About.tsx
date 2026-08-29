import { motion } from "framer-motion";
import { profile, education } from "../data/resume";

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container about-grid">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="eyebrow">Roots</span>
          <h2>Where it's grown from.</h2>
          <p>{profile.summary}</p>
          <p className="about-location">Based in {profile.location}.</p>
        </motion.div>

        <motion.div
          className="education-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <span className="eyebrow">Education</span>
          <ul className="education-list">
            {education.map((e) => (
              <li key={e.qualification}>
                <strong>{e.qualification}</strong>
                <span>
                  {e.institution} · {e.year}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
