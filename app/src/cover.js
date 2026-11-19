// Vice Nights Cover Studio — renderer v2 (box-art restyle).
// Draws a full-bleed irregular mosaic with thick black gutters, a huge
// stacked title overlapping the middle band, an original gradient emblem
// (the title's initial inside a diamond badge, sunset gradient with palm
// silhouettes), per-panel hue washes, a posterised "Illustrated" photo
// grade, and original flat-vector motif scenes for panels without photos.
// The geometry, palette and treatments follow the *patterns* of official
// GTA VI key art / box art; every shape, letter and scene here is drawn by
// this file — no game artwork, no logo, no licensed font is used or copied.
// `state` is { layout, grade, title, subtitle,
// panels: [{ img, zoom, panX, panY }...] } and the cover is drawn at W x H.

// Per-panel dominant hues (pattern: every vignette owns one saturated hue).
export const PANEL_HUES = [
  { name: 'teal', solid: '#00b8c9', wash: 'rgba(0, 184, 201, 0.20)' },
  { name: 'hot pink', solid: '#ff2e88', wash: 'rgba(255, 46, 136, 0.20)' },
  { name: 'purple', solid: '#7b2ff7', wash: 'rgba(123, 47, 247, 0.20)' },
  { name: 'orange', solid: '#ff7a1a', wash: 'rgba(255, 122, 26, 0.20)' },
  { name: 'aqua', solid: '#19d3c5', wash: 'rgba(25, 211, 197, 0.20)' },
  { name: 'magenta', solid: '#e0218a', wash: 'rgba(224, 33, 138, 0.20)' },
  { name: 'sky', solid: '#2ec4ff', wash: 'rgba(46, 196, 255, 0.20)' },
];

// Motif scenes for panels without a photo, rotated by panel index.
export const MOTIFS = ['heli', 'boat', 'car', 'gator', 'palms', 'deco', 'birds'];

// Box Art mosaic, portrait/square: 7 panels, mixed sizes, one hero panel.
const BOXART_PORTRAIT = [
  { x: 0.00, y: 0.00, w: 0.62, h: 0.34 },              // hero panel
  { x: 0.62, y: 0.00, w: 0.38, h: 0.20 },
  { x: 0.62, y: 0.20, w: 0.38, h: 0.14, slant: 0.05 },
  { x: 0.00, y: 0.34, w: 0.38, h: 0.26 },
  { x: 0.38, y: 0.34, w: 0.62, h: 0.26, slant: -0.04 }, // middle band (title overlaps)
  { x: 0.00, y: 0.60, w: 0.55, h: 0.40 },
  { x: 0.55, y: 0.60, w: 0.45, h: 0.40 },
];

// Box Art mosaic, landscape: 7 panels arranged for a wide canvas.
const BOXART_WIDE = [
  { x: 0.00, y: 0.00, w: 0.34, h: 0.62 },              // hero panel
  { x: 0.34, y: 0.00, w: 0.36, h: 0.38 },
  { x: 0.70, y: 0.00, w: 0.30, h: 0.38, slant: 0.05 },
  { x: 0.34, y: 0.38, w: 0.30, h: 0.24 },
  { x: 0.64, y: 0.38, w: 0.36, h: 0.24, slant: -0.04 }, // middle band (title overlaps)
  { x: 0.00, y: 0.62, w: 0.50, h: 0.38 },
  { x: 0.50, y: 0.62, w: 0.50, h: 0.38 },
];

