import { TextEffect } from "@/components/motion-primitives/text-effect";

/**
 * The one deliberate break in the page's section-section-section rhythm: no
 * eyebrow, no card, no two-column split — a single full-bleed editorial
 * statement in a tinted band, bridging the GitHub repos above (code) and the
 * career history below (track record) rather than restating either.
 */
export default function PullQuote() {
  return (
    <section aria-label="Philosophy" className="section bg-sunk/60">
      <div className="shell">
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.6}
          className="text-quote mx-auto max-w-[22ch] text-center font-display font-semibold text-ink"
        >
          Every line of code earns the same thing a release does — proof, not promises.
        </TextEffect>
      </div>
    </section>
  );
}
