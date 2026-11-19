// renderer.js — draws a complete cover onto any 2D canvas.
// Panels tile the whole canvas over a black ground, photos are graded
// once and cached, and the caption block sits on top of the mosaic.

import { GRADE_RECIPES, washForPanel } from './palette.js';
import { paintMotif, drawPalmSilhouette } from './motifs.js';

export const LAYOUTS = {
  box: { label: 'Box Art', panels: 7 },
  hero: { label: 'Hero', panels: 1 },
  triptych: { label: 'Triptych', panels: 3 },
  quad: { label: 'Quad', panels: 4 },
};

export function freshPanel() {
  return { img: null, zoom: 1, fx: 0.5, fy: 0.3, panX: 0, panY: 0, graded: null, gradedKey: '' };
}

// Where a panel's focal point should rest before the user touches it:
// high in the frame for portraits, a touch lower across wide panels.
export function restingFocalY(panelW, panelH, imgW, imgH) {
  const panelAspect = panelW / panelH;
  const imgAspect = imgW && imgH ? imgW / imgH : 1;
  if (panelAspect < 0.92 || imgAspect < 0.92) return 0.26;
  if (panelAspect <= 1.18) return 0.29;
  return 0.35;
}

function boxRectsLandscape() {
  return [
    { x: 0, y: 0, w: 0.4, h: 0.62, slantTop: 0 },
    { x: 0, y: 0.62, w: 0.4, h: 0.38, slantTop: 0 },
    { x: 0.4, y: 0, w: 0.3, h: 0.52, slantTop: 0.03 },
    { x: 0.7, y: 0, w: 0.3, h: 0.52, slantTop: 0 },
    { x: 0.4, y: 0.52, w: 0.2, h: 0.48, slantTop: 0 },
    { x: 0.6, y: 0.52, w: 0.2, h: 0.48, slantTop: -0.03 },
    { x: 0.8, y: 0.52, w: 0.2, h: 0.48, slantTop: 0 },
  ];
}

function boxRectsPortrait() {
  return [
    { x: 0, y: 0, w: 0.62, h: 0.5, slantTop: 0 },
    { x: 0.62, y: 0, w: 0.38, h: 0.25, slantTop: 0 },
    { x: 0.62, y: 0.25, w: 0.38, h: 0.25, slantTop: 0.025 },
    { x: 0, y: 0.5, w: 0.34, h: 0.24, slantTop: 0 },
    { x: 0.34, y: 0.5, w: 0.33, h: 0.24, slantTop: 0 },
    { x: 0.67, y: 0.5, w: 0.33, h: 0.24, slantTop: 0 },
    { x: 0, y: 0.74, w: 1, h: 0.26, slantTop: -0.02 },
  ];
}

// Unit-space panel rectangles for a layout at a canvas aspect (w / h).
export function panelRects(layout, aspect) {
  if (layout === 'hero') return [{ x: 0, y: 0, w: 1, h: 1, slantTop: 0 }];
  if (layout === 'triptych') {
    return [0, 1, 2].map((i) => ({ x: i / 3, y: 0, w: 1 / 3, h: 1, slantTop: i === 1 ? 0.02 : 0 }));
  }
  if (layout === 'quad') {
    return [
      { x: 0, y: 0, w: 0.5, h: 0.52, slantTop: 0 },
      { x: 0.5, y: 0, w: 0.5, h: 0.52, slantTop: 0 },
      { x: 0, y: 0.52, w: 0.5, h: 0.48, slantTop: 0 },
      { x: 0.5, y: 0.52, w: 0.5, h: 0.48, slantTop: -0.02 },
    ];
  }
  return aspect >= 1.05 ? boxRectsLandscape() : boxRectsPortrait();
}

// Map unit rects to pixels, carving out the black gutters: the mosaic
// is inset by a full gutter and each panel shrinks by half of one.
export function pixelRects(rects, W, H) {
  const gut = Math.max(2, W * 0.012);
  return rects.map((r) => ({
    x: gut + r.x * (W - gut * 2) + gut / 2,
    y: gut + r.y * (H - gut * 2) + gut / 2,
    w: r.w * (W - gut * 2) - gut,
    h: r.h * (H - gut * 2) - gut,
    slantTop: (r.slantTop || 0) * W,
  }));
}

