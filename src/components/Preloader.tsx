import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { EASE_CALM } from "@/lib/motion";

const DURATION_MS = 600;
const HOLD_MS = 150;

/**
 * A short "test suite" run rather than a spinner. Mounted exclusively, so the
 * hero's entrance starts fresh rather than running behind this.
 */
export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let holdTimer = 0;
    let cancelled = false;

    // Holding the finish until webfonts land stops the hero headline
    // re-flowing a beat after the curtain lifts.
    const fontsReady: Promise<unknown> = document.fonts?.ready ?? Promise.resolve();

    const tick = (now: number) => {
      const pct = Math.min(100, Math.round(((now - start) / DURATION_MS) * 100));
      setProgress(pct);

      if (pct < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }

      fontsReady.then(() => {
        if (!cancelled) holdTimer = window.setTimeout(onComplete, HOLD_MS);
      });
    };

    frame = requestAnimationFrame(tick);

    return () => {
      // The hold timer needs clearing too, or onComplete can fire after unmount.
      cancelled = true;
      cancelAnimationFrame(frame);
      window.clearTimeout(holdTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-paper"
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.5, ease: EASE_CALM }}
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
        Running the suite before you arrive
      </span>

      <div className="flex items-baseline gap-1 font-display text-4xl font-semibold text-ink">
        <AnimatedNumber value={progress} />
        <span className="text-xl text-muted">%</span>
      </div>

      <div className="h-px w-40 overflow-hidden bg-line">
        <motion.div
          className="h-full bg-pass"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
