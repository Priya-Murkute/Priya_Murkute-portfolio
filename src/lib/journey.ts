import type { Point } from "@/lib/worldMap";

/** One stretch of the journey, from one stop to the next. */
export interface Leg {
  from: Point;
  to: Point;
  /** The curve, in map units. */
  d: string;
  /** Seconds to draw it. */
  duration: number;
  /** Short enough to be a hop, rather than a flight. The map zooms in for these. */
  hop: boolean;
  /**
   * For a hop, every stop of the run of hops it belongs to (the trips out
   * from London are one run): what the camera closes in on. The same array
   * for the whole run. Null for a flight.
   */
  focus: Point[] | null;
  /** Seconds to hold at the stop before setting off: a beat, or long enough for the camera to arrive. */
  wait: number;
  /** One of the trips out from the last stop: they all draw at once, in step, rather than one after another. */
  fan: boolean;
}

/** A leg shorter than this (in degrees) is a hop, not a flight. */
const HOP = 12;
const FLIGHT_SECONDS = 2.6;
const HOP_SECONDS = 0.75;
/** The trips out from a stop all draw together, so they're given a little longer. */
const FAN_SECONDS = 1.6;
/** The pause at each stop, and the longer one when the view is about to change: in for hops, out again for a flight. */
const STOP_BEAT = 0.12;
const ZOOM_BEAT = 0.9;

/**
 * Each leg curves to the right of the way it's heading. A long flight arches
 * over the top of the map, as a flight path does; a hop bows only a little, so
 * the trips fanning out from one stop stay apart without wandering.
 */
function legBetween(from: Point, to: Point): Leg {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const hop = Math.hypot(dx, dy) < HOP;
  const bow = hop ? 0.18 : 0.28;
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
    fan: false,
  };
}

/**
 * The legs that join a list of stops, in order, then one out from the last stop to each of
 * the trips: a fan of single lines from that stop, none of them coming back, drawn all at once.
 */
export function buildLegs(stops: Point[], trips: Point[] = []): Leg[] {
  const legs = stops.slice(1).map((stop, i) => legBetween(stops[i], stop));
  const hub = stops[stops.length - 1];
  if (hub) {
    trips.forEach((trip) => {
      const leg = legBetween(hub, trip);
      leg.duration = FAN_SECONDS;
      leg.fan = true;
      legs.push(leg);
    });
  }

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
    // The fan sets off together: every line waits as long as the first one does.
    if (leg.fan && legs[i - 1]?.fan) leg.wait = legs[i - 1].wait;
  });
  return legs;
}

/**
 * When each leg's turn begins, in seconds from the start, and when the whole journey ends. A
 * leg's turn begins when the ones before it end, except that the legs of the fan share a turn.
 */
export function schedule(legs: Leg[]) {
  const turns: number[] = [];
  let end = 0;
  legs.forEach((leg, i) => {
    const turn = leg.fan && legs[i - 1]?.fan ? turns[i - 1] : end;
    turns.push(turn);
    end = Math.max(end, turn + leg.wait + leg.duration);
  });
  return { turns, end };
}

/** Slow away from a stop, quick between, slow into the next: how a journey feels rather than how a ruler draws. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
