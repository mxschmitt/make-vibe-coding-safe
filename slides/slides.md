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

<div class="mt-[8vh] grid grid-cols-[auto_1fr_1fr] gap-10 items-start">

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

<div class="mt-4 flex items-center gap-4 text-sm">
  <a href="https://max.sh" target="_blank" class="flex items-center gap-1.5 opacity-70 hover:opacity-100 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    max.sh
  </a>
  <a href="https://x.com/mxschmitt" target="_blank" class="flex items-center gap-1.5 opacity-70 hover:opacity-100 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    @mxschmitt
  </a>
  <a href="https://www.linkedin.com/in/max-schmitt" target="_blank" class="flex items-center gap-1.5 opacity-70 hover:opacity-100 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    LinkedIn
  </a>
</div>
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
class: pt-[8vh]
---

# What agents already do — and the gap

::left::

### Works out of the box
- **Codebase context** — reads your project, edits across files
- **Shell access** — runs builds, starts dev servers, installs deps
- **Error loop** — reads a stack trace, fixes, retries until it compiles
- **Git workflow** — commits, branches, opens PRs

<div class="mt-3 text-xs opacity-60">Claude Code · Codex · Cursor · …</div>

::right::

<div class="pl-4 border-l-2 border-indigo-500/30">

### Add a browser to the loop
- **Browser state** — the agent sees the rendered page, not just source code
- **Instant verification** — Vite/Next.js hot-reloads, agent checks the result in seconds
- **Debug browser-only bugs** — React races, hydration mismatches, layout shifts
- **Playwright CLI / MCP** — traces, screenshots, a11y locators for stable selectors

</div>

<!--
(1:30) Don't start by saying "agents can't do X" — they can do everything on the left. The point is that compiling is not the same as correct. When the agent has a browser, it sees what the user sees: hot-reload changes verified instantly, React races caught live, layout shifts visible. Playwright CLI and MCP are the bridges — traces, screenshots, a11y locators that survive refactors. Two audiences, one artifact.
-->

---
layout: center
---

# How we got here

<div class="mt-8 relative">
  <div class="absolute left-0 right-0 top-2 h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"></div>
  <div class="grid grid-cols-4 gap-6 relative">
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
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">2025</div>
      <div class="mt-2 text-sm font-medium">Everyone ships</div>
      <div class="mt-1 text-xs opacity-70">Playwright MCP · Operator · Nova Act · Test Agents</div>
    </div>
    <div class="text-center">
      <div class="mx-auto h-4 w-4 rounded-full bg-fuchsia-500 ring-4 ring-fuchsia-500/20"></div>
      <div class="mt-3 text-xs opacity-60 uppercase tracking-wider">2026</div>
      <div class="mt-2 text-sm font-medium">Coding agents can see the browser</div>
      <div class="mt-1 text-xs opacity-70">Playwright CLI · Chrome DevTools MCP · agent-browser</div>
    </div>
  </div>
</div>

<!--
(3:00) Sixty-second flyover. Browser automation existed long before agents — Selenium, Puppeteer, Playwright. Late 2024, agents got access: Computer Use showed an LLM driving a desktop, MCP gave tools a protocol. 2025, everyone shipped their version — Playwright MCP, Operator, Nova Act, Test Agents. Now in 2026, the tooling works: Playwright CLI, Chrome DevTools MCP, agent-browser. The agent can see the browser. Let me show you.
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
    Existing test fails on <code>demo/stale-toggle</code> → agent reads the trace → sees optimistic UI lied (toggle never persisted) → fixes swapped params → green.<br/>
    <span class="opacity-60">The diff looks like a valid React 19 refactor — only the trace reveals the silent failure.</span>
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
  1. git checkout demo/stale-toggle -- src/app/actions.ts src/app/app/todo-list.tsx. The critical-path test now fails.
  2. Prompt: "run the Playwright tests, find what's broken, fix it."
  3. Let it run. auth-and-todos test fails at "Active" filter (expects 4, gets 5). Agent opens the trace.
  4. Trace shows: toggle button clicked, optimistic UI flipped data-completed to "true", but after navigating to Active tab all 5 items are still there. The toggle never persisted — params were swapped during the useOptimistic refactor.
  5. Agent reads actions.ts + todos.ts, spots toggleTodo(id, userId) should be toggleTodo(userId, id). Fixes. Reruns. Green.
  6. Land: "The diff looked like a valid refactor. The trace showed the toggle did nothing."

If you run long, cut ①'s rerun or ②'s final green — the fix moment is the one beat that must land.
-->

---
layout: center
class: text-center
---

# What you just saw

<div class="mt-10 grid grid-cols-2 gap-8">

