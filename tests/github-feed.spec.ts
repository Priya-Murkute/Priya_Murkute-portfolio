import { expect, test } from "@playwright/test";

/**
 * The Projects section is the only thing on the site that depends on a
 * third-party service at runtime. Unauthenticated GitHub allows 60 requests
 * per hour per IP, so the failure path is not hypothetical — a visitor on a
 * shared corporate address can hit it — and it has to degrade to something
 * that still points at the real profile.
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
    await expect(page.getByText("★ 4")).toBeVisible();
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
