/**
 * The site's one easing curve: fast out of the blocks, long settle. Its CSS
 * twin is `--ease-calm` in styles.css (the `ease-calm` utility) — change both.
 */
export const EASE_CALM = [0.22, 1, 0.36, 1] as const;

interface RevealOptions {
  /** Seconds to wait before starting: how a list staggers. */
  delay?: number;
  /**
   * Fade in from a blur too (the default). Leave it off for big or heavy
   * elements (the world map): blurring an SVG-filled card every frame is slow.
   */
  blur?: boolean;
}

/**
 * Props for a motion element that rises and un-blurs the first time it scrolls
 * into view. Spread them: `<motion.li {...revealItem({ delay: index * 0.08 })}>`.
 */
function reveal(distance: number, blurPx: number, duration: number, margin: string) {
  return ({ delay = 0, blur = true }: RevealOptions = {}) => ({
    initial: { opacity: 0, y: distance, ...(blur && { filter: `blur(${blurPx}px)` }) },
    whileInView: { opacity: 1, y: 0, ...(blur && { filter: "blur(0px)" }) },
    viewport: { once: true, margin: `${margin} 0px` },
    transition: { duration, delay, ease: EASE_CALM },
  });
}

/** For rows and cards. */
export const revealItem = reveal(22, 6, 0.6, "-10%");

/** For large blocks: a whole role, a headline and its copy. */
export const revealBlock = reveal(30, 8, 0.7, "-12%");
