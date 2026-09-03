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

  /**
   * Upstream reads `getBoundingClientRect()` inside the mousemove handler,
   * before checking whether the cursor is anywhere near — so every instance
   * forces a layout reflow on every mouse move for the whole page lifetime.
   * The rect is cached instead, read only while hovered (the only time the
   * value is used) and refreshed on the two things that can invalidate it.
   */
  const rectRef = useRef<DOMRect | null>(null);
  const readRect = useCallback(() => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  }, []);

  useEffect(() => {
    if (!isHovered) {
      rectRef.current = null;
      x.set(0);
      y.set(0);
      return;
    }

    readRect();

    const handleMouseMove = (event: MouseEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      const distanceX = event.clientX - (rect.left + rect.width / 2);
      const distanceY = event.clientY - (rect.top + rect.height / 2);
      const absoluteDistance = Math.hypot(distanceX, distanceY);

      if (absoluteDistance <= range) {
        const scale = 1 - absoluteDistance / range;
        x.set(distanceX * intensity * scale);
        y.set(distanceY * intensity * scale);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", readRect, { passive: true });
    window.addEventListener("resize", readRect);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", readRect);
      window.removeEventListener("resize", readRect);
    };
  }, [isHovered, intensity, range, x, y, readRect]);

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
