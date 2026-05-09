# Live Demo Playbook

One demo for slide 7 of the talk, split into two parts: writing the same test without MCP and with MCP. Uses the shared `demo-app/` — no separate apps to install or start.

## Prerequisites

```bash
cd demo-app
npm ci
npx playwright install --with-deps chromium
```

No extra global installs. `npx playwright test` ships with `@playwright/test@^1.59.1` already in `demo-app/package.json`. This works with Claude Code, Gemini CLI, Codex, Cursor, or any agent that can run shell commands.

## Demo

| Folder | Duration | What happens |
|--------|----------|--------------|
| [01-authoring](01-authoring/) | ~3 min | Agent writes a "delete todo" test — first without MCP (inferred locators), then with Playwright MCP (real locators from accessibility snapshot) |
