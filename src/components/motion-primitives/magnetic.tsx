"use client";

import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const SPRING_CONFIG: SpringOptions = { stiffness: 26.7, damping: 4.1, mass: 0.2 };

export type MagneticProps = {
  children: ReactNode;
  intensity?: number;
  range?: number;
  actionArea?: "self" | "parent" | "global";
  springOptions?: SpringOptions;
};

/** Pulls its child toward the cursor while the cursor is within `range`. */
export function Magnetic({
  children,
  intensity = 0.6,
  range = 100,
  actionArea = "self",
  springOptions = SPRING_CONFIG,
}: MagneticProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  const calculateDistance = useCallback(
    (event: MouseEvent) => {
      if (!ref.current) return;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distanceX = event.clientX - centerX;
      const distanceY = event.clientY - centerY;
      const absoluteDistance = Math.hypot(distanceX, distanceY);

      if (isHovered && absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    },
    [isHovered, intensity, range, x, y],
  );

  useEffect(() => {
    window.addEventListener("mousemove", calculateDistance);
    return () => window.removeEventListener("mousemove", calculateDistance);
  }, [calculateDistance]);

  useEffect(() => {
    if (actionArea === "global") {
      setIsHovered(true);
      return;
    }

    if (actionArea === "parent") {
      const parent = ref.current?.parentElement;
      if (!parent) return;
      const enter = () => setIsHovered(true);
      const leave = () => setIsHovered(false);
      parent.addEventListener("mouseenter", enter);
      parent.addEventListener("mouseleave", leave);
      return () => {
        parent.removeEventListener("mouseenter", enter);
        parent.removeEventListener("mouseleave", leave);
      };
    }
  }, [actionArea]);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={actionArea === "self" ? () => setIsHovered(true) : undefined}
      onMouseLeave={actionArea === "self" ? () => setIsHovered(false) : undefined}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}
