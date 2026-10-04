import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cameraBitrate, cameraDataUsage, mountingCoverage } from '../videoCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('cameraBitrate follows the Kush gauge, with 40% off for H.265', () => {
  const quiet = cameraBitrate({ resolution: '4mp', fps: '15', codec: 'h265', activity: 'low' });
  close(quiet.bitrateMbps, 2.322432);
  close(quiet.gbPerDay, 25.0822656);
  const busy = cameraBitrate({ resolution: '2mp', fps: '25', codec: 'h264', activity: 'medium' });
  close(busy.bitrateMbps, 7.2576);
  assert.equal(cameraBitrate({ resolution: '4mp', fps: '', codec: 'h265', activity: 'low' }).bitrateMbps, 0);
});

test('mountingCoverage finds the blind spot and the far edge', () => {
  const r = mountingCoverage({ heightMetres: '3', tiltDegrees: '35', horizontalFovDegrees: '90', aspect: '16:9', targetHeightMetres: '1.7' });
  close(r.verticalFovDegrees, 58.7155070856, 1e-6);
  close(r.ground.nearMetres, 1.44008, 1e-4);
  close(r.ground.farMetres, 30.3658, 1e-3);
  close(r.atTarget.nearMetres, 0.62403, 1e-4);
  close(r.atTarget.farMetres, 13.1585, 1e-3);
  assert.equal(r.seesHorizon, false);
});

test('a shallow tilt reaches the horizon', () => {
  const r = mountingCoverage({ heightMetres: '3', tiltDegrees: '10', horizontalFovDegrees: '90', aspect: '16:9', targetHeightMetres: '1.7' });
  assert.equal(r.ground.farMetres, Infinity);
  assert.equal(r.seesHorizon, true);
});

test('a camera mounted below the target height has no target band', () => {
  const r = mountingCoverage({ heightMetres: '1.5', tiltDegrees: '20', horizontalFovDegrees: '90', aspect: '16:9', targetHeightMetres: '1.7' });
  assert.equal(r.atTarget, null);
});

test('cameraDataUsage adds live viewing, clips and uploads', () => {
  const r = cameraDataUsage({
    liveMinutesPerDay: '10',
    liveMbps: '0.5',
    eventsPerDay: '20',
    clipSeconds: '20',
    clipMbps: '2',
    uploadHoursPerDay: '0',
    uploadMbps: '1',
    overheadPercent: '10',
    daysPerMonth: '30',
  });
  close(r.liveMB, 37.5);
  close(r.clipsMB, 100);
  close(r.uploadMB, 0);
  close(r.perDayMB, 151.25);
  close(r.perMonthGB, 4.5375);
});
