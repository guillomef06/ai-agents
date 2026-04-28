---
description: "UI/UX design standards for web and mobile. Use when writing CSS, SCSS, HTML templates, or any frontend styling. Covers design tokens, responsive strategy, spacing system, and required UI states."
applyTo: "**/*.{css,scss,html,vue,svelte},**/*.page.html,**/*.component.html"
---

# UI Design Standards

## Design Tokens

- Never hardcode colors, spacing, or font sizes — always use CSS custom properties:
  ```css
  /* Bad */
  color: #3b82f6;
  margin: 12px;

  /* Good */
  color: var(--color-primary);
  margin: var(--space-3);
  ```
- Define all tokens in a single `:root` block or a dedicated `tokens.css` / `_tokens.scss` file
- Naming convention: `--{category}-{scale}` (e.g. `--color-primary`, `--space-2`, `--text-lg`)

## Spacing System

- Use a **4px base grid** — all spacing values must be multiples of 4px:

  | Token | Value |
  |---|---|
  | `--space-1` | 4px |
  | `--space-2` | 8px |
  | `--space-3` | 12px |
  | `--space-4` | 16px |
  | `--space-6` | 24px |
  | `--space-8` | 32px |

- Never use arbitrary pixel values like `7px`, `13px`, or `22px`

## Responsive / Mobile-First

- Write styles **mobile-first** — base styles target small screens, `min-width` breakpoints add desktop overrides:
  ```css
  /* Bad — desktop-first */
  .card { display: flex; }
  @media (max-width: 768px) { .card { display: block; } }

  /* Good — mobile-first */
  .card { display: block; }
  @media (min-width: 768px) { .card { display: flex; } }
  ```
- Standard breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- No layout must break between 320px and 1440px viewport width

## Required UI States

Every interactive feature must implement all four states — never ship a component without them:

| State | Requirement |
|---|---|
| **Loading** | Skeleton screen or spinner — no blank/invisible content |
| **Error** | User-readable message + retry action when applicable |
| **Empty** | Descriptive empty state — never a blank area |
| **Success** | Confirmation visible to the user (toast, inline message, or state change) |

```html
<!-- Bad — only handles the success case -->
<ul>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>

<!-- Good — all states handled -->
<app-skeleton *ngIf="loading" />
<app-error-state *ngIf="error" [message]="error" (retry)="load()" />
<app-empty-state *ngIf="!loading && items.length === 0" message="No items yet" />
<ul *ngIf="!loading && items.length > 0">
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>
```

## Typography

- Define a type scale with at most 5–6 sizes — no ad-hoc `font-size` values outside the scale
- Line height: body text `1.5`, headings `1.2` — never `1.0`
- Use `rem` for font sizes, never `px` — respects the user's browser font settings:
  ```css
  /* Bad */
  font-size: 14px;

  /* Good */
  font-size: 0.875rem;
  ```

## Visual Hierarchy & Accessibility

- Each screen must have exactly **one** `h1`
- Contrast ratio: normal text ≥ 4.5:1, large text ≥ 3:1 (WCAG AA)
- Never use `outline: none` without a custom focus indicator replacement — keyboard users must always see focus
