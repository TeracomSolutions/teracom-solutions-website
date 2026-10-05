import test from 'node:test';
import assert from 'node:assert/strict';

import { pcPowerSupply, rackSizeHeat, recordingServer, virtualServer } from '../itCalculators.js';

test('PC power supply: parts add up and the next size up is picked', () => {
  const r = pcPowerSupply({ cpuWatts: '125', cpus: '1', gpuWatts: '0', gpus: '1', hdds: '2', ssds: '1', ramSticks: '2', fans: '3', boardWatts: '50', headroomPercent: '30' });
  // 125 + 16 + 4 + 8 + 9 + 50 = 212 W; x 1.3 = 275.6 W.
  assert.equal(r.loadWatts, 212);
  assert.ok(Math.abs(r.neededWatts - 275.6) < 0.01);
  assert.equal(r.psuWatts, 450);
  // 600 + 450 + 8 + 9 + 50 = 1,117 W; x 1.3 = 1,452 W.
  const big = pcPowerSupply({ cpuWatts: '300', cpus: '2', gpuWatts: '450', gpus: '1', hdds: '0', ssds: '0', headroomPercent: '30' });
  assert.equal(big.psuWatts, 1600);
  const huge = pcPowerSupply({ cpuWatts: '500', cpus: '4', gpuWatts: '600', gpus: '4' });
  assert.equal(huge.psuWatts, null);
});

test('recording server: traffic, storage and drives', () => {
  const r = recordingServer({ cameras: '32', bitrateMbps: '4', hoursPerDay: '24', days: '30', driveTb: '8', raid: 'raid5' });
  assert.equal(r.totalMbps, 128);
  assert.equal(r.network, '1 GbE');
  assert.equal(r.writeMBps, 16);
  // 128 Mbps x 86,400 s x 30 days / 8 / 1e6 = 41.47 TB, + 10% = 45.6 TB.
  assert.ok(Math.abs(r.storageTb - 45.619) < 0.01);
  assert.equal(r.drives, 7); // 6 data drives + 1 parity
  assert.equal(r.ramGb, 16); // 8 + 2 = 10, fitted as 16
  assert.equal(recordingServer({ cameras: '200', bitrateMbps: '6', days: '30', driveTb: '16', raid: 'raid6' }).network, '10 GbE');
  assert.equal(recordingServer({ cameras: '1', bitrateMbps: '1', days: '1', driveTb: '8', raid: 'raid10' }).drives, 4);
  assert.equal(recordingServer({ cameras: '4', bitrateMbps: '4', days: '30', driveTb: '0' }).drives, 0);
});

test('virtual server: cores, memory and storage with room to grow', () => {
  const r = virtualServer({ vms: '8', vcpusPerVm: '2', ramPerVmGb: '8', storagePerVmGb: '100', vcpuRatio: '4', hostRamGb: '8', headroomPercent: '20' });
  assert.equal(r.vcpus, 16);
  assert.equal(r.cores, 5); // 16 x 1.2 / 4 = 4.8
  assert.ok(Math.abs(r.ramGb - 86.4) < 0.01); // (64 + 8) x 1.2
  assert.equal(r.ramFitted, 96);
  assert.ok(Math.abs(r.storageTb - 0.96) < 0.001);
});

test('rack size, power and heat', () => {
  const r = rackSizeHeat({ equipmentU: '14', equipmentWatts: '1500', sparePercent: '25', volts: '230' });
  assert.equal(r.neededU, 18); // 17.5 rounded up
  assert.equal(r.rackU, 18);
  assert.equal(r.kw, 1.5);
  assert.ok(Math.abs(r.amps - 6.52) < 0.01);
  assert.ok(Math.abs(r.btuPerHour - 5118) < 1);
  assert.equal(rackSizeHeat({ equipmentU: '50', equipmentWatts: '0' }).rackU, null);
});
