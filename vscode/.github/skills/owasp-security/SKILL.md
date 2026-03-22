---
name: owasp-security
description: "Audit code for OWASP Top 10 vulnerabilities and apply security fixes. Use when implementing authentication, handling user input, reviewing API endpoints, checking dependency CVEs, or hardening an application. Triggers: security, OWASP, vulnerability, injection, XSS, CSRF, SQLi, auth, JWT, secrets, CVE, hardening, pentest, audit."
argument-hint: "Code, feature, or file to audit, e.g. 'audit the login endpoint'"
---

# OWASP Security Audit

## When to Use This Skill

- Implementing or reviewing authentication/authorization
- Adding a new API endpoint that accepts user input
- Reviewing a PR for security issues before merging
- Responding to a security incident or CVE

## OWASP Top 10 — Audit Checklist

Work through each category systematically. See detailed guidance in the references.

| # | Category | Quick Check |
|---|----------|------------|
| A01 | **Broken Access Control** | Every endpoint has auth check? IDOR possible? |
| A02 | **Cryptographic Failures** | Passwords hashed with bcrypt/argon2? Data encrypted at rest? |
| A03 | **Injection** | Parameterized queries? No `eval()`? No shell exec with user input? |
| A04 | **Insecure Design** | Rate limiting on auth? Business logic validates server-side? |
| A05 | **Security Misconfiguration** | CORS locked down? Security headers set? Default creds changed? |
| A06 | **Vulnerable Components** | `npm audit` / `pip audit` / `mvn dependency-check` clean? |
| A07 | **Auth & Session Failures** | Short-lived tokens? MFA available? Session invalidated on logout? |
| A08 | **Software/Data Integrity** | Dependencies pinned with checksums? CI pipeline protected? |
| A09 | **Logging & Monitoring Failures** | Auth events logged? PII excluded from logs? Alerts configured? |
| A10 | **SSRF** | User-controlled URLs validated against allowlist? |

## Procedure

1. Identify the scope (auth flow? input handling? dependencies?)
2. Read the targeted files systematically
3. Work through the checklist above for the scope
4. See [finding details](./references/findings-guide.md) for exploit description + fix patterns
5. Report findings with severity: Critical / High / Medium / Low

## Severity Guidance

- **Critical**: Exploitable remotely with no auth → patch immediately
- **High**: Exploitable with low-effort or limited auth → patch this sprint
- **Medium**: Requires specific conditions → plan for next sprint
- **Low**: Defense-in-depth, best practice → track in backlog
