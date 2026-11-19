# Summary — gta6-cover-art-01 entry "Vice Nights Cover Studio"

## Contents

- `app/index.html` and `app/style.css` — the editor page and its styling.
- `app/src/palette.js` — the five grade recipes and the seven-colour wash cycle.
- `app/src/motifs.js` — seven flat vector scenes for empty panels, plus the shared palm-silhouette painter.
- `app/src/renderer.js` — panel layouts, gutter maths, the focal crop window, the photo grading pass, the title/emblem/subtitle block, and the top-level cover painter.
- `app/src/studio.js` — editor state and wiring: panel cards, caption presets, segmented pickers, the draggable focal pin, PNG export, and the `?shot=` scenes used for the screenshots.
- `app/samples/pier.jpg`, `app/samples/boulevard.jpg` — the kit's sample photos, copied unchanged.
- `vendor/makefun-app.ts` — the kit's dossier library, copied byte for byte.
- `main.ts` — the entry program (copies `app/` + `screenshots/`, writes `dossier.json`, with a small pre-flight check on the screenshots folder).
- `serve.ts` — a pocket static server for local preview.
- `shots.json` — the four screenshot scenes.
- `screenshots/` — the four captures listed below.

## Features

- Four full-bleed layouts with black gutters: Box Art (irregular 7-panel mosaic, portrait/square and landscape arrangements, two angled panel edges), Hero (single image, gradient sky tint, palm silhouettes, title at top), Triptych, Quad.
- Caption: editable title auto-split into 2–3 stacked lines in heavy outlined white lettering overlapping the mosaic's middle band; an original diamond emblem with a sunset gradient, sun disc, palm silhouettes and the title's initial (a star when there is no title); a script subtitle under the emblem (at the poster's foot on Hero covers).
- Grades: Illustrated (default; saturation/contrast lift, 5-level posterise, purple shadows, warm highlights, per-panel hue wash from a 7-hue palette), Sunset, Neon, Noir, Gold.
- Focal framing: each panel carries a focal point; the crop window centres it and clamps to the image bounds. Resting focal height is 0.26 for portrait panels or photos, 0.29 for near-square, 0.35 for landscape panels. The focal point is editable by sliders and by dragging a pink pin on the preview (editor only, never exported). Per-panel zoom 1–3× and pan, per-panel photo loading, fill-all-with-one-photo, and per-panel emptying are all in the panel cards.
- One-click PNG export at 1080×1080, 1080×1350 and 1920×1080. Fully offline; no dependencies; no network strings anywhere under `app/`.

## How the screenshots were made

The app was loaded from `file://` in headless Chromium (driven over the DevTools protocol, with file access allowed) at the scenes named in `shots.json`:

1. `1-cover.jpg` (1280×720) — the `?shot=wide` scene: the app's own cover painter drawn at the full 1920×1080 export size, Box Art landscape, Illustrated grade, both sample photos placed with the measured face focals (pier fx 0.44 / fy 0.26, boulevard fx 0.56 / fy 0.19), captured and saved as JPEG.
2. `2-editor.jpg` (1280×800) — the `?shot=editor` scene: the full editor with both sample photos loaded, the focal pin visible on the hero panel's face.
3. `3-cover.jpg` (1024×1280) — the `?shot=portrait` scene: a Portrait Box Art cover drawn at 1080×1350.
4. `4-cover.jpg` (1080×1080) — the `?shot=hero` scene: a Square Hero cover drawn at 1080×1080.

Each capture was converted to JPEG at quality 85; all four are under the 256 KiB cap. Every screenshot was opened and inspected: in each panel that shows a person, the face is framed head-and-shoulders. Getting there took three adjustments, all verified by re-shooting — the wide and portrait scenes' extra photo panels were re-aimed at the measured face focals (they had been torso crops), the caption block was rescaled so the emblem and subtitle stay on-canvas at wide aspect, and the Hero header was rearranged (emblem above the title, tagline at the foot) so the lettering clears the hero photo's face.

## Tests run

- `node --check` passes on all four JavaScript modules.
- `main.ts` run twice with two different `MAKEFUN_OUTPUT_DIR` values: the two `dossier.json` files are byte-identical, and the output trees contain the complete `app/` and `screenshots/`.
- Text search confirms no `http://` or `https://` strings anywhere under `app/`.
- Screenshot dimensions and byte sizes checked against the gate's limits (long side ≤ 1280, short side ≥ 480, ≤ 256 KiB each).
- The app was exercised in the browser for every screenshot scene (wide, editor, portrait, hero), which covers three layouts, the Illustrated grade, sample-photo loading, focal placement and the caption block.
