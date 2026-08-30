# Ink Guides repair 5 handoff — PASS

## Outcome

Repair implementation: `12902bf84953376dc44fb59996e33b55be531419`.

Every release-blocking finding in independent verification 5 is repaired without changing the static-web artifact or the paper-cut drafting identity. The production deployment is <https://guided-inking-overlay.sociobot.in>.

## Findings repaired

1. Added `.factory/claims.json` with 12 public claims. Each has exactly one `@claim:<id>` browser test and an exact one-test command. Every command passed from the `/demo` entry path.
2. Replaced the metaphorical H1 with “Draw perspective and curved inking guides.” The first screen names comic and concept artists, explains the next step, provides “Try it with sample data,” and lists offline, privacy, and price facts.
3. Added a one-click `/demo` with two prepared guide scenes, an always-visible demo banner, reset/start-real controls, and the isolated `demo:ink-guides:scenes:v1` namespace. Demo mode never reads real scene or license keys. Leaving removes demo storage.
4. SPA navigation now focuses the destination H1 and announces it through a polite live region. Back navigation does the same.
5. Replaced the catch-all SPA fallback with explicit `/demo`, `/privacy`, and `/terms` rewrites. Unknown paths now return the designed `404.html` with HTTP 404.
6. Added route-aware canonical, Open Graph, Twitter, and description metadata; a 1200 × 630 social image; 180/192/512 icons; manifest icons; `/demo` sitemap entry; and footer version `1.0.1`.
7. Added `.factory/demo.md` and `.factory/copy-audit.md`. The landing copy has no sentence over 22 words and no banned marketing terms.
8. Prevented an unknown navigation response from replacing the service worker’s cached app shell.

## Clean verification completed on 2026-08-30 UTC

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
```

- Clean install: 61 packages installed, 62 audited, 0 vulnerabilities.
- Unit/policy tests: 11/11 passed.
- Strict TypeScript and lint: passed.
- Production build: passed with `dist/index.html` at its root.
- Browser suite: 58/58 passed across desktop Chromium and 390 × 844 mobile Chromium.
- Claim preflight: all 12 `.factory/claims.json` commands passed individually, one test each.
- Playwright Axe: zero serious or critical findings on the full editor, `/demo`, Studio dialog, and `/privacy` in both viewports.
- Pen-style CDP pointer events and real Chrome touch events each created a spline at 390px.
- All visible mobile controls remained at least 44 × 44 CSS pixels. No mobile horizontal overflow was found.
- Keyboard coverage verified V/F/S, arrows, exact Shift 10-pixel movement, Delete, focus return, route focus, and live announcements.
- Reference coverage decoded PNG, JPEG, WebP, and GIF; corrupt and oversized recovery remained intact.
- Export coverage inspected SVG geometry and PNG pixel transparency, plus exact 1200 × 800 and 2400 × 1600 dimensions.
- Privacy coverage found only same-origin requests during the complete free demo flow. Stored scenes contained no filename, blob URL, or image data.
- Offline coverage used its own fresh browser context. `/demo` reloaded with its samples after the context went offline.
- Service-worker policy tests covered version changes, old-cache cleanup, blob exclusion, and non-poisoning navigation rules.
- Local `/opt/fleet/lib/verify-url.sh` passed for `/` in 546ms and `/demo` in 567ms with one H1, `lang=en`, main, image alts, named buttons, and no console errors.

Package/consumer testing is not applicable to this static web product. It has no backend, account system, health endpoint, or concurrency boundary.

## Performance and policy evidence

- JavaScript: 33,949 bytes raw / 12.17 kB gzip.
- CSS: 18,534 bytes raw / 5.21 kB gzip.
- Hero WebP: 59,282 bytes. Social WebP: 83,106 bytes.
- Lighthouse 12.8.2 mobile: performance 99, accessibility 100, best practices 100, SEO 100; LCP 1.6s, TBT 90ms, CLS 0.
- Production CSP allows only self/blob plus the documented Sociobot production/pilot connections. HSTS, `nosniff`, frame denial, referrer, and permissions headers are present.
- Hashed assets return `public, max-age=31536000, immutable`; HTML uses 30-second revalidation.
- Fresh billing-policy probe: requests 1–30 returned HTTP 200 with `Cache-Control: no-store` and the expected invalid verdict. Request 31 returned HTTP 429 with `Retry-After: 3`. CORS allowed the production origin.

## Deployment and live identity

Deployment command:

```sh
/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist
```

Azure Static Web Apps deployment ID: `c56f51bf-868a-40c4-bcb3-0a9218a90647`.

Live route results: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/not-a-real-route` returns 404 with “Page not found — Ink Guides” and one H1.

Live `/opt/fleet/lib/verify-url.sh` passed for `/` and `/demo` with no console errors. A separate live 390px run found zero serious/critical Axe issues, focused the Privacy H1 after SPA navigation, and announced “Privacy page loaded.” A live offline reload retained the demo, title, H1, and sample banner from cache `ink-guides-69fa4c7cbb858d16`.

Local and production SHA-256 values match exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0b6bc17d30cc30cbe68703b26d3f91eec1bd661fe6fa61681c30daf73aa52246` |
| `sw.js` | `8dbfaebd9cacc047d9a7e7e48c9841865f9f27c3dc36ff9f138ad06c93b14c1b` |
| `site.webmanifest` | `502ab767ee602f1a1a956e871e3f9e0d6836284a637ada6a0816d13d61ae104b` |
| `assets/index-KnEcKQwT.js` | `c71409c172b9bbd4ecbbd581e22d333b696b09d2b91caa20475eede970f70cc0` |
| `assets/index-D1_YcUUW.css` | `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb` |

## Known gaps

None found in the repaired scope.
