import { motion } from "framer-motion";
import ProjectFlowerCard from "./ProjectFlowerCard";
import { projects } from "../data/resume";

export default function Garden() {
  return (
    <section className="garden" id="garden">
      <div className="container">
        <motion.header
          className="section-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <span className="eyebrow">The Garden</span>
          <h2>Every achievement, a different flower.</h2>
          <p>Scroll through — each one blooms the moment it comes into view.</p>
        </motion.header>

        <div className="garden-grid">
          {projects.map((project) => (
            <ProjectFlowerCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
