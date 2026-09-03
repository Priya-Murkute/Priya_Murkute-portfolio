import { useMemo } from "react";
import { interestPhotos, hasRealInterestPhotos } from "@/data/interestsGallery";
import { InView } from "@/components/motion-primitives/in-view";
import { cn } from "@/lib/utils";
import type { InterestPhoto } from "@/types";

const reveal = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const HEIGHT_CLASS: Record<InterestPhoto["height"], string> = {
  tall: "h-[300px]",
  med: "h-[230px]",
  short: "h-[180px]",
};

const leftPhotos = interestPhotos.filter((photo) => photo.column === "left");
const rightPhotos = interestPhotos.filter((photo) => photo.column === "right");

/**
 * Two columns of photos, opposite directions, looping forever. Each
 * column's list is rendered twice back-to-back and the animation travels
 * exactly one list's height, so the seam is invisible.
 */
export default function MyInterests() {
  return (
    <InView
      once
      variants={reveal}
      viewOptions={{ margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      /* Taller than it was (580px flat) so more of each column is on screen
         at once — the fades top and bottom eat ~112px each, which left the
         old height showing very little actual photo. Stepped by breakpoint
         rather than one fixed value: 820px on a laptop is generous, but on a
         phone it would run past the fold on its own. */
      className="relative grid h-[560px] grid-cols-2 gap-2.5 overflow-hidden rounded sm:h-[700px] lg:h-[820px]"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-28 bg-gradient-to-b from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-paper to-transparent" />

      <InterestColumn photos={leftPhotos} direction="down" />
      <InterestColumn photos={rightPhotos} direction="up" />
    </InView>
  );
}

function InterestColumn({ photos, direction }: { photos: InterestPhoto[]; direction: "down" | "up" }) {
  const loop = useMemo(() => [...photos, ...photos], [photos]);

  return (
    <div className="group relative overflow-hidden">
      {/* 45s, up from 22s. The animation always travels exactly one list
          height, so the duration *is* the speed — doubling it halves the
          drift, which reads as an ambient scroller rather than a feed
          scrolling past. Hovering a column still pauses it outright. The
          duration has to be a literal here: Tailwind scans source text, so an
          interpolated arbitrary value would never get generated. */}
      <div
        className={cn(
          "flex flex-col gap-2.5 will-change-transform animate-[interests-down_45s_linear_infinite] group-hover:[animation-play-state:paused]",
          direction === "up" && "[animation-direction:reverse]",
        )}
      >
        {loop.map((photo, index) => (
          <InterestPhotoCard key={`${photo.id}-${index}`} photo={photo} />
        ))}
      </div>
    </div>
  );
}

function InterestPhotoCard({ photo }: { photo: InterestPhoto }) {
  // Real photos: an actual <img>, so the card's height comes from the
  // photo's own aspect ratio at the column's fixed width — no cropping.
  // A CSS background can't drive layout size the way an <img> does, which
  // is why the placeholder path below still needs a fixed HEIGHT_CLASS.
  if (hasRealInterestPhotos) {
    return (
      <div className="group/photo relative shrink-0 cursor-pointer overflow-hidden rounded-[3px]">
        <img
          src={photo.gradient}
          /* These are her photographs — the content of the section, not
             decoration, so they get a real description rather than alt="". */
          alt={photo.title}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full transition-transform group-hover/photo:scale-105"
          style={{ transitionDuration: "650ms", transitionTimingFunction: "var(--ease-calm)" }}
        />
        <PhotoCaption photo={photo} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/photo relative shrink-0 cursor-pointer overflow-hidden rounded-[3px] border border-dashed border-line",
        HEIGHT_CLASS[photo.height],
      )}
    >
      <div
        className="h-full w-full bg-cover bg-center transition-transform group-hover/photo:scale-105"
        style={{ background: photo.gradient, transitionDuration: "650ms", transitionTimingFunction: "var(--ease-calm)" }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <span className="font-mono text-[0.6rem] tracking-[0.08em] text-paper uppercase opacity-40">
          [ photo goes here ]
        </span>
      </div>
      <PhotoCaption photo={photo} />
    </div>
  );
}

function PhotoCaption({ photo }: { photo: InterestPhoto }) {
  return (
    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[rgba(14,17,19,0.82)] to-transparent to-55% p-3.5 opacity-0 transition-opacity duration-300 group-hover/photo:opacity-100">
      <div className="text-[0.76rem] leading-tight text-[rgba(236,237,237,0.96)]">
        <span className="mb-0.5 block font-mono text-[0.54rem] uppercase tracking-[0.1em] text-[rgba(154,160,164,0.85)]">
          {photo.year}
        </span>
        {photo.title}
      </div>
    </div>
  );
}
