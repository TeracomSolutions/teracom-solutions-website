import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  PLAN_FORMAT,
  cameraFov,
  cleanPlan,
  doriDistances,
  effectiveScale,
  emptyPlan,
  fovFromLens,
  newCamera,
  parsePlan,
  scaleFromPoints,
  sectorPath,
} from '../cameraPlan.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('fovFromLens uses 2 x atan(sensor width / 2f)', () => {
  close(fovFromLens('2.8', '5.4'), (2 * Math.atan(5.4 / 5.6) * 180) / Math.PI);
  assert.ok(fovFromLens('12', '5.4') < fovFromLens('4', '5.4'));
  assert.equal(fovFromLens('0', '5.4'), 0);
});

test('cameraFov prefers the datasheet angle when chosen, and stays in range', () => {
  assert.equal(cameraFov({ fovMode: 'fov', hfov: '100' }), 100);
  assert.equal(cameraFov({ fovMode: 'fov', hfov: '500' }), 179);
  close(cameraFov({ fovMode: 'lens', focal: '2.8', sensor: '5.4' }), fovFromLens('2.8', '5.4'));
});

test('doriDistances matches the lens calculator maths', () => {
  const [detect, , recognise, identify] = doriDistances('1920', 90);
  close(detect.metres, 1920 / (25 * 2));
  close(recognise.metres, 1920 / (125 * 2));
  close(identify.metres, 1920 / (250 * 2));
});

test('sectorPath draws a wedge from the centre or a ring between two radii', () => {
  assert.match(sectorPath(0, 0, 0, 10, 0, 90), /^M 0\.0 0\.0 L /);
  const ring = sectorPath(0, 0, 5, 10, 0, 90);
  assert.equal((ring.match(/A /g) || []).length, 2);
});

test('scaleFromPoints gives pixels per metre', () => {
  close(scaleFromPoints({ x: 0, y: 0 }, { x: 300, y: 400 }, '10'), 50);
  assert.equal(scaleFromPoints({ x: 0, y: 0 }, { x: 0, y: 0 }, '10'), 0);
  assert.equal(scaleFromPoints({ x: 0, y: 0 }, { x: 10, y: 0 }, '0'), 0);
});

test('plans round-trip and bad files are refused', () => {
  const plan = { ...emptyPlan(), name: 'Shed', pxPerMetre: 12, cameras: [newCamera('a', 10, 20, 1)] };
  const back = parsePlan(JSON.stringify(plan));
  assert.equal(back.name, 'Shed');
  assert.equal(back.cameras[0].name, 'Camera 1');
  assert.equal(parsePlan('{"format":"other"}'), null);
  assert.equal(parsePlan('not json'), null);
  const sneaky = cleanPlan({ format: PLAN_FORMAT, image: { dataUrl: 'javascript:alert(1)', width: 10, height: 10 }, cameras: [{ rotation: -90, fovMode: 'x' }] });
  assert.equal(sneaky.image, null);
  assert.equal(sneaky.cameras[0].rotation, 270);
  assert.equal(sneaky.cameras[0].fovMode, 'lens');
});

test('without a scale, the plan is taken as 40 m across', () => {
  assert.equal(effectiveScale(emptyPlan()), 40);
  assert.equal(effectiveScale({ ...emptyPlan(), image: { width: 2000, height: 1000 } }), 50);
  assert.equal(effectiveScale({ ...emptyPlan(), pxPerMetre: 7 }), 7);
});
