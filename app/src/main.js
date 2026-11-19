// Wires the Vice Nights editor (v3 face-led focal framing): pick a layout —
// Box Art is the default irregular mosaic — load photos into panels, set each
// panel's focal point (the crop anchor; put it on the face for person
// photos), write the caption, pick a grade (Illustrated is the default),
// export a PNG. Panels left empty show code-drawn motif scenes instead.
// The old pan sliders now set the focal point directly (0–1 across/down the
// photo), and a draggable focal marker is drawn on the preview: drag the
// marker to move the focal, drag elsewhere on a panel to slide its photo.
// A `?shot=` query sets up a fixed scene for a screenshot instead (./shots.js).
import { drawCover, exportCover, getPanels, cropForPanel, resolveFocal, SIZES } from './cover.js';
import { LAYOUT_PANEL_COUNT, SAMPLES } from './presets.js';
import { runShot } from './shots.js';

const canvas = document.getElementById('cover');
const titleInput = document.getElementById('title');
const subtitleInput = document.getElementById('subtitle');
const status = document.getElementById('status');
const panelTabs = document.getElementById('panelTabs');
const panelName = document.getElementById('panelName');
const zoomInput = document.getElementById('zoom');
const panXInput = document.getElementById('panX');
const panYInput = document.getElementById('panY');

// Panel state: focalX/focalY are the crop anchor in [0, 1]² of the photo;
// null means "use the renderer's face-led default" (portrait fy 0.26,
// landscape fy 0.35, fx 0.5). New panels start on the default, not centre.
const blankPanel = () => ({ img: null, zoom: 1.2, focalX: null, focalY: null });

const state = {
  layout: 'boxart',
  grade: 'illustrated',
  title: titleInput.value,
  subtitle: subtitleInput.value,
  panels: [blankPanel()],
};
let selected = 0;
const shotMode = new URLSearchParams(location.search).get('shot');

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function panelCount() {
  return LAYOUT_PANEL_COUNT[state.layout] || 3;
}

function ensurePanels() {
  while (state.panels.length < panelCount()) state.panels.push(blankPanel());
  state.panels.length = panelCount();
  if (selected >= panelCount()) selected = 0;
}

/** Effective focal of a panel in the current canvas geometry. */
function effectiveFocal(i) {
  const p = state.panels[i];
  const rects = getPanels(state.layout, canvas.width, canvas.height);
  const r = rects[i];
  if (!r) return { x: 0.5, y: 0.26 };
  const pw = r.w * canvas.width;
  const ph = r.h * canvas.height;
  const sw = p.img ? (p.img.naturalWidth || p.img.width) : pw;
  const sh = p.img ? (p.img.naturalHeight || p.img.height) : ph;
  return resolveFocal(p, pw, ph, sw, sh);
}

function buildTabs() {
  panelTabs.innerHTML = '';
  for (let i = 0; i < panelCount(); i++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `Panel ${i + 1}${state.panels[i] && state.panels[i].img ? ' ✓' : ''}`;
    if (i === selected) b.classList.add('picked');
    b.addEventListener('click', () => { selectPanel(i); });
    panelTabs.appendChild(b);
  }
}

function selectPanel(i) {
  selected = i;
  const p = state.panels[i];
  panelName.textContent = String(i + 1);
  zoomInput.value = String(p.zoom);
  // The sliders show the effective focal (explicit or face-led default).
  const f = effectiveFocal(i);
  panXInput.value = String(f.x);
  panYInput.value = String(f.y);
  buildTabs();
}

