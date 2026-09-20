import { cherryBlossomColor } from "@/lib/cherryBlossom";
import { clamp } from "@/lib/utils";

/** Keyframes per fall: enough that the linear steps between them read as one curve. */
const STEPS = 28;

export type PetalFallOptions = {
  /** Height of the box the petal falls through, in px. */
  layerHeight: number;
  isDark: boolean;
  /** Settle onto the bottom of the box and rest there, or carry on out through it. */
  lands: boolean;
  /** Fall speed, px per second: a range to pick from. */
  speed: [number, number];
  /** Width of a petal, px: a range to pick from. */
  size: [number, number];
  /** 0 allows the palest petals, 1 only the pinkest: a lone near-white petal vanishes against paper. */
  minPink: number;
};

/** One petal's fall, as keyframe arrays a motion element can play: x, y, rotate and the two tilts. */
export type PetalFall = {
  size: number;
  /** Where along the box it starts, as a percentage of its width. */
  left: number;
  color: string;
  /** How long the fall takes. */
  seconds: number;
  x: number[];
  y: number[];
  rotate: number[];
  rotateX: number[];
  rotateY: number[];
};

const between = ([low, high]: [number, number]) => low + Math.random() * (high - low);

/** Eases to a stop while starting at the same speed as the fall, so the landing has no jolt. */
function settle(u: number) {
  return u + u * u - u * u * u;
}

function smoothstep(u: number) {
  const t = clamp(u, 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * The hero's motion, compressed into one fall: a steady descent with a pendulum sway and a slow
 * 3D rock. A petal that lands calms over the last quarter and settles at a resting angle among
 * the others; one that doesn't simply keeps falling.
 */
export function makePetalFall({ layerHeight, isDark, lands, speed, size: sizeRange, minPink }: PetalFallOptions): PetalFall {
  const size = between(sizeRange);
  const startY = -size - 10;
  const endY = lands ? layerHeight - size - Math.random() * 26 : layerHeight + 20;
  const fall = endY - startY;
  const drift = (Math.random() - 0.5) * 80;
  const sway = 14 + Math.random() * 22;
  const swayCycles = 1.2 + Math.random() * 1.3;
  const phase = Math.random() * Math.PI * 2;
  const spin = (Math.random() - 0.5) * 240;
  // A gentle rock rather than full turns: one petal on its own is easy to lose while it's
  // edge-on, so it stays mostly face-on as it falls.
  const rockX = 30 + Math.random() * 25;
  const rockY = 25 + Math.random() * 25;
  const restX = (Math.random() - 0.5) * 110;
  const restY = (Math.random() - 0.5) * 110;

  const frames = { x: [] as number[], y: [] as number[], rotate: [] as number[], rotateX: [] as number[], rotateY: [] as number[] };
  for (let step = 0; step <= STEPS; step += 1) {
    const t = step / STEPS;
    // Steady until the last 15%, then (if it lands) eases onto the ground.
    const progress = !lands || t < 0.85 ? t : 0.85 + 0.15 * settle((t - 0.85) / 0.15);
    const calm = lands ? smoothstep((t - 0.75) / 0.25) : 0;
    const swayAngle = phase + t * swayCycles * Math.PI * 2;
    frames.x.push(drift * t + sway * (Math.sin(swayAngle) - Math.sin(phase)) * (1 - calm));
    frames.y.push(startY + fall * progress);
    frames.rotate.push(spin * t);
    frames.rotateX.push(Math.sin(t * Math.PI * 1.5) * rockX * (1 - calm) + restX * calm);
    frames.rotateY.push(Math.cos(t * Math.PI * 1.2) * rockY * (1 - calm) + restY * calm);
  }

  return {
    size,
    left: 4 + Math.random() * 92,
    color: cherryBlossomColor(minPink + Math.random() * (1 - minPink), isDark),
    seconds: fall / between(speed),
    ...frames,
  };
}
