# Independent verification 8 — PASS

- **Candidate:** `9f876eecfdb617b15f712525b91b34eb7f8519ce`
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-30 UTC, from a clean checkout at the candidate
- **Contract:** researched brief, `AGENTS.md`, and the supplied claims, demo, accessibility, privacy, PWA, paid-unlock, performance, plain-words, and site-structure requirements

## Decision

**PASS — release candidate accepted.** No release-blocking defects were found. The prior offline-first-license P1 is fixed in the deployed candidate: a fresh, unverified offline token remains on the free tier.

## First-read and one-click demo

A cold, storage-free desktop load answered the required questions in plain words before scrolling:

- **Does:** “Draw perspective and curved inking guides.”
- **For:** “Guides for comic and concept artists.”
- **First action:** “Try it with sample data,” with “Loads two prepared guide scenes in a separate demo.”

The same headline and action appeared at 390 px. One click to `/demo` immediately showed `13 fan lines · 1 spline` and the persistent `Demo — sample data, nothing is saved` banner with Reset demo and Start for real. The demo is therefore a usable sample sandbox, not an empty marketing route.

## Mandatory claims gate — PASS

`.factory/claims.json` is present with 12 declared claims. After `npm ci` in the clean checkout, every exact command listed there was run separately against its configured production-preview `/demo` entry point; each selected one tagged test and passed.

| Claim ID | Result |
| --- | --- |
| `guide-creation` | PASS |
| `reference-privacy` | PASS |
| `local-scenes` | PASS |
| `geometry-exports` | PASS |
| `offline-reload` | PASS |
| `keyboard-controls` | PASS |
| `free-tier` | PASS |
| `studio-tier` | PASS (recorded valid response) |
| `studio-price` | PASS |
| `daily-license-verification` | PASS |
| `demo-sandbox` | PASS |
| `no-tracking` | PASS |

The initial bare checkout correctly lacked installed Playwright dependencies; `npm ci` installed the locked 61 packages with no vulnerabilities. The Playwright configuration then builds before previewing, so the declared commands do not depend on a pre-existing `dist/` directory.

## Clean local checks — PASS

| Check | Result |
| --- | --- |
| `npm test` | PASS — 12/12 Vitest tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (TypeScript lint command) |
| `npm run build` | PASS — generated `dist/` |
| `npm run test:e2e -- --workers=4 --reporter=line` | PASS — 66 desktop/mobile Playwright tests |

The local exact production output is small: application JS 34,149 bytes raw / 12,230 bytes gzip; CSS 18,534 bytes raw / 5,210 bytes gzip; hero WebP 59,282 bytes; no webfonts. This is within the static-web JS, CSS, font, and hero-image budgets.

## Independent live product exercise — PASS

On live `/demo`, independent of the repository assertions, I changed fan density to 25 and rotation to -180°, drew another spline, rejected a text upload with the recovery message “Choose a PNG, JPEG, WebP, or GIF image,” and exported both formats. The SVG had 25 `<line>` elements and 7 `<path>` elements, no `<image>`, and the PNG was a valid transparent 1200 × 800 image. Keyboard Tab first focused the skip link with a designed `rgb(56, 198, 196) solid 3px` outline; F, arrows, S, and V operated the canvas tools.

The repaired paid-access boundary was also checked live: after service-worker installation, clearing storage, going offline, and opening a new `?license=fresh-unverified-qa-token`, the UI stayed `0 / 3`, `1200 × 800 · free`, and `Studio`; no verdict was stored. The only console error was the expected disconnected license fetch. A matching already-verified verdict is covered by the browser suite.

## Accessibility, responsive behavior, privacy, and PWA — PASS

- `/opt/fleet/lib/verify-url.sh` passed the live root: HTTP 200, `lang=en`, one H1, main landmark, image alt text, named buttons, and no console/page errors. The direct live browser check of `/demo` showed the same properties.
- Axe scans found **zero serious or critical** findings on desktop `/demo`, `/privacy`, and `/terms`, and on 390 × 844 mobile `/demo`. The 390 px page had no horizontal overflow. With reduced motion, scrolling was `auto` and transition duration was `0.00001s`.
- The complete normal free-demo flow made only same-origin requests: document, local hashed JS/CSS, and local hero image. No analytics, advertising, third-party scripts, CDN fonts, or artwork upload was observed. Reference import is a local blob workflow; exports exclude the reference.
- After one live online visit, the service worker controlled `/demo`; an offline reload retained title `Demo — Ink Guides`, the demo banner, and `13 fan lines · 1 spline`. The local suite also covers service-worker cache-version/update behavior.

Live headers include HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, denied camera/microphone/geolocation, and a response-header CSP containing `frame-ancestors 'none'`. Hashed JS, CSS, and imagery use `Cache-Control: public, max-age=31536000, immutable`; HTML and worker revalidate at 30 seconds. `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns the designed 404.

## Billing endpoint allowance — PASS

`npm run check:billing-live -- --rate-limit` confirmed an invalid-token 200 JSON verdict, production-origin CORS, `Cache-Control: no-store`, and a hosted Dodo checkout redirect. A subsequent clean single-client sequential probe received 200 for requests 1–30 and **HTTP 429 on request 31** with **`Retry-After: 4`**. Observed allowance: **30 successful verification requests per burst per client**. There is no sign-in flow, so Entra tenant checks do not apply.

## Deployment identity — PASS

Fresh SHA-256 comparisons of local `dist/` and live production match:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `35c87bbbbed7337d3a63b8d5e699178e6f02f009b410d40f854f6670946a23a0` |
| `sw.js` | `5811ffb61b6a687e86353820b826b6c02e8eb0e8adaf2359c64872a7a8a41d31` |
| `assets/index-DPyXe4t2.js` | `3883d45cc93a6f97832fca9d472dfe0b0654e081942035d103759cc0914dbfa6` |
| `assets/index-D1_YcUUW.css` | `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |

The live deployment matches candidate `9f876eecfdb617b15f712525b91b34eb7f8519ce`, not a stale or deployment-only variant.

## Defects

None found at blocker, critical, high, medium, or low severity in the verified scope. This static browser product has no package/CLI consumer API, backend persistence/concurrency surface, or sign-in flow to test.
