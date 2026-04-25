# Playwright CLI vs Playwright MCP: Token Efficiency

Retrieved: 2026-04-25

Source: "Playwright CLI vs MCP" video — https://www.youtube.com/watch?v=Be0ceKN81S8 — first-party Playwright team narration (positioning Playwright CLI against Playwright MCP). Transcript captured locally; quotations below are paraphrased unless marked verbatim.

Purpose: supply concrete, primary-source numbers and an architectural explanation for the talk's "why CLI beats MCP for coding agents" beat. Pairs with `tooling-comparison.md` (which already has stars/npm versions) and feeds a 30-60 second slide pair in the 15-minute talk.

## Head-to-Head Demo

Same task given to Claude Code, once via Playwright CLI + skills, once via Playwright MCP:

> Open playwright.dev, search for "locators", check that the docs are available for each language (JavaScript, Python, Java, .NET), and take a screenshot for each language's doc page.

Result:

| Path | Tokens consumed |
| --- | ---: |
| Playwright MCP | **114,000** |
| Playwright CLI + skills | **26,800** |

~4.25× cheaper with CLI on an identical task.

## Why The Gap

Both tools drive Playwright and can do the same things. The cost difference is about **who sees the output**.

**MCP path:**
- Agent asks MCP server to navigate. Server returns the full accessibility snapshot to the LLM. playwright.dev is a Docusaurus site — "lots of content, a lot of DOM controls, scripts" — so the snapshot itself blew past the per-call token limit ("result exceeds the maximum amount of tokens").
- Agent asks MCP server to take a screenshot. Server returns the screenshot bytes to the LLM. Image tokens land in the context window even though the goal was just to save the screenshot to disk.
- Every intermediate browser state is pushed through the LLM because MCP's contract is LLM-as-orchestrator.

**CLI path:**
- Agent runs `playwright-cli goto …`. CLI writes the snapshot to a file on disk. LLM does not see it unless the agent decides to `cat` it.
- Agent runs `playwright-cli screenshot …`. CLI writes the file. LLM only sees the filename, not the bytes.
- The **coding agent** (Claude Code, Copilot, etc.) — not the LLM directly — decides whether any given artifact needs to enter context.

Quote (paraphrased): *"All of the data CLI emits, it saves into files, and then your coding agent is going to make a decision of whether it needs to go to LLM or not."*

## Capability Surface

- MCP and CLI expose the **same underlying Playwright capabilities**. CLI is not a subset of MCP.
- MCP **disables many commands by default** specifically because each tool definition consumes context. You can enable them manually.
- CLI exposes more commands by default because it has no equivalent context-per-tool cost — tools are invoked via shell, not advertised to the LLM.

## When To Use Which (Playwright Team's Own Framing)

- **Use CLI when there's a coding agent.** Claude Code, GitHub Copilot, Cursor, or any agent with filesystem access + shell. The agent can decide what goes into context. Skills-based, headless by default. Interoperable with other skill-based tools.
- **Use MCP when authoring a generic agentic loop.** No separate coding agent, LLM is the orchestrator, strict tool schema matters. "Everything is in the hands of the LLM, so all of the replies are most likely going to make their way back into the LLM and are potentially going to overwhelm its context."

## Talk Angle

- The token chart is a 10-second slide: **114k vs 26.8k**, same task.
- Architectural takeaway: MCP pushes state *through* the LLM, CLI puts state *on disk* and lets the coding agent choose what to read. This reframes the choice as "who orchestrates — the LLM or the coding agent?" rather than "which tool is better."
- Fits the talk's thesis: evidence on disk (screenshots, traces, files) is the durable artifact; what ends up in context is a separate, agent-level decision.

## What This Is Not

- **Not an MCP protocol change.** This video is Playwright team positioning, not an MCP spec update. If we later cite an actual MCP spec change (e.g., progressive tool disclosure, Anthropic Skills as a lighter alternative to MCP-everything), it belongs in a different file.
- **Not a general anti-MCP argument.** MCP remains the right answer for generic agents; the claim is specifically about coding-agent workflows.

## Sources

- Video: https://www.youtube.com/watch?v=Be0ceKN81S8
- Local transcript: `~/Downloads/transcript.txt` (not committed)
- Cross-reference: `resources/tooling-comparison.md` (CLI and MCP setup, stars, npm versions)
- Cross-reference: `resources/playwright-release-notes.md` (Test Agents in v1.56; `browser.bind()` + dashboard in v1.59)
