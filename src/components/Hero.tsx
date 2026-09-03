import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { profile } from "@/data/resume";
import { BlurryGradient } from "@/components/Backgrounds";
import HeroSceneBackdrop from "@/components/HeroSceneBackdrop";
import SpecSuite from "@/components/SpecSuite";
import AboutMeLink from "@/components/AboutMeLink";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { Magnetic } from "@/components/motion-primitives/magnetic";

export default function Hero() {
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

            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-faint">
              <span>
                {profile.title} · {profile.location}
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5 text-pass">
                <span className="status-dot bg-pass" />
                Open to new opportunities
              </span>
            </div>

            <AboutMeLink />

            <p className="measure text-lead text-muted">{profile.summary}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnetic intensity={0.25} range={110}>
                <a
                  href="/#contact"
                  className="glow-cta inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
                >
                  Get in touch
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                    <path
                      d="M3 8h9m0 0-3.2-3.2M12 8l-3.2 3.2"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </Magnetic>
            </div>
          </AnimatedGroup>
        </div>

        <motion.div
          className="lg:col-span-5 mt-6 sm:mt-12"
          initial={{ opacity: 0, y: 46, scale: 0.95, filter: "blur(14px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ type: "spring", bounce: 0.22, duration: 1.1, delay: 0.42 }}
        >
          <SpecSuite />
        </motion.div>
      </div>
    </section>
  );
}