export const LAYOUTS = {
  boxart: {
    panels: BOXART_PORTRAIT,
    widePanels: BOXART_WIDE,
    title: { x: 0.5, y: 0.47, size: 0.150 },
  },
  hero: { // key-art composition: one full-bleed image, title at top
    panels: [
      { x: 0.00, y: 0.00, w: 1.00, h: 0.72 },
      { x: 0.00, y: 0.72, w: 0.50, h: 0.28 },
      { x: 0.50, y: 0.72, w: 0.50, h: 0.28 },
    ],
    title: { x: 0.5, y: 0.150, size: 0.115 },
  },
  triptych: { // full-bleed columns, black gutters, title over the middle
    panels: [
      { x: 0.000, y: 0, w: 0.333, h: 1 },
      { x: 0.333, y: 0, w: 0.334, h: 1 },
      { x: 0.667, y: 0, w: 0.333, h: 1 },
    ],
    title: { x: 0.5, y: 0.50, size: 0.135 },
  },
  quad: { // full-bleed 2 x 2, black gutters, title over the centre cross
    panels: [
      { x: 0.0, y: 0.0, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.0, w: 0.5, h: 0.5 },
      { x: 0.0, y: 0.5, w: 0.5, h: 0.5 },
      { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
    ],
    title: { x: 0.5, y: 0.50, size: 0.135 },
  },
};

/** Panel rectangles for a layout at a given canvas size (Box Art adapts). */
export function getPanels(layoutKey, W, H) {
  const layout = LAYOUTS[layoutKey] || LAYOUTS.boxart;
  if (layoutKey === 'boxart' && W > H * 1.05 && layout.widePanels) return layout.widePanels;
  return layout.panels;
}

export const GRADES = {
  illustrated: { sky: ['#2b1055', '#7b2ff7', '#ff5e8a', '#ff9966'], wash: 'rgba(70, 20, 140, 0.07)', tint: 'rgba(255, 90, 60, 0.04)', illustrated: true },
  sunset: { sky: ['#2b1055', '#ff5e62', '#ff9966', '#ffd194'], wash: 'rgba(255, 110, 80, 0.14)', tint: 'rgba(255, 80, 160, 0.10)' },
  neon: { sky: ['#0f0524', '#7b2ff7', '#f107a3', '#00e5ff'], wash: 'rgba(180, 60, 255, 0.16)', tint: 'rgba(0, 229, 255, 0.10)' },
  noir: { sky: ['#050914', '#12233d', '#2b4a6f', '#7fa8c9'], wash: 'rgba(20, 60, 120, 0.18)', tint: 'rgba(10, 10, 30, 0.12)' },
  gold: { sky: ['#2a1503', '#b25b09', '#f7b733', '#fde68a'], wash: 'rgba(255, 170, 40, 0.14)', tint: 'rgba(255, 200, 90, 0.08)' },
};

export const SIZES = {
  square: { w: 1080, h: 1080, name: 'cover-1080x1080.png' },
  portrait: { w: 1080, h: 1350, name: 'cover-1080x1350.png' },
  wide: { w: 1920, h: 1080, name: 'cover-1920x1080.png' },
};

const INK = '#14082b'; // deep purple-black used for silhouettes

/** Draws one palm silhouette at (x, y), trunk height `h`, leaning `lean`. */
function drawPalm(ctx, x, y, h, lean, color = INK) {
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(3, h * 0.04);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(lean * h * 0.4, -h * 0.55, lean * h, -h);
  ctx.stroke();
  ctx.translate(lean * h, -h);
  ctx.lineWidth = Math.max(2, h * 0.022);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * (0.08 + i * 0.13);
    const len = h * (0.48 - Math.abs(i - 3) * 0.05);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(Math.cos(a) * len * 0.6, Math.sin(a) * len * 0.6 - h * 0.08, Math.cos(a) * len, Math.sin(a) * len + h * 0.22);
    ctx.stroke();
  }
  ctx.restore();
}

/** Small "m"-shaped birds at the given relative spots inside a rect. */
function drawBirds(ctx, x, y, w, h, spots, color = 'rgba(20, 8, 43, 0.85)') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, w * 0.006);
  ctx.lineCap = 'round';
  spots.forEach(([bx, by, s]) => {
    const cx = x + bx * w;
    const cy = y + by * h;
    const sw = s * w;
    ctx.beginPath();
    ctx.moveTo(cx - sw, cy);
    ctx.quadraticCurveTo(cx - sw * 0.4, cy - sw * 0.7, cx, cy);
    ctx.quadraticCurveTo(cx + sw * 0.4, cy - sw * 0.7, cx + sw, cy);
    ctx.stroke();
  });
  ctx.restore();
}

/** Blocky skyline silhouette filling the bottom of a rect. */
function drawSkylineIn(ctx, x, y, w, h, color = INK, windows = true) {
  ctx.save();
  ctx.fillStyle = color;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  let bx = x;
  while (bx < x + w) {
    const bw = w * (0.10 + rnd() * 0.12);
    const bh = h * (0.35 + rnd() * 0.55);
    ctx.fillRect(bx, y + h - bh, bw, bh);
    if (rnd() > 0.6) ctx.fillRect(bx + bw * 0.45, y + h - bh - h * 0.14, w * 0.012, h * 0.14);
    bx += bw + w * 0.02;
  }
  if (windows) {
    ctx.fillStyle = 'rgba(255, 214, 130, 0.85)';
    seed = 11;
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(x + rnd() * w, y + h * (0.25 + rnd() * 0.65), Math.max(2, w * 0.012), Math.max(2, h * 0.014));
    }
  }
  ctx.restore();
}

/** Vertical sunset gradient (deep purple → magenta → orange) in a rect. */
function sunsetGradient(ctx, x, y, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#2b1055');
  g.addColorStop(0.42, '#c2187a');
  g.addColorStop(0.72, '#ff5e3a');
  g.addColorStop(1, '#ffb347');
  return g;
}

