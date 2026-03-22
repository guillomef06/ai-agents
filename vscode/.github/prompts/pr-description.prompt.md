---
description: "Generate a clear, professional pull request description from staged changes or a feature description"
argument-hint: "Feature name or summary of changes, e.g. 'Add JWT refresh token rotation'"
agent: agent
tools: [read, search]
---

Generate a professional pull request description for: $input

## Required Sections

**What** — 2-3 sentences explaining what this PR changes. No jargon.

**Why** — The motivation or business reason for the change.

**How** — Brief technical summary: key design decisions, patterns used, trade-offs made.

**Testing** — How was this tested? (unit tests added, manual test steps if relevant)

**Breaking Changes** — List any API, schema, or interface changes that require coordination.

**Checklist**
- [ ] Tests added or updated
- [ ] Documentation updated if behavior changed
- [ ] No secrets or credentials committed
- [ ] Security implications considered

## Style Rules

- Use present tense imperative mood in the title: "Add retry logic" not "Added retry logic"
- Be factual and concise — no marketing language
- If the change is risky, say so clearly in the description
