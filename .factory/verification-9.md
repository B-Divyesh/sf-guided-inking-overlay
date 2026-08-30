# Ink Guides independent verification 9 — PASS

- **Verdict:** PASS — release candidate accepted
- **Candidate:** `0d5958e6fbac85451fb7be686bcf1f4d4e0702f4`
- **Live URL:** <https://guided-inking-overlay.sociobot.in>
- **Verified:** 2026-08-30 UTC
- **Contract:** original builder work order, researched brief, repository `AGENTS.md`, and the supplied claims, demo, plain-language, accessibility, performance, site-structure, privacy, and paid-unlock requirements

No release-blocking defect was found. The prior report's deployment-only concern does not reproduce: the live billing endpoints work, enforce a request allowance, and the deployed static files exactly match this candidate.

## Mandatory first-read gate

Fresh service-worker-free contexts opened the live root at 1440 × 900 and 390 × 844.

- **What it does:** “Draw perspective and curved inking guides.”
- **For whom:** “Guides for comic and concept artists.”
- **What to click first:** “Try it with sample data.” The adjacent explanation says it loads two prepared scenes in a separate demo.
- The action is visible within the first viewport at both widths. One click opens `/demo`, where the editor immediately shows `13 fan lines · 1 curved guide`, two realistic named scenes, and the persistent “Demo — sample data, nothing is saved” banner with **Reset demo** and **Start for real**.

The mandatory first-read/demo gate passes.

## Claims gate

`.factory/claims.json` exists and declares 12 claims. The initial bare-checkout invocation correctly could not load Playwright before dependencies existed. After the documented `npm ci`, every exact command in the registry ran separately, directly from the clean checkout. The configured server builds the production artifact before serving `/demo`.

| Claim | Result |
|---|---:|
| `guide-creation` | PASS |
| `reference-privacy` | PASS |
| `local-scenes` | PASS |
| `geometry-exports` | PASS |
| `offline-reload` | PASS |
| `keyboard-controls` | PASS |
| `free-tier` | PASS |
| `studio-tier` | PASS |
| `studio-price` | PASS |
| `daily-license-verification` | PASS |
| `demo-sandbox` | PASS |
| `no-tracking` | PASS |

Each command selected one tagged test and passed. No public claim in the landing page, legal pages, or README lacked registry coverage.

## Clean-checkout test and build results

| Check | Fresh result |
|---|---|
| `npm ci` | PASS; 61 packages, 0 audit vulnerabilities |
| `npm test` | PASS; 12/12 unit and service-worker regression tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS; repository intentionally aliases strict TypeScript checking |
| `npm run build` | PASS; exact production build created `dist/` |
| `npm run test:e2e -- --project=chromium` | PASS; 35/35 desktop tests |
| `npm run test:e2e -- --project=mobile` | PASS; 35/35 tests at 390 × 844 |
| `/opt/fleet/lib/verify-url.sh` | PASS; HTTP 200, title, `lang=en`, one H1, main, alt text, named buttons, no console errors |

## Independent end-to-end product exercise

A separate live Playwright harness made 70 passing assertions without importing repository test helpers.

- Opened the sample demo by keyboard from a clean landing page.
- Loaded the two prepared scenes and confirmed the active 13-line fan and curved guide.
- Exercised the maximum 25-line fan density, changed the fan with arrow keys, and switched tools with V/F/S.
- Drew a second curved guide with a mouse on desktop and with one-finger touch at 390 px.
- Imported a real WebP reference, then confirmed storage and SVG omitted its name, blob URL, data URL, and image element.
- Saved a named scene, reloaded geometry, reached the free 3/3 scene boundary, and received a clear Studio explanation on the fourth save.
- Exported a geometry-only SVG containing fan lines and curved paths, with no `<image>`.
- Exported a valid 1200 × 800 PNG from the free tier.
- Entered an empty scene name, a non-image file, and a corrupt PNG. Each produced specific recovery guidance, after which a valid reference loaded normally.
- Submitted a unique invalid license to the live verification endpoint. It stayed locked, retained the 1200 × 800 free limit, and explained how to recover.

This is the brief's smallest useful workflow: an artist can adjust rotated perspective geometry, draw offset curved rails, keep reusable scenes, use a private reference, and export the guide layer for another art app. Pen/touch behavior, saved-scene limits, Studio dimensions, valid-license behavior, delete confirmation, and route restoration also pass the 70-test browser suite. A real purchase was not initiated and no production-valid customer license was available; the valid-license path uses the required recorded fixture in automated tests.

## Accessibility, keyboard, mobile, and motion

- Independent Axe scans covered the cold root, completed demo, Studio dialog, privacy route, and 390 px demo: **0 serious and 0 critical findings**.
- One non-blocking moderate `region` advisory appears while the transient export/status toast contains text; see P3 below.
- Semantic smoke checks pass: `lang=en`, descriptive route titles, one H1, main/header/nav/footer landmarks, ordered headings, labels, alt text, and named controls.
- The skip link is the first Tab stop. Its focus treatment is a 3 px cyan outline with a dark 2 px offset. The sample action and editor tools are keyboard reachable and operable.
- SPA route changes focus the new H1 and announce the route; browser back restores the correct page.
- The 390 px layout has no horizontal overflow. Every visible button, link, range, switch, and file action measured at least 44 × 44 CSS px.
- The live mobile touch flow created a curved guide without scrolling or pointer traps.
- With `prefers-reduced-motion: reduce`, the media query matched, smooth scrolling became `auto`, and no transition or animation longer than 50 ms remained.
- Visual inspection of cold and completed desktop/mobile captures found no overlap, clipped essential copy, hidden fixed-bar content, or unusable control density.
- Lighthouse mobile accessibility: **100**.

