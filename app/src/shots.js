// Fixed scenes for screenshots (v2 box-art restyle): ?shot=editor shows the
// page with sample photos loaded; ?shot=cover shows a cover alone; ?shot=export
// shows the actual PNG the app exported, as an image. `photo` picks the sample,
// `caption` the words, `layout` and `grade` the look, and `empty=2,5` leaves
// those panel indexes photo-free so their code-drawn motif scenes show in the
// screenshot. window.__shotReady is set once painted.
import { exportCover, SIZES } from './cover.js';
import { SAMPLES } from './presets.js';

function ready() {
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}

function emptySet(query) {
  const raw = query.get('empty');
  if (!raw) return new Set();
  return new Set(raw.split(',').map((n) => Number(n)).filter((n) => Number.isInteger(n) && n >= 0));
}

export async function runShot(shot, query, app) {
  const { state, loadImage, redraw, syncControls, selectPanel } = app;
  const layout = query.get('layout');
  if (layout) state.layout = layout;
  const grade = query.get('grade');
  if (grade) state.grade = grade;
  const caption = query.get('caption');
  if (caption) {
    const [t, s] = caption.split('|');
    state.title = t || state.title;
    if (s !== undefined) state.subtitle = s;
    document.getElementById('title').value = state.title;
    document.getElementById('subtitle').value = state.subtitle;
  }
  const pier = await loadImage(SAMPLES[query.get('photo') ?? 'pier'] || SAMPLES.pier);
  const boulevard = await loadImage(SAMPLES[query.get('photo2') ?? 'boulevard'] || SAMPLES.boulevard);
  const empty = emptySet(query);
  const fillPanels = () => {
    // First panel gets the main photo, the rest alternate — except panels
    // listed in `empty`, which keep their motif scenery.
    state.panels.forEach((p, i) => {
      if (empty.has(i)) { p.img = null; return; }
      p.img = i === 0 ? pier : (i % 2 === 0 ? pier : boulevard);
      p.zoom = 1.25;
    });
  };

  if (shot === 'export') {
    // Fill the panels, run the real export, and show that PNG on the page.
    redraw(); // ensures one panel slot per layout
    fillPanels();
    const { blob } = await exportCover(state, query.get('size') || 'wide');
    document.body.classList.add('shot-export');
    document.body.innerHTML = '';
    const img = document.createElement('img');
    img.alt = 'Exported cover PNG';
    img.src = URL.createObjectURL(blob);
    img.onload = ready;
    document.body.appendChild(img);
    return;
  }

  if (shot === 'cover' || shot === 'portrait' || shot === 'square') {
    document.body.classList.add('shot-cover');
    const sizeKey = shot === 'portrait' ? 'portrait' : shot === 'square' ? 'square' : 'wide';
    const size = SIZES[sizeKey];
    const canvas = document.getElementById('cover');
    canvas.width = size.w;
    canvas.height = size.h;
  }
  redraw(); // ensures one panel slot per layout
  fillPanels();
  selectPanel(0);
  syncControls();
  redraw();
  ready();
}
