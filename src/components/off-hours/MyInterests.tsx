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
 * Two columns scrolling opposite directions. Each list is rendered twice and
 * the animation travels exactly one list height, so the seam is invisible.
 */
export default function MyInterests() {
  return (
    <InView
      once
      variants={reveal}
      viewOptions={{ margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      /* Stepped by breakpoint: the fades eat ~112px at each end, so a short
         container shows very little photo — but 820px would swamp a phone. */
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
      {/* The travel is always one list height, so the duration is the speed.
          It must stay a literal — Tailwind scans source text, so an
          interpolated arbitrary value would never be generated. */}
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
  // A real photo sizes itself from its own aspect ratio, so it isn't cropped.
  // A CSS background can't, which is why the placeholder needs HEIGHT_CLASS.
  if (hasRealInterestPhotos) {
    return (
      <div className="group/photo relative shrink-0 cursor-pointer overflow-hidden rounded-[3px]">
        <img
          src={photo.gradient}
          /* Content, not decoration — so a real description, not alt="". */
          alt={photo.title}
          loading="lazy"
          decoding="async"
          /* From the optimize-images manifest — reserves the aspect ratio
             before the file loads instead of shifting layout as it lands.
             h-auto keeps it responsive; these only set the ratio. */
          width={photo.width}
          height={photo.imageHeight}
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
