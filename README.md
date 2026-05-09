# Make Vibe Coding Safe: How to Test with Playwright?

Lightning talk by [Max Schmitt](https://max.sh) at [AI Council SF 2026](https://aicouncil.com/talks26/make-vibe-coding-safe-how-to-test-with-playwright) (May 12-14, San Francisco).

> Vibe coding is fast, but it often skips the safety rails: features look fine in a demo and then break in real user flows. This talk shows how to make vibe-coded web apps reliable by adding end-to-end tests with Playwright that are quick to write, stable in CI, and focused on what actually matters.

## What's in this repo

| Directory | Description |
|-----------|-------------|
| [`slides/`](slides/) | [Slidev](https://sli.dev) presentation source |
| [`demo-app/`](demo-app/) | Next.js todo app with auth, used for the live demo |
| [`benchmark/`](benchmark/) | Token-efficiency benchmark comparing Playwright CLI vs MCP |
| [`resources/`](resources/) | Research notes, tooling comparisons, and timeline references |

## Slides

```bash
cd slides
npm install
npm run dev      # open in browser with hot reload
npm run build    # build for production
npm run export   # export to PDF
```

## Demo App

A Next.js 16 todo app with authentication (next-auth + SQLite) and three Playwright test specs that cover the critical user journeys.

```bash
cd demo-app
npm install
npx playwright install chromium
npm run dev          # start dev server on localhost:3000
```

### Running tests

```bash
npm test             # run all Playwright tests
npm run test:ui      # open Playwright UI mode
npm run test:debug   # run with step-by-step debugger
```

The Playwright config targets Chrome only, retains traces on failure, and runs tests sequentially for deterministic results.

## Benchmark

Measures token usage when an AI agent performs the same browser task via Playwright MCP vs Playwright CLI + skills.

```bash
cd benchmark
npm install
npm run benchmark          # run both variants
npm run benchmark:mcp      # MCP only
npm run benchmark:cli      # CLI only
```

In mid-2025, the Playwright team showed CLI was ~4.25x cheaper: **26.8k tokens** (CLI) vs **114k tokens** (MCP) on the same task. Then Anthropic shipped resource links, Skills, and code-execution-with-MCP. Our May 2026 re-run on the same task shows the gap has flipped: **$0.36/run** (MCP) vs **$0.44/run** (CLI). Pick based on your architecture, not on 2025 benchmarks.

## Talk overview

1. **The problem** -- AI-generated features look right in a demo, then break on the next iteration
2. **The loop** -- Agent writes code, runs Playwright tests, inspects traces, fixes failures
3. **Tool comparison** -- Playwright CLI + skills, Playwright MCP, Chrome DevTools MCP, agent-browser
4. **Token efficiency** -- The 2025 gap (CLI was 4x cheaper), Anthropic's fixes, and our 2026 re-run where MCP won
5. **Takeaway** -- Keep the suite small, high-signal, and tied to critical journeys; agents are how you get there, tests are what you keep

## CI

- **Tests**: Playwright tests run on every push and PR to `main` ([ci.yml](.github/workflows/ci.yml))
- **Slides**: Built and deployed to [GitHub Pages](https://mxschmitt.github.io/aicouncil-talk-e2e-testing-with-ai/) on push to `main` ([deploy-pages.yml](.github/workflows/deploy-pages.yml))

## Learnings — making this talk with AI

- **Slides as code** — [Slidev](https://sli.dev) is agent-editable, diffable, and testable
- **Deep Research for resources** — curated context the coding agent can reflect on
- **Parallel agents** — [Conductor](https://conductor.build) lets you work on multiple things at once
- **Version control** — git history, diffs, and PRs for every slide change
- **Close to code** — slides live next to the app and tests they describe
- **Slidev Claude Code skill** — [sli.dev/guide/work-with-ai](https://sli.dev/guide/work-with-ai) + agent-browser to validate on localhost

## License

This repository contains talk preparation materials. The demo app and benchmark code are provided as-is for educational purposes.
