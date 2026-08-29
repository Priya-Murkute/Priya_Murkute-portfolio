"use client";

import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type SpotlightProps = {
  className?: string;
  size?: number;
  springOptions?: SpringOptions;
  /**
   * The light's colour, as any CSS colour. Defaults to the accent token so the
   * spotlight retints itself in dark mode. Upstream motion-primitives leans on
   * Tailwind gradient utilities here; a token keeps it theme-aware instead.
   */
  color?: string;
};

/**
 * A soft light that follows the cursor inside its nearest positioned parent.
 * Give the parent `relative overflow-hidden`.
 */
export function Spotlight({
  className,
  size = 200,
  springOptions = { bounce: 0 },
  color = "color-mix(in oklab, var(--pass) 22%, transparent)",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [parentElement, setParentElement] = useState<HTMLElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightLeft = useSpring(0, springOptions);
  const spotlightTop = useSpring(0, springOptions);

  useEffect(() => {
    if (!containerRef.current) return;
    const parent = containerRef.current.parentElement;
    if (!parent) return;
    parent.style.position = "relative";
    parent.style.overflow = "hidden";
    setParentElement(parent);
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!parentElement) return;
      const { left, top } = parentElement.getBoundingClientRect();
      mouseX.set(event.clientX - left);
      mouseY.set(event.clientY - top);
    },
    [mouseX, mouseY, parentElement],
  );

  useEffect(() => {
    const unsubX = mouseX.on("change", (value) => spotlightLeft.set(value - size / 2));
    const unsubY = mouseY.on("change", (value) => spotlightTop.set(value - size / 2));
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, size, spotlightLeft, spotlightTop]);

  useEffect(() => {
    if (!parentElement) return;
    const enter = () => setIsHovered(true);
    const leave = () => setIsHovered(false);
    parentElement.addEventListener("mousemove", handleMouseMove);
    parentElement.addEventListener("mouseenter", enter);
    parentElement.addEventListener("mouseleave", leave);
    return () => {
      parentElement.removeEventListener("mousemove", handleMouseMove);
      parentElement.removeEventListener("mouseenter", enter);
      parentElement.removeEventListener("mouseleave", leave);
    };
  }, [parentElement, handleMouseMove]);

  return (
    <motion.div
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-2xl transition-opacity duration-500",
        isHovered ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        width: size,
        height: size,
        left: spotlightLeft,
        top: spotlightTop,
        backgroundImage: `radial-gradient(circle at center, ${color}, transparent 72%)`,
      }}
    />
  );
}
