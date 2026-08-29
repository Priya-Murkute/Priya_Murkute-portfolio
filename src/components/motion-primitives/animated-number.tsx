"use client";

import {
  motion,
  useInView,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
} from "motion/react";
import React, { useEffect, useRef } from "react";

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  /** Kept to a short list of tags: the full JSX element union is too wide for TS to resolve here. */
  as?: "span" | "div" | "p" | "strong" | "dd";
  /** Formats the rounded value. Defaults to the plain integer. */
  format?: (value: number) => string;
  /** Counts up the first time it scrolls into view rather than on mount. */
  startOnView?: boolean;
};

const DEFAULT_SPRING: SpringOptions = { bounce: 0, duration: 1600 };

/** A number that animates to its value. Used for the résumé's metrics. */
export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = "span",
  format = (rounded) => rounded.toLocaleString("en-GB"),
  startOnView = false,
}: AnimatedNumberProps) {
  const MotionComponent = React.useMemo(
    () =>
      motion.create(as) as React.ComponentType<{
        ref?: React.Ref<HTMLElement>;
        className?: string;
        /** motion renders a MotionValue child directly, without a React re-render. */
        children?: React.ReactNode | MotionValue<string>;
      }>,
    [as],
  );
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });

  const spring = useSpring(startOnView ? 0 : value, { ...DEFAULT_SPRING, ...springOptions });
  const display = useTransform(spring, (current) => format(Math.round(current)));

  useEffect(() => {
    if (!startOnView || isInView) spring.set(value);
  }, [spring, value, startOnView, isInView]);

  return (
    <MotionComponent ref={ref as never} className={className}>
      {display}
    </MotionComponent>
  );
}
