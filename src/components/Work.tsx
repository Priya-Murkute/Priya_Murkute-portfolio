import { work } from "@/data/resume";
import type { WorkItem } from "@/types";
import { LayeredWaves } from "@/components/Backgrounds";
import { InView } from "@/components/motion-primitives/in-view";
import { Spotlight } from "@/components/motion-primitives/spotlight";
import {
  MorphingDialog,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogDescription,
  MorphingDialogSubtitle,
  MorphingDialogTitle,
  MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";

/**
 * Keeps the heading's voice ("Six things...") while letting the data decide
 * the number — the heading used to be typed out, so adding a seventh work
 * item made the page quietly untrue.
 */
const NUMBER_WORDS = [
  "No",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

function inWords(count: number): string {
  return NUMBER_WORDS[count] ?? String(count);
}

export default function Work() {
  return (
    <section id="work" className="section relative">
      <LayeredWaves className="absolute inset-x-0 top-0 h-24 opacity-50" />

      <div className="shell relative">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="text-title mt-3 max-w-[26ch] font-display font-semibold">
              {inWords(work.length)} things worth showing you.
            </h2>
          </div>
          <p className="measure text-sm text-muted sm:max-w-xs">
            Drawn from the résumé rather than side projects. Open any one for what it actually
            involved.
          </p>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {work.map((item, index) => (
            <InView
              key={item.id}
              once
              className={
                index === 0 || index === work.length - 1 ? "sm:col-span-2" : undefined
              }
              viewOptions={{ margin: "-10% 0px" }}
              variants={{
                hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.65, delay: Math.min(index, 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              <WorkCard item={item} />
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatusTag({ status }: { status: WorkItem["status"] }) {
  const isMeasured = status === "measured";
  return (
    <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-faint">
      <span className={isMeasured ? "status-dot bg-pass" : "status-dot bg-flaky"} />
      {isMeasured ? "measured" : "ongoing"}
    </span>
  );
}

function WorkCard({ item }: { item: WorkItem }) {
  return (
    <MorphingDialog transition={{ type: "spring", bounce: 0.06, duration: 0.4 }}>
      <MorphingDialogTrigger className="card group flex h-full flex-col gap-5 p-6 text-left">
        <Spotlight size={280} />

        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
            {item.category}
          </span>
          <StatusTag status={item.status} />
        </div>

        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          {item.name}
        </h3>

        <p className="text-sm leading-relaxed text-muted">{item.summary}</p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-2">
          <div className="font-mono text-xs text-faint">
            {item.metric ? (
              <span className="text-pass">
                {item.metric.prefix}
                {item.metric.value}
                {item.metric.suffix} {item.metric.label}
              </span>
            ) : (
              item.organisation
            )}
          </div>
          <span className="font-mono text-[0.6875rem] text-faint transition-colors group-hover:text-ink">
            open →
          </span>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="card relative z-10 w-full max-w-2xl p-7 sm:p-9">
          <div className="flex items-center justify-between gap-4 pr-10">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
              {item.category}
            </span>
            <StatusTag status={item.status} />
          </div>

          <MorphingDialogTitle className="text-title mt-4 max-w-[24ch] font-display font-semibold">
            {item.name}
          </MorphingDialogTitle>

          <MorphingDialogSubtitle className="mt-2 font-mono text-xs text-muted">
            {item.organisation}
            {item.metric ? (
              <span className="text-pass">
                {" · "}
                {item.metric.prefix}
                {item.metric.value}
                {item.metric.suffix} {item.metric.label}
              </span>
            ) : null}
          </MorphingDialogSubtitle>

          {item.metricContext ? (
            <p className="measure mt-3 text-sm leading-relaxed text-muted">{item.metricContext}</p>
          ) : null}

          <MorphingDialogDescription className="mt-6">
            <p className="measure text-[0.9375rem] leading-relaxed text-muted">{item.detail}</p>
            <ul className="mt-7 flex flex-wrap gap-2 border-t border-line pt-5">
              {item.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.6875rem] text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </MorphingDialogDescription>

          <MorphingDialogClose className="right-5 top-5 flex size-8 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-ink" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
