## OWASP Findings Guide — Exploit Patterns & Fixes

### A01 — Broken Access Control

**Symptom**: Route handler checks authentication but not authorization.
```ts
// Vulnerable — any authenticated user can access any user's data
app.get('/users/:id/profile', authenticate, async (req, res) => {
  const user = await userRepo.findById(req.params.id)
  res.json(user)
})

// Fixed — user can only access their own profile (or admin can access any)
app.get('/users/:id/profile', authenticate, async (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const user = await userRepo.findById(req.params.id)
  res.json(user)
})
```

---

### A03 — SQL Injection

```ts
// Vulnerable
const result = await db.query(`SELECT * FROM users WHERE email = '${email}'`)

// Fixed
const result = await db.query('SELECT * FROM users WHERE email = $1', [email])
```

---

### A03 — Command Injection (Python)

```python
# Vulnerable
import subprocess
subprocess.run(f"convert {user_filename}", shell=True)

# Fixed
import subprocess, shlex
subprocess.run(["convert", user_filename])  # Never shell=True with user input
```

---

### A02 — Weak Password Storage

```ts
// Vulnerable
const hash = crypto.createHash('md5').update(password).digest('hex')

// Fixed (bcrypt, cost factor ≥ 12)
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 12)
const valid = await bcrypt.compare(candidatePassword, storedHash)
```

---

### A05 — Missing Security Headers (Express)

```ts
import helmet from 'helmet'
app.use(helmet()) // Sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.
```

---

### A10 — SSRF

```ts
// Vulnerable — attacker can probe internal services
async function fetchAvatar(url: string) {
  return fetch(url)
}

// Fixed — allowlist approach
const ALLOWED_HOSTS = ['cdn.example.com', 'avatars.example.com']

async function fetchAvatar(url: string) {
  const parsed = new URL(url)
  if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    throw new Error('Disallowed host')
  }
  if (!['https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTPS allowed')
  }
  return fetch(url)
}
```
