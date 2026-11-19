// studio.js — the editor around the renderer: panel cards, caption
// presets, the draggable focal pin, PNG export, and the fixed ?shot=
// scenes the screenshots are taken from.

import { LAYOUTS, freshPanel, paintCover, panelRects, pixelRects, focalSpot, cropWindow, restingFocalY } from './renderer.js';
import { GRADE_ORDER, GRADE_RECIPES } from './palette.js';

const SIZES = {
  square: { label: 'Square', w: 1080, h: 1080 },
  portrait: { label: 'Portrait', w: 1080, h: 1350 },
  wide: { label: 'Wide', w: 1920, h: 1080 },
};

const CAPTION_PRESETS = [
  { title: 'Vice Nights', subtitle: 'one city, no brakes' },
  { title: 'Neon Harbor', subtitle: 'est. trouble since sunset' },
  { title: 'Palm Reign', subtitle: 'every street tells a story' },
  { title: 'Midnight Marina', subtitle: 'fast boats, slow mornings' },
];

const state = {
  title: 'Vice Nights',
  subtitle: 'one city, no brakes',
  layout: 'box',
  grade: 'illustrated',
  size: 'square',
  panels: Array.from({ length: 7 }, () => freshPanel()),
};

let activePanel = 0;
const $ = (id) => document.getElementById(id);
const preview = $('preview');
const wrap = $('canvasWrap');
const pin = $('focalPin');
const statusLine = $('statusLine');

function say(text) { statusLine.textContent = text; }

let renderQueued = false;
function requestRender() {
  if (renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    drawPreview();
  });
}

function drawPreview() {
  const { w, h } = SIZES[state.size];
  const scale = Math.min(1, 880 / w);
  preview.width = Math.round(w * scale);
  preview.height = Math.round(h * scale);
  wrap.style.setProperty('--aspect', String(w / h));
  paintCover(preview.getContext('2d'), preview.width, preview.height, state);
  placePin();
}

function activeRect() {
  const rects = pixelRects(panelRects(state.layout, preview.width / preview.height), preview.width, preview.height);
  return rects[activePanel];
}

function placePin() {
  const panel = state.panels[activePanel];
  const rect = activeRect();
  if (!panel || !panel.img || !rect) {
    pin.style.display = 'none';
    return;
  }
  const spot = focalSpot(panel.img, panel, rect);
  pin.style.display = 'block';
  pin.style.left = `${((rect.x + spot.x * rect.w) / preview.width) * 100}%`;
  pin.style.top = `${((rect.y + spot.y * rect.h) / preview.height) * 100}%`;
}

// --- photo loading -------------------------------------------------

function adoptPhoto(panel, img) {
  panel.img = img;
  panel.graded = null;
  panel.gradedKey = '';
  panel.zoom = 1;
  panel.panX = 0;
  panel.panY = 0;
  panel.fx = 0.5;
  const rects = panelRects(state.layout, SIZES[state.size].w / SIZES[state.size].h);
  const r = rects[state.panels.indexOf(panel)] ?? rects[0];
  panel.fy = restingFocalY(r.w, r.h, img.naturalWidth, img.naturalHeight);
}

function loadFileInto(panel, file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    adoptPhoto(panel, img);
    syncCards();
    requestRender();
    say('Photo loaded — drag the pink pin onto the face.');
  };
  img.onerror = () => say('That file could not be read as an image.');
  img.src = url;
}

function loadSample(panel, name, fx, fy) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      adoptPhoto(panel, img);
      if (typeof fx === 'number') panel.fx = fx;
      if (typeof fy === 'number') panel.fy = fy;
      resolve();
    };
    img.onerror = () => resolve();
    img.src = `./samples/${name}`;
  });
}

// --- panel cards ---------------------------------------------------

const SLIDERS = [
  { key: 'zoom', label: 'Zoom', min: 1, max: 3, step: 0.01 },
  { key: 'fx', label: 'Focal X', min: 0, max: 1, step: 0.005 },
  { key: 'fy', label: 'Focal Y', min: 0, max: 1, step: 0.005 },
  { key: 'panX', label: 'Pan X', min: -0.3, max: 0.3, step: 0.005 },
  { key: 'panY', label: 'Pan Y', min: -0.3, max: 0.3, step: 0.005 },
];

