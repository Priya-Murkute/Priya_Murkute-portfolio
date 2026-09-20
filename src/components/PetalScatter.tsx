import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import FallingPetals from "@/components/FallingPetals";
import { PETAL_PATH, cherryBlossomColor, seededRandom } from "@/lib/cherryBlossom";
import { useOnScreen } from "@/lib/useOnScreen";
import { useTheme } from "@/context/ThemeContext";

/** Fewer than the old 42: at the hero's size, 42 would bury the section's bottom edge. */
const PETAL_COUNT = 30;

/** The hero scene's material opacity. */
const PETAL_OPACITY = 0.95;

type Petal = {
  left: number;
  bottom: number;
  size: number;
  rotation: number;
  /** A fixed 3D lean, so they lie at angles like the hero's tumbling petals. */
  tiltX: number;
  tiltY: number;
  color: string;
  swayDuration: number;
  swayDelay: number;
};

function makePetals(isDark: boolean): Petal[] {
  const random = seededRandom(42);
  return Array.from({ length: PETAL_COUNT }, () => ({
    left: random() * 100,
    bottom: random() * 26,
    // The hero's petals render at roughly 13–28px across on a desktop screen.
    size: 13 + random() * 15,
    rotation: random() * 360,
    tiltX: (random() - 0.5) * 110,
    tiltY: (random() - 0.5) * 110,
    color: cherryBlossomColor(random(), isDark),
    swayDuration: 3 + random() * 2.5,
    swayDelay: random() * 2,
  }));
}

/**
 * Fallen petals resting along the bottom of a section — the companion to the
 * hero's falling ones. Flat SVG rather than a second canvas. Every so often
 * one more drifts down from the top of the section (FallingPetals), rests, and fades.
 */
export default function PetalScatter() {
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const petals = useMemo(() => makePetals(isDark), [isDark]);

  // 30 petals × 3 looping tweens — not worth running off-screen.
  const { ref: containerRef, isOnScreen } = useOnScreen<HTMLDivElement>("100px");
  const isAnimated = !prefersReducedMotion && isOnScreen;

  return (
    <>
      {/* Every so often one more petal drifts down from the top of the section, rests in the pile, and
          fades; it sits behind the section's content, which is positioned later in the DOM. */}
      <FallingPetals active={isAnimated} />

      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden"
        aria-hidden="true"
      >
        {petals.map((petal, index) => (
          <motion.svg
            key={index}
            viewBox="0 0 24 24"
            className="absolute"
            style={{
              left: `${petal.left}%`,
              bottom: petal.bottom,
              width: petal.size,
              height: petal.size,
              rotateX: petal.tiltX,
              rotateY: petal.tiltY,
              transformPerspective: 400,
            }}
            initial={{ rotate: petal.rotation, opacity: 0, x: 0, y: 0 }}
            animate={
              !isAnimated
                ? { opacity: PETAL_OPACITY }
                : {
                    opacity: PETAL_OPACITY,
                    rotate: [petal.rotation - 5, petal.rotation + 5, petal.rotation - 5],
                    y: [0, -5, 0],
                    x: [0, 3, -2, 0],
                  }
            }
            transition={
              !isAnimated
                ? { duration: 0.6 }
                : {
                    opacity: { duration: 0.6 },
                    rotate: {
                      duration: petal.swayDuration,
                      delay: petal.swayDelay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    y: {
                      duration: petal.swayDuration * 1.4,
                      delay: petal.swayDelay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    x: {
                      duration: petal.swayDuration * 1.8,
                      delay: petal.swayDelay * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }
            }
          >
            <path d={PETAL_PATH} fill={petal.color} />
          </motion.svg>
        ))}
      </div>
    </>
  );
}
