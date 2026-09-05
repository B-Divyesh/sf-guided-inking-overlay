# Ink Guides strict review 2 handoff — FAIL

## Result

**FAIL — candidate `0d5958e6fbac85451fb7be686bcf1f4d4e0702f4` has 1 low-severity finding and 0 untested claims.**

Production matches the reviewed candidate and the product workflow passes. This review cannot declare PASS because the acceptance rule requires zero findings at every severity.

## Remaining finding

A fresh Axe 4.10.2 scan of `/demo` reports one moderate `region` violation. Its exact target is the persistent `.demo-banner`, which is outside every landmark. The earlier `verification-9.md` attribution to the toast is incorrect; a separate populated root scan found no toast violation.

Place the demo banner inside a suitable landmark, or give its container an appropriate landmark without restoring the earlier nested complementary landmark problem. Add an Axe regression that fails on every violation. Product code was not changed during this review.

## What passed

- Fresh desktop and 390 × 844 phone first-read, demo, touch, keyboard, target-size, reduced-motion, and recovery checks.
- Demo population, persistent label, isolated storage, reset, leave/discard, and preservation of real data.
- Reference import recovery, reusable scenes, free limits, SVG/PNG output, offline reload, and worker cache update.
- All 12 exact claim commands, 12/12 unit tests, typecheck, lint, build, and 70/70 browser tests.
- Live URL verification, security headers, route titles, legal pages, deliberate designed 404, same-origin free flow, and production hash comparison.
- Live billing invalid verdict, hosted checkout redirect, and 429 with `Retry-After: 4`.
- Lighthouse 12.8.2: 100 performance, 100 accessibility, 100 best practices, and 100 SEO; LCP 1.3 s and CLS 0.

## Reviewed versions

- Assigned implementation candidate: `0d5958e6fbac85451fb7be686bcf1f4d4e0702f4`.
- Last product-code commit: `f1aa8a4bab3677576ea11d9dbf40a6152a3e4316`.
- Documentation baseline: `b57415f37f4460dfb3bac02ce447e37d8a336230`.
- Review report: `.factory/review-2.md`.

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

Run each exact command in `.factory/claims.json` separately. The remaining finding reproduces by running Axe on a fresh `/demo` page and inspecting the moderate `region` result for `.demo-banner`.
