import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cherryBlossomColor, seededRandom } from "@/lib/cherryBlossom";
import { useOnScreen } from "@/lib/useOnScreen";
import { useTheme } from "@/context/ThemeContext";

/**
 * The hero scene's petal, traced point for point from createPetalGeometry in
 * HeroSceneCanvas (its Shape, scaled ×24 and flipped to SVG's downward y), so
 * a fallen petal is the same obovate, notched shape as a falling one.
 */
const PETAL_PATH =
  "M12 23C13.2 17.72 22.56 15.32 23.04 8.12C23.28 4.28 19.68 2.12 15.84 3.08Q13.92 1.4 12 3.8Q10.08 1.4 8.16 3.08C4.32 2.12 0.72 4.28 0.96 8.12C1.44 15.32 10.8 17.72 12 23Z";

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

/* ---------- Arrivals: now and then, one petal drifts down and joins the pile ---------- */

const ARRIVAL_FIRST_MS = 2500;
const ARRIVAL_GAP_MS = 7000;
const ARRIVAL_GAP_SPREAD_MS = 6000;
/** Never more than this many arrivals in the air or resting at once. */
const MAX_ARRIVALS = 3;
/** Keyframes per fall — enough that the linear steps between them read as one curve. */
const ARRIVAL_STEPS = 28;
/** How long an arrival rests in the pile, then how long it takes to fade. */
const REST_SECONDS = 6;
const FADE_SECONDS = 1.6;

type Arrival = {
  id: number;
  left: number;
  size: number;
  color: string;
  fallSeconds: number;
  x: number[];
  y: number[];
  rotate: number[];
  rotateX: number[];
  rotateY: number[];
};

/** Eases to a stop while starting at the same speed as the fall, so the landing has no jolt. */
function settle(u: number) {
  return u + u * u - u * u * u;
}

function smoothstep(u: number) {
  const t = Math.min(Math.max(u, 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * The hero's motion, compressed into one fall: a steady descent with a
 * pendulum sway and a slow 3D tumble, which calm over the last quarter as the
 * petal settles at its resting angle among the others.
 */
function makeArrival(id: number, layerHeight: number, isDark: boolean): Arrival {
  const size = 13 + Math.random() * 15;
  const landY = layerHeight - size - Math.random() * 26;
  const startY = -size - 10;
  const fall = landY - startY;
  const fallSeconds = fall / (45 + Math.random() * 45);
  const drift = (Math.random() - 0.5) * 80;
  const sway = 14 + Math.random() * 22;
  const swayCycles = 1.2 + Math.random() * 1.3;
  const phase = Math.random() * Math.PI * 2;
  const spin = (Math.random() - 0.5) * 240;
  // A gentle rock rather than full turns: one petal on its own is easy to
  // lose while it's edge-on, so it stays mostly face-on as it falls.
  const tumbleX = 30 + Math.random() * 25;
  const tumbleY = 25 + Math.random() * 25;
  const restX = (Math.random() - 0.5) * 110;
  const restY = (Math.random() - 0.5) * 110;

  const frames: Omit<Arrival, "id" | "left" | "size" | "color" | "fallSeconds"> = {
    x: [],
    y: [],
    rotate: [],
    rotateX: [],
    rotateY: [],
  };
  for (let k = 0; k <= ARRIVAL_STEPS; k += 1) {
    const t = k / ARRIVAL_STEPS;
    // Steady until the last 15%, then eases onto the ground.
    const progress = t < 0.85 ? t : 0.85 + 0.15 * settle((t - 0.85) / 0.15);
    const calm = smoothstep((t - 0.75) / 0.25);
    const swayAngle = phase + t * swayCycles * Math.PI * 2;
    frames.x.push(drift * t + sway * (Math.sin(swayAngle) - Math.sin(phase)) * (1 - calm));
    frames.y.push(startY + fall * progress);
    frames.rotate.push(spin * t);
    frames.rotateX.push(Math.sin(t * Math.PI * 1.5) * tumbleX * (1 - calm) + restX * calm);
    frames.rotateY.push(Math.cos(t * Math.PI * 1.2) * tumbleY * (1 - calm) + restY * calm);
  }

  return {
    id,
    left: 4 + Math.random() * 92,
    size,
    // The pinker half of the range: a lone near-white petal would vanish
    // against the paper, where one among the hero's dozens doesn't matter.
    color: cherryBlossomColor(0.45 + Math.random() * 0.55, isDark),
    fallSeconds,
    ...frames,
  };
}

/**
 * Fallen petals resting along the bottom of a section — the companion to the
 * hero's falling ones. Flat SVG rather than a second canvas. Every so often
 * one more drifts down from the top of the section, rests, and fades.
 */
export default function PetalScatter() {
  const { isDark } = useTheme();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const petals = useMemo(() => makePetals(isDark), [isDark]);

  // 30 petals × 3 looping tweens — not worth running off-screen.
  const { ref: containerRef, isOnScreen } = useOnScreen<HTMLDivElement>("100px");
  const isAnimated = !prefersReducedMotion && isOnScreen;

  const layerRef = useRef<HTMLDivElement>(null);
  const nextArrivalId = useRef(0);
  const [arrivals, setArrivals] = useState<Arrival[]>([]);

  useEffect(() => {
    if (!isAnimated) return;
    let timer = 0;
    const schedule = (delay: number) => {
      timer = window.setTimeout(() => {
        const height = layerRef.current?.offsetHeight ?? 0;
        if (height > 0) {
          const arrival = makeArrival(nextArrivalId.current, height, isDark);
          nextArrivalId.current += 1;
          setArrivals((current) => [...current.slice(-(MAX_ARRIVALS - 1)), arrival]);
        }
        schedule(ARRIVAL_GAP_MS + Math.random() * ARRIVAL_GAP_SPREAD_MS);
      }, delay);
    };
    schedule(ARRIVAL_FIRST_MS + Math.random() * ARRIVAL_FIRST_MS);
    return () => window.clearTimeout(timer);
  }, [isAnimated, isDark]);

  const removeArrival = (id: number) =>
    setArrivals((current) => current.filter((arrival) => arrival.id !== id));

  return (
    <>
      {/* The whole section, so an arrival falls from the top; it sits behind
          the section's content, which is positioned later in the DOM. */}
      <div
        ref={layerRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {arrivals.map((arrival) => {
          const total = arrival.fallSeconds + REST_SECONDS + FADE_SECONDS;
          return (
            <motion.svg
              key={arrival.id}
              viewBox="0 0 24 24"
              className="absolute top-0"
              style={{
                left: `${arrival.left}%`,
                width: arrival.size,
                height: arrival.size,
                transformPerspective: 400,
              }}
              initial={{ opacity: 0, x: arrival.x[0], y: arrival.y[0] }}
              animate={{
                opacity: [0, PETAL_OPACITY, PETAL_OPACITY, 0],
                x: arrival.x,
                y: arrival.y,
                rotate: arrival.rotate,
                rotateX: arrival.rotateX,
                rotateY: arrival.rotateY,
              }}
              transition={{
                default: { duration: arrival.fallSeconds, ease: "linear" },
                opacity: {
                  duration: total,
                  times: [0, 0.8 / total, (total - FADE_SECONDS) / total, 1],
                  ease: "easeInOut",
                },
              }}
              onAnimationComplete={() => removeArrival(arrival.id)}
            >
              <path d={PETAL_PATH} fill={arrival.color} />
            </motion.svg>
          );
        })}
      </div>

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
