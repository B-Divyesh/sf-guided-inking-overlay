# Ink Guides independent verification 4 handoff — FAIL

## Decision

**FAIL — candidate `923c1db3cab95d5ad48fe2d4e1a776dc7aaf7993`
must not be promoted.** Fresh SHA-256 comparisons prove
<https://guided-inking-overlay.sociobot.in> is byte-for-byte the candidate
build, so the result is not a deployment-only failure.

The blocking P1 is that every core range input measures only **28px high** at
390 × 844, versus the contract’s **44 × 44px** minimum. Lines, rotation, fan
spread, rails, spacing, guide opacity, guide weight, and reference opacity all
fail. A full scan also found undersized skip/home/footer links and a reference
picker that flex-shrinks to 39.78px wide after “Remove image” appears. This is
especially material because pen/touch tablet use is an explicit brief
constraint.

A P2 also remains: selecting a corrupt file advertised as `image/png` shows the
correct recovery message but emits a production CSP console error because a
`blob:` connection is rejected by `connect-src`. Valid-image recovery succeeds.

Full evidence and exact reproduction steps are in
`.factory/verification-4.md`.

## Verification completed on 2026-08-28 UTC

- Clean exact checkout; `npm ci` passed with 0 vulnerabilities.
- `npm test` passed 9/9; `npm run typecheck`, `npm run lint`, and the exact
  `npm run build` passed; `dist/` was produced.
- Included Playwright suite passed 18/18 on desktop and 390px mobile.
- Independent live functional assertions passed on desktop and true CDP touch:
  guide boundaries, spline creation, invalid file recovery, reference privacy,
  SVG/PNG exports, scene limits/persistence/deletion, and paid-license return,
  invalid, valid, and daily-cache behavior.
- Independent Axe scans found 0 serious/critical issues; keyboard-only flow,
  3px visible focus, dialog focus return, reduced motion, and no-overflow layout
  passed. The earlier repeated-tool ARIA defect is fixed.
- SVG contained 25 fan lines and 11 rail paths with no reference. PNG was
  transparent 1200 × 800. Fresh free/reference flows made no cross-origin
  request and source contains no tracking or upload path.
- PWA update cleanup and offline reload passed; Chrome reported no manifest or
  installability error.
- Sociobot verification rate limiting passed: requests 1–30 returned 200;
  request 31 returned 429 with `Retry-After: 4`.
- Local Lighthouse mobile: 97 performance / 100 accessibility / 100 best
  practices / 100 SEO, LCP 1.6s, TBT 190ms, CLS 0.
- Live Lighthouse mobile: 100/100/100/100, LCP 1.3s, TBT 40ms, CLS 0.
- Live security headers, CSP/frame protection, CORS, short shell caching, and
  immutable hashed-asset caching were verified.
- Live and local SHA-256 matched for HTML, service worker, manifest, JS, CSS,
  and hero image. JS is 29,607 bytes raw / 11,100 gzip; CSS is 16,806 raw /
  4,830 gzip; hero WebP is 59,282 bytes.

## How to rerun

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
```

Then measure every visible `input[type="range"]` at 390 × 844 under production
headers, run Axe after repeated tool changes and with the license dialog open,
exercise corrupt and valid image imports while recording console/page errors,
and repeat the deployment hash comparisons and PWA offline/update checks.

## Required next steps

1. Increase every undersized action to at least 44 × 44px, prevent the reference
   picker from shrinking below that size, and add a full mobile target scan.
2. Eliminate the corrupt-image `blob:` CSP console error under deployed headers.
3. Rebuild, redeploy, and rerun independent verification. No other release
   blocker was found in this pass.
