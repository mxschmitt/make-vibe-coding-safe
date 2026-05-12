# Browser Tooling Comparison For The Talk

Retrieved: 2026-04-25

Sources:

- Playwright MCP: https://github.com/microsoft/playwright-mcp
- Playwright CLI: https://github.com/microsoft/playwright-cli
- Chrome DevTools MCP: https://github.com/ChromeDevTools/chrome-devtools-mcp
- agent-browser: https://agent-browser.dev/
- npmtrends: https://npmtrends.com/

## Current Adoption Signals

GitHub stars retrieved via GitHub API on 2026-04-25. npm package versions retrieved via `npm view` on 2026-04-25.

| Tool | GitHub repo | GitHub stars | npm package | npm version |
| --- | --- | ---: | --- | --- |
| Chrome DevTools MCP | https://github.com/ChromeDevTools/chrome-devtools-mcp | 37,199 | `chrome-devtools-mcp` | `0.23.0` |
| Playwright MCP | https://github.com/microsoft/playwright-mcp | 31,398 | `@playwright/mcp` | `0.0.70` |
| agent-browser | https://github.com/vercel-labs/agent-browser | 30,573 | `agent-browser` | `0.26.0` |
| Playwright CLI | https://github.com/microsoft/playwright-cli | 9,330 | `@playwright/cli` | `0.1.9` |

npm download trend comparison:

https://npmtrends.com/@playwright/mcp-vs-@playwright/cli-vs-chrome-devtools-mcp-vs-agent-browser

Slidev embed candidate:

```html
<iframe
  src="https://npmtrends.com/@playwright/mcp-vs-@playwright/cli-vs-chrome-devtools-mcp-vs-agent-browser"
  style="width: 100%; height: 560px; border: 0;"
  title="npm download trends for agent browser tooling"
/>
```

## Recommendation Matrix

| Tool | Best fit | Strengths | Tradeoffs |
| --- | --- | --- | --- |
| Playwright CLI + skills | Default for coding agents in terminal workflows | Token-efficient command interface, sessions, screenshots, traces, videos, storage state, browser dashboard, test debugging | Requires CLI install and agents must learn command patterns |
| Playwright MCP | Editor/agent loops needing persistent browser state and structured page snapshots | Accessibility snapshots, rich browser operations, works in Cursor, Codex, Claude Code, VS Code, and other MCP clients | MCP tool schemas and page snapshots can consume more context |
| Chrome DevTools MCP | Chrome-specific debugging, performance, network, console, and DevTools inspection | Direct Chrome DevTools power, performance insights, console/network analysis, screenshots | Chrome-focused, Node 20.19+ requirement, usage statistics enabled by default unless disabled |
| agent-browser | Shell-first browser automation fallback or comparison point | Native Rust CLI, compact text snapshots, ref-based actions, sessions, CDP mode, works across many coding agents | Not Playwright-based; browser coverage and test-runner integration differ from Playwright |

## Practical Defaults

- For the talk's main recommendation, lead with Playwright Test plus Playwright CLI because it keeps the feedback loop executable, versioned, and close to CI.
- For Cursor-style workflows, show Playwright MCP as the easiest way to let the editor agent inspect and manipulate a browser through MCP.
- For Claude Code or Codex terminal workflows, prefer Playwright CLI with installed skills when the agent is already comfortable running commands.
- For performance or Chrome-specific failure analysis, use Chrome DevTools MCP.
- For a neutral comparison or shell-native alternative, include agent-browser and explain what it optimizes differently.

## Playwright CLI Notes

Use when the agent should drive a browser through commands and keep large page snapshots out of model context unless needed.

Relevant commands and capabilities:

- `npm install -g @playwright/cli@latest`
- `playwright-cli install --skills`
- `playwright-cli open`, `goto`, `snapshot`, `click`, `fill`, `screenshot`, `tracing-start`, `tracing-stop`, `video-start`, `video-stop`
- `playwright-cli -s=<name>` for named sessions
- `PLAYWRIGHT_CLI_SESSION=<name>` to bind an agent run to a browser session
- `playwright-cli show` to monitor running sessions visually
- `playwright-cli attach` to connect to bound browsers or existing browser contexts

Talk angle: "CLI + skills is often the best fit for high-throughput coding agents because the browser becomes a command-line dependency, not a giant context payload."

## Playwright MCP Notes

Use when the agent/client benefits from an always-available browser tool inside the editor or chat environment.

Relevant setup:

- Standard MCP server command: `npx @playwright/mcp@latest`
- Codex setup: `codex mcp add playwright npx "@playwright/mcp@latest"`
- Cursor setup: add MCP server with command `npx @playwright/mcp@latest`
- Claude Code setup: `claude mcp add playwright npx @playwright/mcp@latest`
- Supports persistent profiles, isolated sessions, storage state, CDP endpoints, browser extension connection, allowed/blocked origins, output directories, console/network options, and test id configuration.

Talk angle: "MCP is excellent when the agent needs an interactive browser sense inside the editor, especially for exploration, self-healing, and persistent state."

## Playwright Test MCP Notes

Playwright Test MCP is a superset of Playwright MCP: all the browser automation tools (navigate, click, fill, accessibility snapshots) plus test-runner tools.

Package: Ships as part of `@playwright/test` (v1.56+). No separate npm install.

Invocation: `npx playwright run-test-mcp-server`

Demo app `.mcp.json` already configures this.

Additional tools (on top of Playwright MCP):
- List tests in the project
- Run tests (all or specific)
- Debug single test
- Retrieve test log
- Write test

Relationship to Playwright MCP (`@playwright/mcp`):
- Playwright MCP = browser automation only. Agent SEES the app.
- Playwright Test MCP = Playwright MCP + test runner tools. Agent sees the app AND manages tests.
- Not two servers you run side-by-side — Test MCP includes everything from Playwright MCP.

Talk angle: "Playwright Test MCP is Playwright MCP plus test-runner control. One server, both capabilities — explore the app and manage the test suite."

## Chrome DevTools MCP Notes

Use when Chrome's own debugging surface matters more than cross-browser Playwright semantics.

Relevant setup:

- Standard MCP command: `npx -y chrome-devtools-mcp@latest`
- Codex setup: `codex mcp add chrome-devtools -- npx chrome-devtools-mcp@latest`
- Cursor setup: add MCP server with command `npx -y chrome-devtools-mcp@latest`
- `--slim` can reduce tools for basic browser tasks.
- `--no-usage-statistics` disables usage statistics collection.

Talk angle: "Chrome DevTools MCP is a debugging microscope. Use it for performance, console, network, and Chrome-specific inspection, not as the only answer for portable E2E testing."

## agent-browser Notes

Use when demonstrating shell-first browser automation outside the Playwright ecosystem.

Relevant setup:

- `npm install -g agent-browser`
- `brew install agent-browser` on macOS
- `agent-browser install`
- `npx agent-browser open example.com` for no-install trial
- Key commands include `open`, `snapshot`, `click`, `screenshot`, sessions, dashboard, diffing, CDP mode, streaming, and profiling.

Talk angle: "agent-browser optimizes for compact shell output and quick agent ergonomics. It is useful to compare against Playwright tooling, but Playwright remains the stronger testing and cross-browser CI story."

## Recommended Slide Takeaways

- Do not make this a tool war. Frame each tool by where it belongs in the confidence loop.
- Strong recommendation: Playwright Test is the durable artifact; CLI/MCP/browser tools are how agents produce and debug it.
- Best setup for most teams: small Playwright test suite in CI, Playwright CLI or MCP for agents, traces/screenshots/screencasts as review evidence.
- Best setup for experimentation: give the agent a local app, browser tool, logs, and a test command; require evidence before accepting the diff.