function tracePanelPath(ctx, r) {
  const s = r.slantTop || 0;
  ctx.beginPath();
  ctx.moveTo(r.x, r.y + Math.max(0, s));
  ctx.lineTo(r.x + r.w, r.y + Math.max(0, -s));
  ctx.lineTo(r.x + r.w, r.y + r.h);
  ctx.lineTo(r.x, r.y + r.h);
  ctx.closePath();
}

// The crop window for one photo in one panel: the image is scaled to
// cover, then shifted so its focal point meets the panel centre,
// clamped so no edge of the panel is ever left uncovered.
export function cropWindow(img, panel, rect) {
  const scale = Math.max(rect.w / img.naturalWidth, rect.h / img.naturalHeight) * panel.zoom;
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  let dx = rect.w / 2 - panel.fx * dw + panel.panX * rect.w;
  let dy = rect.h / 2 - panel.fy * dh + panel.panY * rect.h;
  dx = Math.min(0, Math.max(rect.w - dw, dx));
  dy = Math.min(0, Math.max(rect.h - dh, dy));
  return { dx, dy, dw, dh };
}

// Where the focal point actually lands inside the panel, as fractions
// of the panel — the editor pins its marker there.
export function focalSpot(img, panel, rect) {
  const { dx, dy, dw, dh } = cropWindow(img, panel, rect);
  return { x: (panel.fx * dw + dx) / rect.w, y: (panel.fy * dh + dy) / rect.h };
}

function gradeCanvasFor(panel, gradeName, panelIndex) {
  const img = panel.img;
  const key = `${gradeName}|${panelIndex}|${img.naturalWidth}x${img.naturalHeight}`;
  if (panel.graded && panel.gradedKey === key) return panel.graded;
  const recipe = GRADE_RECIPES[gradeName] ?? GRADE_RECIPES.illustrated;
  const cap = 1100;
  const scale = Math.min(1, cap / Math.max(img.naturalWidth, img.naturalHeight));
  const cw = Math.max(1, Math.round(img.naturalWidth * scale));
  const ch = Math.max(1, Math.round(img.naturalHeight * scale));
  const cv = document.createElement('canvas');
  cv.width = cw;
  cv.height = ch;
  const cx = cv.getContext('2d');
  cx.drawImage(img, 0, 0, cw, ch);
  const frame = cx.getImageData(0, 0, cw, ch);
  const px = frame.data;
  const { saturation, contrast, levels, shadowTint, shadowMix, glowTint, glowMix } = recipe;
  const step = levels > 1 ? 255 / (levels - 1) : 0;
  for (let i = 0; i < px.length; i += 4) {
    let r = px[i], g = px[i + 1], b = px[i + 2];
    r = (r - 128) * contrast + 128;
    g = (g - 128) * contrast + 128;
    b = (b - 128) * contrast + 128;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    r = luma + (r - luma) * saturation;
    g = luma + (g - luma) * saturation;
    b = luma + (b - luma) * saturation;
    if (step > 0) {
      r = Math.round(r / step) * step;
      g = Math.round(g / step) * step;
      b = Math.round(b / step) * step;
    }
    const t = Math.min(255, Math.max(0, luma)) / 255;
    if (t < 0.5) {
      const m = (0.5 - t) * 2 * shadowMix;
      r += (shadowTint[0] - r) * m;
      g += (shadowTint[1] - g) * m;
      b += (shadowTint[2] - b) * m;
    } else {
      const m = (t - 0.5) * 2 * glowMix;
      r += (glowTint[0] - r) * m;
      g += (glowTint[1] - g) * m;
      b += (glowTint[2] - b) * m;
    }
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
  }
  cx.putImageData(frame, 0, 0);
  const wash = washForPanel(recipe, panelIndex);
  if (wash) {
    cx.save();
    cx.globalCompositeOperation = recipe.washMode;
    cx.globalAlpha = recipe.washAlpha;
    cx.fillStyle = wash;
    cx.fillRect(0, 0, cw, ch);
    cx.restore();
  }
  panel.graded = cv;
  panel.gradedKey = key;
  return cv;
}

