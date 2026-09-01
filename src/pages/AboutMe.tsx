import { Fragment } from "react";
import { motion } from "motion/react";
import TravelScroll from "@/components/off-hours/TravelScroll";
import Carousel3D from "@/components/off-hours/Carousel3D";
import { cn } from "@/lib/utils";

const NOW_ITEMS = [
  { label: "Reading", value: "The Ministry for the Future" },
  { label: "Listening", value: "Mitski · Be the Cowboy" },
  { label: "Watching", value: "The Bear, Season 3" },
  { label: "Sketching", value: "Botanical illustrations" },
  { label: "Dreaming of", value: "Japan — next autumn" },
  { label: "Eating", value: "Everything in Lisbon" },
];

const HOBBIES = [
  {
    icon: "✏️",
    name: "Sketching",
    desc: "Botanical drawings, portraits, whatever's in front of me. Pencil first, always.",
  },
  {
    icon: "📷",
    name: "Photography",
    desc: "Chasing golden hour and rainy streets. Manual mode only.",
  },
  {
    icon: "🌍",
    name: "Travel",
    desc: "New city, unfamiliar bowl of something — that's the formula.",
  },
  {
    icon: "📖",
    name: "Reading",
    desc: "Literary fiction and the occasional rabbit hole I didn't expect to love.",
  },
  {
    icon: "🍳",
    name: "Cooking",
    desc: "Slow weekend mornings, a new recipe, something that fills the flat with smell.",
  },
  {
    icon: "🎵",
    name: "Music",
    desc: "Perpetually building a playlist for a road trip I haven't planned yet.",
  },
];

export default function AboutMe() {
  return (
    <main>
      <AboutMeHero />

      <section className="section">
        <div className="shell">
          <SectionHead title="Places I've been" chip="Travels" />
          <TravelScroll />
        </div>
      </section>

      <CurrentlyTicker />

      <section className="section border-t border-line">
        <div className="shell">
          <SectionHead title="Sketches & Art" chip="Studio" amber />
          <Carousel3D />
        </div>
      </section>

      <section className="section border-t border-line">
        <div className="shell">
          <SectionHead title="Things I love" chip="Hobbies" />
          <HobbiesGrid />
        </div>
      </section>

      <Closing />
    </main>
  );
}

function AboutMeHero() {
  return (
    <header className="shell relative flex min-h-[100svh] flex-col justify-end pt-32 pb-20">
      <motion.p
        className="mb-5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-pass"
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
    </header>
  );
}

function SectionHead({ title, chip, amber }: { title: string; chip: string; amber?: boolean }) {
  return (
    <div className="mb-10 flex items-baseline gap-5">
      <h2 className="text-title font-display font-normal">{title}</h2>
      <span
        className={cn(
          "inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.6rem] tracking-[0.1em] whitespace-nowrap uppercase",
          amber ? "border-flaky-tint bg-flaky-tint text-flaky" : "border-pass-tint bg-pass-tint text-pass",
        )}
      >
        {chip}
      </span>
    </div>
  );
}

function CurrentlyTicker() {
  const loop = [...NOW_ITEMS, ...NOW_ITEMS];

  return (
    <div className="group mt-20 overflow-hidden border-y border-line bg-sunk">
      <div className="flex w-max animate-[ticker_30s_linear_infinite] py-3.5 group-hover:[animation-play-state:paused]">
        {loop.map((item, index) => (
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

function HobbiesGrid() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-px overflow-hidden rounded border border-line bg-line">
      {HOBBIES.map((hobby) => (
        <div key={hobby.name} className="group relative bg-surface p-8">
          <div className="pointer-events-none absolute inset-0 bg-sunk opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="relative mb-3.5 block w-fit text-[1.9rem] leading-none transition-transform duration-300 group-hover:-rotate-[4deg] group-hover:scale-110">
            {hobby.icon}
          </span>
          <p className="relative mb-1.5 font-display text-[1.05rem] font-medium tracking-[-0.02em] text-ink">
            {hobby.name}
          </p>
          <p className="relative text-[0.8rem] leading-relaxed text-muted">{hobby.desc}</p>
        </div>
      ))}
    </div>
  );
}

function Closing() {
  return (
    <div className="section bg-sunk/60">
      <div className="shell flex flex-col items-center gap-6 text-center">
        <blockquote className="max-w-[22ch] font-display text-[clamp(1.5rem,3.5vw,2.6rem)] leading-[1.25] font-light tracking-[-0.025em] text-ink">
          "I'm most <em className="text-pass">myself</em> between a sketch and a new city."
        </blockquote>
        <small className="text-[0.85rem] text-muted">— Priya, probably on a train</small>
        <a
          href="/#top"
          className="mt-3 inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-[0.09em] text-muted uppercase transition-colors hover:text-ink"
        >
          ← back to work
        </a>
      </div>
    </div>
  );
}
