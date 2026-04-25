# Agent Workflow Harness Notes

Retrieved: 2026-04-25

Sources:

- User-provided Slack post in this chat.
- OpenAI Harness Engineering article: https://openai.com/index/harness-engineering/
- User-provided internal demo workflow notes.
- GitHub CLI discussion about attaching images to PRs: https://github.com/cli/cli/discussions/4745
- GitHub CLI issue for PR description/comment image uploads: https://github.com/cli/cli/issues/4228
- GitHub CLI issue for uploading and embedding files in PRs, issues, and comments: https://github.com/cli/cli/issues/1895
- Super User thread about screenshots in PRs via `gh`: https://superuser.com/questions/1741176/easy-way-to-include-screenshots-in-prs-via-githubs-gh-cli

This file intentionally generalizes internal workflow ideas. Do not copy private code, file paths, repository-specific names, or implementation details into public slides or demos.

## Core Idea

The talk can borrow a harness narrative: coding agents become more useful when the repository exposes the same feedback a human developer would use, but in machine-readable form. A good harness lets an agent start the app, discover where it is running, interact with it in a browser, observe logs, run checks, and produce evidence.

## Generic "Ship It" Workflow

A single feature prompt can drive a full lifecycle when the repo has enough scaffolding:

1. Create an isolated git worktree or equivalent sandbox for the feature.
2. Install dependencies in that isolated workspace.
3. Start the app in headless/no-popup development mode.
4. Resolve dynamic ports and write them to a machine-readable discovery file or stdout pattern.
5. Implement the requested change.
6. Use browser automation to navigate the changed UI, interact with the feature, and capture screenshots or video.
7. Observe frontend and backend logs while debugging failures.
8. Run formatting, linting, tests, and the Playwright E2E suite.
9. Commit, push, and create a PR with visual evidence attached.
10. Watch CI, inspect failed logs, fix issues, and repeat until green.

## PR Screenshot Upload Friction

One surprisingly sharp edge in an agent workflow is not taking screenshots; it is attaching them to the PR. The public GitHub CLI threads show the same pattern across years: developers like `gh pr create`, agents can generate screenshots or videos, but the moment they need to attach visual evidence to the PR body/comment they either switch to the browser or build a workaround. `gh` 2.86.0 exposes `--body`, `--body-file`, `--editor`, and `--web` for `gh pr create`, `gh pr comment`, `gh issue create`, and `gh issue comment`, but no native `--attach` flag or `gh image upload` command. The `cli/cli` source confirms comments are posted as text bodies through the public API, while release assets use a separate release upload endpoint; those are not the same as issue/PR comment attachments. https://github.com/cli/cli/issues/1895 was closed as not planned and later marked `blocked` and `platform`: maintainers explain that GitHub CLI is bound to public APIs, there is no public attachment-upload endpoint, and web UI endpoints are off the table for auth, stability, business-policy, and abuse reasons. The browser drag/drop flow obtains an upload policy from github.com and then posts directly to GitHub storage; that policy flow is intentionally only available to logged-in browser sessions. Users work around this by hosting images in S3/GCS, release assets, gists, committed branch files with raw URLs, browser automation against GitHub's textarea upload flow, or third-party extensions such as `gitshot` (https://github.com/vipulgupta2048/gitshot) and `gh-image` (https://github.com/drogers0/gh-image), each with tradeoffs around privacy, retention, extra infrastructure, or relying on browser-cookie behavior.

## Harness Capabilities To Highlight

- Multiple dev instances can run in parallel without port collisions.
- Agents and humans can work in separate worktrees without stopping each other's servers.
- Dev servers expose their runtime coordinates through predictable environment variables, stdout messages, or a small JSON file.
- The app can start without opening a browser, which makes background agent runs less disruptive.
- Browser automation gives the agent direct UI feedback instead of relying on guessed DOM changes.
- Screenshots, traces, and screencasts are review artifacts for humans.
- Logs and test output are first-class context, not pasted manually into chat.
- CI monitoring closes the loop after the PR is opened.

## Relationship To OpenAI Harness Article

Relevant ideas from the Harness article:

- Agents need application legibility: browser state, logs, metrics, traces, and app structure must be visible to them.
- A short `AGENTS.md` should be a map, not a monolithic manual.
- Repository-local knowledge is more useful to agents than Slack threads, Google Docs, or tacit memory.
- The engineer's job shifts toward specifying intent, building feedback loops, and encoding guardrails.
- Autonomy increases when the agent can validate current state, reproduce failures, implement fixes, record evidence, open PRs, respond to feedback, and remediate CI failures.
- Taste and reliability should be encoded into tests, linters, docs, and mechanical checks where possible.

## Talk Demo Adaptation

For this conference talk, keep the demo smaller than the full private workflow:

- Show a local app with one critical user journey.
- Add or modify one feature with an agent.
- Require the agent to add or update a Playwright test.
- Show the failure loop: test fails, trace/CLI/MCP exposes why, agent fixes it.
- Capture screenshot or screencast evidence.
- End by showing how the same pattern would scale to worktrees, dynamic ports, logs, and CI.

## Public Safety Boundary

It is fine to describe the pattern:

- "per-worktree dev instances"
- "dynamic port discovery"
- "headless agent startup"
- "browser verification with screenshots"
- "logs and CI as agent-readable feedback"

Avoid describing private implementation details:

- private file paths
- exact internal scripts
- private repository structure
- internal app behavior
- private source code
- private screenshots or PR contents

## Slide Takeaway

The core lesson is that testing with Playwright is part of a larger harness. The durable artifact is the test suite; the leverage comes from letting agents generate, run, debug, and repair those tests against real browser evidence.
