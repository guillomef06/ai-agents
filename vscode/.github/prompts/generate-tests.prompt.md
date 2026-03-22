---
description: "Generate comprehensive tests for selected code — unit, integration, or E2E depending on scope"
argument-hint: "File or function to test, e.g. 'src/services/payment.service.ts'"
agent: agent
tools: [read, edit, search]
---

Generate comprehensive tests for: $input

## Test Requirements

**Coverage targets**:
- All happy paths
- All documented error cases
- Boundary values (empty string, null, 0, max values)
- At least one integration scenario if the code crosses a layer boundary

**Structure** (Arrange-Act-Assert):
```
it('should <behavior> when <condition>', () => {
  // Arrange — set up inputs and mocks

  // Act — call the unit under test

  // Assert — verify the observable outcome
})
```

**Naming**: `should <expected result> when <state or input>`

**Isolation rules**:
- Mock only: HTTP clients, database connections, file system, Date/time, randomness
- Do NOT mock: pure functions, domain logic, DTOs

## What NOT to Test

- Implementation details (private methods, internal state)
- Framework behavior (don't test that Spring DI works)
- Obvious getters/setters with no logic

## Discover the Framework

Read the existing test files in the project first to match the testing library, assertion style, and mock approach already in use. Do not introduce a new testing library.
