# Demo 2: Agent Fixes a Failing Test

**Duration:** ~4 minutes
**Tool:** `npx playwright test` + `npx playwright trace` — both ship with the project
**Slide:** 7, half 2

## Goal

An agent encounters a failing konami-code test, reads the trace from the terminal, finds the Left/Right key swap bug, fixes the application code, and reruns green.

## Takeaway for the Audience

The Playwright team got us covered. With 1.59, `npx playwright trace` lets agents read the actual browser state straight from the terminal — no guessing, no GUI, no extra installs. It just works.

## Pre-Demo Checklist

```bash
cd demo-app

# 1. Confirm everything is green on main
npx playwright test

# 2. Inject the bug (swaps ArrowLeft/ArrowRight in the konami listener)
git checkout demo/broken-konami -- src/components/konami-listener.tsx

# 3. Verify the konami test now fails
npx playwright test konami-egg
```

// this demo is contrived. it assumes the agent does not have access to the diff? if it had access to the diff, it'd never ever, ever, ever bother looking at the trace. at least not for this particular diff.
// maybe it's okay that it's contrived though. it's hard to find a reason why npx playwright trace helps, unless there's a QA/eng split in the org. without the split, failures should be so apparent from error message and diff that you don't need to look at the trace.
// flakiness and races, that's where trace helps!

## Prompt

Paste into Claude Code, Gemini CLI, or any terminal agent:

> Run the Playwright tests in `./demo-app`. One test is failing. Use `npx playwright trace open` and `npx playwright trace actions` to analyze the trace from the failed test, find the root cause, fix the bug in the application code, and rerun until all tests pass.

## Expected Agent Behavior

1. Agent runs `npx playwright test` — sees `konami-egg` test fail, output shows the trace path
2. Agent runs `npx playwright trace open test-results/*/trace.zip` — loads the trace
3. Agent runs `npx playwright trace actions` — sees the key sequence (actions 15-24: ArrowLeft, ArrowRight, ArrowLeft, ArrowRight) and the failed `toBeVisible` assertion
4. Agent reads `src/components/konami-listener.tsx` — spots that `ArrowRight` and `ArrowLeft` are swapped at positions 5 and 8
5. Agent fixes the sequence back to `Left, Right, Left, Right`
6. Agent reruns `npx playwright test` — all green

## What to Narrate

"The Playwright team shipped `npx playwright trace` in 1.59 — and it changes the game for coding agents."

Before 1.59, agents had to guess from error output and re-run tests blind. Now they read the real browser state in one command. The trace file on disk is a receipt humans can review. And `trace: "retain-on-failure"` in the config makes it automatic — zero setup.

## Before/After 1.59

| | Pre-1.59 | Post-1.59 (`npx playwright trace`) |
|---|---|---|
| Agent's first move | Re-read source, guess from error message | `npx playwright trace` — see actual browser actions | // haha, this is what I meant. why would you have to see actual browser actions if you could read test + impl source?
| Typical iterations | 5-10 re-runs with console.log | 3-4 targeted commands |
| Tokens consumed | 10k-30k | 5k-13k |
| Evidence left behind | None (guesswork in chat log) | Trace file on disk |
| Risk of wrong fix | High — agent may "fix" the test instead | Low — agent sees the real sequence mismatch |

// taking back what I said above: trace *is* useful if there's an external system involved that can only be examined at runtime, something like an external API. maybe you should form your demo around that.

## Cleanup

```bash
git checkout main -- demo-app/src/components/konami-listener.tsx
```

## Fallback

If the agent stalls, run the trace commands manually and narrate:

```bash
npx playwright trace open test-results/*/trace.zip
npx playwright trace actions
```

Point at actions 15-24 in the output — the audience can see the key sequence `Left, Right, Left, Right` doesn't match the classic Konami code (`Left, Right, Left, Right` at positions 5-8). Then fix `konami-listener.tsx` by hand and rerun.
