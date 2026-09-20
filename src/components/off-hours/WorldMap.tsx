import { motion, useInView, useReducedMotion } from "motion/react";
import JourneyRoute from "@/components/off-hours/JourneyRoute";
import { memo, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { buildLegs } from "@/lib/journey";
import { PIN_H, placeLabels } from "@/lib/mapLabels";
import { revealItem } from "@/lib/motion";
import { useElementSize } from "@/lib/useElementSize";
import { useMapCamera } from "@/lib/useMapCamera";
import { clamp } from "@/lib/utils";
import {
  DOTS_PATH,
  DOT_SIZE,
  MAX_ZOOM,
  MIN_ZOOM,
  WORLD_H,
  WORLD_W,
  fitPoints,
  panBy,
  project,
  viewSize,
  zoomAbout,
  type Camera,
  type Point,
} from "@/lib/worldMap";
import type { Place } from "@/types";

type View = "journey" | "world";

const VIEWS: { id: View; label: string }[] = [
  { id: "journey", label: "My journey" },
  { id: "world", label: "Whole world" },
];

const WORLD_CAMERA: Camera = { x: WORLD_W / 2, y: WORLD_H / 2, k: 1 };
/** Room left around the visited places in the journey view, as a fraction of their spread. */
const JOURNEY_PADDING = 0.45;
/** How close a bucket-list place is shown. */
const FOCUS_ZOOM = 5;
const ZOOM_STEP = 2;
const MIN_DOT_PX = 2.2;
/**
 * For a run of hops the map closes in on them, as far as it goes: they're only
 * a degree or two apart, and any less and, on a phone, their pins would touch.
 * This is the room left around them, as a fraction of their spread.
 */
const HOP_PADDING = 1.2;

interface Located extends Place, Point {}

function cameraFor(located: Located[], selectedId: string | null, view: View, aspect: number): Camera {
  const selected = located.find((place) => place.id === selectedId);
  if (selected) return { x: selected.x, y: selected.y, k: FOCUS_ZOOM };
  if (view === "world") return WORLD_CAMERA;
  return fitPoints(
    located.filter((place) => place.status === "visited"),
    aspect,
    JOURNEY_PADDING,
  );
}

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** The land, as dots. Memoised: it never changes, and the camera moves every frame. */
const Dots = memo(function Dots({ width, className }: { width: number; className: string }) {
  return <path d={DOTS_PATH} strokeWidth={width} strokeLinecap="round" fill="none" className={className} />;
});

/** How far each arrow key moves the map, as a fraction of what's in view. */
const KEY_PANS: Record<string, [number, number]> = {
  ArrowLeft: [-0.2, 0],
  ArrowRight: [0.2, 0],
  ArrowUp: [0, -0.2],
  ArrowDown: [0, 0.2],
};

/** A teardrop, its tip at the origin, on the same scale as PIN_W and PIN_H. */
const PIN_PATH = "M0 0C-1.6-4.6-6-7.4-6-11.4a6 6 0 1 1 12 0C6-7.4 1.6-4.6 0 0Z";

function Pin({ status, selected }: { status: Place["status"]; selected: boolean }) {
  if (status === "visited") {
    return (
      <>
        <path d={PIN_PATH} className="fill-[var(--accent-rose)] stroke-surface" strokeWidth={1.2} />
        <circle cy={-11.4} r={2} className="fill-surface" />
      </>
    );
  }
  return (
    <g transform={selected ? "scale(1.3)" : undefined}>
      <path
        d={PIN_PATH}
        className={selected ? "fill-pass stroke-surface" : "fill-surface stroke-pass"}
        strokeWidth={selected ? 1.2 : 1.6}
      />
      <circle cy={-11.4} r={2} className={selected ? "fill-surface" : "fill-pass"} />
    </g>
  );
}

const legendPin = (status: Place["status"]) => (
  <svg viewBox="-8 -18 16 19" className="h-[15px] w-3" aria-hidden="true">
    <Pin status={status} selected={false} />
  </svg>
);

const CONTROL =
  "flex size-8 items-center justify-center text-muted transition-colors hover:bg-sunk hover:text-ink disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted focus-visible:outline-2 focus-visible:-outline-offset-2";

/**
 * A dotted world map you can move around: drag to pan, pinch or Ctrl + scroll
 * to zoom, double-click to zoom in, arrow keys and + / − from the keyboard.
 * It shows every visited place as a pin, draws the journey between them as a
 * line that travels stop by stop, and flies to whichever bucket-list place is
 * picked.
 *
 * The card lays itself out on three rows of its parent's grid (header, map,
 * footer), so it lines up with whatever sits beside it — see PlacesWandered.
 */
export default function WorldMap({
  places,
  route,
  trips = [],
  selectedId,
  onSelect,
}: {
  places: Place[];
  /** The journey, as place ids in the order they were visited. */
  route: string[];
  /** Places reached from the route's last stop: one line out to each, none back. */
  trips?: string[];
  /** The bucket-list place being looked at, if any. */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const { ref: stageRef, width, height } = useElementSize<HTMLDivElement>();
  const ready = width > 0 && height > 0;
  const aspect = ready ? width / height : 1.6;

  const located = useMemo<Located[]>(() => places.map((place) => ({ ...place, ...project(place.lat, place.lon) })), [places]);
  const { camera, current, set, flyTo, stop } = useMapCamera(aspect, WORLD_CAMERA);
  const [view, setView] = useState<View>("journey");
  // Bumped to send the camera home again — the reset button, or a tab pressed while already on it.
  const [homeKey, setHomeKey] = useState(0);
  const placed = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // While the route plays, the camera follows it in for the hops and back out. It does so only
  // while nobody has touched the map: any move of the visitor's own turns it off.
  const autopilot = useRef(false);
  // The run of hops the camera has closed in on, if any.
  const zoomedOn = useRef<Point[] | null>(null);

  // Everything that decides where the camera should be goes through here: the
  // first time the stage has a size it jumps there, after that it flies.
  useEffect(() => {
    const stage = stageRef.current;
    if (!ready || !stage) return;
    const { width: w, height: h } = stage.getBoundingClientRect();
    const target = cameraFor(located, selectedId, view, w / h);
    if (placed.current) flyTo(target);
    else {
      placed.current = true;
      set(target);
    }
  }, [ready, located, selectedId, view, homeKey, flyTo, set, stageRef]);

  // Stacked under the map on a small screen, the bucket list is out of sight
  // of the map it steers: bring the map back into view when a place is picked.
  useEffect(() => {
    if (!selectedId) return;
    autopilot.current = false;
    if (!window.matchMedia("(min-width: 64rem)").matches) cardRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedId]);

  // Ctrl + scroll (which is also how a trackpad pinch arrives) zooms towards
  // the cursor. A native listener, as React's wheel events are passive and
  // couldn't stop the page from zooming too. Plain scroll is left to the page.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      autopilot.current = false;
      const rect = stage.getBoundingClientRect();
      const factor = clamp(Math.exp(-event.deltaY * (event.deltaMode === 1 ? 0.05 : 0.0035)), 0.8, 1.25);
      set(
        zoomAbout(
          current.current,
          rect.width / rect.height,
          factor,
          (event.clientX - rect.left) / rect.width,
          (event.clientY - rect.top) / rect.height,
        ),
      );
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [current, set, stageRef]);

  // One pointer down pans; two pinch (and pan with their midpoint).
  const pointers = useRef(new Map<number, Point>());
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    autopilot.current = false;
    stop();
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const stageAspect = rect.width / rect.height;
    const before = [...pointers.current.values()];
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const after = [...pointers.current.values()];

    if (after.length === 1) {
      set(panBy(current.current, stageAspect, -(event.clientX - previous.x) / rect.width, -(event.clientY - previous.y) / rect.height));
      return;
    }
    const midpoint = ([p, q]: Point[]) => ({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 });
    const spread = ([p, q]: Point[]) => Math.hypot(p.x - q.x, p.y - q.y);
    const [from, to] = [midpoint(before), midpoint(after)];
    let next = panBy(current.current, stageAspect, -(to.x - from.x) / rect.width, -(to.y - from.y) / rect.height);
    if (spread(before) > 0) {
      next = zoomAbout(next, stageAspect, spread(after) / spread(before), (to.x - rect.left) / rect.width, (to.y - rect.top) / rect.height);
    }
    set(next);
  };
  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
  };

  const zoomBy = (factor: number, ax = 0.5, ay = 0.5) => {
    autopilot.current = false;
    flyTo(zoomAbout(current.current, aspect, factor, ax, ay));
  };

  /** Back to where the current view (or the picked place) belongs. */
  const goHome = () => {
    autopilot.current = false;
    setHomeKey((key) => key + 1);
  };

  const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    zoomBy(ZOOM_STEP, (event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const pan = KEY_PANS[event.key];
    if (pan) set(panBy(current.current, aspect, pan[0], pan[1]));
    else if (event.key === "+" || event.key === "=") zoomBy(ZOOM_STEP);
    else if (event.key === "-" || event.key === "_") zoomBy(1 / ZOOM_STEP);
    else if (event.key === "0") goHome();
    else return;
    autopilot.current = false;
    event.preventDefault();
  };

  const chooseView = (next: View) => {
    setView(next);
    onSelect(null);
    goHome();
  };

  const frame = viewSize(camera, aspect);
  const left = camera.x - frame.w / 2;
  const top = camera.y - frame.h / 2;
  const unit = frame.w / (width || 1);

  const legs = useMemo(
    () =>
      buildLegs(
        route.flatMap((id) => located.find((place) => place.id === id) ?? []),
        trips.flatMap((id) => located.find((place) => place.id === id) ?? []),
      ),
    [route, trips, located],
  );
  // The route draws itself the first time the map is properly in view, and again on request.
  const reduced = useReducedMotion();
  const seen = useInView(stageRef, { once: true, amount: 0.5 });
  const [replays, setReplays] = useState(0);
  const playKey = seen && ready ? replays + 1 : 0;
  useEffect(() => {
    if (playKey === 0) return;
    autopilot.current = true;
    zoomedOn.current = null;
  }, [playKey]);

  // The route says which leg's turn it is: close in on each run of hops (Pune to Nashik, then the
  // trips out from London), and back out for the flight between them and at the end.
  const followJourney = useCallback(
    (index: number | null) => {
      const stage = stageRef.current;
      if (!stage || !autopilot.current) return;
      const { width: w, height: h } = stage.getBoundingClientRect();
      const focus = index === null ? null : (legs[index]?.focus ?? null);
      if (focus) {
        if (zoomedOn.current === focus) return;
        zoomedOn.current = focus;
        flyTo(fitPoints(focus, w / h, HOP_PADDING));
      } else if (zoomedOn.current) {
        zoomedOn.current = null;
        flyTo(cameraFor(located, null, "journey", w / h));
      }
    },
    [legs, located, flyTo, stageRef],
  );

  const replay = () => {
    chooseView("journey");
    setReplays((count) => count + 1);
  };

  // Most important first: the picked place, then where I've been, then the rest.
  // That's the order names are offered a spot in, and the reverse of the order pins are drawn.
  const ranked = useMemo(() => {
    const rank = (place: Located) => (place.id === selectedId ? 2 : place.status === "visited" ? 1 : 0);
    return [...located].sort((a, b) => rank(b) - rank(a));
  }, [located, selectedId]);
  const labels = placeLabels(
    ranked.map((place) => ({ id: place.id, name: place.name, sx: (place.x - left) / unit, sy: (place.y - top) / unit })),
    { width, height },
  );

  const visited = places.filter((place) => place.status === "visited");
  const countries = new Set(visited.map((place) => place.country)).size;
  const stats = [
    plural(visited.length, "place", "places"),
    plural(countries, "country", "countries"),
    `${places.length - visited.length} on the bucket list`,
  ].join(" · ");

  return (
    <motion.div
      ref={cardRef}
      className="card row-span-3 grid grid-rows-subgrid p-5"
      {...revealItem({ blur: false })}
    >
      {/* Three lines, each level with its counterpart in the bucket list's heading: eyebrow, title, blurb. */}
      <div className="grid content-start justify-items-start gap-1.5">
        <p className="eyebrow">So far</p>
        <div className="inline-flex rounded-full bg-sunk p-1">
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              aria-pressed={view === id}
              onClick={() => chooseView(id)}
              className={`rounded-full px-4 py-1.5 text-[0.8125rem] font-medium transition-colors ${view === id ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-1 font-mono text-[0.6875rem] tracking-[0.05em] text-muted">{stats}</p>
      </div>

      {/* The stage: it fills whatever height its row is given, however tall the bucket list makes that.
          role="application" is the ARIA role for a widget that handles its own keys, which is what a
          pannable map is; jsx-a11y just doesn't count it as interactive. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={stageRef}
        role="application"
        aria-roledescription="map"
        aria-label="Map of the places I've been and want to go. Arrow keys move it; plus and minus zoom; 0 resets."
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
        className="relative min-h-[20rem] cursor-grab touch-none select-none overflow-hidden rounded-xl active:cursor-grabbing sm:min-h-[24rem]"
      >
        {ready ? (
          <svg
            viewBox={`${left} ${top} ${frame.w} ${frame.h}`}
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            {/* Never smaller than a couple of pixels, so the world stays legible when it's all in view. */}
            <Dots width={Math.max(DOT_SIZE, MIN_DOT_PX * unit)} className="stroke-line-strong" />

            <JourneyRoute legs={legs} unit={unit} playKey={playKey} onLeg={followJourney} />

            {[...ranked].reverse().map((place) => {
              const selected = place.id === selectedId;
              const label = labels.get(place.id);
              return (
                <g key={place.id} data-pin={place.id} transform={`translate(${place.x} ${place.y}) scale(${unit})`}>
                  {selected ? <circle cy={-1} r={9} className="pin-ping fill-pass" /> : null}
                  <Pin status={place.status} selected={selected} />
                  {label?.leader ? (
                    <line
                      x1={0}
                      y1={-PIN_H / 2}
                      x2={label.leader.x}
                      y2={label.leader.y}
                      strokeWidth={0.9}
                      strokeLinecap="round"
                      className="stroke-faint"
                    />
                  ) : null}
                  {label ? (
                    <text
                      x={label.x}
                      y={label.y}
                      fontSize={10.5}
                      strokeWidth={3}
                      strokeLinejoin="round"
                      paintOrder="stroke"
                      className={`stroke-surface font-mono ${selected ? "fill-pass font-semibold" : "fill-ink"}`}
                    >
                      {place.name}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        ) : null}

        {ready ? <MiniMap camera={camera} aspect={aspect} onMove={(x, y) => {
              autopilot.current = false;
              set({ ...current.current, x, y });
            }} /> : null}

        {/* Its own pointer and double-click events stay its own, or pressing + would also start a pan. */}
        <div
          className="absolute bottom-3 right-3 grid justify-items-center gap-1.5"
          onPointerDown={(event) => event.stopPropagation()}
          onDoubleClick={(event) => event.stopPropagation()}
        >
          <div className="grid divide-y divide-line overflow-hidden rounded-[10px] border border-line-strong bg-surface shadow-sm">
            <button type="button" aria-label="Zoom in" disabled={camera.k >= MAX_ZOOM - 0.01} onClick={() => zoomBy(ZOOM_STEP)} className={CONTROL}>
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
                <path d="M8 3v10M3 8h10" />
              </svg>
            </button>
            <button type="button" aria-label="Zoom out" disabled={camera.k <= MIN_ZOOM + 0.01} onClick={() => zoomBy(1 / ZOOM_STEP)} className={CONTROL}>
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
                <path d="M3 8h10" />
              </svg>
            </button>
            <button type="button" aria-label="Reset the map view" onClick={goHome} className={CONTROL}>
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2.8 8a5.2 5.2 0 1 0 1.6-3.7M2.6 2.6v2.9h2.9" />
              </svg>
            </button>
          </div>
          <span className="font-mono text-[0.6875rem] tabular-nums text-faint">{camera.k.toFixed(1)}×</span>
        </div>
      </div>

      {/* What the map shows, for anyone not looking at it. */}
      <ul className="sr-only">
        {places.map((place) => (
          <li key={place.id}>
            {place.name}, {place.country}: {place.status === "visited" ? "been there" : "on the bucket list"}
          </li>
        ))}
        <li>Route: {route.flatMap((id) => places.find((place) => place.id === id)?.name ?? []).join(", then ")}.</li>
        {trips.length > 0 ? (
          <li>
            Trips from {places.find((place) => place.id === route[route.length - 1])?.name}:{" "}
            {trips.flatMap((id) => places.find((place) => place.id === id)?.name ?? []).join(", ")}.
          </li>
        ) : null}
      </ul>

      <div className="grid gap-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem] text-muted">
          <span className="flex items-center gap-1.5">
            {legendPin("visited")}
            Been there
          </span>
          <span className="flex items-center gap-1.5">
            {legendPin("bucket")}
            Bucket list
          </span>
          {reduced ? null : (
            <button
              type="button"
              onClick={replay}
              className="ml-auto flex items-center gap-1.5 rounded-full py-0.5 pr-1 text-muted transition-colors hover:text-ink focus-visible:outline-2"
            >
              <svg viewBox="0 0 16 16" className="size-3" fill="currentColor" aria-hidden="true">
                <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8-5.2a.6.6 0 0 0 0-1l-8-5.2a.6.6 0 0 0-.9.5Z" />
              </svg>
              Replay journey
            </button>
          )}
        </div>
        <p className="text-[0.8125rem] text-faint">
          Pinch or Ctrl + scroll to zoom into an area, drag to move, double-click to zoom in.
        </p>
      </div>
    </motion.div>
  );
}

/** The whole world in miniature, with a frame where the stage is looking. Click or drag to move there. */
function MiniMap({ camera, aspect, onMove }: { camera: Camera; aspect: number; onMove: (x: number, y: number) => void }) {
  const frame = viewSize(camera, aspect);
  const box = {
    x: Math.max(0, camera.x - frame.w / 2),
    y: Math.max(0, camera.y - frame.h / 2),
    right: Math.min(WORLD_W, camera.x + frame.w / 2),
    bottom: Math.min(WORLD_H, camera.y + frame.h / 2),
  };
  const dragging = useRef(false);

  const moveTo = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onMove(((event.clientX - rect.left) / rect.width) * WORLD_W, ((event.clientY - rect.top) / rect.height) * WORLD_H);
  };

  return (
    // A shortcut for the pointer only: the keyboard has the arrow keys, and the map itself is described elsewhere.
    <div
      role="presentation"
      onPointerDown={(event) => {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = true;
        moveTo(event);
      }}
      onPointerMove={(event) => dragging.current && moveTo(event)}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerCancel={() => {
        dragging.current = false;
      }}
      onDoubleClick={(event) => event.stopPropagation()}
      className="absolute bottom-3 left-3 w-28 cursor-pointer overflow-hidden rounded-[10px] border border-line-strong bg-surface shadow-sm"
    >
      <svg viewBox={`0 0 ${WORLD_W} ${WORLD_H}`} className="block w-full" aria-hidden="true">
        <Dots width={DOT_SIZE * 3} className="stroke-line-strong" />
        <rect
          x={box.x}
          y={box.y}
          width={box.right - box.x}
          height={box.bottom - box.y}
          className="fill-[var(--accent-rose)]/15 stroke-[var(--accent-rose)]"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
