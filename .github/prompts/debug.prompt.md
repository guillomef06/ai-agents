---
description: "Systematically debug an error, unexpected behavior, or failing test — root cause analysis and fix"
argument-hint: "Error message, failing test name, or unexpected behavior description"
agent: agent
tools: [read, search, execute, todo]
---

Debug the following issue: $input

## Debugging Process

Follow this structured approach — do not jump to solutions before completing diagnosis:

### 1. Reproduce
- Identify the exact conditions that trigger the issue
- Find the shortest reproduction path

### 2. Locate
- Read the stack trace or error output carefully — identify the exact file and line
- Trace backwards through the call stack to find where the unexpected state originates

### 3. Hypothesize
- List 2-3 plausible root causes before investigating further
- Rank them by likelihood

### 4. Verify
- Test each hypothesis by reading relevant code — do not guess
- Use logs, test output, or code analysis to confirm or eliminate each cause

### 5. Fix
- Apply the minimal fix that addresses the root cause
- Do not change unrelated code while fixing
- If the fix is non-obvious, add a comment explaining why

### 6. Prevent
- Write or update a test that would have caught this bug
- Note if anything should be improved to make this class of bug impossible

## Output Format

1. **Root cause** — one sentence
2. **The fix** — the code change
3. **The test** — the test that prevents regression
