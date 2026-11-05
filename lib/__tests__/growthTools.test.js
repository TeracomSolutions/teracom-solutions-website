import test from 'node:test';
import assert from 'node:assert/strict';

import { ITEM_KINDS, growthGroups, growthStatus, itemPublicPath } from '../growthTools.js';

test('tools are grouped in the order they come, numbered within each group', () => {
  const groups = growthGroups([
    { key: 'b', number: 2, group: 'Local' },
    { key: 'f', number: 6, group: 'Found faster' },
    { key: 'a', number: 1, group: 'Local' },
  ]);
  assert.deepEqual(groups.map((g) => g.label), ['Local: Maps, reviews and your area', 'Getting found faster']);
  assert.deepEqual(groups[0].tools.map((t) => t.key), ['a', 'b']);
});

test('what each card says about its state', () => {
  assert.equal(growthStatus({ enabled: false }).label, 'Off');
  assert.equal(growthStatus({ enabled: true, running: true }).label, 'Running');
  assert.equal(growthStatus({ enabled: true, error: 'x' }).label, 'Last run failed');
  assert.equal(growthStatus({ enabled: true, can_run: true }).label, 'On, not run yet');
  assert.equal(growthStatus({ enabled: true, can_run: true, last_at: 't', hours: 168 }).label, 'On, runs every week');
  assert.equal(growthStatus({ enabled: true, can_run: true, last_at: 't', hours: 24 }).label, 'On, runs every day');
  assert.equal(growthStatus({ enabled: true, can_run: false }).label, 'On');
});

test('where a published page lives on the website', () => {
  assert.equal(itemPublicPath('service_areas', { slug: 'frankston' }), '/areas/frankston');
  assert.equal(itemPublicPath('questions', { slug: 'how-many-cameras' }), '/questions#how-many-cameras');
  assert.equal(itemPublicPath('newsletter', { slug: 'x' }), null);
  assert.equal(itemPublicPath('projects', {}), null);
  assert.ok(ITEM_KINDS.projects.photos && !ITEM_KINDS.questions.photos);
});
