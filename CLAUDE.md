# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **GitHub Copilot configuration bundle** — a drop-in standards framework for full-stack development teams. It is not an executable application; it provides AI agent definitions, auto-applied instructions, reusable prompts, skill modules, and IDE configuration for VS Code and JetBrains.

## No Build/Test/Lint Commands

There is no `package.json`, `Makefile`, or build system at the root. This repo is designed to be **copied into target projects**. The one executable artifact is `.github/hooks/scripts/run-tests-on-stop.js`, which auto-detects and runs tests in target projects (Maven, Gradle, pytest, npm).

## Repository Structure

```
.github/                        # Source of truth — active configuration
  copilot-instructions.md       # Global standards applied to all agents
  agents/                       # 11 specialized AI agent definitions (.agent.md)
  instructions/                 # 9 auto-applied per-file-type instructions
  prompts/                      # 6 reusable slash commands (/code-review, /debug, etc.)
  skills/                       # 8 deep domain knowledge modules (SOLID, OWASP, etc.)
  hooks/scripts/                # Lifecycle automation (auto-run tests, auto-format)
.vscode/                        # VS Code config (MCP servers, settings, extensions)
vscode/                         # Distributable bundle copy for VS Code projects
intellij/                       # Distributable bundle copy for JetBrains projects
.claude/                        # Claude IDE local settings
```

## Architecture

### Agent Hierarchy

The bundle uses a **multi-agent orchestration pattern**:

- `@full-stack-dev` — Orchestrator. Clarifies requirements, delegates to subagents, synthesizes results.
- `@backend-dev`, `@frontend-dev`, `@ionic-dev` — Domain specialists invoked by the orchestrator.
- `@test-writer` — QA agent with an auto-run hook: tests execute on agent stop; failures are fed back for autonomous fixing.
- `@code-reviewer` — Orchestrates 3 parallel subagents: `review-correctness`, `review-quality`, `review-architecture`.
- `@security-reviewer`, `@e2e-tester` — Specialized audit/test agents.

Agent files (`.agent.md`) use YAML frontmatter to declare: description, tools, subagents, and user-invocable status.

### Auto-Applied Instructions

`.github/instructions/` files attach automatically based on file patterns declared in each file's frontmatter:

| Instruction File | Triggers On |
|---|---|
| `typescript.instructions.md` | `*.ts`, `*.tsx` |
| `java.instructions.md` | `*.java` |
| `spring-boot.instructions.md` | `application*.yml`, `pom.xml` |
| `react.instructions.md` | `*.jsx`, `*.tsx` |
| `angular.instructions.md` | `*.component.ts`, `*.service.ts` |
| `ionic.instructions.md` | `*.page.ts`, `*.page.html` |
| `testing.instructions.md` | `*.test.*`, `*.spec.*` |
| `python.instructions.md` | `*.py` |

### Global Standards (copilot-instructions.md)

SOLID + KISS + DRY + YAGNI enforced globally. Security defaults: OWASP Top 10, no hardcoded secrets, parameterized queries, input validation. Testing: AAA pattern, deterministic tests.

### MCP Servers (.vscode/mcp.json)

Six servers auto-launched via `npx` on first use: `filesystem`, `github` (needs `GITHUB_PERSONAL_ACCESS_TOKEN`), `memory`, `brave-search` (needs `BRAVE_API_KEY`), `sequential-thinking`, `playwright`.

### Dual Bundle Distribution

`vscode/` and `intellij/` are sync copies of `.github/` + `.vscode/` optimized for each IDE. When modifying agents or instructions in `.github/`, update the corresponding files in both distribution bundles.

## Key Conventions

- All agent/instruction/skill/prompt files are Markdown with YAML frontmatter.
- Skills in `.github/skills/` are directories each containing a `SKILL.md`.
- Hooks are defined both in agent frontmatter and in `.github/hooks/scripts/`.
- `"chat.autopilot.enabled": false` is intentional — requires user approval for security.
- JetBrains bundle (`intellij/`) omits hooks (not supported by that IDE).
