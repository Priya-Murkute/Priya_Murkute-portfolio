"use client";

import { motion, type Transition } from "motion/react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type BorderTrailProps = {
  className?: string;
  size?: number;
  transition?: Transition;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: CSSProperties;
};

/**
 * A light that travels the border of its parent. Parent needs `relative` and
 * usually `overflow-hidden` plus a matching border radius.
 */
export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 6,
    ease: "linear",
  };

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn("absolute aspect-square bg-pass", className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          ...(delay !== undefined ? { delay } : {}),
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
