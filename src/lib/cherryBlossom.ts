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
