import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cctvStorage, poeBudget, batteryStandby, voltageDrop } from '../calculators.js';

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

test('voltageDrop: 12 V, 1 A over 50 m of 0.5 mm2 drops 3.44 V and needs 1.5 mm2 for 10%', () => {
  const r = voltageDrop({ supplyVolts: 12, currentAmps: 1, lengthMetres: 50, conductorMm2: 0.5 });
  assert.ok(Math.abs(r.resistanceOhms - 3.44) < 1e-9);
  assert.ok(Math.abs(r.dropVolts - 3.44) < 1e-9);
  assert.ok(Math.abs(r.dropPercent - 28.666666666666668) < 1e-9);
  assert.ok(Math.abs(r.loadVolts - 8.56) < 1e-9);
  assert.equal(r.withinLimit, false);
  assert.ok(Math.abs(r.minConductorMm2 - 1.4333333333333333) < 1e-9);
  assert.equal(r.suggestedMm2, 1.5);
});

test('voltageDrop: 24 V, 0.5 A over 30 m of 1.0 mm2 is within a 10% limit', () => {
  const r = voltageDrop({ supplyVolts: 24, currentAmps: 0.5, lengthMetres: 30, conductorMm2: 1 });
  assert.ok(Math.abs(r.dropVolts - 0.516) < 1e-9);
  assert.ok(Math.abs(r.dropPercent - 2.15) < 1e-9);
  assert.equal(r.withinLimit, true);
});

test('voltageDrop: blank inputs give zeros, and runs too long for 6 mm2 suggest nothing', () => {
  const blank = voltageDrop({ supplyVolts: '', currentAmps: '', lengthMetres: '', conductorMm2: '' });
  assert.equal(blank.dropVolts, 0);
  assert.equal(blank.withinLimit, false);
  const long = voltageDrop({ supplyVolts: 12, currentAmps: 5, lengthMetres: 500, conductorMm2: 1 });
  assert.equal(long.suggestedMm2, null);
});

