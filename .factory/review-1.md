# Adversarial first-read review 1 — FAIL

Reviewed 2026-08-30 UTC against <https://guided-inking-overlay.sociobot.in> from fresh desktop and 390 × 844 Chromium contexts, plus a clean local checkout.

## Verdict

**FAIL.** No blocking functional defect was found, but 13 minor findings remain. The acceptance rule for this review is zero findings, so this is not a PASS.

## Cold first screen

This gate **passes** on mobile and desktop before scrolling.

- **What it does:** It lets artists draw perspective and curved inking guides over a reference and export the guide layer.
- **For whom:** The eyebrow states, “GUIDES FOR COMIC AND CONCEPT ARTISTS.”
- **What to click first:** “Try it with sample data.” Its adjacent text says it loads two prepared guide scenes in a separate demo.

At 390 px the first screen was 390 px wide with no horizontal overflow. It showed the job, audience, primary action, and three plain facts. No console or page errors occurred.

## Findings

### F-1-1 — MINOR: the required visible “How it works” section is absent

**Location/quote:** the root page header has a button labelled “How it works”, but the landing-page body has no `How it works` section. The button opens a dialog instead of providing the required three-step, scannable landing section.

**Why this loses a first-time visitor:** a person deciding whether to try the tool cannot scan the promised three-step workflow while reading the page. The live editor is useful, but it does not replace a plainly titled explanation section in the required information order.

**Concrete fix:** add a visible section after the editor headed **“How to make a guide layer”**, with three short steps: **“Aim the perspective fan,” “Draw a curved guide,” and “Export the guide layer.”** Keep the dialog only as an optional shortcut.

### F-1-2 — MINOR: the global header/footer contract is incomplete

**Location/quote:** the root header navigation contains “Demo”, “How it works”, and “Studio”; it has no Privacy link. The footer says “Draw guide layers without uploading artwork. ✦ Original generated imagery. Version 1.0.1” and does not include “Built by Param Factory.” Legal-page headers use a different navigation (“Demo”, “Back to studio”).

**Why this loses a first-time visitor:** navigation changes by route and the required ownership line is absent. This weakens predictable wayfinding, especially for a visitor looking for privacy information before importing artwork.

**Concrete fix:** use the same header structure on all routes: wordmark, Demo, How it works, Studio, and Privacy. Add **“Built by Param Factory”** to every footer while retaining Privacy, Terms, and the version.

### F-1-3 — MINOR: the server-rendered 404 lacks Open Graph and Twitter metadata

**Location/quote:** a fresh direct request to `/not-found-independent` returned HTTP 404 and the designed page correctly said “This page does not exist”, but its HTML had no `og:title`, `og:description`, `og:image`, `twitter:card`, `twitter:title`, or `twitter:description` tags.

**Why this misleads:** shared or cached bad links have no product-specific preview even though all normal routes provide one. This is an incomplete route metadata implementation.

**Concrete fix:** add the same self-hosted social-image metadata to `public/404.html`, with title **“Page not found — Ink Guides”** and description **“This Ink Guides page does not exist.”**

### F-1-4 — MINOR: footer provenance copy is an unlisted claim

**Location/quote:** root footer: “Original generated imagery.” There is no matching entry in `.factory/claims.json` or observable claim test.

**Why this matters:** it is a visitor-facing assertion about the asset’s origin. The claims contract requires claim-like landing and README statements to be declared and tested, or removed.

**Concrete fix:** either remove this nonessential footer sentence, or add an `original-imagery-provenance` claim with a deterministic test that confirms the shipped asset and its prompt/provenance record are present and linked from the product.

### F-1-5 — MINOR: “Choose your canvas” is a mood/metaphor heading

**Location/quote:** editor welcome eyebrow: “CHOOSE YOUR CANVAS”.

**Why this loses a first-time visitor:** it does not name the task in this section. The controls are for adding a reference image or starting without one; “canvas” is decorative wording rather than instruction.

**Concrete fix:** replace it with **“Choose a reference image”**.

### F-1-6 — MINOR: “Guide bench” is a metaphorical section heading

**Location/quote:** control-panel heading: “Guide bench”.

**Why this loses a first-time visitor:** a heading list or screen reader does not tell the person that this is where fan, curve, and ink controls live.

