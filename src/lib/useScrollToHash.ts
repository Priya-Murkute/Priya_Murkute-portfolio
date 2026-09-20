import { useEffect } from "react";

/**
 * Scrolls to the section named in the URL's #hash, once it exists.
 *
 * Arriving on the home page from elsewhere (About Me's "Get in touch" goes to `/#contact`), the
 * browser's own hash scroll fires at load, before React has drawn the section it points at, so
 * nothing happens. This waits for the section to mount, jumps to it, and once more a moment
 * later to catch layout that settled in the meantime, unless the visitor has already taken over.
 */
export function useScrollToHash() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || id === "top") return;

    let frame = 0;
    let timer = 0;
    let visitorTookOver = false;
    const takeOver = () => {
      visitorTookOver = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((name) => window.addEventListener(name, takeOver, { passive: true, once: true }));

    // The section's own scroll-margin keeps it clear of the fixed nav.
    const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });

    let tries = 0;
    const seek = () => {
      if (visitorTookOver) return;
      if (document.getElementById(id)) {
        jump();
        timer = window.setTimeout(() => {
          if (!visitorTookOver) jump();
        }, 700);
      } else if (tries < 90) {
        tries += 1;
        frame = requestAnimationFrame(seek);
      }
    };
    frame = requestAnimationFrame(seek);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      events.forEach((name) => window.removeEventListener(name, takeOver));
    };
  }, []);
}
