import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";

const PORT = 3010;
const BASE_URL = `http://localhost:${PORT}`;
const TEST_DB = join(process.cwd(), "data", "test.db");
const AUTH_SECRET =
  process.env.AUTH_SECRET ?? "ci-dummy-secret-at-least-32-bytes-long-for-authjs";

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",

  use: {
    baseURL: BASE_URL,
    channel: "chrome",
    trace: "retain-on-failure",
  },

  projects: [
    { name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],

  webServer: {
    command: "npm run build && npm run start",
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: String(PORT),
      DATABASE_PATH: TEST_DB,
      AUTH_SECRET,
    },
  },
});
