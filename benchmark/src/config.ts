import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const TASK_PROMPT = `Open playwright.dev, search for "locators" and check that the doc is available for each language. Take screenshots of each of the language docs.`;

export const MODEL = process.env.BENCHMARK_MODEL ?? "sonnet";
export const RUNS_PER_VARIANT = parseInt(
  process.env.BENCHMARK_RUNS ?? "3",
  10,
);
export const MAX_TURNS = 50;
export const DEMO_APP_CWD = resolve(__dirname, "../../demo-app");
export const DEMO_APP_PORT = 3010;
export const DEMO_APP_URL = `http://localhost:${DEMO_APP_PORT}`;