**Concrete fix:** replace it with **“Guide controls”**.

### F-1-7 — MINOR: “artwork-safe” is an unexplained marketing adjective

**Location/quote:** export note: “Transparent background · artwork-safe”.

**Why this loses a first-time visitor:** “artwork-safe” does not add a testable fact and can be interpreted as a vague compatibility promise. The preceding export copy already gives the useful fact.

**Concrete fix:** replace the full note with **“Transparent PNG with guide geometry only.”**

### F-1-8 — MINOR: tool terminology is inconsistent and introduces jargon in metadata

**Location/quote:** root title and social title say “Draw perspective and spline guides”; the H1 says “Draw perspective and curved inking guides”; the README says both “parallel curved rails” and “Draw a spline”.

**Why this loses a first-time visitor:** “spline” is unexplained technical language and the product alternates between it and “curved”. The first screen is clearer than the document title, which is backwards for a shared tab or search result.

**Concrete fix:** use **“curved guides”** in title, social metadata, and introductory README copy. If the control must retain the technical name, label it **“Draw curved guide (spline)”** once and then use “curved guide” consistently.

### F-1-9 — MINOR: the “How it works” button does not name its result

**Location/quote:** header button: “How it works”.

**Why this loses a first-time visitor:** it is a question, not a result-naming action. It does not say that it opens the three-step guide.

**Concrete fix:** rename the button **“View three steps”** and give the dialog the matching heading **“How to make a guide layer.”**

### F-1-12 — MINOR: the Studio opener does not say what it opens

**Location/quote:** root header button: “Studio”. It opens the purchase/license dialog.

**Why this loses a first-time visitor:** the label is a plan name, not an action or outcome. A visitor cannot tell whether it shows price, starts checkout, or changes editing mode.

**Concrete fix:** rename it **“View Studio price”**. Keep **“Buy Studio once”** as the dialog’s purchase action.

### F-1-13 — MINOR: the canvas reference control is not an action label

**Location/quote:** canvas-bar file control: “Reference”. It opens the image chooser.

**Why this loses a first-time visitor:** it is a noun rather than a result-naming action, while the first-run version correctly says “Choose reference.”

**Concrete fix:** use **“Choose reference”** in both locations.

### F-1-10 — MINOR: two README sentences exceed the 22-word cap

**Location/quote:**

- “The Playwright server builds before it previews, so each exact command in `.factory/claims.json` also works from a clean checkout with no `dist/` directory.” (23 words)
- “`npm run check:billing-live` uses an invalid token only; it verifies the production billing API's browser CORS verdict and hosted checkout redirect without starting a purchase.” (25 words)

**Why this loses a first-time visitor:** the run/test instructions require rereading and bundle more than one idea into a sentence.

**Concrete fix:** replace them with:

> The test server builds before it previews. Every command in `.factory/claims.json` works without `dist/`.

> `npm run check:billing-live` uses an invalid token. It checks CORS and the checkout redirect without starting a purchase.

### F-1-11 — MINOR: README assurance is not registered as a claim

**Location/quote:** README, Run locally: “The editor needs no API key or product backend.”

**Why this matters:** this is a useful operational assurance, but it has no `.factory/claims.json` entry or sandbox assertion.

**Concrete fix:** either remove “or product backend” and state the local run step only, or add an `editor-no-api-key` claim whose clean-context test loads `/demo` and completes the core guide/export flow with no key or product API request.

## Copy audit

Counts below treat whitespace-separated tokens, numerals, hyphenated terms, and code identifiers as one word. Labels, buttons, and headings are audited separately in the findings above; this table lists every complete sentence visible on the root landing route and every complete README sentence.

