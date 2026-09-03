import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against the production build, not the dev server — the two things
 * most worth protecting here (the base-path handling in section anchors, the
 * pre-paint theme script) only behave like production when they *are*
 * production.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  // WebKit's Windows build crashes its worker (STATUS_STACK_BUFFER_OVERRUN)
  // when several instances launch at once — the whole suite passes serially
  // but fails at full concurrency, which is an artefact of the browser build
  // rather than anything about this site. Two workers is stable here and
  // still parallel; Linux CI is unaffected but pinned for stable timings.
  workers: process.env.CI ? 1 : process.platform === "win32" ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    // A real narrow viewport, so the header's `hidden sm:flex` links and the
    // drawer that replaces them are both actually exercised.
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
