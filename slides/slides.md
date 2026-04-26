---
theme: default
title: Make Vibe Coding Safe
info: |
  ## Make Vibe Coding Safe: How to Test with Playwright?
  Max Schmitt · AI Council SF 2026 · Lightning Talk · 15 min.
class: text-center
transition: fade
mdc: true
colorSchema: dark
fonts:
  sans: Inter
  mono: JetBrains Mono
---

# Make Vibe Coding Safe

How to Test with Playwright

<div class="pt-12 text-lg opacity-75">
Max Schmitt · AI Council SF 2026 · May 13
</div>

<!--
Hi — I'm Max. Ex-Playwright at Microsoft for five years, now at Amazon AGI Labs on Nova Act. Fifteen minutes, one demo, one argument: vibe coding is fast to create and hard to trust, and the fix is a tiny Playwright suite an agent can run. Let's go.
-->

---
layout: center
class: text-center
---

# The demo works.

<div class="mt-8 text-2xl opacity-75">Until the next iteration breaks it.</div>

<!--
(0:30) Every vibe-coded feature has a demo moment: it works once, on the happy path, while you're watching. The bug is in the second iteration — the one the agent made after you walked away. Manual clicking doesn't catch that. Code review doesn't catch that. Generic unit tests don't catch that. End-to-end browser tests do.
-->

---
layout: two-cols-header
---

# What we have today

::left::

### The agent can build
- writes code
- edits files
- runs a dev server
- reads a stack trace

::right::

### What's missing
- **browser state the agent can see**
- **tests the agent can run**
- **failure receipts a human can review fast**

<!--
(1:30) The gap isn't the model or the editor — it's the feedback loop. Agents can already ship features. What they can't yet do confidently is prove the feature works end-to-end and prove it still works on iteration two. That's what we're closing today.
-->

---
layout: default
---

# How we got here — a 60-second timeline

<div class="text-sm mt-6 grid grid-cols-2 gap-x-10 gap-y-2">

<div class="opacity-60">2020-05</div><div>Playwright 1.0 — cross-browser test runner</div>
<div class="opacity-60">2022-09</div><div>natbot — first "drive a browser with GPT-3"</div>
<div class="opacity-60">2024-10</div><div>Anthropic Computer Use</div>
<div class="opacity-60">2024-11</div><div>Model Context Protocol announced</div>
<div class="opacity-60">2025-01</div><div>OpenAI Operator · Amazon Nova Act (Mar)</div>
<div class="opacity-60">2025-03</div><div><strong>Playwright MCP</strong> first release</div>
<div class="opacity-60">2025-09</div><div><strong>Chrome DevTools MCP</strong> first release</div>
<div class="opacity-60">2025-10</div><div>Playwright <strong>Test Agents</strong> (planner / generator / healer)</div>
<div class="opacity-60">2025-10</div><div>Anthropic <strong>Skills</strong> — progressive tool loading</div>
<div class="opacity-60">2025-11</div><div>Anthropic "Code execution with MCP" — 150k → 2k tokens</div>
<div class="opacity-60">2026-01</div><div>agent-browser (Vercel Labs) first release</div>
<div class="opacity-60">2026-04</div><div>Playwright 1.59 — <code>browser.bind()</code>, <code>--debug=cli</code>, screencast chapters</div>

</div>

<!--
(3:00) Eighteen months ago browser tools for coding agents didn't exist. Today they're converging. Three MCP-based tools — Playwright MCP, Chrome DevTools MCP, agent-browser — plus Anthropic Skills and code-execution-over-MCP to stop context from exploding. The tooling is ready. The question is what to do with it.
-->

---
layout: center
class: text-center
---

# Demo

<div class="mt-6 text-xl opacity-75">
demo-app: Next.js todos.<br/>
Tests pass on <code>main</code>.<br/>
Agent gets broken code on <code>demo/broken-konami</code>.
</div>

<!--
(4:00) Seven minutes. This is the talk. Before I start: watch for the agent reading the trace, not guessing at the bug. That's the whole difference.

Rough flow — keep these as beats, not a script:
  1. Show demo-app running. Sign up. Show the Konami easter egg on main — banner appears. "This is what the feature should do."
  2. git checkout demo/broken-konami. Note I haven't told the agent what's broken.
  3. In Claude Code: "run the Playwright tests, find what's broken, fix it." Let it go.
  4. CLI runs. Konami test fails. Agent reads the failure, opens the trace (playwright show-trace), inspects key sequence.
  5. Agent reads konami-listener.tsx, spots the L/R swap, fixes it.
  6. Rerun. Green. Screenshot or screencast in hand.
  7. Land the point: the agent wasn't guessing. It saw the real browser, saw the real failure, left receipts.