/** Striped poster sun centred at (cx, cy) with radius r. */
function drawStripedSun(ctx, cx, cy, r, stripeColor) {
  ctx.save();
  ctx.fillStyle = '#ffe9a8';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = stripeColor;
  for (let i = 0; i < 3; i++) {
    const sy = cy + r * (0.12 + i * 0.28);
    ctx.fillRect(cx - r, sy, r * 2, r * 0.07);
  }
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Original flat-vector motif scenes for panels without a photo.       */
/* ------------------------------------------------------------------ */

function motifHeli(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#19d3c5'); g.addColorStop(0.6, '#a8e063'); g.addColorStop(1, '#ffe9a8');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.78, y + h * 0.26, Math.min(w, h) * 0.16, '#19a7b8');
  drawSkylineIn(ctx, x, y + h * 0.55, w, h * 0.45, '#0e4a5c');
  // helicopter: dark body, teal cockpit, tail beam, rotors, skids
  const cx = x + w * 0.42; const cy = y + h * 0.34; const u = Math.min(w, h);
  ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineCap = 'round';
  ctx.lineWidth = u * 0.035;
  ctx.beginPath(); ctx.moveTo(cx - u * 0.05, cy - u * 0.30); ctx.lineTo(cx + u * 0.05, cy - u * 0.30); ctx.stroke(); // mast
  ctx.lineWidth = u * 0.022;
  ctx.beginPath(); ctx.moveTo(cx - u * 0.42, cy - u * 0.33); ctx.lineTo(cx + u * 0.42, cy - u * 0.33); ctx.stroke(); // main rotor
  ctx.beginPath(); ctx.moveTo(cx + u * 0.16, cy + u * 0.02); ctx.lineTo(cx + u * 0.52, cy - u * 0.10); ctx.stroke(); // tail beam
  ctx.fillRect(cx + u * 0.50, cy - u * 0.22, u * 0.035, u * 0.20); // tail fin
  ctx.beginPath(); ctx.ellipse(cx, cy, u * 0.21, u * 0.15, 0, 0, Math.PI * 2); ctx.fill(); // body
  ctx.fillStyle = '#7fe7dc';
  ctx.beginPath(); ctx.ellipse(cx - u * 0.09, cy - u * 0.02, u * 0.085, u * 0.095, 0, 0, Math.PI * 2); ctx.fill(); // cockpit
  ctx.strokeStyle = INK; ctx.lineWidth = u * 0.02;
  ctx.beginPath(); ctx.moveTo(cx - u * 0.16, cy + u * 0.20); ctx.lineTo(cx + u * 0.16, cy + u * 0.20); ctx.stroke(); // skid
  ctx.beginPath(); ctx.moveTo(cx - u * 0.08, cy + u * 0.13); ctx.lineTo(cx - u * 0.08, cy + u * 0.20); ctx.moveTo(cx + u * 0.08, cy + u * 0.13); ctx.lineTo(cx + u * 0.08, cy + u * 0.20); ctx.stroke();
  drawBirds(ctx, x, y, w, h, [[0.82, 0.55, 0.05], [0.70, 0.62, 0.04]]);
}

function motifBoat(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#ff5e8a'); g.addColorStop(0.45, '#ffb347'); g.addColorStop(0.46, '#0e7d99'); g.addColorStop(1, '#083b5c');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.24, y + h * 0.24, Math.min(w, h) * 0.14, '#e0497a');
  // speedboat: sleek hull, windshield, wake
  const bx = x + w * 0.08; const by = y + h * 0.60; const bw = w * 0.62; const bh = h * 0.16;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath(); ctx.moveTo(bx - w * 0.05, by + bh * 0.9); ctx.lineTo(bx + bw * 0.35, by + bh * 0.55); ctx.lineTo(bx + bw * 0.9, by + bh * 0.95); ctx.closePath(); ctx.fill(); // wake
  ctx.fillStyle = '#123a6d';
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by + bh * 0.25); ctx.lineTo(bx + bw * 0.86, by + bh); ctx.lineTo(bx + bw * 0.10, by + bh); ctx.closePath(); ctx.fill(); // hull
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.moveTo(bx + bw * 0.06, by - bh * 0.18); ctx.lineTo(bx + bw * 0.98, by + bh * 0.22); ctx.lineTo(bx + bw, by + bh * 0.25); ctx.lineTo(bx + bw * 0.10, by + bh * 0.1); ctx.closePath(); ctx.fill(); // deck stripe
  ctx.fillStyle = '#7fe7dc';
  ctx.beginPath(); ctx.moveTo(bx + bw * 0.52, by - bh * 0.52); ctx.lineTo(bx + bw * 0.74, by - bh * 0.05); ctx.lineTo(bx + bw * 0.44, by - bh * 0.05); ctx.closePath(); ctx.fill(); // windshield
  // pink flamingo in flight: body, S-neck, beak, trailing legs
  const fx = x + w * 0.76; const fy = y + h * 0.30; const u = Math.min(w, h);
  ctx.strokeStyle = '#ff5e8a'; ctx.fillStyle = '#ff5e8a'; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.ellipse(fx, fy, u * 0.13, u * 0.075, -0.25, 0, Math.PI * 2); ctx.fill(); // body
  ctx.fillStyle = '#e0218a';
  ctx.beginPath(); ctx.ellipse(fx - u * 0.02, fy - u * 0.05, u * 0.10, u * 0.045, -0.5, 0, Math.PI * 2); ctx.fill(); // wing
  ctx.strokeStyle = '#ff5e8a'; ctx.lineWidth = u * 0.028;
  ctx.beginPath(); ctx.moveTo(fx + u * 0.10, fy - u * 0.03); ctx.quadraticCurveTo(fx + u * 0.20, fy - u * 0.14, fx + u * 0.17, fy - u * 0.20); ctx.stroke(); // neck
  ctx.fillStyle = '#ff5e8a'; ctx.beginPath(); ctx.arc(fx + u * 0.17, fy - u * 0.21, u * 0.032, 0, Math.PI * 2); ctx.fill(); // head
  ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(fx + u * 0.19, fy - u * 0.22); ctx.lineTo(fx + u * 0.27, fy - u * 0.19); ctx.lineTo(fx + u * 0.19, fy - u * 0.185); ctx.closePath(); ctx.fill(); // beak
  ctx.strokeStyle = '#e0218a'; ctx.lineWidth = u * 0.016;
  ctx.beginPath(); ctx.moveTo(fx - u * 0.11, fy + u * 0.04); ctx.lineTo(fx - u * 0.24, fy + u * 0.10); ctx.moveTo(fx - u * 0.10, fy + u * 0.06); ctx.lineTo(fx - u * 0.22, fy + u * 0.14); ctx.stroke(); // legs
}

