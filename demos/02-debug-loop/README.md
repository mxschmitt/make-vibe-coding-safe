# Demo 2: Agent Fixes a Failing Test

**Duration:** ~4 minutes
**Tool:** `npx playwright test` + `npx playwright trace` — both ship with the project
**Slide:** 7, half 2

## Goal

An agent encounters a failing critical-path test where optimistic UI masks a silent server-side failure. The component was refactored to use `useOptimistic` from React 19 — but during the refactor, `toggleTodo(userId, id)` became `toggleTodo(id, userId)`. Both are strings, SQLite matches 0 rows, no error thrown. The optimistic UI shows the toggle instantly, but the DB never changes. Only the trace reveals the divergence between what the UI showed and what actually persisted after navigation.

## Takeaway for the Audience

Traces shine when runtime state diverges from what the code suggests. If the bug is obvious from a diff, you don't need a trace. When the diff looks like a valid refactor but the server silently does nothing — that's where `npx playwright trace` earns its keep.

## Pre-Demo Checklist

```bash
cd demo-app

# 1. Confirm everything is green on main
npx playwright test

# 2. Inject the bug (swaps toggleTodo params + adds optimistic UI that masks it)
git checkout demo/stale-toggle -- src/app/actions.ts src/app/app/todo-list.tsx

# 3. Verify the critical-path test now fails
npx playwright test auth-and-todos
```

## Prompt

Paste into Claude Code, Gemini CLI, or any terminal agent:

> Run the Playwright tests in `./demo-app`. One test is failing. Use `npx playwright trace` to analyze the trace from the failed test, find the root cause, fix the bug in the application code, and rerun until all tests pass.

## Expected Agent Behavior

1. Agent runs `npx playwright test` — sees `auth-and-todos` test fail at the "Active" filter step (expects 4 items, gets 5), output shows the trace path
2. Agent runs `npx playwright trace open test-results/*/trace.zip` — loads the trace
3. Agent reads the trace timeline:
   - Toggle button clicked on "Write more tests" -> server action POST returned 200
   - DOM snapshot shows `data-completed="true"` (optimistic update fired)
   - Click "Active" filter tab -> page navigates to `/app?filter=active`
   - DOM snapshot shows **5 items** — the todo is still active, toggle never persisted
   - Assertion `expect(items).toHaveCount(4)` fails
4. Agent recognizes: the optimistic UI showed success, but the server never toggled the row
5. Agent reads `src/app/actions.ts` — sees `toggleTodo(id, userId)` and cross-references with `src/lib/todos.ts` which expects `toggleTodo(userId, id)` — the params are swapped
6. Agent fixes the call to `toggleTodo(userId, id)`
7. Agent reruns `npx playwright test` — all green

## What to Narrate

"The diff looked like a valid refactor — someone added optimistic UI with `useOptimistic` from React 19. The code compiles, the toggle animates instantly, the server action returns 200. But the trace told a different story."

Before 1.59, agents had to guess from error output and re-run tests blind. Now they read the real browser state in one command. The trace reveals what happened *at runtime* — not what the code *suggests* should happen.

## Before/After 1.59

| | Pre-1.59 | Post-1.59 (`npx playwright trace`) |
|---|---|---|
| Agent's first move | Re-read source, guess from error message | `npx playwright trace` — see DOM state at each step |
| Typical iterations | 5-10 re-runs with console.log | 3-4 targeted commands |
| Tokens consumed | 10k-30k | 5k-13k |
| Evidence left behind | None (guesswork in chat log) | Trace file on disk |
| Risk of wrong fix | High — agent may "fix" the test instead | Low — agent sees the runtime divergence |

## Cleanup

```bash
git checkout main -- demo-app/src/app/actions.ts demo-app/src/app/app/todo-list.tsx
```

## Fallback

If the agent stalls, run the trace commands manually and narrate:

```bash
npx playwright trace open test-results/*/trace.zip
npx playwright trace actions
```

Point at the sequence: toggle action -> optimistic flip -> navigation -> server disagrees. Then fix `actions.ts` by swapping `toggleTodo(id, userId)` back to `toggleTodo(userId, id)` and rerun.
