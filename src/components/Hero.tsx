import { motion } from "motion/react";
import { profile } from "@/data/resume";
import { BlurryGradient } from "@/components/Backgrounds";
import HeroScene from "@/components/HeroScene";
import SpecSuite from "@/components/SpecSuite";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { Magnetic } from "@/components/motion-primitives/magnetic";

export default function Hero({ isDark }: { isDark: boolean }) {
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

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <HeroScene isDark={isDark} />
      </motion.div>

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

            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                {profile.title} · {profile.location}
              </span>
              <span className="pill-sheen relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-[0.6875rem] text-muted backdrop-blur">
                <span className="status-dot bg-pass" />
                Open to new opportunities
              </span>
            </div>

            <TextEffect
              as="p"
              per="word"
              preset="fade-in-blur"
              delay={0.32}
              speedReveal={1.9}
              className="text-title max-w-[22ch] font-display font-medium text-muted"
            >
              The quiet work behind a smooth release.
            </TextEffect>

            <p className="measure text-lead text-muted">{profile.summary}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnetic intensity={0.25} range={110}>
                <a
                  href="#contact"
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
