# Ink Guides

Ink Guides is a local-first browser drafting instrument for comic and concept artists. It creates reusable rotated perspective fans and parallel spline rails over a private reference image, then exports clean transparent guide geometry as SVG or PNG.

Live product: <https://guided-inking-overlay.sociobot.in>

## What it does

- Aim a perspective fan by dragging its vanishing point; tune density, rotation, and spread.
- Draw a spline with mouse, pen, or touch and repeat it as evenly spaced parallel rails.
- Import a PNG, JPEG, WebP, or GIF reference locally. Images are decoded in the browser, never uploaded, never saved in scenes, and never included in exports.
- Save and reload named guide scenes in browser storage.
- Export artwork-safe transparent SVG and PNG layers.
- Work offline after the first successful visit.
- Use the editor from keyboard: V/F/S select tools, arrows nudge a point, Shift + arrows nudge 10 px, and Delete removes a selected spline.

The useful free tier includes guide creation, three local scenes, SVG export, and 1200×800 PNG export. The optional $9 one-time Studio license adds 20 local scenes and 2400×1600 PNG export through the Sociobot billing API.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

The development server prints its local URL. No API key or backend is needed for the editor.

## Test and build

```sh
npm test
npm run build
npm run test:e2e
```

`npm run build` type-checks the app and writes the static deployment to `dist/`, with `dist/index.html` at its root. End-to-end tests use pinned Playwright 1.58.2 and include desktop, 390px mobile, Axe accessibility, console, import, drawing, local persistence, routing, and SVG-export checks.

If Playwright browsers are not already available:

```sh
npx playwright install chromium
```

## Deployment and configuration

Deploy the contents of `dist/` to Azure Static Web Apps. `public/staticwebapp.config.json` supplies SPA navigation fallback and security headers.

The production billing base defaults to `https://api.sociobot.in`. A staging build can use the factory’s pilot endpoint without changing source:

```sh
VITE_BILLING_API_BASE=https://pilot-api.sociobot.in npm run build
```

No product ID is embedded; checkout and verification are addressed by the product slug, `guided-inking-overlay`.

## Privacy and design

There are no analytics, third-party scripts, CDN fonts, or artwork uploads. Scenes and optional license data use `localStorage`; license verification runs against Sociobot at most once per day. See `/privacy` and `/terms` in the product.

The product-specific paper-cut diorama visual system and generated-image provenance are documented in [`.factory/design.md`](.factory/design.md). The project is available under the MIT License.
