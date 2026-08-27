# Ink Guides — visual thesis

## Direction: paper-cut drafting diorama

Ink Guides should feel like a compact instrument an artist lays beside a sketchbook, not a miniature paint suite. The page is built as stacked pieces of warm card: a deep studio table, a pale cutting mat, indigo paper shadows, and coral/cyan guide threads. The layered edges explain the product’s function—reference beneath, geometry above—while asymmetrical clipped corners keep it handmade and specific to comics work.

## Palette

The default “night table” treatment is intentionally single-mode so imported pale artwork remains distinct and bright guides stay legible.

- `table` #171A29 — deep blue-black studio surface
- `paper` #F5E8CB — warm tracing paper
- `paper-raised` #FFF6DF — active controls and sheets
- `ink` #172033 — primary text on paper (12.8:1)
- `ink-muted` #5F5B64 — secondary text on paper (5.2:1)
- `chalk` #FFF8E8 — primary text on table (15.9:1)
- `chalk-muted` #BFC1CE — secondary text on table (9.4:1)
- `coral` #F0645A — perspective fan / primary action; dark text used on fills
- `cyan` #38C6C4 — spline rails / focus accent
- `marigold` #F2B84B — selected points / warnings
- `success` #2F8A62; `danger` #A7323B

Guide colors are paired with shape and labels, never used as the sole state cue. Focus rings use cyan with a dark offset. Canvas artwork is framed by an opaque checkerboard mat rather than placing controls over it.

## Type

- Display: Georgia, Cambria, serif. Its engraved, editorial shapes recall title cards and comic lettering without a network font request.
- Utility/body: system UI (`Inter`-like platform sans fallback). It stays compact and clear beside numeric controls.
- Scale: 12 / 14 / 16 / 20 / 32 / fluid 48px; body never below 16px for explanatory copy. Numeric readouts use tabular figures.

No font files are shipped: the two system stacks are local, zero-byte, and privacy preserving.

## Spacing and depth

An 8px rhythm governs controls: 4px micro gaps, 8px related controls, 16px groups, 24px sections, 32–48px narrative space. Buttons are at least 44px. Paper panels use a 2px ink edge plus hard 6–10px paper shadows, not generic blur-heavy cards. Corners are clipped or uneven (2–18px), reinforcing physical cut paper.

On desktop the studio is a two-column instrument: 288px guide bench + elastic canvas. On phones it becomes a canvas-first vertical flow; guide controls use two columns where useful, and no fixed bar obscures safe areas.

## Interaction grammar

- Drag the coral vanishing-point puck to aim the fan.
- Choose “Draw spline,” then draw directly with pen, mouse, or one-finger touch; the rails appear on release.
- Tap a spline knot to select it; arrow keys move it (Shift = 10px).
- Controls update the drawing immediately. The selected tool is expressed by fill, border, icon, label, and `aria-pressed`.
- Save is explicit and produces a named local scene. Import never leaves the device. Exported SVG contains guides only, never the reference.

## Motion

UI changes use 180–220ms opacity/transform transitions with physical origins: drawers rise from their paper edge and notices settle downward. Guides themselves do not animate because precision must feel stable. Under `prefers-reduced-motion: reduce`, transitions and smooth scrolling become instant. Nothing loops or flashes.

## Original asset plan and provenance

The product mark and UI icons are hand-authored SVG geometry in the source and MIT-licensed with the application. The landing/studio welcome illustration is an original generated bitmap: a tactile overhead paper-cut artist desk showing layered perspective threads and curved rails, used only as atmosphere and never as proof of app output.

Prompt sheet: overhead miniature paper-cut drafting diorama; empty warm paper drawing plane, indigo cutting mat, coral perspective threads converging on a brass pin, cyan curved parallel paper rails, small craft knife and binder clips; tactile fibrous cardstock, crisp cut edges, long low shadows; editorial stop-motion model, 3/4 top-down lens; palette of midnight indigo, parchment, coral, cyan, marigold; calm, precise studio light. No people, hands, interface screenshot, text, letters, numbers, logos, watermark, copyrighted characters, photoreal screen, or gradients.

- Generator: Azure AI Foundry factory image deployment via `/opt/fleet/lib/gen-image.sh`
- Date: 2026-08-27
- License/provenance: original AI-generated asset commissioned for Ink Guides; source and exact prompt stored under `assets/src/`.
- Delivery: responsive WebP, explicit dimensions, under 300 KB. Candidate is visually reviewed for text artifacts, brands, seams, and palette fit before use.
