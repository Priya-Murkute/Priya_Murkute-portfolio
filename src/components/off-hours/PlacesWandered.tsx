import { useState } from "react";
import BucketList from "@/components/off-hours/BucketList";
import WorldMap from "@/components/off-hours/WorldMap";
import { bucketListNote, journeyRoute, places } from "@/data/places";

/**
 * Places I've wandered: a dotted world map of where I've been, beside the
 * bucket list of where I haven't. Picking a bucket-list place flies the map
 * to it.
 *
 * The two cards share one grid and each spans all three of its rows (heading,
 * body, small print) with a subgrid. That is what keeps them aligned: they
 * start and end together, the map begins where the list's first item does, and
 * the map's legend sits level with the list's small print — whichever card is
 * taller, and however many places are on the list.
 */
export default function PlacesWandered() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <section id="places" className="section" aria-labelledby="places-title">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <p className="eyebrow">Travel</p>
            <h2 id="places-title" className="text-title mt-3 font-display font-semibold">
              Places I've wandered
            </h2>
          </div>
          <p className="max-w-[46ch] text-sm text-muted">
            From Nashik to London, with a few day trips in between, and the places still on my list.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-x-5 gap-y-4 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:grid-rows-[auto_1fr_auto]">
          <WorldMap places={places} route={journeyRoute} selectedId={selectedId} onSelect={setSelectedId} />
          <BucketList
            places={places.filter((place) => place.status === "bucket")}
            selectedId={selectedId}
            onSelect={setSelectedId}
            note={bucketListNote}
          />
        </div>
      </div>
    </section>
  );
}
