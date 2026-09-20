import { TextEffect } from "@/components/motion-primitives/text-effect";

/** A deliberate break in the page's section rhythm: one full-bleed statement. */
export default function PullQuote() {
  return (
    <section aria-label="Philosophy" className="section bg-sunk/60">
      <div className="shell">
        <TextEffect
          as="p"
          per="word"
          preset="fade-in-blur"
          speedReveal={1.6}
          accent="proof, not promises"
          accentClassName="quote-accent"
          markClassName="quote-mark"
          className="quote-text mx-auto max-w-[22ch] text-center"
        >
          “Every line of code earns the same thing a release does — proof, not promises.”
        </TextEffect>
      </div>
    </section>
  );
}
