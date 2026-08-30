# Ink Guides landing-page copy audit

Audited 2026-08-30. Word counts treat hyphenated terms, numerals, and product names as one word. No landing sentence exceeds 22 words. No banned marketing word appears in visitor-facing copy.

## First screen

| Words | Copy |
| ---: | --- |
| 6 | Guides for comic and concept artists |
| 6 | Draw perspective and curved inking guides |
| 14 | Build reusable guide layers over a private reference, then export them to your art app. |
| 9 | Loads two prepared guide scenes in a separate demo. |
| 6 | Works offline after your first visit. |
| 5 | References stay on this device. |
| 3 | Free editor included. |
| 4 | Studio costs $9 once. |

Primary action: “Try it with sample data.” Real-work actions: “Choose reference” and “Start transparent.”

## Editor, storage, and export

| Words | Copy |
| ---: | --- |
| 7 | Use a reference or start blank. |
| 7 | Ink Guides does not upload your reference. |
| 8 | Drag the coral pin to aim. |
| 6 | Press S to draw a curve. |
| 7 | Scenes store guide geometry without your reference. |
| 4 | Your shelf is empty. |
| 10 | Name this setup to reuse it in one tap. |
| 8 | SVG and PNG exports exclude your reference. |
| 6 | Transparent PNG with guide geometry only. |
| 7 | Save 20 scenes and export larger PNGs. |
| 13 | Studio adds 20 local scenes and 2400 × 1600 PNG export. |
| 6 | Drawing and SVG export stay free. |

## Demo banner

| Words | Copy |
| ---: | --- |
| 7 | Demo — sample data, nothing is saved. |
| 7 | Try the prepared station and awning guides. |

Actions: “Reset demo” and “Start for real.”

## Help and Studio dialogs

| Words | Copy |
| ---: | --- |
| 7 | Create and export a guide layer. |
| 8 | Choose Aim fan and drag the coral pin. |
| 5 | Adjust density, rotation, and spread. |
| 12 | Choose Draw curved guide, then draw one curve on the canvas. |
| 6 | Ink Guides repeats it in parallel. |
| 11 | Save the scene or export transparent SVG and PNG geometry. |
| 3 | V selects. |
| 5 | F aims the fan. |
| 6 | S draws a curved guide. |
| 4 | Arrow keys move points. |
| 4 | Shift moves 10 pixels. |
| 6 | Delete removes a curved guide. |
| 4 | Buy Studio once. |
| 4 | Studio costs $9 once. |
| 10 | It adds 20 saved scenes and 2400 × 1600 PNG export. |
| 6 | SVG export and accessibility remain free. |
| 10 | Sociobot/Dodo handles checkout and refunds as the merchant of record. |

## How to make a guide layer

| Words | Copy |
| ---: | --- |
| 12 | Use these three steps with a reference image or a blank page. |
| 4 | Aim the perspective fan. |
| 6 | Drag the coral pin and adjust the lines. |
| 4 | Draw a curved guide. |
| 7 | Draw one curve to create parallel rails. |
| 4 | Export the guide layer. |
| 6 | Save SVG or transparent PNG geometry. |

## Footer

| Words | Copy |
| ---: | --- |
| 6 | Draw guide layers without uploading artwork. |
| 4 | Built by Param Factory. |
| 2 | Version 1.0.1. |

## README

| Words | Copy |
| ---: | --- |
| 14 | Ink Guides draws reusable perspective fans and curved guides for comic and concept artists. |
| 9 | References stay local, and exports contain guide geometry only. |
| 12 | Adjust a rotated perspective fan by density, angle, spread, and vanishing point. |
| 12 | Draw a curved guide directly and repeat it as evenly spaced parallel rails. |
| 12 | Import PNG, JPEG, WebP, and GIF references without saving or uploading them. |
| 9 | Save and reload named guide scenes in browser storage. |
| 10 | Export transparent SVG and PNG guide layers without the reference. |
| 7 | Work offline after the first successful visit. |
| 8 | Use V, F, and S to select tools. |
| 4 | Arrow keys move points. |
| 4 | Shift moves 10 pixels. |
| 6 | Delete removes a curved guide. |
| 15 | The free editor saves three scenes and exports SVG plus 1200 × 800 PNG files. |
| 14 | Studio costs $9 once and adds 20 scenes plus 2400 × 1600 PNG files. |
| 10 | Sociobot/Dodo handles checkout and refunds as the merchant of record. |
| 13 | Open `/demo` or choose “Try it with sample data” on the first screen. |
| 8 | The demo loads two prepared comic-panel guide scenes. |
| 4 | Demo edits use `demo:ink-guides:scenes:v1`. |
| 9 | They never read or change the real `ink-guides:scenes:v1` workspace. |
| 5 | Reset demo restores the samples. |
| 6 | Leaving the demo discards its storage. |
| 6 | See `.factory/demo.md` for the sample and storage details. |
| 13 | Every public product claim and its exact test command is listed in `.factory/claims.json`. |
| 6 | Node.js 20 or newer is required. |
| 8 | `npm run build` writes the static product to `dist/`. |
| 11 | End-to-end tests use Playwright 1.58.2 on desktop and 390px mobile Chromium. |
| 7 | The Playwright server builds before it previews. |
| 7 | Every command in `.factory/claims.json` works without `dist/`. |
| 8 | `npm run check:billing-live` uses an invalid token. |
| 9 | It checks CORS and the checkout redirect without starting a purchase. |
| 12 | Run any claim from a clean state with its command in `.factory/claims.json`. |
| 8 | If Chromium is unavailable, install the pinned browser. |
| 7 | Deploy `dist/` to Azure Static Web Apps. |
| 13 | `public/staticwebapp.config.json` defines the real app routes, 404 response, cache policy, and security headers. |
| 4 | Production billing uses `https://api.sociobot.in`. |
| 8 | A staging build can use the pilot endpoint. |
| 12 | The free editor loads no analytics, advertising, third-party scripts, or CDN fonts. |
| 9 | License verification contacts Sociobot at most once per day. |
| 9 | Read `/privacy` and `/terms` for details. |
| 10 | The paper-cut diorama design is documented in `.factory/design.md`. |
| 6 | The project uses the MIT License. |

## Terminology table

| Concept | One term used |
| --- | --- |
| Perspective line group | fan |
| Repeated curved lines | rails |
| Curved line drawn by the artist | curved guide |
| Saved guide setup | scene |
| User image beneath guides | reference |
| Geometry download | guide layer |
| Paid one-time plan | Studio |
| Isolated sample workspace | demo |
