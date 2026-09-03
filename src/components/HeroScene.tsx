import { lazy, Suspense, useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * three + @react-three/fiber are the single heaviest dependency in this
 * project — this lazy-loads the actual scene so that weight is fetched in
 * its own chunk, off the critical path, instead of sitting in the main
 * bundle every page load pays for.
 */
const HeroSceneCanvas = lazy(() => import("@/components/HeroSceneCanvas"));

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export default function HeroScene() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    setCanRender(supportsWebGL());
  }, []);

  if (!canRender) return null;

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={null}>
        <HeroSceneCanvas animate={!prefersReducedMotion} />
      </Suspense>
    </div>
  );
}