/** Draws the draggable focal marker over the selected photo panel. */
function drawFocalMarker(ctx) {
  const p = state.panels[selected];
  if (!p || !p.img) return;
  const rects = getPanels(state.layout, canvas.width, canvas.height);
  const r = rects[selected];
  if (!r) return;
  const g = canvas.width * 0.012;
  const px = r.x * canvas.width + g / 2;
  const py = r.y * canvas.height + g / 2;
  const pw = r.w * canvas.width - g;
  const ph = r.h * canvas.height - g;
  const sw = p.img.naturalWidth || p.img.width;
  const sh = p.img.naturalHeight || p.img.height;
  const crop = cropForPanel(p, pw, ph, sw, sh);
  const mx = px + crop.dx + crop.focal.x * crop.dw;
  const my = py + crop.dy + crop.focal.y * crop.dh;
  const rad = Math.max(10, canvas.width * 0.016);
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ff2e88';
  ctx.lineWidth = Math.max(2, canvas.width * 0.003);
  ctx.beginPath(); ctx.arc(mx, my, rad, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(mx - rad * 1.7, my); ctx.lineTo(mx - rad * 0.45, my);
  ctx.moveTo(mx + rad * 0.45, my); ctx.lineTo(mx + rad * 1.7, my);
  ctx.moveTo(mx, my - rad * 1.7); ctx.lineTo(mx, my - rad * 0.45);
  ctx.moveTo(mx, my + rad * 0.45); ctx.lineTo(mx, my + rad * 1.7);
  ctx.stroke();
  ctx.restore();
  return { x: mx, y: my, rad: rad * 2.2 };
}

let focalMarker = null;

function redraw() {
  ensurePanels();
  const ctx = canvas.getContext('2d');
  drawCover(ctx, state, canvas.width, canvas.height);
  // The marker is an editor aid only: fixed cover/export scenes draw the
  // clean cover (the editor screenshot keeps it, showing the focal UI).
  focalMarker = !shotMode || shotMode === 'editor' ? drawFocalMarker(ctx) : null;
}

function syncControls() {
  document.querySelectorAll('#layoutRow button').forEach((b) => b.classList.toggle('picked', b.dataset.layout === state.layout));
  document.querySelectorAll('#gradeRow button').forEach((b) => b.classList.toggle('picked', b.dataset.grade === state.grade));
  buildTabs();
}

document.getElementById('layoutRow').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-layout]');
  if (!b) return;
  state.layout = b.dataset.layout;
  ensurePanels();
  syncControls();
  redraw();
  status.textContent = state.layout === 'boxart'
    ? 'Box Art: irregular mosaic, black gutters — empty panels draw motif scenes.'
    : 'Empty panels draw motif scenes; filled panels take the colour grade.';
});

document.getElementById('gradeRow').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-grade]');
  if (!b) return;
  state.grade = b.dataset.grade;
  syncControls();
  redraw();
});

document.getElementById('sampleRow').addEventListener('click', async (e) => {
  const b = e.target.closest('button[data-sample]');
  if (!b) return;
  try {
    state.panels[selected].img = await loadImage(SAMPLES[b.dataset.sample]);
    status.textContent = `Sample photo loaded into panel ${selected + 1}.`;
    syncControls();
    redraw();
  } catch {
    status.textContent = 'Could not load that sample photo.';
  }
});

document.getElementById('captionRow').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-caption]');
  if (!b) return;
  const [t, s] = b.dataset.caption.split('|');
  state.title = t;
  state.subtitle = s;
  titleInput.value = t;
  subtitleInput.value = s;
  redraw();
});

document.getElementById('photo').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  state.panels[selected].img = await loadImage(URL.createObjectURL(file));
  status.textContent = `Photo loaded into panel ${selected + 1}.`;
  syncControls();
  redraw();
  e.target.value = '';
});

zoomInput.addEventListener('input', () => { state.panels[selected].zoom = Number(zoomInput.value); redraw(); });
// The pan sliders now set the focal point itself (0–1 across / down the
// photo): put the focal on the face and the crop follows it.
panXInput.addEventListener('input', () => { state.panels[selected].focalX = Number(panXInput.value); redraw(); });
panYInput.addEventListener('input', () => { state.panels[selected].focalY = Number(panYInput.value); redraw(); });

document.getElementById('fillAll').addEventListener('click', () => {
  const src = state.panels[selected];
  if (!src.img) { status.textContent = 'Load a photo into this panel first.'; return; }
  state.panels.forEach((p) => { p.img = src.img; p.zoom = src.zoom; p.focalX = src.focalX; p.focalY = src.focalY; });
  status.textContent = 'One photo now fills every panel.';
  syncControls();
  redraw();
});

document.getElementById('clearPanel').addEventListener('click', () => {
  state.panels[selected] = blankPanel();
  selectPanel(selected);
  redraw();
});

titleInput.addEventListener('input', () => { state.title = titleInput.value; redraw(); });
subtitleInput.addEventListener('input', () => { state.subtitle = subtitleInput.value; redraw(); });

document.querySelectorAll('button[data-size]').forEach((b) => {
  b.addEventListener('click', async () => {
    status.textContent = 'Rendering PNG…';
    const { blob, size } = await exportCover(state, b.dataset.size);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = size.name;
    a.click();
    status.textContent = `Saved ${size.name} (${size.w} × ${size.h}).`;
  });
});

