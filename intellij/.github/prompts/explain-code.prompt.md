---
description: "Explain selected code in plain language — what it does, how it works, and why it is designed that way"
argument-hint: "Code or file to explain, e.g. 'the TokenRefreshInterceptor class'"
agent: agent
tools: [read, search]
---

Explain the following code clearly: $input

## What I Need

Provide a structured explanation with these sections:

**Purpose** — What problem does this code solve? One sentence.

**How it works** — Step-by-step walkthrough of the execution flow. Use plain language, not pseudocode.

**Key design decisions** — Why was it built this way? What alternatives exist and why were they not chosen?

**Dependencies** — What does this code depend on, and what depends on it?

**Gotchas / Edge cases** — What non-obvious behaviors should a developer know before modifying this?

## Style Rules

- Explain as if to a competent developer who is new to this codebase
- Do not restate the code line by line — explain the intent and structure
- Use concrete examples when a concept is abstract
- Flag any code that looks problematic or hard to maintain
