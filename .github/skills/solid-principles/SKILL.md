---
name: solid-principles
description: "Apply or review SOLID principles in any language or framework. Use when designing classes, refactoring God objects, reviewing dependency graphs, identifying SRP violations, or when code is hard to test or extend. Triggers: SOLID, SRP, OCP, LSP, ISP, DIP, single responsibility, open/closed, dependency inversion, interface segregation."
argument-hint: "Code or design to analyze, e.g. 'review my OrderService class'"
---

# SOLID Principles

## When to Use This Skill

- You are designing a new class or module and want to get the structure right
- You are reviewing existing code for SOLID violations
- Code is hard to test, hard to extend, or has too many reasons to change

## The Five Principles — Quick Reference

| Principle | One-line rule | Most common violation |
|-----------|--------------|----------------------|
| **SRP** — Single Responsibility | One class = one reason to change | God class that handles DB + business logic + HTTP |
| **OCP** — Open/Closed | Open for extension, closed for modification | Long `if/switch` chains that grow with every new type |
| **LSP** — Liskov Substitution | Subtypes must be substitutable for their base type | Override that throws `NotImplementedException` |
| **ISP** — Interface Segregation | No client forced to depend on methods it does not use | Fat interface with 15 methods on a service |
| **DIP** — Dependency Inversion | Depend on abstractions, not concretions | `new` keyword for dependencies inside a class |

## Procedure

1. **Identify the violation** — see [detecting violations](./references/detecting-violations.md)
2. **Choose the fix** — see [refactoring patterns](./references/refactoring-patterns.md)
3. **Apply minimally** — fix only the violation, do not over-engineer
4. **Verify** — the refactored class should be independently testable

## Quick Diagnosis Questions

- Can I describe what this class does in one sentence without using "and"? → SRP
- If I add a new type, do I have to modify this file? → OCP
- Can I swap this implementation for another without changing callers? → DIP / LSP
- Does this interface have methods that some implementations leave empty? → ISP

## Examples by Language

See [TypeScript examples](./references/examples-ts.md) | [Java examples](./references/examples-java.md) | [Python examples](./references/examples-python.md)
