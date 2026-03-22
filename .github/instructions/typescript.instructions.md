---
description: "TypeScript coding standards. Use when writing or reviewing TypeScript files, defining types, working with generics, or enforcing strict typing. Triggers: TypeScript, TS, type, interface, generic, strict mode."
applyTo: "**/*.{ts,tsx}"
---

# TypeScript Standards

## Typing

- **No `any`** — use `unknown` and narrow with type guards instead
- Prefer `interface` for object shapes; use `type` for unions and intersections
- Use `readonly` on properties that must not be mutated after construction
- Never use non-null assertion (`!`) — use explicit null checks or optional chaining

## Functions & Classes

- Explicitly annotate function return types — no implicit inference for public APIs
- Keep functions under 20 lines; extract helpers when complexity grows
- Use `private`/`protected` access modifiers — no accidental public exposure
- Apply **SRP**: one class = one reason to change

## Async

- Always `await` Promises or explicitly handle them with `.then/.catch`
- Never `floating promises` (unhandled async calls) — use `void operator` only if intentionally fire-and-forget, with a comment

## Imports

- Use absolute imports (path aliases like `@app/services/`) over deep relative paths
- Group imports: external packages → internal modules → types

## Example

```ts
// Bad
async function getUser(id: any): Promise<any> {
  const user = await db.find(id)!
  return user
}

// Good
async function getUser(id: string): Promise<User | null> {
  const user = await db.find(id)
  return user ?? null
}
```
