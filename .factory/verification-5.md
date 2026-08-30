# Independent verification 5 — FAIL

- **Candidate:** `1dda15c1cbda4f67eef9ab168d72926da6a07192`
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-30 UTC from a clean-status checkout at the exact candidate SHA
- **Contract:** original work order and brief plus the supplied claims, demo, plain-words, accessibility, site-structure, privacy, paid-unlock, and performance requirements
- **Form factors:** desktop Chromium at 1440 × 900 and mobile/touch Chromium at 390 × 844

## Release decision

**FAIL — do not promote this candidate.** The deployed bytes exactly match the candidate and the core guide editor is functional, but both explicit preflight acceptance gates fail: `.factory/claims.json` is missing, and the first screen has neither a plain statement of the intended artist nor a one-click sample-data demo. These are product-source omissions, not a deployment-only failure.

## Defects by severity

### P0 — mandatory claim registry and claim tests are absent

The very first clean-clone check found no `.factory/claims.json`. Therefore no declared claim command exists to run through the required demo entry point. The claims contract says a missing registry or any failing claim test blocks release.

This is not an app with no claims. Unregistered claim-like statements include:

- live UI: “Works offline,” “Your reference never leaves this browser,” “Save geometry locally. References are never stored,” and “Exports contain guide geometry only—never your reference”;
- paid-tier statements: three free scenes, 20 Studio scenes, 1200 × 800 free PNG, 2400 × 1600 Studio PNG, and a $9 one-time purchase;
- README/privacy statements: offline after the first visit, no analytics/third-party scripts/CDN fonts/artwork uploads, local storage behavior, and at-most-daily license verification.

All of these lack the required one-to-one `@claim:<id>` test registration. The repository also lacks `.factory/copy-audit.md`, so the required plain-language copy audit was not performed.

### P0 — first-read and one-click demo gates fail

Cold live-page evidence:

- H1: “Lay down the line. Keep the flow.” This is metaphorical and does not name the job.
- Supporting sentence: “Build rotated perspective fans and repeatable curved rails over any reference—then take clean guide layers back to your art app.” This explains the mechanism, but never plainly says it is for comic and concept artists.
- First actions: “Choose reference” and “Start transparent.” There is no “Try it with sample data” action and no explanation of what a sample click will show.

First-read answer: it creates reusable perspective fans and curved rails over a reference; the intended user is not stated in the first screen; the apparent first click is “Choose reference,” but there is no sample path. It therefore does not answer what/for whom/what first in the mandatory shape.

Direct `/demo` evidence confirms the missing sandbox: `/demo` returns HTTP 200 but mounts the ordinary empty editor, has no sample action, no “Demo — sample data, nothing is saved” banner, and shows `0 / 3` scenes. Saving “Demo namespace probe” there writes the real key `ink-guides:scenes:v1`, not a `demo:` namespace. `.factory/demo.md` is also missing.

### P1 — SPA route changes are not announced or focused

Following the in-app Privacy link replaces the page but leaves focus on `<body>`. The new `<h1>` is not focused and there is no route-announcement live region. This fails the explicit screen-reader routing contract. Native dialog focus behavior did pass: the unlock dialog focuses its close button, traps focus, closes with Escape, and returns focus to the opener.

### P1 — there is no real 404 route

`/not-a-real-route` returns HTTP 200, the normal editor title, and the normal editor H1. The repository has no `404.html`, and the deployment policy has no 404 response override. This fails the required designed 404 with a way home.

### P2 — required sharing/route metadata and handoff identity are incomplete

The live root has a valid title and description but no canonical link, Open Graph title/image, Twitter card, or apple-touch icon. The web manifest parses without errors but has an empty `icons` array. The footer does not expose a version/build id. These are required by the site-structure contract.

## Mandatory clean-clone gates

| Check | Fresh result |
| --- | --- |
| Claim preflight | **Fail:** `.factory/claims.json` missing; no claim tests available |
| `npm ci` | Pass; 61 packages installed, 62 audited, 0 vulnerabilities |
| `npm test` | Pass; 10/10 Vitest tests |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass; repository lint command is strict TypeScript |
| `npm run build` | Pass; exact production build created `dist/` |
| `npm run test:e2e -- --workers=4 --reporter=list` | Pass; 22/22 desktop/mobile Playwright tests |
| `/opt/fleet/lib/verify-url.sh` | Pass live in 792ms and local preview in 587ms; title/lang/one h1/main/alt/button/console checks clean |

Production output is comfortably within budget: JavaScript 29,607 bytes raw / 11.10 kB gzip, CSS 16,966 bytes raw / 4.85 kB gzip, hero WebP 59,282 bytes, and no font files. Hashed assets are served with `public, max-age=31536000, immutable`; HTML and the worker use 30-second revalidation.

## Independent end-to-end product exercise

The independent harness was separate from the repository suite and was removed after use.

