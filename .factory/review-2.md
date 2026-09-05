# Draw perspective and curved inking guides — strict review 2 — FAIL

Reviewed 5 September 2026 UTC at <https://guided-inking-overlay.sociobot.in> in fresh desktop and 390 × 844 phone Chromium contexts, and from a clean checkout.

## Verdict

**FAIL — 1 low-severity finding remains.** All 12 declared claims were tested and passed, so the untested claim count is 0. This review requires zero findings at every severity. The repeatable moderate Axe landmark violation on `/demo` therefore prevents PASS.

## Reviewed versions

- Assigned implementation candidate: `0d5958e6fbac85451fb7be686bcf1f4d4e0702f4`.
- Last product-code commit within that candidate: `f1aa8a4bab3677576ea11d9dbf40a6152a3e4316`.
- Documentation baseline at review start: `b57415f37f4460dfb3bac02ce447e37d8a336230`.
- `0d5958e6` and the later `b57415f` change only `.factory` reports. No later product image is required.
- Fresh local output matched production byte for byte for HTML, service worker, JS, CSS, both WebP assets, manifest, robots, sitemap, and 404 files.

## First screen

The required first-read gate passes before scrolling on both desktop and phone.

- Job: **Draw perspective and curved inking guides.**
- Audience: **Guides for comic and concept artists.**
- First action: **Try it with sample data.**
- Adjacent result: **Loads two prepared guide scenes in a separate demo.**

The title names the job, the words are direct, and the first action is inside the initial viewport at 1440 × 900 and 390 × 844.

## Finding

### F-2-1 — LOW: the persistent demo banner is outside a landmark

On a fresh live `/demo` page, Axe 4.10.2 reports one `region` violation with impact **moderate**:

```text
Target: .demo-banner
HTML: <div class="demo-banner" role="note" aria-label="Demo mode">
Issue: Some page content is not contained by landmarks
```

The result reproduces before any editing, after exporting, and at 390 × 844. The banner is a sibling before `<main>` and is not inside `header`, `nav`, `main`, or `footer`.

This corrects the attribution in `verification-9.md`: the live-region toast is not the target. A separate populated root-page scan found no Axe violation after its toast appeared. The target is the demo banner.

The issue does not block the demo, keyboard use, or status announcements, and no serious or critical Axe issue exists. It is still a finding under this review's zero-findings rule.

Suggested repair: place the banner inside a suitable existing landmark, or give its containing structure an appropriate landmark without recreating the earlier nested complementary landmark defect. Add a regression that rejects every Axe violation, not only serious and critical results.

## Sample and real workflow

The functional workflow passes.

- One click opened `/demo` with **Rainy station panel** and **Market awning curve** already populated.
- The persistent label read **Demo — sample data, nothing is saved** and kept **Reset demo** and **Start for real** available.
- A real scene was seeded before entering the demo. The demo neither displayed nor changed it.
- A demo-only scene wrote only `demo:ink-guides:scenes:v1`.
- Reset removed demo storage and restored the two samples. Start for real removed demo storage and restored the real scene.
- Fan density reached 25 and rotation reached −180°. Drawing another curve produced `25 fan lines · 2 curved guides`.
- Empty scene names, a text file, and corrupt PNG bytes produced specific recovery text. A valid WebP then loaded normally.
- The exported SVG contained 25 lines and 14 rail paths with no image element. The free PNG was 1200 × 800.
- Keyboard Tab reached the skip link first. V, F, S, arrows, Shift+arrows, and Delete are covered by passing browser tests.
- A real touch sequence on the phone added a curved guide. The phone layout had no horizontal overflow or visible target below 44 × 44 CSS px.
- Reduced motion matched, scrolling became `auto`, and transition duration was `0.00001s`.
- The full free flow made only same-origin HTTP requests. Local blob URLs were used for the reference and downloads. No artwork upload, tracker, remote script, or remote font was observed.
- A current worker removed a seeded obsolete cache. After one online visit, `/demo` reloaded offline with its title and populated sample.

The app supplies the brief's complete job: aim reusable perspective fans, draw parallel curved guides over a private reference, save scenes, and export guide-only SVG or PNG files. An AI step would add network and privacy cost without improving this geometry task, so no missed AI feature is recorded.

## Declared claims

After `npm ci` in the clean checkout, every exact command in `.factory/claims.json` was run separately. Each selected one tagged test and passed.

| Claim | Result |
| --- | --- |
| `guide-creation` | PASS |
| `reference-privacy` | PASS |
| `local-scenes` | PASS |
| `geometry-exports` | PASS |
| `offline-reload` | PASS |
| `keyboard-controls` | PASS |
| `free-tier` | PASS |
| `studio-tier` | PASS with recorded valid response |
| `studio-price` | PASS |
| `daily-license-verification` | PASS |
| `demo-sandbox` | PASS |
| `no-tracking` | PASS |

Landing, editor, README, privacy, terms, and 404 wording were cross-checked against the registry. No missing or untested public product claim was found.

## Earlier findings

Every earlier reported defect and minor review item was checked.

