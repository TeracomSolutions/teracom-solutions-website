import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEVICE_TYPES, cleanPlan, samplePlan } from '../model.js';
import { CABLE_RULES, CABLE_TYPES, SYSTEMS, cableFor, cableSchedules, headEndFor, routeMetres, runLength, schedulesCsv } from '../cables.js';

const dev = (id, type, x, y, extra = {}) => ({ id, type, name: id, x, y, rotation: 0, ...extra });
const plan = (devices, pxPerMetre = 10) => ({ format: 'teracom-site-plan', devices, pxPerMetre });

test('every cable rule names a real device type and cable', () => {
  const types = new Set(DEVICE_TYPES.map((t) => t.type));
  for (const [type, rule] of Object.entries(CABLE_RULES)) {
    assert.ok(types.has(type), type);
    assert.ok(CABLE_TYPES.some((c) => c.id === rule.cable), type);
    for (const to of rule.to) assert.ok(types.has(to), `${type} -> ${to}`);
  }
  assert.ok(SYSTEMS.length >= 7);
});

test('run length follows the walls, adds the drops and 10% spare', () => {
  assert.equal(routeMetres({ x: 0, y: 0 }, { x: 30, y: 40 }, 10), 7);
  assert.equal(runLength(7), 13); // (7 + 4) x 1.1 = 12.1, rounded up
  assert.equal(runLength(7, 5), 18);
  assert.equal(routeMetres({ x: 0, y: 0 }, { x: 30, y: 40 }, 0), 0);
});

test('a device goes to the nearest head end of the first kind on the plan', () => {
  const devices = [dev('cam', 'camera', 0, 0), dev('sw', 'switch', 10, 0), dev('nvr1', 'nvr', 500, 0), dev('nvr2', 'nvr', 200, 0)];
  assert.equal(headEndFor(devices[0], devices).id, 'nvr2');
  assert.equal(headEndFor(devices[0], devices.filter((d) => !d.id.startsWith('nvr'))).id, 'sw');
  assert.equal(headEndFor({ ...devices[0], cableTo: 'nvr1' }, devices).id, 'nvr1');
  assert.equal(headEndFor({ ...devices[0], cableTo: 'gone' }, devices).id, 'nvr2');
  assert.equal(headEndFor(dev('pp', 'powerpoint', 0, 0), devices), null);
});

test('a device can change its cable or have none', () => {
  assert.equal(cableFor(dev('a', 'camera', 0, 0)), 'cat6');
  assert.equal(cableFor(dev('a', 'camera', 0, 0, { cable: 'cat6ext' })), 'cat6ext');
  assert.equal(cableFor(dev('a', 'camera', 0, 0, { cable: 'none' })), '');
  assert.equal(cableFor(dev('a', 'rack', 0, 0)), '');
});

test('one schedule per system, numbered, with totals and boxes', () => {
  const schedules = cableSchedules(plan([
    dev('Cam 1', 'camera', 0, 0),
    dev('Cam 2', 'camera', 0, 100, { cableRuns: '2', cableExtra: '3' }),
    dev('NVR', 'nvr', 100, 0),
    dev('PIR', 'motion', 0, 0),
    dev('Reader', 'reader', 0, 0),
  ]));
  assert.deepEqual(schedules.map((s) => s.label), ['CCTV', 'Alarm', 'Access control']);
  const cctv = schedules[0];
  // The recorder has its own run, to a switch that is not on the plan yet.
  assert.deepEqual(cctv.rows.map((r) => r.id), ['CC-01', 'CC-02', 'CC-03']);
  assert.deepEqual(cctv.rows.map((r) => [r.to, r.each, r.runs, r.total]), [['NVR', 16, 1, 16], ['NVR', 30, 2, 60], ['', 0, 1, 0]]);
  assert.deepEqual(cctv.totals, [{ cable: 'cat6', label: 'Cat6 U/UTP', runs: 3, metres: 76, box: 305, boxes: 1 }]);
  // The NVR runs to a switch, which is not on the plan.
  assert.equal(cableSchedules(plan([dev('NVR', 'nvr', 0, 0)]))[0].rows[0].note, 'Add a network switch to the plan, or choose where it runs to');
  assert.equal(schedules[1].rows[0].to, '');
  assert.equal(schedules[1].rows[0].each, 0);
});

test('no scale, no lengths', () => {
  const [cctv] = cableSchedules(plan([dev('Cam', 'camera', 0, 0), dev('NVR', 'nvr', 100, 0)], 0));
  assert.equal(cctv.rows[0].to, 'NVR');
  assert.equal(cctv.rows[0].each, 0);
});

test('the CSV is safe for a spreadsheet', () => {
  const csv = schedulesCsv(cableSchedules(plan([dev('=SUM(A1)', 'camera', 0, 0), dev('NVR, main', 'nvr', 100, 0)])));
  const lines = csv.trim().split('\r\n');
  assert.equal(lines[0], 'Cable,System,From,To,Cable type,Runs,Length each (m),Total (m),Note');
  assert.ok(lines[1].startsWith("CC-01,CCTV,'=SUM(A1),\"NVR, main\",Cat6 U/UTP,1,"));
});

test('cable choices survive saving and opening the plan, and the sample has every schedule', () => {
  const raw = plan([dev('c', 'camera', 1, 2, { cable: 'cat6ext', cableTo: 'n', cableRuns: '2', cableExtra: '5' }), dev('n', 'nvr', 5, 5)]);
  const cleaned = cleanPlan({ ...raw, name: 'x' });
  assert.deepEqual(
    [cleaned.devices[0].cable, cleaned.devices[0].cableTo, cleaned.devices[0].cableRuns, cleaned.devices[0].cableExtra],
    ['cat6ext', 'n', '2', '5'],
  );
  assert.equal(cleaned.devices[1].cable, undefined);
  const labels = cableSchedules(samplePlan()).map((s) => s.label);
  for (const label of ['CCTV', 'Alarm', 'Access control', 'Intercom', 'Network', 'Audio and display']) assert.ok(labels.includes(label), label);
  for (const s of cableSchedules(samplePlan())) for (const r of s.rows) assert.ok(r.to, `${r.from} has a head end`);
});
