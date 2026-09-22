import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cctvStorage, poeBudget, batteryStandby } from '../calculators.js';

test('cctvStorage calculates storage correctly', () => {
  const result = cctvStorage({
    cameras: 10,
    bitrateMbps: 4,
    hoursPerDay: 24,
    activityPercent: 100,
    retentionDays: 30
  });

  assert.ok(Math.abs(result.totalTB - 12.96) < 1e-9);
  assert.ok(Math.abs(result.gbPerCameraPerDay - 43.2) < 1e-9);
});

test('poeBudget calculates PoE budget correctly', () => {
  const result = poeBudget({
    devices: [
      { quantity: 8, watts: 15.4 },
      { quantity: 2, watts: 30 }
    ],
    switchBudgetWatts: 240,
    switchPorts: 8
  });

  assert.ok(Math.abs(result.totalWatts - 183.2) < 1e-9);
  assert.equal(result.portsUsed, 10);
  assert.equal(result.overPorts, true);
  assert.equal(result.overBudget, false);
});

test('batteryStandby calculates battery capacity correctly', () => {
  const result = batteryStandby({
    standbyAmps: 0.5,
    standbyHours: 24,
    alarmAmps: 1.5,
    alarmHours: 0.5
  });

  assert.equal(result.requiredAh, 15.9375);
  assert.equal(result.recommendedAh, 18);
});

test('batteryStandby returns null for requiredAh over 100', () => {
  const result = batteryStandby({
    standbyAmps: 10,
    standbyHours: 24,
    alarmAmps: 10,
    alarmHours: 1
  });

  assert.equal(result.requiredAh, 312.5);
  assert.equal(result.recommendedAh, null);
});

test('calculators treat blank or invalid inputs as zero rather than NaN', () => {
  const r = cctvStorage({ cameras: '', bitrateMbps: 'abc', hoursPerDay: 24, activityPercent: 100, retentionDays: 30 });
  assert.equal(r.totalTB, 0);
  assert.equal(batteryStandby({ standbyAmps: NaN, standbyHours: 24, alarmAmps: 1, alarmHours: 1 }).requiredAh, 1.25);
});
