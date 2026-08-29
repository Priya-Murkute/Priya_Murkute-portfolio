import { motion } from "framer-motion";
import { profile } from "../data/resume";

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          className="contact-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="contact-copy">
            <span className="eyebrow" style={{ color: "#fff" }}>
              Get in touch
            </span>
            <h2>Let's grow something together.</h2>
            <p>Open to QA, test automation, and SDET roles — reach out any time.</p>
            <ul className="contact-details">
              <li>
                <strong>Email</strong>
                <span>
                  <a href={`mailto:${profile.email}`}>{profile.email}</a>
                </span>
              </li>
              <li>
                <strong>Phone</strong>
                <span>{profile.phone}</span>
              </li>
              <li>
                <strong>LinkedIn</strong>
                <span>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    linkedin.com/in/priya-murkute-oct7
                  </a>
                </span>
              </li>
              <li>
                <strong>Location</strong>
                <span>{profile.location}</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
