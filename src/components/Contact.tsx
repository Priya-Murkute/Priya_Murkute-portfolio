import { motion } from "motion/react";
import { githubHandle, linkedinHandle, profile } from "@/data/resume";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { InView } from "@/components/motion-primitives/in-view";
import PetalScatter from "@/components/PetalScatter";
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
        <InView
          once
          className="lg:col-span-7"
          viewOptions={{ margin: "-15% 0px" }}
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow" style={{ color: "var(--flaky)" }}>
            Contact
          </p>

          <TextEffect
            as="h2"
            per="word"
            preset="fade-in-blur"
            speedReveal={1.8}
            className="text-display mt-4 max-w-[16ch] font-display font-semibold"
          >
            Got a release coming that you would rather were boring?
          </TextEffect>

          <a
            href={publicHref(profile.cvPath)}
            download
            className="glow-cta mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
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
        </InView>

        <motion.div
          className="card lg:col-span-5"
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {channels.map((channel, index) => (
            <a
              key={channel.label}
              href={channel.href}
              className={`block px-6 py-5 transition-colors hover:bg-sunk ${index > 0 ? "border-t border-line" : ""}`}
            >
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                {channel.label}
              </p>
              <p className="mt-1.5 text-[0.9375rem] text-ink">{channel.value}</p>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
