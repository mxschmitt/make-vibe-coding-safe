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
Hi — I'm Max. Fifteen minutes, one demo, one argument: vibe coding is fast to create and hard to trust, and the fix is a tiny Playwright suite an agent can run. Let's go.
-->

---
layout: default
---

# About me

<div class="mt-6 grid grid-cols-[auto_1fr_1fr] gap-10 items-start">

<div class="flex-shrink-0">
  <img
    src="/max.jpg"
    alt="Max Schmitt"
    class="rounded-xl"
    style="width: 240px; aspect-ratio: 4/3; object-fit: cover; border: 2px solid rgba(122, 162, 247, 0.8);"
  />
</div>

<div>

### Max Schmitt
<div class="text-base opacity-75 mt-1">Member of Technical Staff · Amazon AGI</div>

<div class="mt-5 text-sm leading-relaxed">
Building AI agents for browser use — <strong>Amazon Nova Act</strong>.

<div class="mt-3">
Previously, 5 years as a core contributor to <strong>Microsoft Playwright</strong> — Python, .NET, Go, core framework.
</div>

<div class="mt-3 opacity-60">San Francisco · max.sh · @mxschmitt</div>
</div>

</div>

<div class="text-sm">

<div class="text-xs uppercase tracking-wider opacity-50 mb-3">Open source I've worked on</div>

<div class="space-y-2">
  <div><strong>Playwright</strong> — 87.6k★</div>
  <div><strong>playwright-python</strong> — 14.6k★</div>
  <div><strong>playwright-go</strong> — 3.3k★</div>
  <div><strong>playwright-dotnet</strong> — 2.9k★</div>
  <div><strong>action-tmate</strong> — 3.5k★</div>
</div>

</div>

</div>

<!--
(0:30) Twenty-second intro. I'm Max. Worked on Playwright at Microsoft for five years, now at Amazon AGI on Nova Act — building AI agents that drive browsers. Which means I have opinions on both halves of this talk. Moving on.
-->

---
layout: center
class: text-center
---

# The vibe-coded feature works.

<div class="mt-6 text-2xl opacity-75">Until the next iteration breaks it.</div>

<div class="mt-10 flex justify-center">
  <img
    src="https://media.giphy.com/media/z9AUvhAEiXOqA/giphy.gif"
    alt="This is fine"
    referrerpolicy="no-referrer"
    class="rounded-lg"
    style="max-height: 260px;"
  />
</div>

<!--
(0:30) Every vibe-coded feature has a demo moment: it works once, on the happy path, while you're watching. The bug is in the second iteration — the one the agent made after you walked away. Manual clicking doesn't catch that. Code review doesn't catch that. Generic unit tests don't catch that. End-to-end browser tests do.
-->

---
layout: two-cols-header
---

# Agents already do most of this

::left::

### Table stakes in 2026
- Run commands in a shell
- Read and write files
- Iterate on a dev server
- Parse a stack trace

<div class="mt-3 text-xs opacity-60">Claude Code · Codex · Cursor · Cline</div>

::right::

### What Playwright uniquely gives
- **Browser state** the agent can query by role and text
- **Deterministic test commands** to run on every iteration
- **Traces, screenshots, videos** a human can review in seconds

<!--
(1:30) Don't start this slide by saying "agents can't do X" — they can. The real point is that shell access plus file I/O aren't enough to prove a browser-rendered UI is correct. Playwright fills that specific gap: it turns the browser into something the agent can see and something a human can audit in a few seconds of scrubbing a trace. That's the lane.
-->

---
layout: default
---

# How we got here — five eras, 60 seconds

<div class="mt-12 relative">
  <div class="absolute left-0 right-0 top-4 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"></div>
  <div class="grid grid-cols-5 gap-4 relative">
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">pre-2024</div>
      <div class="mt-2 text-sm font-medium">Browser automation</div>
      <div class="mt-1 text-xs opacity-70">Selenium · Puppeteer · Playwright</div>
    </div>
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-indigo-400 ring-4 ring-indigo-400/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">2024 Q4</div>
      <div class="mt-2 text-sm font-medium">Agents get browsers</div>
      <div class="mt-1 text-xs opacity-70">Computer Use · MCP announced</div>
    </div>
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-violet-500 ring-4 ring-violet-500/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">2025 H1</div>
      <div class="mt-2 text-sm font-medium">Everyone ships</div>
      <div class="mt-1 text-xs opacity-70">Playwright MCP · Operator · Nova Act</div>
    </div>
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-fuchsia-500 ring-4 ring-fuchsia-500/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">2025 Q4</div>
      <div class="mt-2 text-sm font-medium">Tools learn to fit in context</div>
      <div class="mt-1 text-xs opacity-70">Test Agents · Skills · code-exec-over-MCP</div>
    </div>
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-fuchsia-400 ring-4 ring-fuchsia-400/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">today</div>
      <div class="mt-2 text-sm font-medium">This talk's moment</div>
      <div class="mt-1 text-xs opacity-70">Playwright 1.59 · Chrome DevTools MCP · agent-browser</div>
    </div>
  </div>
