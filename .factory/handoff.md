# Ink Guides repair 4 handoff — ready to deploy

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

Deploy `dist/` as the existing Azure Static Web App using:

```sh
/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist
```

Then compare local/live SHA-256 for `index.html`, `sw.js`, the hashed JS/CSS,
and `hero-paper-diorama.webp`; repeat the corrupt-image and 390px target scan
against <https://guided-inking-overlay.sociobot.in>. Post-deployment evidence
will be appended by the deploy step.

## Known gaps

None in the repaired product. Package/consumer testing is not applicable to
this static web application.
