import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  cctvStorage, poeBudget, batteryStandby, voltageDrop, lensCoverage, cctvBandwidth, raidPlanner,
  psuLoad, upsRuntime, speakerLoad, projectorThrow, ipSubnet, prefixToMask,
} from '../calculators.js';

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

const close = (a, b, tol = 1e-9) => Math.abs(a - b) < tol;

test('lensCoverage: 1920 px across a 90 degree view at 10 m is 20 m wide, 96 px/m (observe)', () => {
  const r = lensCoverage({ horizontalPixels: 1920, horizontalFovDegrees: 90, distanceMetres: 10 });
  assert.ok(close(r.sceneWidthMetres, 20));
  assert.ok(close(r.pixelsPerMetre, 96));
  assert.equal(r.level, 'Observe');
  assert.ok(close(r.maxDistances.find((l) => l.id === 'identify').metres, 3.84));
  assert.ok(close(r.maxDistances.find((l) => l.id === 'detect').metres, 38.4));
});

test('lensCoverage: below 25 px/m reports no detail level', () => {
  assert.equal(lensCoverage({ horizontalPixels: 1920, horizontalFovDegrees: 110, distanceMetres: 100 }).level, null);
});

test('cctvBandwidth: 16 x 4 Mbps plus 4 remote 0.5 Mbps streams with 10% overhead', () => {
  const r = cctvBandwidth({ cameras: 16, bitrateMbps: 4, remoteStreams: 4, remoteBitrateMbps: 0.5, overheadPercent: 10 });
  assert.ok(close(r.recordingMbps, 70.4));
  assert.ok(close(r.remoteMbps, 2.2));
  assert.ok(close(r.totalMbps, 72.6));
  assert.ok(close(r.gigabitPercent, 7.26));
});

test('raidPlanner: 30 TB on 8 TB drives at each RAID level', () => {
  const base = { requiredTB: 30, driveTB: 8 };
  assert.deepEqual(raidPlanner({ ...base, raid: 'none' }), { arrayDrives: 4, totalDrives: 4, usableTB: 32, rawTB: 32 });
  assert.deepEqual(raidPlanner({ ...base, raid: 'raid1' }), { arrayDrives: 8, totalDrives: 8, usableTB: 32, rawTB: 64 });
  assert.deepEqual(raidPlanner({ ...base, raid: 'raid5' }), { arrayDrives: 5, totalDrives: 5, usableTB: 32, rawTB: 40 });
  assert.deepEqual(raidPlanner({ ...base, raid: 'raid6', hotSpares: 1 }), { arrayDrives: 6, totalDrives: 7, usableTB: 32, rawTB: 56 });
  assert.deepEqual(raidPlanner({ ...base, raid: 'raid10' }), { arrayDrives: 8, totalDrives: 8, usableTB: 32, rawTB: 64 });
  assert.equal(raidPlanner({ requiredTB: 2, driveTB: 8, raid: 'raid6' }).arrayDrives, 4);
});

test('psuLoad: readers, maglocks and a controller need a 2 A supply with 20% headroom', () => {
  const r = psuLoad({
    devices: [{ quantity: 2, amps: 0.15 }, { quantity: 2, amps: 0.5 }, { quantity: 1, amps: 0.3 }],
    headroomPercent: 20,
  });
  assert.ok(close(r.totalAmps, 1.6));
  assert.ok(close(r.requiredAmps, 1.92));
  assert.equal(r.suggestedAmps, 2);
  assert.equal(psuLoad({ devices: [{ quantity: 10, amps: 1 }] }).suggestedAmps, null);
});

test('upsRuntime: 2 x 12 V 9 Ah at 90% efficiency runs 100 W for about 117 minutes', () => {
  const r = upsRuntime({ loadWatts: 100, batteryVolts: 12, batteryAh: 9, batteryCount: 2 });
  assert.equal(r.batteryWh, 216);
  assert.ok(close(r.runtimeMinutes, 116.64));
  assert.ok(close(r.requiredVA, 138.88888888888889));
  assert.equal(r.suggestedVA, 600);
});

test('speakerLoad: 100 W of taps on a 100 V line needs a 120 W amplifier and presents 100 ohms', () => {
  const speakers = [{ quantity: 10, watts: 6 }, { quantity: 4, watts: 10 }];
  const ok = speakerLoad({ speakers, lineVolts: 100, amplifierWatts: 120, headroomPercent: 20 });
  assert.equal(ok.totalWatts, 100);
  assert.ok(close(ok.minAmplifierWatts, 120));
  assert.equal(ok.lineImpedanceOhms, 100);
  assert.equal(ok.amplifierOk, true);
  assert.equal(speakerLoad({ speakers, lineVolts: 100, amplifierWatts: 100 }).amplifierOk, false);
  assert.equal(speakerLoad({ speakers, lineVolts: 70, amplifierWatts: 120 }).lineImpedanceOhms, 49);
});

test('projectorThrow: throw ratio 1.5 at 4.5 m gives a 3 m wide 16:9 image (~135.5 in)', () => {
  const r = projectorThrow({ throwRatio: 1.5, distanceMetres: 4.5, aspect: '16:9', targetWidthMetres: 2 });
  assert.ok(close(r.widthMetres, 3));
  assert.ok(close(r.heightMetres, 1.6875));
  assert.ok(close(r.diagonalInches, 135.513, 0.01));
  assert.ok(close(r.distanceForTargetMetres, 3));
});

test('ipSubnet: /24 and /30 ranges, and invalid input', () => {
  assert.deepEqual(ipSubnet({ address: '192.168.10.37', prefix: 24 }), {
    valid: true,
    mask: '255.255.255.0',
    network: '192.168.10.0',
    broadcast: '192.168.10.255',
    firstHost: '192.168.10.1',
    lastHost: '192.168.10.254',
    usableHosts: 254,
  });
  const small = ipSubnet({ address: '10.0.0.5', prefix: 30 });
  assert.equal(small.network, '10.0.0.4');
  assert.equal(small.broadcast, '10.0.0.7');
  assert.equal(small.usableHosts, 2);
  assert.equal(ipSubnet({ address: '172.16.200.9', prefix: 20 }).network, '172.16.192.0');
  assert.equal(ipSubnet({ address: '300.1.1.1', prefix: 24 }).valid, false);
  assert.equal(ipSubnet({ address: '10.0.0.1', prefix: 31 }).valid, false);
  assert.equal(prefixToMask(20), '255.255.240.0');
});