<div class="p-6 rounded-lg border border-indigo-500/30 bg-indigo-900/10">
  <div class="text-xs uppercase tracking-wider opacity-60 mb-2">① Authoring</div>
  <div class="text-lg font-medium mt-3">The agent authored a test in under a minute.</div>
  <div class="mt-4 text-sm opacity-80">
    The spec file stays in your repo and runs on every commit.<br/>
    That's the artifact — not the chat log.
  </div>
</div>

<div class="p-6 rounded-lg border border-fuchsia-500/30 bg-fuchsia-900/10">
  <div class="text-xs uppercase tracking-wider opacity-60 mb-2">② Debug loop</div>
  <div class="text-lg font-medium mt-3">The agent read the real failure — not a stack trace.</div>
  <div class="mt-4 text-sm opacity-80">
    <code>npx playwright trace</code> — new in 1.59.<br/>
    New in Playwright v1.59.
  </div>
</div>

</div>

<!--
(11:00) Twenty seconds max. Let the demo breathe. Left panel: the test file is what you keep. Right panel: 1.59 made the trace CLI possible — that's what let the agent read the failure instead of guessing. Don't linger; move to the tooling slide.
-->

---
layout: default
---

# Browser tools for coding agents · 2026

<div class="mt-[6vh] text-sm">

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
layout: center
---

# This video went viral for a reason

<div class="grid grid-cols-[1fr_1.2fr] gap-6 mt-4 items-center">

<div>
  <a href="https://www.youtube.com/watch?v=Be0ceKN81S8" target="_blank">
    <img src="/playwright-cli-vs-mcp-video.png" class="rounded-lg shadow-xl" alt="Playwright CLI vs MCP — 100K views" />
  </a>
  <div class="text-xs opacity-50 mt-2 text-center">100K views · Playwright channel</div>
</div>

<div class="space-y-4">
  <div class="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
    <div class="text-sm opacity-60 mb-1">Playwright MCP</div>
    <div class="text-5xl font-bold text-red-400">114k <span class="text-lg font-normal opacity-75">tokens</span></div>
  </div>
  <div class="p-4 rounded-lg bg-green-900/20 border border-green-500/30">
    <div class="text-sm opacity-60 mb-1">Playwright CLI + skills</div>
    <div class="text-5xl font-bold text-green-400">26.8k <span class="text-lg font-normal opacity-75">tokens</span></div>
  </div>
  <div class="text-sm opacity-60">
    MCP routes context <em>through</em> the LLM. CLI routes context <em>around</em> it.
  </div>
</div>

</div>

<!--
(11:00) The Playwright team posted this comparison in mid-2025. Same prompt, same agent, same task. CLI used 4.25× fewer tokens. It went viral because it validated what everyone already felt — MCP servers blow up the context window. MCP's contract is "LLM orchestrates," so every accessibility snapshot and screenshot passes through context. CLI puts state on disk and the coding agent decides what to read. That was true. But that was 2025.
-->

---
layout: default
---

# Then Anthropic fixed it

<div class="mt-[8vh] space-y-3 text-sm">

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-06-18</div>
<div>MCP spec: <strong>resource links</strong> in tool results — URIs instead of inlined blobs.</div>
</div>

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-10-16</div>
<div>Anthropic <strong>Skills</strong>: progressive disclosure — ~100 tokens metadata, full body on invoke.</div>
</div>

<div class="flex gap-4 items-baseline">
<div class="font-mono opacity-60 w-28">2025-11-04</div>
<div>Anthropic "Code execution with MCP": <strong>150k → 2k tokens</strong> by calling MCP from code.</div>
</div>

</div>

<div class="mt-10 p-4 bg-zinc-800/50 rounded text-center">
Anthropic did most of the work. The SDK carries the fix — no opt-in needed today.
</div>

<!--
(11:30) Three fixes in five months. The MCP spec added resource links so tools return a URI instead of a blob. Anthropic shipped Skills so tool definitions cost about 100 tokens instead of thousands. Then code-execution-over-MCP let the agent write code that calls MCP servers — only the output enters context. Key point: Anthropic did most of the heavy lifting, not the MCP spec. And these patterns are now the default in the Claude Agent SDK.
-->

---
layout: default
---

# We re-ran the benchmark. MCP won.

<div class="mt-[4vh]">
<table class="w-full text-center">
<thead>
<tr class="text-sm opacity-60">
  <th class="text-left py-2">Metric</th>
  <th class="py-2">MCP<br/><span class="text-xs opacity-50">Sep 2025 SDK</span></th>
  <th class="py-2">MCP<br/><span class="text-xs opacity-50">May 2026 SDK</span></th>
  <th class="py-2">CLI + skills<br/><span class="text-xs opacity-50">May 2026 SDK</span></th>