| Earlier item | Current disposition |
| --- | --- |
| Fixed service-worker cache retained old shells | Fixed. Unit regression passed; live activation removed `ink-guides-review2-obsolete`. |
| Welcome actions below 44 px | Fixed. Full phone target scan found no visible target below 44 × 44 px. |
| Hashed assets lacked immutable caching | Fixed. Live hashed JS returns one-year `immutable` caching. |
| CSP and frame protection absent | Fixed. Live response CSP includes `frame-ancestors 'none'`; HSTS, nosniff, DENY, referrer, and permissions headers are present. |
| Repeated tool changes put `aria-pressed` on a div | Fixed. The 70-test suite and fresh Axe scans show no `aria-allowed-attr` result. |
| Mobile ranges, reference picker, navigation, and footer targets were too small | Fixed. The complete visible-target scan passed at 390 px. |
| Corrupt image recovery logged a CSP error | Fixed. Text and corrupt-image rejection followed by a valid image produced no unexpected console error. |
| Claims registry and one-click demo were missing | Fixed. Twelve claims exist and pass; `/demo` is populated in one click. |
| Route focus/announcement, real 404, and metadata were incomplete | Fixed. Route tests passed; normal routes return 200; the designed missing page returns deliberate HTTP 404 and has a way home. |
| Claim commands required an undocumented build | Fixed. Each exact command built and passed directly after `npm ci`. |
| Billing endpoints were unavailable | Fixed. Invalid verification, CORS/no-store, hosted checkout redirect, and rate limiting passed. |
| A fresh unverified offline token unlocked Studio | Fixed. Browser regressions keep it at 3 scenes and 1200 × 800 until a valid verdict exists. |
| Nested complementary landmark on the demo | The invalid nested `aside` is gone. The replacement note remains outside every landmark and is the current F-2-1. |
| Review 1 F-1-1: no visible three-step section | Fixed. The visible Aim, Draw, Export section is present. |
| Review 1 F-1-2: inconsistent header/footer | Fixed. Shared navigation, legal links, factory credit, and version are present. |
| Review 1 F-1-3: 404 social metadata missing | Fixed. The hard 404 contains Open Graph and Twitter metadata. |
| Review 1 F-1-4: unlisted imagery claim | Fixed. The public assertion was removed. |
| Review 1 F-1-5: “Choose your canvas” metaphor | Fixed. It now says “Choose a reference image.” |
| Review 1 F-1-6: “Guide bench” metaphor | Fixed. It now says “Guide controls.” |
| Review 1 F-1-7: vague “artwork-safe” copy | Fixed. It now states the transparent guide-only PNG result. |
| Review 1 F-1-8: spline/curve terminology | Fixed. Public wording consistently uses “curved guide”; spline appears once as clarification. |
| Review 1 F-1-9: unclear “How it works” control | Fixed. It now says “View three steps.” |
| Review 1 F-1-10: two long README sentences | Fixed. The copy audit contains no sentence over 22 words. |
| Review 1 F-1-11: unregistered backend assurance | Fixed. The assurance was removed. |
| Review 1 F-1-12: unclear Studio opener | Fixed. It now says “View Studio price.” |
| Review 1 F-1-13: noun-only reference control | Fixed. It now says “Choose reference.” |
| Verification 9 moderate landmark advisory | Still present as F-2-1, with the exact target corrected from the toast to `.demo-banner`. |

## Quality gates

| Check | Result |
| --- | --- |
| `npm ci` | PASS — 61 packages installed; 0 vulnerabilities |
| `npm test` | PASS — 12/12 |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run build` | PASS — `dist/` created |
| `npm run test:e2e` | PASS — 70/70 desktop and phone tests |
| `/opt/fleet/lib/verify-url.sh` | PASS — 200, title, lang, one H1, main, alt text, named buttons, no console errors |
| `npm run check:billing-live -- --rate-limit` | PASS — invalid verdict, hosted checkout redirect, 429, `Retry-After: 4` |
| Lighthouse 12.8.2 mobile | 100 performance, 100 accessibility, 100 best practices, 100 SEO |

Lighthouse recorded FCP 0.9 s, LCP 1.3 s, TBT 0 ms, and CLS 0. Production JS is 34,827 bytes raw / 12,244 bytes gzip; CSS is 20,099 bytes raw / 5,519 bytes gzip; the hero WebP is 59,282 bytes; no fonts ship.

## Routes, billing, and scope

- `/`, `/demo`, `/privacy`, and `/terms` return 200 with route-specific titles. The tested unknown path returns the expected designed HTTP 404.
- Live billing rejects an invalid token, sends the production CORS allowance and `no-store`, redirects checkout to hosted Dodo, and rate limits with 429 plus `Retry-After`.
- No charge was created. Valid Studio behavior uses the recorded fixture.
- This is a static, local-first browser product. It has no tenant database, server persistence, health endpoint, CLI, library package, or desktop installer to test.
- The brief's artist success measure requires a user study. This review verified the complete five-line-capable workflow but did not recruit artists.

## Final result

**FAIL. Finding count: 1. Untested claim count: 0.**
