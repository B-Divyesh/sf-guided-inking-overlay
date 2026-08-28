# Independent verification 4 — FAIL

- **Candidate:** `923c1db3cab95d5ad48fe2d4e1a776dc7aaf7993` (`docs: record repair deployment evidence`)
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-28 UTC from a clean, clean-status checkout at the exact candidate SHA
- **Contract:** original builder work order, researched brief, repository `AGENTS.md`, and the supplied design, accessibility, performance, and paid-unlock requirements
- **Form factors:** desktop Chromium and Chromium at 390 × 844 with real CDP touch events

## Release decision

**FAIL — do not promote this candidate.** Production is byte-for-byte the fresh
candidate build, the core local-first workflow works, and the prior repeated-tool
ARIA defect is repaired. A fresh mobile measurement nevertheless found that all
eight task-critical range controls have only a 28px-high touch target, and a
full target scan found additional undersized reference/navigation targets. The
acceptance contract requires every touch/click target to be at least 44 × 44 CSS
px, and pen/touch input is a specific product constraint. This is a release
blocker, not a deployment-only failure.

## Defects

### P1 — core controls and navigation miss the 44px touch-target minimum at 390px

On a fresh 390 × 844 live context, start transparent and inspect the range input
hit areas. Import a reference to expose the eighth control. Measurements:

| Control | Measured hit area |
| --- | ---: |
| Lines | 330 × 28px |
| Rotation | 330 × 28px |
| Fan spread | 330 × 28px |
| Rails | 330 × 28px |
| Spacing | 330 × 28px |
| Opacity | 330 × 28px |
| Weight | 330 × 28px |
| Reference opacity | 180.33 × 28px |

A full scan after importing a reference found these additional undersized
targets (the file input and its visible label are one interactive target):

| Target | Measured hit area |
| --- | ---: |
| Skip to studio | 141.41 × 43px |
| Ink Guides home | 135.06 × 30px |
| Reference picker after “Remove image” appears | 39.78 × 44px |
| Privacy footer link | 47.08 × 15px |
| Terms footer link | 38.30 × 15px |
| Source footer link | 44.66 × 15px |

The width is generous, but the vertical hit area is 16px short of the explicit
44px minimum. These are the primary controls used to tune fan and spline guide
geometry on the lightweight tablet/browser setup named in the brief. The
repository regression checks only the two welcome buttons, so all 18 included
browser tests pass without detecting this defect.

Required repair: give each range input (or a proven interactive wrapper) and
every other actionable target at least a 44 × 44px hit area at mobile and
desktop breakpoints, prevent the reference picker from flex-shrinking below the
minimum, preserve spacing between adjacent targets, and add a full-page target
regression rather than checking only the welcome buttons.

### P2 — corrupt image recovery emits a CSP console error on production

Reproduction on the live deployment:

1. Choose a file named `broken.png` with MIME type `image/png` whose bytes are
   not a decodable PNG.
2. The UI correctly says: “That image could not be decoded. Try exporting it as
   PNG or JPEG.”
3. Chromium also emits one console error:

```text
Connecting to 'blob:https://guided-inking-overlay.sociobot.in/…' violates the
following Content Security Policy directive: "connect-src 'self'
https://api.sociobot.in https://pilot-api.sociobot.in". The request has been
blocked.
```

The app recovers when a valid WebP is selected and no other console/page error
appeared in the exercised workflow. Align the worker/blob path with the CSP—for
example, avoid intercepting non-HTTP(S) blob requests or deliberately permit the
required blob connection—and add a production-header regression for invalid
image recovery.

## Clean local gates

| Check | Fresh result |
| --- | --- |
| `npm ci` | Pass; 61 packages added, 62 audited, 0 vulnerabilities |
| `npm test` | Pass; 9/9 Vitest tests (6 geometry, 3 service-worker/policy) |
| `npm run typecheck` | Pass; strict TypeScript, no output |
| `npm run lint` | Pass; repository lint command is strict TypeScript |
| `npm run build` | Pass; exact production build created `dist/` |
| `npm run test:e2e -- --workers=4 --reporter=list` | Pass; 18/18 desktop/mobile tests |

Fresh production output:

- JavaScript: 29,607 bytes raw / 11,100 gzip (budget: 200 KB)
- CSS: 16,806 bytes raw / 4,830 gzip (budget: 50 KB)
- hero WebP: 59,282 bytes (budget: 300 KB)
- fonts: 0 bytes; only local system stacks are used
- build target: ES2022

`/opt/fleet/lib/verify-url.sh` passed against the local production preview in
684ms: HTTP 200, expected title, `lang=en`, exactly one h1 and one main, zero
images missing alt, zero unnamed buttons, and zero initial console/page errors.

## Independent end-to-end exercise

The independent harness was separate from the repository suite and removed
after use. Four desktop/mobile scenarios passed their functional assertions:

- Exercised all declared boundaries: fan lines 3/25, rotation -180°/180°,
  spread 30°/180°, rails 1/11, spacing 6/64px, opacity 20/100%, and weight
  1/6px.
- Drew a spline with mouse on desktop and real `Input.dispatchTouchEvent`
  touch events at 390px; both produced one spline and parallel rails.
- Rejected a text file, a corrupt image, and a 25 MB + 1 byte image with useful
  recovery text, then loaded the valid WebP locally. The corrupt-file console
  defect is recorded above.
- Exported SVG contained exactly 25 fan `<line>` elements and 11 rail `<path>`
  elements, with no `<image>` or reference filename. PNG was 1200 × 800,
  `srgba`, and its corner pixel was transparent (`srgba(0,0,0,0)`).
