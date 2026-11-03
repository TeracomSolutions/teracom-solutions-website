import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  DEVICE_GROUPS,
  DEVICE_TYPES,
  OLD_PLAN_FORMAT,
  PLAN_FORMAT,
  SAMPLE_IMAGE,
  cameraFov,
  cleanPlan,
  coverageShapes,
  coverageText,
  deviceType,
  doriDistances,
  effectiveScale,
  emptyPlan,
  fovFromLens,
  newDevice,
  parsePlan,
  samplePlan,
  scaleFromPoints,
  sectorPath,
  speakerRadius,
} from '../model.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('fovFromLens uses 2 x atan(sensor width / 2f)', () => {
  close(fovFromLens('2.8', '5.4'), (2 * Math.atan(5.4 / 5.6) * 180) / Math.PI);
  assert.equal(fovFromLens('0', '5.4'), 0);
  assert.equal(cameraFov({ fovMode: 'fov', hfov: '500' }), 179);
});

test('doriDistances matches the lens calculator maths', () => {
  const [detect, , , identify] = doriDistances('1920', 90);
  close(detect.metres, 1920 / 50);
  close(identify.metres, 1920 / 500);
});

test('speakerRadius is the drop x tan(half the angle)', () => {
  close(speakerRadius('3.2', '1.2', '90'), 2);
  assert.equal(speakerRadius('1', '1.2', '90'), 0);
});

test('every device type draws the right kind of coverage', () => {
  const shapes = (type, extra = {}) => coverageShapes({ ...newDevice(type, 'x', 100, 100, 1), ...extra }, 40);
  assert.equal(shapes('camera').length, 4);
  assert.ok(shapes('motion')[0].path.startsWith('M 100.0 100.0'));
  close(shapes('speaker')[0].circle.r, speakerRadius('3', '1.2', '90') * 40);
  close(shapes('wifi')[0].circle.r, 12 * 40);
  assert.equal(shapes('door').length, 0);
  assert.equal(shapes('other').length, 0);
  assert.equal(shapes('other', { radius: '2' }).length, 1);
  for (const t of DEVICE_TYPES) assert.equal(typeof coverageText(newDevice(t.type, 'x', 0, 0, 1)), 'string');
  assert.equal(shapes('ptz').length, 4);
  assert.equal(shapes('wallspeaker').length, 1);
  assert.equal(shapes('ceilingpir')[0].circle.r, 6 * 40);
  assert.equal(shapes('smoke').length, 0);
  assert.equal(shapes('rack').length, 0);
  assert.equal(deviceType('nonsense').type, 'other');
});

test('the Add list has every kind of equipment, each in a group, with unique ids', () => {
  assert.ok(DEVICE_TYPES.length >= 40);
  assert.equal(new Set(DEVICE_TYPES.map((t) => t.type)).size, DEVICE_TYPES.length);
  for (const t of DEVICE_TYPES) {
    assert.ok(DEVICE_GROUPS.includes(t.group), t.type);
    assert.ok(t.code && t.colour && t.label, t.type);
  }
  // The first version's ids still mean the same thing.
  for (const id of ['camera', 'motion', 'speaker', 'wifi', 'door', 'reader', 'keypad', 'siren', 'intercom', 'other']) assert.equal(deviceType(id).type, id);
  assert.equal(newDevice('fisheye', 'f', 0, 0, 1).hfov, '179');
  assert.equal(newDevice('beam', 'b', 0, 0, 1).angle, '3');
});

test('sectorPath draws a wedge from the centre or a ring between two radii', () => {
  assert.match(sectorPath(0, 0, 0, 10, 0, 90), /^M 0\.0 0\.0 L /);
  assert.equal((sectorPath(0, 0, 5, 10, 0, 90).match(/A /g) || []).length, 2);
});

test('plans round-trip, old camera plans carry over, bad files are refused', () => {
  const plan = { ...emptyPlan(), name: 'Shed', pxPerMetre: 12, devices: [newDevice('speaker', 'a', 10, 20, 1)] };
  const back = parsePlan(JSON.stringify(plan));
  assert.equal(back.devices[0].type, 'speaker');
  assert.equal(back.devices[0].ceiling, '3');
  const old = cleanPlan({ format: OLD_PLAN_FORMAT, cameras: [{ id: 'c1', name: 'Gate', x: 5, y: 6, focal: '6', resolution: '3840' }] });
  assert.equal(old.format, PLAN_FORMAT);
  assert.equal(old.devices[0].type, 'camera');
  assert.equal(old.devices[0].focal, '6');
  assert.equal(parsePlan('{"format":"other"}'), null);
  assert.equal(parsePlan('not json'), null);
  const sneaky = cleanPlan({ format: PLAN_FORMAT, image: { dataUrl: 'javascript:alert(1)' }, devices: [{ type: 'camera', rotation: -90, fovMode: 'x' }] });
  assert.equal(sneaky.image, null);
  assert.equal(sneaky.devices[0].rotation, 270);
  assert.equal(sneaky.devices[0].fovMode, 'lens');
  assert.equal(cleanPlan({ format: PLAN_FORMAT, image: { src: '/somewhere-else.png' } }).image, null);
});

test('the sample plan uses the shipped picture, a real scale and several kinds of device', () => {
  const sample = samplePlan();
  assert.equal(sample.image.src, SAMPLE_IMAGE.src);
  assert.equal(sample.pxPerMetre, 40);
  assert.ok(new Set(sample.devices.map((d) => d.type)).size >= 6);
  assert.deepEqual(parsePlan(JSON.stringify(sample)).devices.length, sample.devices.length);
});

test('scale: from two points, or 40 m across when not set', () => {
  close(scaleFromPoints({ x: 0, y: 0 }, { x: 300, y: 400 }, '10'), 50);
  assert.equal(scaleFromPoints({ x: 0, y: 0 }, { x: 10, y: 0 }, '0'), 0);
  assert.equal(effectiveScale(emptyPlan()), 40);
  assert.equal(effectiveScale({ ...emptyPlan(), pxPerMetre: 7 }), 7);
});
