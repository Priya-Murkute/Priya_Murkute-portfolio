import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { artworks } from "@/data/gallery";
import { cn } from "@/lib/utils";

const HOLD_MS = 650;
/** Gap between one advance finishing and the ring starting to charge again, while still held. */
const REPEAT_GAP_MS = 80;
const SPRING = { type: "spring" as const, stiffness: 100, damping: 18 };

const CARD_WIDTH = 200;
const CARD_HEIGHT = 280;

/**
 * Card pose per offset from the active (0) position — index by clamped
 * offset + 2. `x` is the fan's horizontal spread, precomputed as if the
 * prototype's `rotateY(deg) translateZ(px)` orbit (rotate first, so the
 * translate rides along the tilted local Z axis and swings the card
 * sideways) had been applied, then projected through the stage's 1100px
 * perspective: x = translateZ*sin(rotateY) * (1100 / (1100 - translateZ*cos(rotateY))).
 * Motion composes x/y/z as a plain additive offset applied after rotate/scale
 * (not before, the way raw CSS transform strings would), so the sideways
 * swing has to be supplied directly rather than emerging from rotateY +
 * translateZ order the way it does in the prototype's CSS.
 */
const POSITIONS = [
  { x: -55, rotateY: -62, translateZ: 60, scale: 0.52, opacity: 0.15, zIndex: 1 },
  { x: -115, rotateY: -38, translateZ: 165, scale: 0.78, opacity: 0.55, zIndex: 2 },
  { x: 0, rotateY: 0, translateZ: 320, scale: 1, opacity: 1, zIndex: 5 },
  { x: 115, rotateY: 38, translateZ: 165, scale: 0.78, opacity: 0.55, zIndex: 2 },
  { x: 55, rotateY: 62, translateZ: 60, scale: 0.52, opacity: 0.15, zIndex: 1 },
] as const;

function offsetOf(index: number, current: number, total: number) {
  let offset = index - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

/**
 * The 3D art carousel. No prev/next buttons — the left/right 36% of the
 * stage are hover zones; hold for 650ms (shown only by the SVG ring at the
 * edge) and it advances, then keeps advancing for as long as you stay in
 * the zone. A direct click on a zone skips the hold.
 */
export default function Carousel3D() {
  const total = artworks.length;
  const [current, setCurrent] = useState(0);
  const [zone, setZone] = useState<"l" | "r" | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    if (!zone) {
      setCharging(false);
      return;
    }

    // A timer can't fire mid-flight once this cleanup runs, so clearing the
    // pending one is enough to stop the chain — no separate "cancelled" flag needed.
    let timer: number;

    const cycle = () => {
      setCharging(true);
      timer = window.setTimeout(() => {
        setCurrent((c) => (zone === "l" ? (c - 1 + total) % total : (c + 1) % total));
        setCharging(false);
        timer = window.setTimeout(cycle, REPEAT_GAP_MS);
      }, HOLD_MS);
    };

    cycle();
    return () => window.clearTimeout(timer);
  }, [zone, total]);

  const armZone = (dir: "l" | "r") => setZone((prev) => (prev === dir ? prev : dir));
  const clearZone = () => setZone(null);

  const goto = (index: number) => {
    clearZone();
    setCurrent(((index % total) + total) % total);
  };

  // Cached on enter/resize rather than re-read on every mousemove — the
  // stage's position doesn't change mid-hover.
  const stageRef = useRef<HTMLDivElement>(null);
  const stageRect = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    stageRect.current = stageRef.current?.getBoundingClientRect() ?? null;
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = stageRect.current;
    if (!rect) return;
    const pct = (event.clientX - rect.left) / rect.width;
    if (pct < 0.36) armZone("l");
    else if (pct > 0.64) armZone("r");
    else clearZone();
  };

  const active = artworks[current];

  return (
    <div>
      <div
        ref={stageRef}
        role="region"
        aria-label="Art carousel"
        className="relative flex h-[460px] items-center justify-center select-none [perspective:1100px] [perspective-origin:50%_40%]"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={clearZone}
      >
        <HoverZone side="l" active={zone === "l"} charging={charging} onActivate={() => goto(current - 1)} />
        <HoverZone side="r" active={zone === "r"} charging={charging} onActivate={() => goto(current + 1)} />

        <div className="relative h-full w-full [transform-style:preserve-3d]">
          {artworks.map((art, i) => {
            const offset = offsetOf(i, current, total);
            const hidden = Math.abs(offset) > 2;
            const pos = POSITIONS[Math.max(-2, Math.min(2, offset)) + 2];

            return (
              <motion.button
                key={art.id}
                type="button"
                aria-label={art.title}
                aria-current={offset === 0}
                className="absolute top-1/2 left-1/2 h-[280px] w-[200px] cursor-pointer overflow-hidden rounded-[3px]"
                style={{
                  zIndex: hidden ? 0 : pos.zIndex,
                  pointerEvents: hidden ? "none" : "auto",
                }}
                animate={{
                  x: pos.x - CARD_WIDTH / 2,
                  y: -CARD_HEIGHT / 2,
                  rotateY: pos.rotateY,
                  z: pos.translateZ,
                  scale: pos.scale,
                  opacity: hidden ? 0 : pos.opacity,
                }}
                transition={SPRING}
                onClick={() => offset !== 0 && goto(i)}
              >
                <div
                  className={cn(
                    "flex h-full w-full flex-col bg-surface p-3.5 pb-12 shadow-[0_2px_4px_rgba(0,0,0,.04),0_8px_24px_rgba(0,0,0,.08),0_0_0_1px_var(--line)]",
                    offset === 0 &&
                      "shadow-[0_20px_60px_rgba(0,0,0,.18),0_4px_16px_rgba(0,0,0,.1),0_0_0_1px_var(--line)]",
                  )}
                >
                  <div className="flex-1 overflow-hidden rounded-[1px]" style={{ background: art.gradient }} />
                  <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface px-4 py-3">
                    <p className="truncate font-sans text-[0.85rem] italic text-ink">{art.title}</p>
                    <p className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-faint">
                      {art.medium} · {art.year}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex min-h-14 flex-col items-center gap-1.5 text-center">
        <p className="font-sans text-2xl italic text-ink">{active.title}</p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">
          {active.medium} · {active.year}
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-2.5" role="tablist" aria-label="Select artwork">
        {artworks.map((art, i) => (
          <button
            key={art.id}
            type="button"
            role="tab"
            aria-label={art.title}
            aria-selected={i === current}
            onClick={() => goto(i)}
            className={cn(
              "size-1.5 rounded-full transition-transform duration-300",
              i === current ? "scale-[1.3] bg-ink" : "bg-line-strong",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function HoverZone({
  side,
  active,
  charging,
  onActivate,
}: {
  side: "l" | "r";
  active: boolean;
  charging: boolean;
  onActivate: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={side === "l" ? "Previous artwork" : "Next artwork"}
      onClick={onActivate}
      className={cn(
        "absolute inset-y-0 z-20 flex w-[38%] cursor-default items-center bg-transparent transition-opacity duration-300",
        side === "l" ? "left-0 justify-start pl-5" : "right-0 justify-end pr-5",
        active ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <svg
        viewBox="0 0 42 42"
        className="size-[42px]"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        aria-hidden="true"
      >
        <circle
          cx={21}
          cy={21}
          r={19}
          fill="none"
          stroke="var(--pass)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray={120}
          strokeDashoffset={charging ? 0 : 120}
          style={{ transition: "stroke-dashoffset 650ms linear" }}
        />
      </svg>
    </button>
  );
}
