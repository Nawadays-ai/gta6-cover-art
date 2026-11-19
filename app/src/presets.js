// Caption presets and layout notes for Vice Nights (v2 box-art restyle).
// All words are original; the app never ships game logos, artwork or fonts.
// Titles are kept to two punchy words where possible: the renderer stacks
// them into 2–3 huge lines over the middle of the mosaic.
export const CAPTION_PRESETS = [
  { title: 'VICE NIGHTS', subtitle: 'SUNSET BOULEVARD · EST. 2026' },
  { title: 'NEON HEIST', subtitle: 'ONE LAST SCORE' },
  { title: 'OCEAN DRIVE', subtitle: 'MIDNIGHT CRUISE' },
  { title: 'PALM & CHROME', subtitle: 'VICE CITY SUMMER' },
  { title: 'MIDNIGHT HEAT', subtitle: 'LEONIDA KEYS · AFTER DARK' },
];

// How many photo panels each layout shows. Box Art is the v2 default: an
// irregular 7-panel mosaic; Hero is the single-image key-art composition.
export const LAYOUT_PANEL_COUNT = { boxart: 7, hero: 3, triptych: 3, quad: 4 };

// Motif scenes drawn into panels that have no photo yet, in rotation order
// (names mirror MOTIFS in cover.js; kept here for the editor's hints).
export const MOTIF_ROTATION = [
  'Helicopter over the skyline',
  'Speedboat with a pink flamingo',
  'Yellow sports car',
  'Alligator in the water',
  'Palm silhouettes at sunset',
  'Art-deco hotels',
  'Birds over the bay',
];

// Sample photos shipped with the app, made for make.fun and free to use.
export const SAMPLES = { pier: 'samples/pier.jpg', boulevard: 'samples/boulevard.jpg' };
