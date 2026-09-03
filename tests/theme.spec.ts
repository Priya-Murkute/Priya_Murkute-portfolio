import { expect, test } from "@playwright/test";

/**
 * The theme is the site's one piece of persisted state, and it is easy to
 * break in two different ways: losing the stored value, or applying it too
 * late and flashing the wrong colours before React mounts. Both are covered.
 */
test.describe("theme", () => {
  test("defaults to light and toggles to dark", async ({ page }) => {
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(html).toHaveClass(/dark/);
  });

  test("survives a full page reload", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();

    // The regression this guards: reading the stored theme but applying it in
    // a useEffect, so the class is briefly absent after a reload.
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: /switch to light theme/i })).toBeVisible();
  });

  test("is applied before the first paint, not after React mounts", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Block the app bundle entirely: whatever paints now is what a visitor
    // sees in the window before hydration. If the dark class only arrives
    // with React, this fails — which is exactly the flash being prevented.
    await page.route("**/assets/*.js", (route) => route.abort());
    await page.goto("/");

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0e1113");
  });

  test("carries across a route change", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch to dark theme/i }).click();

    await page.goto("/about-me");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
