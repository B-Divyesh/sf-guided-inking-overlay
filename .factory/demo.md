# Ink Guides demo sandbox

## Entry point

- Production: <https://guided-inking-overlay.sociobot.in/demo>
- Local preview: <http://127.0.0.1:4173/demo>
- The equivalent query entry point `/?demo=1` is also supported.

The root first screen links to `/demo` with “Try it with sample data.” No account, key, file, or setup is required.

## Sample data

The demo opens with the editor already active. It includes:

- “Rainy station panel”: a 13-line rotated fan and seven curved platform rails.
- “Market awning curve”: a 9-line fan and five curved awning rails.

The active canvas starts on “Rainy station panel” geometry. The bundled paper-diorama image remains an illustration, not a fake user reference.

## Isolation and reset

- Real scenes use `ink-guides:scenes:v1`.
- Demo changes use `demo:ink-guides:scenes:v1`.
- Demo mode does not read or write the real scene, license, or verdict keys.
- “Reset demo” removes the demo key and restores both samples in memory.
- “Start for real,” another internal route, or browser back navigation leaves demo mode and removes the demo key.

The service worker caches the application shell, so `/demo` remains available after one successful online visit. The sample geometry is compiled into that shell.