function motifCar(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#3d1c5c'); g.addColorStop(0.7, '#7b2ff7'); g.addColorStop(0.71, '#160a2e'); g.addColorStop(1, '#160a2e');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.82, y + h * 0.30, Math.min(w, h) * 0.15, '#5b21a8');
  ctx.fillStyle = '#241040';
  ctx.fillRect(x + w * 0.04, y + h * 0.28, w * 0.20, h * 0.43); // deco block
  ctx.fillRect(x + w * 0.28, y + h * 0.40, w * 0.14, h * 0.31);
  ctx.fillStyle = 'rgba(255, 214, 130, 0.9)';
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) ctx.fillRect(x + w * (0.07 + c * 0.08), y + h * (0.34 + r * 0.09), w * 0.035, h * 0.045);
  ctx.strokeStyle = 'rgba(255,233,168,0.8)'; ctx.lineWidth = Math.max(2, h * 0.008); // road dashes
  ctx.beginPath(); ctx.moveTo(x, y + h * 0.86); ctx.lineTo(x + w, y + h * 0.86); ctx.stroke();
  // yellow sports car in profile with a scissor door
  const cx0 = x + w * 0.14; const cy0 = y + h * 0.66; const cw = w * 0.72; const ch = h * 0.20; const u = Math.min(w, h);
  ctx.fillStyle = '#ffc21a';
  ctx.beginPath();
  ctx.moveTo(cx0, cy0 + ch * 0.75);
  ctx.quadraticCurveTo(cx0 + cw * 0.02, cy0 + ch * 0.25, cx0 + cw * 0.22, cy0 + ch * 0.18);
  ctx.lineTo(cx0 + cw * 0.40, cy0 - ch * 0.30); // nose-to-cabin sweep
  ctx.lineTo(cx0 + cw * 0.68, cy0 - ch * 0.28);
  ctx.quadraticCurveTo(cx0 + cw * 0.95, cy0 + ch * 0.05, cx0 + cw, cy0 + ch * 0.55);
  ctx.lineTo(cx0 + cw, cy0 + ch * 0.78);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#123a6d'; // cabin glass
  ctx.beginPath(); ctx.moveTo(cx0 + cw * 0.44, cy0 - ch * 0.24); ctx.lineTo(cx0 + cw * 0.64, cy0 - ch * 0.22); ctx.lineTo(cx0 + cw * 0.70, cy0 + ch * 0.10); ctx.lineTo(cx0 + cw * 0.46, cy0 + ch * 0.10); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#b97e06'; ctx.lineWidth = u * 0.018; // scissor door seam
  ctx.beginPath(); ctx.moveTo(cx0 + cw * 0.46, cy0 + ch * 0.12); ctx.lineTo(cx0 + cw * 0.60, cy0 - ch * 0.55); ctx.stroke();
  ctx.fillStyle = '#ffe9a8'; ctx.fillRect(cx0 + cw * 0.015, cy0 + ch * 0.42, cw * 0.05, ch * 0.16); // headlight
  [[0.22], [0.80]].forEach(([fx]) => { // wheels
    ctx.fillStyle = '#0c0c12'; ctx.beginPath(); ctx.arc(cx0 + cw * fx, cy0 + ch * 0.80, u * 0.075, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#9aa3b2'; ctx.beginPath(); ctx.arc(cx0 + cw * fx, cy0 + ch * 0.80, u * 0.034, 0, Math.PI * 2); ctx.fill();
  });
  drawPalm(ctx, x + w * 0.96, y + h * 0.72, h * 0.30, -0.4);
}

