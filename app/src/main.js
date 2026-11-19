// Wires the Vice Nights editor (v2 box-art restyle): pick a layout — Box Art
// is the default irregular mosaic — load photos into panels, crop and position
// each one, write the caption, pick a grade (Illustrated is the default),
// export a PNG. Panels left empty show code-drawn motif scenes instead.
// A `?shot=` query sets up a fixed scene for a screenshot instead (./shots.js).
import { drawCover, exportCover, getPanels, SIZES } from './cover.js';
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

const state = {
  layout: 'boxart',
  grade: 'illustrated',
  title: titleInput.value,
  subtitle: subtitleInput.value,
  panels: [{ img: null, zoom: 1.2, panX: 0, panY: 0 }],
};
let selected = 0;

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
  while (state.panels.length < panelCount()) state.panels.push({ img: null, zoom: 1.2, panX: 0, panY: 0 });
  state.panels.length = panelCount();
  if (selected >= panelCount()) selected = 0;
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
  panXInput.value = String(p.panX);
  panYInput.value = String(p.panY);
  buildTabs();
}

function redraw() {
  ensurePanels();
  drawCover(canvas.getContext('2d'), state, canvas.width, canvas.height);
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
panXInput.addEventListener('input', () => { state.panels[selected].panX = Number(panXInput.value); redraw(); });
panYInput.addEventListener('input', () => { state.panels[selected].panY = Number(panYInput.value); redraw(); });

document.getElementById('fillAll').addEventListener('click', () => {
  const src = state.panels[selected];
  if (!src.img) { status.textContent = 'Load a photo into this panel first.'; return; }
  state.panels.forEach((p) => { p.img = src.img; p.zoom = src.zoom; p.panX = src.panX; p.panY = src.panY; });
  status.textContent = 'One photo now fills every panel.';
  syncControls();
  redraw();
});

document.getElementById('clearPanel').addEventListener('click', () => {
  state.panels[selected] = { img: null, zoom: 1.2, panX: 0, panY: 0 };
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

// Drag the preview to move the selected panel's photo.
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
canvas.addEventListener('pointerdown', (e) => {
  const i = panelRectAt(e.clientX, e.clientY);
  if (i < 0) return;
  selectPanel(i);
  dragging = { x: e.clientX, y: e.clientY };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const r = canvas.getBoundingClientRect();
  const p = state.panels[selected];
  p.panX = Math.max(-1, Math.min(1, p.panX + ((e.clientX - dragging.x) / r.width) * 2));
  p.panY = Math.max(-1, Math.min(1, p.panY + ((e.clientY - dragging.y) / r.height) * 2));
  dragging = { x: e.clientX, y: e.clientY };
  panXInput.value = String(p.panX);
  panYInput.value = String(p.panY);
  redraw();
});
canvas.addEventListener('pointerup', () => { dragging = null; });

const shot = new URLSearchParams(location.search).get('shot');
if (shot) {
  runShot(shot, new URLSearchParams(location.search), {
    state, loadImage, redraw, syncControls, selectPanel,
  });
} else {
  ensurePanels();
  syncControls();
  redraw();
}
