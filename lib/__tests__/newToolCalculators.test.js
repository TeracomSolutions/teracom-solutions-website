import { test } from 'node:test';
import assert from 'node:assert/strict';

import { aiAutomationSavings, aiModelPicker, aiTokenCost } from '../aiCalculators.js';
import { accessControlPlanner, backupStorage, downtimeCost, falseAlarmCost, wifiAccessPoints } from '../siteCalculators.js';

const close = (actual, expected, tolerance = 1e-6) =>
  assert.ok(Math.abs(actual - expected) < tolerance, `${actual} is not close to ${expected}`);

test('aiModelPicker sizes the model to the job', () => {
  assert.equal(aiModelPicker({ task: 'extraction', quality: 'good', volume: 'high', data: 'business', speed: 'instant', length: 'short' }).tierId, 'small');
  assert.equal(aiModelPicker({ task: 'chat', quality: 'high', volume: 'medium', data: 'business', speed: 'instant', length: 'short' }).tierId, 'balanced');
  assert.equal(aiModelPicker({ task: 'agents', quality: 'critical', volume: 'low', data: 'business', speed: 'relaxed', length: 'long' }).tierId, 'frontier');
});

test('aiModelPicker keeps on-site data on your own server', () => {
  const r = aiModelPicker({ task: 'documents', quality: 'high', volume: 'low', data: 'onsite', speed: 'relaxed', length: 'long' });
  assert.match(r.where, /own server/);
  assert.match(r.tier.examples, /open-weight/);
  assert.ok(r.tips.some((t) => /context window/.test(t)));
});

test('aiModelPicker falls back to the first option for unknown answers', () => {
  const r = aiModelPicker({});
  assert.ok(['small', 'balanced', 'frontier'].includes(r.tierId));
});

test('aiTokenCost multiplies requests by tokens and price', () => {
  const r = aiTokenCost({ requestsPerDay: '100', daysPerMonth: '20', inputTokens: '1000', outputTokens: '500', inputPricePerMillion: '3', outputPricePerMillion: '15', cachedPercent: '0', audPerUsd: '1.5' });
  assert.equal(r.requests, 2000);
  close(r.usd, 2000 * 1000 * 3 / 1e6 + 2000 * 500 * 15 / 1e6); // 6 + 15
  close(r.aud, 31.5);
  close(r.audPerRequest, 31.5 / 2000);
});

test('aiTokenCost bills cached input at a tenth', () => {
  const r = aiTokenCost({ requestsPerDay: '1000', daysPerMonth: '1', inputTokens: '1000', outputTokens: '0', inputPricePerMillion: '10', outputPricePerMillion: '0', cachedPercent: '50', audPerUsd: '1' });
  close(r.usd, 5 + 0.5);
});

test('aiAutomationSavings works out the payback', () => {
  const r = aiAutomationSavings({ tasksPerMonth: '400', minutesBefore: '12', minutesAfter: '3', hourlyCost: '50', monthlyRunningCost: '200', setupCost: '2800' });
  close(r.hoursSaved, 60);
  close(r.gross, 3000);
  close(r.net, 2800);
  close(r.paybackMonths, 1);
  close(r.firstYear, 2800 * 12 - 2800);
});

test('aiAutomationSavings never pays back when it costs more than it saves', () => {
  const r = aiAutomationSavings({ tasksPerMonth: '10', minutesBefore: '5', minutesAfter: '4', hourlyCost: '50', monthlyRunningCost: '200', setupCost: '100' });
  assert.ok(r.net < 0);
  assert.equal(r.paybackMonths, Infinity);
});

test('wifiAccessPoints takes the larger of coverage and capacity', () => {
  const r = wifiAccessPoints({ areaM2: '800', building: 'office', devices: '120', usage: 'heavy', poeWatts: '25.5' });
  assert.equal(r.byCoverage, 6);
  assert.equal(r.byCapacity, 5);
  assert.equal(r.recommended, 6);
  assert.equal(r.limitedBy, 'coverage');
  close(r.poeTotal, 153);
});

test('accessControlPlanner counts readers, buttons and controllers', () => {
  const buttons = accessControlPlanner({ doors: '5', exit: 'button', doorsPerController: '2', users: '50', sparePercent: '20', lockAmps: '0.5', readerAmps: '0.1', controllerAmps: '0.3' });
  assert.equal(buttons.readers, 5);
  assert.equal(buttons.exitButtons, 5);
  assert.equal(buttons.controllers, 3);
  assert.equal(buttons.credentials, 60);
  close(buttons.loadAmps, 2.5 + 0.5 + 0.9);
  const both = accessControlPlanner({ doors: '5', exit: 'reader', doorsPerController: '4', users: '0' });
  assert.equal(both.readers, 10);
  assert.equal(both.exitButtons, 0);
  assert.equal(both.controllers, 2);
});

test('falseAlarmCost adds charges, staff time and losses', () => {
  const r = falseAlarmCost({ alarmsPerYear: '6', chargePerAlarm: '100', freeAlarms: '2', staffHours: '2', hourlyCost: '50', lostPerAlarm: '10' });
  assert.equal(r.charged, 4);
  close(r.charges, 400);
  close(r.staff, 600);
  close(r.lost, 60);
  close(r.year, 1060);
  close(r.threeYears, 3180);
});

test('downtimeCost adds lost staff time and revenue', () => {
  const r = downtimeCost({ staff: '10', hourlyCost: '50', productivityLostPercent: '100', revenuePerHour: '1000', revenueLostPercent: '50', hoursPerIncident: '2', incidentsPerYear: '3', recoveryCost: '100' });
  close(r.perHour, 500 + 500);
  close(r.perIncident, 2100);
  close(r.year, 6300);
});

test('backupStorage keeps every weekly and monthly point as a full copy', () => {
  const r = backupStorage({ dataGb: '1000', changePercent: '2', dailyKept: '10', weeklyKept: '4', monthlyKept: '6', reductionRatio: '2', copies: '2', growthPercent: '0' });
  assert.equal(r.fulls, 11);
  close(r.fullGb, 500);
  close(r.incrementalGb, 10);
  close(r.perCopyGb, 11 * 500 + 10 * 10);
  close(r.totalGb, 2 * 5600);
  assert.equal(r.meets321, true);
  assert.equal(backupStorage({ dataGb: '100', copies: '1' }).meets321, false);
});
