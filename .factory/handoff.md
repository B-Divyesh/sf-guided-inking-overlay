# Ink Guides verification 7 handoff — FAIL

## Current independent release decision

**FAIL — do not promote candidate `a2bf1c0f6007360ee24e25bbfb0d2bafe9966684`.** Fresh live verification at <https://guided-inking-overlay.sociobot.in> reproduced a P1 paid-access defect: after the service worker is installed, clearing storage, going offline, and opening `/?license=definitely-invalid-verifier-token`, an unverified token receives Studio UI (`0 / 20` scenes and `2400 × 1600 · Studio`) despite no cached valid verdict. The status says the license service could not be reached. This violates the paid-unlock contract.

The exact reproduction, full test evidence, claim results, P3 Axe note, live parity hashes, headers, PWA result, and billing allowance are in `.factory/verification-7.md`.

Required next step: make only an explicitly cached **valid** license verdict eligible for optimistic offline Studio access, add an offline first-verification regression, rebuild/redeploy, then re-run verification.

---

## Outcome

Repair commit: `73e2eec7fa64801ac545d01492124cffed99a859` (`fix: make claims clean-checkout reproducible`).

Verification 6 found two P1 failures. Both now have fresh evidence:

1. **Clean-checkout claims:** Playwright now runs `npm run build` before `vite preview`, so every exact `.factory/claims.json` command is self-sufficient when `dist/` does not exist. `src/release-contract.test.ts` locks that contract in place.
2. **Studio billing:** The required Sociobot endpoints have recovered. `scripts/check-billing-live.mjs` is a no-purchase live regression check: it uses only an invalid generated token, checks the production CORS verdict and Dodo checkout redirect, and can probe the documented allowance.

The static-web artifact and product behavior are preserved. No artwork or reference image leaves the browser; no backend or package artifact was introduced.

## Clean verification — 2026-08-30 UTC

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
npm run check:billing-live -- --rate-limit
```

- Clean install: 61 packages installed, 62 audited, 0 vulnerabilities.
- Unit/policy tests: 12/12 passed, including the clean-checkout test-server regression.
- Typecheck and lint: passed.
- Production build: passed; `dist/index.html` is at the required static root.
- Claims: all 12 exact commands in `.factory/claims.json` passed one at a time after `npm ci` with `dist/` intentionally absent before the first command. Each command built and served its own production preview.
- Browser integration: 58/58 Playwright tests passed with four workers across desktop Chromium and the 390 × 844 mobile project.
- Accessibility: Playwright Axe found zero serious/critical issues across editor, demo, Studio dialog, and privacy routes in both projects. Coverage includes one h1, landmarks, route focus/live announcements, keyboard V/F/S, arrows, Shift movement, Delete, 44 px mobile targets, actual pen and touch drawing, and reduced-motion behavior.
- Privacy/offline/update: the free demo request log is same-origin only; reference bytes do not enter scene storage or exports; the fresh-context offline demo reload and service-worker upgrade/cache tests passed.
- Local production smoke: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/` passed in 630 ms with title, `lang=en`, one h1, main, image alts, named buttons, and zero console errors.
- Local response policy: preview returned the configured CSP with `frame-ancestors 'none'`, `nosniff`, frame denial, strict-origin referrer policy, permissions denial, and immutable hashed-asset caching.
- Lighthouse 12.8.2 mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.81 s, TBT 0 ms, CLS 0.

## Budget and artifact evidence

- JavaScript: 33,949 bytes raw / 12,165 gzip.
- CSS: 18,534 bytes raw / 5,210 gzip.
- Hero WebP: 59,282 bytes. Social WebP: 83,106 bytes.
- No font files or third-party scripts are shipped.

Package/consumer testing is not applicable: this is a browser-only static product with no published package, server API, account system, or health endpoint.

## Billing and live deployment

```sh
/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist
```

Azure Static Web Apps deployment ID: `f34261b4-803e-4ed0-84dc-fe6ec4620c2b`.

- Live `/`, `/demo`, `/privacy`, and `/terms` return HTTP 200. An unknown route returns the designed HTTP 404.
- Live `/opt/fleet/lib/verify-url.sh` passed for `/` (778 ms) and `/demo` (957 ms), with zero console errors, valid titles, `lang=en`, one h1, main landmarks, image alts, and named buttons.
- A live 390 px `/demo` Axe scan found zero serious/critical findings and zero console errors.
- `npm run check:billing-live -- --rate-limit` passed against `https://api.sociobot.in`: an invalid token received the JSON invalid verdict with production-origin CORS and `Cache-Control: no-store`; checkout returned the hosted Dodo redirect; the single-client probe observed HTTP 429 with `Retry-After: 4` seconds.
- Live headers include HSTS, `nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, the documented permissions policy, a response-header CSP with `frame-ancestors 'none'`, and immutable cache policy on hashed JavaScript.

Local and production artifact SHA-256 values match:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0b6bc17d30cc30cbe68703b26d3f91eec1bd661fe6fa61681c30daf73aa52246` |
| `sw.js` | `8dbfaebd9cacc047d9a7e7e48c9841865f9f27c3dc36ff9f138ad06c93b14c1b` |
| `site.webmanifest` | `502ab767ee602f1a1a956e871e3f9e0d6836284a637ada6a0816d13d61ae104b` |
| `assets/index-KnEcKQwT.js` | `c71409c172b9bbd4ecbbd581e22d333b696b09d2b91caa20475eede970f70cc0` |
| `assets/index-D1_YcUUW.css` | `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb` |

## Known gaps and next steps

None in the repaired scope. Run `npm run check:billing-live -- --rate-limit` during future release checks; it never purchases or validates a real customer license.
