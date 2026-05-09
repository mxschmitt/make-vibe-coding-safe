# Demo: Agent Writes a Test — Without MCP vs With MCP

**Duration:** ~3 minutes total
**Slide:** 7

## Goal

Show the same task — write a Playwright test for "delete a todo" — two ways. Part A: agent infers locators from source code. Part B: agent discovers locators from Playwright MCP's accessibility snapshot of the live app. The contrast makes the value of MCP immediately visible.

## Takeaway for the Audience

Without MCP the agent guesses locators from JSX. With MCP the agent sees the real rendered page — roles, labels, names — and picks locators that match reality. Both produce a working test file that stays in your repo.

## Pre-Demo Checklist

```bash
cd demo-app
npm ci
npx playwright test              # all green
ls tests/delete-todo.spec.ts     # should not exist
```

## Part A: Without MCP (~1.5 min)

### Prompt

Paste into Claude Code (no MCP configured):

> The demo-app at `./demo-app` is a Next.js todo app. There is a delete button on each todo item, but no test covers it. Write a Playwright test in `demo-app/tests/delete-todo.spec.ts` that signs up a new user, adds a todo, deletes it, and verifies it is gone. Use the existing fixtures in `tests/fixtures.ts`. Then run the tests and confirm it passes.

### Expected Agent Behavior

1. Agent reads `tests/fixtures.ts`, `tests/auth-and-todos.spec.ts`, and the todo-list component source
2. Agent **infers** locators from JSX (reads `aria-label`, `data-testid`, button text in source)
3. Agent writes `tests/delete-todo.spec.ts`
4. Agent runs `npx playwright test delete-todo` — passes

### What to Narrate

- "The agent read source files to figure out what locators to use — it never saw the running app"
- "This works on a small codebase, but on a real app with dynamic labels, i18n, or third-party components, the agent is guessing"

### Cleanup Before Part B

```bash
rm demo-app/tests/delete-todo.spec.ts
```

---

## Part B: With MCP (~1.5 min)

### Prompt

Paste into Claude Code (with Playwright MCP configured):

> The demo-app at `./demo-app` is a Next.js todo app. Use Playwright MCP to navigate to the running app, sign up a new user, add a todo, and explore the delete flow. Look at the accessibility snapshot to find the right locators. Then write a Playwright test in `demo-app/tests/delete-todo.spec.ts` that covers deleting a todo. Use the existing fixtures in `tests/fixtures.ts`. Run the tests and confirm it passes.

### Expected Agent Behavior

1. Agent uses Playwright MCP to `navigate` to the app
2. Agent interacts with the live page — signs up, adds a todo
3. Agent reads the **accessibility snapshot** and sees real roles/labels (e.g., `button "Delete \"Temporary todo\""`)
4. Agent writes `tests/delete-todo.spec.ts` using locators **discovered from the live page**
5. Agent runs `npx playwright test delete-todo` — passes

### What to Narrate

- "This time the agent browsed the real app and got an accessibility snapshot"
- "The locators came from what the browser actually rendered — not from reading JSX"
- "On a real codebase with computed labels or third-party UI, this is the difference between guessing and knowing"

## Cleanup

```bash
rm demo-app/tests/delete-todo.spec.ts
```

## Fallback

If either part stalls, copy `expected-test.ts` from this folder into `demo-app/tests/delete-todo.spec.ts` and run `npx playwright test delete-todo`.
