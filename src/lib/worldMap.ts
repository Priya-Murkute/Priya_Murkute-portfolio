import { DOT_GRID, DOT_ROWS } from "@/data/worldDots";

/*
 * The dotted world map's geometry. The map is drawn in "map units": one unit
 * is one degree, x runs west to east from 0 and y runs north to south from 0,
 * so a place is simply (lon − west, north − lat).
 */

export const WORLD_W = DOT_GRID.east - DOT_GRID.west;
export const WORLD_H = DOT_GRID.north - DOT_GRID.south;

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 14;

export interface Point {
  x: number;
  y: number;
}

/**
 * Where the stage is looking: the centre of the view in map units, and the
 * zoom. At zoom 1 the whole world fits the stage; each step in is that much
 * closer.
 */
export interface Camera extends Point {
  k: number;
}

export const clamp = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high);

export function project(lat: number, lon: number): Point {
  return { x: lon - DOT_GRID.west, y: DOT_GRID.north - lat };
}

/** The view's size in map units, for a stage of this width ÷ height. */
export function viewSize(camera: Camera, aspect: number) {
  const w = Math.max(WORLD_W, WORLD_H * aspect) / camera.k;
  return { w, h: w / aspect };
}

/** Keeps the zoom in range and the view over the world; a view bigger than the world sits centred on it. */
export function clampCamera(camera: Camera, aspect: number): Camera {
  const k = clamp(camera.k, MIN_ZOOM, MAX_ZOOM);
  const { w, h } = viewSize({ ...camera, k }, aspect);
  return {
    k,
    x: w >= WORLD_W ? WORLD_W / 2 : clamp(camera.x, w / 2, WORLD_W - w / 2),
    y: h >= WORLD_H ? WORLD_H / 2 : clamp(camera.y, h / 2, WORLD_H - h / 2),
  };
}

/**
 * Zooms by `factor`, keeping whatever is under (`ax`, `ay`) still. The anchor
 * is a fraction of the stage: (0.5, 0.5) is its centre.
 */
export function zoomAbout(camera: Camera, aspect: number, factor: number, ax: number, ay: number): Camera {
  const k = clamp(camera.k * factor, MIN_ZOOM, MAX_ZOOM);
  const before = viewSize(camera, aspect);
  const after = viewSize({ ...camera, k }, aspect);
  return {
    k,
    x: camera.x + (ax - 0.5) * (before.w - after.w),
    y: camera.y + (ay - 0.5) * (before.h - after.h),
  };
}

/** Moves the view by a fraction of its own size. */
export function panBy(camera: Camera, aspect: number, dx: number, dy: number): Camera {
  const { w, h } = viewSize(camera, aspect);
  return { ...camera, x: camera.x + dx * w, y: camera.y + dy * h };
}

/** The view that just holds all of these points, with `padding` (a fraction of their spread) to spare. */
export function fitPoints(points: Point[], aspect: number, padding: number): Camera {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const [left, right] = [Math.min(...xs), Math.max(...xs)];
  const [top, bottom] = [Math.min(...ys), Math.max(...ys)];
  const w = Math.max((right - left) * (1 + padding), (bottom - top) * (1 + padding) * aspect, 8);
  return clampCamera({ x: (left + right) / 2, y: (top + bottom) / 2, k: Math.max(WORLD_W, WORLD_H * aspect) / w }, aspect);
}

/** `t` (0–1) of the way from one view to another. Zoom moves geometrically, so it feels even. */
export function lerpCamera(from: Camera, to: Camera, t: number): Camera {
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
    k: from.k * (to.k / from.k) ** t,
  };
}

/**
 * Every land dot as one path: a zero-length segment per dot, which a round
 * line cap turns into a circle. One element instead of thousands, and the dot
 * size is just the stroke width.
 */
export const DOTS_PATH = (() => {
  const parts: string[] = [];
  DOT_ROWS.forEach((hex, row) => {
    for (let col = 0; col < DOT_GRID.cols; col += 1) {
      if (parseInt(hex[col >> 2], 16) & (8 >> (col & 3))) {
        parts.push(`M${(col + 0.5) * DOT_GRID.step} ${(row + 0.5) * DOT_GRID.step}h0`);
      }
    }
  });
  return parts.join("");
})();

/** Width of a dot, in map units, against the grid's spacing. */
export const DOT_SIZE = DOT_GRID.step * 0.6;
