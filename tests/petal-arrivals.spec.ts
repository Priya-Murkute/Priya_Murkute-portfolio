import { expect, test } from "@playwright/test";

/*
 * Above the footer, in the Contact section and at the end of About Me, the fallen petals are
 * joined every so often by one more that drifts down from the top of the section, rests, and
 * fades. It shares its fall and its component (FallingPetals) with the petals behind the
 * vision board.
 */
test.describe("closing sections · petals that drift down and land", () => {
  test("one drifts down through Contact, and never gets in the way", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();

    // The first arrives 2.5–5s after the section is on screen.
    const arrival = contact.locator("[data-petal-layer] [data-drifting-petal]").first();
    await expect(arrival).toBeAttached({ timeout: 12_000 });
    await expect(contact.locator("[data-petal-layer]").first()).toHaveCSS("pointer-events", "none");

    // Sparse: never more than three in the air or resting at once.
    expect(await contact.locator("[data-drifting-petal]").count()).toBeLessThanOrEqual(3);
  });

  test("the About Me closing has them too", async ({ page }) => {
    await page.goto("/about-me");
    const closing = page.locator("blockquote").locator("xpath=ancestor::div[contains(@class,'section')][1]");
    await closing.scrollIntoViewIfNeeded();
    await expect(closing.locator("[data-drifting-petal]").first()).toBeAttached({ timeout: 12_000 });
  });

  test.describe("with reduced motion", () => {
    test.use({ contextOptions: { reducedMotion: "reduce" } });

    test("none drift down", async ({ page }) => {
      await page.goto("/");
      const contact = page.locator("#contact");
      await contact.scrollIntoViewIfNeeded();
      await page.waitForTimeout(6000);
      await expect(contact.locator("[data-drifting-petal]")).toHaveCount(0);
    });
  });
});
