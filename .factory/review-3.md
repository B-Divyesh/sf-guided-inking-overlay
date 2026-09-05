# Draw perspective and curved inking guides — strict review 3

Reviewed 2026-09-05 UTC at <https://guided-inking-overlay.sociobot.in>.

## Verdict

**PASS — finding count: 0. Untested claim count: 0.**

Ink Guides completes its job: comic and concept artists can make reusable rotated perspective fans and parallel curved guides over a local reference, save scenes, and export guide-only SVG or PNG layers.

## Reviewed versions

- Implementation candidate: `5fa35ae6975fb4f0b30ed9fdd1a15dff2e534beb` — `fix: keep demo status inside main landmark`.
- Documentation baseline: `cb25e07a0d743438e2c9b913261528e9e0d6e760` — `docs: record verification 10 pass`.
- Live URL: <https://guided-inking-overlay.sociobot.in>.

The live HTML, JavaScript, CSS, service worker, and both WebP files matched a fresh local build of the implementation candidate by SHA-256. The live unknown-route response is a deliberate designed HTTP 404, not a defect.

## First screen and sample demo

Fresh desktop (1440 × 900) and phone (390 × 844) browsers, before scrolling, showed:

- Job: **Draw perspective and curved inking guides**.
- Audience: **Guides for comic and concept artists**.
- First action: **Try it with sample data**.

The heading appeared at y=150 on desktop and y=168 on phone. Neither viewport had horizontal overflow.

One click opened `/demo`. Both browsers showed the persistent **Demo — sample data, nothing is saved** label, Reset demo, Start for real, the named Rainy station panel and Market awning curve samples, and `13 fan lines · 1 curved guide` on the active canvas.

I seeded a valid real scene before entering demo mode. Saving `Live review demo` wrote only `demo:ink-guides:scenes:v1`; the real value remained byte-for-byte unchanged. Reset demo removed demo storage. Saving another demo scene and choosing Start for real removed the demo namespace and again left the real scene unchanged.

## Claims and clean setup

A newly cloned `cb25e07` checkout began with no `dist/` directory. After `npm ci` (61 packages; 0 vulnerabilities), all twelve exact commands in `.factory/claims.json` passed. Each selected its one tagged observable browser test.

| Claim | Result |
| --- | --- |
| guide creation | PASS |
| reference privacy | PASS |
| local scenes | PASS |
| geometry exports | PASS |
| offline reload | PASS |
| keyboard controls | PASS |
| free tier | PASS |
| Studio tier | PASS with the recorded valid-license fixture |
| Studio price | PASS |
| daily license verification | PASS |
| demo sandbox | PASS |
| no tracking | PASS |

The landing page, editor, README, privacy page, terms, and 404 were cross-checked against the registry and copy audit. No unlisted or untested public product claim was found. Legal terms and attribution are not functional product claims.

## Quality and recovery checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 12/12 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 70/70 desktop and phone tests |
| `/opt/fleet/lib/verify-url.sh` | PASS — 200, title, lang, one H1, main, alt text, named buttons, no console errors |
| `npm run check:billing-live -- --rate-limit` | PASS — invalid verdict, hosted checkout redirect, 429, `Retry-After: 4` |

The build is within the static budget: application JavaScript is 34,831 bytes raw (12,360 gzip), CSS is 20,099 bytes raw (5,510 gzip), and the hero WebP is 59,282 bytes. The prior Lighthouse mobile result remains applicable because the deployed files match this build: 100 performance, 100 accessibility, 100 best practices, and 100 SEO.

On fresh live desktop and phone `/demo` scans, Axe reported zero violations. Normal root and demo routes had no console errors. Keyboard use selected Aim fan with F, the skip link remained first in the documented suite, and phone interaction, visible 44px targets, invalid-image recovery, empty/error paths, route focus, and reduced motion all passed in the 70-test suite. Live reduced motion set scrolling to `auto` and button transition duration to `0.00001s`.

After one successful online visit, a fresh controlled phone context reloaded `/demo` offline with the Demo title, sample label, and populated guide intact. Live normal-route requests were same-origin. The reference-import and no-tracking claim tests cover supported PNG, JPEG, WebP, GIF, local storage exclusion, and full request logging.

## Routes, links, privacy, and billing

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles, one H1, and one main landmark.
- A fresh unknown URL returns the designed 404 with HTTP 404, the title **Page not found — Ink Guides**, one H1, main, and editor/demo actions.
- All discovered internal product links returned 200; anchors, `mailto:`, source, and billing links are explicit external or anchor destinations.
- Live headers include CSP response-header `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, Referrer-Policy, and Permissions-Policy. Hashed assets use one-year immutable caching.
- Live billing rejects an invalid token, permits the browser request, redirects checkout to the hosted merchant, and rate limits with HTTP 429 and `Retry-After: 4`. No purchase was made.

This is a static local-first browser product. It has no product backend, database, tenant boundary, health route, CLI, library package, desktop artifact, or sign-in flow, so those checks do not apply. The brief's redraw success measure needs an artist study; it is not a public product claim.

## Earlier findings

All earlier findings remain closed. The service-worker update regression, 44px mobile target defects, immutable-cache and security-header gaps, invalid `aria-pressed`, corrupt-image console error, missing claims/demo/route metadata, unbuilt claim commands, billing availability, first-time offline-license access, review-1 F-1-1 through F-1-13, and review-2 F-2-1 were rechecked through the current build, full suite, and live review. In particular, the demo banner is inside `main`; fresh desktop and phone Axe scans found no landmark violation.

Evidence: `/work/.evidence/guided-inking-overlay-review-3/`.
