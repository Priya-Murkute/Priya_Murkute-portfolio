import type { Point } from "@/lib/worldMap";
import { clamp } from "@/lib/utils";

/*
 * Pins and labels are sized in screen pixels, not map units, so they stay the
 * same size however far in the map is zoomed. A pin's tip is its origin.
 */
const PIN_W = 12;
export const PIN_H = 17;
const LABEL_H = 14;
const LABEL_CHAR_W = 6.3;
/** Pins closer than this to a named pin are left unnamed: they are part of the same cluster. */
const CLUSTER = 14;

interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface Label {
  /** Where the name's text starts (its left edge, on its baseline), relative to the pin's tip. */
  x: number;
  y: number;
  /** For a name set apart from its pin: where a thin line from the pin should end, likewise relative. */
  leader: Point | null;
}

const overlaps = (a: Box, b: Box) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/**
 * How far from its pin (px) to try a name: right up against it first, then
 * further out. Anything past the first is joined to its pin by a thin line.
 */
const LABEL_GAPS = [0, 18, 36];

/** Every place a name of this width could go around a pin, nearest and most natural first. */
function labelSpots(sx: number, sy: number, width: number) {
  const spots: { left: number; top: number; gap: number }[] = [];
  for (const gap of LABEL_GAPS) {
    const side = PIN_W / 2 + 3 + gap;
    // Above: a few pixels clear of the pin, as its neighbours may stand a little higher.
    const rise = PIN_H + 5 + gap;
    const slant = 6 + gap * 0.7;
    spots.push(
      { gap, left: sx + side, top: sy - PIN_H + 1 }, // right
      { gap, left: sx - width / 2, top: sy - rise - LABEL_H }, // above
      { gap, left: sx - side - width, top: sy - PIN_H + 1 }, // left
      { gap, left: sx - width / 2, top: sy + 7 + gap }, // below
    );
    if (gap > 0) {
      spots.push(
        { gap, left: sx + slant, top: sy - PIN_H - LABEL_H - slant + 6 },
        { gap, left: sx - slant - width, top: sy - PIN_H - LABEL_H - slant + 6 },
        { gap, left: sx + slant, top: sy + 4 + slant },
        { gap, left: sx - slant - width, top: sy + 4 + slant },
      );
    }
  }
  return spots;
}

/**
 * Where each visible place's name is written: beside its pin if there's room,
 * else above, below or across from it, else further out on a thin line.
 * Places are offered in priority order, so when pins crowd, the ones that
 * matter most get the room. A name is left off if its pin is off the stage,
 * if the pin is crowded in with one already named (the pins around London
 * show just "London" until you zoom in and they part), or if there's no clear
 * spot for it anywhere.
 */
export function placeLabels(items: { id: string; name: string; sx: number; sy: number }[], stage: { width: number; height: number }) {
  const pins = items.map(({ sx, sy }) => ({ left: sx - PIN_W / 2, right: sx + PIN_W / 2, top: sy - PIN_H, bottom: sy }));
  const placed = new Map<string, Label>();
  const named: typeof items = [];
  const taken: Box[] = [];

  items.forEach((item, i) => {
    const { sx, sy } = item;
    if (sx < 0 || sy < 0 || sx > stage.width || sy > stage.height) return;
    if (named.some((other) => Math.hypot(other.sx - sx, other.sy - sy) < CLUSTER)) return;

    const width = item.name.length * LABEL_CHAR_W + 4;
    const obstacles = [...pins.filter((_, j) => j !== i), ...taken];
    for (const { left, top, gap } of labelSpots(sx, sy, width)) {
      const box = { left, top, right: left + width, bottom: top + LABEL_H };
      const inside = box.left >= 0 && box.right <= stage.width && box.top >= 0 && box.bottom <= stage.height;
      if (!inside || obstacles.some((other) => overlaps(box, other))) continue;

      placed.set(item.id, {
        x: left - sx,
        y: top - sy + LABEL_H - 3,
        leader: gap > 0 ? { x: clamp(0, left - sx, box.right - sx), y: clamp(-PIN_H / 2, top - sy, box.bottom - sy) } : null,
      });
      named.push(item);
      taken.push(box);
      return;
    }
  });
  return placed;
}
