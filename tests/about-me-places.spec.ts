import { expect, test, type Locator, type Page } from "@playwright/test";
import { journeyRoute, places } from "../src/data/places";

const bucket = places.filter((place) => place.status === "bucket");
const visited = places.filter((place) => place.status === "visited");

/** The section's pieces, found by what they are rather than by class. */
function parts(page: Page) {
  const section = page.locator("#places");
  return {
    section,
    mapCard: section.locator(".card", { has: page.getByRole("button", { name: "My journey" }) }),
    listCard: section.getByRole("complementary", { name: "Bucket list" }),
    stage: section.getByRole("application"),
    zoom: section.getByText(/^\d+\.\d×$/),
    place: (name: string) => section.getByRole("radio", { name: new RegExp(`^${name}`) }),
    /** Picks (or, if it's already picked, lets go of) a bucket-list place, by clicking its name as a visitor would. */
    choose: (name: string) => section.getByRole("radiogroup").getByText(name, { exact: true }).click(),
  };
}

/** A locator's box, or a failure that says which one had none. */
async function box(locator: Locator) {
  const found = await locator.boundingBox();
  if (!found) throw new Error(`${locator} is not on the page`);
  return found;
}

/** The zoom the map shows, as a number: "3.3×" → 3.3. */
async function zoomOf(zoom: Locator) {
  return parseFloat((await zoom.textContent()) ?? "");
}

/**
 * Places I've wandered on /about-me: a map beside a bucket list. The layout
 * guarantee is that the two line up — same top, same bottom, the map starting
 * where the list's first item does — however the row is sized.
 *
 * These run under reduced motion: the route is simply drawn and the camera
 * stays where it is put, so nothing moves under a test while it works. The
 * journey animation, which does move the camera, has its own suite below.
 */
