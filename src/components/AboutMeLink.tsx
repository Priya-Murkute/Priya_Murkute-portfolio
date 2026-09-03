import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Magnetic } from "@/components/motion-primitives/magnetic";

const SPRING = { type: "spring" as const, stiffness: 320, damping: 22 };

const textVariants = {
  rest: { letterSpacing: "0.01em" },
  hover: { letterSpacing: "0.04em" },
};

const underlineVariants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: { scaleX: 1, opacity: 0.55 },
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
 * The Hero's single call to action, into /about-me.
 *
 * This is the two former hero buttons folded together: the solid ink pill,
 * the `glow-cta` bloom and the magnetic pull that used to belong to "Get in
 * touch", carrying the hover choreography that used to belong to the quiet
 * text link — one shared Motion variant state, propagated from the wrapping
 * motion.div to every child, so the badge tips open, the arrow steps forward,
 * the label tracks out and the underline draws in all at once with no
 * per-element wiring.
 *
 * The underline starts fully retracted rather than half-drawn: at rest this
 * now reads as a solid button, so a permanent hairline under the label would
 * look like an artefact instead of the invitation it was on plain text.
 *
 * Deliberately hover-only rather than looping at idle — calmer than a
 * constant nudge, and it reads as more considered.
 */
export default function AboutMeLink() {
  return (
    <Magnetic intensity={0.25} range={110}>
      <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="w-fit">
        <Link
          to="/about-me"
          className="glow-cta inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
        >
          <motion.span variants={textVariants} transition={SPRING} className="relative">
            Click here to know me
            <motion.span
              variants={underlineVariants}
              transition={SPRING}
              style={{ originX: 0 }}
              className="absolute -bottom-1 left-0 h-px w-full bg-paper"
            />
          </motion.span>

          <motion.span
            variants={badgeVariants}
            transition={SPRING}
            className="flex size-5 flex-none items-center justify-center rounded-full bg-paper text-ink"
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
