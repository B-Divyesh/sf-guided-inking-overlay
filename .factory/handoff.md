# Draw perspective and curved inking guides — review 3 handoff

## Result

**PASS — strict review 3 found 0 findings and 0 untested claims.** No product code changed in this review.

## Versions

- Implementation reviewed: `5fa35ae6975fb4f0b30ed9fdd1a15dff2e534beb`.
- Documentation baseline: `cb25e07a0d743438e2c9b913261528e9e0d6e760`.
- Live product: <https://guided-inking-overlay.sociobot.in>.

The production HTML, JavaScript, CSS, service worker, and WebP assets match the local build of the implementation candidate.

## What was verified

- Fresh desktop and phone first screens state the job, audience, and **Try it with sample data** action before scrolling.
- The one-click demo is populated, visibly labelled, isolated from real storage, resettable, and discarded on Start for real.
- Fresh live demo Axe scans have zero violations. Normal routes have no console errors. `/demo` reloads offline after the first successful visit.
- Route titles, legal pages, designed 404, links, headers, asset caching, privacy behavior, keyboard, focus, touch, reduced motion, recovery paths, and billing rate limiting pass.
- All previously reported findings remain fixed, including review-2 F-2-1: the demo banner is inside `main` and has no landmark violation.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run check:billing-live -- --rate-limit
```

Every exact command in `.factory/claims.json` also passes from a new checkout with no `dist/` directory. The complete report is `.factory/review-3.md`; supporting browser, screenshot, and URL-check evidence is in `/work/.evidence/guided-inking-overlay-review-3/`.

## Known limits

The valid Studio path uses the recorded browser-test license fixture. Live checks use an invalid license, checkout redirect, CORS, and rate-limit behavior without making a purchase. The brief's artist redraw measure requires a separate artist study and is not a public product claim.

Ink Guides is static and local-first. It has no product backend, database, tenant, health endpoint, CLI, library artifact, desktop app, or sign-in flow.
