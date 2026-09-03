import { education, profile } from "@/data/resume";
import { InView } from "@/components/motion-primitives/in-view";

const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export default function About() {
  return (
    <section id="about" className="section">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">Approach</p>
        </div>

        <InView
          once
          className="lg:col-span-8"
          variants={reveal}
          viewOptions={{ margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-title max-w-[24ch] font-display font-semibold">
            Testing is a design activity, not a phase at the end.
          </h2>

          <div className="measure mt-7 space-y-5 text-lead text-muted">
            <p>
              Most of what I've automated has been for systems where a missed edge case is
              expensive — banking platforms at Wipro, where I moved from writing individual test
              cases to owning the frameworks a whole team relied on: Page Object structure so
              nothing was a one-off script, API coverage wired into CI so failures showed up
              before a release did.
            </p>
            <p>
              The rest is maintenance, which is where automation either earns its keep or quietly
              rots. A suite is only an asset while it still tells the truth — so I would rather
              run two hundred tests that fail for real reasons than a thousand everyone has
              learned to ignore.
            </p>
          </div>

          <dl className="mt-10 grid gap-x-8 gap-y-4 border-t border-line pt-6 font-mono text-[0.8125rem] sm:grid-cols-2">
            {education.map((item) => (
              <div key={item.qualification} className="flex gap-3">
                <dt className="text-faint">{item.year}</dt>
                <dd>
                  {item.qualification}
                  <span className="block text-muted">{item.institution}</span>
                </dd>
              </div>
            ))}
            <div className="flex gap-3">
              <dt className="text-faint">Now</dt>
              <dd>
                Based in {profile.location}
                <span className="block text-muted">Open to QA and SDET roles</span>
              </dd>
            </div>
          </dl>
        </InView>
      </div>
    </section>
  );
}
