import { motion } from "motion/react";
import { revealItem } from "@/lib/motion";
import type { Place } from "@/types";

/**
 * The places I haven't been to yet, as a group of radio buttons: picking one
 * flies the map to it, and picking it again lets go. Native radios, so the
 * arrow keys move between them and screen readers announce "1 of 4".
 *
 * Like the map beside it, the card takes three rows of its parent's grid
 * (heading, list, small print), which is what keeps the two cards aligned.
 */
export default function BucketList({
  places,
  selectedId,
  onSelect,
  note,
}: {
  places: Place[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  note?: string;
}) {
  return (
    <motion.aside
      className="card row-span-3 grid grid-rows-subgrid bg-sunk p-5"
      aria-labelledby="bucket-list-title"
      {...revealItem({ delay: 0.08, blur: false })}
    >
      <div className="grid content-start gap-1.5">
        <p className="eyebrow">Someday</p>
        <h3 id="bucket-list-title" className="font-display text-[1.5rem] font-semibold tracking-tight">
          Bucket list
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          Places I haven't been to yet. Pick one to find it on the map.
        </p>
      </div>

      {/* Every item takes an equal share of whatever height the map gives the row. */}
      <div
        role="radiogroup"
        aria-label="Bucket list places"
        className="grid min-w-0 gap-3 sm:grid-cols-2 lg:auto-rows-fr lg:grid-cols-1"
      >
        {places.map((place) => {
          const checked = place.id === selectedId;
          return (
            <label
              key={place.id}
              className="group relative flex cursor-pointer gap-3 rounded-2xl border border-line bg-surface p-4 transition-[border-color,box-shadow] hover:border-line-strong has-[:checked]:border-pass has-[:checked]:shadow-[0_10px_24px_-16px_rgba(46,107,79,0.55)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-pass"
            >
              <input
                type="radio"
                name="bucket-list"
                value={place.id}
                checked={checked}
                onChange={() => onSelect(place.id)}
                // A checked radio doesn't change when clicked again, but it does click: that's the way to let go.
                onClick={() => checked && onSelect(null)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="relative mt-[3px] size-[18px] flex-none rounded-full border-[1.5px] border-line-strong bg-surface transition-colors after:absolute after:inset-[3px] after:scale-0 after:rounded-full after:bg-pass after:transition-transform peer-checked:border-pass peer-checked:after:scale-100 group-hover:border-muted"
              />
              <span className="grid content-center gap-0.5">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-display text-[1.0625rem] font-semibold tracking-tight">{place.name}</span>
                  <span className="text-[0.8125rem] text-muted">{place.country}</span>
                </span>
                {place.note ? <span className="text-sm leading-relaxed text-muted">{place.note}</span> : null}
              </span>
            </label>
          );
        })}
      </div>

      {note ? (
        <p className="font-mono text-[0.6875rem] leading-relaxed tracking-[0.03em] text-faint">{note}</p>
      ) : null}
    </motion.aside>
  );
}
