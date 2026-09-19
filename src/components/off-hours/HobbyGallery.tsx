import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icon";
import { HobbyIconBadge } from "@/components/off-hours/hobbyIcons";
import { MorphingDialogClose, MorphingDialogDescription, MorphingDialogTitle } from "@/components/motion-primitives/morphing-dialog";
import type { ResolvedPicture } from "@/data/hobbyPictures";
import { EASE_CALM } from "@/lib/motion";
import { useElementSize } from "@/lib/useElementSize";
import { clamp } from "@/lib/utils";
import type { Hobby } from "@/types";

/** The gallery's parts arrive one after another, once the panel has grown in. */
const REVEAL = {
  hidden: { opacity: 0, y: 12 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_CALM } },
};
const REVEAL_SEQUENCE = { shown: { transition: { delayChildren: 0.12, staggerChildren: 0.07 } } };

/** The shared spring for a card opening and closing, so neighbours move as one. */
const CARD_SPRING = { type: "spring", stiffness: 210, damping: 30, mass: 0.9 } as const;

const GAP = 8;
/** Below this width the cards stack as horizontal strips instead of standing side by side. */
const STACK_BELOW = 560;
/** How far the soft edge reaches, on a side where more cards continue. */
const EDGE_FADE = 44;
/** A drag must travel this far (px) before it counts as browsing rather than a click. */
const DRAG_THRESHOLD = 6;

interface GalleryLayout {
  stacked: boolean;
  /** A closed card's width (side by side) or height (stacked). */
  slim: number;
  /** The open card's size along the track. */
  open: number;
  /** The whole track's length, and the visible stretch of it. */
  total: number;
  visible: number;
  /** The other dimension: the row's height, or the stack's width. */
  cross: number;
  /** Where each card starts along the track. */
  starts: number[];
}

/**
 * Sizes every card for the gallery's current size and open picture. The open
 * card takes its photo's own shape within sensible limits; closed cards stay
 * slim however many there are, and the track slides when they don't all fit.
 */
function layoutGallery(width: number, height: number, pictures: ResolvedPicture[], active: number): GalleryLayout {
  const stacked = width < STACK_BELOW;
  const slim = stacked ? 46 : width >= 820 ? 64 : 52;
  const picture = pictures[active];
  const aspect = picture.width && picture.height ? picture.width / picture.height : 0.75;
  const visible = stacked ? height : width;
  const others = (pictures.length - 1) * (slim + GAP);

  let open = stacked
    ? clamp(width / aspect, 200, height * 0.62)
    : clamp(height * aspect, Math.min(260, width), width * 0.7);
  // With only a few cards, the open one may use the spare room, up to its photo's own shape.
  const natural = stacked ? width / aspect : height * aspect;
  if (others + open < visible) open = Math.max(open, Math.min(visible - others, natural));

  const starts = pictures.map((_, i) =>
    i <= active ? i * (slim + GAP) : active * (slim + GAP) + open + GAP + (i - active - 1) * (slim + GAP),
  );
  return { stacked, slim, open, total: open + others, visible, cross: stacked ? width : height, starts };
}

const scrolls = (layout: GalleryLayout) => layout.total > layout.visible + 1;
const maxOffset = (layout: GalleryLayout) => Math.max(0, layout.total - layout.visible);

/** Keeps the open card centred where it can; when everything fits, centres the whole row, as with a few photos. */
function followOffset(layout: GalleryLayout, active: number) {
  if (!scrolls(layout)) return -(layout.visible - layout.total) / 2;
  return clamp(layout.starts[active] + layout.open / 2 - layout.visible / 2, 0, maxOffset(layout));
}

const ARROW_PATHS = { prev: "M10 3 5 8l5 5", next: "m6 3 5 5-5 5" };

/**
 * Expanding cards on a sliding track. Every picture is a slim card and the
 * chosen one widens to show itself whole, its caption swinging from upright
 * to flat. When there are more cards than fit, only a stretch of the track
 * shows: opening a card near the edge glides the track along with it, soft
 * edges hint at the rest, and drag, swipe, scroll or the arrow keys browse.
 * On a narrow screen the cards stack as strips and the track runs downwards.
 */
