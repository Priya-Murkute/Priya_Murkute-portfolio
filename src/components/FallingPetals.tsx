import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { PETAL_PATH } from "@/lib/cherryBlossom";
import { makePetalFall, type PetalFall } from "@/lib/petalFall";
import { useTheme } from "@/context/useTheme";

/** How long a landed petal rests in the pile, then how long it takes to fade. */
const REST_SECONDS = 6;
const FADE_SECONDS = 1.6;

type Range = [number, number];

/** The defaults are the footer's: sparse petals that land. Callers pass module-level constants for
    the ranges, so their identity is stable and the effect below only restarts when something changes. */
const FIRST_MS: Range = [2500, 5000];
const GAP_MS: Range = [7000, 13000];
const SPEED: Range = [45, 90];
const SIZE: Range = [13, 28];

type FallingPetalsProps = {
  /** Petals fall only while this is true: the caller knows when the box is on screen, or motion is allowed. */
  active: boolean;
  /** Settle in the bottom of the box, rest, and fade (the default); or fall on out through it. */
  lands?: boolean;
  /** Ms before the first petal, and between one and the next: a range to pick from. */
  firstMs?: Range;
  gapMs?: Range;
  /** Petals that come down together as it starts, half a second apart, on top of the first. */
  atStart?: number;
  /** Never more than this many in the air (or resting) at once. */
  max?: number;
  /** Fall speed in px per second, and petal width in px. */
  speed?: Range;
  size?: Range;
  /** 0 allows the palest petals, 1 only the pinkest. */
  minPink?: number;
  opacity?: number;
};

/**
 * Petals drifting down through the box it is placed in: it fills its nearest positioned
 * ancestor (absolute, inset 0), ignores the pointer, and sits under whatever is drawn after it.
 * One petal at a time is made (lib/petalFall.ts) and played as a keyframed motion element. Used
 * above the footer (PetalScatter, where petals land and rest) and behind the vision board (where
 * they fall on through); the defaults are the footer's.
 */
export default function FallingPetals({
  active,
  lands = true,
  firstMs = FIRST_MS,
  gapMs = GAP_MS,
  atStart = 0,
  max = 3,
  speed = SPEED,
  size = SIZE,
  minPink = 0.45,
  opacity = 0.95,
}: FallingPetalsProps) {
  const { isDark } = useTheme();
  const layer = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const [petals, setPetals] = useState<(PetalFall & { id: number })[]>([]);

  useEffect(() => {
    if (!active) return;
    const timers: number[] = [];
    const after = (delay: number, callback: () => void) => timers.push(window.setTimeout(callback, delay));
    const between = ([low, high]: Range) => low + Math.random() * (high - low);

    const release = () => {
      const height = layer.current?.offsetHeight ?? 0;
      if (height <= 0 || document.hidden) return;
      const fall = makePetalFall({ layerHeight: height, isDark, lands, speed, size, minPink });
      const id = nextId.current;
      nextId.current += 1;
      setPetals((current) => [...current.slice(-(max - 1)), { ...fall, id }]);
    };
    const schedule = (delay: number) =>
      after(delay, () => {
        release();
        schedule(between(gapMs));
      });

    for (let i = 0; i < atStart; i += 1) after(i * 500, release);
    schedule(between(firstMs));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [active, isDark, lands, max, atStart, speed, size, firstMs, gapMs, minPink]);

  const remove = (id: number) => setPetals((current) => current.filter((petal) => petal.id !== id));

  return (
    <div ref={layer} data-petal-layer="" className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {petals.map((petal) => {
        const total = petal.seconds + (lands ? REST_SECONDS + FADE_SECONDS : 0);
        return (
          <motion.svg
            key={petal.id}
            data-drifting-petal=""
            viewBox="0 0 24 24"
            className="absolute top-0"
            style={{
              left: `${petal.left}%`,
              width: petal.size,
              height: petal.size,
              transformPerspective: 400,
            }}
            initial={{ opacity: 0, x: petal.x[0], y: petal.y[0] }}
            animate={{
              opacity: [0, opacity, opacity, 0],
              x: petal.x,
              y: petal.y,
              rotate: petal.rotate,
              rotateX: petal.rotateX,
              rotateY: petal.rotateY,
            }}
            transition={{
              default: { duration: petal.seconds, ease: "linear" },
              opacity: {
                duration: total,
                // Fades in over the first moments; a landed petal fades out after its rest, a passing one at the end.
                times: lands ? [0, 0.8 / total, (total - FADE_SECONDS) / total, 1] : [0, 0.06, 0.9, 1],
                ease: "easeInOut",
              },
            }}
            onAnimationComplete={() => remove(petal.id)}
          >
            <path d={PETAL_PATH} fill={petal.color} />
          </motion.svg>
        );
      })}
    </div>
  );
}
