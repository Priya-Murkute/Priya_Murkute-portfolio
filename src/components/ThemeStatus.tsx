import { cn } from "@/lib/utils";

/**
 * The theme shown as a status readout — a dot, filled in dark mode, and the
 * word — rather than a sun/moon icon. Used inside the header button and the
 * phone menu's row, which supply the layout around it.
 */
export default function ThemeStatus({ isDark }: { isDark: boolean }) {
  return (
    <>
      <span className={cn("status-dot border border-line-strong", isDark ? "bg-ink" : "bg-transparent")} />
      {isDark ? "dark" : "light"}
    </>
  );
}
