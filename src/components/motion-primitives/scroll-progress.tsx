"use client";

import { motion, useScroll, useSpring, type SpringOptions } from "motion/react";
import type { RefObject } from "react";
import { cn } from "@/lib/utils";

export type ScrollProgressProps = {
  className?: string;
  springOptions?: SpringOptions;
  containerRef?: RefObject<HTMLDivElement | null>;
};

const DEFAULT_SPRING: SpringOptions = { stiffness: 200, damping: 50, restDelta: 0.001 };

/** A hairline that fills as the page scrolls. */
export function ScrollProgress({ className, springOptions, containerRef }: ScrollProgressProps) {
  const { scrollYProgress } = useScroll({
    container: containerRef as never,
  });

  const scaleX = useSpring(scrollYProgress, { ...DEFAULT_SPRING, ...springOptions });

  return (
    <motion.div
      aria-hidden="true"
      className={cn("inset-x-0 top-0 h-px origin-left bg-pass", className)}
      style={{ scaleX }}
    />
  );
}
