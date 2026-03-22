---
name: design-patterns
description: "Identify which GoF design pattern solves a given problem and apply it correctly. Use when facing a recurring design problem: object creation, structural composition, or behavioral coordination between objects. Triggers: design pattern, GoF, factory, singleton, strategy, observer, decorator, adapter, facade, command, repository, CQRS."
argument-hint: "Problem to solve, e.g. 'I need to support multiple payment providers with the same interface'"
---

# Design Patterns

## When to Use This Skill

- You have a well-known structural or behavioral problem and want the established solution
- Code is tangled with conditionals that should be polymorphism
- You want to add extensibility without breaking existing code

## Pattern Picker

### Creational — How objects are created

| Pattern | Use When | Key Signal |
|---------|----------|-----------|
| **Factory Method** | Many subclasses, creation logic varies by type | `if (type === 'A') new A(), else new B()` |
| **Abstract Factory** | Families of related objects | Creating UI widgets for different platforms |
| **Builder** | Object with many optional params, step-by-step construction | Constructor with 6+ arguments |
| **Singleton** | Exactly one instance needed globally | Config, Logger, Connection Pool |

### Structural — How objects are composed

| Pattern | Use When | Key Signal |
|---------|----------|-----------|
| **Adapter** | Incompatible interfaces need to work together | Third-party library incompatible with your interface |
| **Decorator** | Add behavior to objects without subclassing | Add logging/caching/auth to a service |
| **Facade** | Simplify a complex subsystem | Wrap multi-step SDK initialization |
| **Composite** | Tree structures of uniform objects | File system, menus, component trees |

### Behavioral — How objects communicate

| Pattern | Use When | Key Signal |
|---------|----------|-----------|
| **Strategy** | Swap algorithms at runtime | `if (mode === 'fast') algo1 else algo2` |
| **Observer** | One-to-many event notification | UI events, domain events, pub/sub |
| **Command** | Encapsulate an action for undo/queue | Undo history, task queue, macros |
| **Template Method** | Same skeleton, different steps | ETL pipelines, report generators |
| **Chain of Responsibility** | Multiple handlers, first match wins | Middleware, auth filters |

## Procedure

1. Describe the problem in one sentence
2. Identify the category (creation / structure / behavior)
3. Match to a pattern using the picker above
4. See [pattern implementations](./references/implementations.md) for concrete code examples
5. Apply the minimal version — do not add all the GoF boilerplate if you only need the core idea

## Anti-patterns to Avoid

- **Premature abstraction**: applying a pattern before you have 2 concrete use cases
- **Pattern overuse**: using Factory when `new MyClass()` is perfectly clear
- **Singleton abuse**: using Singleton for dependency injection instead of a DI container
