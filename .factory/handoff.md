# Ink Guides repair handoff — local verification complete

## Repair scope

This repair addresses the P1 finding in independent verification report
`23776ef6c11fbc219da7192837d5b7f19edd0f70` for candidate
`41bd4c8247fa0405ed4be19a47f7b1c68b2fd35c`.

- **Root cause:** `setTool()` selected every `[data-tool]`. After the first
  tool change, `#canvas-shell` gains `data-tool`; a second change then applied
  `aria-pressed` to that `div`, which Axe correctly reports as the critical
  `aria-allowed-attr` violation.
- **Repair:** tool event binding and pressed-state updates now target only
  `.tool[data-tool]`. The canvas retains `data-tool` solely as visual state
  and never receives control-only ARIA.
- **Regression:** `tests/studio.spec.ts` performs the exact fan → spline
  sequence, asserts that `#canvas-shell` has no `aria-pressed`, then runs Axe
  and requires zero serious/critical violations. It runs in both desktop
  Chromium and the 390 × 844 mobile Chromium project.

The brief, Vite/static Azure Static Web Apps deployment class, visual system,
local-first reference handling, exports, licensing behavior, and previously
passing product behavior are unchanged.

## Reproduction and exact local evidence (2026-08-28 UTC)

Before the repair, the new regression failed against the requested candidate:

```text
Expected #canvas-shell not to have aria-pressed
Received: <div id="canvas-shell" data-tool="spline" ... aria-pressed="false">
```

From a clean install after the repair:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
```

- `npm ci`: passed; 62 packages audited, 0 vulnerabilities.
- `npm test`: passed; 9/9 Vitest tests (6 geometry, 3 service-worker and
  deployment-policy regressions).
- `npm run typecheck` and `npm run lint`: passed. `lint` intentionally runs
  strict TypeScript in this small vanilla TypeScript app.
- `npm run build`: passed; `dist/index.html` is at the deployment root. The
  generated worker cache is `ink-guides-54dca19c14b7245c`.
- Production budgets: JavaScript 29,607 bytes raw / 11,100 gzip; CSS 16,806
  bytes raw / 4,830 gzip; hero WebP 59,282 bytes. All are within the static
  product budgets.
- `npm run test:e2e -- --workers=4 --reporter=list`: passed; 18/18 checks.
  This exercises the full guide workflow, SVG geometry-only export, local
  reference import/removal, save limits, mocked license return, legal routes,
  keyboard controls, desktop and 390px mobile layouts, touch targets,
  no-third-party requests, offline reload, console errors, and Axe. The new
  repeated-tool Axe regression passed in both projects.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ <temp-dir>`: passed:
  HTTP 200; expected title; `lang=en`; exactly one h1; main landmark; zero
  missing image alt attributes; zero unnamed buttons; no console/page errors;
  543ms local production-preview load.

The repository response-policy regression confirms the Azure configuration
keeps hashed `/assets/*` immutable and preserves CSP and anti-framing headers.
The browser privacy regression confirms a fresh free workspace makes no
cross-origin request; references remain local blob URLs and scenes use local
storage. Package/consumer testing is not applicable: this is a static web app,
not a published library.

## Deployment and live verification

Repair code commit: `e0e534cdc44b99d07c3fd8fd47f19bdc54528203`.

The repair is ready for deployment to the configured Azure Static Web App
`sf-guided-inking-overlay` production environment. Add the deployment result,
live byte identity, response headers, and post-deploy URL verification here
after the production upload completes.

## Known gaps / next steps

- No known local release blocker remains.
- A scored Lighthouse run is not claimed: the supplied environment previously
  rejected/crashed during Lighthouse Chromium collection. Deterministic bundle,
  browser, accessibility, offline, privacy, and response-policy checks pass.
