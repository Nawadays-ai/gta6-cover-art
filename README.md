# Vice Nights Cover Studio

[![make.fun gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/c/gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/Nawadays-ai/gta6-cover-art/rank.svg)](https://make.fun/c/gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/Nawadays-ai/gta6-cover-art/reward.svg)](https://make.fun/c/gta6-cover-art-01)

An entry for [make.fun's gta6-cover-art-01](https://make.fun/c/gta6-cover-art-01) bounty, from the repository Nawadays-ai/gta6-cover-art.

## What it does

Vice Nights Cover Studio is a small offline web app that turns your own
photos and a caption into a multi-panel poster cover in the Vice City
sunset style, then exports it as a PNG ready to post. Everything happens
in the browser on your machine: photos are read from local files, never
uploaded, and the app makes no network requests at all.

Open `app/index.html` in a desktop browser (or run `node serve.ts` and
visit the local address it prints), load a photo or two, type a title,
and export.

## The covers

- **Box Art** — an irregular seven-panel mosaic that bleeds to the edges
  of the canvas over thick black gutters, with a hero panel, mixed
  aspect ratios and a couple of slightly angled panel edges. It has
  separate arrangements for portrait/square and landscape canvases.
- **Hero** — one full-bleed photo under a gradient sky tint, framed by
  drawn palm silhouettes, with the title at the top.
- **Triptych** and **Quad** — three- and four-panel full-bleed layouts.
- The caption is set in heavy white lettering with a black outline,
  stacked over the middle of the mosaic, above an original diamond
  emblem (sunset gradient, sun disc, two palms, and the title's first
  initial), with a small script subtitle.
- Five colour grades: Illustrated (the default — boosted colour,
  five-level posterise, purple shadows, warm highlights and a rotating
  per-panel hue wash), Sunset, Neon, Noir and Gold.
- Panels without a photo are filled with small drawn scenes — a
  helicopter over a skyline, a speedboat with a flamingo, a sports car,
  an alligator, palms over a striped sun, a deco hotel, birds over a
  bay — so a cover looks finished even before every panel has a photo.

## Controls

- One file picker per panel, a button that fills every panel with a
  single photo, and an Empty button per panel.
- Per panel: zoom (1–3×), pan, and a focal point. The focal point is set
  with two sliders or by dragging the pink pin on the preview onto the
  face; the crop then keeps that point at the panel's centre. The pin
  only exists in the editor and never appears in exports.
- Title and subtitle text fields, four caption presets, layout and
  grade pickers, and a preview-size switch.
- One-click PNG export at 1080 × 1080, 1080 × 1350 and 1920 × 1080.

## Layout of this repository

- `app/` — the static app (`index.html`, `style.css`, `src/*.js`, plus
  two sample photos under `app/samples/` that were made for make.fun
  and are free to use).
- `main.ts` — the entry program: copies `app/` and `screenshots/` to
  the output directory and writes `dossier.json` with the vendored
  library in `vendor/makefun-app.ts`.
- `serve.ts` — a tiny local static server for previewing the app.
- `screenshots/` — four captures of the running app, described in
  `shots.json`.
- `SUMMARY-gta6-cover-art-01.md` — a short build summary.

## Tech notes

Plain HTML, CSS and ES modules on a 2D canvas — no dependencies, no
build step, no fonts or images fetched from anywhere. Photo grading is
a per-pixel pass (contrast, saturation, posterise, shadow/highlight
tints) done once per photo and grade, then cached; the focal crop is
computed from the cached graded image. All artwork, including the
emblem, the palm silhouettes and the empty-panel scenes, is drawn by
the code at render time; nothing here uses Rockstar Games logos,
artwork, characters or fonts.

MIT licensed — see `LICENSE`.
