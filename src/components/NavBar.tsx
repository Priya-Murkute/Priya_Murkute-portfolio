import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";
import { cn } from "@/lib/utils";

const links = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function NavBar({
  isDark,
  onToggleTheme,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
}) {
  const { scrollY } = useScroll();
  const [isLifted, setIsLifted] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setIsLifted(value > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={cn(
          "border-b transition-colors duration-300",
          isLifted ? "border-line bg-paper/80 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <nav className="shell flex h-16 items-center justify-between gap-6">
          <a href="#top" className="group flex items-baseline gap-2.5">
            <span className="font-mono text-[0.8125rem] tracking-tight text-pass">PM</span>
            <span className="text-sm font-medium tracking-tight">Priya Murkute</span>
          </a>

          <div className="flex items-center gap-1">
            <ul className="hidden items-center gap-1 sm:flex">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-sunk hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <ThemeButton isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </nav>
      </div>
      <ScrollProgress className="absolute inset-x-0 top-full" />
    </header>
  );
}

/**
 * Reads as a status readout rather than a sun/moon icon — the label says which
 * theme is on, and the button says what pressing it does.
 */
function ThemeButton({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="ml-1 flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-line-strong hover:text-ink"
    >
      <span
        className={cn(
          "status-dot border border-line-strong",
          isDark ? "bg-ink" : "bg-transparent",
        )}
      />
      {isDark ? "dark" : "light"}
    </button>
  );
}
