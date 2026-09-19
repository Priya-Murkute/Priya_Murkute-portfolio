import { expect, test, type Locator } from "@playwright/test";
import { readdirSync } from "node:fs";
import path from "node:path";
import { hobbies } from "../src/data/offHours";

/** The picture files in a hobby's folder, as the site would find them. */
function picturesInFolder(id: string) {
  return readdirSync(path.resolve("src/assets/hobbies_interest", id)).filter((name) =>
    /^\d{4}-\d{2}-\d{2}__.+\.(jpe?g|png|webp)$/i.test(name),
  );
}

/*
 * The gallery tests below use Sketching: 8 sketches, which is enough to make
 * the track slide at narrower widths. They open newest first — the four from
 * 3 September (Animal Art, Charcoal Art, Flower Art, Squid Game), then the
 * four from 1 September (Admiring Nature, Anime Drawing, Jinu, Spider-Man).
 */

/**
 * True when the gallery fits the window with nothing scrolling sideways, and
 * the open picture is whole and inside the visible stretch of the track.
 * Closed cards may sit beyond the edges: the track slides to reach them.
 */
function galleryFits(dialog: Locator) {
  return dialog.evaluate((panel) => {
    const box = panel.getBoundingClientRect();
    const group = panel.querySelector('[role="group"]')!.getBoundingClientRect();
    const open = panel.querySelector('[role="group"] [aria-current="true"]')!.getBoundingClientRect();
    const groupInPanel = group.left >= box.left - 1 && group.right <= box.right + 1;
    const openInGroup =
      open.left >= group.left - 1 &&
      open.right <= group.right + 1 &&
      open.top >= group.top - 1 &&
      open.bottom <= group.bottom + 1;
    return groupInPanel && openInGroup && panel.scrollWidth <= panel.clientWidth + 1 && box.right <= window.innerWidth + 1;
  });
}

/**
 * Hobbies / Interests on /about-me. Each tile with pictures opens a gallery
 * in the site's MorphingDialog, so the dialog guarantees (Escape, focus trap,
 * focus return, inert page) are checked here too.
 */
