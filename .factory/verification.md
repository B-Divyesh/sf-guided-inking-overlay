# Independent verification — FAIL

- **Candidate:** `6dce357f943a538b025b1c5ab3e540f80fb1a605` (`Verify accessibility and document release`)
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-28 UTC, from a clean, clean-status checkout at the candidate.
- **Scope:** static-web acceptance contract, researched brief, desktop Chromium and 390 × 844 touch/mobile Chromium.

## Release decision

**FAIL — do not promote this candidate.** The product is otherwise functional, private-by-default, and the deployed bytes are exactly this candidate, but two release-gate defects remain. The PWA update defect is especially important because an existing installation can remain on an obsolete cached app shell indefinitely.

## Blocking defects

### P1 — service-worker updates retain an obsolete app shell

`public/sw.js` uses the fixed cache name `ink-guides-v1` and handles all same-origin GETs cache-first. During activation it deletes only cache names *other than* `ink-guides-v1`. Therefore a newly installed worker reuses the old cache rather than invalidating/replacing its cached `/` shell and assets. A returning offline user can continue to receive the old `index.html` and old hashed bundle after a deployment. This fails the required PWA service-worker-update check.

Evidence: production is controlled by `https://guided-inking-overlay.sociobot.in/sw.js` and exposes cache `ink-guides-v1`; the exact candidate contains the fixed cache constant and unchanged-cache activation logic. Current-version offline reload itself works after a successful online visit, but update correctness does not.

### P1 — 390px welcome actions violate the required 44px touch target

At the required 390px viewport, both first-run actions measure **153.5 × 38 CSS px**: “Choose reference” and “Start transparent”. The product/accessibility contract requires touch/click targets of at least 44 × 44 CSS px. The cause is the mobile rule `.canvas-welcome button { min-height: 38px; }`.

## Non-blocking findings

### P2 — deployed hashed assets are not immutably cached

The live JS, CSS, and WebP response headers are `Cache-Control: public, must-revalidate, max-age=30`. The performance contract calls for long-lived immutable caching of hashed assets. The build correctly gives JS/CSS content hashes, but the deployment response policy forfeits that benefit.

### P2 — no Content-Security-Policy or frame-ancestors response policy

The live response supplies HSTS, `nosniff`, Referrer-Policy, and Permissions-Policy, but no CSP or anti-framing header. This is not an observed exploit and does not affect the local-first flow, but should be tightened before release.

## What passed

### Reproducible build and repository checks

| Check | Result |
| --- | --- |
| `npm ci` | Pass; 60 packages audited, 0 vulnerabilities |
| `npm test` | Pass; 6/6 Vitest geometry tests |
| `npm run build` | Pass; strict TypeScript check and Vite production build |
| `npm run test:e2e` | Pass; 8/8 Playwright desktop + 390px mobile tests |
| Lint/type commands | No lint script is defined; TypeScript is run by `npm run build` |

Production output: JS 29,597 bytes raw / 11,100 gzip (under 200 KB), CSS 16,806 bytes raw / 4,830 gzip (under 50 KB), hero WebP 59,282 bytes (under 300 KB).

### Representative product exercise

- Created a normal spline and its offset rails; exercised fan density, rotation, spread, rail count, and spacing at boundary values: 25, -180°, 30°, 11, and 64px.
- Exported SVG: `ink-guides-layer.svg` had 25 fan `<line>`s and 11 rail `<path>`s, with no `<image>`; confirms reference artwork is excluded. Exported PNG was transparent 1200 × 800.
- Rejected an invalid text “image” with a clear message, then successfully recovered by importing a valid PNG. Empty scene name failed native validity with a clear message. Saving a fourth free scene retained the 3/3 limit and opened the Studio panel.
- Verified keyboard focus, `F`, arrow, and Shift+arrow fan adjustment; undo enabled. Used Chrome DevTools touch input to draw a spline successfully at 390px. No horizontal overflow at 390px.
- Mocked invalid then valid license verification: invalid remained locked with an explanatory status; a subsequent valid token unlocked Studio and 2400 × 1600 PNG, and device removal relocked it.
- Current-version PWA offline reload passed after online load. Reduced-motion CSS resolves transitions to `0.01ms` and `scroll-behavior: auto`.

### Accessibility, privacy, and browser checks

- Axe (`@axe-core/playwright`) found **0 serious/critical** violations on desktop and 390px mobile; the repository’s desktop/mobile Axe test also passed.
- Desktop and live production runs had no console errors or page errors. The skip link is first in tab order and exposes a 3px visible outline; the canvas remains keyboard-focused for arrow adjustment.
- Fresh production navigation made only same-origin document, JS, CSS, and hero-image requests. Source audit found no analytics, advertising, third-party scripts, CDN fonts, or artwork-upload path. Reference import uses a local blob; scenes and licenses use localStorage. Billing is only contacted after a license is supplied.
- Live response policies observed: HTTPS/HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

### Deployment identity

The live deployment matches the candidate byte-for-byte. SHA-256 comparisons matched for `index.html`, `assets/index-D-OApyc8.js`, `assets/index-BnsOvF-t.css`, `assets/hero-paper-diorama.webp`, `sw.js`, and `site.webmanifest`. A fresh live browser run returned HTTP 200, the expected title, successfully created one spline, registered the service worker, made no external requests, and had no console/page errors.

## Measurement note

An independent Lighthouse 12.8.2 mobile run against the local production preview reached audit collection but the supplied headless Chromium crashed during the final screenshot/BFCache collection (`TARGET_CRASHED`), so no score is reported as evidence. The deterministic bundle-budget and Playwright/Axe checks above completed successfully.

## Required next steps

1. Version service-worker caches per build/release, remove obsolete caches on activation, and add an automated two-version upgrade test that proves a prior cached shell is replaced.
2. Restore both 390px welcome actions to at least 44px high and add a mobile target-size assertion.
3. Configure immutable caching for hashed assets and add CSP plus frame protection at the deployment layer.
4. Rebuild, redeploy, and rerun this verification; do not mark the handoff PASS until the P1 defects are resolved.
