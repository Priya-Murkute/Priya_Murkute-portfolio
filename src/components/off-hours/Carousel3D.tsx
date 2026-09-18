import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "motion/react";
import { artworks, hasRealArtworks } from "@/data/artGallery";
import { cn } from "@/lib/utils";

const HOLD_MS = 650;
/** Gap between one advance finishing and the ring starting to charge again, while still held. */
const REPEAT_GAP_MS = 80;
const SPRING = { type: "spring" as const, stiffness: 100, damping: 18 };

/** Drops the " · " when the filename encoded no medium. */
function formatCaption(art: { medium?: string; year: string }) {
  return art.medium ? `${art.medium} · ${art.year}` : art.year;
}

const CARD_WIDTH = 270;
const CARD_HEIGHT = 378;

/**
 * Card pose per offset from the active (0) position — index by clamped
 * offset + 2. `x` is precomputed rather than emergent: Motion applies x/y/z
 * additively *after* rotate/scale, so the sideways swing a CSS
 * `rotateY() translateZ()` would produce has to be supplied directly, already
 * projected through the stage's 1485px perspective.
 */
const POSITIONS = [
  { x: -74, rotateY: -62, translateZ: 81, scale: 0.52, opacity: 0.15, zIndex: 1 },
  { x: -155, rotateY: -38, translateZ: 223, scale: 0.78, opacity: 0.55, zIndex: 2 },
  { x: 0, rotateY: 0, translateZ: 432, scale: 1, opacity: 1, zIndex: 5 },
  { x: 155, rotateY: 38, translateZ: 223, scale: 0.78, opacity: 0.55, zIndex: 2 },
  { x: 74, rotateY: 62, translateZ: 81, scale: 0.52, opacity: 0.15, zIndex: 1 },
] as const;

function offsetOf(index: number, current: number, total: number) {
  let offset = index - current;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

/**
 * The left/right edges of the stage are hover zones: hold for 650ms and it
 * advances, then keeps advancing while held. A click skips the hold.
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

    // Clearing the pending timer stops the chain — no cancelled flag needed.
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

  // Cached on enter rather than re-read on every mousemove.
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
        className="relative flex h-[620px] items-center justify-center select-none [perspective:1485px] [perspective-origin:50%_40%]"
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
            // A CSS background can't use loading="lazy", so the fetch is
            // deferred by not setting it until the card is one position out.
            const shouldLoad = Math.abs(offset) <= 3;
            const pos = POSITIONS[Math.max(-2, Math.min(2, offset)) + 2];

            return (
              <motion.button
                key={art.id}
                type="button"
                aria-label={art.title}
                aria-current={offset === 0}
                className="absolute top-1/2 left-1/2 h-[378px] w-[270px] cursor-pointer overflow-hidden rounded-[3px]"
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
                  <div
                    className={cn(
                      "relative flex-1 overflow-hidden rounded-[1px]",
                      !hasRealArtworks && "border border-dashed border-line",
                    )}
                    style={{ background: shouldLoad ? art.gradient : undefined }}
                  >
                    {!hasRealArtworks && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <span className="font-mono text-[0.55rem] tracking-[0.08em] text-paper uppercase opacity-40">
                          [ photo goes here ]
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface px-4 py-3">
                    <p className="truncate font-sans text-[0.85rem] italic text-ink">{art.title}</p>
                    <p className="mt-0.5 font-mono text-[0.5rem] uppercase tracking-[0.08em] text-faint">
                      {formatCaption(art)}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Announced on change, so the caption isn't a silent update. */}
      <div
        className="mt-8 flex min-h-14 flex-col items-center gap-1.5 text-center"
        aria-live="polite"
        aria-atomic="true"
      >
        <p className="font-sans text-2xl italic text-ink">{active.title}</p>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.1em] text-faint">
          {formatCaption(active)}
        </p>
      </div>

      {/* Plain buttons, not a tablist: nothing here is a tabpanel, and tab
          roles would promise arrow-key semantics this doesn't implement. */}
      <div className="mt-6 flex justify-center gap-2.5">
        {artworks.map((art, i) => (
          <button
            key={art.id}
            type="button"
            aria-label={`Show ${art.title}`}
            aria-current={i === current}
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

/** Invisible until the cursor arms it, or until it takes keyboard focus. */
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
        "group/zone absolute inset-y-0 z-20 flex w-[38%] cursor-default items-center bg-transparent transition-opacity duration-300",
        side === "l" ? "left-0 justify-start pl-5" : "right-0 justify-end pr-5",
        active ? "opacity-100" : "pointer-events-none opacity-0",
        "focus-visible:pointer-events-auto focus-visible:opacity-100",
      )}
    >
      <svg
        viewBox="0 0 42 42"
        className="size-[42px]"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        aria-hidden="true"
      >
        {/* Track, so the control is legible on focus before it charges. */}
        <circle
          cx={21}
          cy={21}
          r={19}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1.5}
          className="opacity-0 group-focus-visible/zone:opacity-100"
        />
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
