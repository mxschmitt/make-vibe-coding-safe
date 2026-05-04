import { spawn } from "node:child_process";
import { parseArgs } from "node:util";
import {
  TASK_PROMPT,
  MODEL,
  RUNS_PER_VARIANT,
  MAX_TURNS,
  DEMO_APP_CWD,
} from "./config.js";
import { runSingle } from "./run-single.js";
import { buildReport, printSummary, saveReport } from "./report.js";
import type { RunResult, Variant } from "./types.js";

function parseCliArgs(): { variants: Variant[]; runs: number; model: string } {
  const { values } = parseArgs({
    options: {
      variant: { type: "string", default: "both" },
      runs: { type: "string" },
      model: { type: "string" },
    },
  });

  let variants: Variant[];
  switch (values.variant) {
    case "mcp":
      variants = ["mcp"];
      break;
    case "mcp-old":
      variants = ["mcp-old"];
      break;
    case "cli":
      variants = ["cli"];
      break;
    default:
      variants = ["mcp-old", "mcp", "cli"];
  }

  return {
    variants,
    runs: values.runs ? parseInt(values.runs, 10) : RUNS_PER_VARIANT,
    model: values.model ?? MODEL,
  };
}

async function verifyPlaywrightCli(): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child = spawn("which", ["playwright-cli"]);
    child.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(
            new Error(
              "playwright-cli not found. Install globally first.",
            ),
          ),
    );
  });
}

async function main(): Promise<void> {
  const args = parseCliArgs();
  console.log(
    `Benchmark: variants=${args.variants.join(",")}, runs=${args.runs}, model=${args.model}\n`,
  );
  console.log(`Task: ${TASK_PROMPT}\n`);

  if (args.variants.includes("cli")) {
    await verifyPlaywrightCli();
    console.log("playwright-cli found.\n");
  }

  const results: RunResult[] = [];

  for (const variant of args.variants) {
    console.log(`\n--- Running ${variant.toUpperCase()} variant (${args.runs} runs) ---\n`);

    for (let i = 0; i < args.runs; i++) {
      console.log(`[${variant}] Run ${i + 1}/${args.runs}...`);

      const result = await runSingle({
        variant,
        taskPrompt: TASK_PROMPT,
        model: args.model,
        cwd: DEMO_APP_CWD,
        runIndex: i,
        maxTurns: MAX_TURNS,
      });
      results.push(result);

      const status = result.success ? "OK" : `FAIL (${result.errorSubtype})`;
      console.log(
        `  ${status} — ${result.totalContextTokens.toLocaleString()} context tokens, $${result.totalCostUsd.toFixed(4)}, ${result.numTurns} turns, ${(result.durationMs / 1000).toFixed(1)}s`,
      );
    }
  }

  if (args.variants.length >= 2 && results.length > 0) {
    const report = buildReport(results, TASK_PROMPT, args.model);
    printSummary(report);
    await saveReport(report);
  } else {
    console.log("\n--- Individual Run Results ---\n");
    for (const r of results) {
      console.log(
        `[${r.variant}] #${r.runIndex + 1}: ${r.totalContextTokens.toLocaleString()} context tokens, $${r.totalCostUsd.toFixed(4)}, ${r.numTurns} turns`,
      );
    }
  }
}

main().catch((err) => {
  console.error("Benchmark failed:", err);
  process.exit(1);
});
