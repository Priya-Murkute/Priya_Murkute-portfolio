import { profile } from "@/data/resume";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { InView } from "@/components/motion-primitives/in-view";

const channels = [
  { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
  { label: "LinkedIn", value: "priya-murkute-oct7", href: profile.linkedin },
];

export default function Contact() {
  return (
    <section id="contact" className="section">
      <div className="shell">
        <InView
          once
          viewOptions={{ margin: "-15% 0px" }}
          variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow">Contact</p>

          <TextEffect
            as="h2"
            per="word"
            preset="fade-in-blur"
            speedReveal={1.8}
            className="text-title mt-4 max-w-[28ch] font-display font-semibold"
          >
            Got a release coming that you would rather were boring?
          </TextEffect>

          <div className="mt-12 grid gap-px sm:grid-cols-3">
            {channels.map((channel) => (
              <div key={channel.label} className="border-t border-line py-6 sm:pr-8">
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-faint">
                  {channel.label}
                </p>
                <a
                  href={channel.href}
                  className="mt-2 inline-block text-[0.9375rem] text-ink decoration-line-strong underline-offset-4 transition-colors hover:text-pass hover:underline"
                >
                  {channel.value}
                </a>
              </div>
            ))}
          </div>

          <a
            href={`${import.meta.env.BASE_URL}${profile.cvPath}`}
            download
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-transform hover:-translate-y-px"
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
      </div>
    </section>
  );
}
