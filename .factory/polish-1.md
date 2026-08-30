# Polish 1 — review finding closure

Candidate repaired: `f1aa8a4bab3677576ea11d9dbf40a6152a3e4316`.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Added the visible **How to make a guide layer** section after the editor with Aim, Draw, and Export steps. The dialog remains an optional detail view. | `shows a visible three-step guide and shared navigation on every app route`; live root cold check. |
| F-1-2 | Added the same Demo, View three steps, View Studio price, and Privacy header links to app routes. Added “Built by Param Factory.” to every footer, including the hard 404. | Shared-navigation regression; live 390 px navigation check. |
| F-1-3 | Added complete Open Graph and Twitter metadata to `public/404.html`. | `hard 404 ships complete social metadata`; live `/not-found-independent` returned HTTP 404 with all fields. |
| F-1-4 | Removed the unregistered “Original generated imagery” footer assertion. Provenance remains documented in `.factory/design.md`. | `.factory/claims.json` review and `rg` copy audit; full 70-test suite passed. |
| F-1-5 | Replaced “Choose your canvas” with **Choose a reference image**. | Root/mobile browser regression and copy audit. |
| F-1-6 | Replaced “Guide bench” with **Guide controls**. | Root/mobile browser regression and copy audit. |
| F-1-7 | Replaced the vague export note with **Transparent PNG with guide geometry only.** | Live cold browser check; `geometry-exports` claim test. |
| F-1-8 | Changed tab, social, description, README, controls, help, and demo wording to **curved guide**. The control introduces “spline” once in parentheses. | `route metadata and install icons are complete`; README copy audit; full 70-test suite. |
| F-1-9 | Replaced the header’s ambiguous “How it works” control with the result-naming **View three steps** link. | Shared-navigation regression; live header text check. |
| F-1-10 | Split both long README sentences into short operational sentences and recorded all README sentence counts in `.factory/copy-audit.md`. | Copy audit: no sentence exceeds 22 words. |
| F-1-11 | Removed the unregistered “no API key or product backend” assurance from README. | README copy audit and claims-registry review. |
| F-1-12 | Replaced the ambiguous Studio opener with **View Studio price**, which leads to the named Studio price section. | Shared-navigation regression; live header text check. |
| F-1-13 | Replaced the canvas-bar noun label “Reference” with **Choose reference**. | Root/mobile browser regression and copy audit. |

## Evidence summary

From clean clone `/tmp/guided-inking-overlay-clean-joohuL`: all 12 declared claim commands passed individually; `npm test` passed 12/12; typecheck, lint, and build passed; and the complete Playwright/Axe suite passed 70/70. The production deployment `ebed49b2-0c3f-4422-89d9-017e5d321740` was cold-checked at <https://guided-inking-overlay.sociobot.in>, `/demo`, `/privacy`, `/terms`, and an independent 404. Screenshots and verifier reports are under `/tmp/ink-guides-root-390.png`, `/tmp/ink-guides-demo-390.png`, `/tmp/ink-guides-live-root-Xon95m`, and `/tmp/ink-guides-live-demo-DgLtzw`.
