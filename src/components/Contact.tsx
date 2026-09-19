import { motion } from "motion/react";
import { githubHandle, linkedinHandle, profile } from "@/data/resume";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { Icon } from "@/components/Icon";
import PetalScatter from "@/components/PetalScatter";
import { revealBlock } from "@/lib/motion";
import { publicHref } from "@/lib/links";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "GitHub", value: githubHandle, href: profile.github },
  { label: "LinkedIn", value: linkedinHandle, href: profile.linkedin },
];

/** Two columns, echoing the Hero's shape rather than another stacked section. */
export default function Contact() {
  return (
    <section id="contact" className="section relative overflow-hidden">
      <PetalScatter />

      <div className="shell relative grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <motion.div className="lg:col-span-7" {...revealBlock()}>
          <p className="eyebrow eyebrow-section" style={{ color: "var(--flaky)" }}>
            Contact
          </p>

          <TextEffect
            as="h2"
            per="word"
            preset="fade-in-blur"
            speedReveal={1.8}
            accent="excellent test cases"
            accentClassName="quote-accent"
            markClassName="quote-mark"
            className="quote-text mt-4"
          >
            “Curiosity? Check. Caffeine? Always. Trust issues? Absolutely — they make excellent test cases.”
          </TextEffect>

          <a href={publicHref(profile.cvPath)} download className="btn-primary glow-cta mt-10">
            Download CV
            <Icon d="M8 2v9m0 0 3.2-3.2M8 11 4.8 7.8M2.5 13.5h11" />
          </a>
        </motion.div>

        <motion.div className="card lg:col-span-5" {...revealBlock({ delay: 0.15 })}>
          {channels.map((channel, index) => (
            <a
              key={channel.label}
              href={channel.href}
              className={`block px-6 py-5 transition-colors hover:bg-sunk ${index > 0 ? "border-t border-line" : ""}`}
            >
              <p className="mono-label text-faint">{channel.label}</p>
              <p className="mt-1.5 text-[0.9375rem] text-ink">{channel.value}</p>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