### Landing-page sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 15 | Build reusable guide layers over a private reference, then export them to your art app. | Pass |
| 9 | Loads two prepared guide scenes in a separate demo. | Pass |
| 6 | Works offline after your first visit. | Pass |
| 5 | References stay on this device. | Pass |
| 3 | Free editor included. | Pass |
| 4 | Studio costs $9 once. | Pass |
| 6 | Use a reference or start blank. | Pass |
| 7 | Ink Guides does not upload your reference. | Pass |
| 12 | Drag the coral pin to aim; press S to draw a curve. | Pass |
| 7 | Scenes store guide geometry without your reference. | Pass |
| 4 | Your shelf is empty. | Pass |
| 9 | Name this setup to reuse it in one tap. | Pass |
| 7 | SVG and PNG exports exclude your reference. | Pass |
| 3 | Transparent background · artwork-safe. | **F-1-7** |
| 7 | Save 20 scenes and export larger PNGs. | Pass |
| 11 | Studio adds 20 local scenes and 2400 × 1600 PNG export. | Pass |
| 6 | Drawing and SVG export stay free. | Pass |
| 6 | Draw guide layers without uploading artwork. | Pass |
| 3 | Original generated imagery. | **F-1-4** |

### README sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 15 | Ink Guides draws reusable perspective fans and parallel curved rails for comic and concept artists. | **F-1-8** terminology |
| 9 | References stay local, and exports contain guide geometry only. | Pass |
| 12 | Adjust a rotated perspective fan by density, angle, spread, and vanishing point. | Pass |
| 12 | Draw a spline directly and repeat it as evenly spaced parallel rails. | **F-1-8** jargon |
| 12 | Import PNG, JPEG, WebP, and GIF references without saving or uploading them. | Pass |
| 9 | Save and reload named guide scenes in browser storage. | Pass |
| 10 | Export transparent SVG and PNG guide layers without the reference. | Pass |
| 7 | Work offline after the first successful visit. | Pass |
| 8 | Use V, F, and S to select tools. | Pass |
| 4 | Arrow keys move points. | Pass |
| 4 | Shift moves 10 pixels. | Pass |
| 4 | Delete removes a spline. | Pass |
| 15 | The free editor saves three scenes and exports SVG plus 1200 × 800 PNG files. | Pass |
| 14 | Studio costs $9 once and adds 20 scenes plus 2400 × 1600 PNG files. | Pass |
| 10 | Sociobot/Dodo handles checkout and refunds as the merchant of record. | Pass |
| 13 | Open `/demo` or choose “Try it with sample data” on the first screen. | Pass |
| 8 | The demo loads two prepared comic-panel guide scenes. | Pass |
| 4 | Demo edits use `demo:ink-guides:scenes:v1`. | Pass |
| 9 | They never read or change the real `ink-guides:scenes:v1` workspace. | Pass |
| 5 | Reset demo restores the samples. | Pass |
| 6 | Leaving the demo discards its storage. | Pass |
| 8 | See `.factory/demo.md` for the sample and storage details. | Pass |
| 13 | Every public product claim and its exact test command is listed in `.factory/claims.json`. | Pass |
| 9 | The editor needs no API key or product backend. | **F-1-11** |
| 6 | Node.js 20 or newer is required. | Pass |
| 11 | End-to-end tests use Playwright 1.58.2 on desktop and 390px mobile Chromium. | Pass |
| 23 | The Playwright server builds before it previews, so each exact command in `.factory/claims.json` also works from a clean checkout with no `dist/` directory. | **F-1-10** |
| 25 | `npm run check:billing-live` uses an invalid token only; it verifies the production billing API's browser CORS verdict and hosted checkout redirect without starting a purchase. | **F-1-10** |
| 12 | Run any claim from a clean state with its command in `.factory/claims.json`. | Pass |
| 8 | If Chromium is unavailable, install the pinned browser. | Pass |
| 7 | Deploy `dist/` to Azure Static Web Apps. | Pass |
| 13 | `public/staticwebapp.config.json` defines the real app routes, 404 response, cache policy, and security headers. | Pass |
| 4 | Production billing uses `https://api.sociobot.in`. | Pass |
| 8 | A staging build can use the pilot endpoint. | Pass |
| 12 | The free editor loads no analytics, advertising, third-party scripts, or CDN fonts. | Pass |
| 9 | License verification contacts Sociobot at most once per day. | Pass |
| 12 | The paper-cut diorama design and original asset provenance are documented in `.factory/design.md`. | Pass |
| 6 | The project uses the MIT License. | Pass |

## Demo, sandbox, privacy, and claims

The one-click demo gate **passes**.

