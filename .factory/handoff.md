# Ink Guides verification 9 handoff — PASS

## Result

**PASS — candidate `0d5958e6fbac85451fb7be686bcf1f4d4e0702f4` is accepted at <https://guided-inking-overlay.sociobot.in>.**

Fresh verification found no release-blocking defect. Production matches the candidate byte-for-byte, the complete local-first guide workflow works on desktop and 390 px mobile, all 12 declared claims pass, and the previously reported deployment-only billing failure does not reproduce.

## What was verified

- Mandatory first-read gate: clear job, audience, next action, and a visible one-click sample demo.
- Clean checkout: `npm ci`, 12/12 unit tests, typecheck, lint, exact production build, 35/35 desktop browser tests, and 35/35 mobile browser tests.
- Every exact `.factory/claims.json` command: 12/12 passed individually from the installed clean checkout.
- Independent live workflow: 70/70 assertions covering imports, invalid input recovery, fan boundary, mouse/touch/keyboard drawing, demo storage, 3-scene boundary, SVG/PNG output, invalid-license recovery, privacy requests, routes, reduced motion, and PWA update/offline reload.
- Accessibility: zero serious/critical Axe findings; Lighthouse accessibility 100; keyboard focus, skip link, 44 px targets, and 390 px overflow passed.
- Performance: Lighthouse mobile 98; LCP 1.4 s, TBT 170 ms, CLS 0. JS is 12.24 KB gzip, CSS 5.52 KB gzip, and the hero is 59.28 KB.
- Privacy/security: complete free flow made only same-origin requests; reference data was absent from storage and exports; security headers and immutable hashed-asset caching are live.
- Billing: invalid verification and hosted checkout redirect work. One-client allowance was 30 successful requests; request 31 returned 429 with `Retry-After: 4`.
- Deployment identity: SHA-256 matched local `dist/` for HTML, worker, JS, CSS, hero/social images, manifest, robots, sitemap, and 404 assets.

## Known gap

One non-blocking P3 Axe `region` advisory appears only while the transient toast contains text. There are no serious or critical accessibility findings. Details and exact evidence are in [verification-9.md](verification-9.md).

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run check:billing-live -- --rate-limit
```

No product code was modified. This handoff and `.factory/verification-9.md` are the only intended repository changes.