function motifGator(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#19d3c5'); g.addColorStop(0.35, '#0e9d8a'); g.addColorStop(1, '#065f46');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = Math.max(2, w * 0.006); // ripples
  [[0.3, 0.62, 0.30], [0.55, 0.78, 0.42], [0.42, 0.40, 0.20]].forEach(([rx, ry, rw]) => {
    ctx.beginPath(); ctx.ellipse(x + rx * w, y + ry * h, rw * w * 0.5, rw * w * 0.13, 0, 0, Math.PI * 2); ctx.stroke();
  });
  // alligator head: long snout at the surface, jaw teeth, raised eyes
  const gx = x + w * 0.14; const gy = y + h * 0.52; const gw = w * 0.72; const gh = h * 0.20; const u = Math.min(w, h);
  ctx.fillStyle = '#1d6b45';
  ctx.beginPath(); // upper snout
  ctx.moveTo(gx, gy + gh * 0.45);
  ctx.quadraticCurveTo(gx + gw * 0.05, gy, gx + gw * 0.30, gy - gh * 0.05);
  ctx.lineTo(gx + gw * 0.92, gy + gh * 0.10);
  ctx.quadraticCurveTo(gx + gw * 1.0, gy + gh * 0.16, gx + gw * 0.98, gy + gh * 0.42);
  ctx.lineTo(gx + gw * 0.30, gy + gh * 0.52);
  ctx.quadraticCurveTo(gx + gw * 0.05, gy + gh * 0.55, gx, gy + gh * 0.45);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#2e8b57'; // lower jaw
  ctx.beginPath(); ctx.moveTo(gx + gw * 0.25, gy + gh * 0.55); ctx.lineTo(gx + gw * 0.97, gy + gh * 0.45); ctx.lineTo(gx + gw * 0.94, gy + gh * 0.72); ctx.lineTo(gx + gw * 0.28, gy + gh * 0.78); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffffff'; // teeth along the jaw line
  for (let i = 0; i < 7; i++) {
    const tx = gx + gw * (0.38 + i * 0.085);
    ctx.beginPath(); ctx.moveTo(tx, gy + gh * 0.50); ctx.lineTo(tx + gw * 0.03, gy + gh * 0.50); ctx.lineTo(tx + gw * 0.015, gy + gh * 0.70); ctx.closePath(); ctx.fill();
  }
  [[0.16], [0.30]].forEach(([ex]) => { // eye bumps
    ctx.fillStyle = '#1d6b45'; ctx.beginPath(); ctx.arc(gx + gw * ex, gy - gh * 0.10, u * 0.045, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd21a'; ctx.beginPath(); ctx.arc(gx + gw * ex, gy - gh * 0.10, u * 0.026, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(gx + gw * ex, gy - gh * 0.10, u * 0.011, 0, Math.PI * 2); ctx.fill();
  });
  ctx.fillStyle = 'rgba(6, 60, 40, 0.8)'; // back ridges behind the head
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(gx - w * 0.01 - i * w * 0.055, gy + gh * 0.30, u * 0.030, Math.PI, 0); ctx.fill(); }
  drawBirds(ctx, x, y, w, h, [[0.78, 0.16, 0.05], [0.64, 0.24, 0.04]]);
}

function motifPalms(ctx, x, y, w, h) {
  ctx.fillStyle = sunsetGradient(ctx, x, y, h);
  ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.5, y + h * 0.52, Math.min(w, h) * 0.30, '#c2187a');
  ctx.fillStyle = 'rgba(20, 8, 43, 0.9)';
  ctx.fillRect(x, y + h * 0.88, w, h * 0.12); // ground band
  drawPalm(ctx, x + w * 0.06, y + h * 0.92, h * 0.52, 0.35);
  drawPalm(ctx, x + w * 0.94, y + h * 0.92, h * 0.46, -0.35);
  drawPalm(ctx, x + w * 0.22, y + h * 0.92, h * 0.30, 0.2);
  drawBirds(ctx, x, y, w, h, [[0.38, 0.16, 0.045], [0.52, 0.11, 0.035], [0.63, 0.20, 0.04]], 'rgba(43, 16, 85, 0.9)');
}

function motifDeco(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#2b1055'); g.addColorStop(0.75, '#8e2a7a'); g.addColorStop(0.76, '#160a2e'); g.addColorStop(1, '#160a2e');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.16, y + h * 0.20, Math.min(w, h) * 0.11, '#4a1c78');
  const hotels = [
    { fx: 0.06, fw: 0.26, fh: 0.62, body: '#f7e8c9', strip: '#ff2e88' },
    { fx: 0.38, fw: 0.30, fh: 0.76, body: '#ffd9e8', strip: '#00e5ff' },
    { fx: 0.73, fw: 0.22, fh: 0.54, body: '#c9f2ec', strip: '#ffb347' },
  ];
  hotels.forEach(({ fx, fw, fh, body, strip }) => {
    const hx = x + fx * w; const hw = fw * w; const hTop = y + h * (0.76 - fh); const hBot = y + h * 0.76;
    ctx.fillStyle = body;
    ctx.fillRect(hx, hTop + h * 0.06, hw, hBot - hTop - h * 0.06); // main block
    ctx.fillRect(hx + hw * 0.22, hTop, hw * 0.56, h * 0.07); // stepped deco crown
    ctx.fillRect(hx + hw * 0.38, hTop - h * 0.045, hw * 0.24, h * 0.05);
    ctx.fillStyle = strip; // vertical neon strip
    ctx.fillRect(hx + hw * 0.46, hTop + h * 0.08, hw * 0.08, hBot - hTop - h * 0.14);
    ctx.fillStyle = 'rgba(20, 30, 70, 0.75)'; // windows
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
      if (c === 1) continue;
      ctx.fillRect(hx + hw * (0.14 + c * 0.30), hTop + h * (0.13 + r * 0.115), hw * 0.16, h * 0.06);
    }
  });
  drawPalm(ctx, x + w * 0.97, y + h * 0.99, h * 0.34, -0.4);
  drawPalm(ctx, x + w * 0.02, y + h * 0.99, h * 0.26, 0.4);
}

