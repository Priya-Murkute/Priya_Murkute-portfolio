import { expect, test } from "@playwright/test";

/**
 * A custom modal, not a <dialog>, so everything a native one gives for free
 * has to be implemented and kept working.
 */
test.describe("work dialog", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("#work").scrollIntoViewIfNeeded();
  });

  test("opens from a card and closes on Escape", async ({ page }) => {
    await page.getByRole("button", { name: /API automation that lives in the pipeline/i }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/REST Assured/i);

    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
  });

  test("closes with the close button", async ({ page }) => {
    await page.getByRole("button", { name: /BDD adoption/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.getByRole("button", { name: /^close$/i }).click();
    await expect(page.getByRole("dialog")).not.toBeVisible();
  });

  test("takes the page behind it out of the accessibility tree", async ({ page }) => {
    await page.getByRole("button", { name: /BDD adoption/i }).click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await expect(page.locator("#root")).toHaveAttribute("inert", "");

    await page.keyboard.press("Escape");
    await expect(page.locator("#root")).not.toHaveAttribute("inert", "");
  });

  test("keeps Tab inside the dialog", async ({ page }) => {
    await page.getByRole("button", { name: /BDD adoption/i }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    // More tabs than the dialog has focusable elements.
    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press("Tab");
      const focusIsInsideDialog = await dialog.evaluate((node) =>
        node.contains(document.activeElement),
      );
      expect(focusIsInsideDialog, `focus left the dialog after ${i + 1} tabs`).toBe(true);
    }
  });

  test("returns focus to the card that opened it", async ({ page }) => {
    const card = page.getByRole("button", { name: /BDD adoption/i });
    await card.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(card).toBeFocused();
  });
});
