import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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

/** Holds the theme, and applies it to the page. Read it with `useTheme` (useTheme.ts). */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  // Adds .theme-transition before the flip so the crossfade is in place when
  // .dark lands, without every node carrying a transition all session.
  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), TRANSITION_MS);
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0e1113" : "#fffcfd");
    writeStorage("local", THEME_STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(() => ({ isDark: theme === "dark", toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
