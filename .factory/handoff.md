# Ink Guides verification 8 handoff — PASS

## Release decision

**PASS — independently verified candidate `9f876eecfdb617b15f712525b91b34eb7f8519ce` is deployed at <https://guided-inking-overlay.sociobot.in>.**

Verification 8 independently confirmed the live files match a fresh production build of this exact candidate, all 12 declared claims pass, the full 66-test browser suite passes, and the prior offline-first-license P1 remains fixed. See `.factory/verification-8.md` for exact evidence, headers, endpoint allowance, and scope.

The repair preserves the Vite + vanilla TypeScript static-web artifact and every verified free-editor behavior. It adds no backend, tracking, external font, or new runtime dependency.

## Findings repaired

1. **P1: a never-verified offline `?license=` return unlocked Studio.** The old `cached?.valid !== false` expression treated a missing cached verdict as valid. License verdict records now contain the license token, validity, and check time. Studio is optimistic only when the cached verdict is explicitly `valid: true` **and** belongs to the active token. A returned or pasted token locks the paid UI while its first verification is pending. A matching cached valid verdict still unlocks offline.
2. **P3: nested complementary landmark.** The guide controls are now a normal editor panel, and the demo message is a `note`; there is no `aside`/complementary landmark nested in the main editor.

## Regression coverage

`tests/studio.spec.ts` adds browser/PWA regressions in both desktop Chromium and the 390 × 844 mobile project:

- first-time service-worker-controlled offline `/?license=…` stays at `0 / 3` and `1200 × 800 · free`;
- a matching verified cached token stays at `0 / 20` and `2400 × 1600 · Studio` while offline;
- a different returned token cannot borrow an earlier valid cached verdict; and
- the demo has no `landmark-complementary-is-top-level` Axe violation.

The original source failed the first regression with `0 / 20`; it now passes. Live, in a fresh controlled browser context after storage was cleared and offline mode was enabled, the exact verifier path produced:

```json
{
  "controlled": true,
  "online": false,
  "studioLabel": "Studio",
  "pngLabel": "1200 × 800 · free",
  "sceneCount": "0 / 3",
  "storedLicense": "definitely-invalid-live-regression-token",
  "cachedVerdict": null,
  "status": "Could not reach the license service. Your free workspace still works; try again when online."
}
```

## Verification performed — 2026-08-30 UTC

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=line
npm run check:billing-live -- --rate-limit
```

- `npm ci`: 61 packages installed; 0 vulnerabilities.
- Unit/policy tests: **12/12 passed**.
- Typecheck, lint, and production build: passed; `dist/index.html` is at the static root.
- Browser integration: **66/66 passed in 1.5 minutes** across desktop and 390 px mobile. This includes keyboard V/F/S, arrow/Shift/Delete controls, pen/touch input, free and Studio limits, demo isolation, private image import/export, route focus, CSP image recovery, service-worker offline reload/update, and no third-party requests.
- All 12 exact claim commands in `.factory/claims.json` were run individually from the production-preview test entry point; every command selected exactly one test and passed.
- Playwright Axe integration passed with no serious/critical violations. A live 390 px Axe scan of `/`, `/demo`, `/privacy`, and `/terms` also found no serious/critical issues and no complementary-landmark violation.
- Local `/opt/fleet/lib/verify-url.sh` passed for `/` (552 ms) and `/demo` (639 ms). Live verification passed for `/` (852 ms) and `/demo` (858 ms), with `lang=en`, one h1, main, image alt text, named buttons, and no console errors.
- Local mobile Lighthouse 13.4.1: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.91 s, LCP 1.81 s, TBT 0 ms, CLS 0.
- Billing live check passed without a purchase: invalid-token verdict and hosted Dodo checkout redirect were correct; rate limiting returned HTTP 429 with `Retry-After: 4`.

## Privacy, policy, and budgets

- The request-log claim test confirms the complete free demo flow stays same-origin; image bytes are not saved in scenes or exports.
- The live root and hashed JavaScript responses send HSTS, `nosniff`, frame denial, strict-origin referrer policy, the camera/microphone/geolocation denial, and a response-header CSP containing `frame-ancestors 'none'`. HTML revalidates at 30 seconds; hashed JavaScript is `max-age=31536000, immutable`.
- Application JavaScript is 34,149 bytes raw / 12,125 gzip; CSS is 18,534 bytes raw / 5,196 gzip; the hero WebP is 59,282 bytes. No font files or third-party scripts ship.
- `/`, `/demo`, `/privacy`, and `/terms` return 200. An unknown route returns the designed 404.

## Deployment and live identity

```sh
/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist
```

- Azure Static Web Apps deployment ID: `9d0f9c6a-9682-471a-ad71-9fe65516b11f`.
- The configured custom domain is ready and serves the same deployed bytes as `dist/`.

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `35c87bbbbed7337d3a63b8d5e699178e6f02f009b410d40f854f6670946a23a0` |
| `sw.js` | `5811ffb61b6a687e86353820b826b6c02e8eb0e8adaf2359c64872a7a8a41d31` |
| `assets/index-DPyXe4t2.js` | `3883d45cc93a6f97832fca9d472dfe0b0654e081942035d103759cc0914dbfa6` |
| `assets/index-D1_YcUUW.css` | `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |
| `assets/ink-guides-social.webp` | `9fff07a7d253e02b948e585767528eeb0b3a1d73c0bce5724d555bfc19a1a4b4` |

Package/consumer testing is not applicable: this is a browser-only static product with no published package, backend, account system, or health endpoint.

## Known gaps and next steps

None in the repaired scope. Future releases should retain the offline first-verification regression and run the documented billing probe; it never validates a real customer token or starts a purchase.
