# Independent verification 7 — FAIL

- **Candidate:** `a2bf1c0f6007360ee24e25bbfb0d2bafe9966684`
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-30 UTC from a clean checkout at that exact SHA
- **Contract:** researched brief, repository `AGENTS.md`, and the supplied claims, demo, accessibility, privacy, PWA, paid-unlock, performance, plain-words, and site-structure requirements

## Decision

**FAIL — do not promote.** The deployed static files match the candidate and the free product is functional, but a newly supplied, never-verified license token grants paid Studio access while offline. This is a P1 paid-access defect.

## First-read gate — PASS

A cold, no-storage 1440 × 900 live visit showed, without scrolling:

- **What it does:** “Draw perspective and curved inking guides.”
- **Who it is for:** “Guides for comic and concept artists.”
- **What to do first:** “Try it with sample data,” immediately followed by “Loads two prepared guide scenes in a separate demo.”

The same content is visible at 390 × 844. One click opens `/demo`, immediately displays `13 fan lines · 1 spline`, and has the persistent “Demo — sample data, nothing is saved” banner with Reset demo and Start for real. The mandatory first-read/demo gate passes.

## Release-blocking defect

### P1 — unverified offline token unlocks Studio

Fresh live reproduction, in a new browser context:

1. Load the live app, wait for the service worker, and reload until controlled.
2. Clear local/session/IndexedDB storage, leaving no cached license verdict.
3. Set the browser offline and open `/?license=definitely-invalid-verifier-token`.

Observed after 2.5 seconds:

```json
{
  "controlled": true,
  "online": false,
  "studioLabelCount": 1,
  "pngLabel": "Export PNG\\n2400 × 1600 · Studio",
  "sceneCount": "0 / 20",
  "storedLicense": "definitely-invalid-verifier-token",
  "cachedVerdict": null,
  "status": "Could not reach the license service. Your free workspace still works; try again when online."
}
```

The console recorded only the expected disconnected fetch error. The UI nevertheless unlocked paid 20-scene and 2400 × 1600 PNG limits. The paid-unlock contract permits optimistic access only from an *existing cached valid verdict*; a new token with no valid verdict must stay on the free tier until verification succeeds.

The cause is in `src/main.ts` around `applyUnlock(cached?.valid !== false)`: `null` becomes an unlock. The network-error path does not restore the free limits.

**Required repair:** unlock only when `cached?.valid === true`; keep a returned/pasted token locked until its first valid response; retain offline access for an explicitly cached valid verdict; add a regression covering the offline `?license=` route. Rebuild, deploy, and reverify.

### P3 — one moderate Axe landmark issue on the root page

An independent live Axe scan found no serious or critical findings. It did report one **moderate** `landmark-complementary-is-top-level` violation on `/`, caused by the demo `<aside>` being inside `<main>`. This does not fail the specified serious/critical Axe gate, but should be corrected in the repair.

## Mandatory claims gate — PASS

`.factory/claims.json` exists. Immediately after `npm ci`, every listed command was run separately against its production preview/demo entry point and exited 0. Each selected exactly one test.

| Claim ID | Result |
| --- | --- |
| `guide-creation` | PASS |
| `reference-privacy` | PASS |
| `local-scenes` | PASS |
| `geometry-exports` | PASS |
| `offline-reload` | PASS |
| `keyboard-controls` | PASS |
| `free-tier` | PASS |
| `studio-tier` | PASS (recorded valid billing response) |
| `studio-price` | PASS |
| `daily-license-verification` | PASS |
| `demo-sandbox` | PASS |
| `no-tracking` | PASS |

Claims in the live copy and README map to these claim entries. The claim suite does not cover first verification while offline, which is why it misses P1.

## Clean local verification — PASS

```text
npm ci                                      PASS — 61 packages added; 0 vulnerabilities
npm test                                    PASS — 12/12
npm run typecheck                           PASS
npm run lint                                PASS
npm run build                               PASS — dist/ produced
npm run test:e2e -- --workers=4 --reporter=list
                                            PASS — 58/58 in 2.5 minutes
```

