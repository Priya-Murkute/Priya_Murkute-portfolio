import type { CSSProperties } from "react";
import { useOnScreen } from "@/lib/useOnScreen";
import { cn } from "@/lib/utils";

/**
 * Decorative background layers, hand-written so they read theme tokens.
 *
 * All of them drift via the `.haikei-drift` CSS animation, and all of them
 * pause off-screen: animating SVG content forces the browser to re-rasterise
 * the whole SVG each frame, which competes directly with the hero's WebGL
 * canvas even when the animating element is far below the fold.
 */

type DriftVars = CSSProperties & {
  "--drift-x"?: string;
  "--drift-y"?: string;
  "--drift-duration"?: string;
  "--drift-delay"?: string;
};

function driftStyle(dx: number, dy: number, duration: number, delay = 0): DriftVars {
  return {
    "--drift-x": `${dx}px`,
    "--drift-y": `${dy}px`,
    "--drift-duration": `${duration}s`,
    "--drift-delay": `${delay}s`,
  };
}

/**
 * Soft ambient blobs.
 *
 * CSS radial gradients rather than ellipses behind an SVG `feGaussianBlur`:
 * a gradient fading to transparent *is* the blur, so the browser paints four
 * cheap layers instead of re-running a 96px Gaussian over the whole hero on
 * every frame of the drift. That filter alone cost ~10fps on a throttled
 * phone, and it sits directly behind the petal canvas.
 */
export function BlurryGradient({ className }: { className?: string }) {
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>("100px");

  // Positioned by top-left, not centred with a transform: the drift keyframes
  // animate `transform`, which would override an inline translate outright.
  const blobs = [
    { left: "-19%", top: "-15%", w: "72%", h: "76%", color: "var(--halo-mint)", dx: 26, dy: 16, duration: 22 },
    { left: "47%", top: "-16%", w: "64%", h: "69%", color: "var(--halo-sky)", dx: -22, dy: 20, duration: 26 },
    { left: "15%", top: "31%", w: "78%", h: "72%", color: "var(--halo-sage)", dx: 20, dy: -18, duration: 24 },
    { left: "64%", top: "50%", w: "60%", h: "63%", color: "var(--halo-sand)", dx: -18, dy: -14, duration: 20 },
  ];

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: "var(--halo-opacity)" }}
    >
      {blobs.map((blob) => (
        <div
          key={blob.color + blob.left}
          className={cn("haikei-drift absolute", !isOnScreen && "drift-paused")}
          style={{
            ...driftStyle(blob.dx, blob.dy, blob.duration),
            left: blob.left,
            top: blob.top,
            width: blob.w,
            height: blob.h,
            // Two stops, deliberately. A softer multi-stop ramp with
            // color-mix() looks marginally closer to a Gaussian tail and
            // measured ~20fps slower on a throttled phone — these blobs are
            // large, and a complex gradient is expensive to rasterise.
            background: `radial-gradient(closest-side, ${blob.color}, transparent)`,
          }}
        />
      ))}
    </div>
  );
}

const WAVE = "M0 96C160 40 320 152 480 96S800 24 960 96 1280 160 1440 96";

/** Stroked contours rather than filled bands — a topographic seam between sections. */
export function LayeredWaves({ className }: { className?: string }) {
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>("100px");

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        fill="none"
      >
        {[0, 16, 32, 48, 64].map((offset, index) => (
          <g key={offset} transform={`translate(0 ${offset})`}>
            <path
              d={WAVE}
              className={cn("haikei-drift", !isOnScreen && "drift-paused")}
              style={driftStyle(18, 0, 9 + index * 1.4, index * 0.3)}
              stroke="var(--line-strong)"
              strokeWidth={1}
              opacity={0.9 - index * 0.16}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}

/** Filled bands that settle the bottom of the page. */
export function StackedWaves({ className }: { className?: string }) {
  const { ref, isOnScreen } = useOnScreen<HTMLDivElement>("100px");

  const layers = [
    { offset: 0, fill: "var(--halo-mint)", opacity: 0.7, duration: 12 },
    { offset: 34, fill: "var(--halo-sage)", opacity: 0.55, duration: 15 },
    { offset: 68, fill: "var(--halo-sky)", opacity: 0.4, duration: 18 },
  ];

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none", className)}>
      <svg className="h-full w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
        {layers.map((layer) => (
          <g key={layer.offset} transform={`translate(0 ${layer.offset})`}>
            <path
              d={`${WAVE} L1440 220 L0 220 Z`}
              className={cn("haikei-drift", !isOnScreen && "drift-paused")}
              style={driftStyle(14, 0, layer.duration)}
              fill={layer.fill}
              opacity={layer.opacity}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
