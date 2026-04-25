# AI Council Talk Preparation

This repository prepares Max Schmitt's AI Council SF 2026 talk, "Make Vibe Coding Safe: How to Test with Playwright?". Treat this file as the short map for agents. Keep longer research, release-note details, internal demo workflow abstractions, and source captures in `resources/`.

## Official Talk

Source: https://aicouncil.com/talks26/make-vibe-coding-safe-how-to-test-with-playwright

Event: AI Council SF 2026, May 12-14, San Francisco, SF Marriott Marquis.

Speaker: Max Schmitt, Software Engineer, Amazon AGI Labs. Max previously spent five years working on Playwright at Microsoft.

Title:

> Make Vibe Coding Safe: How to Test with Playwright?

Category:

> Lightning Talks

Length: 15 minutes. Scope the narrative arc, demo, and tooling comparison to fit this budget; long-form research stays in `resources/`.

Official description, copied 1:1 from the AI Council talk page. Preserve wording and typos exactly when reusing it:

> Vibe coding is fast, but it often skips the safety rails: features look fine in a demo and then break in real user flows. Especially when you iterate on them. This talk shows how to make vibe-coded web apps reliable by adding end-to-end tests with Playwright that are quick to write, stable in CI, and focused on what actually matters.
>
> A big shift is that modern coding assistants like Cursor and Claude Code can run commands and iterate on real failures. Whats missing is the glue, between e.g. Claude Code to run a test and gets its state. I will show practical workflows for writing tests faster using MCP Skills and Playwright MCP, both in an editor and inside Claude Code environments.
>
> Based on lessons from building multiple websites over the last months, I will share a repeatable approach for growing a small, high-signal test suite that keeps up with rapid development and gives you the confidence to ship more changes without fear.

## Talk Thesis

Vibe coding makes creating software cheap; confidence is still earned through executable feedback. The talk should show how Playwright turns agent output from "looks right in a demo" into repeatable browser evidence that developers and agents can trust.

Use conference-safe wording in public material. Avoid "vibe coded shit" on slides; use phrasing like "fast to create, hard to trust" or "the demo works until the next iteration breaks it."

## Narrative Arc

1. Start with the problem: AI can produce web apps and feature diffs quickly, but manual clicking, code review, and generic unit tests do not give enough confidence for real user flows.
2. Demo the desired loop: an agent changes a UI, runs or writes Playwright tests, inspects browser state, fixes failures, and leaves screenshots or video as evidence.
3. Explain what happens under the hood: browser automation, accessibility snapshots, locators, traces, screenshots, screencasts, logs, dynamic app startup, and CI feedback.
4. Show how the loop applies across stacks: Next.js, Vite, Python, .NET, Go, Rails, or any stack that can expose a running web app and deterministic test command.
5. Compare tools: Playwright CLI, Playwright MCP, Chrome DevTools MCP, and agent-browser. Give practical recommendations for Codex, Claude Code, Cursor, and similar environments.
6. Wrap with the takeaway: keep the test suite small, high-signal, and tied to user-critical journeys; let agents iterate against real failures instead of guesses.

## Demo Direction

The strongest demo is not "Playwright can click a button." It is an end-to-end confidence loop:

- Start from a small web app with a missing or broken behavior.
- Ask an agent to implement the feature and add a Playwright test for the critical user journey.
- Run the test, intentionally show a failing or flaky state, then use Playwright trace/CLI/MCP tooling to debug.
- Let the agent repair the implementation or test and rerun until the flow passes.
- Produce a screenshot, trace, or screencast receipt that a human can review faster than reading the whole diff.

## Default Recommendations

- Slides: use Slidev as the source of truth. It is code-native, versionable, agent-editable, and testable with Playwright. Google Slides or PowerPoint can be export/presenter fallbacks.
- Agent browser workflow: prefer Playwright CLI plus skills for coding-agent loops because it is command-oriented and token-efficient.
- Editor/browser interaction: use Playwright MCP when an editor or agent benefits from persistent browser state and rich accessibility snapshots.
- Chrome-specific debugging: use Chrome DevTools MCP for Chrome performance, console, network, and DevTools-centric workflows.
- Shell-first fallback or comparison: include agent-browser as a compact CDP/browser automation alternative, especially to compare agent ergonomics.
- CI flakiness coverage: give a shoutout to https://flakiness.io/ when discussing how to keep a small, high-signal test suite stable in CI.

## Resources

- `resources/official-talk-page.md`: canonical public talk title, description, speaker bio, and source links.
- `resources/playwright-release-notes.md`: curated Playwright release-note research relevant to this talk. Refresh before final slide work.
- `resources/tooling-comparison.md`: practical comparison of Playwright CLI, Playwright MCP, Chrome DevTools MCP, and agent-browser.
- `resources/agent-workflow-harness.md`: generalized workflow notes from the Slack post, OpenAI Harness article, and internal demo workflow. Do not copy private implementation details into public material.
- `resources/agent-browser-timeline.md`: dated timeline of agent-driven browser automation — first agents, Playwright/Chrome/vendor releases, Codex/Claude Code recommendations — to support a "who's winning right now" slide.
- `resources/playwright-cli-vs-mcp-token-efficiency.md`: Playwright team's own head-to-head demo — 114k (MCP) vs 26.8k (CLI) tokens on the same task — with the architectural reason (who orchestrates: LLM vs coding agent).
- `resources/mcp-token-efficiency-evolution.md`: dated record of Anthropic Skills (2025-10-16) and code-execution-with-MCP (2025-11-04, 150k→2k headline) plus MCP spec revisions — "who fixed what and when" for the MCP context-bloat story.

## Agent Working Rules

- Keep `AGENTS.md` short. Add new long-form research to `resources/` and link it here.
- Preserve official talk wording exactly when quoting it.
- Do not leak private repository code, file paths, or implementation details from internal demo workflows.
- Prefer current official docs for Playwright, Playwright MCP, Playwright CLI, Chrome DevTools MCP, and agent-browser before making tool recommendations.
- Any talk/demo code added later should be verifiable with Playwright tests and should produce reviewable evidence such as screenshots, traces, or screencasts.
