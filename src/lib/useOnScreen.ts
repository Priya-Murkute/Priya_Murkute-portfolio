import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether the referenced element is in the viewport.
 *
 * Used to stop continuous ambient animation from running in sections nobody
 * is looking at — the falling petals, the settled petal scatter — which
 * otherwise run for the entire life of the page. This is deliberately not
 * `InView` from motion-primitives: that one latches on first sight to reveal
 * content, whereas this has to keep reporting so work can stop again when the
 * section scrolls away.
 *
 * Returns both readings because callers need different ones:
 *
 * - `isOnScreen` is live, and drives whether animation should run now.
 * - `hasBeenOnScreen` latches on first sight, and drives one-way decisions
 *   like "the lazy chunk has been requested, keep it mounted".
 *
 * Both are set from inside the observer callback rather than derived in an
 * effect body or a render-phase ref, so there is no cascading render and
 * nothing is read during render.
 *
 * `rootMargin` is a string rather than a full options object so the effect
 * has a stable primitive dependency instead of a new object each render.
 */
export function useOnScreen<T extends Element>(rootMargin = "0px") {
  const ref = useRef<T>(null);
  const [isOnScreen, setIsOnScreen] = useState(false);
  const [hasBeenOnScreen, setHasBeenOnScreen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setHasBeenOnScreen(true);
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, isOnScreen, hasBeenOnScreen };
}