// Drag the preview: dragging the focal marker moves the focal point to
// the pointer; dragging anywhere else on a panel slides that panel's
// photo, which moves its focal the opposite way (the crop follows it).
let dragging = null;
function panelRectAt(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const x = (clientX - r.left) / r.width;
  const y = (clientY - r.top) / r.height;
  // Panel geometry depends on the canvas aspect (Box Art has two mosaics).
  const panels = getPanels(state.layout, canvas.width, canvas.height);
  for (let i = 0; i < panels.length; i++) {
    const p = panels[i];
    if (x >= p.x && x <= p.x + p.w && y >= p.y && y <= p.y + p.h) return i;
  }
  return -1;
}

/** Sets panel i's focal from a pointer position given in canvas pixels. */
function setFocalFromPoint(i, cx, cy) {
  const p = state.panels[i];
  if (!p.img) return;
  const rects = getPanels(state.layout, canvas.width, canvas.height);
  const r = rects[i];
  const g = canvas.width * 0.012;
  const px = r.x * canvas.width + g / 2;
  const py = r.y * canvas.height + g / 2;
  const pw = r.w * canvas.width - g;
  const ph = r.h * canvas.height - g;
  const sw = p.img.naturalWidth || p.img.width;
  const sh = p.img.naturalHeight || p.img.height;
  const crop = cropForPanel(p, pw, ph, sw, sh);
  // The pointer marks where the focal should sit in the panel; invert the
  // crop so the focal is the source point now under the panel's centre —
  // simplest stable rule: the source point under the pointer becomes the
  // focal, so the user literally points at the face.
  const fx = (cx - px - crop.dx) / crop.dw;
  const fy = (cy - py - crop.dy) / crop.dh;
  p.focalX = Math.min(1, Math.max(0, fx));
  p.focalY = Math.min(1, Math.max(0, fy));
  panXInput.value = String(p.focalX);
  panYInput.value = String(p.focalY);
}

canvas.addEventListener('pointerdown', (e) => {
  const r = canvas.getBoundingClientRect();
  const cx = (e.clientX - r.left) * (canvas.width / r.width);
  const cy = (e.clientY - r.top) * (canvas.height / r.height);
  if (focalMarker && Math.hypot(cx - focalMarker.x, cy - focalMarker.y) <= focalMarker.rad) {
    dragging = { mode: 'focal' };
    canvas.setPointerCapture(e.pointerId);
    return;
  }
  const i = panelRectAt(e.clientX, e.clientY);
  if (i < 0) return;
  selectPanel(i);
  dragging = { mode: 'slide', x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const r = canvas.getBoundingClientRect();
  const p = state.panels[selected];
  if (dragging.mode === 'focal') {
    const cx = (e.clientX - r.left) * (canvas.width / r.width);
    const cy = (e.clientY - r.top) * (canvas.height / r.height);
    setFocalFromPoint(selected, cx, cy);
    redraw();
    return;
  }
  if (!p.img) { dragging = { mode: 'slide', x: e.clientX, y: e.clientY }; return; }
  // Sliding the photo by (dx, dy) display pixels moves the focal point by
  // the same distance in the opposite direction, in source fractions.
  const rects = getPanels(state.layout, canvas.width, canvas.height);
  const rect = rects[selected];
  const pw = rect.w * canvas.width;
  const ph = rect.h * canvas.height;
  const sw = p.img.naturalWidth || p.img.width;
  const sh = p.img.naturalHeight || p.img.height;
  const crop = cropForPanel(p, pw, ph, sw, sh);
  const f = effectiveFocal(selected);
  const scaleX = canvas.width / r.width;
  const scaleY = canvas.height / r.height;
  p.focalX = Math.min(1, Math.max(0, f.x - ((e.clientX - dragging.x) * scaleX) / crop.dw));
  p.focalY = Math.min(1, Math.max(0, f.y - ((e.clientY - dragging.y) * scaleY) / crop.dh));
  dragging = { mode: 'slide', x: e.clientX, y: e.clientY };
  panXInput.value = String(p.focalX);
  panYInput.value = String(p.focalY);
  redraw();
});
canvas.addEventListener('pointerup', () => { dragging = null; });

if (shotMode) {
  runShot(shotMode, new URLSearchParams(location.search), {
    state, loadImage, redraw, syncControls, selectPanel,
  });
} else {
  ensurePanels();
  syncControls();
  redraw();
}
