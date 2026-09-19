import { animate, useReducedMotion } from "motion/react";
import { useId, useLayoutEffect, useRef } from "react";
import { easeInOut, schedule, type Leg } from "@/lib/journey";
import { clamp } from "@/lib/worldMap";

/** A beat before the first leg, so the map has settled and the eye has found it. */
const START_DELAY = 0.5;

/**
 * The journey drawn across the map, leg by leg, with a bright head running
 * along the line. It plays when `playKey` becomes non-zero, and again each
 * time it changes; at 0 nothing is drawn yet. For a visitor who prefers
 * reduced motion the whole route is simply there.
 *
 * Each line is drawn by sliding its dash (the path is measured as length 1,
 * so an offset of 1 is nothing and 0 is all of it). That's written straight
 * to the elements, frame by frame, rather than through React state: the map
 * re-renders on every camera move, and it shouldn't also do so 60 times a
 * second for this. React never sets these properties, so it never undoes them.
 *
 * `onLeg` is told which leg's turn it is as each one comes up (including the
 * pause before it is drawn), and `null` when the journey is over. That's how
 * the map knows when to zoom in for the hops, and back out afterwards.
 *
 * Widths are in screen pixels via `unit` (map units per pixel), like the pins.
 */
export default function JourneyRoute({
  legs,
  unit,
  playKey,
  onLeg,
}: {
  legs: Leg[];
  unit: number;
  playKey: number;
  onLeg?: (index: number | null) => void;
}) {
  const reduced = useReducedMotion();
  const gradientId = useId();
  const lines = useRef<(SVGPathElement | null)[]>([]);
  const head = useRef<SVGGElement>(null);
  // The latest callback, without restarting the animation whenever the parent makes a new one.
  const report = useRef(onLeg);
  useLayoutEffect(() => {
    report.current = onLeg;
  });

  useLayoutEffect(() => {
    const dot = head.current;
    if (reduced || !dot) return;

    const hide = () => {
      lines.current.forEach((line) => line?.style.setProperty("stroke-dashoffset", "1"));
      dot.style.opacity = "0";
    };
    hide();
    if (playKey === 0) return;

    // Each leg's turn begins when the one before ends; it draws after its own wait.
    const { turns, end } = schedule(legs);
    let turn = -1;

    const flight = animate(0, end, {
      duration: end,
      delay: START_DELAY,
      ease: "linear",
      onUpdate: (time) => {
        // The head rests at the end of the latest leg to have begun drawing, then rides the next.
        let riding = -1;
        let now = -1;
        legs.forEach((leg, i) => {
          const line = lines.current[i];
          const drawn = easeInOut(clamp((time - turns[i] - leg.wait) / leg.duration, 0, 1));
          line?.style.setProperty("stroke-dashoffset", String(1 - drawn));
          if (drawn > 0) riding = i;
          if (time >= turns[i]) now = i;
        });
        const line = riding >= 0 ? lines.current[riding] : null;
        if (line) {
          const drawn = easeInOut(clamp((time - turns[riding] - legs[riding].wait) / legs[riding].duration, 0, 1));
          const at = line.getPointAtLength(drawn * line.getTotalLength());
          dot.setAttribute("transform", `translate(${at.x} ${at.y})`);
          dot.style.opacity = "1";
        }

        if (now !== turn) {
          turn = now;
          report.current?.(now);
        }
      },
      onComplete: () => {
        dot.style.opacity = "0";
        report.current?.(null);
      },
    });
    return () => flight.stop();
  }, [legs, playKey, reduced]);

  if (legs.length === 0) return null;

  return (
    <>
      <defs>
        {legs.map((leg, i) =>
          leg.hop ? null : (
            <linearGradient key={i} id={`${gradientId}-${i}`} gradientUnits="userSpaceOnUse" x1={leg.from.x} y1={leg.from.y} x2={leg.to.x} y2={leg.to.y}>
              <stop offset="0" style={{ stopColor: "var(--pass)" }} />
              <stop offset="1" style={{ stopColor: "var(--accent-rose)" }} />
            </linearGradient>
          ),
        )}
      </defs>

      {legs.map((leg, i) => (
        <path
          key={i}
          ref={(node) => {
            lines.current[i] = node;
          }}
          data-leg={i}
          d={leg.d}
          pathLength={1}
          // A dash the whole length of the line, then a gap longer than it, so nothing shows at the ends when it's empty.
          strokeDasharray="1 2"
          fill="none"
          // A flight fades from green to rose along its length; the hops are rose all through.
          stroke={leg.hop ? "var(--accent-rose)" : `url(#${gradientId}-${i})`}
          strokeWidth={(leg.hop ? 1.3 : 1.6) * unit}
          strokeLinecap="round"
        />
      ))}

      {reduced ? null : (
        <g ref={head} style={{ opacity: 0 }}>
          <g transform={`scale(${unit})`}>
            <circle r={9} className="fill-[var(--accent-rose)]" opacity={0.22} />
            <circle r={4.5} className="fill-[var(--accent-rose)] stroke-surface" strokeWidth={1.5} />
          </g>
        </g>
      )}
    </>
  );
}
