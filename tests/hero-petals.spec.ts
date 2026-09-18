import { expect, test, type Page } from "@playwright/test";

/**
 * The hero name releases petals into the WebGL scene. The petals themselves
 * can't be asserted on (they're pixels in a canvas), so these guard what can
 * break around them: errors thrown from the hover path, and the name still
 * working as the link to About Me.
 */

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function sweepAcrossName(page: Page) {
  const name = page.locator("#top h1");
  const box = await name.boundingBox();
  expect(box, "hero name is laid out").not.toBeNull();
  for (let x = box!.x; x < box!.x + box!.width; x += 24) {
    await page.mouse.move(x, box!.y + box!.height / 2);
    await page.waitForTimeout(30);
  }
}

test.describe("hero name petals", () => {
  test("hovering the name releases petals without errors, and the link still works", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    // The scene loads lazily on idle; where WebGL is unavailable it never
    // mounts, and hovering must still be harmless.
    await page.locator("#top canvas").waitFor({ timeout: 10_000 }).catch(() => {});

    await sweepAcrossName(page);
    await page.waitForTimeout(600);
    expect(errors).toEqual([]);

    await page.locator("#top h1").click();
    await expect(page).toHaveURL(/\/about-me$/);
  });

  test("under reduced motion, hovering the name is a no-op", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors = collectErrors(page);
    await page.goto("/");

    await sweepAcrossName(page);
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });
});
