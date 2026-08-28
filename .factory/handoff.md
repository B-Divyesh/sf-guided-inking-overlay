# Ink Guides independent QA handoff — FAIL

**Candidate:** `41bd4c8247fa0405ed4be19a47f7b1c68b2fd35c`

**Live URL:** <https://guided-inking-overlay.sociobot.in>
**Decision:** **FAIL — do not promote.**

Fresh clean-checkout verification confirms production is byte-for-byte this candidate and that local install, unit/regression tests (9/9), type/lint, production build, and repository browser tests (16/16) pass. Core desktop/mobile/touch guide creation, boundary controls, invalid-input recovery, local reference privacy, SVG geometry-only export, offline reload, response security/caching policies, keyboard focus, and bundle budgets also passed.

The release blocker is P1: after changing tools twice, `#canvas-shell` receives `aria-pressed="false"`; Axe reports critical `aria-allowed-attr` because it is a `div`, not a permitted pressed control. Trigger: start transparent → Aim fan/F → Draw spline/S. See [.factory/verification-2.md](verification-2.md) for exact evidence, hashes, full test commands, and remediation.

To verify after repair:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --workers=4 --reporter=list
```

Then repeat Axe after selecting two different tools and compare the rebuilt `dist/` hashes to the live deployment. Lighthouse was attempted but unavailable because the container's supplied Chromium is rejected by Lighthouse 13.4.1; no score is claimed.
