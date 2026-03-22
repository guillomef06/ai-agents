---
description: "Run a structured code review on selected files or a pull request scope"
argument-hint: "Files or feature to review, e.g. 'src/services/auth.service.ts'"
agent: agent
tools: [read, search, todo]
---

Perform a thorough code review on the specified files or feature: $input

## Review Checklist

Work through each dimension in order:

1. **Correctness** — Does the code correctly implement the intended behavior? Are all error paths handled?
2. **SOLID** — Single responsibility? Depends on abstractions? Open for extension without modification?
3. **KISS / YAGNI** — Is there a simpler path? Is complexity justified by a current requirement?
4. **DRY** — Is logic duplicated? If the same logic appears more than twice, suggest an extraction.
5. **Naming** — Do names reveal intent? Are abbreviations avoided?
6. **Security** — Input validation gaps? Hardcoded secrets? Injection risks? Missing auth checks?
7. **Tests** — Is the new behavior tested? Are the tests meaningful or just for coverage?
8. **Performance** — N+1 queries? Blocking I/O in a hot path? Unnecessary recomputation?

## Output Format

Organize findings as:
- **Blockers** — must be fixed before merging
- **Suggestions** — improvements that would benefit quality but are not blocking
- **Approved** — what is done well

Keep recommendations concrete and actionable: include the file path, line reference, the problem, and a proposed fix.
