import { motion } from "framer-motion";
import Flower from "./Flower";
import type { FlowerProject } from "../types";

export default function ProjectFlowerCard({ project }: { project: FlowerProject }) {
  return (
    <motion.article
      className="flower-card"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Flower
        species={project.species}
        petalFrom={project.petalFrom}
        petalTo={project.petalTo}
        centerColor={project.centerColor}
      />
      <span className="flower-card-category">{project.category}</span>
      <h3>{project.name}</h3>
      <p className="flower-card-org">{project.organisation}</p>
      <p className="flower-card-desc">{project.description}</p>
      {project.metric && <span className="flower-card-metric">{project.metric}</span>}
    </motion.article>
  );
}
