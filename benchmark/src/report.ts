import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  RunResult,
  ComparisonReport,
  AggregateStats,
  Variant,
} from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const RESULTS_DIR = resolve(__dirname, "../results");

function mean(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function median(nums: number[]): number {
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2;
}

function computeStats(runs: RunResult[], variant: Variant): AggregateStats {
  const tokens = runs.map((r) => r.totalTokens);
  return {
    variant,
    count: runs.length,
    meanTotalTokens: Math.round(mean(tokens)),
    medianTotalTokens: Math.round(median(tokens)),
    minTotalTokens: Math.min(...tokens),
    maxTotalTokens: Math.max(...tokens),
    meanInputTokens: Math.round(mean(runs.map((r) => r.inputTokens))),
    meanOutputTokens: Math.round(mean(runs.map((r) => r.outputTokens))),
    meanCacheReadTokens: Math.round(
      mean(runs.map((r) => r.cacheReadInputTokens)),
    ),
    meanCacheWriteTokens: Math.round(
      mean(runs.map((r) => r.cacheCreationInputTokens)),
    ),
    meanTotalContextTokens: Math.round(
      mean(runs.map((r) => r.totalContextTokens)),
    ),
    meanCostUsd: mean(runs.map((r) => r.totalCostUsd)),
    meanDurationMs: Math.round(mean(runs.map((r) => r.durationMs))),
    meanNumTurns: mean(runs.map((r) => r.numTurns)),
  };
}

export function buildReport(
  runs: RunResult[],
  taskPrompt: string,
  model: string,
): ComparisonReport {
  const mcpRuns = runs.filter((r) => r.variant === "mcp");
  const cliRuns = runs.filter((r) => r.variant === "cli");
  const mcpStats = computeStats(mcpRuns, "mcp");
  const cliStats = computeStats(cliRuns, "cli");

  return {
    timestamp: new Date().toISOString(),
    taskPrompt,
    model,
    runs,
    summary: {
      mcp: mcpStats,
      cli: cliStats,
      tokenRatio:
        cliStats.meanTotalTokens > 0
          ? mcpStats.meanTotalTokens / cliStats.meanTotalTokens
          : 0,
      contextTokenRatio:
        cliStats.meanTotalContextTokens > 0
          ? mcpStats.meanTotalContextTokens / cliStats.meanTotalContextTokens
          : 0,
      costRatio:
        cliStats.meanCostUsd > 0
          ? mcpStats.meanCostUsd / cliStats.meanCostUsd
          : 0,
    },
  };
}

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

export function printSummary(report: ComparisonReport): void {
  const { mcp, cli, tokenRatio, contextTokenRatio, costRatio } = report.summary;

  console.log("\n=== Token Efficiency Benchmark ===\n");
  console.log(`Model: ${report.model}`);
  console.log(`Runs per variant: ${mcp.count}\n`);

  const rows = [
    ["Metric", "MCP", "CLI", "Ratio"],
    [
      "Context tokens (all)",
      fmt(mcp.meanTotalContextTokens),
      fmt(cli.meanTotalContextTokens),
      `${contextTokenRatio.toFixed(2)}x`,
    ],
    [
      "  input (cache miss)",
      fmt(mcp.meanInputTokens),
      fmt(cli.meanInputTokens),
      "",
    ],
    [
      "  cache read",
      fmt(mcp.meanCacheReadTokens),
      fmt(cli.meanCacheReadTokens),
      "",
    ],
    [
      "  cache write",
      fmt(mcp.meanCacheWriteTokens),
      fmt(cli.meanCacheWriteTokens),
      "",
    ],
    [
      "  output",
      fmt(mcp.meanOutputTokens),
      fmt(cli.meanOutputTokens),
      "",
    ],
    [
      "Cost (USD)",
      `$${mcp.meanCostUsd.toFixed(4)}`,
      `$${cli.meanCostUsd.toFixed(4)}`,
      `${costRatio.toFixed(2)}x`,
    ],
    [
      "Turns",
      mcp.meanNumTurns.toFixed(1),
      cli.meanNumTurns.toFixed(1),
      "",
    ],
    [
      "Duration (s)",
      (mcp.meanDurationMs / 1000).toFixed(1),
      (cli.meanDurationMs / 1000).toFixed(1),
      "",
    ],
  ];

  const colWidths = rows[0]!.map((_, i) =>
    Math.max(...rows.map((r) => r[i]!.length)),
  );
  for (const [i, row] of rows.entries()) {
    const line = row.map((cell, j) => cell.padStart(colWidths[j]!)).join("  ");
    console.log(line);
    if (i === 0)
      console.log(colWidths.map((w) => "-".repeat(w)).join("  "));
  }

  const winner = contextTokenRatio > 1 ? "CLI" : "MCP";
  const ratio = contextTokenRatio > 1 ? contextTokenRatio : 1 / contextTokenRatio;
  console.log(
    `\n${winner} is ~${ratio.toFixed(1)}x more token-efficient (context tokens) on this task.\n`,
  );
}

export async function saveReport(report: ComparisonReport): Promise<string> {
  await mkdir(RESULTS_DIR, { recursive: true });
  const ts = report.timestamp.replace(/[:.]/g, "-");
  const path = resolve(RESULTS_DIR, `${ts}.json`);
  await writeFile(path, JSON.stringify(report, null, 2));
  console.log(`Report saved to ${path}`);
  return path;
}