- Started transparent, exercised all declared control boundaries (25 fan lines, -180° rotation, 30° spread, 11 rails, 64px spacing, 20% opacity, 6px weight), aimed with keyboard arrows, and drew a spline with mouse.
- Drew a spline at 390px using real Chrome touch events. The canvas reported `9 fan lines · 1 spline`.
- Exported SVG contained exactly 25 `<line>` elements and 11 `<path>` elements with no `<image>`. Exported PNG was 1200 × 800, TrueColorAlpha, with a transparent corner.
- Rejected a text file, corrupt PNG, and 25 MB + 1 byte file with actionable messages, then recovered with a valid WebP and no console error.
- Empty scene names produced “Name this scene so you can find it later.” Three scenes saved; a fourth remained absent and opened the honest Studio dialog. Saved JSON contained geometry but no reference filename, blob URL, or image data.
- A saved 17-line scene survived reload and restored its density and summary correctly.
- A real invalid license stayed locked, kept the free 1200 × 800 PNG, and showed recovery text. The buy link is the required Sociobot checkout URL.

The smallest useful brief workflow therefore works, including mouse, pen-style pointer logic, touch, keyboard, scene persistence, local reference import, and SVG/PNG export. Library/CLI consumer testing is not applicable. This static product has no product backend or sign-in flow, so persistence-boundary, concurrency, health endpoint, and Entra checks are not applicable.

## Accessibility, mobile, and visual evidence

- Independent Axe scans after the full workflow and repeated tool changes, at 390px, with the license dialog open, and on `/privacy` found **0 serious or critical** findings.
- The skip link is first in tab order and has a visible 3px cyan focus outline. Keyboard shortcuts, canvas arrow/Shift+arrow movement, modal Escape/focus return, and native range interaction work.
- All 28 visible interactive targets after mobile reference import measured at least 44 × 44 CSS px. The cold mobile actions were 153.5 × 44px. There was no horizontal overflow.
- Reduced motion resolved smooth scrolling to `auto` and transition duration to `0.01ms`; nothing loops or flashes.
- Desktop and full mobile screenshots were visually reviewed. The paper-cut drafting identity matches `.factory/design.md`, content is legible, and no core control is clipped or hidden. The first-screen copy/demo failures above remain.

`<html lang="en">`, one `<h1>`, header/main/footer landmarks, labels, alt text, legal pages, and initial console cleanliness all pass. The P1 route-focus defect is not detected by Axe.

## Privacy, requests, headers, and endpoint allowance

The complete free workflow, including reference import and both exports, made only same-origin requests. There were no analytics, ads, beacons, websockets, remote scripts/fonts, or artwork uploads. The only cross-origin product call observed was the explicit invalid-license verification to `api.sociobot.in`; it returned the documented invalid verdict and CORS origin.

Live root headers include HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options: DENY`, and a CSP with response-header `frame-ancestors 'none'`. The CSP permits only self/blob plus the documented Sociobot production/pilot connections.

Fresh sequential allowance test against the product verification endpoint:

- requests 1–30: HTTP 200, `Cache-Control: no-store`, `{valid:false, reason:"invalid"}`;
- request 31: HTTP 429, `Retry-After: 4`, body `Too Many Requests! Wait for 4s`.

Observed allowance: **30 successful requests per burst per client**, then 429 with `Retry-After`.

## PWA and performance

- Current live cache: `ink-guides-74d2e4355f2013a8`.
- A separately scoped installation of the current worker removed a seeded `ink-guides-old-sentinel-2` cache during activation, confirming update cleanup.
- After online install, a true offline reload retained the expected title and H1.
- Chromium parsed the manifest without errors. Its missing icons are recorded under P2.

Fresh Lighthouse 12.8.2 mobile results:

| Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 96 | 100 | 100 | 100 | 1.3s | 220ms | 0 |

Lighthouse does not report lab INP. It emitted no run warnings.

## Deployment identity

Fresh SHA-256 comparisons matched local `dist/` and production exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `8a651b3bf460866d632f0abd4f59b7a8b1709e55bc65d827bee7239219ed6e06` |
| `sw.js` | `86af60f03f702b506288e598e43945406fefde23ba47836ed23af8cf9476a0cb` |
| `site.webmanifest` | `f163e12fe0b306b6472cfa3151f4e3f503e25f9ded05bd7c86664f1b517a5223` |
| `assets/index-C2a9TfwX.js` | `08833ba474ec12bd0f335573c4c1e39b3f43921fe767f33dbef2d44ffe897b43` |
| `assets/index-DYbs0gY3.css` | `31d168fe72a98b762d0cb9002103bf766dcc2c4dc9251d33b8fdc8c8f8cc8ac7` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |

The live deployment does match candidate `1dda15c…`. The release decision is based on fresh contract evidence, not deployment skew.

## Required next verification

Add the claim registry and one observable demo-based test per public claim; build an isolated one-click sample demo and document it; replace the metaphorical first screen with the required plain job/user/action/facts structure; repair SPA focus/announcement behavior; add a real 404; complete required metadata; then rebuild, redeploy, and rerun every claim test before any other verification step.
