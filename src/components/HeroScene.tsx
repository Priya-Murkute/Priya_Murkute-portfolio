import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useOnScreen } from "@/lib/useOnScreen";

/**
 * three + @react-three/fiber are the single heaviest dependency in this
 * project — this lazy-loads the actual scene so that weight is fetched in
 * its own chunk, off the critical path, instead of sitting in the main
 * bundle every page load pays for.
 *
 * The split alone only defers *parsing*, though: a bare `lazy()` still
 * requests the chunk the moment this mounts, so every visitor pays ~220 KB
 * gzip immediately for what is decoration. The import is therefore held
 * until the browser is idle AND the hero is actually on screen, and the
 * render loop is stopped whenever it scrolls away.
 */
const HeroSceneCanvas = lazy(() => import("@/components/HeroSceneCanvas"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (!context) return false;
    // Browsers cap the number of live WebGL contexts (~16). This probe runs on
    // every mount of a hero, so release it rather than leaving it to GC.
    (context as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** `requestIdleCallback` with a timeout fallback for Safari < 16.4. */
function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 200);
  return () => window.clearTimeout(handle);
}

export default function HeroScene() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  // Lazy initialiser rather than an effect: this is a one-off capability
  // probe, and running it during the first render avoids a second render
  // purely to record the answer.
  const [canRender] = useState(supportsWebGL);

  // `isOnScreen` drives the render loop, so it stops when the hero scrolls
  // away; `hasBeenOnScreen` latches, so the chunk stays mounted once fetched.
  const { ref: containerRef, isOnScreen, hasBeenOnScreen } = useOnScreen<HTMLDivElement>("200px");

  // Hold the import until the browser has nothing better to do, so it never
  // competes with the fonts, the hero's own entrance, or first paint.
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => onIdle(() => setIsIdle(true)), []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true">
      {canRender && hasBeenOnScreen && isIdle ? (
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <HeroSceneCanvas animate={!prefersReducedMotion} isOnScreen={isOnScreen} />
          </Suspense>
        </ErrorBoundary>
      ) : null}
    </div>
  );
}
