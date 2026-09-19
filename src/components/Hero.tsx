import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { profile } from "@/data/resume";
import { BlurryGradient } from "@/components/Backgrounds";
import HeroSceneBackdrop from "@/components/HeroSceneBackdrop";
import HowIThink from "@/components/HowIThink";
import AboutMeLink from "@/components/AboutMeLink";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { sectionHref } from "@/lib/links";
import { useNamePetals } from "@/lib/useNamePetals";

/** Second sentence of the headline gets the accent colour. */
const [headlineStart, headlineEnd] = profile.headline.split(/(?<=\.)\s+/, 2);

export default function Hero() {
  // The name sheds petals into the falling-petals scene behind it.
  const {
    ref: nameRef,
    onPointerEnter: onNameEnter,
    onPointerMove: onNameMove,
  } = useNamePetals<HTMLAnchorElement>();

  return (
    <section id="top" className="section relative overflow-hidden pt-32 sm:pt-36">
      <motion.div
        className="absolute inset-x-0 -top-40 h-[38rem]"
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <BlurryGradient />
      </motion.div>

      <HeroSceneBackdrop />

      <div className="shell relative z-10 grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <AnimatedGroup
            preset="blur-slide"
            className="space-y-7"
            transition={{
              staggerChildren: 0.12,
              delayChildren: 0.1,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Link
              ref={nameRef}
              onPointerEnter={onNameEnter}
              onPointerMove={onNameMove}
              to="/about-me"
              aria-label={`${profile.name} — read more about me`}
              className="inline-block transition-opacity hover:opacity-80"
            >
              <TextEffect
                as="h1"
                per="word"
                preset="fade-in-blur"
                delay={0.15}
                speedReveal={1.7}
                className="text-name font-display font-semibold"
              >
                {profile.name}
              </TextEffect>
            </Link>

            <p className="quote-text text-[clamp(1.3rem,2.2vw,1.6rem)]">
              “{headlineStart}{" "}
              {headlineEnd ? <em>{headlineEnd}</em> : null}”
            </p>

            <p className="measure text x1 text-muted">{profile.tagline}</p>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              <span className="text-ink">{profile.keywords.join("  ·  ")}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.location}</span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-pass">
                <span className="status-dot bg-pass" />
                Open to new opportunities
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={sectionHref("experience")}
                className="glow-cta inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
              >
                View My Work
                <span aria-hidden="true">↓</span>
              </a>
              <AboutMeLink />
            </div>
          </AnimatedGroup>
        </div>

        <motion.div
          className="mt-6 w-full max-w-sm sm:mt-12 lg:col-span-5 lg:ml-auto lg:mt-0"
          initial={{ opacity: 0, y: 46, scale: 0.95, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0.22, duration: 1.1, delay: 0.42 }}
        >
          <HowIThink />
        </motion.div>
      </div>
    </section>
  );
}
