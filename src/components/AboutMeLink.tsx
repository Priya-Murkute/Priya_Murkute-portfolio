import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion-primitives/magnetic";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 22 };

const textVariants = {
  rest: { letterSpacing: "0.04em" },
  hover: { letterSpacing: "0.07em" },
};

const underlineVariants = {
  rest: { scaleX: 0.35, opacity: 0.5 },
  hover: { scaleX: 1, opacity: 1 },
};

const badgeVariants = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: -12 },
};

const arrowVariants = {
  rest: { x: 0 },
  hover: { x: 2.5 },
};

/**
 * The Hero's entry point into /about-me. Quiet at rest — plain text, a
 * barely-there underline — but the whole thing wakes up together on hover
 * through one shared Motion variant state (propagated from the wrapping
 * motion.div to every child below, no per-element wiring needed): the
 * underline draws in solid, the badge tips open and turns --pass, the arrow
 * steps forward, the text tracks out a touch. Deliberately hover-only rather
 * than looping at idle — calmer than a constant nudge, and it reads as more
 * considered for a link that's meant to stay quieter than "Get in touch."
 */
export default function AboutMeLink() {
  return (
    <Magnetic intensity={0.2} range={90}>
      <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="w-fit">
        <Link
          to="/about-me"
          className="group inline-flex items-center gap-2 font-mono text-[0.75rem] text-muted transition-colors hover:text-pass"
        >
          <motion.span variants={textVariants} transition={SPRING} className="relative">
            Click here to know about me
            <motion.span
              variants={underlineVariants}
              transition={SPRING}
              style={{ originX: 0 }}
              className="absolute -bottom-0.5 left-0 h-px w-full bg-line-strong group-hover:bg-pass"
            />
          </motion.span>

          <motion.span
            variants={badgeVariants}
            transition={SPRING}
            className="flex size-5 flex-none items-center justify-center rounded-full bg-ink text-paper transition-colors group-hover:bg-pass"
          >
            <motion.svg
              variants={arrowVariants}
              transition={SPRING}
              viewBox="0 0 16 16"
              className="size-3"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 8h9m0 0-3.2-3.2M12 8l-3.2 3.2"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.span>
        </Link>
      </motion.div>
    </Magnetic>
  );
}
