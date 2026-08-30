# Ink Guides

Ink Guides draws reusable perspective fans and parallel curved rails for comic and concept artists. References stay local, and exports contain guide geometry only.

Live product: <https://guided-inking-overlay.sociobot.in>

One-click sample demo: <https://guided-inking-overlay.sociobot.in/demo>

## What it does

- Adjust a rotated perspective fan by density, angle, spread, and vanishing point.
- Draw a spline directly and repeat it as evenly spaced parallel rails.
- Import PNG, JPEG, WebP, and GIF references without saving or uploading them.
- Save and reload named guide scenes in browser storage.
- Export transparent SVG and PNG guide layers without the reference.
- Work offline after the first successful visit.
- Use V, F, and S to select tools. Arrow keys move points. Shift moves 10 pixels. Delete removes a spline.

The free editor saves three scenes and exports SVG plus 1200 × 800 PNG files. Studio costs $9 once and adds 20 scenes plus 2400 × 1600 PNG files. Sociobot/Dodo handles checkout and refunds as the merchant of record.

## Try the isolated demo

Open `/demo` or choose “Try it with sample data” on the first screen. The demo loads two prepared comic-panel guide scenes.

Demo edits use `demo:ink-guides:scenes:v1`. They never read or change the real `ink-guides:scenes:v1` workspace. “Reset demo” restores the samples. Leaving the demo discards its storage.

See [`.factory/demo.md`](.factory/demo.md) for the sample and storage details. Every public product claim and its exact test command is listed in [`.factory/claims.json`](.factory/claims.json).

## Run locally

Node.js 20 or newer is required.

```sh
npm ci
npm run dev
```

The editor needs no API key or product backend.

## Test and build

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
npm run check:billing-live
```

`npm run build` writes the static product to `dist/`. End-to-end tests use Playwright 1.58.2 on desktop and 390px mobile Chromium. The Playwright server builds before it previews, so each exact command in `.factory/claims.json` also works from a clean checkout with no `dist/` directory. `npm run check:billing-live` uses an invalid token only; it verifies the production billing API's browser CORS verdict and hosted checkout redirect without starting a purchase.

Run any claim from a clean state with its command in `.factory/claims.json`. For example:

```sh
npm run test:e2e -- --project=chromium --grep @claim:demo-sandbox
```

If Chromium is unavailable, install the pinned browser:

```sh
npx playwright install chromium
```

## Deploy

Deploy `dist/` to Azure Static Web Apps. `public/staticwebapp.config.json` defines the real app routes, 404 response, cache policy, and security headers.

Production billing uses `https://api.sociobot.in`. A staging build can use the pilot endpoint:

```sh
VITE_BILLING_API_BASE=https://pilot-api.sociobot.in npm run build
```

The free editor loads no analytics, advertising, third-party scripts, or CDN fonts. License verification contacts Sociobot at most once per day. Read `/privacy` and `/terms` for details.

The paper-cut diorama design and original asset provenance are documented in [`.factory/design.md`](.factory/design.md). The project uses the MIT License.
