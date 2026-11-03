import { test } from 'node:test';
import assert from 'node:assert/strict';

import { SAMPLE_CATALOGUE, USE_LIVE_CATALOGUE, cleanCatalogue, groupCatalogue } from '../departmentCatalogue.js';
import { DEPARTMENTS } from '../platformMessaging.js';

const live = {
  items: [
    { slug: 'finance', name: 'Finance', description: 'Bills and cash.', kind: 'department', tiers: ['Standard', 'Enterprise'], version: '1.2.0', workers: ['Accounts Payable'], price: 99, monthly_price_cents: 9900 },
    { slug: 'xero-sync', name: 'Xero sync', description: 'Reads Xero.', kind: 'extension', department: 'finance', tiers: ['Enterprise'], version: '0.3', workers: 0 },
    { slug: 'orphan', name: 'Orphan pack', kind: 'extension', department: 'nowhere' },
    { slug: 'defence', name: 'Defence', kind: 'department' },
    { slug: 'finance', name: 'Finance again', kind: 'department' },
    { name: 'No kind' },
    'junk',
  ],
};

test('the catalogue keeps the agreed fields and never a price', () => {
  const entries = cleanCatalogue(live);
  assert.deepEqual(entries.map((e) => `${e.kind}:${e.slug}`), ['department:finance', 'extension:xero-sync', 'extension:orphan']);
  assert.deepEqual(Object.keys(entries[0]).sort(), ['department', 'departmentName', 'description', 'kind', 'name', 'slug', 'tiers', 'version', 'workers']);
  assert.deepEqual(entries[0].tiers, ['Standard', 'Enterprise']);
  assert.equal(cleanCatalogue({ packs: live.items, count: 7, prices: null }).length, 3);
  assert.ok(!JSON.stringify(entries).includes('99'));
  assert.deepEqual(cleanCatalogue(live.items).length, 3);
  assert.deepEqual(cleanCatalogue(null), []);
});

test('extensions sit under their Department; unknown ones are listed after', () => {
  const { departments, loose } = groupCatalogue(cleanCatalogue(live));
  assert.equal(departments[0].extensions[0].name, 'Xero sync');
  assert.deepEqual(loose.map((e) => e.slug), ['orphan']);
});

test('Global spells a Department reference its own way: its name still finds it', () => {
  const { departments, loose } = groupCatalogue(cleanCatalogue({ packs: [
    { slug: 'work-health-and-safety', name: 'Work Health and Safety', kind: 'department', tiers: ['starter'] },
    { slug: 'site-induction', name: 'Site induction', kind: 'extension', department: 'whs', department_name: 'Work Health and Safety', tiers: ['platinum'] },
  ] }));
  assert.equal(departments[0].extensions[0].slug, 'site-induction');
  assert.equal(loose.length, 0);
  assert.deepEqual(departments[0].tiers, ['Starter']);
});

test('the bundled copy is today’s Departments, and the live catalogue is on', () => {
  assert.equal(SAMPLE_CATALOGUE.length, DEPARTMENTS.length);
  assert.ok(SAMPLE_CATALOGUE.every((e) => e.kind === 'department' && e.description && e.workers.length));
  assert.equal(USE_LIVE_CATALOGUE, true);
});
