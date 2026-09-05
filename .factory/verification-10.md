# Draw perspective and curved inking guides — verification 10

## Verdict

**PASS. Finding count: 0. Untested claim count: 0.**

The reviewed implementation is deployed and works for the stated job: make reusable perspective fans and curved parallel guides for comic and concept artists, then export guide layers for another art app.

## Reviewed versions

- Implementation candidate: `5fa35ae6975fb4f0b30ed9fdd1a15dff2e534beb` — `fix: keep demo status inside main landmark`.
- Documentation baseline: `ec00a0bf4c8f161fe6b57051c9b09231304cd02d` — `docs: record repair 8 verification`.
- Live URL: <https://guided-inking-overlay.sociobot.in>.

The live HTML, JavaScript, CSS, service worker, two WebP assets, manifest, sitemap, robots file, and hard-404 files matched the locally built candidate by SHA-256.

## First screen and demo

Fresh 1440 × 900 desktop and 390 × 844 phone browser contexts, before scrolling, showed:

- Job: **Draw perspective and curved inking guides**.
- Audience: **Guides for comic and concept artists**.
- First action: **Try it with sample data**.

The action opened `/demo` in one click. Both contexts showed the persistent **Demo — sample data, nothing is saved** label, the named samples **Rainy station panel** and **Market awning curve**, and a populated active canvas: `13 fan lines · 1 curved guide`.

I saved `Verifier demo scene`, confirmed it was only in `demo:ink-guides:scenes:v1`, reset the demo, and confirmed the demo key was removed. A seeded real-workspace value was byte-for-byte unchanged after returning to the real editor. This proves the sample sandbox does not alter real data.

## Claims

After `npm ci` in a fresh checkout, before any separate build command, I ran every exact command in `.factory/claims.json` separately. Each selected its one tagged observable test and passed.

| Claim | Result |
| --- | --- |
| `guide-creation` | PASS |
| `reference-privacy` | PASS |
| `local-scenes` | PASS |
| `geometry-exports` | PASS |
| `offline-reload` | PASS |
| `keyboard-controls` | PASS |
| `free-tier` | PASS |
| `studio-tier` | PASS with the recorded valid-license response |
| `studio-price` | PASS |
| `daily-license-verification` | PASS |
| `demo-sandbox` | PASS |
| `no-tracking` | PASS |

I also cross-checked the landing page, editor, README, privacy page, terms, and 404 copy against the registry and copy audit. No public product claim was missing a declared test.

## Clean-checkout quality checks

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages installed; 0 audit vulnerabilities |
| `npm test` | PASS — 12/12 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 70/70 desktop and phone tests |
| `npm run check:billing-live -- --rate-limit` | PASS — invalid verdict, checkout redirect, HTTP 429, `Retry-After: 4` |

The production build has 34,831 bytes of application JavaScript (12,360 gzip), 20,099 bytes of application CSS (5,510 gzip), no shipped fonts, and a 59,282-byte hero WebP.

## Live checks

- `/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200 with their route-specific titles, one H1, and one main landmark.
- An unknown route returned the designed 404 page with HTTP 404, one H1, main landmark, and home/demo actions. The browser records the expected failed navigation resource for this deliberate 404; it is not an application console error.
- `verify-url.sh` passed on the root: HTTPS 200, title, `lang=en`, one H1, main, image alt text, named buttons, and no console errors.
- Fresh populated `/demo` Axe scans had **0 violations** on desktop and phone. Browser console error lists were empty for normal routes.
- The repaired demo banner and its Reset demo and Start for real actions are inside `main`; the prior F-2-1 landmark finding is fixed.
- The skip link was first in keyboard order. Reduced motion was active, with `scroll-behavior: auto` and effectively zero transition duration. The complete browser suite also passed keyboard, focus, touch-target, pointer, invalid-image recovery, and route-announcement tests.
- After one online visit, a fresh controlled phone context reloaded `/demo` offline with title, demo label, and populated sample intact.
- Live headers include CSP with response-header `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: strict-origin-when-cross-origin`.

Evidence is in `/work/.evidence/guided-inking-overlay-verify-10/`, including desktop and phone root/demo captures and `verify-url` output.

## Earlier findings

All earlier findings are closed and were rechecked through the passing suite and live checks: obsolete service-worker shell cleanup; 44px mobile controls; CSP and immutable asset caching; repeated-tool ARIA state; invalid-image recovery; claims and clean command setup; isolated demo; route titles/focus/404/legal pages; billing availability and rate limiting; first-time offline license handling; review-1 copy, navigation, metadata, and footer items; and review-2 F-2-1. No earlier finding remains open.

## Scope

This is a static local-first web product. It has no product backend, database, tenant, health endpoint, CLI, desktop artifact, or sign-in flow, so backend persistence/isolation and installed-artifact checks do not apply. No purchase was created. The automated Studio-license test uses its recorded valid response; live invalid verification, checkout redirect, and rate allowance were checked.

The brief's artist-study redraw measure has not been run. It is not a public product claim or a release defect.