function motifBirds(ctx, x, y, w, h) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, '#3555c9'); g.addColorStop(0.55, '#c95ec9'); g.addColorStop(0.78, '#ff8c5a'); g.addColorStop(0.79, '#0e5d7d'); g.addColorStop(1, '#083b5c');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  drawStripedSun(ctx, x + w * 0.5, y + h * 0.62, Math.min(w, h) * 0.17, '#c95ec9');
  ctx.strokeStyle = 'rgba(255, 233, 168, 0.7)'; ctx.lineWidth = Math.max(2, w * 0.005); // sun path on water
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x + w * (0.40 - i * 0.03), y + h * (0.84 + i * 0.05)); ctx.lineTo(x + w * (0.60 + i * 0.03), y + h * (0.84 + i * 0.05)); ctx.stroke(); }
  drawSkylineIn(ctx, x, y + h * 0.52, w, h * 0.27, 'rgba(20, 20, 60, 0.55)', false);
  drawBirds(ctx, x, y, w, h, [[0.24, 0.20, 0.055], [0.38, 0.13, 0.045], [0.52, 0.22, 0.06], [0.66, 0.15, 0.04], [0.76, 0.26, 0.05], [0.45, 0.32, 0.035], [0.30, 0.36, 0.03]], 'rgba(16, 8, 40, 0.95)');
}

const MOTIF_DRAW = { heli: motifHeli, boat: motifBoat, car: motifCar, gator: motifGator, palms: motifPalms, deco: motifDeco, birds: motifBirds };

/** Draws one motif scene clipped inside the panel rectangle. */
function drawMotif(ctx, px, py, pw, ph, panelIndex) {
  const kind = MOTIFS[panelIndex % MOTIFS.length];
  (MOTIF_DRAW[kind] || motifPalms)(ctx, px, py, pw, ph);
  // purple-leaning shade at the foot of every vignette
  const shade = ctx.createLinearGradient(0, py, 0, py + ph);
  shade.addColorStop(0, 'rgba(255, 140, 90, 0.05)');
  shade.addColorStop(1, 'rgba(30, 8, 60, 0.25)');
  ctx.fillStyle = shade;
  ctx.fillRect(px, py, pw, ph);
}

/* ------------------------------------------------------------------ */
/* Illustrated grade: posterise + saturate a photo once, cache it.     */
/* ------------------------------------------------------------------ */

const procCache = new Map();

function processedImage(img) {
  const key = `${img.src || ''}|${img.naturalWidth}x${img.naturalHeight}`;
  if (procCache.has(key)) return procCache.get(key);
  const maxDim = 1400;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const cw = Math.max(2, Math.round(img.naturalWidth * scale));
  const ch = Math.max(2, Math.round(img.naturalHeight * scale));
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const cctx = c.getContext('2d');
  try { cctx.filter = 'saturate(1.6) contrast(1.10) brightness(1.04)'; } catch { /* older canvas */ }
  cctx.drawImage(img, 0, 0, cw, ch);
  try { cctx.filter = 'none'; } catch { /* older canvas */ }
  try {
    const data = cctx.getImageData(0, 0, cw, ch);
    const px = data.data;
    const LEVELS = 5; // posterise: quantise each channel to 5 steps
    for (let i = 0; i < px.length; i += 4) {
      let r = px[i]; let g = px[i + 1]; let b = px[i + 2];
      r = Math.round((r / 255) * (LEVELS - 1)) / (LEVELS - 1) * 255;
      g = Math.round((g / 255) * (LEVELS - 1)) / (LEVELS - 1) * 255;
      b = Math.round((b / 255) * (LEVELS - 1)) / (LEVELS - 1) * 255;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum < 72) { // shadows lean purple
        r = r * 0.62 + 43 * 0.38; g = g * 0.62 + 16 * 0.38; b = b * 0.62 + 85 * 0.38;
      } else if (lum > 205) { // highlights lean warm
        r = r * 0.85 + 255 * 0.15; g = g * 0.85 + 190 * 0.15; b = b * 0.85 + 120 * 0.15;
      }
      px[i] = r; px[i + 1] = g; px[i + 2] = b;
    }
    cctx.putImageData(data, 0, 0);
  } catch { /* tainted canvas: keep the saturated copy */ }
  if (procCache.size > 12) procCache.clear();
  procCache.set(key, c);
  return c;
}

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

/** Panel path: a rect, or a slightly angled parallelogram when slanted. */
function panelPath(ctx, px, py, pw, ph, slant) {
  ctx.beginPath();
  if (slant) {
    const s = slant * pw;
    ctx.moveTo(px + s, py);
    ctx.lineTo(px + pw, py);
    ctx.lineTo(px + pw - s, py + ph);
    ctx.lineTo(px, py + ph);
  } else {
    ctx.rect(px, py, pw, ph);
  }
  ctx.closePath();
}