test.describe("about me · places I've wandered", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/about-me");
    await page.locator("#places").scrollIntoViewIfNeeded();
  });

  test("the stats and the list come from the places data", async ({ page }) => {
    const { section, listCard } = parts(page);
    const countries = new Set(visited.map((place) => place.country)).size;
    await expect(
      section.getByText(`${visited.length} places · ${countries} countries · ${bucket.length} on the bucket list`),
    ).toBeVisible();

    await expect(listCard.getByRole("radio")).toHaveCount(bucket.length);
    for (const place of bucket) {
      await expect(listCard.getByText(place.name, { exact: true })).toBeVisible();
      await expect(listCard.getByText(place.country, { exact: true })).toBeVisible();
    }
  });

  test("the map and the bucket list line up side by side", async ({ page, isMobile }) => {
    test.skip(isMobile, "Side by side needs a desktop width; the stacked layout is covered below.");
    const { mapCard, listCard, stage, section } = parts(page);

    // Wait out the cards' entrance, which slides them 22px.
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await page.waitForTimeout(900);

    for (const width of [1024, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator("#places").scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      const [map, list] = [await box(mapCard), await box(listCard)];
      expect(map.x + map.width, `map should sit left of the list at ${width}px`).toBeLessThan(list.x);

      // Same top and same bottom, whichever card is taller.
      expect(Math.abs(map.y - list.y), `tops at ${width}px`).toBeLessThan(1);
      expect(Math.abs(map.y + map.height - (list.y + list.height)), `bottoms at ${width}px`).toBeLessThan(1);

      // The map begins where the list's first item does, and ends where its last one does.
      const items = section.getByRole("radiogroup").locator("label");
      const [first, last, stageBox] = [await box(items.first()), await box(items.last()), await box(stage)];
      expect(Math.abs(stageBox.y - first.y), `map top vs first item at ${width}px`).toBeLessThan(1);
      expect(Math.abs(stageBox.y + stageBox.height - (last.y + last.height)), `map bottom vs last item at ${width}px`).toBeLessThan(1);

      // The headings start together: the map's eyebrow level with the list's.
      const eyebrows = section.locator(".eyebrow", { hasText: /^(So far|Someday)$/ });
      const [a, b] = [await box(eyebrows.nth(0)), await box(eyebrows.nth(1))];
      expect(Math.abs(a.y - b.y), `eyebrows at ${width}px`).toBeLessThan(1);

      // The map's legend and the list's small print share the last row: they start level.
      const legend = await box(section.getByText("Been there", { exact: true }));
      const note = await box(section.getByText(/^Examples for now/));
      expect(legend.y, `legend below the map at ${width}px`).toBeGreaterThan(stageBox.y + stageBox.height);
      expect(note.y, `small print below the list at ${width}px`).toBeGreaterThan(last.y + last.height);
      // (Tops, not centres: the small print may wrap to more lines than the legend at a narrow width.)
      expect(Math.abs(legend.y - note.y), `footers level at ${width}px`).toBeLessThan(6);
    }
  });

  test("stacked on a narrow screen, the cards fill the width and don't overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const { mapCard, listCard, section } = parts(page);
    await page.locator("#places").scrollIntoViewIfNeeded();

    const [map, list] = [await box(mapCard), await box(listCard)];
    expect(list.y).toBeGreaterThanOrEqual(map.y + map.height);
    expect(Math.abs(map.x - list.x)).toBeLessThan(1);
    expect(Math.abs(map.width - list.width)).toBeLessThan(1);
    expect(map.x + map.width).toBeLessThanOrEqual(390);
    expect(await section.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("picking a bucket-list place pins it and flies the map there; picking it again lets go", async ({
    page,
  }) => {
    const { stage, zoom, place, choose } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    const journeyZoom = await zoomOf(zoom);

    await choose("Kyoto");
    await expect(place("Kyoto")).toBeChecked();
    // It flies in close, and its name is written on the map.
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(5, 0);
    await expect(stage.locator("svg text", { hasText: "Kyoto" })).toBeVisible();
    await expect(stage.locator(".pin-ping")).toHaveCount(1);

    // Another place replaces it: only one at a time.
    await choose("Reykjavík");
    await expect(place("Kyoto")).not.toBeChecked();
    await expect(stage.locator("svg text", { hasText: "Reykjavík" })).toBeVisible();

    // Clicking the chosen place again lets go, and the map returns to the journey.
    await choose("Reykjavík");
    await expect(place("Reykjavík")).not.toBeChecked();
    await expect(stage.locator(".pin-ping")).toHaveCount(0);
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(journeyZoom, 1);
  });

  test("the arrow keys move between bucket-list places, and the map follows", async ({ page }) => {
    const { stage, place } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await place("Kyoto").focus();
    await page.keyboard.press("Space");
    await expect(place("Kyoto")).toBeChecked();
    await page.keyboard.press("ArrowDown");
    await expect(place("Reykjavík")).toBeChecked();
    await expect(stage.locator("svg text", { hasText: "Reykjavík" })).toBeVisible();
  });

  test("the tabs switch between my journey and the whole world, and clear a picked place", async ({
    page,
    isMobile,
  }) => {
    const { section, stage, zoom, place, choose } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect(section.getByRole("button", { name: "My journey" })).toHaveAttribute("aria-pressed", "true");

    await choose("Santorini");
    await section.getByRole("button", { name: "Whole world" }).click();
    await expect(section.getByRole("button", { name: "Whole world" })).toHaveAttribute("aria-pressed", "true");
    await expect(place("Santorini")).not.toBeChecked();
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(1, 1);
    // The whole world at once: every place has its pin on the map.
    await expect(stage.locator("[data-pin]")).toHaveCount(places.length);
    // On a screen wide enough to have room, each place is named, except that the
    // pins crowded around London and around Nashik share one name between them.
    // (On a phone the world is too small for that, and names give way to pins.)
    if (!isMobile) {
      const named = ["London", "Nashik", ...bucket.map((place) => place.name)];
      for (const { name } of places) {
        await expect(stage.locator("svg text", { hasText: new RegExp(`^${name}$`) })).toHaveCount(named.includes(name) ? 1 : 0);
      }
    }

    await section.getByRole("button", { name: "My journey" }).click();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(2);
  });

  test("zoom buttons, double-click and reset move the map, within its limits", async ({ page }) => {
    const { section, stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    const start = await zoomOf(zoom);

    await section.getByRole("button", { name: "Zoom in" }).click();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(start * 1.8);

    await section.getByRole("button", { name: "Reset the map view" }).click();
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(start, 1);

    await stage.dblclick({ position: { x: 200, y: 150 } });
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(start * 1.8);

    // Out as far as it goes: the button gives up rather than going past the world.
    for (let i = 0; i < 4; i += 1) {
      const out = section.getByRole("button", { name: "Zoom out" });
      if (await out.isDisabled()) break;
      await out.click();
      await page.waitForTimeout(900);
    }
    await expect(section.getByRole("button", { name: "Zoom out" })).toBeDisabled();
    expect(await zoomOf(zoom)).toBeCloseTo(1, 1);
  });

  test("dragging pans the map", async ({ page }) => {
    const { section, stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    await page.waitForTimeout(500);
    const start = await zoomOf(zoom);

    const santorini = stage.locator("svg text", { hasText: "Santorini" });
    const before = await box(santorini);
    const area = await box(stage);
    const [x, y] = [area.x + area.width * 0.5, area.y + area.height * 0.4];
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 120, y - 40, { steps: 8 });
    await page.mouse.up();

    // Dragged left and up, so the place moved with it. (Up rather than down: on
    // a phone the journey already sits against the top edge of the world.)
    await expect.poll(async () => before.x - (await box(santorini)).x).toBeGreaterThan(80);
    expect(before.y - (await box(santorini)).y).toBeGreaterThan(20);
    // Panning isn't zooming.
    expect(await zoomOf(zoom)).toBeCloseTo(start, 1);
    await expect(section.getByRole("button", { name: "Zoom in" })).toBeEnabled();
  });

  test("Ctrl + scroll zooms the map; plain scroll is left to the page", async ({ page, isMobile }) => {
    test.skip(isMobile, "Mobile emulation has no scroll wheel.");
    const { stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    await page.waitForTimeout(500);
    const start = await zoomOf(zoom);

    const area = await box(stage);
    await page.mouse.move(area.x + area.width / 2, area.y + area.height / 2);

    // Without Ctrl the map ignores the wheel, so the page scrolls as usual.
    const scrollBefore = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 120);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollBefore);
    expect(await zoomOf(zoom)).toBeCloseTo(start, 1);

    await page.evaluate((y) => window.scrollTo(0, y), scrollBefore);
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -300);
    await page.keyboard.up("Control");
    // One notch is capped at a quarter more, so a single tick can't fling the map across the world.
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(start * 1.15);
    expect(await zoomOf(zoom)).toBeLessThan(start * 1.3);
  });

  test("the keyboard can move and zoom the map", async ({ page }) => {
    const { stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    await page.waitForTimeout(500);
    const start = await zoomOf(zoom);

    await stage.focus();
    await page.keyboard.press("+");
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(start * 1.8);

    const santorini = stage.locator("svg text", { hasText: "Santorini" });
    await page.keyboard.press("0");
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(start, 1);
    await page.waitForTimeout(900);

    const before = await box(santorini);
    await page.keyboard.press("ArrowRight");
    await expect.poll(async () => before.x - (await box(santorini)).x).toBeGreaterThan(40);
  });

  test("everything on the map is also there for a screen reader", async ({ page }) => {
    const { section } = parts(page);
    for (const place of places) {
      await expect(
        section.getByText(`${place.name}, ${place.country}: ${place.status === "visited" ? "been there" : "on the bucket list"}`),
      ).toBeAttached();
    }
    const stops = journeyRoute.map((id) => places.find((place) => place.id === id)!.name);
    await expect(section.getByText(`Route: ${stops.join(", then ")}.`)).toBeAttached();
    await expect(section.locator("svg[aria-hidden='true']").first()).toBeAttached();
  });
});

/** How much of each leg of the route is still to draw: 1 is none of it, 0 is all of it. */
function offsets(page: Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("[data-leg]")].map((line) => parseFloat(getComputedStyle(line).strokeDashoffset)),
  );
}
const drawn = (left: number[]) => left.every((value) => value === 0);