function buildCards() {
  const host = $('panelCards');
  host.innerHTML = '';
  const count = LAYOUTS[state.layout].panels;
  for (let i = 0; i < count; i++) {
    const panel = state.panels[i];
    const card = document.createElement('div');
    card.className = 'panelCard' + (i === activePanel ? ' on' : '');
    card.dataset.index = String(i);
    const head = document.createElement('h3');
    head.textContent = `Panel ${i + 1}`;
    const clear = document.createElement('button');
    clear.type = 'button';
    clear.className = 'clearBtn';
    clear.textContent = 'Empty';
    clear.addEventListener('click', (ev) => {
      ev.stopPropagation();
      panel.img = null;
      panel.graded = null;
      syncCards();
      requestRender();
      say(`Panel ${i + 1} emptied — a drawn scene fills it.`);
    });
    head.appendChild(clear);
    card.appendChild(head);
    const fileLabel = document.createElement('label');
    fileLabel.className = 'btn fileBtn';
    fileLabel.textContent = panel.img ? 'Replace photo' : 'Load photo';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.hidden = true;
    fileInput.addEventListener('change', () => loadFileInto(panel, fileInput.files[0]));
    fileLabel.appendChild(fileInput);
    card.appendChild(fileLabel);
    for (const s of SLIDERS) {
      const row = document.createElement('label');
      row.className = 'sliderRow';
      const name = document.createElement('span');
      name.textContent = s.label;
      const input = document.createElement('input');
      input.type = 'range';
      input.min = String(s.min);
      input.max = String(s.max);
      input.step = String(s.step);
      input.value = String(panel[s.key]);
      input.dataset.panel = String(i);
      input.dataset.key = s.key;
      input.addEventListener('input', () => {
        panel[s.key] = Number(input.value);
        requestRender();
      });
      row.appendChild(name);
      row.appendChild(input);
      card.appendChild(row);
    }
    card.addEventListener('click', () => {
      activePanel = i;
      syncCards();
      placePin();
    });
    host.appendChild(card);
  }
}

function syncCards() {
  buildCards();
}

// --- segmented pickers ----------------------------------------------

function buildSeg(hostId, options, current, onPick) {
  const host = $(hostId);
  host.innerHTML = '';
  for (const opt of options) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = opt.label;
    if (opt.value === current) b.className = 'on';
    b.addEventListener('click', () => onPick(opt.value));
    host.appendChild(b);
  }
}

function refreshPickers() {
  buildSeg('layoutRow',
    Object.entries(LAYOUTS).map(([value, v]) => ({ value, label: v.label })),
    state.layout,
    (value) => { state.layout = value; activePanel = 0; refreshPickers(); syncCards(); requestRender(); });
  buildSeg('gradeRow',
    GRADE_ORDER.map((value) => ({ value, label: GRADE_RECIPES[value].label })),
    state.grade,
    (value) => { state.grade = value; refreshPickers(); requestRender(); });
  buildSeg('sizeRow',
    Object.entries(SIZES).map(([value, v]) => ({ value, label: `${v.label} ${v.w}×${v.h}` })),
    state.size,
    (value) => { state.size = value; refreshPickers(); requestRender(); });
  buildSeg('presetRow',
    CAPTION_PRESETS.map((p, i) => ({ value: String(i), label: p.title })),
    '',
    (value) => {
      const p = CAPTION_PRESETS[Number(value)];
      state.title = p.title;
      state.subtitle = p.subtitle;
      $('titleText').value = p.title;
      $('subtitleText').value = p.subtitle;
      requestRender();
    });
}

// --- focal pin dragging ----------------------------------------------

let pinDrag = null;
pin.addEventListener('pointerdown', (ev) => {
  pinDrag = { id: ev.pointerId };
  pin.setPointerCapture(ev.pointerId);
  ev.preventDefault();
});
pin.addEventListener('pointermove', (ev) => {
  if (!pinDrag) return;
  const panel = state.panels[activePanel];
  const rect = activeRect();
  if (!panel || !panel.img || !rect) return;
  const box = preview.getBoundingClientRect();
  const px = ((ev.clientX - box.left) / box.width) * preview.width;
  const py = ((ev.clientY - box.top) / box.height) * preview.height;
  const win = cropWindow(panel.img, panel, rect);
  const fx = (px - rect.x - win.dx) / win.dw;
  const fy = (py - rect.y - win.dy) / win.dh;
  panel.fx = Math.min(1, Math.max(0, fx));
  panel.fy = Math.min(1, Math.max(0, fy));
  syncSliderValues();
  requestRender();
});
pin.addEventListener('pointerup', () => { pinDrag = null; });
pin.addEventListener('pointercancel', () => { pinDrag = null; });

