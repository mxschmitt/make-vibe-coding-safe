export type Variant = "mcp" | "cli";

export interface RunConfig {
  variant: Variant;
  taskPrompt: string;
  model: string;
  cwd: string;
  runIndex: number;
  maxTurns: number;
}

export interface StepRecord {
  index: number;
  toolName?: string;
  inputTokens?: number;
  outputTokens?: number;
}

export interface RunResult {
  variant: Variant;
  runIndex: number;
  success: boolean;
  errorSubtype?: string;
  durationMs: number;
  durationApiMs: number;
  numTurns: number;
  totalCostUsd: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadInputTokens: number;
  cacheCreationInputTokens: number;
  totalTokens: number;
  totalContextTokens: number;
  model: string;
  steps: StepRecord[];
}

export interface AggregateStats {
  variant: Variant;
  count: number;
  meanTotalTokens: number;
  medianTotalTokens: number;
  minTotalTokens: number;
  maxTotalTokens: number;
  meanInputTokens: number;
  meanOutputTokens: number;
  meanCacheReadTokens: number;
  meanCacheWriteTokens: number;
  meanTotalContextTokens: number;
  meanCostUsd: number;
  meanDurationMs: number;
  meanNumTurns: number;
}

export interface ComparisonReport {
  timestamp: string;
  taskPrompt: string;
  model: string;
  runs: RunResult[];
  summary: {
    mcp: AggregateStats;
    cli: AggregateStats;
    tokenRatio: number;
    contextTokenRatio: number;
    costRatio: number;
  };
}
