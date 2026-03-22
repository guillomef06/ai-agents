## Detecting SOLID Violations — Cheat Sheet

### SRP Violations
- Class name contains "And", "Manager", "Handler", "Util", "Helper" (God object smell)
- Constructor takes more than 3-4 dependencies
- Method count > 10 with unrelated concerns
- Unit test requires mocking 5+ dependencies

**Fix**: Extract class per concern. If it handles users AND emails, split to `UserRepository` + `EmailService`.

---

### OCP Violations
- `if (type === 'A') { ... } else if (type === 'B') { ... }` in a hot path
- Every time a new variant is added, this file must change
- `switch` statement on an enum that keeps growing

**Fix**: Replace conditionals with polymorphism — extract an interface, create concrete implementations, inject the right one via factory or DI container.

---

### LSP Violations
- Subclass method throws `UnsupportedOperationException` / `NotImplementedError`
- Subclass adds preconditions stronger than the parent (rejects inputs parent accepted)
- Subclass weakens postconditions (returns null where parent returned typed value)
- Calling code does `instanceof` checks before calling methods

**Fix**: Don't inherit for code reuse — inherit only for genuine is-a relationships. Use composition instead.

---

### ISP Violations
- Interface with 8+ methods
- Implementations leave methods empty or throwing
- Callers only use 2 of the 8 methods but must depend on the full interface

**Fix**: Split into role interfaces (`Readable`, `Writable`, `Searchable`). Implement only what you need.

---

### DIP Violations
- `new ConcreteService()` inside a class constructor or method
- `import { ConcreteRepository }` at the top of a service file
- No interface between layers — service directly references ORM entity

**Fix**: Define an interface in the domain layer. Inject via constructor. Let the DI container resolve the concrete type.
