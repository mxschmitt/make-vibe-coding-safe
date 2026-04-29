import { query, type SDKAssistantMessage, type Options } from "@anthropic-ai/claude-agent-sdk";
import type { RunConfig, RunResult, StepRecord } from "./types.js";

function buildOptions(config: RunConfig): Options {
  const base: Options = {
    cwd: config.cwd,
    model: config.model,
    maxTurns: config.maxTurns,
    permissionMode: "bypassPermissions",
    allowDangerouslySkipPermissions: true,
    persistSession: false,
    settingSources: [],
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
    },
  };

  if (config.variant === "mcp") {
    return {
      ...base,
      mcpServers: {
        playwright: {
          command: "npx",
          args: ["@playwright/mcp@latest"],
        },
      },
      strictMcpConfig: true,
      allowedTools: ["mcp__playwright__*"],
      disallowedTools: ["Bash", "Edit", "Write"],
      systemPrompt: {
        type: "preset",
        preset: "claude_code",
        append:
          "Use the Playwright MCP tools to interact with the browser. Do NOT use Bash or CLI commands for browser interaction.",
      },
    };
  }

  return {
    ...base,
    allowedTools: ["Bash", "Read"],
    disallowedTools: ["mcp__*"],
    systemPrompt: {
      type: "preset",
      preset: "claude_code",
      append:
        "Use the playwright-cli command-line tool via Bash to interact with the browser. " +
        "Commands:\n" +
        "- `playwright-cli goto <url>` — navigate\n" +
        "- `playwright-cli click <ref>` — click element by ref (e.g. `playwright-cli click e9`)\n" +
        "- `playwright-cli fill '<ref>' '<value>'` — fill a form field\n" +
        "- `playwright-cli type '<ref>' '<text>'` — type text into a field\n" +
        "- `playwright-cli screenshot [path]` — take a screenshot\n" +
        "- `playwright-cli snapshot` — get accessibility snapshot (save to file and read it)\n" +
        "Do NOT use any MCP tools.",
    },
  };
}

export async function runSingle(config: RunConfig): Promise<RunResult> {
  const steps: StepRecord[] = [];
  let stepIndex = 0;
  const t0 = Date.now();
  const elapsed = () => `${((Date.now() - t0) / 1000).toFixed(1)}s`;

  const options = buildOptions(config);
  console.log(`    [${elapsed()}] Starting query (${config.variant})...`);
  const stream = query({ prompt: config.taskPrompt, options });

  for await (const message of stream) {
    if (message.type === "system" && "tools" in message) {
      const tools = (message as { tools?: string[] }).tools ?? [];
      console.log(
        `    [${elapsed()}] system: init — ${tools.length} tools: [${tools.slice(0, 10).join(", ")}${tools.length > 10 ? `, ... +${tools.length - 10}` : ""}]`,
      );
    }

    if (message.type === "assistant") {
      const assistant = message as SDKAssistantMessage;
      const usage = assistant.message.usage;
      const toolBlock = assistant.message.content.find(
        (b: { type: string }) => b.type === "tool_use",
      );
      const textBlock = assistant.message.content.find(
        (b: { type: string }) => b.type === "text",
      );
      const toolName =
        toolBlock?.type === "tool_use" ? toolBlock.name : undefined;
      const textPreview =
        textBlock?.type === "text"
          ? textBlock.text.slice(0, 80).replace(/\n/g, " ")
          : "";

      steps.push({
        index: stepIndex++,
        toolName,
        inputTokens: usage?.input_tokens,
        outputTokens: usage?.output_tokens,
      });

      if (toolName) {
        console.log(
          `    [${elapsed()}] step ${stepIndex}: tool=${toolName} (in=${usage?.input_tokens} out=${usage?.output_tokens})`,
        );
      } else if (textPreview) {
        console.log(
          `    [${elapsed()}] step ${stepIndex}: text="${textPreview}..." (in=${usage?.input_tokens} out=${usage?.output_tokens})`,
        );
      } else {
        console.log(
          `    [${elapsed()}] step ${stepIndex}: assistant (in=${usage?.input_tokens} out=${usage?.output_tokens})`,
        );
      }
    }

    if (message.type === "result") {
      const mu = message.modelUsage;
      let inputTokens = 0;
      let outputTokens = 0;
      let cacheReadInputTokens = 0;
      let cacheCreationInputTokens = 0;
      for (const m of Object.values(mu)) {
        inputTokens += m.inputTokens;
        outputTokens += m.outputTokens;
        cacheReadInputTokens += m.cacheReadInputTokens;
        cacheCreationInputTokens += m.cacheCreationInputTokens;
      }
      return {
        variant: config.variant,
        runIndex: config.runIndex,
        success: message.subtype === "success",
        errorSubtype:
          message.subtype !== "success" ? message.subtype : undefined,
        durationMs: message.duration_ms,
        durationApiMs: message.duration_api_ms,
        numTurns: message.num_turns,
        totalCostUsd: message.total_cost_usd,
        inputTokens,
        outputTokens,
        cacheReadInputTokens,
        cacheCreationInputTokens,
        totalTokens: inputTokens + outputTokens,
        totalContextTokens:
          inputTokens +
          outputTokens +
          cacheReadInputTokens +
          cacheCreationInputTokens,
        model: config.model,
        steps,
      };
    }
  }

  return {
    variant: config.variant,
    runIndex: config.runIndex,
    success: false,
    errorSubtype: "no_result_message",
    durationMs: 0,
    durationApiMs: 0,
    numTurns: 0,
    totalCostUsd: 0,
    inputTokens: 0,
    outputTokens: 0,
    cacheReadInputTokens: 0,
    cacheCreationInputTokens: 0,
    totalTokens: 0,
    totalContextTokens: 0,
    model: config.model,
    steps,
  };
}
