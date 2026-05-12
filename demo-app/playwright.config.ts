import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";

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
    baseURL: `http://localhost:${process.env.PORT}`,
    channel: "chrome",
    trace: "retain-on-failure",
  },

  projects: [
    { name: "chrome", use: { ...devices["Desktop Chrome"], channel: "chrome" } },
  ],

  webServer: {
    command: "npm run build && npm run start",
    wait: {
      stdout: /localhost:(?<PORT>\d+)/,
    },
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: "0",
      DATABASE_PATH: TEST_DB,
      AUTH_SECRET,
    },
  },
});
