import { Link } from "react-router-dom";

/**
 * The Hero's entry point into /about-me. The arrow loops continuously
 * (gif-style) via the arrow-nudge CSS animation in styles.css rather than a
 * motion value, matching how the other always-on loops on the page work.
 */
export default function AboutMeLink() {
  return (
    <Link
      to="/about-me"
      className="pill-sheen group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-line bg-surface/70 py-1.5 pl-4 pr-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted backdrop-blur transition-colors hover:border-line-strong hover:text-ink"
    >
      Click here to know about me
      <span className="flex size-6 items-center justify-center rounded-full bg-ink text-paper">
        <svg
          viewBox="0 0 16 16"
          className="arrow-nudge size-3.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 8h9m0 0-3.2-3.2M12 8l-3.2 3.2"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
