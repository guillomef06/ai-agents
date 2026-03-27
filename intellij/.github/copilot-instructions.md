# Development Standards — GitHub Copilot Instructions

## Core Principles

Apply **SOLID**, **KISS**, **DRY**, and **YAGNI** to all code.
Prefer the simplest working solution. Add abstraction only when you have two or more concrete use cases — never speculatively.

## Code Quality

- Write self-documenting code; add comments only for non-obvious decisions
- Follow the language's idiomatic conventions and the project's existing patterns
- Make minimal, focused changes — preserve structure unless explicitly asked to refactor
- Understand context fully before suggesting changes

## Security (OWASP)

- Validate and sanitize **all** external inputs (user input, API responses, env vars)
- Never hardcode credentials, API keys, tokens, or secrets — use environment variables
- Use HTTPS for all external calls; never mix HTTP and HTTPS
- Apply least-privilege principle to roles and permissions

## Testing

- Every feature or bug fix must include a test
- Prefer integration tests for business logic; unit tests for pure functions
- Follow Arrange-Act-Assert structure
- Tests must be independent and deterministic

## Process

1. Understand the full context before making changes
2. Ask clarifying questions when requirements are ambiguous
3. Run tests and validate the build after changes
4. Preserve existing conventions (naming, structure, style)

## Unknown or Version-Specific Technology

Never rely solely on training data for framework APIs, configuration options, or breaking changes — models have a knowledge cutoff and training data gaps.

When you encounter a framework, library, or version you are uncertain about:
1. **Fetch the official documentation** before writing any code — use the `fetch` tool on the official docs URL or changelog
2. **Search if no URL is known** — use the `brave-search` tool to find the official docs first, then fetch the relevant page
3. **Check the project's own deps file** (`package.json`, `pom.xml`, `requirements.txt`, etc.) to confirm the exact version, then target that version's docs specifically
4. **Prefer official sources**: official docs > GitHub README > community guides

## On-Demand Expertise

Deep guidance available via skills (type `/` in chat):
- `/solid-principles` — SOLID application and review
- `/owasp-security` — Security audit and fixes
- `/clean-code` — Naming, functions, classes
- `/design-patterns` — GoF patterns, when to apply them
- `/api-design` — REST / GraphQL / gRPC
- `/testing-best-practices` — Strategy, coverage, mocking
