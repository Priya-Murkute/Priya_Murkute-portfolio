import { motion } from "framer-motion";
import Flower from "./Flower";
import type { FlowerSpecies } from "../types";
import { profile } from "../data/resume";

const BOUQUET: { species: FlowerSpecies; petalFrom: string; petalTo: string; centerColor: string; size: number }[] = [
  { species: "rose", petalFrom: "#F3D9E8", petalTo: "#C97FA8", centerColor: "#B8922E", size: 92 },
  { species: "daisy", petalFrom: "#FDF6E3", petalTo: "#F0D77B", centerColor: "#B8922E", size: 72 },
  { species: "lotus", petalFrom: "#EFE1F6", petalTo: "#A97FCB", centerColor: "#4A3563", size: 108 },
  { species: "tulip", petalFrom: "#DCEBF5", petalTo: "#6FA3C7", centerColor: "#2E4A5E", size: 66 },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="eyebrow">QA Engineer · Software Tester</span>
          <h1>
            Quality, <em>cultivated</em> carefully.
          </h1>
          <p>{profile.summary}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#garden">
              Walk through the garden <span aria-hidden="true">→</span>
            </a>
            <a className="button button-light" href="#contact">
              Get in touch
            </a>
          </div>
        </motion.div>

        <div className="hero-visual" aria-hidden="true">
          {BOUQUET.map((f, i) => (
            <div key={i} className={`bouquet-slot bouquet-slot-${i}`}>
              <Flower {...f} />
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint" aria-hidden="true">
        <span className="scroll-line" />
        Scroll to bloom
      </div>
    </section>
  );
}
