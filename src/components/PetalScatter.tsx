import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";
import { cherryBlossomColor } from "@/lib/cherryBlossom";

/** Same notched sakura silhouette as the hero scene, flattened to an SVG path. */
const PETAL_PATH =
  "M12 27C6 21 4 11 6 5C7 2.2 9.2 1 12 4.4C14.8 1 17 2.2 18 5C20 11 18 21 12 27Z";

function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

type Petal = {
  left: number;
  bottom: number;
  size: number;
  rotation: number;
  color: string;
  swayDuration: number;
  swayDelay: number;
};

function makePetals(isDark: boolean): Petal[] {
  const random = seededRandom(42);
  return Array.from({ length: 42 }, () => ({
    left: random() * 100,
    bottom: random() * 26,
    size: 6 + random() * 9,
    rotation: random() * 360,
    color: cherryBlossomColor(random(), isDark),
    swayDuration: 3 + random() * 2.5,
    swayDelay: random() * 2,
  }));
}

/**
 * A scatter of fallen petals resting along the bottom of a section — the
 * "cherry blossoms on the street" companion to the hero's falling ones, as
 * if the ones from up top drifted down and settled here. Static SVG shapes
 * with a faint idle rustle, not another 3D scene: this strip is short, so a
 * canvas would be overkill for what's decoration here.
 */
export default function PetalScatter({ isDark }: { isDark: boolean }) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const petals = useMemo(() => makePetals(isDark), [isDark]);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-28 overflow-hidden"
      aria-hidden="true"
    >
      {petals.map((petal, index) => (
        <motion.svg
          key={index}
          viewBox="0 0 24 28"
          className="absolute"
          style={{
            left: `${petal.left}%`,
            bottom: petal.bottom,
            width: petal.size,
            height: petal.size * 1.15,
          }}
          initial={{ rotate: petal.rotation, opacity: 0, x: 0, y: 0 }}
          animate={
            prefersReducedMotion
              ? { opacity: 0.85 }
              : {
                  opacity: 0.85,
                  rotate: [petal.rotation - 5, petal.rotation + 5, petal.rotation - 5],
                  y: [0, -5, 0],
                  x: [0, 3, -2, 0],
                }
          }
          transition={
            prefersReducedMotion
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
  );
}
