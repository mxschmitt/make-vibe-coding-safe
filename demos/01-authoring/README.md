# Demo 1: Agent Writes a Test

**Duration:** ~3 minutes
**Tool:** `npx playwright test` — ships with the project, works with any coding agent
**Slide:** 7, half 1

## Goal

An agent writes a Playwright test for "delete a todo" from scratch, runs it, and gets green. The committed test file is the artifact.

## Takeaway for the Audience

The test file is the durable artifact. Agents come and go, browser tools change every few months — but the Playwright spec stays in your repo and runs on every commit.

## Pre-Demo Checklist

```bash
cd demo-app
npm ci
npx playwright test              # all green
ls tests/delete-todo.spec.ts     # should not exist
```

## Prompt

Paste into Claude Code, Gemini CLI, or any terminal agent:

> The demo-app at `./demo-app` is a Next.js todo app. There is a delete button on each todo item, but no test covers it. Write a Playwright test in `demo-app/tests/delete-todo.spec.ts` that signs up a new user, adds a todo, deletes it, and verifies it is gone. Use the existing fixtures in `tests/fixtures.ts`. Then run the tests and confirm it passes.

## Expected Agent Behavior

1. Agent reads `tests/fixtures.ts`, `tests/auth-and-todos.spec.ts`, and the todo-list component to understand patterns
2. Agent writes `tests/delete-todo.spec.ts` using `newUser()`, `signUp()`, and role-based locators
3. Agent runs `npx playwright test delete-todo`
4. Test passes on first or second try

## What to Narrate

- The agent used `getByRole` and `getByLabel` — not CSS selectors
- The test follows the same patterns as the existing three specs
- `npx playwright test` is the only command — works with any agent that can run shell commands
- Point at the new file: "That's the artifact that stays in your repo"

## Cleanup

```bash
rm demo-app/tests/delete-todo.spec.ts
```

## Fallback

If the agent stalls, copy `expected-test.ts` from this folder into `demo-app/tests/delete-todo.spec.ts` and run `npx playwright test delete-todo`.
