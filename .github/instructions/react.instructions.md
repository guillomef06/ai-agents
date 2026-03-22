---
description: "React coding standards. Use when writing or reviewing React components, hooks, context, or JSX. Triggers: React, JSX, TSX, component, hook, useState, useEffect, props, context, React Router, Next.js."
applyTo: "**/*.{jsx,tsx}"
---

# React Standards

## Components

- Use **functional components** exclusively — no class components
- One component = one responsibility; split when a component needs more than 2 `useState` hooks for unrelated concerns
- Extract custom hooks for any logic that involves `useEffect` or multiple state variables
- Avoid prop drilling beyond 2 levels — use Context or a state manager

## Hooks

- List all dependencies in `useEffect`, `useMemo`, `useCallback` dependency arrays — no suppression comments
- Prefer `useMemo` / `useCallback` for expensive computations or stable callback references — not as a default for everything
- Never call hooks conditionally or inside loops

## Types (TypeScript)

- Define a `Props` interface for every component — no inline `React.FC<{ label: string }>` for non-trivial shapes
- Avoid `React.FC` — prefer explicit `function MyComponent(props: Props): JSX.Element`

## Accessibility

- Every `<img>` must have a meaningful `alt`
- Every `<button>` must have visible text or `aria-label`
- Use `<button>` for actions, `<a>` for navigation — never `<div onClick>`
- Respect focus order — do not use `tabIndex > 0`

## Security

- Never use `dangerouslySetInnerHTML` without sanitizing with DOMPurify first
- Never construct URLs from user input without validation

## Testing

Use **React Testing Library (RTL)** — test what the user sees, not implementation details.

| What to test | Tool | Notes |
|---|---|---|
| Component rendering | `render` + `screen` queries | Prefer `getByRole` > `getByText` > `getByTestId` |
| User interactions | `userEvent` (v14+) | Always `await userEvent.click()` — async by default |
| Async state (loading/error) | `waitFor` / `findBy*` queries | Never use arbitrary `setTimeout` in tests |
| Custom hooks | `renderHook` | From `@testing-library/react` |
| HTTP calls | `msw` (Mock Service Worker) | Mock at network level, not `fetch` directly |

```tsx
// Component test
it('should show error message when email is invalid', async () => {
  // Arrange
  render(<LoginForm onSubmit={vi.fn()} />)

  // Act
  await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
  await userEvent.click(screen.getByRole('button', { name: /submit/i }))

  // Assert
  expect(screen.getByRole('alert')).toHaveTextContent('Invalid email')
})

// Custom hook test
it('should return user when fetch succeeds', async () => {
  const { result } = renderHook(() => useUser('1'))
  await waitFor(() => expect(result.current.user).toEqual({ id: '1', name: 'Ada' }))
})
```

- Query priority: `getByRole` → `getByLabelText` → `getByPlaceholderText` → `getByText` → `getByTestId`
- Never assert on internal state or component refs — assert on what is rendered
- Co-locate test files with source: `UserCard.test.tsx` next to `UserCard.tsx`

## Example

```tsx
// Bad
const UserCard = ({ user, onDelete }: any) => (
  <div onClick={() => onDelete(user.id)}>
    <div dangerouslySetInnerHTML={{ __html: user.bio }} />
  </div>
)

// Good
interface UserCardProps {
  user: User
  onDelete: (id: string) => void
}

function UserCard({ user, onDelete }: UserCardProps): JSX.Element {
  return (
    <article>
      <p>{user.bio}</p>
      <button type="button" onClick={() => onDelete(user.id)} aria-label={`Delete ${user.name}`}>
        Delete
      </button>
    </article>
  )
}
```
