import type { Point } from "@/lib/worldMap";

/** One stretch of the journey, from one stop to the next. */
export interface Leg {
  from: Point;
  to: Point;
  /** The curve, in map units. */
  d: string;
  /** Seconds to draw it. */
  duration: number;
  /** Short enough to be a hop out and back, rather than a flight. The map zooms in for these. */
  hop: boolean;
  /**
   * For a hop, every stop of the run of hops it belongs to (out to the
   * Cotswolds and back, out to Dover and back are one run): what the camera
   * closes in on. The same array for the whole run. Null for a flight.
   */
  focus: Point[] | null;
  /** Seconds to hold at the stop before setting off: a beat, or long enough for the camera to arrive. */
  wait: number;
}

/** A leg shorter than this (in degrees) is a hop, not a flight. */
const HOP = 12;
const FLIGHT_SECONDS = 2.6;
const HOP_SECONDS = 0.75;
/** The pause at each stop, and the longer one when the view is about to change: in for hops, out again for a flight. */
const STOP_BEAT = 0.12;
const ZOOM_BEAT = 0.9;

/**
 * Each leg curves to the right of the way it's heading. A long flight arches
 * over the top of the map, as a flight path does, and a hop out and back
 * (London to the Cotswolds and home again) becomes a loop rather than
 * doubling back over its own line. Hops bow further, being short.
 */
function legBetween(from: Point, to: Point): Leg {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const hop = Math.hypot(dx, dy) < HOP;
  const bow = hop ? 0.9 : 0.28;
  const cx = (from.x + to.x) / 2 - dy * bow;
  const cy = (from.y + to.y) / 2 + dx * bow;
  return {
    from,
    to,
    d: `M${from.x} ${from.y}Q${cx} ${cy} ${to.x} ${to.y}`,
    duration: hop ? HOP_SECONDS : FLIGHT_SECONDS,
    hop,
    focus: null,
    wait: 0,
  };
}

/** The legs that join a list of stops, in order. */
export function buildLegs(stops: Point[]): Leg[] {
  const legs = stops.slice(1).map((stop, i) => legBetween(stops[i], stop));

  // A run of hops in a row is one place to look at.
  for (let start = 0; start < legs.length; ) {
    if (!legs[start].hop) {
      start += 1;
      continue;
    }
    let end = start;
    while (end < legs.length && legs[end].hop) end += 1;
    const run = legs.slice(start, end);
    const focus = run.flatMap((leg) => [leg.from, leg.to]);
    run.forEach((leg) => {
      leg.focus = focus;
    });
    start = end;
  }

  // Each stop is a beat's pause, and a longer one where the view changes, so the camera arrives before the line sets off.
  legs.forEach((leg, i) => {
    const viewChanges = leg.hop !== (legs[i - 1]?.hop ?? false);
    leg.wait = viewChanges ? ZOOM_BEAT : i === 0 ? 0 : STOP_BEAT;
  });
  return legs;
}

/** When each leg's turn begins, in seconds from the start, and when the whole journey ends. */
export function schedule(legs: Leg[]) {
  const turns: number[] = [];
  let end = 0;
  for (const leg of legs) {
    turns.push(end);
    end += leg.wait + leg.duration;
  }
  return { turns, end };
}

/** Slow away from a stop, quick between, slow into the next: how a journey feels rather than how a ruler draws. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
