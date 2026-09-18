import { expect, test, type Page } from "@playwright/test";

/**
 * Asserts the *shape* of each href rather than a literal "/#work", so these
 * hold on both deploy targets and fail on any anchor that ignores the base path.
 */
const SECTIONS = ["work", "projects", "experience", "skills", "contact"];

/** Width below which the header hides its links behind the menu button. */
const SM_BREAKPOINT = 640;

/** Below `sm` the links live in the drawer, so return whichever holds them. */
async function openNav(page: Page) {
  const width = page.viewportSize()?.width ?? SM_BREAKPOINT;
  if (width >= SM_BREAKPOINT) return page.locator("header");

  await page.getByRole("button", { name: /open menu/i }).click();
  const drawer = page.getByRole("dialog", { name: /site navigation/i });
  await expect(drawer).toBeVisible();
  return drawer;
}

test.describe("navigation", () => {
  test("every nav anchor is built from the deploy base path", async ({ page, baseURL }) => {
    await page.goto("/");
    const nav = await openNav(page);

    const base = new URL(baseURL!).pathname; // "/" locally, "/priya-portfolio/" on Pages

    for (const section of SECTIONS) {
      const link = nav.getByRole("link", { name: new RegExp(`^${section}$`, "i") });
      await expect(link, `nav link for #${section}`).toHaveAttribute("href", `${base}#${section}`);
    }
  });

  test("the logo and footer links point at the site root, not the origin root", async ({
    page,
    baseURL,
  }) => {
    await page.goto("/");
    const base = new URL(baseURL!).pathname;

    await expect(
      page.locator("header").getByRole("link", { name: /priya murkute/i }),
    ).toHaveAttribute("href", `${base}#top`);

    await expect(page.getByRole("link", { name: /back to top/i })).toHaveAttribute(
      "href",
      `${base}#top`,
    );
  });

  test("each nav link scrolls to a section that exists", async ({ page }) => {
    await page.goto("/");

    for (const section of SECTIONS) {
      // The drawer closes on click, so it has to be reopened per link.
      const nav = await openNav(page);
      await nav.getByRole("link", { name: new RegExp(`^${section}$`, "i") }).click();
      await expect(page.locator(`#${section}`)).toBeInViewport({ timeout: 5000 });
    }
  });

  test("/off-hours redirects to /about-me instead of duplicating it", async ({ page }) => {
    await page.goto("/about-me");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/artist/i);

    // A real redirect, not a second route rendering the same component — so
    // there's only one indexable URL for this content, not two.
    await page.goto("/off-hours");
    await expect(page).toHaveURL(/\/about-me$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/artist/i);
  });

  test("an unknown route renders the 404 page, not a blank screen", async ({ page }) => {
    await page.goto("/no-such-page");
    await expect(page.getByRole("heading", { name: /doesn't pass/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /back to the suite/i })).toBeVisible();
  });

  test("the CV download resolves rather than 404ing", async ({ page, baseURL }) => {
    await page.goto("/");
    const link = page.getByRole("link", { name: /download cv/i });
    const href = await link.getAttribute("href");

    const response = await page.request.get(new URL(href!, baseURL).toString());
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("pdf");
  });
});