</tr>
</thead>
<tbody class="text-lg">
<tr>
  <td class="text-left py-2">Cost</td>
  <td class="py-2 text-red-400 font-bold">$0.80</td>
  <td class="py-2 text-green-400 font-bold">$0.36</td>
  <td class="py-2 text-yellow-400 font-bold">$0.44</td>
</tr>
<tr>
  <td class="text-left py-2">Turns</td>
  <td class="py-2">53</td>
  <td class="py-2">18.7</td>
  <td class="py-2">33.0</td>
</tr>
<tr>
  <td class="text-left py-2">Context tokens</td>
  <td class="py-2">1,377k</td>
  <td class="py-2">524k</td>
  <td class="py-2">976k</td>
</tr>
<tr>
  <td class="text-left py-2">Duration</td>
  <td class="py-2">129s</td>
  <td class="py-2">73s</td>
  <td class="py-2">113s</td>
</tr>
</tbody>
</table>
</div>

<div class="mt-6 text-sm opacity-60 text-center">
Same task as the viral video. Claude Agent SDK, Sonnet, 3 runs each. This is a cost benchmark (eval), not a quality eval.
</div>

<!--
(12:00) Same task as the Playwright team video. We ran it on the old Claude Code SDK from September 2025 — before Skills, before code-execution-with-MCP. Old MCP cost $0.80 per run and needed 53 turns. Current MCP costs $0.36 in 19 turns. CLI costs $0.44 in 33 turns. MCP went from most expensive to cheapest — 2.2× cheaper than it was, and now 18% cheaper than CLI. Why cost and not raw tokens? Because cached tokens cost ~10× less than fresh ones, and MCP's improvement comes partly from better caching. Cost accounts for that; raw token counts don't. Is this an eval? It's a cost benchmark — same prompt, same model, multiple runs, quantitative output. A full eval would also grade correctness. The code is on GitHub.
-->

---
layout: two-cols-header
class: pt-[8vh]
---

# What I recommend in 2026

::left::

### Use MCP when
- The LLM is the orchestrator
- You want structured browser state (accessibility snapshots)
- You are in an editor (Cursor, VS Code, Codex)

::right::

### Use CLI + skills when
- You have a coding agent with filesystem access
- You want the agent to choose what enters context
- You are running headless in CI

<div class="mt-10 text-center col-span-2 text-lg opacity-90">
The token gap is closed. Pick based on your architecture, not on 2025 benchmarks.
</div>

<!--
(12:30) Updated recommendation. In 2025 I would have said always CLI for coding agents. In 2026 the data says MCP is token-competitive and often cheaper because it finishes in fewer turns. Use MCP when the LLM is the orchestrator — editors, chat agents, agentic loops. Use CLI when you already have a coding agent with a filesystem. The point: stop picking based on token anxiety. Pick based on who orchestrates.
-->

---
layout: default
---

# Keep the suite small. Keep it green.

<div class="mt-[6vh] space-y-6 text-lg max-w-2xl mx-auto">

<div>✔ One spec per critical journey. Three, not thirty.</div>
<div>✔ Run on every commit. Trace on failure.</div>
<div>✔ Treat flake as a bug — <a href="https://flakiness.io/" class="underline decoration-dotted">flakiness.io</a> for CI health.</div>
<div>✔ Screenshots, traces, videos = reviewable receipts.</div>
<div class="ml-6 text-sm opacity-60">
  <code>video-start</code> / <code>start-chapter</code> — agents record narrated walkthroughs, not just pass/fail.
</div>
<div>✔ The agent doesn't own the test suite. You do.</div>

</div>

<!--
(13:15) Shoutout to flakiness.io — friends of mine, worth a look if your CI suite is drifting. The broader point: a small, high-signal suite is sustainable; a sprawling one becomes its own liability. Three specs in this demo-app. That's the target.
-->

---
layout: center
class: text-center
---

# Implementation is cheap. Confidence isn't.

<div class="mt-8 text-2xl opacity-75">
Tests encode what "correct" means.<br/>
Agents are how you get there. Browser tools are how they see.
</div>

<div class="mt-16 flex justify-center items-center gap-5 text-sm">
  <a href="https://max.sh" target="_blank" class="flex items-center gap-1.5 opacity-50 hover:opacity-80 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    max.sh
  </a>
  <a href="https://x.com/mxschmitt" target="_blank" class="flex items-center gap-1.5 opacity-50 hover:opacity-80 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    @mxschmitt
  </a>
  <a href="https://www.linkedin.com/in/max-schmitt" target="_blank" class="flex items-center gap-1.5 opacity-50 hover:opacity-80 !border-none !no-underline">
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    LinkedIn
  </a>
</div>

<!--
(14:00) One minute left. Takeaway: the thing you keep is the test suite. Everything else — the agent, the browser tool, the CLI vs MCP choice — changes. A test in your repo will still be running in a year.

Thanks. Happy to take questions.
-->