- Empty scene name produced the intended native validity message; a 43-character
  name was constrained to 42; three free scenes persisted across reload; a
  fourth remained unsaved and opened the honest Studio offer. Cancelled and
  confirmed scene deletion both behaved correctly.
- The saved local scene JSON contained geometry and no reference name/data.
- Mocked invalid license verification kept Studio locked with recovery text.
  A valid return token was saved under
  `sb_license:guided-inking-overlay`, removed from the URL, unlocked 2× PNG,
  and caused only one verify call across a subsequent reload because the daily
  verdict cache was honored.
- The buy link is the required Sociobot endpoint and the dialog states $9,
  one-time scope, merchant of record, restore flow, privacy, and terms. No
  payment provider is embedded.

The free experience remained usable throughout. Package/consumer testing is not
applicable because this is a static web product, not a library or CLI. There is
no product backend or sign-in flow; Entra authority checks are therefore not
applicable.

## Accessibility, keyboard, mobile, and visual checks

- Independent Axe scans after repeated tool changes, after the full workflow,
  with the license dialog open, and on the privacy route found **0 serious or
  critical** findings on desktop and mobile.
- The prior critical defect is repaired: fan → spline and repeated S/F/S
  changes never put `aria-pressed` on `#canvas-shell`.
- Keyboard-only use passed for skip-link access, modal open/Escape/focus return,
  tool activation with Space and shortcuts, range Home/End, canvas arrow/Shift
  + arrow adjustment, and visible undo state.
- The focused skip link had a visible 3px solid outline. Native dialog focus
  containment/name/role/state behaved correctly.
- Reduced-motion resolved scroll behavior to `auto` and transitions to
  `1e-05s`; nothing loops or flashes.
- Initial desktop and full 390px screenshots were visually reviewed. There was
  no horizontal overflow, clipping, fixed-bar obstruction, or hidden core
  action. The documented paper-cut drafting system is present and the single
  night-table mode is explicitly justified in `.factory/design.md`.
- The mobile welcome buttons and primary action buttons remain at least 44px
  high. The complete set of measured exceptions is recorded in the P1 above.

## Privacy and outbound requests

- A fresh free workspace and valid reference import made only same-origin
  requests. No analytics, ads, telemetry, CDN fonts/scripts, artwork upload,
  beacon, or websocket path exists in source or in browser traffic.
- References use local blob URLs and are absent from saved scenes/exports.
  Geometry and optional license data use `localStorage`.
- The billing API is contacted only after a token is supplied/returned. A real
  invalid-token request returned the documented JSON with HTTP 200,
  `Cache-Control: no-store`, and
  `Access-Control-Allow-Origin: https://guided-inking-overlay.sociobot.in`.
- `/privacy` and `/terms` are present and accurately describe local storage,
  billing verification, merchant-of-record behavior, and user controls.

## Endpoint rate limiting

The only server endpoint used by the static product is the Sociobot license
verification endpoint. A rapid sequential burst to:

```text
GET https://api.sociobot.in/api/v1/products/guided-inking-overlay/verify?license=<invalid>
```

returned HTTP 200 for requests 1–30. Request **31** returned HTTP **429** with
`Retry-After: 4` and body `Too Many Requests! Wait for 4s`. This passes the
required endpoint rate-limit check; the observed threshold was 30 successful
requests in the burst.

## PWA, response policy, and deployment identity

- The service-worker two-release unit regression passed. In a fresh live
  context, an injected `ink-guides-old-sentinel` cache was removed when the
  current worker installed/activated, the versioned current cache appeared,
  and an offline reload retained the title and visible h1.
- Chrome reported no web-app manifest or installability errors.
- Live root policy: HSTS, `nosniff`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Frame-Options: DENY`, and CSP with
  `frame-ancestors 'none'`. Root/SW use a short 30-second revalidation policy.
- The hashed JavaScript asset returned
  `Cache-Control: public, max-age=31536000, immutable`; the committed deployment
  config applies the same rule to `/assets/*`.
- `/opt/fleet/lib/verify-url.sh` passed live in 720ms with the same semantic and
  zero-initial-error results as local.

Fresh SHA-256 hashes matched local `dist/` and production exactly:

| Artifact | SHA-256 |
| --- | --- |
| `index.html` | `d0230988ed4730690f9ec8c30440c7a3cd590a1e2fc93fcf8678813715cd8259` |
| `sw.js` | `9a567bcba8592aaa7e8768397ea82aeb06d41f4a43841b69bb6d7e5f4c2c9d9a` |
| `site.webmanifest` | `f163e12fe0b306b6472cfa3151f4e3f503e25f9ded05bd7c86664f1b517a5223` |
| `assets/index-CiOBn7JJ.js` | `08833ba474ec12bd0f335573c4c1e39b3f43921fe767f33dbef2d44ffe897b43` |
| `assets/index-BroQw4Fl.css` | `a5acbb0cefee5faec66f90581faf3aa5ebf7f77e8d7eeed441bbe04b6c7d06ca` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |

Production therefore matches candidate `923c1db3…`; neither defect is explained
by deployment skew.

## Lighthouse 12.8.2 mobile

| Target | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Local production preview | 97 | 100 | 100 | 100 | 1.6s | 190ms | 0 |
| Live production | 100 | 100 | 100 | 100 | 1.3s | 40ms | 0 |

Both runs had no warnings. Lighthouse does not provide lab INP; TBT is recorded
as the available interaction proxy.

## Required next verification

Increase all undersized hit areas to at least 44 × 44px, repair the invalid-image
CSP console path, add coverage for both, rebuild/redeploy, and rerun independent
desktop/mobile verification. Do not mark PASS until the touch-target blocker is
gone.
