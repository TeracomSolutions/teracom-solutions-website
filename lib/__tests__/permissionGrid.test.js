import assert from 'node:assert/strict';
import test from 'node:test';

import { canSee, partChoice, setPart, setSectionLevel, toggleSection } from '../permissionGrid.js';

const STORE = { key: 'store', children: [{ key: 'store.pricing' }, { key: 'store.freight' }] };

test('ticking a section gives read only; unticking hides it and clears its parts', () => {
  let perms = toggleSection({}, STORE, true);
  assert.equal(perms.store, 'read');
  assert.equal(canSee(perms, 'store'), true);
  perms = setSectionLevel(perms, 'store', 'write');
  perms = setPart(perms, 'store.pricing', 'read');
  assert.equal(toggleSection(perms, STORE, true).store, 'write');
  const off = toggleSection(perms, STORE, false);
  assert.equal(off.store, 'none');
  assert.equal('store.pricing' in off, false);
  assert.equal(canSee(off, 'store'), false);
});

test('a part follows its section until given its own level', () => {
  let perms = { store: 'write' };
  assert.equal(partChoice(perms, 'store.pricing'), 'inherit');
  perms = setPart(perms, 'store.pricing', 'none');
  assert.equal(partChoice(perms, 'store.pricing'), 'none');
  perms = setPart(perms, 'store.pricing', 'inherit');
  assert.equal('store.pricing' in perms, false);
});
