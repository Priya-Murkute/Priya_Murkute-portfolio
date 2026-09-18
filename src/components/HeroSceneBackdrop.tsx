import { motion } from "motion/react";
import HeroScene from "@/components/HeroScene";

/** Fades in the falling-petals scene behind a hero section. */
export default function HeroSceneBackdrop() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <HeroScene />
    </motion.div>
  );
}
