import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ESSENTIAL_EIGHT, essentialEightCheck, levelText } from '../cyberCalculators.js';
import { fireAlarmBattery, intercomPlanner, paCoverage } from '../siteCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('the self-check asks about all eight strategies, each with four answers', () => {
  assert.equal(ESSENTIAL_EIGHT.length, 8);
  for (const s of ESSENTIAL_EIGHT) {
    assert.deepEqual(s.options.map((o) => o.value), ['0', '1', '2', '3']);
    assert.ok(s.fix.length > 20);
  }
});

test('the overall level is the weakest strategy', () => {
  const all = (level) => Object.fromEntries(ESSENTIAL_EIGHT.map((s) => [s.id, String(level)]));
  assert.equal(essentialEightCheck(all(2)).overall, 2);
  assert.equal(essentialEightCheck({ ...all(3), mfa: '1' }).overall, 1);
  const r = essentialEightCheck({ ...all(3), backups: '0', macros: '1' });
  assert.equal(r.overall, 0);
  assert.equal(r.score, 3 * 6 + 1);
  assert.deepEqual(r.priorities.map((p) => p.id), ['backups', 'macros']);
  assert.match(r.priorities[0].fix, /^Back up/);
  assert.match(r.priorities[1].fix, /^Next level: As above/);
  assert.equal(essentialEightCheck(all(3)).priorities.length, 0);
});

test('unanswered or odd answers count as level zero', () => {
  const r = essentialEightCheck({ patchApps: 'x', mfa: '9' });
  assert.equal(r.strategies.find((s) => s.id === 'patchApps').level, 0);
  assert.equal(r.strategies.find((s) => s.id === 'mfa').level, 3);
  assert.equal(r.overall, 0);
  assert.equal(r.priorities.length, 3);
  assert.equal(levelText(1), 'Maturity Level One');
});

test('fireAlarmBattery applies the ageing and derating factors', () => {
  const r = fireAlarmBattery({ quiescentAmps: '0.5', alarmAmps: '2', standbyHours: '24', alarmHours: '0.5', derating: '1.75' });
  close(r.standbyAh, 12);
  close(r.alarmAh, 1.75);
  close(r.requiredAh, 1.25 * 13.75);
  assert.equal(r.suggested, 18);
  assert.equal(fireAlarmBattery({ quiescentAmps: '5', alarmAmps: '5', standbyHours: '24', alarmHours: '1', derating: '1' }).suggested, null);
});

test('paCoverage spaces speakers edge to edge', () => {
  const r = paCoverage({ areaM2: '400', ceilingM: '3.2', earHeightM: '1.2', coverageDegrees: '90', tapWatts: '3', headroomPercent: '20' });
  close(r.throwM, 2);
  close(r.diameter, 4);
  close(r.spacing, 4 / Math.SQRT2);
  assert.equal(r.speakers, 50);
  close(r.loadWatts, 150);
  assert.equal(r.amplifier, 240);
  assert.equal(paCoverage({ areaM2: '100', ceilingM: '1', earHeightM: '1.2', coverageDegrees: '90' }).speakers, 0);
});

test('intercomPlanner adds up stations, power and calls', () => {
  const r = intercomPlanner({ entries: '2', doorWatts: '12', units: '40', monitorsPerUnit: '1', monitorWatts: '6', guardStations: '1', guardWatts: '10', simultaneousCalls: '2', callMbps: '2' });
  assert.equal(r.monitors, 40);
  assert.equal(r.devices, 43);
  close(r.poeWatts, 24 + 240 + 10);
  assert.equal(r.switches24, 2);
  close(r.callMbps, 4);
});
