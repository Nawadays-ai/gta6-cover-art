[![make.fun](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/c/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/Nawadays-ai/gta6-cover-art/rank.svg)](https://make.fun/c/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/Nawadays-ai/gta6-cover-art/reward.svg)](https://make.fun/c/gta6-cover-art-01)

# Vice Nights — GTA-style Cover Studio

A web app that turns your photos and a caption into a full-bleed box-art
mosaic poster, exported as a PNG to share. Built for the make.fun
`gta6-cover-art-01` bounty. **v2 restyle:** the covers now follow the
composition patterns of the official GTA VI key art and box art — an
irregular mosaic with thick black gutters, a huge stacked title overlapping
the middle, a sunset-gradient emblem, per-panel hue washes and a posterised
"illustrated" photo grade. All artwork and lettering remain original and
drawn in code.

## What it does

- **Box Art layout (default)** — an irregular mosaic of 7 panels in mixed
  sizes and aspect ratios (a couple of edges slightly angled), bleeding to
  all four edges with thick black gutters (~1% of width) and one larger
  hero panel. The mosaic adapts its arrangement to portrait, square and
  wide canvases. Hero (key-art composition), Triptych and Quad layouts are
  still available, all restyled to full-bleed panels with black gutters.
- **Stacked title over the art** — your title is set in huge white,
  extra-bold rounded block letters with a heavy black outline, stacked in
  2–3 lines across the middle of the mosaic — never in a separate band.
  Behind it sits an original emblem: a diamond badge filled with a vertical
  sunset gradient (deep purple → magenta → orange) with palm silhouettes
  inside it and your title's first initial at its centre (a star badge if
  the title is empty). The subtitle stays small and subordinate.
- **Illustrated grade (default)** — photos are posterised, saturation-
  boosted and duotone-leaning (purple shadows, warm highlights), and every
  panel gets its own dominant hue wash (teal, hot pink, purple, orange,
  aqua…), so snapshots read as comic vignettes. The previous grades —
  Sunset, Neon, Noir and Gold — remain selectable.
- **Motif panels** — a panel without a photo is not left blank: it is
  filled with an original flat-vector scene drawn in code, rotating through
  a helicopter over the skyline, a speedboat with a pink flamingo, a yellow
  sports car, an alligator in the water, palm silhouettes against a striped
  sunset, art-deco hotels, and birds over the bay.
- **Key-art Hero layout** — one full-bleed hero image with a gradient-sky
  treatment, code-drawn palm silhouettes framing both sides, and the title
  at the top over the picture.
- **Any photo** — load photos from your machine into any panel, then crop
  and position each one: drag the preview, or use the zoom and pan sliders.
  One photo can fill every panel; a panel can be cleared back to its motif
  scene.
- **Fast export** — one click exports a PNG in the common post sizes:
  1080 × 1080, 1080 × 1350, or 1920 × 1080.

## Try it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. Everything runs offline:
the app is plain static files under `app/`, with no network request. Your
photos are read on your own machine and never uploaded.

## Original work

The layout *patterns* — mosaic geometry, black gutters, the overlapping
stacked title, the gradient-emblem idea, per-panel hues and the posterised
grade — are inspired by the official GTA VI key art and box art. Everything
actually drawn is original: the emblem is this app's own diamond badge with
the user's initial (never the game's logo or "VI" mark), the lettering is
set in system fonts with code-drawn outlines, the motif scenes are drawn
from scratch in `app/src/cover.js`, and no Rockstar Games artwork, logo,
character or font is used or copied. The two sample photos under
`app/samples/` were made with an image model for make.fun and are free to
use.

## Files

- `app/index.html` — the editor page
- `app/src/cover.js` — the cover renderer (mosaic, emblem, title, grades, motifs)
- `app/src/main.js` — editor wiring (photos, crop, captions, export)
- `app/src/shots.js` — fixed scenes for screenshots (`?shot=`)
- `app/src/presets.js` — caption presets and layout data
- `main.ts` — the make.fun entrypoint (Node 22, standard library only)
- `serve.ts` — tiny static server for local tries
- `vendor/makefun-app.ts` — the kit's vendored library, unchanged

## License

MIT — see `LICENSE`.
