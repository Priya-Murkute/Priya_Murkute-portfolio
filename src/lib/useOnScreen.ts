import { useEffect, useRef, useState } from "react";

/**
 * Viewport tracking for pausing ambient animation off-screen.
 *
 * `isOnScreen` is live; `hasBeenOnScreen` latches on first sight, for one-way
 * decisions like keeping a lazy chunk mounted. `rootMargin` is a string so the
 * effect has a stable primitive dependency.
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
