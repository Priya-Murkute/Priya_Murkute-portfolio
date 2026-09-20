import { createContext, useContext } from "react";

interface ThemeContextValue {
  isDark: boolean;
  toggle: () => void;
}

/** Provided by ThemeProvider (ThemeContext.tsx); the defaults are for anything rendered outside it. */
export const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);
