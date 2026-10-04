import { test } from 'node:test';
import assert from 'node:assert/strict';

import { transferTime, wirelessLink } from '../networkCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('wirelessLink works out Fresnel clearance, earth bulge and path loss', () => {
  const r = wirelessLink({ distanceKm: '2', frequencyGHz: '5.8', clearancePercent: '60', txPowerDbm: '20', antennaGainDbi: '23' });
  close(r.fresnelMetres, 5.0853271, 1e-6);
  close(r.clearanceMetres, 3.0511963, 1e-6);
  close(r.earthBulgeMetres, 0.0588605, 1e-6);
  close(r.totalClearanceMetres, 3.1100567, 1e-6);
  close(r.pathLossDb, 113.7391598, 1e-6);
  close(r.receivedDbm, -47.7391598, 1e-6);
});

test('the earth bulges about 1.47 m at the middle of a 10 km link', () => {
  close(wirelessLink({ distanceKm: '10', frequencyGHz: '5.8' }).earthBulgeMetres, 1.4715115, 1e-6);
  assert.equal(wirelessLink({ distanceKm: '', frequencyGHz: '5.8' }).pathLossDb, 0);
});

test('transferTime allows for efficiency', () => {
  const r = transferTime({ size: '2', sizeUnit: 'TB', speed: '1', speedUnit: 'Gbps', efficiencyPercent: '90' });
  close(r.seconds, 17777.7777778, 1e-6);
  close(r.tbPerDay, 9.72);
  const small = transferTime({ size: '500', sizeUnit: 'GB', speed: '100', speedUnit: 'Mbps', efficiencyPercent: '100' });
  close(small.seconds, 40000);
});
