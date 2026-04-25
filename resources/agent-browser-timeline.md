# Agent Browser Automation Timeline

Retrieved: 2026-04-25

Purpose: dated, most-recent-first timeline of agent-driven browser automation, to support a two-minute "here's where we are, here's how we got here" slide in the AI Council SF 2026 talk. Pairs with `playwright-release-notes.md` and `tooling-comparison.md`.

## Playwright Agent-Era Releases

- 2026-04-01 — Playwright v1.59.0: `browser.bind()`, `--debug=cli`, screencast with chapters. See `playwright-release-notes.md`.
- 2025-11-25 — Playwright v1.57.0: Speedboard reporter, Chrome for Testing, dynamic webServer ports.
- 2025-10-06 — Playwright v1.56.0: Test Agents (planner/generator/healer), `npx playwright init-agents`.

## Coding-Agent Recommendations As Of 2026-04-25

- OpenAI Codex MCP docs list Playwright MCP and Chrome DevTools MCP as peer options, no preference stated.
- Anthropic Claude Code MCP docs pull from the Anthropic MCP registry; both Playwright MCP and Chrome DevTools MCP appear as installable browser servers.
- Cursor community configs converge on Playwright MCP for test authoring and Chrome DevTools MCP for debugging; see `tooling-comparison.md` for setup snippets.
- Internal recommendation in `tooling-comparison.md`: Playwright CLI + skills for terminal agents, Playwright MCP for editor agents, Chrome DevTools MCP for Chrome debugging, agent-browser as shell-first comparison.

## MCP Browser Tooling

- 2026-04-22 — Chrome DevTools MCP v0.23.0 (weekly cadence; current leader by GitHub stars).
- 2026-04-16 — vercel-labs/agent-browser v0.26.0 (current).
- 2026-04-01 — microsoft/playwright-mcp v0.0.70 (current).
- 2026-01-23 — vercel-labs/agent-browser first public release v0.6.0 (repo created 2026-01-11).
- 2025-09-15 — ChromeDevTools/chrome-devtools-mcp first release v0.1.0.
- 2025-03-28 — microsoft/playwright-mcp first tagged release v0.0.7 (repo created 2025-03-21).
- 2024-11-25 — Anthropic announces the Model Context Protocol.

## Vendor Computer-Use Products

- 2025-07-17 — OpenAI ChatGPT Agent rolls out to Pro, Plus, Team.
- 2025-07-09 — Perplexity Comet launches on Windows and macOS.
- 2025-06-11 — Dia (Browser Company) enters public beta on macOS.
- 2025-03-31 — Amazon Nova Act announced by Amazon AGI Labs (Max works on this team).
- 2025-01-23 — OpenAI Operator research preview (Computer-Using Agent) launches for ChatGPT Pro.
- 2024-12-11 — Google DeepMind announces Project Mariner research prototype.
- 2024-10-22 — Anthropic releases Claude Computer Use with Claude 3.5 Sonnet.

## First Wave: LLM + Browser Experiments

- 2024-11-06 — `browser-use` v0.1.0 open-source release.
- 2024-11-01 — Browserbase Stagehand v1.0.3 (earliest public release on GitHub; repo created 2024-03-24).
- 2024-03-25 — Skyvern v1.0.26 (earliest public release; repo created 2024-02-28).
- 2024-02-26 — LaVague repo created on GitHub.
- 2022-09-29 — Nat Friedman publishes `natbot` ("Drive a browser with GPT-3") on GitHub.
- 2021-12-17 — OpenAI WebGPT paper submitted to arXiv (browser-based question answering).
- Adept ACT-1 and HyperWrite/MultiOn: no primary-source date verified; omitted.

## Coding Agents And How They Get A Browser

Scope for this talk: how existing coding agents (Claude Code, Codex, Cursor, Cline) drive a browser to run and debug Playwright tests. This is the "agent gets a browser" category — not the "framework for building your own agent" category (see bottom of section). Stars and push activity retrieved 2026-04-25 via `gh api`.

| Agent | Stars | Built-in browser | MCP path | CLI path | Vendor guidance |
| --- | ---: | --- | --- | --- | --- |
| **Claude Code** (Anthropic, terminal) | 117.9k | None — terminal CLI, no first-party browser tool | Playwright MCP shown as the canonical example in the MCP docs (`claude mcp add … @playwright/mcp`) | Yes — shells out to `npx playwright test`, `playwright codegen` freely | Points users at Playwright MCP as the browser-testing path |
| **Codex** (OpenAI, terminal) | 77.9k | None in terminal CLI. The separate Codex app has an in-app Browser plugin, but that is not the `openai/codex` terminal | Playwright MCP and Chrome DevTools MCP listed side-by-side as compatible examples | Yes — terminal, shells out to `npx playwright` | Neutral — both MCPs presented as peers, no preference stated |
| **Cursor** (editor, closed source) | n/a | Yes — first-party Browser tool, implemented as a bundled MCP extension (engine undisclosed). Supports nav, clicks, typing, screenshots, console, network | User-installable MCPs work but are not pushed | Yes via terminal tool, not first-class | "Use the built-in Browser" for testing, visual editing, a11y audits |
| **Cline** (VS Code extension) | 61.0k | Yes — `browser_action` tool, Puppeteer-based. Framed around Claude Computer Use | Supports MCP generally; no pre-installed servers, no specific Playwright/CDT MCP recommendation | Yes — runs terminal commands from the extension shell | "Use `browser_action`" for interactive debugging, E2E, visual bug fixes |

