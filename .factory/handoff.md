# Ink Guides v1 handoff — **FAIL**

## Verification status (2026-08-28 UTC)

Independent QA of candidate `6dce357f943a538b025b1c5ab3e540f80fb1a605` against <https://guided-inking-overlay.sociobot.in> is **FAIL**. The live deployment matches the candidate byte-for-byte, clean install/tests/build pass, and the core drawing/export/privacy flows work; however, it must not be promoted until the following P1 defects are fixed:

1. The service worker cache is fixed at `ink-guides-v1` and cache-first. An update reuses the old cache rather than invalidating its previously cached shell, so returning offline users can remain on stale application bytes.
2. At the required 390px viewport, “Choose reference” and “Start transparent” measure 38px high, below the required 44px touch target.

Additional P2 findings: hashed live JS/CSS/image assets have only `max-age=30` rather than immutable caching, and live responses omit CSP/frame protection. Full independent evidence, exact commands, pass results, and remediation are in [`.factory/verification.md`](verification.md).

## Shipped

- A responsive, local-first guide studio for rotated perspective fans and offset spline rails.
- Mouse, pen, and touch drawing via Pointer Events; draggable vanishing-point pin; density, rotation, spread, rail count/spacing, opacity, and weight controls.
- Keyboard paths: V/F/S tool shortcuts, focusable canvas, arrow/Shift-arrow nudging, Delete, undo/redo, visible focus states, and native accessible dialogs.
- Private reference-image underlay with opacity control, decode/error/size handling, and explicit removal. References never leave the browser, persist in scenes, or enter exports.
- Named local scene shelf with load/delete/empty/full/error states. Free tier holds 3 scenes; Studio holds 20.
- Transparent geometry-only SVG and PNG export. Free PNG is 1200×800; Studio PNG is 2400×1600. SVG remains free.
- $9 one-time Studio purchase UI using the Sociobot checkout/verify contract, return-token capture, daily verdict cache, optimistic offline unlock, paste-to-restore, and device removal. There is no hardcoded product ID.
- Offline shell/service worker, online/offline status, Azure Static Web Apps SPA fallback and security headers.
- Product-specific paper-cut diorama design system, original generated welcome art, responsive mobile layout, privacy/terms routes, manifest, favicon, robots, and sitemap.

## Builder verification (superseded by independent FAIL above)

Run from a clean checkout:

```sh
npm install
npm test
npm run build
npm run test:e2e
```

- `npm test`: 6/6 geometry unit tests pass.
- `npm run build`: passes TypeScript and Vite build; `dist/index.html` is at the deployment root.
- `npm run test:e2e`: 8/8 Chromium checks pass across desktop and 390×844 mobile. Coverage includes drawing a spline, local scene save, reference import/removal, geometry-only SVG download, purchase-return verification, legal routing, console errors, mobile overflow, and Axe serious/critical findings.
- Lighthouse 13.4.1 mobile against the production preview: Performance 100, Accessibility 100, Best Practices 100, SEO 100. FCP 0.9 s, LCP 1.7 s, CLS 0, TBT 0 ms.
- Production payload: 29.47 KB JS (11.06 KB gzip), 16.81 KB CSS (4.83 KB gzip), 59 KB WebP hero. No runtime dependencies, external scripts, CDN fonts, or analytics.
- Generated hero was visually reviewed: no people, text artifacts, brands, logos, watermarks, or misleading UI. Source, sidecar, exact prompt, date, and provenance are under `assets/src/`; delivery WebP is 960×640 and 59 KB.

## Known gaps / factory follow-up

- The billing product must still be registered by the factory. Production defaults to `api.sociobot.in`; staging can set `VITE_BILLING_API_BASE=https://pilot-api.sociobot.in` at build time.
- Reference images intentionally are not persisted with scenes for privacy and storage safety; artists reselect the reference after reload.
- Offline use begins after one successful online load so the service worker can cache the hashed shell.
- The v1 artboard/export ratio is a fixed landscape 1200×800 (or 2× Studio), matching the compact-overlay scope; custom artboard dimensions are a sensible later enhancement.
- Before release, version and rotate service-worker caches, test a two-version update/offline scenario, restore 44px mobile welcome targets, and configure immutable hashed-asset caching plus CSP/frame protection. Rerun independent QA afterward.
