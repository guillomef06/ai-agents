---
name: clean-code
description: "Apply clean code principles to improve naming, reduce function complexity, and make code self-documenting. Use when code is hard to read, functions are too long, names are unclear, or comments are compensating for bad code. Triggers: clean code, naming, readability, long function, complexity, refactor, self-documenting, comments, cognitive load."
argument-hint: "Code to clean up, e.g. 'improve naming in this utility file'"
---

# Clean Code

## When to Use This Skill

- Code requires a comment to explain what it does (the code should explain itself)
- Function is longer than fits on one screen
- Variable names are `data`, `result`, `temp`, `x`, `flag`
- PR reviewers ask "what does this do?"

## Core Rules

### Naming

| Context | Rule | Example |
|---------|------|---------|
| Variables | Noun, reveals intent | `userEmailAddress`, not `str` or `data` |
| Booleans | Predicate form | `isActive`, `hasPermission`, `canEdit` |
| Functions | Verb + noun | `getUserById()`, `validateEmailFormat()` |
| Classes | Noun, single concept | `OrderProcessor`, not `OrderManager` |

**Anti-patterns to eliminate**:
- Single-letter variables outside of loop counters
- Encodings: `strName`, `iCount`, `m_value`
- Negated names: `isNotValid` → use `isInvalid` or flip the condition
- Generic suffixes: `DataManager`, `InfoHelper`, `Utils`

### Functions

- **20-line rule**: if a function exceeds ~20 lines, look for an extraction
- **One level of abstraction per function**: don't mix high-level orchestration with low-level details
- **No flag arguments**: `process(user, true)` → split into `processActive(user)` + `processInactive(user)`
- **Max 3 parameters**: more → use a parameter object

### Comments

> A comment is a failure to express intent in code. Compensate when you must; eliminate when you can.

Comments that add value:
- Legal headers
- Explanation of a non-obvious algorithm (with a reference)
- Warning of a known consequence: `// Must run after DB migration 42`

Comments to delete:
- Restating the code: `i++ // increment i`
- Commented-out dead code — use git history instead
- TODO comments older than one sprint

## Procedure

1. Read the code for 2-3 minutes without changing anything
2. List names that don't reveal intent
3. Identify functions that do more than one thing (look for "and" in their purpose)
4. Apply renames and extractions in order: names first, then function splits
5. Remove compensating comments made obsolete by the renames

## Reference

See [naming patterns by language](./references/naming-patterns.md) for language-specific conventions.
