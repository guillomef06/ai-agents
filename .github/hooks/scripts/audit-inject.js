/**
 * Hook: SessionStart — security-reviewer agent
 *
 * Runs `npm audit` and injects the summary as additional context
 * into the agent conversation before any message is processed.
 *
 * Output: JSON { hookSpecificOutput: { hookEventName, additionalContext } }
 * Exit 0 always — never blocks the session start.
 */
'use strict'

const { execSync } = require('child_process')

let auditSummary = 'npm audit: no package.json found or npm not available — skipped'

try {
  const raw = execSync('npm audit --json 2>/dev/null', { timeout: 15_000 }).toString()
  const audit = JSON.parse(raw)
  const vulns = audit.metadata?.vulnerabilities ?? {}
  const total = Object.values(vulns).reduce((sum, n) => sum + n, 0)

  if (total === 0) {
    auditSummary = 'npm audit: ✓ no vulnerabilities found'
  } else {
    const breakdown = Object.entries(vulns)
      .filter(([, count]) => count > 0)
      .map(([severity, count]) => `${count} ${severity}`)
      .join(', ')
    auditSummary = `npm audit: ${total} vulnerabilities detected (${breakdown}). Run 'npm audit' for details and 'npm audit fix' for automatic fixes.`
  }
} catch {
  // npm audit failed or no package.json — non-blocking, keep default message
}

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext: auditSummary,
    },
  })
)
