import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Haikei-style background assets, written by hand so they read from the theme
 * tokens instead of being exported as flat SVG files. Every one of them is
 * decorative — they are all aria-hidden and none carry information.
 */

/** Haikei "blurry gradient": a few wide ellipses pushed through a heavy blur. */
export function BlurryGradient({ className }: { className?: string }) {
  const id = useId();
  const blur = `blur-${id}`;

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
        <ellipse cx="170" cy="150" rx="300" ry="210" fill="var(--halo-mint)" />
        <ellipse cx="760" cy="120" rx="260" ry="190" fill="var(--halo-sky)" />
        <ellipse cx="520" cy="430" rx="330" ry="200" fill="var(--halo-sage)" />
        <ellipse cx="900" cy="520" rx="240" ry="170" fill="var(--halo-sand)" />
      </g>
    </svg>
  );
}

const WAVE = "M0 96C160 40 320 152 480 96S800 24 960 96 1280 160 1440 96";

/**
 * Haikei "layered waves", reduced to stroked contours. Filled bands would
 * dominate the page; hairlines read as a topographic seam between sections.
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
        <path
          key={offset}
          d={WAVE}
          transform={`translate(0 ${offset})`}
          stroke="var(--line-strong)"
          strokeWidth={1}
          opacity={0.9 - index * 0.16}
        />
      ))}
    </svg>
  );
}

/** Haikei "stacked waves": filled bands that settle the bottom of the page. */
export function StackedWaves({ className }: { className?: string }) {
  const layers = [
    { offset: 0, fill: "var(--halo-mint)", opacity: 0.7 },
    { offset: 34, fill: "var(--halo-sage)", opacity: 0.55 },
    { offset: 68, fill: "var(--halo-sky)", opacity: 0.4 },
  ];

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none w-full", className)}
      viewBox="0 0 1440 220"
      preserveAspectRatio="none"
    >
      {layers.map((layer) => (
        <path
          key={layer.offset}
          d={`${WAVE} L1440 220 L0 220 Z`}
          transform={`translate(0 ${layer.offset})`}
          fill={layer.fill}
          opacity={layer.opacity}
        />
      ))}
    </svg>
  );
}
