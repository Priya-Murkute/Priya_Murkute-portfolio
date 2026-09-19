import { expect, test } from "@playwright/test";

/**
 * The only runtime third-party dependency. Unauthenticated GitHub allows 60
 * requests/hour per IP, so the failure path is not hypothetical.
 */
const REPOS_ENDPOINT = "https://api.github.com/users/*/repos*";

test.describe("github feed", () => {
  test("renders repositories returned by the API", async ({ page }) => {
    await page.route(REPOS_ENDPOINT, (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: "rest-assured-framework",
            description: "API test framework wired into CI with Newman.",
            html_url: "https://github.com/Priya-Murkute/rest-assured-framework",
            language: "Java",
            stargazers_count: 4,
            pushed_at: "2026-08-01T00:00:00Z",
            fork: false,
          },
        ],
      }),
    );

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /rest assured framework/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /rest assured framework/i })).toContainText("★ 4");
  });

  test("the drifting row exposes each repo once, however many times it repeats", async ({
    page,
  }) => {
    await page.route(REPOS_ENDPOINT, (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: "only-repo",
            description: "Repeated visually to fill the loop.",
            html_url: "https://github.com/Priya-Murkute/only-repo",
            language: "Java",
            stargazers_count: 0,
            pushed_at: "2026-08-01T00:00:00Z",
            fork: false,
          },
        ],
      }),
    );

    await page.goto("/");
    const section = page.locator("#projects");
    await expect(section.getByRole("heading", { name: /only repo/i })).toBeVisible();

    // Painted several times for a seamless loop...
    expect(await section.getByText("Repeated visually to fill the loop.").count()).toBeGreaterThan(1);
    // ...but one link in the accessibility tree, and one tab stop.
    await expect(section.getByRole("link", { name: /only repo/i })).toHaveCount(1);
    await expect(section.locator('a[tabindex="-1"]')).not.toHaveCount(0);
  });

  test("reduced motion gets a still row with no duplicate cards", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.route(REPOS_ENDPOINT, (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: "still-repo",
            description: "Should appear exactly once.",
            html_url: "https://github.com/Priya-Murkute/still-repo",
            language: "Java",
            stargazers_count: 0,
            pushed_at: "2026-08-01T00:00:00Z",
            fork: false,
          },
        ],
      }),
    );

    await page.goto("/");
    const section = page.locator("#projects");
    await expect(section.getByRole("heading", { name: /still repo/i })).toBeVisible();
    await expect(section.getByText("Should appear exactly once.")).toHaveCount(1);
  });

  test("filters out forks and the profile README repo", async ({ page }) => {
    await page.route(REPOS_ENDPOINT, (route) =>
      route.fulfill({
        json: [
          {
            id: 1,
            name: "Priya-Murkute",
            description: "Profile README",
            html_url: "https://github.com/Priya-Murkute/Priya-Murkute",
            language: null,
            stargazers_count: 0,
            pushed_at: "2026-08-01T00:00:00Z",
            fork: false,
          },
          {
            id: 2,
            name: "someone-elses-repo",
            description: "A fork",
            html_url: "https://github.com/Priya-Murkute/someone-elses-repo",
            language: "JS",
            stargazers_count: 0,
            pushed_at: "2026-08-02T00:00:00Z",
            fork: true,
          },
          {
            id: 3,
            name: "real-project",
            description: "Kept.",
            html_url: "https://github.com/Priya-Murkute/real-project",
            language: "TypeScript",
            stargazers_count: 0,
            pushed_at: "2026-08-03T00:00:00Z",
            fork: false,
          },
        ],
      }),
    );

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /real project/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /profile readme/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /someone elses repo/i })).toHaveCount(0);
  });

  test("degrades to a link to the profile when rate-limited", async ({ page }) => {
    await page.route(REPOS_ENDPOINT, (route) =>
      route.fulfill({
        status: 403,
        json: { message: "API rate limit exceeded" },
      }),
    );

    await page.goto("/");
    await page.locator("#projects").scrollIntoViewIfNeeded();

    await expect(page.getByText(/couldn't load repositories/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /view the profile directly/i })).toHaveAttribute(
      "href",
      "https://github.com/Priya-Murkute",
    );
  });

  test("serves the second visit from cache without calling the API again", async ({ page }) => {
    let calls = 0;
    await page.route(REPOS_ENDPOINT, (route) => {
      calls += 1;
      return route.fulfill({
        json: [
          {
            id: 1,
            name: "cached-repo",
            description: "Served once.",
            html_url: "https://github.com/Priya-Murkute/cached-repo",
            language: "Java",
            stargazers_count: 0,
            pushed_at: "2026-08-01T00:00:00Z",
            fork: false,
          },
        ],
      });
    });

    await page.goto("/");
    await expect(page.getByRole("heading", { name: /cached repo/i })).toBeVisible();
    expect(calls).toBe(1);

    await page.goto("/about-me");
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /cached repo/i })).toBeVisible();
    expect(calls, "the session cache should have answered the second visit").toBe(1);
  });
});
