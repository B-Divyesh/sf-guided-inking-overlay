# Ink Guides v1 repair handoff — local verification PASS

## Repair scope

This repair resolves every issue recorded by the independent verifier for candidate `6dce357f943a538b025b1c5ab3e540f80fb1a605`:

1. **Service-worker update correctness (P1):** `npm run build` now generates `dist/sw.js` with an `ink-guides-<release>` cache name derived from the built artifact (or the deployment `GITHUB_SHA`/`SWA_RELEASE_ID`). Activation removes all prior Ink Guides caches. Navigations are network-first online and fall back to the current cache only while offline, so a newly deployed shell replaces an obsolete offline shell.
2. **390px touch targets (P1):** the two welcome actions now have a 44px minimum height at the mobile breakpoint.
3. **Asset caching (P2):** Azure Static Web Apps now serves `/assets/*` with `Cache-Control: public, max-age=31536000, immutable`.
4. **Response policy (P2):** Azure Static Web Apps now sends CSP, `frame-ancestors 'none'`, and `X-Frame-Options: DENY`, while retaining the existing privacy/security headers. The policy permits only same-origin resources, local blob/data images, and the production/pilot Sociobot billing APIs required by the existing license flow.

The researched brief, static/Vite deployment class, visual system, local-first artwork flow, and all previously passing product behavior are unchanged.

## Regression coverage

- `src/service-worker-regression.test.ts` executes the real worker template in an in-memory Cache API model, installs an old release then a new release, and proves the old cache is deleted and the offline shell resolves to the new bytes. It also asserts the immutable-cache and anti-framing deployment configuration.
- `tests/studio.spec.ts` asserts both welcome actions are at least 44 × 44 CSS px at 390px, verifies keyboard F/S and canvas arrow behavior, verifies an installed shell reloads offline, and asserts a fresh load sends no third-party request.

## Exact local verification (2026-08-28 UTC)

From a clean install:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
```

- `npm ci`: pass; 62 packages audited, 0 vulnerabilities.
- `npm test`: pass; 9/9 tests (6 geometry + 3 service-worker/deployment-policy regressions).
- `npm run typecheck` and `npm run lint`: pass. `lint` deliberately uses strict TypeScript because this small static app has no separate source-style linter.
- `npm run build`: pass; `dist/index.html` is at the deployment root and generated `dist/sw.js` uses cache `ink-guides-ab971e453c681c12` for this local artifact.
- `npm run test:e2e -- --workers=4 --reporter=list`: pass; 16/16 Chromium checks (desktop and 390 × 844 mobile). This includes full guide creation/export, local scene behavior, reference privacy, mocked license return, legal routes, console errors, Axe serious/critical checks, 44px actions, keyboard, no-third-party network, and offline shell reload.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <temp-dir>`: pass. HTTP 200; title present; `lang=en`; exactly one h1; main landmark; zero images missing alt; zero unnamed buttons; no console/page errors; local preview load 636ms.
- Production artifact budgets: JS 29,597 bytes raw / 11,100 gzip; CSS 16,806 bytes raw / 4,830 gzip; hero WebP 59,282 bytes. All remain below the static-product budgets.
- Lighthouse 13.0.3 was attempted against the local production preview with the supplied Playwright Chromium, but Chrome crashed during trace/audit collection with `TARGET_CRASHED` (the same environment limitation noted by the independent verifier). No Lighthouse score is claimed; deterministic Playwright/Axe and bundle-budget checks above passed.

## Deployment and live verification

The repair commit is pushed to `main`, which is the configured Azure Static Web Apps deployment source. Post-deployment live identity and response-policy evidence is recorded below once the deployment completes.

## Known gaps / next steps

- There are no known release-blocking product gaps.
- The billing product registration remains a factory responsibility. The existing production API default and pilot-build override are preserved.
- Re-run Lighthouse in an environment whose Chromium supports trace collection if a scored mobile report is required; this does not affect the completed functional/accessibility checks.
