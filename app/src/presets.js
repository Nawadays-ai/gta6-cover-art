// Caption presets and layout notes for Vice Nights (v3 focal framing).
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

// Face-led focal defaults (v3, mirrors FOCAL_DEFAULTS in cover.js): a
// panel's crop anchors at this point of the photo instead of its centre,
// so person panels frame the face head-and-shoulders like the official
// box art. Portrait panels/photos anchor high (fy 0.26, the upper third
// where faces sit); landscape panels anchor at fy 0.35.
export const FOCAL_DEFAULTS = {
  portrait: { x: 0.5, y: 0.26 },
  landscape: { x: 0.5, y: 0.35 },
  square: { x: 0.5, y: 0.29 },
};

// Measured face centres in the two sample photos (fractions of width /
// height, read off the photos in the v3 pass): pier's fisherman face is
// at (0.44, 0.26); boulevard's driver face is at (0.56, 0.19). The fixed
// screenshot scenes (shots.js) use these as explicit panel focals.
export const SAMPLE_FOCALS = {
  pier: { x: 0.44, y: 0.26 },
  boulevard: { x: 0.56, y: 0.19 },
};
