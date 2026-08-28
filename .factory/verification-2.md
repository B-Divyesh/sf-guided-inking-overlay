# Independent verification 2 — FAIL

- **Candidate:** `41bd4c8247fa0405ed4be19a47f7b1c68b2fd35c` (`docs: record repair deployment evidence`)
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-28 UTC from a clean, clean-status checkout at that exact SHA.
- **Scope:** the researched brief, static-web acceptance contract, desktop Chromium, and 390 × 844 mobile/touch Chromium.

## Release decision

**FAIL — do not promote this candidate.** The repaired deployed artifact is byte-for-byte the candidate and the core local-first guide workflow works, but a normal two-tool interaction produces an Axe **critical** accessibility violation. The acceptance contract requires zero serious/critical Axe findings.

## Blocking defect

### P1 — changing tools twice adds an invalid ARIA state to a non-control

1. Start a transparent guide.
2. Choose **Aim fan** (or press `F`).
3. Choose **Draw spline** (or press `S`).
4. Run Axe.

Axe reports `aria-allowed-attr`, impact **critical**, on:

```html
<div class="canvas-shell" id="canvas-shell" data-tool="spline" aria-pressed="false">
```

The cause is `setTool()` selecting every `[data-tool]`. The first selection adds `data-tool` to `#canvas-shell`; on the second selection it is included alongside the tool buttons and receives `aria-pressed`. `aria-pressed` is not permitted on a `div`. This is not present on the initial screen or after only one selection, which explains why the included Axe coverage passed. Scope the selector to tool buttons (for example, `.tool[data-tool]`) and add a regression that changes tools at least twice before running Axe.

## Checks that passed

### Clean local build and repository suite

| Check | Evidence |
| --- | --- |
| Install | `npm ci`: 62 packages audited; 0 vulnerabilities |
| Unit/regression | `npm test`: 9/9 Vitest tests passed (6 geometry, 3 service-worker/deployment-policy) |
| Type/lint | `npm run typecheck` and `npm run lint`: passed; lint intentionally runs `tsc --noEmit` |
| Exact production build | `npm run build`: passed and created `dist/` |
| Repository browser suite | `npm run test:e2e -- --workers=4 --reporter=list`: 16/16 Chromium desktop + mobile tests passed |

Build budgets: JS **29,597 bytes** raw / **11,100 gzip**; CSS **16,806 bytes** raw / **4,830 gzip**; hero WebP **59,282 bytes**. These are within the 200 KB JS, 50 KB CSS, and 300 KB hero budgets. The app ships no font files or third-party CDNs.

### Independent live product exercise

Using a fresh production browser context, I:

- started transparent, aimed the fan with keyboard (`F`, arrow, Shift+arrow), and exercised the documented control boundaries: 25 lines, -180° rotation, 30° spread, 11 rails, and 64 px spacing;
- drew a normal spline, including a real CDP touch sequence at 390 × 844; the canvas reported one spline and rails were created;
- exported SVG and inspected its payload: 25 fan `<line>` elements, 11 rail `<path>` elements, and no `<image>` element; this confirms exported geometry excludes the reference;
- rejected a text file as a reference, recovered with a valid PNG, removed it, and confirmed the local reference controls behaved correctly;
- checked empty scene-name validation, saved three free scenes, then tried a fourth; the shelf stayed at 3/3 and opened the Studio prompt;
- exercised skip-link keyboard focus, 44 × 44px welcome actions at 390px, no horizontal overflow, and reduced-motion behavior (`scroll-behavior: auto`, effectively instant transitions);
- observed no page errors or console errors, and no cross-origin request during a fresh free-workspace load.

The same independent flow proved the current installed PWA shell reloads offline. The generated live worker has cache `ink-guides-ab971e453c681c12`; its versioned cache and activation cleanup, together with the passing worker upgrade regression, resolve the prior fixed-cache update defect. A two-version *deployed* upgrade could not be exercised without authority to change the deployment.

### Accessibility, privacy, and policies

- `/opt/fleet/lib/verify-url.sh https://guided-inking-overlay.sociobot.in/`: HTTP 200, 727ms load, expected title, `lang=en`, one h1, main landmark, zero images without alt, zero unnamed buttons, zero browser errors.
- Initial and one-tool states have no serious/critical Axe finding; the repeatable two-tool P1 above is the release-blocking exception.
- Source and browser request audit found no analytics, advertising, external scripts, CDN fonts, or artwork-upload path. Reference files use a local blob URL; saved geometry and optional license state use `localStorage`; the billing API is contacted only for a supplied/returned license.
- Live root sends HSTS, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `X-Frame-Options: DENY`, and CSP including `frame-ancestors 'none'`. Live hashed JS/CSS/WebP send `Cache-Control: public, max-age=31536000, immutable`.

### Deployment identity

Fresh SHA-256 comparisons matched local `dist/` exactly against production for `index.html`, `sw.js`, `assets/index-C9Sm_TSD.js`, `assets/index-BroQw4Fl.css`, and `assets/hero-paper-diorama.webp`. The live root references the same JS and CSS asset names and serves the same versioned service worker. The deployment therefore does match the requested candidate; this is not a deployment-only mismatch.

## Measurement note

Lighthouse 13.4.1 could not run in this container because its launcher rejects the supplied Playwright Chromium as older than the current Chrome stable requirement. No Lighthouse score is claimed. Deterministic bundle, browser, Axe, and response-policy checks are recorded above.

## Required next step

Repair the P1 selector/ARIA bug, add the two-tool Axe regression, rebuild and redeploy, then rerun independent verification. Do not claim PASS until that critical finding is gone.
