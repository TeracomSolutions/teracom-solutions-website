// Screen and projector maths for the free tools (fields in
// lib/displayToolConfigs.js).
import { ASPECT_RATIOS, num } from './calculators.js';

const rad = (degrees) => (degrees * Math.PI) / 180;
const aspectOf = (id) => ASPECT_RATIOS.find((x) => x.id === id) || ASPECT_RATIOS[0];

// The widely quoted SMPTE 30 degrees, and THX's 40 degrees with its range
// down to 28.
export const SMPTE_DEGREES = 30;
export const THX_DEGREES = 40;
export const THX_FURTHEST_DEGREES = 28;

export function screenSize({ distanceMetres, aspect = '16:9', screenInches }) {
  const a = aspectOf(aspect);
  const diagonalPerWidth = Math.hypot(a.w, a.h) / a.w;
  const distance = num(distanceMetres);
  // A screen fills a view angle when its width is 2 x distance x tan(half the angle).
  const inchesFor = (degrees) => (2 * distance * Math.tan(rad(degrees / 2)) * diagonalPerWidth) / 0.0254;
  const widthMetres = (num(screenInches) * 0.0254) / diagonalPerWidth;
  const distanceFor = (degrees) => widthMetres / (2 * Math.tan(rad(degrees / 2)));
  return {
    smpteInches: inchesFor(SMPTE_DEGREES),
    thxInches: inchesFor(THX_DEGREES),
    smpteMetres: distanceFor(SMPTE_DEGREES),
    thxNearestMetres: distanceFor(THX_DEGREES),
    thxFurthestMetres: distanceFor(THX_FURTHEST_DEGREES),
  };
}

// ANSI/INFOCOMM 3M-2011 minimum system contrast ratios.
export const CONTRAST_CATEGORIES = [
  { id: 'passive', label: 'Passive viewing: signage, background content (7:1)', ratio: 7 },
  { id: 'basic', label: 'Basic decision making: presentations (15:1)', ratio: 15 },
  { id: 'analytical', label: 'Analytical decision making: spreadsheets, drawings, fine detail (50:1)', ratio: 50 },
  { id: 'video', label: 'Full motion video: films and video (80:1)', ratio: 80 },
];

export function projectorBrightness({ widthMetres, aspect = '16:9', ambientLux, category = 'basic', ageingPercent = 20 }) {
  const a = aspectOf(aspect);
  const width = num(widthMetres);
  const heightMetres = (width * a.h) / a.w;
  const areaM2 = width * heightMetres;
  const ratio = (CONTRAST_CATEGORIES.find((c) => c.id === category) || CONTRAST_CATEGORIES[1]).ratio;
  // Contrast = (projector light + room light) / room light, so the projector
  // must add (ratio - 1) x the room light on the screen.
  const screenLux = num(ambientLux) * (ratio - 1);
  const lumens = screenLux * areaM2;
  return {
    heightMetres,
    areaM2,
    ratio,
    screenLux,
    lumens,
    lumensWithAgeing: lumens * (1 + num(ageingPercent) / 100),
  };
}