function syncSliderValues() {
  const panel = state.panels[activePanel];
  document.querySelectorAll('input[type="range"]').forEach((input) => {
    if (Number(input.dataset.panel) === activePanel) input.value = String(panel[input.dataset.key]);
  });
}

// --- export -----------------------------------------------------------

function exportPng(w, h) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  paintCover(cv.getContext('2d'), w, h, state);
  cv.toBlob((blob) => {
    if (!blob) { say('Export failed in this browser.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-nights-${w}x${h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    say(`Exported PNG ${w} × ${h}.`);
  }, 'image/png');
}

// --- shot scenes -------------------------------------------------------

const PIER_FACE = { fx: 0.44, fy: 0.26 };
const BOULEVARD_FACE = { fx: 0.56, fy: 0.19 };

async function applyShotScene(name) {
  document.body.classList.add('coverOnly');
  if (name === 'wide') {
    state.size = 'wide';
    state.layout = 'box';
    state.grade = 'illustrated';
    state.title = 'Vice Nights';
    state.subtitle = 'one city, no brakes';
    await loadSample(state.panels[0], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
    await loadSample(state.panels[2], 'pier.jpg', PIER_FACE.fx, PIER_FACE.fy);
    await loadSample(state.panels[5], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
  } else if (name === 'portrait') {
    state.size = 'portrait';
    state.layout = 'box';
    state.grade = 'illustrated';
    state.title = 'Vice Nights';
    state.subtitle = 'one city, no brakes';
    await loadSample(state.panels[0], 'pier.jpg', PIER_FACE.fx, PIER_FACE.fy);
    await loadSample(state.panels[1], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
    await loadSample(state.panels[6], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
  } else if (name === 'hero') {
    state.size = 'square';
    state.layout = 'hero';
    state.grade = 'illustrated';
    state.title = 'Vice Nights';
    state.subtitle = 'one city, no brakes';
    await loadSample(state.panels[0], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
    state.panels[0].zoom = 1.7;
  }
  const { w, h } = SIZES[state.size];
  preview.width = w;
  preview.height = h;
  paintCover(preview.getContext('2d'), w, h, state);
  document.title = `shot-${name}`;
}

async function applyEditorScene() {
  state.size = 'square';
  state.layout = 'box';
  await loadSample(state.panels[0], 'pier.jpg', PIER_FACE.fx, PIER_FACE.fy);
  await loadSample(state.panels[1], 'boulevard.jpg', BOULEVARD_FACE.fx, BOULEVARD_FACE.fy);
  activePanel = 0;
  refreshPickers();
  syncCards();
  drawPreview();
  document.title = 'shot-editor';
}

// --- wiring -------------------------------------------------------------

function init() {
  $('titleText').addEventListener('input', (ev) => { state.title = ev.target.value; requestRender(); });
  $('subtitleText').addEventListener('input', (ev) => { state.subtitle = ev.target.value; requestRender(); });
  $('fillAll').addEventListener('change', (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      for (const panel of state.panels) adoptPhoto(panel, img);
      syncCards();
      requestRender();
      say('Every panel now uses that photo — set each focal point.');
    };
    img.src = url;
  });
  document.querySelectorAll('[data-export]').forEach((b) => {
    b.addEventListener('click', () => {
      const [w, h] = b.dataset.export.split('x').map(Number);
      exportPng(w, h);
    });
  });
  window.addEventListener('resize', () => placePin());

  const shot = new URLSearchParams(location.search).get('shot');
  if (shot === 'editor') {
    applyEditorScene();
    return;
  }
  if (shot) {
    applyShotScene(shot);
    return;
  }
  refreshPickers();
  syncCards();
  drawPreview();
}

init();
