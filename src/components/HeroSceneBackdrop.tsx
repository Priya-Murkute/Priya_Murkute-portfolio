import { motion } from "motion/react";
import HeroScene from "@/components/HeroScene";
import { EASE_CALM } from "@/lib/motion";

/** Fades in the falling-petals scene behind a hero section. */
export default function HeroSceneBackdrop() {
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, delay: 0.2, ease: EASE_CALM }}
    >
      <HeroScene />
    </motion.div>
  );
}
