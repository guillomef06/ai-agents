/**
 * Hook: Stop — test-writer agent
 *
 * Detects the project stack and runs the appropriate test command.
 * If tests fail, blocks the agent and injects the failure output
 * so it can fix the failing tests autonomously.
 *
 * Supported stacks (auto-detected from project files):
 *   - Node.js  → npm test -- --passWithNoTests
 *   - Maven    → mvn test -q
 *   - Gradle   → ./gradlew test  (or gradlew.bat on Windows)
 *   - Python   → python -m pytest --tb=short -q
 *
 * Reads stdin for the hook input (checks stop_hook_active to prevent
 * infinite loop as required by VS Code docs).
 *
 * Exit 0 always — control is via JSON output, not exit codes.
 */
'use strict'

const { execSync, execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

function detectTestCommand() {
  if (fs.existsSync(path.join(cwd, 'pom.xml'))) {
    return { cmd: 'mvn', args: ['test', '-q'] }
  }
  if (fs.existsSync(path.join(cwd, 'gradlew'))) {
    const script = process.platform === 'win32' ? 'gradlew.bat' : './gradlew'
    return { cmd: script, args: ['test'] }
  }
  if (fs.existsSync(path.join(cwd, 'build.gradle')) || fs.existsSync(path.join(cwd, 'build.gradle.kts'))) {
    return { cmd: 'gradle', args: ['test'] }
  }
  if (fs.existsSync(path.join(cwd, 'setup.py')) || fs.existsSync(path.join(cwd, 'pyproject.toml')) || fs.existsSync(path.join(cwd, 'pytest.ini'))) {
    return { cmd: 'python', args: ['-m', 'pytest', '--tb=short', '-q'] }
  }
  if (fs.existsSync(path.join(cwd, 'package.json'))) {
    return { cmd: 'npm', args: ['test', '--', '--passWithNoTests'] }
  }
  return null
}

const chunks = []
process.stdin.on('data', (chunk) => chunks.push(chunk))
process.stdin.on('end', () => {
  const input = JSON.parse(Buffer.concat(chunks).toString() || '{}')

  // Required guard: prevent the agent from running indefinitely
  if (input.stop_hook_active) {
    process.exit(0)
  }

  const testCmd = detectTestCommand()
  if (!testCmd) {
    // No recognizable project — skip silently, don't block
    process.exit(0)
  }

  try {
    execFileSync(testCmd.cmd, testCmd.args, { timeout: 120_000, stdio: 'pipe', cwd })
    process.exit(0)
  } catch (err) {
    const stdout = (err.stdout ?? Buffer.alloc(0)).toString()
    const stderr = (err.stderr ?? Buffer.alloc(0)).toString()
    const output = (stdout + stderr).slice(-2000)

    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'Stop',
          decision: 'block',
          reason: `Tests are failing. Fix all failing tests before completing.\n\nCommand: ${testCmd.cmd} ${testCmd.args.join(' ')}\n\n${output}`,
        },
      })
    )
    process.exit(0)
  }
})

