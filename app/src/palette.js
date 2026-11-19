// palette.js — colour recipes for Vice Nights Cover Studio.
// Every grade is a small record of numbers the renderer feeds to its
// per-pixel pass, plus the wash colour laid over a finished panel.

export const WASH_CYCLE = [
  '#12dec3', // teal
  '#ff3d8a', // hot pink
  '#8a4dff', // purple
  '#ff8a2a', // orange
  '#2ae0ff', // aqua
  '#ff2fb3', // magenta
  '#3ca9ff', // sky blue
];

export const GRADE_RECIPES = {
  illustrated: {
    label: 'Illustrated',
    saturation: 1.38,
    contrast: 1.16,
    levels: 5,
    shadowTint: [88, 40, 140],
    shadowMix: 0.34,
    glowTint: [255, 190, 120],
    glowMix: 0.24,
    washAlpha: 0.22,
    washMode: 'overlay',
    washFromCycle: true,
  },
  sunset: {
    label: 'Sunset',
    saturation: 1.24,
    contrast: 1.1,
    levels: 0,
    shadowTint: [122, 48, 92],
    shadowMix: 0.3,
    glowTint: [255, 168, 88],
    glowMix: 0.34,
    wash: '#ff7a3c',
    washAlpha: 0.18,
    washMode: 'soft-light',
    washFromCycle: false,
  },
  neon: {
    label: 'Neon',
    saturation: 1.52,
    contrast: 1.22,
    levels: 6,
    shadowTint: [36, 18, 122],
    shadowMix: 0.36,
    glowTint: [120, 240, 255],
    glowMix: 0.26,
    wash: '#ff2fb3',
    washAlpha: 0.16,
    washMode: 'overlay',
    washFromCycle: false,
  },
  noir: {
    label: 'Noir',
    saturation: 0.06,
    contrast: 1.36,
    levels: 0,
    shadowTint: [18, 18, 30],
    shadowMix: 0.2,
    glowTint: [242, 240, 234],
    glowMix: 0.12,
    wash: null,
    washAlpha: 0,
    washMode: 'overlay',
    washFromCycle: false,
  },
  gold: {
    label: 'Gold',
    saturation: 1.14,
    contrast: 1.08,
    levels: 0,
    shadowTint: [92, 60, 18],
    shadowMix: 0.3,
    glowTint: [255, 214, 138],
    glowMix: 0.3,
    wash: '#ffb62e',
    washAlpha: 0.2,
    washMode: 'soft-light',
    washFromCycle: false,
  },
};

export const GRADE_ORDER = ['illustrated', 'sunset', 'neon', 'noir', 'gold'];

export function washForPanel(recipe, panelIndex) {
  if (!recipe || recipe.washAlpha === 0) return null;
  if (recipe.washFromCycle) return WASH_CYCLE[panelIndex % WASH_CYCLE.length];
  return recipe.wash ?? null;
}