test.describe("about me · hobbies / interests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-me");
    await page.locator("#hobbies").scrollIntoViewIfNeeded();
  });

  test("each tile shows exactly the pictures in its folder", async ({ page }) => {
    // Read from the folders themselves, so this stays right as photos are added.
    let empty = 0;
    for (const hobby of hobbies) {
      const count = picturesInFolder(hobby.id).length;
      const noun = hobby.noun ?? { one: "photo", many: "photos" };
      if (count > 0) {
        await expect(
          page.getByRole("button", { name: `${hobby.name}: open ${count} ${count === 1 ? noun.one : noun.many}` }),
        ).toBeVisible();
      } else {
        empty += 1;
        // An empty folder is a plain "coming soon" tile, not a button.
        await expect(page.getByRole("button", { name: new RegExp(`^${hobby.name}:`) })).toHaveCount(0);
        await expect(page.locator("#hobbies").getByText(hobby.name, { exact: true })).toBeVisible();
      }
    }
    await expect(page.locator("#hobbies").getByText("Photos coming soon")).toHaveCount(empty);
  });

  test("a tile opens its gallery with the first picture open, and arrow keys move through it", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();

    const dialog = page.getByRole("dialog", { name: "Sketching" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("group", { name: "Sketching pictures" }).getByRole("button")).toHaveCount(8);
    await expect(dialog.getByRole("button", { name: "Animal Art" })).toHaveAttribute("aria-current", "true");
    await expect(dialog.getByRole("img", { name: "Animal Art" })).toBeVisible();

    await page.keyboard.press("ArrowRight");
    await expect(dialog.getByRole("button", { name: "Charcoal Art" })).toHaveAttribute("aria-current", "true");
    await expect(dialog.getByText("2 / 8").first()).toBeVisible();

    // Wraps round from the first to the last.
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByRole("button", { name: "Spider-Man" })).toHaveAttribute("aria-current", "true");
  });

  test("clicking a slim card opens it and closes the one before", async ({ page }) => {
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
    const dialog = page.getByRole("dialog", { name: "Sketching" });
    const first = dialog.getByRole("button", { name: "Animal Art" });
    const later = dialog.getByRole("button", { name: "Admiring Nature" });
    await expect(first).toHaveAttribute("aria-current", "true");

    const slimBefore = (await later.boundingBox())!;
    await later.click();
    await expect(later).toHaveAttribute("aria-current", "true");
    await expect(first).toHaveAttribute("aria-current", "false");
    await expect(dialog.getByText("5 / 8").first()).toBeVisible();

    // It really opened: once the spring settles, it's much larger along the row than before.
    await expect
      .poll(async () => {
        const box = (await later.boundingBox())!;
        return Math.max(box.width - slimBefore.width, box.height - slimBefore.height);
      })
      .toBeGreaterThan(100);
  });

  test("the open gallery re-fits when the window is resized, both ways", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 820 });
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
    const dialog = page.getByRole("dialog", { name: "Sketching" });
    const cards = dialog.getByRole("group", { name: "Sketching pictures" });
    await expect(cards.getByRole("button")).toHaveCount(8);

    const fits = () => galleryFits(dialog);
    /** Side by side (a row) or stacked (a column), from the first two cards' positions. */
    const layout = () =>
      cards.evaluate((group) => {
        const [a, b] = [...group.querySelectorAll("button")].map((c) => c.getBoundingClientRect());
        return Math.abs(a.top - b.top) < 2 ? "row" : "column";
      });

    await expect.poll(layout).toBe("row");
    await expect.poll(fits).toBe(true);

    // Wide to narrow: the cards must restack into strips, not overflow.
    await page.setViewportSize({ width: 390, height: 844 });
    await expect.poll(layout).toBe("column");
    await expect.poll(fits).toBe(true);

    // And back again.
    await page.setViewportSize({ width: 1280, height: 820 });
    await expect.poll(layout).toBe("row");
    await expect.poll(fits).toBe(true);

    // Every width in between, down and back up, as a window being dragged would pass through.
    const widths = [1440, 1024, 820, 700, 600, 500, 360];
    for (const width of [...widths, ...[...widths].reverse()]) {
      await page.setViewportSize({ width, height: 820 });
      await expect.poll(fits, { message: `gallery overflows at ${width}px` }).toBe(true);
    }
  });

  test("every picture can be opened and stays fully in view, at every size", async ({ page }) => {
    // From roomy desktop to small phone: side by side, a sliding row, and sliding strips.
    for (const width of [1440, 1024, 700, 390]) {
      await page.setViewportSize({ width, height: 820 });
      await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
      const dialog = page.getByRole("dialog", { name: "Sketching" });
      await expect(dialog).toBeVisible();

      for (let i = 1; i <= 8; i += 1) {
        await expect(dialog.getByText(`${i} / 8`).first()).toBeVisible();
        await expect.poll(() => galleryFits(dialog), { message: `picture ${i} at ${width}px` }).toBe(true);
        await page.keyboard.press("ArrowRight");
      }
      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
    }
  });

  test("dragging a crowded track browses it without opening a card", async ({ page }) => {
    // At phone width eight strips don't all fit, so the track slides.
    await page.setViewportSize({ width: 390, height: 760 });
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
    const dialog = page.getByRole("dialog", { name: "Sketching" });
    const group = dialog.getByRole("group", { name: "Sketching pictures" });
    const last = group.getByRole("button", { name: "Spider-Man" });
    await expect(group.getByRole("button", { name: "Animal Art" })).toHaveAttribute("aria-current", "true");

    const before = (await last.boundingBox())!;
    const box = (await group.boundingBox())!;
    const x = box.x + box.width / 2;
    await page.mouse.move(x, box.y + box.height * 0.8);
    await page.mouse.down();
    await page.mouse.move(x, box.y + box.height * 0.2, { steps: 12 });
    await page.mouse.up();

    // The strips slid up, and the first picture is still the open one.
    await expect.poll(async () => before.y - (await last.boundingBox())!.y).toBeGreaterThan(80);
    await expect(group.getByRole("button", { name: "Animal Art" })).toHaveAttribute("aria-current", "true");
  });

  test("scrolling over a crowded track browses it", async ({ page, isMobile }) => {
    test.skip(isMobile, "Mobile emulation has no scroll wheel.");
    await page.setViewportSize({ width: 700, height: 820 });
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
    const group = page.getByRole("dialog").getByRole("group", { name: "Sketching pictures" });
    const last = group.getByRole("button", { name: "Spider-Man" });
    const before = (await last.boundingBox())!;

    const box = (await group.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.wheel(0, 400);
    await expect
      .poll(async () => {
        const after = (await last.boundingBox())!;
        return Math.max(before.x - after.x, before.y - after.y);
      })
      .toBeGreaterThan(80);
  });

  test("Escape closes the gallery and returns focus to its tile", async ({ page }) => {
    const tile = page.getByRole("button", { name: "Sketching: open 8 sketches" });
    await tile.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator("#root")).toHaveAttribute("inert", "");

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
    await expect(tile).toBeFocused();
  });

  test("Tab stays inside the open gallery", async ({ page }) => {
    await page.getByRole("button", { name: "Sketching: open 8 sketches" }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((node) => node.contains(document.activeElement));
      expect(inside, `focus left the gallery after ${i + 1} tabs`).toBe(true);
    }
  });
});
