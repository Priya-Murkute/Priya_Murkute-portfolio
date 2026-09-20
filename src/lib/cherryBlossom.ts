/** One sakura gradient, shared by the 3D petals and the flat SVG ones. */
const LIGHT_GRADIENT: [string, string] = ["#fff2f6", "#f5a0c4"];
const DARK_GRADIENT: [string, string] = ["#ff9fd0", "#dc2686"];

function hexToRgb(hex: string): [number, number, number] {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (channel: number) => Math.round(channel).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Mixes a point along the gradient — t in [0, 1]. */
export function cherryBlossomColor(t: number, isDark: boolean): string {
  const [fromHex, toHex] = isDark ? DARK_GRADIENT : LIGHT_GRADIENT;
  const [r1, g1, b1] = hexToRgb(fromHex);
  const [r2, g2, b2] = hexToRgb(toHex);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}

/** Deterministic PRNG, so petal layouts are stable across renders. */
export function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * The hero scene's petal, traced point for point from createPetalGeometry in
 * HeroSceneCanvas (its Shape, scaled ×24 and flipped to SVG's downward y), so
 * a fallen petal is the same obovate, notched shape as a falling one.
 */
export const PETAL_PATH =
  "M12 23C13.2 17.72 22.56 15.32 23.04 8.12C23.28 4.28 19.68 2.12 15.84 3.08Q13.92 1.4 12 3.8Q10.08 1.4 8.16 3.08C4.32 2.12 0.72 4.28 0.96 8.12C1.44 15.32 10.8 17.72 12 23Z";
