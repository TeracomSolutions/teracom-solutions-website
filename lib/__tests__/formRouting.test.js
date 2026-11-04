import { test } from 'node:test';
import assert from 'node:assert/strict';

import { ALL_FORMS, blankDestination, describeDestination, destinationsFor, folderExample, kindsFor } from '../formRouting.js';

test('a form uses its own list, or the list for all forms', () => {
  const routes = { [ALL_FORMS]: [{ kind: 'email', to: 'r@example.com' }], 'monitoring-247': [] };
  assert.deepEqual(destinationsFor(routes, 'monitoring-commissioning'), routes[ALL_FORMS]);
  assert.deepEqual(destinationsFor(routes, 'monitoring-247'), []);
  assert.deepEqual(destinationsFor(null, 'x'), []);
});

test('places read as plain words', () => {
  assert.equal(describeDestination({ kind: 'email', to: 'r@example.com' }), 'Email r@example.com');
  assert.equal(describeDestination({ kind: 'network_folder', path: '{form}/{year}' }, '\\\\10.0.0.12\\Robert Urpis\\Forms'),
    'Network folder: \\\\10.0.0.12\\Robert Urpis\\Forms\\{form}\\{year}');
  assert.match(describeDestination({ kind: 'global_monitoring' }), /Global Platform/);
});

test('only the 24/7 sign-up may go to the Global Platform', () => {
  assert.deepEqual(kindsFor('monitoring-commissioning', 'monitoring-247'), ['email', 'network_folder']);
  assert.deepEqual(kindsFor('monitoring-247', 'monitoring-247'), ['email', 'network_folder', 'global_monitoring']);
  assert.deepEqual(blankDestination('network_folder'), { kind: 'network_folder', path: '{form}/{year}' });
});

test('the folder example fills in the form and the date', () => {
  assert.equal(folderExample('{form}/{year}', 'Monitoring commissioning form', new Date(2026, 10, 5)), 'Monitoring commissioning form\\2026');
  assert.equal(folderExample('Monitoring//{month}', 'X', new Date(2026, 0, 9)), 'Monitoring\\2026-01');
});