/**
 * The journey draws itself when the map comes into view: Pune to Nashik, on
 * to London, then out to the Cotswolds and back, out to the white cliffs and
 * back. The map closes in on each run of short hops (Pune to Nashik; the trips
 * out from London) and pulls out again for the long flight between them.
 * The whole thing takes about ten seconds, hence the longer timeout.
 */
test.describe("about me · the journey animation", () => {
  test.describe.configure({ timeout: 60_000 });

  // The zoom of the journey view, read before the map is scrolled into view: scrolling
  // it in is what sets the route off, and once it has the camera is on the move.
  // (Tests in a file share this variable only within one worker, one test at a time.)
  let journeyZoom = 0;

  test.beforeEach(async ({ page }) => {
    await page.goto("/about-me");
    const { zoom } = parts(page);
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);
    journeyZoom = await zoomOf(zoom);
    await page.locator("#places").scrollIntoViewIfNeeded();
  });

  test("draws one leg for each stop after the first, each only once the one before is done", async ({ page }) => {
    const { stage } = parts(page);
    await expect(stage.locator("[data-leg]")).toHaveCount(journeyRoute.length - 1);

    // Watch it play: at every sample, a leg has begun only if the one before it is complete.
    const samples: number[][] = [];
    await expect
      .poll(
        async () => {
          const left = await offsets(page);
          samples.push(left);
          return drawn(left);
        },
        { timeout: 20_000, intervals: [100] },
      )
      .toBe(true);

    for (const left of samples) {
      left.forEach((value, i) => {
        if (i > 0 && value < 1) expect(left[i - 1], `leg ${i} began before leg ${i - 1} finished: ${left}`).toBe(0);
      });
    }
    // It really was drawn as it went: some sample caught the long flight (Nashik to London, the
    // second leg) part-way, with the hop before it done and nothing after it started.
    expect(
      samples.some((left) => left[0] === 0 && left[1] > 0.05 && left[1] < 0.95 && left.slice(2).every((value) => value === 1)),
    ).toBe(true);
  });

  test("the map closes in on each run of hops, and pulls back out for the flight and at the end", async ({ page }) => {
    const { stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    const named = (name: string) => stage.locator("svg text", { hasText: new RegExp(`^${name}$`) });

    // First the hop from Pune to Nashik: close in, and both are named.
    await expect.poll(() => zoomOf(zoom), { timeout: 15_000 }).toBeGreaterThan(journeyZoom * 2);
    await expect(named("Pune")).toBeVisible({ timeout: 10_000 });
    await expect(named("Nashik")).toBeVisible();

    // Out again for the long flight to London...
    await expect.poll(() => zoomOf(zoom), { timeout: 15_000 }).toBeLessThan(journeyZoom * 1.3);

    // ...and in again for the trips out from London, big enough to see, with their places named.
    await expect.poll(() => zoomOf(zoom), { timeout: 20_000 }).toBeGreaterThan(journeyZoom * 2);
    await expect(named("Cotswolds")).toBeVisible({ timeout: 10_000 });

    await expect.poll(() => offsets(page).then(drawn), { timeout: 20_000 }).toBe(true);
    await expect.poll(() => zoomOf(zoom), { timeout: 10_000 }).toBeCloseTo(journeyZoom, 1);
  });

  test("the visitor's own move takes the camera back: it doesn't fight them", async ({ page }) => {
    const { stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();

    // Move the map while the map is closed in on the first hop.
    await expect.poll(() => offsets(page).then((left) => left[0] < 1)).toBe(true);
    await stage.focus();
    await page.keyboard.press("ArrowRight");
    const held = await zoomOf(zoom);
    expect(held).toBeGreaterThan(journeyZoom * 2);

    // Through the rest of the journey the camera stays put: it doesn't pull out for the
    // flight, or go in for the trips from London.
    let drift = 0;
    await expect
      .poll(
        async () => {
          drift = Math.max(drift, Math.abs((await zoomOf(zoom)) - held));
          return drawn(await offsets(page));
        },
        { timeout: 20_000, intervals: [100] },
      )
      .toBe(true);
    expect(drift).toBeLessThan(0.15);
  });

  test("picking a bucket-list place mid-journey keeps the map on that place", async ({ page }) => {
    const { stage, zoom, choose, place } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => zoomOf(zoom)).toBeGreaterThan(1.5);

    await choose("Kyoto");
    await expect(place("Kyoto")).toBeChecked();
    await expect.poll(() => zoomOf(zoom)).toBeCloseTo(5, 0);

    // The route carries on drawing behind it, but the camera isn't taken away from Kyoto.
    await expect.poll(() => offsets(page).then(drawn), { timeout: 20_000 }).toBe(true);
    expect(await zoomOf(zoom)).toBeCloseTo(5, 0);
    await expect(stage.locator("svg text", { hasText: "Kyoto" })).toBeVisible();
  });

  test("Replay journey draws it again, from the beginning", async ({ page }) => {
    const { section, stage, zoom } = parts(page);
    await expect(stage.locator(":scope > svg")).toBeVisible();
    await expect.poll(() => offsets(page).then(drawn), { timeout: 20_000 }).toBe(true);
    await expect.poll(() => zoomOf(zoom), { timeout: 10_000 }).toBeCloseTo(journeyZoom, 1);

    await section.getByRole("button", { name: "Replay journey" }).click();
    // Wiped clean, then drawn afresh.
    await expect.poll(() => offsets(page).then((left) => left.every((value) => value > 0.9))).toBe(true);
    await expect.poll(() => offsets(page).then(drawn), { timeout: 20_000 }).toBe(true);
  });

  test.describe("with reduced motion", () => {
    // In the context's options, not emulated after the fact: the page loads already asking for reduced motion.
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the whole route is simply there, and there's nothing to replay", async ({ page }) => {
      const { section, stage, zoom } = parts(page);
      await expect(stage.locator(":scope > svg")).toBeVisible();
      await expect(stage.locator("[data-leg]")).toHaveCount(journeyRoute.length - 1);
      expect(drawn(await offsets(page))).toBe(true);
      await expect(section.getByRole("button", { name: "Replay journey" })).toHaveCount(0);

      // Nor does the camera go anywhere on its own.
      await page.waitForTimeout(2000);
      expect(await zoomOf(zoom)).toBeCloseTo(journeyZoom, 1);
    });
  });
});
