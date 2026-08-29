import { profile } from "@/data/resume";
import { BlurryGradient } from "@/components/Backgrounds";
import SpecSuite from "@/components/SpecSuite";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { Magnetic } from "@/components/motion-primitives/magnetic";

export default function Hero() {
  return (
    <section id="top" className="section relative overflow-hidden pt-32 sm:pt-36">
      <div className="absolute inset-x-0 -top-40 h-[38rem]">
        <BlurryGradient />
      </div>

      <div className="shell relative grid items-start gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <AnimatedGroup preset="blur-slide" className="space-y-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="eyebrow">
                {profile.title} · {profile.location}
              </span>
              <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-[0.6875rem] text-muted backdrop-blur">
                <BorderTrail size={28} className="opacity-70" />
                <span className="status-dot bg-pass" />
                Open to QA roles in the UK
              </span>
            </div>

            <TextEffect
              as="h1"
              per="word"
              preset="fade-in-blur"
              delay={0.15}
              speedReveal={1.6}
              className="text-display max-w-[20ch] font-display font-semibold"
            >
              I test until the release is boring.
            </TextEffect>

            <p className="measure text-lead text-muted">{profile.summary}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Magnetic intensity={0.25} range={110}>
                <a
                  href={`${import.meta.env.BASE_URL}${profile.cvPath}`}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
                >
                  Download CV
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
                    <path
                      d="M8 2v9m0 0 3.2-3.2M8 11 4.8 7.8M2.5 13.5h11"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </svg>
                </a>
              </Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-line px-5 py-2.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                Get in touch
              </a>
            </div>
          </AnimatedGroup>
        </div>

        <div className="lg:col-span-5">
          <SpecSuite />
        </div>
      </div>
    </section>
  );
}
