# Demo: Agent Writes a Test — Without MCP vs With MCP

**Duration:** ~3 minutes total
**Slide:** 7

## Goal

Show the same task — write a Playwright test for "delete a todo" — two ways. Part A: agent infers locators from source code. Part B: agent discovers locators from Playwright MCP's accessibility snapshot of the live app. The contrast makes the value of MCP immediately visible.

## Takeaway for the Audience

Without MCP the agent reads `delete-button.tsx`, sees `<ConfirmButton label="Delete" itemName={todoTitle} ... />` from `@acme/ui`, and assumes the button name is "Delete". In reality the library renders `aria-label="Remove \"...\""` and requires a two-click confirmation. The agent can't know this without either reading into the library source (which agents typically skip for node_modules) or seeing the live page. With MCP the agent sees the real rendered accessibility tree and gets correct locators + discovers the confirm step immediately.

## Pre-Demo Checklist

```bash
npm ci
npx playwright test              # all green
ls tests/delete-todo.spec.ts     # should not exist
```

## Part A: Without MCP (~1.5 min)

### Prompt

Paste into Claude Code (no MCP configured):

> This is a Next.js todo app. There is a delete button on each todo item, but no test covers it. Write a Playwright test in `tests/delete-todo.spec.ts` that signs up a new user, adds a todo, deletes it, and verifies it is gone. Use the existing fixtures in `tests/fixtures.ts`. Then run the tests and confirm it passes.

### Expected Agent Behavior

1. Agent reads `tests/fixtures.ts`, `tests/auth-and-todos.spec.ts`, and `src/app/app/delete-button.tsx`
2. Agent sees `<ConfirmButton label="Delete" itemName={todoTitle} onConfirm={...} />` from `@acme/ui`
3. Agent infers the button is named "Delete" (the `label` prop) — uses `getByRole("button", { name: 'Delete "..."' })`
4. Agent writes `tests/delete-todo.spec.ts` — likely a single click with wrong locator
5. Agent runs `npx playwright test delete-todo` — **FAILS** (timeout: no button with name `Delete "..."`)
6. Agent reads the error, may try `getByText("Delete")` or other guesses, eventually discovers the correct labels after retries

### What to Narrate

- "The agent read the source — it sees `label='Delete'` but the library renders `aria-label='Remove ...'`"
- "This is exactly what happens with real component libraries — Radix, MUI, shadcn all compute their own accessibility labels"
- "The agent needed retries to discover both the correct label AND the confirmation step — wasted time and tokens"

### Cleanup Before Part B

```bash
rm tests/delete-todo.spec.ts
```

---

## Part B: With MCP (~1.5 min)

### Prompt

Paste into Claude Code (with Playwright MCP configured):

> This is a Next.js todo app. Use Playwright MCP to navigate to the running app, sign up a new user, add a todo, and explore the delete flow. Then write a Playwright test in `tests/delete-todo.spec.ts` that covers deleting a todo. Use the existing fixtures in `tests/fixtures.ts`. Run the tests and confirm it passes.

### Expected Agent Behavior

1. Agent uses Playwright MCP to `navigate` to the app
2. Agent interacts with the live page — signs up, adds a todo
3. Agent reads accessibility snapshot — sees `button "Remove \"Temporary todo\""` (exact label, no guessing)
4. Agent clicks it, reads new snapshot — sees `button "Confirm removal of \"Temporary todo\""` appear
5. Agent clicks confirm, todo disappears — full flow discovered from live interaction
6. Agent writes `tests/delete-todo.spec.ts` with correct locators and both clicks
7. Agent runs `npx playwright test delete-todo` — passes first time

### What to Narrate

- "The agent saw `Remove` not `Delete` in the snapshot — it never had to guess from button text"
- "It discovered the confirmation step by interacting, not by reading state machine code"
- "Correct locators + correct flow = passes first try, zero retries"

## Cleanup

```bash
rm tests/delete-todo.spec.ts
```

## Fallback

If either part stalls, copy `expected-test.ts` from this folder into `demo-app/tests/delete-todo.spec.ts` and run `npx playwright test delete-todo`.
