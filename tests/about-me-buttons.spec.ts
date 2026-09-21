import { expect, test, type Page } from "@playwright/test";

/** The About Me page's closing section: the quote, then the two buttons. */
const closing = (page: Page) => page.locator("blockquote").locator("xpath=ancestor::div[contains(@class,'section')][1]");

test.describe("about me · closing buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about-me");
    await closing(page).scrollIntoViewIfNeeded();
  });

  test("a solid “Back to my work” and an outlined “Get in touch” sit level, side by side", async ({ page }) => {
    const back = closing(page).getByRole("link", { name: /Back to my work/ });
    const touch = closing(page).getByRole("link", { name: "Get in touch" });
    await expect(back).toBeVisible();
    await expect(touch).toBeVisible();

    const [a, b] = [await back.boundingBox(), await touch.boundingBox()];
    expect(Math.abs(a!.y - b!.y), "tops match").toBeLessThan(1);
    expect(Math.abs(a!.height - b!.height), "heights match").toBeLessThan(1);

    // One is filled with ink, the other is outlined on the surface colour.
    await expect(back).toHaveClass(/btn-primary/);
    await expect(touch).toHaveClass(/btn-ghost/);
    expect(await back.evaluate((el) => getComputedStyle(el).backgroundColor)).not.toBe("rgba(0, 0, 0, 0)");
    expect(await touch.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe("1px");
  });

  test("the top bar doesn't get these buttons or any section links", async ({ page }) => {
    const bar = page.locator("header nav");
    await expect(bar.getByRole("link", { name: /Back to (my )?work/i })).toHaveCount(0);
    await expect(bar.getByRole("link", { name: /Hobbies|Places|Vision board|Get in touch/ })).toHaveCount(0);
  });

  test("“Back to my work” returns to the top of the home page", async ({ page }) => {
    await closing(page).getByRole("link", { name: /Back to my work/ }).click();
    await expect(page).toHaveURL(/\/#top$/);
    await expect(page.getByRole("heading", { level: 1, name: "Priya Murkute" })).toBeVisible();
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });

  test("“Get in touch” lands on the Contact section of the home page", async ({ page }) => {
    await closing(page).getByRole("link", { name: "Get in touch" }).click();
    await expect(page).toHaveURL(/\/#contact$/);
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
    await expect(page.getByRole("link", { name: /Download CV/ })).toBeInViewport();
  });
});

test.describe("home page · #hash on arrival", () => {
  test("a link straight to /#contact scrolls to Contact once the page has drawn", async ({ page }) => {
    await page.goto("/#contact");
    await expect(page.locator("#contact")).toBeInViewport({ ratio: 0.5 });
  });

  test("a hash that names nothing leaves the page at the top", async ({ page }) => {
    await page.goto("/#nothing-here");
    await expect(page.getByRole("heading", { level: 1, name: "Priya Murkute" })).toBeVisible();
    await page.waitForTimeout(1800);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(50);
  });
});