### Which coding agent is winning?

Claude Code leads raw OSS stars (117.9k) and is the strongest single signal on 2026-04-25 — roughly 1.5× Codex and 2× Cline. Cursor is closed-source so star counts don't apply, but remains the dominant editor-native agent by paid install base. Codex is the fastest-growing challenger (second place in stars despite a later launch). Cline is the largest open-source VS Code agent but trails both first-party CLIs. For this talk's demo surface, Claude Code + Playwright MCP is the combination with the most explicit vendor blessing and the widest audience familiarity.

### Not the target: agent-building frameworks

Adjacent category, worth naming so audience members who know the space don't get confused: **browser-use** (90.3k), **Stagehand** (22.3k), **Skyvern** (21.4k) are frameworks/SDKs for *building your own agent that drives a browser* — the buyer is an engineer shipping an agent product. This talk targets the opposite: an engineer using a coding agent to add tests to their own web app. Same vocabulary, different product.

## Pre-Agent Browser Automation (Context)

- 2020-05-06 — Playwright v1.0.0 released by Microsoft.
- 2017-05-09 — Puppeteer repo created by the Chrome DevTools team.
- 2004 — Selenium originally developed at ThoughtWorks and open-sourced the same year.

## Who Is Winning Right Now (2026-04-25)

Chrome DevTools MCP leads on raw GitHub stars (37.2k) and ships weekly, giving it the strongest visibility-and-momentum signal. Playwright MCP (31.4k) is the default in vendor docs (Codex, Claude Code, Cursor configs) whenever the goal is test authoring, because it composes with Playwright Test v1.56 Test Agents and v1.59 `browser.bind()` to produce traces, screenshots, and screencasts that survive as CI artifacts. agent-browser (30.6k) is the newest of the three (public since January 2026) and is winning on shell ergonomics and compact snapshots — useful when the agent already lives in a terminal. The durable artifact in all of these stories is still a small Playwright test suite: the browser tool is how the agent sees, the test suite is what the team keeps.

## Sources

- Playwright releases: https://github.com/microsoft/playwright/releases
- Playwright MCP releases: https://github.com/microsoft/playwright-mcp/releases
- Chrome DevTools MCP releases: https://github.com/ChromeDevTools/chrome-devtools-mcp/releases
- agent-browser releases: https://github.com/vercel-labs/agent-browser/releases
- browser-use: https://github.com/browser-use/browser-use
- Stagehand: https://github.com/browserbase/stagehand
- Skyvern: https://github.com/Skyvern-AI/skyvern
- LaVague: https://github.com/lavague-ai/LaVague
- natbot: https://github.com/nat/natbot
- Puppeteer: https://github.com/puppeteer/puppeteer
- Selenium history: https://en.wikipedia.org/wiki/Selenium_(software)
- WebGPT paper: https://arxiv.org/abs/2112.09332
- Anthropic Computer Use: https://www.anthropic.com/news/3-5-models-and-computer-use
- Anthropic MCP announcement: https://www.anthropic.com/news/model-context-protocol
- OpenAI Operator (via TechCrunch, OpenAI blog 403): https://techcrunch.com/2025/01/23/openai-launches-operator-an-ai-agent-that-performs-tasks-autonomously/
- OpenAI ChatGPT Agent (via TechCrunch): https://techcrunch.com/2025/07/17/openai-launches-a-general-purpose-agent-in-chatgpt/
- Google Project Mariner: https://en.wikipedia.org/wiki/Project_Mariner
- Amazon Nova Act: https://labs.amazon.science/blog/nova-act
- Perplexity Comet: https://en.wikipedia.org/wiki/Comet_(web_browser)
- Dia browser: https://en.wikipedia.org/wiki/Dia_(web_browser)
- Claude Code MCP docs (shows Playwright MCP as the recommended browser-testing path): https://code.claude.com/docs/en/mcp
- OpenAI Codex MCP docs (lists Playwright MCP and Chrome DevTools MCP as peer examples): https://developers.openai.com/codex/mcp
- Codex app browser plugin (separate product from the terminal CLI): https://developers.openai.com/codex/app/browser
- Cursor built-in Browser docs: https://cursor.com/docs/agent/browser
- Cline tools guide (`browser_action` is Puppeteer-based): https://docs.cline.bot/exploring-clines-tools/cline-tools-guide
- Cline repo: https://github.com/cline/cline
- Claude Code repo: https://github.com/anthropics/claude-code
- Codex repo: https://github.com/openai/codex
- Internal tooling comparison: `resources/tooling-comparison.md`
- Internal Playwright release digest: `resources/playwright-release-notes.md`