function paintPhoto(ctx, rect, panel, gradeName, panelIndex) {
  const graded = gradeCanvasFor(panel, gradeName, panelIndex);
  const { dx, dy, dw, dh } = cropWindow(panel.img, panel, rect);
  ctx.save();
  tracePanelPath(ctx, rect);
  ctx.clip();
  ctx.translate(rect.x, rect.y);
  ctx.drawImage(graded, dx, dy, dw, dh);
  ctx.restore();
}

export function splitTitle(text) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  if (words.length === 1) return words;
  const total = words.join(' ').length;
  const want = total > 17 && words.length >= 3 ? 3 : 2;
  const lines = [];
  let line = '';
  for (const word of words) {
    const trial = line ? `${line} ${word}` : word;
    const share = lines.length === want - 1 ? Infinity : total / want;
    if (line && trial.length > share + 2 && lines.length < want - 1) {
      lines.push(line);
      line = word;
    } else {
      line = trial;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

const TITLE_FONT = '"Arial Rounded MT Bold","Arial Black","Helvetica Neue",Arial,sans-serif';

function fitFontSize(ctx, lines, maxWidth, startSize) {
  let size = startSize;
  ctx.font = `900 ${size}px ${TITLE_FONT}`;
  while (size > 12 && lines.some((ln) => ctx.measureText(ln).width > maxWidth)) {
    size -= 4;
    ctx.font = `900 ${size}px ${TITLE_FONT}`;
  }
  return size;
}

function strokeWord(ctx, text, cx, cy, size) {
  ctx.font = `900 ${size}px ${TITLE_FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#0a0a0c';
  ctx.lineWidth = size * 0.22;
  ctx.strokeText(text, cx, cy);
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, cx, cy);
}

// The emblem: a diamond holding a low sun and two palms, lettered with
// the title's initial. Pure canvas paths, drawn fresh every render.
export function paintEmblem(ctx, cx, cy, size, initial) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  const half = size / 2;
  const grad = ctx.createLinearGradient(0, -half, 0, half);
  grad.addColorStop(0, '#3b1163');
  grad.addColorStop(0.52, '#c2189e');
  grad.addColorStop(1, '#ff8a2a');
  ctx.beginPath();
  ctx.rect(-half, -half, size, size);
  ctx.clip();
  ctx.fillStyle = grad;
  ctx.fillRect(-half, -half, size, size);
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(0, half * 0.28, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.rotate(-Math.PI / 4);
  drawPalmSilhouette(ctx, -size * 0.3, half * 0.72, size * 0.42, 0.12, '#20082f');
  drawPalmSilhouette(ctx, size * 0.3, half * 0.72, size * 0.5, -0.1, '#20082f');
  ctx.restore();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  ctx.strokeStyle = '#0a0a0c';
  ctx.lineWidth = size * 0.055;
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.restore();
  if (initial) {
    ctx.font = `900 ${size * 0.52}px ${TITLE_FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(10,10,12,0.85)';
    ctx.lineWidth = size * 0.05;
    const ch = initial.toUpperCase();
    ctx.strokeText(ch, cx, cy - size * 0.16);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(ch, cx, cy - size * 0.16);
  } else {
    ctx.fillStyle = '#ffffff';
    ctx.save();
    ctx.translate(cx, cy - size * 0.16);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const r = i % 2 === 0 ? size * 0.2 : size * 0.085;
      const px = Math.cos(a) * r, py = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function paintSubtitle(ctx, W, centreX, subY, subtitle, u) {
  if (!subtitle.trim()) return;
  const subSize = Math.max(13, u * 0.026);
  ctx.font = `italic 700 ${subSize}px "Segoe Script","Comic Sans MS",cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#0a0a0c';
  ctx.lineWidth = subSize * 0.18;
  ctx.strokeText(subtitle, centreX, subY);
  ctx.fillStyle = '#ffd9ec';
  ctx.fillText(subtitle, centreX, subY);
}

function paintCaptionBlock(ctx, W, H, state, atTop) {
  const lines = splitTitle(state.title);
  const centreX = W / 2;
  // Caption elements scale with the smaller dimension in play, so a
  // wide-but-short canvas never pushes the emblem off the bottom.
  const u = Math.min(W, H * 1.25);
  const initial = state.title.trim().charAt(0);
  if (atTop) {
    // Hero header: emblem rides above the title, subtitle beneath it,
    // leaving the middle of the frame to the photo.
    const emblemSize = u * 0.08;
    const emblemY = emblemSize * 0.78;
    paintEmblem(ctx, centreX, emblemY, emblemSize, initial);
    const startSize = Math.round(u * 0.1);
    const size = lines.length ? fitFontSize(ctx, lines, W * 0.88, startSize) : startSize;
    const lineGap = size * 1.04;
    const firstY = emblemY + emblemSize * 0.78 + lineGap * 0.62;
    lines.forEach((ln, i) => strokeWord(ctx, ln.toUpperCase(), centreX, firstY + i * lineGap, size));
    // On a hero cover the tagline sits at the foot of the poster, the
    // way a film credit line does, clear of the face in the middle.
    paintSubtitle(ctx, W, centreX, H - Math.max(13, u * 0.026) * 1.7, state.subtitle, u);
    return;
  }
  const startSize = Math.round(u * 0.145);
  const size = lines.length ? fitFontSize(ctx, lines, W * 0.88, startSize) : startSize;
  const lineGap = size * 1.04;
  const blockH = lines.length * lineGap;
  const titleCentreY = H * 0.44;
  const firstY = titleCentreY - blockH / 2 + lineGap / 2;
  lines.forEach((ln, i) => strokeWord(ctx, ln.toUpperCase(), centreX, firstY + i * lineGap, size));
  const emblemSize = u * 0.135;
  const emblemY = titleCentreY + blockH / 2 + emblemSize * 0.52;
  paintEmblem(ctx, centreX, emblemY, emblemSize, initial);
  paintSubtitle(ctx, W, centreX, emblemY + emblemSize * 0.78 + Math.max(13, u * 0.026) * 0.7, state.subtitle, u);
}

function paintHeroScenery(ctx, W, H) {
  const grad = ctx.createLinearGradient(0, 0, 0, H * 0.55);
  grad.addColorStop(0, 'rgba(59,17,99,0.5)');
  grad.addColorStop(0.6, 'rgba(194,24,158,0.18)');
  grad.addColorStop(1, 'rgba(255,138,42,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H * 0.55);
  drawPalmSilhouette(ctx, W * 0.045, H * 0.98, H * 0.52, 0.14, 'rgba(16,4,28,0.9)');
  drawPalmSilhouette(ctx, W * 0.955, H * 0.99, H * 0.58, -0.13, 'rgba(16,4,28,0.9)');
  drawPalmSilhouette(ctx, W * 0.1, H * 0.99, H * 0.3, 0.08, 'rgba(16,4,28,0.75)');
  drawPalmSilhouette(ctx, W * 0.9, H * 0.99, H * 0.32, -0.08, 'rgba(16,4,28,0.75)');
}

// Draw the whole cover described by state onto ctx at W x H.
export function paintCover(ctx, W, H, state) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);
  const rects = pixelRects(panelRects(state.layout, W / H), W, H);
  const count = LAYOUTS[state.layout].panels;
  for (let i = 0; i < count; i++) {
    const panel = state.panels[i];
    const rect = rects[i];
    if (!rect) continue;
    if (panel && panel.img) paintPhoto(ctx, rect, panel, state.grade, i);
    else paintMotif(ctx, rect, i);
  }
  if (state.layout === 'hero') paintHeroScenery(ctx, W, H);
  paintCaptionBlock(ctx, W, H, state, state.layout === 'hero');
}
