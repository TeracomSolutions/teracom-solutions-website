import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SAMPLE_CATALOGUE, USE_LIVE_CATALOGUE, cleanCatalogue, findPack, groupCatalogue, splitIncludes } from '../departmentCatalogue.js';
import { DEPARTMENTS } from '../platformMessaging.js';

const feed = {
  count: 6,
  prices: null,
  packs: [
    {
      slug: 'it', name: 'IT', description: 'Systems.', kind: 'department', group: 'IT', tiers: ['starter', 'enterprise'], version: '2.11', workers: 2,
      worker_details: [{ name: 'Patch Planner', role: 'plans patching.' }], includes: ['Open tickets: What is waiting?', 'Dashboard: IT head view', 'Report: Uptime'],
      how_it_works: 'each worker advises.', connects_to: ['Cyber Protection'], price: 99, monthly_price_cents: 9900,
    },
    { slug: 'cyber-protection', name: 'Cyber Protection', kind: 'extension', group: 'IT', department: 'it', department_name: 'IT', workers: 8, connects_to: ['IT'] },
    { slug: 'electronic-security-extension', name: 'Electronic Security Extension', kind: 'industry_extension', group: 'Industry Extensions', department: null },
    { slug: 'defence', name: 'Defence', kind: 'department', group: 'Defence' },
    { slug: 'it', name: 'IT again', kind: 'department' },
    { name: 'No kind' },
    'junk',
  ],
};

test('the catalogue keeps the agreed fields, the detail, and never a price', () => {
  const entries = cleanCatalogue(feed);
  assert.deepEqual(entries.map((e) => `${e.kind}:${e.slug}`), ['department:it', 'extension:cyber-protection', 'industry_extension:electronic-security-extension']);
  const it = entries[0];
  assert.deepEqual(it.tiers, ['Starter', 'Enterprise']);
  assert.deepEqual(it.workerDetails, [{ name: 'Patch Planner', role: 'Plans patching.' }]);
  assert.equal(it.howItWorks, 'Each worker advises.');
  assert.deepEqual(it.connectsTo, ['Cyber Protection']);
  assert.ok(!JSON.stringify(entries).includes('99'));
  assert.deepEqual(cleanCatalogue(null), []);
  assert.equal(findPack(entries, 'cyber-protection').name, 'Cyber Protection');
});

test('packs are grouped by Global’s group: under their Department, or under their own heading', () => {
  const { departments, sections } = groupCatalogue(cleanCatalogue(feed));
  assert.deepEqual(departments[0].extensions.map((e) => e.slug), ['cyber-protection']);
  assert.deepEqual(sections, [{ title: 'Industry Extensions', packs: [cleanCatalogue(feed)[2]] }]);
});

test('a pack’s includes split into screens, dashboards and reports', () => {
  assert.deepEqual(splitIncludes(['Open tickets: What is waiting?', 'Dashboard: IT head view', 'Report: Uptime', 'Plain line']), {
    widgets: [{ name: 'Open tickets', question: 'What is waiting?' }], dashboards: ['IT head view'], reports: ['Uptime'], other: ['Plain line'],
  });
});

test('the bundled copy is today’s Departments, and the live catalogue is on', () => {
  assert.equal(SAMPLE_CATALOGUE.length, DEPARTMENTS.length);
  assert.ok(SAMPLE_CATALOGUE.every((e) => e.kind === 'department' && e.description && e.workers.length));
  assert.equal(USE_LIVE_CATALOGUE, true);
});
