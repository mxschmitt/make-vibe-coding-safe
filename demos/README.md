# Live Demo Playbook

Two demos for slide 7 of the talk. Both use the shared `demo-app/` — no separate apps to install or start.

## Prerequisites

```bash
cd demo-app
npm ci
npx playwright install --with-deps chromium
```

No extra global installs. `npx playwright test` and `npx playwright trace` both ship with `@playwright/test@^1.59.1` already in `demo-app/package.json`. This works with Claude Code, Gemini CLI, Codex, Cursor, or any agent that can run shell commands.

## Demos

| # | Folder | Duration | What happens |
|---|--------|----------|--------------|
| 1 | [01-authoring](01-authoring/) | ~3 min | Agent writes a new Playwright test from scratch, runs it, green |
| 2 | [02-debug-loop](02-debug-loop/) | ~4 min | Agent hits a failing test, reads the trace (new in 1.59), finds the bug, fixes it |
