---
description: "Ionic + Angular coding standards. Use when writing or reviewing Ionic pages, tabs, modals, native plugins (Capacitor), or mobile-specific UX patterns. Triggers: Ionic, Capacitor, ion-content, ion-header, IonPage, NavController, Geolocation, Camera, Platform, mobile, iOS, Android."
applyTo: "**/*.page.ts,**/*.page.html,**/*.page.scss"
---

# Ionic + Angular Standards

## Pages & Navigation

- Use `IonRouterOutlet` with Angular Router — never `NavController.push()` (Ionic 4+ pattern)
- Every page must implement `ionViewWillEnter` / `ionViewDidLeave` instead of `ngOnInit` / `ngOnDestroy` for lifecycle that depends on view visibility (tabs, modals keep component alive)
- Use `ionViewWillEnter` to refresh data when returning to a page — `ngOnInit` is only called once

```ts
// Bad — only fires once when using tab navigation
ngOnInit() { this.loadData() }

// Good — fires every time the page becomes visible
ionViewWillEnter() { this.loadData() }
```

## Capacitor (Native Plugins)

- Always check platform before calling native plugins: `if (this.platform.is('capacitor'))`
- Provide a web fallback for every native call — the app must work in browser for development
- Handle `PermissionState` explicitly — never assume permissions are granted

```ts
async takePicture() {
  if (!this.platform.is('capacitor')) {
    // Web fallback: file input picker
    return this.webFilePicker()
  }
  const permission = await Camera.checkPermissions()
  if (permission.camera !== 'granted') {
    await Camera.requestPermissions()
  }
  return Camera.getPhoto({ quality: 80, source: CameraSource.Camera })
}
```

## Performance (Mobile-critical)

- Use `trackBy` on all `*ngFor` with lists — re-renders are expensive on mobile
- Use `OnPush` change detection on every component — mandatory, not optional, for mobile perf
- Lazy-load every page module — never import page components directly in `AppModule`
- Avoid `ion-img` inside `*ngFor` without virtual scrolling for large lists (`ion-virtual-scroll` or CDK)

## Styling

- Use Ionic CSS variables for theming — never override Ionic component styles directly
- Use `safe-area-inset` for content that touches screen edges on iOS notch devices:
  ```scss
  padding-top: var(--ion-safe-area-top);
  ```
- Use `ion-content`'s `scrollEvents` only when needed — it's expensive on scroll

## Forms

- Use Reactive Forms — same standard as Angular, plus `ion-input` wraps `formControlName` directly
- Show validation errors via `ion-note color="danger"` below the `ion-item`

## Security (Mobile)

- Never store tokens in `localStorage` on mobile — use `@capacitor/preferences` (encrypted on iOS/Android)
- Validate deep link parameters before routing — they can be spoofed
- Use Capacitor's `SecureStorage` or `@ionic-enterprise/identity-vault` for sensitive data
