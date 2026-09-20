import { expect, test, type Page } from "@playwright/test";
import { affirmations, visionGoals, visionHorizons } from "../src/data/vision";

const isDone = (goal: (typeof visionGoals)[number]) => Boolean(goal.done);
const open = visionGoals.filter((goal) => !isDone(goal));
const manifested = visionGoals.filter(isDone);
/** The first goal still being worked towards, which the tests tick off. */
const target = open[0];

const board = (page: Page) => page.locator("#vision");
const itemFor = (page: Page, text: string) => board(page).locator(".vision-item", { hasText: text });
const shelfItem = (page: Page, text: string, date: string) =>
  board(page).locator(".vision-shelf-item", { hasText: text }).filter({ hasText: date });
const summary = (page: Page, done: number) =>
  board(page).getByText(`${done} manifested · ${visionGoals.length - done} still dreaming`);

test.describe("about me · vision board", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-me");
    await board(page).scrollIntoViewIfNeeded();
    await expect(board(page).getByRole("heading", { level: 2, name: "Vision board" })).toBeVisible();
  });

  test("each horizon shows its progress and what's still to do; what's come true is on the shelf", async ({ page }) => {
    for (const horizon of visionHorizons) {
      const goals = visionGoals.filter((goal) => goal.horizon === horizon.id);
      const done = goals.filter(isDone).length;
      const column = board(page).getByRole("article", { name: horizon.title });
      await expect(column).toContainText(horizon.when);
      await expect(column).toContainText(`${done} of ${goals.length} manifested`);
      for (const goal of goals.filter((goal) => !isDone(goal))) {
        await expect(column.getByText(goal.text, { exact: true })).toBeVisible();
      }
    }

    await expect(summary(page, manifested.length)).toBeVisible();
    for (const goal of manifested) {
      await expect(shelfItem(page, goal.text, goal.done!)).toBeVisible();
      // Done goals leave the columns.
      await expect(itemFor(page, goal.text)).toHaveCount(0);
    }
  });

  test("it is read-only: nothing on the board can be ticked or clicked to change it", async ({ page }) => {
    await expect(board(page).getByRole("checkbox")).toHaveCount(0);
    await expect(board(page).getByRole("button")).toHaveCount(0);

    // Clicking a goal or a shelf item changes nothing.
    await board(page).getByText(target.text, { exact: true }).click();
    await board(page).getByText(manifested[0].text, { exact: true }).click();
    await page.waitForTimeout(400);
    await expect(summary(page, manifested.length)).toBeVisible();
    await expect(board(page).getByText(target.text, { exact: true })).toBeVisible();
    await expect(page.locator("svg[data-petal-burst]")).toHaveCount(0);
  });

  test("the affirmation above the board changes on its own", async ({ page }) => {
    // Its own page load, under a fake clock, so a seven-second wait takes no time.
    await page.clock.install();
    await page.goto("/about-me");
    await board(page).scrollIntoViewIfNeeded();
    const line = board(page).locator("p[aria-live='polite']", { hasText: "“" });
    await expect(line).toHaveText(`“${affirmations[0]}”`);
    await page.clock.runFor(8000);
    await expect(line).toHaveText(`“${affirmations[1]}”`);
  });

  test("it fits a narrow phone", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await board(page).scrollIntoViewIfNeeded();
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits).toBe(true);
  });

  test("the progress meters fill and count up to the real figures once in view", async ({ page }) => {
    const counts = board(page).locator("[data-meter-count]");
    const fills = board(page).locator("[data-meter-fill]");
    await expect(counts).toHaveCount(visionHorizons.length);

    for (const [index, horizon] of visionHorizons.entries()) {
      const goals = visionGoals.filter((goal) => goal.horizon === horizon.id);
      const done = goals.filter(isDone).length;
      // On a phone the columns stack, so each meter starts only when it is scrolled to.
      await counts.nth(index).scrollIntoViewIfNeeded();
      await expect(counts.nth(index)).toHaveText(`${done} of ${goals.length} manifested`, { timeout: 8000 });
      // The bar ends as full as the figure says.
      await expect
        .poll(() => fills.nth(index).evaluate((fill) => Math.round((fill.getBoundingClientRect().width / fill.parentElement!.getBoundingClientRect().width) * 100)), {
          timeout: 8000,
        })
        .toBe(Math.round((done / goals.length) * 100));
    }
  });

  test("petals drift down behind the board, out of the way of everything on it", async ({ page }) => {
    const layer = board(page).locator("[data-petal-layer]");
    await expect(layer.locator("[data-drifting-petal]").first()).toBeAttached({ timeout: 6000 });
    await expect(layer).toHaveCSS("pointer-events", "none");
    await expect(layer).toHaveAttribute("aria-hidden", "true");
    // The content sits above the layer, so a click on a goal lands on the goal.
    const shellAbove = await board(page).evaluate((section) => {
      const layerEl = section.querySelector("[data-petal-layer]")!;
      const shell = section.querySelector(".shell")!;
      return Boolean(layerEl.compareDocumentPosition(shell) & Node.DOCUMENT_POSITION_FOLLOWING) && getComputedStyle(shell).position !== "static";
    });
    expect(shellAbove).toBe(true);
  });

  test("a column rises a little under the pointer, and settles back", async ({ page, hasTouch }) => {
    test.skip(hasTouch, "Hover needs a pointer.");
    const column = board(page).getByRole("article", { name: visionHorizons[0].title });
    // Let the entrance finish first: it animates the same card.
    await expect(column).toHaveCSS("opacity", "1");
    await expect(column).toHaveCSS("translate", "none");

    await column.hover();
    await expect(column).toHaveCSS("translate", "0px -3px");
    await expect(column).not.toHaveCSS("box-shadow", "none");

    await page.mouse.move(2, 2);
    await expect(column).toHaveCSS("translate", "none");
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("the meters are simply full and no petals drift", async ({ page }) => {
      const counts = board(page).locator("[data-meter-count]");
      for (const [index, horizon] of visionHorizons.entries()) {
        const goals = visionGoals.filter((goal) => goal.horizon === horizon.id);
        await expect(counts.nth(index)).toHaveText(`${goals.filter(isDone).length} of ${goals.length} manifested`, { timeout: 1000 });
      }
      await page.waitForTimeout(2500);
      await expect(page.locator("[data-drifting-petal]")).toHaveCount(0);
    });
  });
});
