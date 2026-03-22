---
description: "Angular coding standards. Use when writing or reviewing Angular components, services, directives, pipes, guards, or modules. Triggers: Angular, NgModule, @Component, @Injectable, @Directive, @Pipe, RxJS, Observable, NgRx, standalone component."
applyTo: "**/*.{component,module,service,guard,pipe,directive,resolver,interceptor}.ts"
---

# Angular Standards

## Components

- Prefer **standalone components** (Angular 17+) over NgModule declarations
- Use `OnPush` change detection by default — opt into `Default` only when justified
- Component template logic must be minimal — no method calls in interpolation (use `async` pipe + `$`)
- Split smart (container) components from dumb (presentational) ones

## Services & DI

- Mark services `{ providedIn: 'root' }` unless scoped to a feature module
- Inject with `inject()` function (Angular 14+) in constructors or field initializers
- Services must implement a single domain concern — no "utility" services with 20 unrelated methods
- **Feature components must not inject services from foreign domains** — e.g. a `TodoListComponent` must not inject `AuthService` for logout/display name. Extract a `HeaderComponent` or `ShellComponent` that owns user identity; feature components depend only on their own domain service.

## App Configuration (`app.config.ts`)

- Always include `withComponentInputBinding()` in `provideRouter()` — without it, routed components cannot use `@Input()` to receive route params and are forced to inject `ActivatedRoute` everywhere
- Always provide a global `ErrorHandler`:
  ```ts
  { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ```
  Without it, uncaught runtime errors are silently swallowed with no user feedback or observability hook.

## RxJS

- Unsubscribe via `takeUntilDestroyed()` (Angular 16+) or `async` pipe — never manual `.unsubscribe()` in `ngOnDestroy` unless necessary
- **Every `subscribe()` call in a component must be piped with `takeUntilDestroyed(this.destroyRef)`** — otherwise the callback fires on destroyed instances and causes `ExpressionChangedAfterItHasBeenCheckedError` under `OnPush`:
  ```ts
  private destroyRef = inject(DestroyRef);

  this.service.loadItems().pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(...);
  ```
- **Use `switchMap` with a `Subject` for user-triggered loads** — cancels in-flight requests on re-trigger, preventing stale responses overwriting fresh ones
- **Subscribe to the live `route.paramMap` observable, not `route.snapshot.paramMap`** — snapshot is a one-time read; if Angular reuses the component across sibling routes, `ngOnInit` is not re-called and stale data is shown
- Prefer `combineLatest`, `switchMap`, `mergeMap` patterns over nested subscribes
- Never `subscribe()` inside another `subscribe()`
- Handle errors in streams with `catchError` — never let streams die silently

## Forms

- Use **Reactive Forms** for any form with validation or dynamic controls
- Use **Template-Driven Forms** only for trivial single-field cases
- Validate at the form-group level — keep validators pure functions
- Always declare `Validators.maxLength` on free-text inputs — never leave string fields unbounded
- Use `NonNullableFormBuilder` to avoid nullable form values throughout
- **Always reset loading/submitting state with `finalize()`** — never reset only in `next()`, which skips the reset on error:
  ```ts
  // ❌ Wrong — isSubmitting stays true on error
  this.service.submit(data).subscribe({ next: () => this.isSubmitting.set(false) })

  // ✅ Correct — always resets
  this.service.submit(data).pipe(
    finalize(() => this.isSubmitting.set(false))
  ).subscribe({ next: () => this.router.navigate(['/home']) })
  ```

## Security

- Use Angular's built-in `HttpClient` — it handles XSRF tokens automatically
- Never bypass DomSanitizer — trust only known-safe HTML
- Validate and sanitize all route params and query params before use
- **Never store JWT tokens in `localStorage`** — accessible to any JS on the page (XSS exfiltration). Prefer `httpOnly; Secure; SameSite=Strict` cookies set by the server. If cookies are not possible, use `sessionStorage` (cleared on tab close) as a fallback.
- **HTTP interceptors: compare origins with the `URL` API, not `startsWith()`** — a URL like `http://api.example.com.evil.com` matches a `startsWith('http://api.example.com')` check and would leak the Bearer token:
  ```ts
  const reqUrl = new URL(req.url);
  const apiUrl = new URL(environment.apiUrl);
  if (token && reqUrl.origin === apiUrl.origin) { /* attach token */ }
  ```
- **Do not use client-side JWT parsing for access-control decisions** — the frontend cannot verify the JWT signature. Route guards may read the `exp` claim for UX (redirect before making a doomed call), but the actual authorization decision is always enforced server-side.
- **Password fields must declare `Validators.maxLength(128)`** — unbounded password strings cause bcrypt to process megabytes of input on the server (CPU DoS).

## Testing

| What to test | Tool | Notes |
|---|---|---|
| Service (no DOM) | plain `jasmine` / `jest` + `jasmine.createSpyObj` | No `TestBed` needed — instantiate directly |
| Component (isolated) | `TestBed` + `ComponentFixture` | Stub child components with `NO_ERRORS_SCHEMA` or stub class |
| Component (with template) | `TestBed` + `screen` queries or `fixture.debugElement` | Use `ByCSS`/`ByDirective` selectors |
| HTTP service | `HttpClientTestingModule` + `HttpTestingController` | Call `verify()` after each test |
| Guards / resolvers | instantiate with mock router + `ActivatedRouteSnapshot` | |

```ts
// Service — no TestBed
it('should map dto to domain', () => {
  const service = new UserMapper()
  const result = service.toDomain({ id: '1', full_name: 'Ada' })
  expect(result).toEqual({ id: '1', name: 'Ada' })
})

// Component with async observable
it('should display user name when loaded', fakeAsync(() => {
  // Arrange
  const fixture = TestBed.createComponent(UserCardComponent)
  const service = TestBed.inject(UserService)
  spyOn(service, 'getUser').and.returnValue(of({ id: '1', name: 'Ada' }))

  // Act
  fixture.detectChanges()
  tick()
  fixture.detectChanges()

  // Assert
  expect(fixture.nativeElement.querySelector('h2').textContent).toContain('Ada')
}))
```

- Use `fakeAsync` + `tick()` for observables and timers — not `done` callbacks
- Use `OnPush` components with `fixture.detectChanges()` to control CD
- Always call `TestBed.configureTestingModule` with only what the component actually needs

## Example

```ts
// Bad — default CD, nested subscribe
@Component({ selector: 'app-user', template: '...' })
export class UserComponent implements OnInit {
  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.orderService.getOrders(user.id).subscribe(orders => {
        this.orders = orders
      })
    })
  }
}

// Good — OnPush, combineLatest, async pipe
@Component({
  selector: 'app-user',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<div *ngIf="vm$ | async as vm">{{ vm.orders.length }} orders</div>',
})
export class UserComponent {
  private userId$ = this.route.params.pipe(map(p => p['id']))

  vm$ = this.userId$.pipe(
    switchMap(id => combineLatest({
      user: this.userService.getUser(id),
      orders: this.orderService.getOrders(id),
    })),
    catchError(() => EMPTY),
  )
}
```