</div>

<!--
(3:00) Eighteen months ago browser tools for coding agents didn't exist. Today they're converging. Five eras, one breath: browser automation was already a thing before agents mattered; then Computer Use and MCP taught agents to see a page; then every vendor shipped their own take; then Anthropic shipped Skills and code-execution-over-MCP so MCP servers stopped blowing up the context window; and here we are. The tooling is ready. Question is what you do with it.
-->

---
layout: center
class: text-center
---

# Demo — 7 minutes, two halves

<div class="mt-10 grid grid-cols-2 gap-8">

<div class="p-6 rounded-lg border border-indigo-500/30 bg-indigo-900/10">
  <div class="text-xs uppercase tracking-wider opacity-60 mb-2">① Authoring · ~3 min</div>
  <div class="text-lg font-medium">Agent writes a test</div>
  <div class="mt-3 text-sm opacity-80">
    New feature request → agent writes the Playwright spec → runs it → green.<br/>
    <span class="opacity-60">Claude Code · Playwright CLI + skills.</span>
  </div>
</div>

<div class="p-6 rounded-lg border border-fuchsia-500/30 bg-fuchsia-900/10">
  <div class="text-xs uppercase tracking-wider opacity-60 mb-2">② Debug loop · ~4 min</div>
  <div class="text-lg font-medium">Agent fixes a failing test</div>
  <div class="mt-3 text-sm opacity-80">
    Existing test fails on <code>demo/broken-konami</code> → agent reads the trace → finds the bug → reruns. Green.<br/>
    <span class="opacity-60">The agent inspects the trace viewer — not re-reads the source.</span>
  </div>
</div>

</div>

<!--
(4:00) Seven minutes, split 3/4. Keep the beats as cues, not a script.

Half ①  Authoring (~3 min)
  1. Show demo-app running. Pick one missing journey (e.g. "log out from the landing page," or "can't sign up with a duplicate email").
  2. Prompt Claude Code: "add a Playwright test for <journey>, then run it."
  3. Let the agent navigate with the CLI, write the spec file, run it. Highlight: the CLI puts snapshot/screenshot on disk; agent decides what to read.
  4. Green. Point at the committed spec. "That's the artifact."

Half ②  Debug loop (~4 min)
  1. git checkout demo/broken-konami. Konami test now fails.
  2. Prompt: "run the Playwright tests, find what's broken, fix it."
  3. Let it run. Konami test fails. Agent opens the trace (playwright show-trace) — emphasize: it's reading the failure, not the source.
  4. Agent spots the L/R swap in konami-listener.tsx, fixes it.
  5. Rerun. Green. Show the trace-viewer timeline as the receipt.
  6. Land: "agent wasn't guessing. Saw the real browser, saw the real failure, left receipts."

If you run long, cut ①'s rerun or ②'s final green — the fix moment is the one beat that must land.
-->

---
layout: default
---

# Browser tools for coding agents · 2026

<div class="mt-8 text-sm">

| Tool | Best for | GitHub stars |
| --- | --- | ---: |
| **Playwright CLI** + skills | Coding agents in a terminal | 9.6k |
| **Playwright MCP** | Editor agents, accessibility snapshots | 31.7k |
| **Chrome DevTools MCP** | Chrome-specific perf / console / network | 37.6k |
| **agent-browser** (Vercel Labs) | Designed for AI agents · compact text output | 30.9k |

</div>

<div class="mt-8 text-center text-base opacity-90">
Tools change every few months.<br/>
The test suite lives in your repo for years.<br/>
<span class="opacity-70">Pick the tool that fits today — the tests are what you keep.</span>
</div>

<!--
(11:00) One-minute overview of the landscape. Chrome DevTools MCP leads on raw stars. Playwright MCP leads in vendor recommendations for test authoring. agent-browser is the youngest (January 2026 public) and pitches itself explicitly at AI agents — compact text output, accessibility-tree refs, native Rust. But — don't get lost in the tool war. These tools are ~1 year old; the Playwright spec file in your repo will still be running a year from now. That's what you keep.
-->

---
layout: default
---

# Adoption — last 12 months

<div class="mt-4 flex justify-center">
  <img
    src="/npmtrends.png"
    alt="npm download trends: Playwright MCP, Playwright CLI, Chrome DevTools MCP, agent-browser"
    class="rounded-lg"
    style="max-height: 420px;"
  />
</div>

<div class="mt-3 text-xs opacity-60 text-center">
  <a href="https://npmtrends.com/@playwright/mcp-vs-@playwright/cli-vs-chrome-devtools-mcp-vs-agent-browser">
    npmtrends.com · @playwright/mcp · @playwright/cli · chrome-devtools-mcp · agent-browser
  </a>
</div>

<!--
(11:45) Category is converging. Three of the four are on steep ramps; agent-browser shows up late because it only went public in January. Don't read numbers to the audience — point at the shape.
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
<div>✔ Screenshots, traces, videos = reviewable receipts.</div>
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
