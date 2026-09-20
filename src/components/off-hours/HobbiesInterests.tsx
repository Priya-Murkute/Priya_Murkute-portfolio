import { motion } from "motion/react";
import { useMemo, type ReactNode } from "react";
import HobbyGallery from "@/components/off-hours/HobbyGallery";
import { HobbyIconBadge } from "@/components/off-hours/hobbyIcons";
import SectionHeader from "@/components/SectionHeader";
import { picturesFor, type ResolvedPicture } from "@/data/hobbyPictures";
import { hobbies } from "@/data/offHours";
import { revealItem } from "@/lib/motion";
import {
  MorphingDialog,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogTrigger,
} from "@/components/motion-primitives/morphing-dialog";
import type { Hobby } from "@/types";

function countLabel(hobby: Hobby, count: number) {
  const noun = hobby.noun ?? { one: "photo", many: "photos" };
  return `${count} ${count === 1 ? noun.one : noun.many}`;
}

/** Each fanned thumbnail's resting and hover pose. Tailwind needs the classes as literals. */
const STACK_POSES = [
  "-rotate-[7deg] group-hover:-rotate-[14deg] group-hover:-translate-x-2.5",
  "rotate-[2deg] -translate-y-0.5 group-hover:rotate-0 group-hover:-translate-y-1.5",
  "rotate-[9deg] group-hover:rotate-[15deg] group-hover:translate-x-2.5",
];

/**
 * Hobbies / Interests: a tile per hobby. Tiles with pictures open a gallery
 * that grows out of the tile; the rest wait for photos. This replaced the
 * separate photo columns and sketch carousel — every picture lives here now.
 */
export default function HobbiesInterests() {
  const resolved = useMemo(
    () => hobbies.map((hobby) => ({ hobby, pictures: picturesFor(hobby) })),
    [],
  );

  return (
    <section id="hobbies" className="section" aria-labelledby="hobbies-title">
      <div className="shell">
        <SectionHeader
          eyebrow="Off hours"
          title="Hobbies / Interests"
          titleId="hobbies-title"
          note="Open any one to see the pictures behind it."
        />

        <ul className="mt-10 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
          {resolved.map(({ hobby, pictures }, index) => (
            <motion.li key={hobby.id} {...revealItem({ delay: (index % 3) * 0.07 })}>
              {pictures.length > 0 ? (
                <HobbyTile hobby={hobby} pictures={pictures} />
              ) : (
                <EmptyHobbyTile hobby={hobby} />
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TileBody({ hobby, footer }: { hobby: Hobby; footer: ReactNode }) {
  return (
    <>
      <HobbyIconBadge icon={hobby.icon} />
      <h3 className="mt-1 font-display text-[1.1875rem] font-semibold tracking-tight">{hobby.name}</h3>
      <p className="text-sm leading-relaxed text-muted">{hobby.desc}</p>
      <div className="mt-2 flex items-center justify-between gap-3 border-t border-line pt-3.5 font-mono text-[0.6875rem] tracking-[0.05em]">
        {footer}
      </div>
    </>
  );
}

function HobbyTile({ hobby, pictures }: { hobby: Hobby; pictures: ResolvedPicture[] }) {
  const count = countLabel(hobby, pictures.length);

  return (
    <MorphingDialog morph={false} transition={{ type: "spring", bounce: 0.08, duration: 0.45 }}>
      <MorphingDialogTrigger
        ariaLabel={`${hobby.name}: open ${count}`}
        className="group grid h-full content-start gap-2.5 rounded-[18px] border border-line bg-surface p-[22px] text-left transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-[3px] hover:border-line-strong hover:shadow-[0_14px_30px_-18px_rgba(160,80,110,0.35)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-pass"
      >
        <span className="absolute right-[18px] top-[18px] flex" aria-hidden="true">
          {pictures.slice(0, 3).map((picture, i) => (
            <img
              key={picture.url}
              src={picture.url}
              alt=""
              loading="lazy"
              decoding="async"
              className={`h-12 w-[38px] rounded-md border-2 border-surface object-cover shadow-[0_3px_10px_-4px_rgba(0,0,0,0.25)] transition-[rotate,translate] duration-[400ms] ease-calm ${i > 0 ? "-ml-[18px]" : ""} ${STACK_POSES[i]}`}
            />
          ))}
        </span>
        <TileBody
          hobby={hobby}
          footer={
            <>
              <span className="text-faint">{count}</span>
              <span className="text-pass">Open →</span>
            </>
          }
        />
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent className="card relative z-10 max-h-[calc(100vh-2rem)] w-full max-w-[980px] overflow-auto p-4 sm:p-5">
          <HobbyGallery hobby={hobby} pictures={pictures} count={count} />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}

function EmptyHobbyTile({ hobby }: { hobby: Hobby }) {
  return (
    <div className="grid h-full content-start gap-2.5 rounded-[18px] border border-dashed border-line-strong bg-paper p-[22px]">
      <TileBody hobby={hobby} footer={<span className="text-faint">Photos coming soon</span>} />
    </div>
  );
}
