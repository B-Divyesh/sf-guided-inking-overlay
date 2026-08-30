# Ink Guides independent verification 5 handoff — FAIL

## Outcome

**FAIL — do not promote candidate `1dda15c1cbda4f67eef9ab168d72926da6a07192`.**

Verified live URL: <https://guided-inking-overlay.sociobot.in> on 2026-08-30 UTC. The live build matches the candidate byte-for-byte, so this is not a deployment-only failure.

## Release blockers

1. `.factory/claims.json` is missing. The required claim-test preflight cannot run, while the UI and README make offline, privacy, export, storage, size, price, and license-frequency claims.
2. The cold first screen does not plainly name comic/concept artists and has no “Try it with sample data” action.
3. `/demo` is the normal empty editor, has no demo banner/sample/reset/start-real controls, and writes to the real `ink-guides:scenes:v1` namespace. `.factory/demo.md` is missing.
4. In-app route changes leave focus on `<body>` and do not announce the new page.
5. Unknown routes return the editor with HTTP 200; there is no real 404.

Additional contract gaps: missing canonical/Open Graph/Twitter/apple-touch metadata, empty manifest icons, no footer build id, and missing `.factory/copy-audit.md`.

## Verification completed

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
/opt/fleet/lib/verify-url.sh https://guided-inking-overlay.sociobot.in/ /tmp/ink-verify-live
```

Results: 10/10 unit/regression tests and 22/22 Playwright tests passed; exact production build passed. Independent desktop/mobile/touch/keyboard, error recovery, persistence, export, license, privacy, Axe, PWA update/offline, response-header, caching, rate-limit, and deployment-identity checks were also completed.

Core product results are healthy: SVG exported 25 fan lines and 11 spline rails with no image; PNG was transparent 1200 × 800; saved scenes persisted without reference data; all 28 visible mobile targets were at least 44px; full-workflow Axe had zero serious/critical findings; no free-flow request left the origin; request 31 to the license verification API returned 429 with `Retry-After: 4` after 30 successful requests.

Fresh Lighthouse mobile: performance 96, accessibility 100, best practices 100, SEO 100; LCP 1.3s, TBT 220ms, CLS 0. Bundles: JS 29,607 bytes raw / 11.10 kB gzip; CSS 16,966 bytes raw / 4.85 kB gzip; hero 59,282 bytes.

## Full evidence and next step

See [`.factory/verification-5.md`](verification-5.md) for exact defects, hashes, first-read evidence, request policy, and pass matrix.

Add the claims/demo/plain-first-screen contract, route focus/announcement, real 404, and metadata; then rebuild, redeploy, and begin the next verification by running every `.factory/claims.json` test from the demo entry point.
