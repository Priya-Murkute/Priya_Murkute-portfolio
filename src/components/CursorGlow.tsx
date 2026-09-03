import { useEffect, useRef } from "react";

/**
 * A soft trailing glow that augments the real cursor rather than replacing
 * it — the system pointer stays visible and precise the whole time. Blooms
 * brighter over links and buttons so interactive elements read as "warm"
 * without a full cursor takeover. Fine-pointer devices only, and off
 * entirely under prefers-reduced-motion (see the CSS gate in styles.css too).
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canGlow =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canGlow) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = -100;
    let mouseY = -100;
    let x = mouseX;
    let y = mouseY;
    let hasMoved = false;
    let frame: number;

    const handleMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (!hasMoved) {
        hasMoved = true;
        glow.classList.add("cursor-glow-near");
      }
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      glow.classList.toggle("cursor-glow-hover", Boolean(target.closest("a, button")));
    };

    const tick = () => {
      x += (mouseX - x) * 0.16;
      y += (mouseY - y) * 0.16;
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" aria-hidden="true" />;
}
