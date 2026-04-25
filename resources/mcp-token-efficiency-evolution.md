# MCP Token-Efficiency Evolution (Oct–Nov 2025)

Retrieved: 2026-04-25

Purpose: dated record of who made what change and when, so the talk can accurately answer "why don't MCP servers blow up the context window the way they used to?" Keep this separate from the Playwright-team CLI positioning in `playwright-cli-vs-mcp-token-efficiency.md` — different problem, different fix.

## TL;DR

Between Oct and Nov 2025, **Anthropic did most of the work**, not the MCP spec. Two complementary Anthropic releases — Agent Skills (2025-10-16) and "Code execution with MCP" (2025-11-04) — reframed the pattern so that tool definitions and tool outputs no longer need to sit in the LLM's context by default. The MCP spec itself contributed **resource links** in its 2025-06-18 revision; the next spec revision (2025-11-25) was not primarily about token reduction.

## 2025-10-16 — Anthropic Agent Skills

Launch: `claude.com/blog/skills` + engineering post `anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills`.

Three-level progressive disclosure (from `platform.claude.com/docs/en/agents-and-tools/agent-skills/overview`):

- **L1 metadata** (always loaded): YAML `name` + `description`, ~100 tokens per skill, resident in system prompt.
- **L2 instructions** (loaded when invoked): SKILL.md body, under 5k tokens.
- **L3 resources / scripts** (loaded as needed): bundled files read via bash; script code never enters context, only its output does. Effectively unlimited.

Anthropic explicitly frames Skills as **complementary** to MCP: "explore how Skills can complement Model Context Protocol (MCP) servers." You can register many Skills with no per-skill context penalty beyond the ~100-token description.

## 2025-11-04 — Code execution with MCP

`anthropic.com/engineering/code-execution-with-mcp`.

Headline stat: a Google Drive → Salesforce workflow dropped from **~150,000 tokens** (all MCP tool defs + intermediate results inlined into context) to **~2,000 tokens** (~98.7% reduction) by letting the agent write code that invokes MCP tools on demand instead of loading every tool schema upfront.

Architectural summary: the agent writes and runs code; the code calls MCP servers; only the code's output — not the schemas, not the intermediate tool responses — enters the LLM context. Saved code becomes reusable, which pairs naturally with Skills.

## MCP spec revisions

**2025-06-18** (`modelcontextprotocol.io/specification/2025-06-18/changelog`):

- Structured tool output (PR #371): typed results instead of free-form text blobs.
- **Resource links in tool results** (PR #603): tools can return a URI/handle instead of inlining large content. This is the one spec change in this window that directly reduces response token size.
- Also: elicitation, OAuth resource-server classification, protocol-version header.

**2025-11-25** (`modelcontextprotocol.io/specification/2025-11-25/changelog`):

- Icons metadata (SEP-973).
- Tool calling in sampling (SEP-1577).
- Experimental tasks / durable requests (SEP-1686) — reduces long-poll churn, indirect token benefit.
- JSON Schema 2020-12 default; tool-naming guidance (SEP-986).
- Not framed as a token-efficiency revision.

## Claude Code implementation details

From `code.claude.com/docs/en/skills`:

- Description always in context; full skill loads on invoke.
- Per-skill description capped at 1,536 chars.
- Dynamic context budget ~1% of the window for skill metadata, controlled by `SLASH_COMMAND_TOOL_CHAR_BUDGET` (8,000-char fallback).
- Auto-compaction re-attaches skills with per-skill 5,000-token / combined 25,000-token budgets.

## Talk Angle

- The headline number is **150k → 2k tokens (~98.7%)** — a single slide.
- Slide framing: "The MCP context problem was largely addressed in Oct–Nov 2025 — by Anthropic, not by the MCP spec." A 2026-04 audience has heard about the problem; many won't know what shipped.
- This slide sits alongside (not in place of) the Playwright CLI **114k vs 26.8k** slide. Different answers to the same diagnosis: CLI keeps state off the LLM entirely by writing to disk; Skills + code execution only load tool logic on demand.

## What This Is Not

- Not a claim that MCP is token-efficient everywhere by default. The default behavior — tool schemas in the system prompt, tool outputs routed to the LLM — still causes bloat. Skills and code-execution are **opt-in** patterns a coding agent has to adopt.
- Not a replacement for the Playwright CLI comparison. `playwright-cli-vs-mcp-token-efficiency.md` is about snapshot and screenshot payload sizes, not tool-definition count — orthogonal problem.

## Sources

- https://claude.com/blog/skills — Agent Skills launch announcement (2025-10-16).
- https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills — engineering deep-dive on Skills (2025-10-16).
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview — three-level progressive-disclosure spec with token costs.
- https://www.anthropic.com/engineering/code-execution-with-mcp — 150k → 2k token case study (2025-11-04).
- https://modelcontextprotocol.io/specification/2025-06-18/changelog — structured output + resource links.
- https://modelcontextprotocol.io/specification/2025-11-25/changelog — most recent spec revision.
- https://code.claude.com/docs/en/skills — Claude Code skill loading, description cap, auto-compaction budgets.
