import { useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";
import MobileNav from "@/components/MobileNav";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { sectionHref } from "@/lib/links";

export const navLinks = [
  { href: sectionHref("experience"), label: "Experience" },
  { href: sectionHref("projects"), label: "Projects" },
  { href: sectionHref("certifications"), label: "Certifications" },
  { href: sectionHref("skills"), label: "Skills" },
  { href: sectionHref("contact"), label: "Contact" },
];

export default function NavBar({
  showSectionLinks = true,
}: {
  /** Off "/" the hash scroll fires before the target section mounts, so
   *  non-home pages pass false rather than expose links that can't work. */
  showSectionLinks?: boolean;
}) {
  const { isDark, toggle } = useTheme();
  const { scrollY } = useScroll();
  const [isLifted, setIsLifted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <a href={sectionHref("top")} className="group flex items-baseline gap-2.5">
            <span className="font-mono text-[0.8125rem] tracking-tight text-pass">PM</span>
            <span className="text-sm font-medium tracking-tight">Priya Murkute</span>
          </a>

          <div className="flex items-center gap-1">
            {showSectionLinks ? (
              <ul className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
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
            ) : null}
            <ThemeButton isDark={isDark} onToggle={toggle} />
            {showSectionLinks ? (
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
                className="ml-1 flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink md:hidden"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                  <path
                    d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11"
                    stroke="currentColor"
                    strokeWidth={1.4}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            ) : null}
          </div>
        </nav>
      </div>
      <ScrollProgress className="absolute inset-x-0 top-full" />

      {showSectionLinks ? (
        <MobileNav isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      ) : null}
    </header>
  );
}

/** A status readout rather than a sun/moon icon. */
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
