import { useCallback, useEffect, useRef, type PointerEvent } from "react";
import { useReducedMotion } from "motion/react";
import { releasePetal, whenPetalSceneReady } from "@/lib/petalRelease";
import { readStorage, writeStorage } from "@/lib/storage";
import { clamp } from "@/lib/utils";

/** "Some": about four petals a second while the cursor moves along the name. */
const MOVE_INTERVAL_MS = 250;
const ENTER_COUNT = 3;
const ENTER_STAGGER_MS = 190;
/** The once-per-visit release, so touch visitors (no hover) see it too. */
const WELCOME_COUNT = 9;
const WELCOME_DELAY_MS = 400;
const WELCOME_KEY = "pm-name-petals";

// If storage is unavailable the welcome may repeat, which is harmless.
const hasWelcomed = () => readStorage("session", WELCOME_KEY) === "1";
const markWelcomed = () => writeStorage("session", WELCOME_KEY, "1");

/**
 * Lets the element it's attached to shed petals into the hero's 3D scene:
 * from the letters under a mouse cursor, and once per visit on its own.
 * Nothing happens under reduced motion.
 */
export function useNamePetals<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const lastRelease = useRef(0);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const releaseAt = useCallback((clientX?: number) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = clientX ?? rect.left + rect.width * (0.05 + Math.random() * 0.9);
    releasePetal({
      // Kept within the name, so no petal appears to come from beside it.
      clientX: clamp(x, rect.left + 4, rect.right - 4),
      // The middle band of the letters, so petals leave the glyphs, not the gaps above them.
      clientY: rect.top + rect.height * (0.3 + Math.random() * 0.4),
    });
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || hasWelcomed()) return;
    const timers: number[] = [];
    const cancel = whenPetalSceneReady(() => {
      markWelcomed();
      for (let i = 0; i < WELCOME_COUNT; i += 1) {
        const delay = WELCOME_DELAY_MS + i * ENTER_STAGGER_MS + Math.random() * 90;
        timers.push(window.setTimeout(() => releaseAt(), delay));
      }
    });
    return () => {
      cancel();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [prefersReducedMotion, releaseAt]);

  const onPointerEnter = useCallback(
    (event: PointerEvent<T>) => {
      if (prefersReducedMotion || event.pointerType !== "mouse") return;
      const x = event.clientX;
      for (let i = 0; i < ENTER_COUNT; i += 1) {
        window.setTimeout(() => releaseAt(x + (Math.random() - 0.5) * 60), i * ENTER_STAGGER_MS);
      }
      lastRelease.current = performance.now();
    },
    [prefersReducedMotion, releaseAt],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<T>) => {
      if (prefersReducedMotion || event.pointerType !== "mouse") return;
      const now = performance.now();
      if (now - lastRelease.current < MOVE_INTERVAL_MS) return;
      lastRelease.current = now;
      releaseAt(event.clientX);
    },
    [prefersReducedMotion, releaseAt],
  );

  return { ref, onPointerEnter, onPointerMove };
}
