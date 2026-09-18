import { expect, test } from "@playwright/test";

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

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: /switch to light theme/i })).toBeVisible();
  });

  test("is applied before the first paint, not after React mounts", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /switch to dark theme/i }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // With the bundle blocked, only the pre-paint script can apply the class.
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