The production build is small: application JS is 33,949 bytes raw / 12,165 gzip; CSS is 18,534 bytes raw / 5,210 gzip; the 59,282-byte hero is below the image budget; no webfonts ship. This meets the static-product JS, CSS, font, and hero budgets.

## Independent end-to-end exercise — PASS except P1

On the live `/demo` route I independently:

- changed fan density to 25 and rotation to -180°, then drew a spline; the canvas reported `25 fan lines · 1 spline`;
- rejected a text file with “Choose a PNG, JPEG, WebP, or GIF image,” rejected a corrupt PNG with a recovery instruction, then accepted a WebP reference;
- exported a geometry-only SVG with 25 `<line>` and 7 `<path>` elements and no `<image>`; exported a 1200 × 800 PNG;
- saved a 42-character scene name to reach the 3/3 free boundary; the fourth save opened the Studio dialog; and
- exercised keyboard F, arrow, S, and V controls at 390 px without errors.

The full integration suite additionally verifies scene reload, demo namespace separation/reset/discard, delete confirmation, route focus/back behavior, pen and touch drawing, Studio valid-license limits, transparent export corners, and invalid image recovery.

## Live privacy, accessibility, PWA, headers, routes, and deployment identity

- A fresh live demo request log contained only same-origin document, hashed JS, hashed CSS, and hero WebP requests; no analytics, ads, remote fonts, scripts, or artwork upload occurred. Browser console/page errors were empty in normal flows.
- Desktop Axe on root, demo Studio dialog, privacy, and terms, plus 390 px Axe on demo Studio dialog and privacy: **0 serious/critical**. Keyboard Tab visibly focuses the skip link and guide canvas with a cyan 3px outline plus dark offset. At 390 px there was no horizontal overflow. Reduced motion set scrolling to `auto` and transitions/animations to `0.00001s`.
- The live service worker controlled the app using cache `ink-guides-69fa4c7cbb858d16`; after an online load, `/demo` reloaded offline with its title, banner, and `13 fan lines · 1 spline` intact. Local service-worker upgrade/cache regression tests are included in the 12 passing unit tests.
- `/`, `/demo`, `/privacy`, and `/terms` return 200; a nonexistent route returns the designed 404. All visible landing links resolve, including the hosted checkout redirect (303 to Dodo) and source link.
- Response headers include a response-header CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, and denied camera/microphone/geolocation. HTML and `sw.js` revalidate at 30 seconds; hashed JS/CSS use one-year immutable caching.
- The locally built candidate matched every deployed public product artifact checked (HTML, service worker, JS, CSS, images, icons, manifest, sitemap, robots, and 404 files). Key SHA-256 values: `index.html` `0b6bc17d30cc30cbe68703b26d3f91eec1bd661fe6fa61681c30daf73aa52246`; JS `c71409c172b9bbd4ecbbd581e22d333b696b09d2b91caa20475eede970f70cc0`; CSS `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb`; `sw.js` `8dbfaebd9cacc047d9a7e7e48c9841865f9f27c3dc36ff9f138ad06c93b14c1b`.

Lighthouse 13.4.1 could not produce a valid aggregate performance score in this container because Chrome did not collect screenshots under the required stability flags. Its usable audit metrics were FCP 0.9 s, LCP 1.2 s, TBT 10 ms, and CLS 0; accessibility, best-practices, and SEO were each 100. Bundle measurements above are the release budget evidence.

## Billing API allowance — PASS

`npm run check:billing-live -- --rate-limit` passed: invalid license verification returned the expected JSON, production-origin CORS, and `Cache-Control: no-store`; checkout redirected to Dodo; a burst received 429 with `Retry-After: 2`.

After a 75-second cooldown, a fresh single-client 35-request verification burst received **19 HTTP 200 responses; request 20 returned HTTP 429 with `Retry-After: 4`**. Thus the observed clean-window allowance was 19 requests before enforcement. No sign-in flow exists, so Entra tenant verification is not applicable.

## Scope notes

This is a static browser product, not a library, CLI, or application backend. Consumer-package, backend health, and persistence-concurrency checks are not applicable. No product source code was changed during this verification.
