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
- Apply least-privilege principle to roles, permissions, and database access
- Use parameterized queries — never string-concatenated SQL

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

## On-Demand Expertise

Deep guidance available via skills (type `/` in chat):
- `/solid-principles` — SOLID application and review
- `/owasp-security` — Security audit and fixes
- `/clean-code` — Naming, functions, classes
- `/design-patterns` — GoF patterns, when to apply them
- `/api-design` — REST / GraphQL / gRPC
- `/testing-best-practices` — Strategy, coverage, mocking
