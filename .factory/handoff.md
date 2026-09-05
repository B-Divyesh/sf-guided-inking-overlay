# Draw perspective and curved inking guides — repair 8 handoff

## Result

**PASS — the strict review's one remaining finding is fixed.** The persistent sample banner and status toast now live inside the existing main landmark. A fresh Axe scan of the populated demo reports zero violations on desktop and phone.

## Versions

- Implementation: `5fa35ae6975fb4f0b30ed9fdd1a15dff2e534beb` (`fix: keep demo status inside main landmark`).
- Prior review/documentation baseline: `f17e9e6c0ccf688ed3e3fff4a07b3ed9f435017c`.
- Static deployment: `41049c75-6bdc-4e60-8b51-114f213f8b30` to the existing `sf-guided-inking-overlay` Static Web App.

## What changed

- Moved the persistent **Demo — sample data, nothing is saved** banner into `<main>`. It remains sticky on desktop and sits normally in the phone layout.
- Moved the temporary status toast into the same main landmark, so populated status feedback is also landmark-contained.
- Strengthened the browser Axe checks: demo, Studio dialog, and privacy scans now fail on every Axe violation, not only serious or critical ones.
- Added an outcome check that the visible demo banner, Reset demo, and Start for real actions remain available inside the main product area without an Axe finding.
- Copied the verb-first, 93-character catalog description to `/work/.evidence/catalog-description.txt`.

## Current strict-review finding

| Finding | Disposition | Evidence |
| --- | --- | --- |
| F-2-1: persistent demo banner outside landmarks | Fixed | Fresh live desktop and phone `/demo` scans each returned zero Axe violations. The banner, Reset demo, and Start for real remained visible and usable. |

## Earlier findings

| Earlier review item | Current disposition |
| --- | --- |
| Worker update kept obsolete shells | Fixed by versioned worker caches and activation cleanup; unit regressions and a live offline reload pass. |
| Welcome, range, navigation, footer, and file actions were below 44px | Fixed; the full 390px target scan passes in the 70-test browser suite. |
| Hashed assets lacked immutable caching; CSP/frame protection was absent | Fixed in `staticwebapp.config.json`; live assets and headers remain correct. |
| Repeated tool changes applied `aria-pressed` to a div | Fixed; repeated-tool Axe coverage passes. |
| Corrupt image recovery emitted a CSP error | Fixed; invalid-image recovery and a later valid import produce no console error. |
| Claims registry, clean claim commands, isolated demo, route focus, designed 404, metadata, navigation, and legal structure were incomplete | Fixed; all twelve exact claim commands run from clean setup and current live route checks pass. |
| Billing endpoint availability and rate-limit evidence were missing | Fixed; invalid verification, hosted checkout redirect, and a 429 with `Retry-After: 4` pass. |
| A fresh offline token unlocked Studio | Fixed; a new token stays on the free tier until a valid verdict exists. |
| Review 1 F-1-1 through F-1-13: missing visible steps/shared navigation and footer metadata; hard-404 metadata; unregistered copy claims; metaphor/jargon/unclear action wording; long README sentences | Fixed in the existing product candidate and retained by this repair. The copy audit remains clean. |
| Verification 9 incorrectly attributed a moderate landmark advisory to the toast | Corrected by review 2. The target was the demo banner; both banner and toast are now within main and fresh scans are clean. |

## Verification from documented clean setup

After `npm ci` (61 packages added, 0 audit vulnerabilities):

| Command or check | Result |
| --- | --- |
| `npm test` | PASS — 12/12 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` created |
| All 12 exact commands in `.factory/claims.json`, run separately | PASS — one tagged observable test each |
| `npm run test:e2e` | PASS — 70/70 desktop and 390 × 844 phone tests |
| `npm run check:billing-live -- --rate-limit` | PASS — invalid verdict, hosted checkout redirect, HTTP 429, `Retry-After: 4` |
| `/opt/fleet/lib/verify-url.sh` on live root | PASS — HTTPS 200, title, `lang`, one H1, main, alt text, named buttons, no console errors |

The fresh production build is 34,831 bytes of JS (12,246 gzip), 20,099 bytes of CSS (5,519 gzip), and has a 59,282-byte hero WebP. It ships no fonts.

## Live HTTPS checks

The deployed domain is <https://guided-inking-overlay.sociobot.in>.

- Production serves `assets/index-CQxAoKpF.js`, matching local `dist/`. SHA-256 matched for HTML, worker, JS, CSS, both WebP assets, manifest, robots, sitemap, and 404 files.
- Fresh 1440 × 900 desktop and 390 × 844 phone contexts read the first screen before scrolling: **Draw perspective and curved inking guides**; **Guides for comic and concept artists**; **Try it with sample data**.
- In each fresh context, one click opened the populated Rainy station sample (`13 fan lines · 1 curved guide`), showed the persistent sample label, saved demo-only data, reset it, and returned to the seeded real scene unchanged. Each populated `/demo` Axe scan returned zero violations and each console-error list was empty.
- `/`, `/demo`, `/privacy`, and `/terms` return 200 with their route titles. An unknown route returns the designed 404 with HTTP 404, one H1, main, and a home action.
- After a successful online demo visit, a fresh controlled context reloaded `/demo` offline with its title, banner, and populated sample intact.

Evidence is under `/work/.evidence/guided-inking-overlay-live/`, including root and demo desktop/phone captures and the verifier JSON.

## Scope and honest limits

Ink Guides is a static, local-first browser tool. It has no product backend, database, tenant boundary, health endpoint, CLI, library package, or sign-in flow; those checks do not apply. No charge or customer purchase was created. Hosted checkout, invalid-license recovery, and rate limiting were checked live; the valid-license path uses the recorded browser-test fixture. The brief's fewer-than-three-redraw success measure needs an artist study, which was not conducted.

## Run, test, and deploy

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run check:billing-live -- --rate-limit
```

Deploy the built `dist/` directory to the existing Static Web App using the factory static deployment process. No application configuration or product data needs migration.
