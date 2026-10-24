import assert from 'node:assert/strict';
import test from 'node:test';

import { levelAllows, neededFor, sectionLevel } from '../staffAccessRules.js';

test('Administrators may do everything; Limited access users what their section says; anyone else nothing', () => {
  assert.equal(sectionLevel({ staff_role: 'platform_admin', permissions: {} }, 'coupons'), 'write');
  assert.equal(sectionLevel({ staff_role: 'operator', permissions: { coupons: 'read' } }, 'coupons'), 'read');
  assert.equal(sectionLevel({ staff_role: 'operator', permissions: { coupons: 'everything' } }, 'coupons'), 'none');
  assert.equal(sectionLevel({ staff_role: 'operator', permissions: null }, 'coupons'), 'none');
  assert.equal(sectionLevel({ staff_role: 'licensing_approver' }, 'coupons'), 'none');
  assert.equal(sectionLevel(null, 'coupons'), 'none');
});

test('read lets you look; changing needs write', () => {
  assert.equal(neededFor('GET'), 'read');
  assert.equal(neededFor('post'), 'write');
  assert.equal(levelAllows('read', 'read'), true);
  assert.equal(levelAllows('read', 'write'), false);
  assert.equal(levelAllows('write', 'write'), true);
  assert.equal(levelAllows('none', 'read'), false);
});
