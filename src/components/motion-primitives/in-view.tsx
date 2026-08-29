"use client";

import { motion, useInView, type Transition, type Variant } from "motion/react";
import React, { useRef } from "react";

export type ViewOptions = {
  root?: React.RefObject<Element | null>;
  margin?: string;
  amount?: "some" | "all" | number;
};

export type InViewProps = {
  children: React.ReactNode;
  variants?: { hidden: Variant; visible: Variant };
  transition?: Transition;
  viewOptions?: ViewOptions;
  /** Kept to a short list of tags: the full JSX element union is too wide for TS to resolve here. */
  as?: "div" | "section" | "li" | "article" | "span";
  once?: boolean;
  className?: string;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/** Animates its children the first time they scroll into the viewport. */
export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = "div",
  once = false,
  className,
}: InViewProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { ...viewOptions, once } as never);
  const MotionComponent = React.useMemo(
    () =>
      motion.create(as) as React.ComponentType<{
        ref?: React.Ref<HTMLElement>;
        initial?: string;
        animate?: string;
        variants?: { hidden: Variant; visible: Variant };
        transition?: Transition;
        className?: string;
        children?: React.ReactNode;
      }>,
    [as],
  );

  return (
    <MotionComponent
      ref={ref as never}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