/** Draws one mosaic panel inside the black-gutter grid. */
function drawPanel(ctx, rect, panel, W, H, grade, panelIndex) {
  const g = W * 0.012; // thick black gutter, ~1% of width, also the outer edge
  const px = rect.x * W + g / 2;
  const py = rect.y * H + g / 2;
  const pw = rect.w * W - g;
  const ph = rect.h * H - g;
  const hue = PANEL_HUES[panelIndex % PANEL_HUES.length];
  ctx.save();
  panelPath(ctx, px, py, pw, ph, rect.slant || 0);
  ctx.clip();
  // backing colour so slanted corners never show through
  ctx.fillStyle = '#1a0b2e';
  ctx.fillRect(px - pw * 0.1, py, pw * 1.2, ph);
  if (panel && panel.img) {
    const src = grade.illustrated ? processedImage(panel.img) : panel.img;
    const sw = src.naturalWidth || src.width;
    const sh = src.naturalHeight || src.height;
    const zoom = panel.zoom || 1;
    const scale = Math.max(pw / sw, ph / sh) * zoom;
    const dw = sw * scale;
    const dh = sh * scale;
    const ox = (panel.panX || 0) * Math.max(0, (dw - pw) / 2);
    const oy = (panel.panY || 0) * Math.max(0, (dh - ph) / 2);
    ctx.drawImage(src, px + (pw - dw) / 2 + ox, py + (ph - dh) / 2 + oy, dw, dh);
    // per-panel dominant hue wash — stronger under the Illustrated grade
    ctx.fillStyle = hue.wash;
    ctx.fillRect(px, py, pw, ph);
    if (grade.illustrated) {
      ctx.fillStyle = hue.wash.replace('0.20', '0.10');
      ctx.fillRect(px, py, pw, ph);
    }
  } else {
    drawMotif(ctx, px, py, pw, ph, panelIndex);
  }
  // vignette shade so each panel sits in the poster
  const shade = ctx.createLinearGradient(0, py, 0, py + ph);
  shade.addColorStop(0, 'rgba(255, 120, 80, 0.04)');
  shade.addColorStop(1, 'rgba(20, 8, 43, 0.20)');
  ctx.fillStyle = shade;
  ctx.fillRect(px, py, pw, ph);
  ctx.restore();
}

/* ------------------------------------------------------------------ */
/* Emblem + stacked title                                              */
/* ------------------------------------------------------------------ */

/**
 * The original gradient emblem: a diamond badge filled with the sunset
 * gradient, palm silhouettes inside it, and the title's initial (or a
 * star when there is no title) at its centre. Drawn in code only.
 */
