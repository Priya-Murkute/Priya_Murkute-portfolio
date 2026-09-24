import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useOnScreen } from "@/lib/useOnScreen";

/** ~220 KB gzip of three.js — held until idle and on screen, not just code-split. */
const HeroSceneCanvas = lazy(() => import("@/components/HeroSceneCanvas"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    if (!context) return false;
    // Browsers cap live WebGL contexts (~16), so release the probe's.
    (context as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** `requestIdleCallback` with a shorter timeout so the 3D scene loads during preloader, not after. */
function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === "function") {
    const handle = window.requestIdleCallback(callback, { timeout: 600 });
    return () => window.cancelIdleCallback(handle);
  }
  const handle = window.setTimeout(callback, 150);
  return () => window.clearTimeout(handle);
}

export default function HeroScene() {
  const prefersReducedMotion = useReducedMotion() ?? false;

  const [canRender] = useState(supportsWebGL);

  // isOnScreen drives the render loop; hasBeenOnScreen latches the mount.
  const { ref: containerRef, isOnScreen, hasBeenOnScreen } = useOnScreen<HTMLDivElement>("200px");

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
