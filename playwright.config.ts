import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the production build, not the dev server: the base-path
 * anchors and the pre-paint theme script only behave correctly when built.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // WebKit's Windows build crashes its worker at full concurrency. Two is
  // stable and still parallel; Linux CI is unaffected.
  workers: process.env.CI ? 1 : process.platform === "win32" ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // A narrow viewport, so the mobile drawer is actually exercised.
    { name: "mobile-chrome", use: { ...devices["Pixel 5"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],

  webServer: {
    command: "npm run build && npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
