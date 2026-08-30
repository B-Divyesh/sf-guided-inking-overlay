# Independent verification 6 — FAIL

- **Candidate:** `d88a69d94422a901071ab7849fbddba712fb6e53` (`docs: correct repair commit identity`)
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-30 UTC from a clean checkout at the candidate.

## Release decision

**FAIL — do not promote.** The live static artifact exactly matches this candidate and the free guide editor works, but two release-blocking contract failures remain: the declared claim commands do not run from an unbuilt clean checkout, and the live required Sociobot purchase/license endpoints return HTTP 503. The latter prevents purchasing Studio and restoring/verifying a license.

## First-read result

Cold-opening the live root answers all mandatory questions in plain words. It says it draws perspective and curved inking guides, names comic and concept artists, and directs the visitor to **“Try it with sample data”**; that action is one click and loads two isolated prepared scenes. The screen also states offline, on-device-reference, and price facts. This gate passes.

## Blocking defects

### P1 — live Studio checkout and license verification are unavailable

Fresh requests on 2026-08-30 UTC produced:

```text
GET https://api.sociobot.in/api/v1/products/guided-inking-overlay/verify?license=qa-invalid-…
→ 503 Service Unavailable (HTML), no Retry-After

HEAD https://api.sociobot.in/api/v1/products/guided-inking-overlay/checkout
→ 503 Service Unavailable
```

The product advertises Studio as a $9 one-time purchase and uses these endpoints for checkout and restoring/validating a pasted license. Therefore a buyer cannot complete the paid workflow. A 35-request single-client allowance probe received 503 for every request, so the required observed `429` plus `Retry-After` enforcement cannot be confirmed. This is fresh live evidence, not a mock-test result. The free editor does fail softly and displays its offline license-service recovery message, but that does not make the paid feature operable.

### P1 — exact claim command fails in a clean checkout before a build

After `npm ci`, before any build, the first command declared in `.factory/claims.json` failed exactly as written:

```text
npm run test:e2e -- --project=chromium --grep @claim:guide-creation
```

It failed because Playwright starts `vite preview`, but a clean checkout has no `dist/`; `/demo` returns 404 and `#canvas-summary` is absent. The contract expressly requires every claim command to run from the clean clone/demo entry point before other QA; a declared claim command that needs an undocumented preceding build is not reproducible as declared. After the exact production build, all 12 declared commands pass, so this is test-entry-point/reproducibility failure rather than a demonstrated free-editor behavior failure.

## Checks that passed

| Check | Fresh evidence |
| --- | --- |
| Install | `npm ci`: 61 packages installed; 0 vulnerabilities reported |
| Unit/policy | `npm test`: 11/11 passed |
| Type and lint | `npm run typecheck`, `npm run lint`: passed |
| Production build | `npm run build`: passed; generated `dist/` |
| Browser suite | `npm run test:e2e -- --workers=4 --reporter=list`: 58/58 passed (desktop and 390 × 844 mobile) |
| Claims after build | Every one of the 12 exact `.factory/claims.json` commands passed, one test each, using `/demo` |

Independent live exercise used the sample demo and a fresh context. It set fan density to 25, drew/selected guides, rejected a text “image” with “Choose a PNG, JPEG, WebP, or GIF image.”, recovered with a WebP reference, saved a named demo scene, and exported both formats. The SVG had 25 `<line>` and 7 `<path>` elements with no `<image>`; the PNG signature was valid and dimensions were 1200 × 800. Stored demo geometry did not include the reference filename.

At 390px, an actual Chrome CDP touch sequence after selecting Draw spline changed the sample from `13 fan lines · 1 spline` to `13 fan lines · 2 splines`. Keyboard and visible-focus coverage is included in the passing suite. With reduced motion, computed scroll behavior was `auto`; there was no horizontal overflow.

Fresh Axe scans after repeated tool changes reported zero serious/critical violations on desktop and 390px mobile. Console/page errors were zero. `/opt/fleet/lib/verify-url.sh` passed live: HTTP 200, 637 ms, title, `lang=en`, one h1, a main landmark, zero images without alt, zero unnamed buttons, and zero browser errors.

## Privacy, PWA, response policy, and budget

- A complete free live demo flow (reference import, save, SVG, PNG) made only same-origin requests. No analytics, ads, remote scripts/fonts, artwork upload, beacon, or websocket was observed. The imported reference is local/blob-only and excluded from scenes and SVG/PNG output.
- The live root has HSTS, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation permissions denial, `X-Frame-Options: DENY`, and a response-header CSP with `frame-ancestors 'none'`. Hashed JS/CSS are `public, max-age=31536000, immutable`; HTML and `sw.js` are 30-second revalidation.
- After one online live visit, the installed worker cache `ink-guides-69fa4c7cbb858d16` served `/demo` during a true offline reload with the expected title, h1, and sample summary. The 5 service-worker regression tests also pass.
- Production bundle: JavaScript 33,949 bytes raw / 12,165 gzip; CSS 18,534 raw / 5,210 gzip. Both are under the static-web budgets; there are no shipped font files.

## Deployment identity

Fresh SHA-256 comparisons are byte-for-byte matches between this candidate's `dist/` and production:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `0b6bc17d30cc30cbe68703b26d3f91eec1bd661fe6fa61681c30daf73aa52246` |
| `sw.js` | `8dbfaebd9cacc047d9a7e7e48c9841865f9f27c3dc36ff9f138ad06c93b14c1b` |
| `site.webmanifest` | `502ab767ee602f1a1a956e871e3f9e0d6836284a637ada6a0816d13d61ae104b` |
| `assets/index-KnEcKQwT.js` | `c71409c172b9bbd4ecbbd581e22d333b696b09d2b91caa20475eede970f70cc0` |
| `assets/index-D1_YcUUW.css` | `b1245bc961c2bf22fb31a5700776ce12ba88f803ff066a15925f147de818c8cb` |

The deployment matches the candidate. The failure is operational and reproducibility-related, not deployment mismatch.

## Required next steps

1. Restore the Sociobot product checkout and verification endpoint, then demonstrate a real invalid verdict and a single-client burst that reaches `429` with `Retry-After`.
2. Make each declared claim command self-sufficient from a clean checkout (for example, use a test web server that builds first) or document/encode the required build in the command so `dist/` cannot be missing.
3. Rerun all claim commands before other QA and repeat live paid-flow verification. Do not mark the handoff PASS until both P1 defects are resolved.
