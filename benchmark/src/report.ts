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
  const mcpOldRuns = runs.filter((r) => r.variant === "mcp-old");
  const mcpRuns = runs.filter((r) => r.variant === "mcp");
  const cliRuns = runs.filter((r) => r.variant === "cli");

  const stats: Record<string, AggregateStats> = {};
  if (mcpOldRuns.length > 0) stats["mcp-old"] = computeStats(mcpOldRuns, "mcp-old");
  if (mcpRuns.length > 0) stats.mcp = computeStats(mcpRuns, "mcp");
  if (cliRuns.length > 0) stats.cli = computeStats(cliRuns, "cli");

  const mcpStats = stats.mcp ?? stats["mcp-old"]!;
  const cliStats = stats.cli ?? mcpStats;

  return {
    timestamp: new Date().toISOString(),
    taskPrompt,
    model,
    runs,
    summary: {
      ...stats,
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

const VARIANT_LABELS: Record<string, string> = {
  "mcp-old": "MCP (old SDK)",
  mcp: "MCP",
  cli: "CLI",
};

export function printSummary(report: ComparisonReport): void {
  const summary = report.summary as Record<string, AggregateStats | number>;
  const variants = (["mcp-old", "mcp", "cli"] as const).filter(
    (v) => summary[v] && typeof summary[v] === "object",
  );

  console.log("\n=== Token Efficiency Benchmark ===\n");
  console.log(`Model: ${report.model}`);
  console.log(
    `Runs per variant: ${(summary[variants[0]!] as AggregateStats).count}\n`,
  );

  const headers = ["Metric", ...variants.map((v) => VARIANT_LABELS[v]!)];

  const rows = [
    headers,
    [
      "Context tokens (all)",
      ...variants.map((v) => fmt((summary[v] as AggregateStats).meanTotalContextTokens)),
    ],
    [
      "  input (cache miss)",
      ...variants.map((v) => fmt((summary[v] as AggregateStats).meanInputTokens)),
    ],
    [
      "  cache read",
      ...variants.map((v) => fmt((summary[v] as AggregateStats).meanCacheReadTokens)),
    ],
    [
      "  cache write",
      ...variants.map((v) => fmt((summary[v] as AggregateStats).meanCacheWriteTokens)),
    ],
    [
      "  output",
      ...variants.map((v) => fmt((summary[v] as AggregateStats).meanOutputTokens)),
    ],
    [
      "Cost (USD)",
      ...variants.map((v) => `$${(summary[v] as AggregateStats).meanCostUsd.toFixed(4)}`),
    ],
    [
      "Turns",
      ...variants.map((v) => (summary[v] as AggregateStats).meanNumTurns.toFixed(1)),
    ],
    [
      "Duration (s)",
      ...variants.map((v) => ((summary[v] as AggregateStats).meanDurationMs / 1000).toFixed(1)),
    ],
  ];

  const colWidths = headers.map((_, i) =>
    Math.max(...rows.map((r) => r[i]!.length)),
  );
  for (const [i, row] of rows.entries()) {
    const line = row.map((cell, j) => cell.padStart(colWidths[j]!)).join("  ");
    console.log(line);
    if (i === 0)
      console.log(colWidths.map((w) => "-".repeat(w)).join("  "));
  }

  if (variants.includes("mcp") && variants.includes("cli")) {
    const contextTokenRatio = report.summary.contextTokenRatio;
    const winner = contextTokenRatio > 1 ? "CLI" : "MCP";
    const ratio = contextTokenRatio > 1 ? contextTokenRatio : 1 / contextTokenRatio;
    console.log(
      `\n${winner} is ~${ratio.toFixed(1)}x more token-efficient (context tokens) on this task.\n`,
    );
  }

  if (variants.includes("mcp-old") && variants.includes("mcp")) {
    const oldCtx = (summary["mcp-old"] as AggregateStats).meanTotalContextTokens;
    const newCtx = (summary.mcp as AggregateStats).meanTotalContextTokens;
    const improvement = oldCtx / newCtx;
    console.log(
      `MCP improved ~${improvement.toFixed(1)}x from old SDK to new SDK (context tokens).\n`,
    );
  }
}

export async function saveReport(report: ComparisonReport): Promise<string> {
  await mkdir(RESULTS_DIR, { recursive: true });
  const ts = report.timestamp.replace(/[:.]/g, "-");
  const path = resolve(RESULTS_DIR, `${ts}.json`);
  await writeFile(path, JSON.stringify(report, null, 2));
  console.log(`Report saved to ${path}`);
  return path;
}
