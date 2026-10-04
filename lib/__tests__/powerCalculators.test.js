import { test } from 'node:test';
import assert from 'node:assert/strict';

import { runningCost, solarCamera } from '../powerCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('solarCamera sizes the battery, panel and controller', () => {
  const r = solarCamera({ loadWatts: '8', hoursPerDay: '24', systemVolts: '12', autonomyDays: '3', batteryType: 'lithium', sunHours: '2.5', lossesPercent: '25' });
  close(r.dailyWh, 192);
  close(r.batteryWh, 720);
  close(r.batteryAh, 60);
  close(r.panelWatts, 102.4);
  close(r.controllerAmps, 10.6666667, 1e-6);
});

test('an AGM battery needs more capacity than lithium', () => {
  const agm = solarCamera({ loadWatts: '8', hoursPerDay: '24', systemVolts: '12', autonomyDays: '3', batteryType: 'agm', sunHours: '2.5', lossesPercent: '25' });
  close(agm.batteryWh, 1152);
  assert.equal(solarCamera({ loadWatts: '8', sunHours: '' }).panelWatts, 0);
});

test('runningCost adds every line for a day and a year', () => {
  const r = runningCost({
    devices: [
      { name: 'NVR', watts: '40', quantity: '1', hoursPerDay: '24' },
      { name: 'Cameras', watts: '6', quantity: '8', hoursPerDay: '24' },
      { name: 'PoE switch', watts: '25', quantity: '1', hoursPerDay: '24' },
    ],
    centsPerKwh: '30',
  });
  close(r.watts, 113);
  close(r.kwhPerDay, 2.712);
  close(r.kwhPerYear, 989.88);
  close(r.dollarsPerYear, 296.964);
  close(r.dollarsPerQuarter, 74.241);
});
