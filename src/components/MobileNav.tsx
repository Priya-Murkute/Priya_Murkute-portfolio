import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { navLinks } from "@/components/NavBar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

/** Stands in for the header links, which are hidden below `sm`. */
export default function MobileNav({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="md:hidden">
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-3 top-3 z-50 overflow-hidden rounded-2xl border border-line bg-surface/90 shadow-xl backdrop-blur-xl"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-7 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="size-3" fill="none" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3 3 13"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <ul className="flex flex-col p-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={onClose}
                    className="block rounded-xl px-3 py-3 text-sm text-muted transition-colors hover:bg-sunk hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="space-y-1 border-t border-line p-2">
              <button
                type="button"
                onClick={toggle}
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-muted transition-colors hover:bg-sunk hover:text-ink"
              >
                <span>Theme</span>
                <span className="flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                  <span
                    className={cn(
                      "status-dot border border-line-strong",
                      isDark ? "bg-ink" : "bg-transparent",
                    )}
                  />
                  {isDark ? "dark" : "light"}
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
