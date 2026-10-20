import test from 'node:test';
import assert from 'node:assert/strict';

import { levelLabel, presetFor, applyPreset, summarisePermissions, areaVisible } from '../permissionsView.js';

const SECTIONS = [{ key: 'orders', label: 'Orders' }, { key: 'sales', label: 'Sales' }, { key: 'store', label: 'Store' }];
const PRESETS = [{ key: 'viewer', permissions: { orders: 'read', sales: 'read', store: 'read' } }, { key: 'none', permissions: { orders: 'none', sales: 'none', store: 'none' } }];

test('levelLabel', () => {
  assert.equal(levelLabel('none'), 'No access');
  assert.equal(levelLabel('read'), 'Read only');
  assert.equal(levelLabel('write'), 'Read and write');
  assert.equal(levelLabel('x'), 'x');
});

test('presetFor matches, missing as none, custom, no presets', () => {
  assert.equal(presetFor({ orders: 'read', sales: 'read', store: 'read' }, PRESETS), 'viewer');
  assert.equal(presetFor({}, PRESETS), 'none');
  assert.equal(presetFor({ orders: 'write' }, PRESETS), 'custom');
  assert.equal(presetFor({}, undefined), 'custom');
});

test('applyPreset returns a copy or empty object', () => {
  const copy = applyPreset(PRESETS[0]);
  assert.deepEqual(copy, PRESETS[0].permissions);
  assert.notEqual(copy, PRESETS[0].permissions);
  assert.deepEqual(applyPreset(undefined), {});
});

test('summarisePermissions mixed levels', () => {
  const result = summarisePermissions({ orders: 'write', sales: 'read', store: 'read' }, SECTIONS);
  assert.deepEqual(result, ['Read and write: Orders', 'Read only: Sales, Store']);
});

test('summarisePermissions single and empty', () => {
  assert.deepEqual(summarisePermissions({ sales: 'read' }, SECTIONS), ['Read only: Sales']);
  assert.deepEqual(summarisePermissions({}, SECTIONS), ['No access to anything yet.']);
});

test('areaVisible administrator when permissions missing', () => {
  assert.equal(areaVisible('/admin/orders', undefined), true);
  assert.equal(areaVisible('/admin/sales', null), true);
});

test('areaVisible sales, none, suppliers', () => {
  assert.equal(areaVisible('/admin/sales', { orders: 'read' }), true);
  assert.equal(areaVisible('/admin/sales', { sales: 'none', orders: 'none', purchase_orders: 'none' }), false);
  assert.equal(areaVisible('/admin/suppliers', { store: 'write' }), true);
  assert.equal(areaVisible('/admin/suppliers', {}), false);
});

test('areaVisible unmapped and activity', () => {
  assert.equal(areaVisible('/admin/account', {}), true);
  assert.equal(areaVisible('/admin/something-new', {}), true);
  assert.equal(areaVisible('/admin/activity', { audit_log: 'read' }), true);
});
