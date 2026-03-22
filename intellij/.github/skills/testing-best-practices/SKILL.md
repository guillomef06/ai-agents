---
name: testing-best-practices
description: "Define a test strategy, improve test quality, choose the right test type, and apply mocking correctly. Use when planning test coverage, reviewing test quality, deciding between unit/integration/E2E tests, or fixing flaky tests. Triggers: test strategy, coverage, flaky test, mock, stub, fixture, TDD, BDD, test pyramid, Vitest, Jest, pytest, JUnit, Playwright, Cypress."
argument-hint: "Testing problem or area to improve, e.g. 'our integration tests are too slow and flaky'"
---

# Testing Best Practices

## When to Use This Skill

- Planning the testing strategy for a new feature or service
- Tests are flaky, slow, or not catching real bugs
- You are not sure whether to write a unit or integration test
- Mock strategy is unclear or inconsistent

## Which Agent to Use

| Need | Agent |
|---|---|
| Unit tests, integration tests, mocking strategy | `@test-writer` |
| E2E tests, user journeys, Playwright/Cypress setup | `@e2e-tester` |
| Both — full feature coverage from unit to browser | `@full-stack-dev` (delegates to both) |

## The Test Pyramid

```
         /\
        /E2\          ← Few: critical user journeys only (@e2e-tester)
       /----\
      / Intg \        ← Some: cross-layer behavior (service + DB, HTTP handler)
     /--------\
    /   Unit   \      ← Many: pure functions, domain logic, fast feedback
   /____________\     (@test-writer handles both Unit and Integration)
```

**Rule of thumb**: 70% unit, 20% integration, 10% E2E.

## Choosing the Right Test Level

| Question | Answer → Test Level | Agent |
|----------|---------------------|-------|
| Is it pure logic with no dependencies? | Unit | `@test-writer` |
| Does it cross a layer boundary (service + DB)? | Integration | `@test-writer` |
| Does it involve I/O (HTTP, file, DB)? | Integration | `@test-writer` |
| Is it a user-facing flow (login, checkout)? | E2E | `@e2e-tester` |
| Is it a single function/class? | Unit | `@test-writer` |

## Mocking Strategy

**Mock** (replace with a controlled fake):
- External HTTP calls
- Database connections
- File system
- `Date`, `Math.random()`, clocks

**Don't mock** (use the real thing):
- Pure functions and utilities
- Value objects / DTOs
- Domain logic you own
- Internal services (prefer real in integration tests)

**Don't mock the unit under test** — if you mock `UserService` in a `UserService` test, you're testing nothing.

## Fixing Flaky Tests

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Passes locally, fails in CI | Timezone / clock dependency | Mock `Date.now()` |
| Order-dependent failures | Shared mutable state | Reset state in `beforeEach` |
| Intermittent timeout | Real network call | Mock the HTTP client |
| Race conditions | Improper async handling | `await` all promises, use fake timers |
| E2E flaky on slow CI | Hard-coded waits | Replace `waitForTimeout()` with `waitFor` assertions |

## TDD Flow (when to apply)

Use TDD for new features with clear requirements:
1. Write a failing test that describes the expected behavior
2. Write the minimum code to make it pass
3. Refactor without breaking the test

Avoid TDD for exploratory work or when requirements are still unclear.

## Reference

See [Jest/Vitest patterns](./references/jest-vitest.md) | [pytest patterns](./references/pytest.md) | [JUnit patterns](./references/junit.md)
