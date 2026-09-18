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
 * The Hero's secondary call to action, beside "View My Work". One shared
 * variant state propagates from the wrapping motion.div, so the whole thing
 * animates together on hover.
 */
export default function AboutMeLink() {
  return (
    <Magnetic intensity={0.25} range={110}>
      <motion.div initial="rest" whileHover="hover" whileTap={{ scale: 0.97 }} className="w-fit">
        <Link
          to="/about-me"
          className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-ink transition-transform hover:-translate-y-px"
        >
          <motion.span variants={textVariants} transition={SPRING} className="relative">
            About Me
            <motion.span
              variants={underlineVariants}
              transition={SPRING}
              style={{ originX: 0 }}
              className="absolute -bottom-1 left-0 h-px w-full bg-ink"
            />
          </motion.span>

          <motion.span
            variants={badgeVariants}
            transition={SPRING}
            className="flex size-5 flex-none items-center justify-center rounded-full bg-ink text-paper"
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
