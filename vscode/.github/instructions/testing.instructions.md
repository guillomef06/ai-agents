---
description: "Testing standards — AAA pattern, isolation, coverage, mocking strategy. Use when writing or reviewing test files (unit, integration, E2E). Triggers: test, spec, Jest, Vitest, pytest, JUnit, Cypress, Playwright, mock, fixture, coverage."
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx,py,java}"
---

# Testing Standards

## Structure — Arrange-Act-Assert

Every test must follow AAA with a blank line between each section:

```ts
it('should return null when user does not exist', async () => {
  // Arrange
  const repo = createMockUserRepository({ findById: () => null })
  const service = new UserService(repo)

  // Act
  const result = await service.getUser('unknown-id')

  // Assert
  expect(result).toBeNull()
})
```

## Naming

Format: `should <expected behavior> when <condition>`

```
✅ should throw UserNotFoundError when id is missing
✅ should return empty array when no orders exist
❌ test1
❌ works correctly
```

## Isolation

- Tests must be **independent** — no shared mutable state between tests
- Use `beforeEach` for fresh fixtures — never `beforeAll` with mutable state
- Tests must pass in any order

## What to Mock

| Mock | Don't Mock |
|------|-----------|
| HTTP clients / external APIs | Pure functions |
| Database connections | Domain logic |
| File system | DTOs / value objects |
| `Date`, `Math.random`, timers | Internal services (prefer real) |

Never mock the module under test.

## Coverage Targets

- **Unit tests**: 80%+ line coverage for domain/service layer
- **Integration tests**: cover every API endpoint (happy path + main error path)
- **E2E tests**: cover the 3-5 most critical user journeys only

> Stack-specific test patterns (framework APIs, annotations, test utilities) are documented in each tech's own instruction file — `spring-boot.instructions.md`, `angular.instructions.md`, `react.instructions.md`, `python.instructions.md`.

## Anti-patterns

```ts
// Bad — tests implementation detail
expect(service['_cache']).toHaveBeenCalled()

// Bad — non-deterministic
expect(result.createdAt).toBe(new Date().toISOString())

// Good — tests behavior
expect(result).toMatchObject({ id: 'user-1', email: 'test@test.com' })
```
