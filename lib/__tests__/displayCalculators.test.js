import { test } from 'node:test';
import assert from 'node:assert/strict';

import { projectorBrightness, screenSize } from '../displayCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('screenSize gives the 30 and 40 degree screens for a distance', () => {
  const r = screenSize({ distanceMetres: '3', aspect: '16:9', screenInches: '65' });
  close(r.smpteInches, 72.6214564, 1e-6);
  close(r.thxInches, 98.6457479, 1e-6);
  close(r.smpteMetres, 2.6851568, 1e-6);
  close(r.thxNearestMetres, 1.9767705, 1e-6);
  close(r.thxFurthestMetres, 2.8856992, 1e-6);
});

test('the 30 degree seat is about 1.63 x the diagonal of a 16:9 screen', () => {
  const r = screenSize({ distanceMetres: '0', aspect: '16:9', screenInches: '100' });
  close(r.smpteMetres / (100 * 0.0254), 1.6263821, 1e-6);
});

test('projectorBrightness meets the contrast target over the room light', () => {
  const r = projectorBrightness({ widthMetres: '2.5', aspect: '16:9', ambientLux: '150', category: 'basic', ageingPercent: '20' });
  close(r.heightMetres, 1.40625);
  close(r.areaM2, 3.515625);
  assert.equal(r.ratio, 15);
  close(r.screenLux, 2100);
  close(r.lumens, 7382.8125);
  close(r.lumensWithAgeing, 8859.375);
});

test('full motion video needs an 80:1 contrast', () => {
  const r = projectorBrightness({ widthMetres: '2', aspect: '16:9', ambientLux: '10', category: 'video', ageingPercent: '0' });
  assert.equal(r.ratio, 80);
  close(r.screenLux, 790);
});
