"use client";

import { motion, type Transition, type Variants } from "motion/react";
import React from "react";

export type PresetType = "fade" | "slide" | "scale" | "blur" | "blur-slide";

export type AnimatedGroupProps = {
  children: React.ReactNode;
  className?: string;
  variants?: { container?: Variants; item?: Variants };
  preset?: PresetType;
  as?: keyof React.JSX.IntrinsicElements;
  asChild?: keyof React.JSX.IntrinsicElements;
  transition?: Transition;
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  fade: {},
  slide: {
    hidden: { y: 18 },
    visible: { y: 0 },
  },
  scale: {
    hidden: { scale: 0.9 },
    visible: { scale: 1 },
  },
  blur: {
    hidden: { filter: "blur(6px)" },
    visible: { filter: "blur(0px)" },
  },
  "blur-slide": {
    hidden: { filter: "blur(6px)", y: 18 },
    visible: { filter: "blur(0px)", y: 0 },
  },
};

/** Staggers its direct children in as a group when mounted. */
export function AnimatedGroup({
  children,
  className,
  variants,
  preset,
  as = "div",
  asChild = "div",
  transition,
}: AnimatedGroupProps) {
  const selectedVariants = preset
    ? {
        container: defaultContainerVariants,
        item: {
          hidden: { ...defaultItemVariants.hidden, ...presetVariants[preset].hidden },
          visible: { ...defaultItemVariants.visible, ...presetVariants[preset].visible },
        },
      }
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const containerVariants = variants?.container ?? selectedVariants.container;
  const itemVariants = variants?.item ?? selectedVariants.item;

  const MotionComponent = React.useMemo(() => motion.create(as), [as]);
  const MotionChild = React.useMemo(() => motion.create(asChild), [asChild]);

  return (
    <MotionComponent
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      transition={transition}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}
