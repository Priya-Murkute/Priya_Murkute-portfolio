import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

/** Also read by the pre-paint script in index.html — change both together. */
const THEME_STORAGE_KEY = "pm-theme";

/** Matches the 240ms in `.theme-transition` (styles.css), plus a little slack. */
const TRANSITION_MS = 260;

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

/**
 * Wraps the app once; every component reads/toggles the theme via
 * `useTheme()` instead of receiving `isDark` as a prop. Persisted across
 * page loads — including the hard reload that a plain `/#section` anchor
 * triggers when navigating from another route back to "/" — so switching
 * pages never silently reverts the theme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  /**
   * The colour crossfade lives on `.theme-transition` (styles.css) and is
   * switched on only for the duration of a swap. Adding it here — before the
   * state flip — means the transition is in place by the time the `.dark`
   * class lands, without every node in the document carrying a transition
   * for the whole session.
   */
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
      ?.setAttribute("content", theme === "dark" ? "#0e1113" : "#fafaf7");
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private browsing, etc.) — theme just won't persist
    }
  }, [theme]);

  const value = useMemo(() => ({ isDark: theme === "dark", toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
