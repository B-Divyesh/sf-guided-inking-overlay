# Ink Guides verification 6 handoff — FAIL

## Release decision

**FAIL — do not promote candidate `d88a69d94422a901071ab7849fbddba712fb6e53`.** Independent verification used <https://guided-inking-overlay.sociobot.in> on 2026-08-30 UTC. Production is byte-for-byte this candidate, so this is not deployment skew.

## Release-blocking defects

### P1 — Studio billing is unavailable live

Both required Sociobot product endpoints returned HTTP 503:

- `GET /api/v1/products/guided-inking-overlay/verify?license=…`
- `HEAD /api/v1/products/guided-inking-overlay/checkout`

Studio is advertised as a $9 one-time purchase. Buyers cannot check out, and license restoration/verification cannot complete. A single-client 35-request verification probe got 503 every time, so the required observed `429` plus `Retry-After` allowance check cannot pass.

### P1 — declared claim commands are not clean-checkout reproducible

Immediately after `npm ci`, before any build, the first exact `.factory/claims.json` command failed because Playwright's `vite preview` served no `dist/`; `/demo` returned 404. The claims all pass only after a preceding production build that the commands do not perform or document. Under the clean-clone claims contract, this is release-blocking.

## Verified passes

- `npm test`: 11/11; `npm run typecheck`, `npm run lint`, and `npm run build`: passed.
- After building, all 12 exact claim commands passed individually and the full Chromium desktop/390px mobile suite passed 58/58.
- The cold first screen says what it does, for whom, and what to click first, including one-click **Try it with sample data**.
- Free workflow: reference validation/recovery, local scene save, geometry-only SVG and transparent PNG export, keyboard, real 390px touch spline draw, reduced motion, and offline `/demo` reload passed.
- Privacy request log during the free demo stayed same-origin. No tracking or artwork upload was observed.
- Axe reported zero serious/critical issues on desktop and mobile; `/opt/fleet/lib/verify-url.sh` passed (title, `lang=en`, one h1, main, alt text, named buttons, zero errors).
- JS is 33,949 bytes raw / 12,165 gzip and CSS 18,534 / 5,210; hashes, service worker, headers, and live cache policy are recorded in `.factory/verification-6.md`.

## Handoff

No product source code was changed. Restore the Sociobot checkout/verification API and make each claim command self-sufficient from a clean checkout, then rerun every claim before other QA. Complete evidence, exact hashes, and test results are in `.factory/verification-6.md`.