export default function HobbyGallery({
  hobby,
  pictures,
  count,
}: {
  hobby: Hobby;
  pictures: ResolvedPicture[];
  count: string;
}) {
  const [active, setActive] = useState(0);
  // Where the visitor has browsed to by dragging or scrolling; null follows the open card.
  // `key` makes a repeat of the same position still settle the track.
  const [browse, setBrowse] = useState<{ offset: number; key: number } | null>(null);
  const total = pictures.length;
  const { ref: viewportRef, width, height } = useElementSize<HTMLDivElement>();
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const thumbRef = useRef<HTMLSpanElement>(null);

  const layout = useMemo(
    () => (width > 0 ? layoutGallery(width, height, pictures, active) : null),
    [width, height, pictures, active],
  );
  // For the pointer, wheel and paint handlers, which run outside render.
  const layoutRef = useRef<GalleryLayout | null>(null);
  useLayoutEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  /** The track's position: minus how far along it we've slid. */
  const trackPos = useMotionValue(0);
  const target = layout ? (browse ? clamp(browse.offset, 0, maxOffset(layout)) : followOffset(layout, active)) : 0;
  const placed = useRef(false);

  useLayoutEffect(() => {
    if (!layout) return;
    // The first placement is instant; after that the track moves on the same
    // spring as the cards, so the open card and the track travel as one.
    if (!placed.current) {
      placed.current = true;
      trackPos.set(-target);
      return;
    }
    const controls = animate(trackPos, -target, CARD_SPRING);
    return () => controls.stop();
  }, [target, browse?.key, layout, trackPos]);

  /** The soft edges and the bar's visible stretch, painted straight from the track's position. */
  const paintEdges = useCallback(
    (position: number) => {
      const current = layoutRef.current;
      const viewport = viewportRef.current;
      if (!current || !viewport) return;
      const offset = -position;
      const more = scrolls(current);
      // The fade grows in as the track leaves an end, rather than switching on.
      const start = more ? clamp(offset, 0, EDGE_FADE) : 0;
      const end = more ? clamp(maxOffset(current) - offset, 0, EDGE_FADE) : 0;
      const mask = `linear-gradient(${current.stacked ? "to bottom" : "to right"}, transparent 0, #000 ${start}px, #000 calc(100% - ${end}px), transparent 100%)`;
      viewport.style.setProperty("mask-image", mask);
      viewport.style.setProperty("-webkit-mask-image", mask);
      const thumb = thumbRef.current;
      if (thumb) {
        thumb.style.left = `${(clamp(offset, 0, current.total) / current.total) * 100}%`;
        thumb.style.width = `${(Math.min(current.visible, current.total) / current.total) * 100}%`;
      }
    },
    [viewportRef],
  );
  useMotionValueEvent(trackPos, "change", paintEdges);
  useLayoutEffect(() => paintEdges(trackPos.get()), [layout, paintEdges, trackPos]);

  // Set while a card is being focused because it was chosen, so the focus
  // handler doesn't mistake it for Tab arriving on a card out of view.
  const choosing = useRef(false);
  const select = useCallback(
    (target: number) => {
      const next = (target + total) % total;
      setActive(next);
      setBrowse(null);
      choosing.current = true;
      cardRefs.current[next]?.focus({ preventScroll: true });
      choosing.current = false;
    },
    [total],
  );

  const browseTo = useCallback((offset: number) => {
    setBrowse((previous) => ({ offset, key: (previous?.key ?? 0) + 1 }));
  }, []);

  /** Tabbing onto a card out of view slides the track to show it. */
  const revealCard = useCallback(
    (index: number) => {
      const viewport = viewportRef.current;
      // The browser scrolls a clipped box to show what gains focus; the track does that job here.
      if (viewport) {
        viewport.scrollLeft = 0;
        viewport.scrollTop = 0;
      }
      const current = layoutRef.current;
      if (choosing.current || !current || !scrolls(current)) return;
      const offset = -trackPos.get();
      const size = index === active ? current.open : current.slim;
      const start = current.starts[index];
      if (start < offset || start + size > offset + current.visible) {
        browseTo(clamp(start + size / 2 - current.visible / 2, 0, maxOffset(current)));
      }
    },
    [active, browseTo, trackPos, viewportRef],
  );

  // Arrow keys move between cards while the gallery is open (it only mounts
  // while open). Escape and Tab belong to the dialog.
  useEffect(() => {
    if (total < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
      const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!forward && !back) return;
      event.preventDefault();
      select(active + (forward ? 1 : -1));
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, select, total]);

  // Scrolling over the track browses it. A native listener, because React's
  // wheel events are passive and couldn't keep the page from scrolling too.
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const onWheel = (event: WheelEvent) => {
      const current = layoutRef.current;
      if (!current || !scrolls(current)) return;
      event.preventDefault();
      const delta = !current.stacked && Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? current.visible : 1;
      setBrowse((previous) => ({
        offset: clamp((previous?.offset ?? -trackPos.get()) + delta * unit, 0, maxOffset(current)),
        key: (previous?.key ?? 0) + 1,
      }));
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [trackPos, viewportRef]);

  // Dragging (mouse) or swiping (touch) the track browses it; a flick carries on a little.
  const drag = useRef<{ id: number; start: number; last: number; lastTime: number; speed: number; from: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const along = (event: React.PointerEvent, stacked: boolean) => (stacked ? event.clientY : event.clientX);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = layoutRef.current;
    if (!current || !scrolls(current) || (event.pointerType === "mouse" && event.button !== 0)) return;
    const position = along(event, current.stacked);
    drag.current = { id: event.pointerId, start: position, last: position, lastTime: event.timeStamp, speed: 0, from: -trackPos.get(), moved: false };
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const current = layoutRef.current;
    if (!state || !current || state.id !== event.pointerId) return;
    const position = along(event, current.stacked);
    if (!state.moved) {
      if (Math.abs(position - state.start) < DRAG_THRESHOLD) return;
      state.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    state.speed = (position - state.last) / Math.max(1, event.timeStamp - state.lastTime);
    state.last = position;
    state.lastTime = event.timeStamp;
    // A little give past either end, like pulling on something elastic.
    let next = state.from - (position - state.start);
    const max = maxOffset(current);
    if (next < 0) next /= 3;
    else if (next > max) next = max + (next - max) / 3;
    trackPos.stop();
    trackPos.set(-next);
  };
  const onPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    const current = layoutRef.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    if (!state.moved || !current) return;
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
    browseTo(clamp(-trackPos.get() - state.speed * 220, 0, maxOffset(current)));
  };

  /** Clicking the bar opens the picture at that point along it. */
  const onRailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const current = layoutRef.current;
    if (!current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const at = ((event.clientX - rect.left) / rect.width) * current.total;
    const index = current.starts.findIndex((start, i) => at < start + (i === active ? current.open : current.slim) + GAP / 2);
    select(index === -1 ? total - 1 : index);
  };

  const picture = pictures[active];
  const browsable = layout ? scrolls(layout) : false;

  return (
    // minmax(0, 1fr), not the default auto: an auto column can't shrink below
    // its content, so the cards' own widths would hold the gallery open and a
    // narrowing window would never be measured — the cards wouldn't restack.
    <motion.div
      className="grid grid-cols-[minmax(0,1fr)] gap-4"
      initial="hidden"
      animate="shown"
      variants={REVEAL_SEQUENCE}
    >
      <motion.div className="flex items-center gap-3 pr-12" variants={REVEAL}>
        <HobbyIconBadge icon={hobby.icon} />
        <MorphingDialogTitle className="font-display text-[1.375rem] font-semibold tracking-tight">
          {hobby.name}
        </MorphingDialogTitle>
        <span className="font-mono text-[0.6875rem] tracking-[0.05em] text-faint">{count}</span>
      </motion.div>

      <MorphingDialogDescription disableLayoutAnimation variants={{ initial: {}, animate: {}, exit: {} }}>
        <div
          ref={viewportRef}
          role="group"
          aria-label={`${hobby.name} pictures`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClickCapture={(event) => {
            if (!suppressClick.current) return;
            event.stopPropagation();
            event.preventDefault();
          }}
          className={`relative h-[min(70vh,540px)] min-w-0 select-none overflow-hidden rounded-[18px] ${layout?.stacked ? "touch-pan-x" : "touch-pan-y"} ${browsable ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          {layout ? (
            <motion.div
              className={`absolute left-0 top-0 flex gap-2 will-change-transform ${layout.stacked ? "w-full flex-col" : "h-full flex-row"}`}
              style={{ x: layout.stacked ? 0 : trackPos, y: layout.stacked ? trackPos : 0 }}
            >
              {pictures.map((item, i) => (
                <ExpandingCard
                  key={item.url}
                  cardRef={(node) => {
                    cardRefs.current[i] = node;
                  }}
                  picture={item}
                  index={i}
                  total={total}
                  hobbyName={hobby.name}
                  isOpen={i === active}
                  stacked={layout.stacked}
                  size={i === active ? layout.open : layout.slim}
                  crossSize={layout.cross}
                  slim={layout.slim}
                  // Cards rise in one after another; the ones further along wait no longer than the twelfth.
                  enterDelay={0.18 + Math.min(i, 12) * 0.045}
                  onSelect={() => select(i)}
                  onFocus={() => revealCard(i)}
                />
              ))}
            </motion.div>
          ) : null}
        </div>
        {/* The captions are drawn on the cards; this says which one is open. */}
        <p className="sr-only" aria-live="polite">
          {active + 1} of {total}: {picture.caption}
        </p>
      </MorphingDialogDescription>

      {total > 1 && layout ? (
        <motion.div variants={REVEAL} className="grid gap-2">
          <div className="flex items-center gap-3">
            {(["prev", "next"] as const).map((side) => {
              const button = (
                <button
                  key={side}
                  type="button"
                  onClick={() => select(active + (side === "next" ? 1 : -1))}
                  aria-label={side === "next" ? "Next picture" : "Previous picture"}
                  className="flex size-[34px] flex-none items-center justify-center rounded-full border border-line-strong bg-surface transition-[border-color,scale] hover:border-ink active:scale-95"
                >
                  <Icon d={ARROW_PATHS[side]} strokeWidth={1.6} />
                </button>
              );
              return side === "prev" ? (
                <Fragment key={side}>
                  {button}
                  <span className="min-w-[52px] text-center font-mono text-xs tabular-nums text-ink">
                    {active + 1} / {total}
                  </span>
                  {/* Where you are: the visible stretch, and a dot for the open picture. */}
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={onRailClick}
                    className="relative h-[22px] flex-1 cursor-pointer before:absolute before:inset-x-0 before:top-[9px] before:h-1 before:rounded-full before:bg-sunk"
                  >
                    <span ref={thumbRef} className="absolute top-[9px] h-1 rounded-full bg-line-strong" />
                    <motion.span
                      className="absolute top-1.5 -ml-[5px] size-2.5 rounded-full border-2 border-surface bg-[var(--accent-rose)] shadow-[0_0_0_1px_var(--accent-rose)]"
                      initial={false}
                      animate={{ left: `${((layout.starts[active] + layout.open / 2) / layout.total) * 100}%` }}
                      transition={CARD_SPRING}
                    />
                  </button>
                </Fragment>
              ) : (
                button
              );
            })}
          </div>
          {browsable ? (
            <p className="text-center text-xs text-faint">
              {layout.stacked ? "Swipe to browse · tap a strip to open it" : "Drag or scroll to browse · click a card to open it"}
            </p>
          ) : null}
        </motion.div>
      ) : null}

      <MorphingDialogClose className="right-4 top-4 flex size-9 items-center justify-center rounded-full border border-line-strong bg-surface text-muted transition-colors hover:border-ink hover:text-ink sm:right-5 sm:top-5">
        <Icon d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" strokeWidth={1.6} />
      </MorphingDialogClose>
    </motion.div>
  );
}

function ExpandingCard({
  cardRef,
  picture,
  index,
  total,
  hobbyName,
  isOpen,
  stacked,
  size,
  crossSize,
  slim,
  enterDelay,
  onSelect,
  onFocus,
}: {
  cardRef: (node: HTMLButtonElement | null) => void;
  picture: ResolvedPicture;
  index: number;
  total: number;
  hobbyName: string;
  isOpen: boolean;
  stacked: boolean;
  /** Width (side by side) or height (stacked) along the track. */
  size: number;
  /** The card's other dimension: the row's height, or the stack's width. */
  crossSize: number;
  slim: number;
  /** Seconds before this card rises in as the gallery opens. */
  enterDelay: number;
  onSelect: () => void;
  onFocus: () => void;
}) {
  // Side by side, a slim card's caption reads upwards, centred in the card;
  // opening swings it flat onto the bottom-left. Stacked strips are wide
  // enough to keep it flat throughout.
  const upright = !stacked && !isOpen;
  const captionSpace = stacked ? crossSize - 40 : isOpen ? size - 40 : crossSize - 48;
  const extent = stacked ? { height: size, width: "100%" } : { width: size, height: "100%" };

  return (
    <motion.button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      onFocus={onFocus}
      aria-label={picture.caption}
      aria-current={isOpen}
      className="group relative flex-none overflow-hidden rounded-[18px] bg-sunk text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-pass"
      // Cards rise into place as the gallery opens; after that, only their
      // size animates, on the spring the track shares.
      initial={{ opacity: 0, y: 26, ...extent }}
      animate={{ opacity: 1, y: 0, ...extent }}
      transition={{
        default: CARD_SPRING,
        opacity: { delay: enterDelay, duration: 0.45, ease: EASE_CALM },
        y: { delay: enterDelay, duration: 0.5, ease: EASE_CALM },
      }}
      style={{ cursor: isOpen ? "default" : "pointer" }}
    >
      <img
        src={picture.url}
        alt={isOpen ? picture.caption : ""}
        width={picture.width}
        height={picture.height}
        loading={index < 14 ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={`pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-700 ease-calm ${isOpen ? "scale-100" : "scale-[1.08] group-hover:scale-100"}`}
      />
      {/* Shade under the words, deeper on slim cards whose caption runs the full height. */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0"
        initial={false}
        animate={{
          opacity: 1,
          background: isOpen
            ? "linear-gradient(to top, rgba(12,10,12,0.62) 0%, rgba(12,10,12,0.12) 38%, rgba(12,10,12,0) 60%)"
            : stacked
              ? "linear-gradient(to right, rgba(12,10,12,0.55) 0%, rgba(12,10,12,0.15) 70%)"
              : "linear-gradient(to top, rgba(12,10,12,0.6) 0%, rgba(12,10,12,0.25) 60%, rgba(12,10,12,0.15) 100%)",
        }}
        transition={{ duration: 0.45 }}
      />

      {/* One line on a slim card (it may be turned upright); up to two once open. */}
      <motion.span
        aria-hidden="true"
        className={`absolute block font-display text-[0.8125rem] font-semibold uppercase leading-[1.25] tracking-[0.12em] text-white ${isOpen ? "line-clamp-2" : "truncate"}`}
        style={{ transformOrigin: "0% 100%" }}
        initial={false}
        animate={{
          rotate: upright ? -90 : 0,
          left: upright ? slim / 2 + 8 : stacked && !isOpen ? 16 : 20,
          bottom: isOpen ? 44 : stacked ? slim / 2 - 8 : 18,
          maxWidth: Math.max(captionSpace, 40),
          fontSize: isOpen ? "1rem" : "0.8125rem",
        }}
        transition={CARD_SPRING}
      >
        {picture.caption}
      </motion.span>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.span
            key="meta"
            aria-hidden="true"
            className="absolute bottom-[18px] left-5 font-mono text-[0.6875rem] tracking-[0.06em] text-white/80"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.22, duration: 0.4, ease: EASE_CALM } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {hobbyName} · {index + 1} / {total}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.button>
  );
}