## Privacy and security

The complete free live flow—load, demo entry, corrupt and valid local imports, drawing, saving, SVG export, and PNG export—made only same-origin HTTP(S) requests. The cold page requested only the document, hashed JS, hashed CSS, and the local hero image. There were no analytics, ads, beacons, remote scripts, remote fonts, websockets, or artwork uploads. Reference data remained in a browser blob and was absent from saved scenes and exports.

The only cross-origin product request observed was the user-triggered license check to `api.sociobot.in`. It returned the documented invalid verdict, exact production-origin CORS, and `Cache-Control: no-store`. The checkout URL returned the expected redirect to hosted Dodo checkout. No raw payment or Azure AI endpoint appears in the product.

Live document and asset responses include CSP, HSTS, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, strict-origin referrer policy, and camera/microphone/geolocation restrictions. The CSP limits scripts and fonts to self and allows connections only to self plus the documented Sociobot production/pilot billing origins. There were no browser console or page errors.

The app has no sign-in flow, so the Microsoft Entra authority check does not apply. It is a static web app with local browser storage, so backend concurrency, server persistence, database, and health endpoint checks do not apply.

## Billing endpoint allowance

`npm run check:billing-live -- --rate-limit` passed the invalid verdict, CORS, no-store, hosted checkout redirect, and 429 checks.

A later clean-window sequential probe from one client recorded:

- requests 1–30: HTTP 200 with `{ valid: false, reason: "invalid", expires_at: null }`;
- request 31: HTTP **429** with **`Retry-After: 4`** and `Too Many Requests! Wait for 4s`.

Observed allowance: **30 successful verification requests per burst per client**, then enforcement with 429 and `Retry-After`.

## PWA/offline behavior

- The installed worker uses the versioned cache `ink-guides-66b481d10a3c87b3`.
- An independent update exercise seeded `ink-guides-qa-obsolete`, unregistered the active worker, closed its controlled page, and reinstalled the deployed worker. Activation removed the obsolete cache.
- After one successful online `/demo` visit, a context-level offline reload retained title `Demo — Ink Guides`, the banner, and the `13 fan lines · 1 curved guide` workspace.
- The unit suite separately covers two-version cache changes and old-cache deletion.

## Deployment identity and caching

The checked-out HEAD was the requested candidate before documentation changes. Fresh SHA-256 hashes matched production exactly for all material static artifacts:

| Artifact | SHA-256 |
|---|---|
| `index.html` | `ae3fd698763ed7fe795c14d1748af18b6ada049786ede3d39ee8215975ae85b1` |
| `sw.js` | `66426d74568bfa48665025407df7ec132c254f0b8cde3970a94eed004c783206` |
| `assets/index-CdzhcBEO.js` | `add196c5f05793ae213b9016842a77728bd69e1eeb564257c4e2be0b18b0628f` |
| `assets/index-DA6Biwf8.css` | `b76ba238901074125c801b8c137e14d6b0eddc5712eac32e12af7ef29f0a048f` |
| `assets/hero-paper-diorama.webp` | `a583689bf711d51572f52938b224651d83623c7c5088711cc9c956688444c540` |
| `assets/ink-guides-social.webp` | `9fff07a7d253e02b948e585767528eeb0b3a1d73c0bce5724d555bfc19a1a4b4` |

Manifest, robots, sitemap, 404 HTML, and 404 CSS also matched. Production therefore serves the candidate, not a stale deployment. Hashed JS/CSS/images return `Cache-Control: public, max-age=31536000, immutable`; HTML, manifest, and the worker use 30-second revalidation. An unknown route returns the designed hard 404 with a way home.

## Performance and metadata

- Application JS: **34,827 bytes raw / 12,244 bytes gzip** (budget ≤ 200 KB).
- CSS: **20,099 bytes raw / 5,519 bytes gzip** (budget ≤ 50 KB).
- Hero WebP: **59,282 bytes** (budget ≤ 300 KB).
- Fonts: **0 bytes**; only local system stacks are used.
- Lighthouse 12.8.2 mobile: **98 performance, 100 accessibility, 100 best practices, 100 SEO**.
- Lighthouse lab metrics: FCP **1.0 s**, LCP **1.4 s**, Speed Index **1.0 s**, TBT **170 ms**, CLS **0**, TTI **1.4 s**.
- Root, demo, privacy, and terms routes return 200 with route-specific titles and canonicals. Internal links were crawled successfully. The manifest has install icons; social metadata, theme color, sitemap, robots, hard 404, README, MIT license, privacy, terms, demo documentation, visual thesis, copy audit, and build/version footer are present.

## Defects by severity

- **P0:** none.
- **P1:** none.
- **P2:** none.
- **P3:** after a status/export toast is populated, Axe reports one moderate `region` advisory because that transient live-region node sits outside a landmark. It does not affect its accessible status announcement, keyboard use, or the required serious/critical Axe gate. A future cleanup can place the toast inside the main landmark or an appropriate top-level region.

## Verification limits

- No charge was created. Hosted checkout was verified through its redirect, and valid Studio behavior was verified with the recorded response fixture.
- The brief's artist success measure is a user-study outcome. QA verified the complete five-line-capable workflow and that edits do not require manual guide redraws, but did not recruit artists.
- This is not a library, CLI, or server product; consumer-package, CLI, concurrency, SQLite, and health/build endpoint checks are not applicable.

**Final result: PASS.**
