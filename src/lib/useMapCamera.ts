import { animate, useReducedMotion, type AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { EASE_CALM } from "@/lib/motion";
import { clampCamera, lerpCamera, type Camera } from "@/lib/worldMap";

const FLY_SECONDS = 0.8;

/**
 * The world map's camera. `set` moves it at once (dragging, pinching), while
 * `flyTo` glides there, unless the visitor prefers reduced motion. Either
 * stops a fly already under way, so the visitor's hands always win.
 *
 * The latest camera is also kept in `current`, for pointer and wheel
 * handlers, which run outside render and would otherwise see a stale one.
 */
export function useMapCamera(aspect: number, initial: Camera) {
  const reduced = useReducedMotion();
  const [camera, setCamera] = useState(initial);
  const current = useRef(camera);
  const aspectRef = useRef(aspect);
  const flight = useRef<AnimationPlaybackControls | null>(null);

  useLayoutEffect(() => {
    aspectRef.current = aspect;
  }, [aspect]);
  useEffect(() => () => flight.current?.stop(), []);

  const stop = useCallback(() => flight.current?.stop(), []);

  const set = useCallback(
    (next: Camera) => {
      stop();
      const clamped = clampCamera(next, aspectRef.current);
      current.current = clamped;
      setCamera(clamped);
    },
    [stop],
  );

  const flyTo = useCallback(
    (target: Camera) => {
      const to = clampCamera(target, aspectRef.current);
      if (reduced) return set(to);
      stop();
      const from = current.current;
      flight.current = animate(0, 1, {
        duration: FLY_SECONDS,
        ease: EASE_CALM,
        onUpdate: (t) => {
          const next = lerpCamera(from, to, t);
          current.current = next;
          setCamera(next);
        },
      });
    },
    [reduced, set, stop],
  );

  return { camera, current, set, flyTo, stop };
}