function drawEmblem(ctx, cx, cy, s, initial) {
  const w = s * 0.95;
  const h = s * 1.22;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  ctx.fillStyle = sunsetGradient(ctx, cx, cy - h / 2, h);
  ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  ctx.fillStyle = 'rgba(255, 233, 168, 0.85)'; // small sun inside the gradient
  ctx.beginPath(); ctx.arc(cx + w * 0.16, cy - h * 0.22, s * 0.10, 0, Math.PI * 2); ctx.fill();
  drawPalm(ctx, cx - w * 0.30, cy + h * 0.34, h * 0.52, 0.32, '#20083c');
  drawPalm(ctx, cx + w * 0.33, cy + h * 0.36, h * 0.44, -0.36, '#20083c');
  if (initial) {
    ctx.font = `900 ${Math.round(s * 0.52)}px "Arial Rounded MT Bold", "Arial Black", "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0a0518';
    ctx.lineWidth = s * 0.045;
    ctx.strokeText(initial, cx, cy + s * 0.02);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(initial, cx, cy + s * 0.02);
  } else {
    // star badge fallback
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0a0518';
    ctx.lineWidth = s * 0.03;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5;
      const r = i % 2 === 0 ? s * 0.26 : s * 0.11;
      const vx = cx + Math.cos(a) * r;
      const vy = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
  // dark outline around the badge
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
  ctx.strokeStyle = '#05030a';
  ctx.lineWidth = Math.max(3, s * 0.05);
  ctx.lineJoin = 'round';
  ctx.stroke();
  ctx.restore();
}

/** Splits a title into 1–3 balanced stacked lines. */
export function stackTitle(title) {
  const words = (title || '').trim().toUpperCase().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return words;
  if (words.length === 2) return words;
  const lineCount = words.length >= 5 ? 3 : 2;
  const total = words.join(' ').length;
  const target = total / lineCount;
  const lines = [];
  let cur = '';
  words.forEach((word, i) => {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && next.length > target && lines.length < lineCount - 1 && i < words.length - (lineCount - 1 - lines.length)) {
      lines.push(cur);
      cur = word;
    } else {
      cur = next;
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

const TITLE_FONT = '"Arial Rounded MT Bold", "Arial Black", "Helvetica Neue", Arial, sans-serif';

/** Stacked title overlapping the art, emblem behind it, small subtitle. */
function drawLettering(ctx, layout, title, subtitle, W, H) {
  const lines = stackTitle(title);
  const s = (subtitle || '').trim().toUpperCase();
  const u = Math.min(W, H);
  const cx = layout.title.x * W;
  const cy = layout.title.y * H;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (lines.length) {
    let size = layout.title.size * u;
    const setFont = () => { ctx.font = `900 ${size}px ${TITLE_FONT}`; };
    setFont();
    try { ctx.letterSpacing = `${Math.round(size * 0.015)}px`; } catch { /* older canvas */ }
    const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width));
    while (widest() > W * 0.88 && size > 14) { size -= 2; setFont(); }
    const lineH = size * 1.04;
    const blockH = lineH * lines.length;
    // emblem behind/below the stacked title: its top tucks behind the
    // lowest line while the gradient, palms and initial stay visible below
    const initial = ((title || '').trim().toUpperCase().match(/[A-Z0-9]/) || [null])[0];
    const emblemS = size * 1.6;
    const emblemCy = cy + blockH * 0.55;
    const emblemBottom = emblemCy + (emblemS * 1.22) / 2;
    drawEmblem(ctx, cx, emblemCy, emblemS, initial);
    // stacked lines, white with a heavy black outline
    ctx.lineJoin = 'round';
    lines.forEach((line, i) => {
      const ly = cy - blockH / 2 + lineH * (i + 0.5);
      ctx.strokeStyle = '#05030a';
      ctx.lineWidth = size * 0.24;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = size * 0.10;
      ctx.shadowOffsetY = size * 0.05;
      ctx.strokeText(line, cx, ly);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(line, cx, ly);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetY = 0;
    });
    if (s) { // subtitle: small and subordinate, below the emblem, no band
      const size2 = Math.max(12, u * 0.026);
      ctx.font = `700 ${size2}px system-ui, sans-serif`;
      try { ctx.letterSpacing = `${Math.round(size2 * 0.30)}px`; } catch { /* older canvas */ }
      const sy = Math.min(H * 0.965, Math.max(cy + blockH / 2 + size * 0.52, emblemBottom + size * 0.30));
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(5, 3, 10, 0.85)';
      ctx.lineWidth = size2 * 0.18;
      ctx.strokeText(s, cx, sy);
      ctx.fillStyle = '#ffe9a8';
      ctx.fillText(s, cx, sy);
    }
  } else if (s) {
    const size2 = Math.max(12, u * 0.026);
    ctx.font = `700 ${size2}px system-ui, sans-serif`;
    ctx.fillStyle = '#ffe9a8';
    ctx.fillText(s, cx, cy);
  }
  try { ctx.letterSpacing = '0px'; } catch { /* older canvas */ }
}

/* ------------------------------------------------------------------ */
/* Whole cover                                                         */
/* ------------------------------------------------------------------ */

/** Draws the whole cover onto `ctx` at W x H. */
export function drawCover(ctx, state, W, H) {
  const grade = GRADES[state.grade] || GRADES.illustrated;
  const layoutKey = LAYOUTS[state.layout] ? state.layout : 'boxart';
  const layout = LAYOUTS[layoutKey];
  // black everywhere first: whatever the panels do not cover is the gutter
  ctx.fillStyle = '#05030a';
  ctx.fillRect(0, 0, W, H);
  const panels = getPanels(layoutKey, W, H);
  panels.forEach((rect, i) => drawPanel(ctx, rect, state.panels[i], W, H, grade, i));
  // colour grade wash over everything (the Illustrated grade already
  // posterised each photo, so its global wash stays whisper-light)
  ctx.fillStyle = grade.wash;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = grade.tint;
  ctx.fillRect(0, 0, W, H);
  if (layoutKey === 'hero') {
    // key-art treatment: gradient sky tint at the top, palms framing the
    // hero image on both sides, title over the top of the picture
    const top = ctx.createLinearGradient(0, 0, 0, H * 0.5);
    top.addColorStop(0, 'rgba(43, 16, 85, 0.42)');
    top.addColorStop(0.6, 'rgba(255, 94, 138, 0.10)');
    top.addColorStop(1, 'rgba(43, 16, 85, 0)');
    ctx.fillStyle = top;
    ctx.fillRect(0, 0, W, H * 0.5);
    drawPalm(ctx, W * 0.012, H * 0.76, Math.min(W, H) * 0.40, 0.42, '#160a2e');
    drawPalm(ctx, W * 0.988, H * 0.76, Math.min(W, H) * 0.36, -0.42, '#160a2e');
    drawBirds(ctx, 0, 0, W, H, [[0.16, 0.30, 0.016], [0.84, 0.26, 0.015]]);
  }
  // vignette
  const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.75);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(10,4,24,0.30)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  drawLettering(ctx, layout, state.title, state.subtitle, W, H);
}

/** Renders the cover at an export size and resolves with a PNG blob. */
export function exportCover(state, sizeKey) {
  const size = SIZES[sizeKey] || SIZES.square;
  const canvas = document.createElement('canvas');
  canvas.width = size.w;
  canvas.height = size.h;
  drawCover(canvas.getContext('2d'), state, size.w, size.h);
  return new Promise((resolve) => canvas.toBlob((blob) => resolve({ blob, size }), 'image/png'));
}
