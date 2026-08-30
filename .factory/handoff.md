# Ink Guides polish 1 handoff — PASS

## Delivered

Commit `f1aa8a4bab3677576ea11d9dbf40a6152a3e4316` repairs every finding in `.factory/review-1.md` while preserving the paper-cut drafting diorama. The landing page now has a visible three-step guide, shared route navigation, clear action labels, consistent “curved guide” wording, a complete hard-404 preview, and the requested copy cleanup. The sample demo remains isolated at `/demo` and the static Vite artifact remains unchanged in class.

## Verification — 2026-08-30 UTC

- Clean clone: `/tmp/guided-inking-overlay-clean-joohuL` from `f1aa8a4`.
- Clean-clone gates passed: `npm ci`, `npm test` (**12/12**), `npm run typecheck`, `npm run lint`, and `npm run build`.
- Every exact command in `.factory/claims.json` ran separately from that clean clone with Chromium. All **12/12** passed: `guide-creation`, `reference-privacy`, `local-scenes`, `geometry-exports`, `offline-reload`, `keyboard-controls`, `free-tier`, `studio-tier`, `studio-price`, `daily-license-verification`, `demo-sandbox`, and `no-tracking`.
- Full clean-clone browser suite: `npm run test:e2e -- --workers=4 --reporter=line` — **70/70 passed** across desktop Chromium and 390 × 844 mobile. It includes Playwright Axe scans with zero serious/critical findings, touch targets, keyboard controls, service-worker offline reload, privacy requests, route focus, demo isolation, metadata, and hard-404 regressions.
- Build budget: JavaScript **34.83 kB raw / 12.36 kB gzip**; CSS **20.10 kB raw / 5.51 kB gzip**; the reviewed hero WebP remains 59.28 kB.
- Local URL verification: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/ …` passed with one H1, `lang=en`, main landmark, alt text, named buttons, and no console errors. Mobile screenshots: `/tmp/ink-guides-root-390.png` and `/tmp/ink-guides-demo-390.png`.

## Deployment and cold live check

Deployed with `/opt/fleet/lib/deploy-static.sh guided-inking-overlay dist`.

- Azure Static Web Apps deployment ID: `ebed49b2-0c3f-4422-89d9-017e5d321740`.
- Live URL: <https://guided-inking-overlay.sociobot.in>.
- Cold live root and `/demo` checks passed using `verify-url.sh`: HTTP 200; correct route titles; `lang=en`; exactly one H1; main landmark; image alt text; named buttons; no browser console errors. Evidence directories: `/tmp/ink-guides-live-root-Xon95m` and `/tmp/ink-guides-live-demo-DgLtzw`.
- A fresh 390 px live browser confirmed the clear first screen, visible three-step section, no horizontal overflow, shared header links, the exact export note, one-click demo banner, Reset demo, Start for real, and no console errors.
- Live `/privacy` and `/terms` returned 200. An independent unknown URL returned HTTP 404 and its response contained all Open Graph and Twitter fields for “Page not found — Ink Guides”.

## Known gaps

None. The required repair scope is deployed and verified.