- Clicking the visible root action opened `/demo` in one click.
- The first demo view already showed the editor operating with the Rainy station panel: 13 fan lines and one spline. The saved-sample list also included Market awning curve.
- The persistent banner read **“Demo — sample data, nothing is saved”** and exposed working **“Reset demo”** and **“Start for real”** actions.
- A direct isolation probe seeded real storage, saved “Demo-only shelf” in demo, and observed only `demo:ink-guides:scenes:v1` change. The real `ink-guides:scenes:v1` remained unchanged. Leaving via Start for real removed the demo key.
- Fresh live demo request logs contained only the product origin: document, local JS, local CSS, and local hero image. No third-party scripts, fonts, analytics, advertising, or artwork upload was observed.

All 12 declared commands were executed individually after `npm ci` and passed:

| Claim id | Result |
| --- | --- |
| `guide-creation` | Pass |
| `reference-privacy` | Pass |
| `local-scenes` | Pass |
| `geometry-exports` | Pass |
| `offline-reload` | Pass |
| `keyboard-controls` | Pass |
| `free-tier` | Pass |
| `studio-tier` | Pass |
| `studio-price` | Pass |
| `daily-license-verification` | Pass |
| `demo-sandbox` | Pass |
| `no-tracking` | Pass |

The full local suite also passed: `npm test` (12 tests), typecheck, lint, production build, and the 66-test Playwright run. Production JS is 34.15 kB raw / 12.23 kB gzip. The live billing probe passed with an invalid verdict, a checkout redirect, and HTTP 429 plus `Retry-After: 4`.

## Structure, accessibility, and history

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. A fresh direct unknown route returned a designed HTTP 404 with a home path. The normal routes had one H1, a main landmark, title, description, canonical URL, favicon, apple touch icon, Open Graph fields, and Twitter fields. **F-1-3** records the hard-404 exception.
- In-app Demo navigation and browser Back both moved focus to the new H1 and announced the new route. No console errors occurred.
- Mobile root/demo had no horizontal overflow. Visible actionable buttons and links measured at least 44 px high; the small native checkbox/file inputs sit inside labelled 44 px controls. The full Playwright/Axe suite passed.
- The paper-cut drafting identity is distinct and matches `.factory/design.md`; it is not a generic SaaS card/gradient treatment.
- No additional AI step is warranted by the brief. The expected valuable workflow—local reference import, reusable scenes, and SVG/PNG export—is implemented. An AI feature would add network/privacy cost without improving the stated perspective-guide job.

Earlier reports were reread in full. Their findings were checked against live behavior and current tests:

| Earlier finding | Current confirmation |
| --- | --- |
| Fixed-cache service-worker update (verification.md P1) | Fixed: versioned-worker regression tests pass in `npm test`; offline demo claim passes. |
| 390 px welcome controls below 44 px (verification.md P1) | Fixed: current mobile controls expose 44 px action targets. |
| Immutable hashed assets / CSP absent (verification.md P2) | Fixed: live hashed JS is `max-age=31536000, immutable`; response CSP includes `frame-ancestors 'none'`. |
| Invalid `aria-pressed` after two tool changes (verification-2 P1) | Fixed: full 66-test browser/Axe suite passes. |
| Mobile range/navigation targets and corrupt-image CSP error (verification-4 P1/P2) | Fixed: mobile regression suite passes; current reference/import workflow has no console errors. |
| Missing claims, demo, route focus, real 404, and basic metadata (verification-5 P0/P1/P2) | Fixed in the original scope: registry/demo exist, focus/announcement work, direct unknown route is 404, and normal routes have metadata. F-1-3 is a new hard-404 social-metadata gap. |
| Clean claim command and live billing availability (verification-6 P1/P1) | Fixed: all exact commands pass from this checkout; live billing probe passes. |
| Offline first-use license unlock and nested complementary landmark (verification-7 P1/P3) | Fixed: full suite includes the license regression and passes; demo is a `note`, not a nested complementary landmark. |

## What would make this perfect

Resolve F-1-1 through F-1-13: make the three-step explanation visible on the landing page, complete global navigation/footer and hard-404 metadata, remove or prove the two unlisted assurances, and replace the identified metaphor/jargon/vague wording. Then rerun every declared claim command and the full browser suite. With those changes, the product would be clear, tryable, private by default, and free of remaining review findings.
