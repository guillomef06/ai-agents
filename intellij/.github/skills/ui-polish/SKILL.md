---
name: ui-polish
description: "Apply UI animations, micro-interactions, and visual polish to frontend applications. Use when an interface feels flat or static, when adding transitions, hover effects, loading states, scroll animations, or page transitions. Triggers: animation, transition, micro-interaction, polish, motion, Framer Motion, GSAP, Lottie, skeleton, loading state, scroll effect, page transition, visual feedback, ui-polish."
argument-hint: "What to animate or polish, e.g. 'add page transitions and card hover effects to an Angular app'"
---

# UI Polish & Animation Best Practices

## When to Use This Skill

- The UI feels flat, static, or unresponsive to user actions
- Adding motion to a new or existing feature
- Choosing animation libraries for the project stack
- Implementing loading states, page transitions, or scroll effects
- Auditing motion for accessibility (`prefers-reduced-motion`)

## Polish Levels

| Level | What to implement | Effort |
|---|---|---|
| **Minimal** | Hover states, focus rings, button press feedback, smooth transitions | Low — pure CSS |
| **Standard** | Route transitions, skeleton loaders, form feedback, subtle entrance animations | Medium — small lib or Angular Animations |
| **Premium** | Scroll-triggered reveals, parallax, complex choreography, Lottie illustrations, spring physics | High — GSAP or Framer Motion |

Always start at **Minimal** — even pure CSS transitions make a dramatic difference. Escalate only when justified.

---

## Library Decision Matrix

### Angular projects

| Use case | Library | Notes |
|---|---|---|
| Route / component transitions | `@angular/animations` (built-in) | Zero extra dependency — use `trigger`, `state`, `transition`, `animate` |
| Complex choreography, scroll triggers | **GSAP** (`gsap` + `ScrollTrigger`) | Industry standard, tree-shakeable, MIT for basics |
| Designer-made animations (Lottie files) | `ngx-lottie` + `lottie-web` | Receives `.json` from designers/After Effects |
| UI component library | **PrimeNG** (full) or **Ng-Zorro** | Both include polished built-in animations |

### React projects

| Use case | Library | Notes |
|---|---|---|
| Component enter/exit, layout animations | **Framer Motion** | The React standard — `motion.div`, `AnimatePresence` |
| Spring physics, fine-grained control | **React Spring** | Better for dragging, gestures |
| Complex choreography, scroll triggers | **GSAP** + `@gsap/react` | Same as Angular, cross-framework |
| Designer-made animations | `lottie-react` | |
| UI component library | **shadcn/ui** + Radix UI | Unstyled accessible primitives — add your own motion |

### Any stack

| Use case | Tool |
|---|---|
| Scroll-triggered reveals | `IntersectionObserver` API (native, no lib) |
| CSS-only micro-interactions | `transition`, `transform`, `@keyframes` |
| Lottie animation files | From [LottieFiles](https://lottiefiles.com) — free assets |

---

## Patterns & Code Examples

### 1. Minimal — CSS micro-interactions (works everywhere)

```css
/* Button press feedback */
.btn {
  transition: transform 120ms ease, box-shadow 120ms ease;
}
.btn:hover  { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,.15); }
.btn:active { transform: translateY(0);    box-shadow: none; }

/* Card hover lift */
.card {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.12); }
```

### 2. Angular — route transition with `@angular/animations`

```ts
// route-animations.ts
export const routeFadeAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ opacity: 0, transform: 'translateY(8px)' }),
    animate('220ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
])

// app.component.ts
@Component({
  animations: [routeFadeAnimation],
  template: `
    <main [@routeAnimations]="outlet.activatedRouteData['animation']">
      <router-outlet #outlet="outlet" />
    </main>
  `
})
```

```ts
// in your route definition
{ path: 'dashboard', component: DashboardComponent, data: { animation: 'dashboard' } }
```

### 3. React — page transition with Framer Motion

```tsx
import { motion, AnimatePresence } from 'framer-motion'

const pageVariants = {
  initial:  { opacity: 0, y: 8 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

// Wrap router outlet
<AnimatePresence mode="wait">
  <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
    <Outlet />
  </motion.div>
</AnimatePresence>
```

### 4. Skeleton loader (any stack — CSS)

```css
/* Shimmer skeleton — no library needed */
.skeleton {
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

```html
<!-- Angular skeleton while loading -->
<ng-container *ngIf="user$ | async as user; else skeleton">
  <app-user-card [user]="user" />
</ng-container>
<ng-template #skeleton>
  <div class="skeleton" style="height:80px; width:100%"></div>
</ng-template>
```

### 5. Scroll-triggered entrance — native IntersectionObserver (no library)

```ts
// Angular directive — reusable on any element
@Directive({ selector: '[appRevealOnScroll]', standalone: true })
export class RevealOnScrollDirective implements AfterViewInit {
  private el = inject(ElementRef)

  ngAfterViewInit() {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.el.nativeElement.classList.add('revealed')
        observer.disconnect()
      }
    }, { threshold: 0.15 })
    observer.observe(this.el.nativeElement)
  }
}
```

```css
[appRevealOnScroll] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 400ms ease, transform 400ms ease;
}
[appRevealOnScroll].revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### 6. Lottie animation (Angular)

```bash
npm install ngx-lottie lottie-web
```

```ts
// app.config.ts
import { provideLottieOptions } from 'ngx-lottie'

export const appConfig: ApplicationConfig = {
  providers: [
    provideLottieOptions({ player: () => import('lottie-web') }),
  ]
}
```

```html
<!-- Drop a .json from lottiefiles.com -->
<ng-lottie [options]="{ path: 'assets/success.json', loop: false }" width="120px" />
```

---

## Accessibility — `prefers-reduced-motion`

**Always** respect the user's OS motion preference. This is a WCAG 2.1 requirement.

```css
/* Wrap ALL your animations in this */
@media (prefers-reduced-motion: no-preference) {
  .card { transition: transform 200ms ease; }
  .skeleton { animation: shimmer 1.4s infinite; }
}

/* Provide a safe fallback — no motion at all */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

In Angular Animations, check programmatically:
```ts
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const duration = reducedMotion ? 0 : 220
```

---

## Performance Rules

- Animate only `transform` and `opacity` — these are GPU-composited, no layout reflow
- Never animate `width`, `height`, `top`, `left`, `margin` — causes layout thrash
- Use `will-change: transform` only on elements actively animating (remove after)
- Keep animations under **300ms** for feedback, under **600ms** for transitions
- Test on a throttled CPU (DevTools → Performance → 4x slowdown)

---

## Quick Wins Checklist

Before delivering any UI, apply these — they take 10 minutes and make a major difference:

- [ ] All buttons have `:hover` + `:active` feedback
- [ ] All links and focusable elements have visible `:focus-visible` ring
- [ ] Form inputs have smooth border/shadow transition on `:focus`
- [ ] Loading states show a skeleton, not a blank screen
- [ ] Route changes don't flash instantly — minimum 150ms fade
- [ ] `prefers-reduced-motion` is respected for all CSS animations