Budget: leave 30 seconds for narration between steps. If the demo drifts long, cut the rerun — the fix-and-run is the beat that matters.
-->

---
layout: default
---

# Why CLI, not MCP — same task, same agent

<div class="grid grid-cols-2 gap-8 mt-6">

<div class="p-6 rounded-lg bg-red-900/20 border border-red-500/30">
  <div class="text-sm opacity-60 mb-2">Playwright MCP</div>
  <div class="text-6xl font-bold text-red-400">114k</div>
  <div class="text-sm mt-2 opacity-75">tokens</div>
</div>

<div class="p-6 rounded-lg bg-green-900/20 border border-green-500/30">
  <div class="text-sm opacity-60 mb-2">Playwright CLI + skills</div>
  <div class="text-6xl font-bold text-green-400">26.8k</div>
  <div class="text-sm mt-2 opacity-75">tokens</div>
</div>

</div>

<div class="mt-10 text-sm opacity-75 text-center">
Open playwright.dev · search "locators" · check 4 language docs · screenshot each.
</div>

<!--
(11:00) Playwright team's own number. Same prompt. Same agent. ~4.25× cheaper with CLI. The why matters more than the number — next slide.
-->

---
layout: default
---

# The reason: who holds the state

<div class="grid grid-cols-2 gap-10 mt-8 text-base">

<div>

### MCP
LLM asks server to navigate.<br/>
**Server returns accessibility snapshot to the LLM.**

LLM asks for a screenshot.<br/>
**Server returns image bytes to the LLM.**

Every intermediate byte hits context.

</div>

<div>

### CLI
Agent runs <code>playwright-cli goto …</code><br/>
**CLI writes snapshot to a file.**

Agent runs <code>playwright-cli screenshot …</code><br/>
**CLI writes image to a file.**

Coding agent decides what to read.

</div>

</div>

<div class="mt-10 text-center text-lg opacity-90">
MCP routes state <em>through</em> the LLM. CLI routes state <em>around</em> it.
</div>

<!--
(11:45) This is the whole argument. MCP's contract is "LLM orchestrates," so everything passes through the LLM. CLI's contract is "coding agent orchestrates," so state lives on disk and only the decisions hit context. Use MCP when the LLM *is* the agent. Use CLI when you already have a coding agent.
-->

---
layout: default
---

# The MCP context problem got partially fixed

<div class="mt-6 space-y-3 text-sm">

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-06-18</div>
<div>MCP spec: <strong>resource links</strong> in tool results — URIs instead of inlined blobs.</div>
</div>

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-10-16</div>
<div>Anthropic <strong>Skills</strong>: three-level progressive disclosure (~100 tokens metadata, full body on invoke).</div>
</div>

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-11-04</div>
<div>Anthropic "Code execution with MCP": <strong>150k → 2k tokens</strong> by calling MCP from code, not schema-inlining.</div>
</div>

</div>

<div class="mt-10 p-4 bg-zinc-800/50 rounded text-center">
Anthropic did most of the work. The MCP spec helped. Neither change is the default — you still have to opt in.
</div>

<!--
(12:15) Worth calling out because you've probably heard "MCP blows up context." That was true. Between Oct and Nov 2025, it stopped being the inevitable default — if you know to reach for Skills or code-execution-over-MCP. But by default, naïve MCP use still inflates context, which is why the CLI number on the previous slide is so stark.
-->

---
layout: default
---

# Keep the suite small. Keep it green.

<div class="mt-10 space-y-6 text-lg">

<div>✔ One spec per critical journey. Three, not thirty.</div>
<div>✔ Run on every commit. Trace on failure.</div>
<div>✔ Treat flake as a bug — <a href="https://flakiness.io/" class="underline decoration-dotted">flakiness.io</a> for CI health.</div>
<div>✔ Screenshots, traces, screencasts = reviewable receipts.</div>
<div>✔ The agent doesn't own the test suite. You do.</div>

</div>

<!--
(13:15) Shoutout to flakiness.io — friends of mine, worth a look if your CI suite is drifting. The broader point: a small, high-signal suite is sustainable; a sprawling one becomes its own liability. Three specs in this demo-app. That's the target.
-->

---
layout: center
class: text-center
---

# Tests are the durable artifact.

<div class="mt-8 text-2xl opacity-75">
Agents are how you get there.<br/>
Browser tools are how the agent sees.
</div>

<div class="mt-16 text-sm opacity-50">
max.sh · @mxschmitt · aicouncil.com/talks26
</div>

<!--
(14:00) One minute left. Takeaway: the thing you keep is the test suite. Everything else — the agent, the browser tool, the CLI vs MCP choice — changes. A test in your repo will still be running in a year.

Thanks. Happy to take questions.
-->
