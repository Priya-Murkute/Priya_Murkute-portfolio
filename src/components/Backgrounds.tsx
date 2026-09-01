import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Haikei-style background assets, written by hand so they read from the theme
 * tokens instead of being exported as flat SVG files. Every one of them is
 * decorative — they are all aria-hidden and none carry information.
 *
 * Each one drifts continuously via the `.haikei-drift` CSS animation
 * (styles.css) rather than a JS-driven motion value: these loops run for the
 * entire page lifetime, so keeping them on the compositor thread instead of
 * the main thread keeps them from competing with scroll handling and other
 * animations. `prefers-reduced-motion` freezes them globally, already
 * handled by the site-wide rule in styles.css.
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

/** Haikei "blurry gradient": a few wide ellipses pushed through a heavy blur, drifting. */
export function BlurryGradient({ className }: { className?: string }) {
  const id = useId();
  const blur = `blur-${id}`;

  const blobs = [
    { cx: 170, cy: 150, rx: 300, ry: 210, fill: "var(--halo-mint)", dx: 26, dy: 16, duration: 22 },
    { cx: 760, cy: 120, rx: 260, ry: 190, fill: "var(--halo-sky)", dx: -22, dy: 20, duration: 26 },
    { cx: 520, cy: 430, rx: 330, ry: 200, fill: "var(--halo-sage)", dx: 20, dy: -18, duration: 24 },
    { cx: 900, cy: 520, rx: 240, ry: 170, fill: "var(--halo-sand)", dx: -18, dy: -14, duration: 20 },
  ];

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      viewBox="0 0 960 640"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: "var(--halo-opacity)" }}
    >
      <defs>
        <filter id={blur} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="96" />
        </filter>
      </defs>
      <g filter={`url(#${blur})`}>
        {blobs.map((blob, index) => (
          <g key={index} className="haikei-drift" style={driftStyle(blob.dx, blob.dy, blob.duration)}>
            <ellipse cx={blob.cx} cy={blob.cy} rx={blob.rx} ry={blob.ry} fill={blob.fill} />
          </g>
        ))}
      </g>
    </svg>
  );
}

const WAVE = "M0 96C160 40 320 152 480 96S800 24 960 96 1280 160 1440 96";

/**
 * Haikei "layered waves", reduced to stroked contours. Filled bands would
 * dominate the page; hairlines read as a topographic seam between sections.
 * Each contour drifts sideways at its own slow, offset pace.
 */
export function LayeredWaves({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none w-full", className)}
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      fill="none"
    >
      {[0, 16, 32, 48, 64].map((offset, index) => (
        <g key={offset} transform={`translate(0 ${offset})`}>
          <path
            d={WAVE}
            className="haikei-drift"
            style={driftStyle(18, 0, 9 + index * 1.4, index * 0.3)}
            stroke="var(--line-strong)"
            strokeWidth={1}
            opacity={0.9 - index * 0.16}
          />
        </g>
      ))}
    </svg>
  );
}

/** Haikei "stacked waves": filled bands that settle the bottom of the page, gently breathing. */
export function StackedWaves({ className }: { className?: string }) {
  const layers = [
    { offset: 0, fill: "var(--halo-mint)", opacity: 0.7, duration: 12 },
    { offset: 34, fill: "var(--halo-sage)", opacity: 0.55, duration: 15 },
    { offset: 68, fill: "var(--halo-sky)", opacity: 0.4, duration: 18 },
  ];

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none w-full", className)}
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
    >
      {layers.map((layer) => (
        <g key={layer.offset} transform={`translate(0 ${layer.offset})`}>
          <path
            d={`${WAVE} L1440 220 L0 220 Z`}
            className="haikei-drift"
            style={driftStyle(14, 0, layer.duration)}
            fill={layer.fill}
            opacity={layer.opacity}
          />
        </g>
      ))}
    </svg>
  );
}
