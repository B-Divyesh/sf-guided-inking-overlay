# Ink Guides repair 4 handoff — PASS

## Outcome

Repair implementation: `c8779a3a336ef0e31ee9cc1521991ba00a6c69db`.
It repairs every finding from independent verification 4 while preserving the
local-first guide workflow, existing service-worker upgrade protection, paid
license flow, and paper-cut drafting visual system.

- All visible editor actions at 390 × 844 now have a 44 × 44 CSS-pixel minimum:
  the eight ranges are 44px high, links have a real 44px hit area, and the
  reference picker is non-shrinking beside Remove image.
- A corrupt image still gives the useful recovery message, then a valid image
  can be loaded. The service worker does not handle `blob:` image decoding, and
  the deployed CSP explicitly permits local `blob:` connections. No remote
  origin was added.
- The local production preview now reads its headers from the actual Azure
  Static Web Apps policy, so browser policy tests do not use a weaker preview.

## Exact regression coverage

- `src/service-worker-regression.test.ts` proves versioned worker upgrades,
  ignores a `blob:` fetch, and checks the immutable-cache/frame/CSP policy.
- `tests/studio.spec.ts` imports a reference at 390px and scans all visible
  buttons, links, range controls, switches, and file picker for a 44 × 44px
  minimum.
- The same suite loads a malformed PNG under the production CSP while a service
  worker controls the page, asserts the recovery text, loads a valid WebP, and
  asserts zero console errors.

## Verification completed on 2026-08-30 UTC

```sh
npm ci                              # 62 packages audited, 0 vulnerabilities
npm test                            # 10/10 Vitest tests passed
npm run typecheck && npm run lint   # passed (strict TypeScript)
npm run build                       # passed; writes dist/
npm run test:e2e -- --workers=4 --reporter=list  # 22/22 desktop + 390px Chromium passed
```

- Playwright Axe scans in the full desktop and mobile guide workflow found zero
  serious or critical violations. Keyboard tool shortcuts, canvas arrows,
  repeated tool changes, visible focus, routes, local persistence, SVG export,
  license return, privacy request audit, offline reload, and worker upgrade
  regressions passed.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <evidence-dir>` passed:
  200, 639ms, title, `lang=en`, one h1, main landmark, no missing image alts,
  no unnamed buttons, and no console/page errors.
- Independent 390px scan after reference import: 30 visible actionable targets;
  minimum width 44px and minimum height 44px. There was no horizontal overflow.
- The preview carries the production CSP/frame policy, including local
  `blob:` handling; `staticwebapp.config.json` retains immutable `/assets/*`
  caching and `X-Frame-Options: DENY`.
- Build budgets: JS 29,607 bytes raw / 11,099 gzip; CSS 16,966 bytes raw /
  4,852 gzip; hero WebP 59,282 bytes. Lighthouse local production report:
  performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.6s,
  TBT 0ms, CLS 0. Lighthouse emitted a late browser-tab crash warning only
  after writing those completed category results.

`npx @axe-core/cli` was also attempted with the supplied Playwright Chromium,
but its Selenium launcher could not create a compatible Chrome session in this
container. The repository's pinned `@axe-core/playwright` browser coverage ran
successfully in both required viewports and is the recorded Axe evidence.

## Deployment and post-deploy check

`/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist` deployed the
existing Azure Static Web App successfully on 2026-08-30 UTC (deployment ID
`fbcbae25-d16c-45ea-be40-121fddff5627`). The live site is
<https://guided-inking-overlay.sociobot.in>.

Fresh SHA-256 comparisons were exact matches between `dist/` and production:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `8a651b3bf460866d632f0abd4f59b7a8b1709e55bc65d827bee7239219ed6e06` |
| `sw.js` | `86af60f03f702b506288e598e43945406fefde23ba47836ed23af8cf9476a0cb` |
| `site.webmanifest` | `f163e12fe0b306b6472cfa3151f4e3f503e25f9ded05bd7c86664f1b517a5223` |
| `assets/index-C2a9TfwX.js` | `08833ba474ec12bd0f335573c4c1e39b3f43921fe767f33dbef2d44ffe897b43` |
| `assets/index-DYbs0gY3.css` | `31d168fe72a98b762d0cb9002103bf766dcc2c4dc9251d33b8fdc8c8f8cc8ac7` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |

Live root policy has CSP with `connect-src 'self' blob:`, frame denial,
HSTS/nosniff/referrer/permissions headers, and a 30-second shell cache. The
hashed JavaScript returns `public, max-age=31536000, immutable`.

Fresh production verification passed: `/opt/fleet/lib/verify-url.sh` returned
200 in 641ms with no console/page errors and the expected title/lang/h1/main.
At 390px, 30 visible actionable targets had a 44px minimum width and height;
corrupt PNG recovery gave the recovery message, a valid WebP recovered, a
controlling service worker was present, and the browser logged no errors or
cross-origin requests. Production Axe found zero serious/critical violations.
An installed production shell also reloaded successfully offline.

## Known gaps

None in the repaired product. Package/consumer testing is not applicable to
this static web application.
