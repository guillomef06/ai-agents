---
description: "Java coding standards. Use when writing or reviewing plain Java files, defining classes, applying design patterns, or working with Java generics and collections. Triggers: Java, class, interface, generics, collections, records, sealed classes."
applyTo: "**/*.java"
---

# Java Standards

## Code Style

- Follow **Google Java Style** — 2-space indent, 100-char line limit, UpperCamelCase classes
- Use **records** for immutable data carriers (Java 16+) over POJOs with boilerplate
- Prefer **sealed classes** for closed type hierarchies over enum + switch hacks

## SOLID in Java

- **SRP**: one class = one concept; split if a class needs more than 2 unrelated collaborators
- **OCP**: use polymorphism over `instanceof` chains
- **DIP**: depend on interfaces, not concrete classes — inject via constructor

## Naming & Structure

- Class names: UpperCamelCase nouns (`OrderProcessor`, not `ProcessOrder`)
- Method names: lowerCamelCase verbs (`findById`, `calculateTotal`)
- Constants: `UPPER_SNAKE_CASE`
- Package names: all lowercase, reverse domain (`com.company.feature`)

## Immutability & Safety

- Prefer `final` fields — make mutability explicit, not the default
- Return `Optional<T>` instead of `null` for absent values
- Validate method arguments at the boundary — throw `IllegalArgumentException` with a message

## Example

```java
// Bad — mutable, null-returning, no validation
public class UserService {
    public User find(Long id) {
        if (id == null) return null;
        return repo.findById(id);
    }
}

// Good — immutable deps, Optional, validated input
public class UserService {
    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = Objects.requireNonNull(repo);
    }

    public Optional<User> find(long id) {
        return repo.findById(id);
    }
}
```
