---
description: "Security coding guidelines — OWASP Top 10 checks, input validation, secrets management, injection prevention. Use when implementing authentication, authorization, handling user input, calling external APIs, or when a security review is requested. Triggers: security, auth, login, password, token, JWT, SQL, injection, XSS, CSRF, secret, API key, permission."
---

# Security Guidelines

## Input Validation

- Validate **all** inputs at the system boundary (HTTP request, CLI args, file content, env vars)
- Use an allowlist approach — reject anything not explicitly allowed
- Validate type, format, length, and range — do not rely on the database to enforce constraints

## Injection Prevention

- **SQL**: Always parameterized queries — never string concatenation
- **Command injection**: Never pass user input to `exec()`, `shell=True`, `ProcessBuilder` with user strings
- **XSS**: Escape HTML on output — use framework-native escaping, never build HTML strings manually
- **Template injection**: Never render templates from user-controlled strings (Jinja2, Pebble, Handlebars)

## Secrets Management

- **Never** hardcode secrets, API keys, passwords, or tokens in source code
- Use environment variables; reference via `${env:VAR_NAME}` in configs
- Rotate tokens periodically — use short-lived JWTs (< 15 min access token, < 7 days refresh)
- Store passwords with `bcrypt` / `argon2` — never SHA-1, MD5, or unsalted hashes

## Authentication & Authorization

- Use established libraries — never implement custom session management or crypto
- Verify authorization on every request — do not rely on the UI to hide restricted features
- Apply **least privilege** — service accounts should only access what they need
- Invalidate sessions on logout and password change
- **Always enforce a `maxLength` on password inputs** (frontend validators + backend validation) — bcrypt runs on the full input; an unbounded password field is a viable CPU DoS vector. Cap at 128 characters.
- **Never store JWT tokens in `localStorage`** — accessible to any JS on the page via XSS. Use `httpOnly; Secure; SameSite=Strict` cookies (server-set) or `sessionStorage` as a last resort.
- **Never use client-side JWT parsing to make access-control decisions** — the frontend cannot verify the signature. The `exp` claim may be used for UX hints (proactive redirect) but the actual authorization is always enforced server-side.
- **Protect auth endpoints against brute-force** — implement rate limiting (e.g. Bucket4j, Resilience4j) with a threshold of ~5 failed attempts per minute per IP. Add `failedAttempts` / `lockedUntil` fields on the user entity.
- **Avoid email enumeration** — registration and forgot-password flows must return the same HTTP status and message whether the email exists or not (use HTTP 202 + neutral message, not 409 "Email already in use").

## HTTPS & Communications

- All external calls must use HTTPS — no fallback to HTTP
- Validate TLS certificates — never disable certificate verification
- Set security headers: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`

## Logging

- Never log passwords, tokens, PII, or payment data
- Use structured logging with correlation IDs — never use string interpolation in log statements
- Audit security-relevant events: login, logout, permission changes, failed auth attempts
