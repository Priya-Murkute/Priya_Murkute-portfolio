import { Fragment } from "react";
import { motion } from "motion/react";
import HeroSceneBackdrop from "@/components/HeroSceneBackdrop";
import PetalScatter from "@/components/PetalScatter";
import HobbiesInterests from "@/components/off-hours/HobbiesInterests";
import PlacesWandered from "@/components/off-hours/PlacesWandered";
import VisionBoard from "@/components/off-hours/VisionBoard";
import { nowItems } from "@/data/offHours";
import { sectionHref } from "@/lib/links";

const NOW_ITEMS_LOOP = [...nowItems, ...nowItems];

/**
 * Being rebuilt section by section from the approved mockup. Done so far:
 * Hobbies / Interests, which absorbed the old photo columns, sketch
 * carousel and "Things I love" grid, Places I've wandered (the map and
 * bucket list), and the Vision board.
 */
export default function AboutMe() {
  return (
    <main id="main-content">
      <AboutMeHero />

      <CurrentlyTicker />

      <HobbiesInterests />

      <PlacesWandered />

      <VisionBoard />

      <Closing />
    </main>
  );
}

function AboutMeHero() {
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-20">
      <HeroSceneBackdrop />

      <div className="shell relative z-10 pt-32">
        <motion.p
          className="eyebrow mb-5 text-pass"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Priya Murkute · off hours
        </motion.p>

        <motion.h1
          className="font-display text-[clamp(3rem,9vw,7.5rem)] leading-[1.04] font-light tracking-[-0.03em] text-ink"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          Explorer.
          <br />
          <em className="text-flaky">Artist.</em>
          <br />
          Constant
          <br />
          wanderer.
        </motion.h1>

        <motion.p
          className="measure mt-7 max-w-[42ch] text-lead font-light text-muted"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          There's a version of me that doesn't write test suites. This is her page.
        </motion.p>

        <motion.div
          className="mt-10 flex items-center gap-3 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-faint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
        >
          <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
          scroll to explore
        </motion.div>
      </div>
    </header>
  );
}

function CurrentlyTicker() {
  return (
    <div className="group mt-20 overflow-hidden border-y border-line bg-sunk">
      <div className="flex w-max animate-[ticker_30s_linear_infinite] py-3.5 group-hover:[animation-play-state:paused]">
        {NOW_ITEMS_LOOP.map((item, index) => (
          <Fragment key={index}>
            <span className="flex shrink-0 items-center gap-2 px-10 text-[0.78rem] whitespace-nowrap text-muted">
              <strong className="font-mono text-[0.58rem] font-medium tracking-[0.1em] text-flaky uppercase">
                {item.label}
              </strong>
              {item.value}
            </span>
            <span className="size-[3px] shrink-0 self-center rounded-full bg-line-strong" aria-hidden="true" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Closing() {
  return (
    <div className="section relative overflow-hidden bg-sunk/60">
      <PetalScatter />

      <div className="shell relative flex flex-col items-center gap-6 text-center">
        <blockquote className="quote-text max-w-[22ch]">
          “I’m most <em>myself</em> between a sketch and a new city.”
        </blockquote>
        <small className="text-[0.85rem] text-muted">— Priya, probably on a train</small>
        <a
          href={sectionHref("top")}
          className="mt-3 inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.09em] text-muted uppercase transition-colors hover:text-ink"
        >
          ← back to work
        </a>
      </div>
    </div>
  );
}
