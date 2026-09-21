import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ThemeContext } from "@/context/useTheme";
import { readStorage, writeStorage } from "@/lib/storage";

type Theme = "light" | "dark";

/** Also read by the pre-paint script in index.html — change both together. */
const THEME_STORAGE_KEY = "pm-theme";

/** Matches the 240ms in `.theme-transition` (styles.css). */
const TRANSITION_MS = 260;

function getStoredTheme(): Theme {
  return readStorage("local", THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyToDocument(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0e1113" : "#fffcfd");
}

/** Holds the theme, and applies it to the page. Read it with `useTheme` (useTheme.ts). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  // What the next toggle flips from, kept current even while a transition is still in flight.
  const current = useRef(theme);

  const toggle = useCallback(() => {
    const next: Theme = current.current === "dark" ? "light" : "dark";
    current.current = next;
    // Saved now, not after the transition, so a navigation right after the click still sees it.
    writeStorage("local", THEME_STORAGE_KEY, next);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && "startViewTransition" in document) {
      // The browser snapshots the page, flips the theme underneath, and fades between
      // the two on the GPU. That covers everything that can't transition on its own
      // (gradients, SVG, the 3D hero) in one smooth fade, instead of restyling every
      // element on every frame. flushSync so React's half of the flip is in the new snapshot.
      document.startViewTransition(() => {
        applyToDocument(next);
        flushSync(() => setTheme(next));
      });
      return;
    }

    // No View Transitions (older browsers): add .theme-transition before the flip so
    // the crossfade is in place when .dark lands, without every node carrying a
    // transition all session.
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);
    setTheme(next);
  }, []);

  useEffect(() => {
    applyToDocument(theme);
    writeStorage("local", THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ isDark: theme === "dark", toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
