---
description: "Refactor selected code to improve quality while preserving behavior — applies SOLID, KISS, DRY"
argument-hint: "Code to refactor and the goal, e.g. 'Extract service layer from this controller'"
agent: agent
tools: [read, edit, search, todo]
---

Refactor the following code: $input

## Constraints

- **Preserve behavior** — the refactored code must produce identical outputs for all existing inputs
- **Minimal scope** — only change what is necessary to achieve the stated goal
- **No new features** — refactoring is not the time to add functionality

## Approach

1. Read and fully understand the current code
2. Identify the specific quality issue (duplication, God class, logic in wrong layer, etc.)
3. State the refactoring goal explicitly before making changes
4. Apply one refactoring at a time — do not combine multiple transformations
5. Verify that existing tests still pass conceptually (or update them if the interface changed)

## Quality Targets

Apply in priority order:
1. **Correctness preserved** — no behavioral change
2. **Single Responsibility** — each class/function does one thing
3. **DRY** — extracted shared logic
4. **KISS** — removed unnecessary complexity
5. **Clear naming** — names reveal intent

## Output Format

1. Brief explanation of the problem in the original code
2. The refactored code
3. Summary of changes made (bullet list)
4. Any tests that need updating due to interface changes
