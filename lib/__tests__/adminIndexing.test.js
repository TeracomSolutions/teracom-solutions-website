import test from 'node:test';
import assert from 'node:assert/strict';

import { isAdminPath } from '../adminIndexing.js';

// Test cases for isAdminPath function
const testCases = [
  // Admin paths that should return true
  { path: '/admin', expected: true },
  { path: '/admin/', expected: true },
  { path: '/admin/users', expected: true },
  { path: '/admin/settings', expected: true },
  { path: '/api/admin', expected: true },
  { path: '/api/admin/', expected: true },
  { path: '/api/admin/users', expected: true },
  { path: '/api/admin/settings', expected: true },
  
  // Non-admin paths that should return false
  { path: '/', expected: false },
  { path: '/about', expected: false },
  { path: '/adminstration-services', expected: false }, // Near miss - should not match
  { path: '/administration', expected: false }, // Near miss - should not match
  { path: '/store', expected: false },
  { path: '/account', expected: false },
  { path: '/cart', expected: false },
  { path: '/checkout', expected: false },
];

await test('isAdminPath function works correctly', async () => {
  for (const testCase of testCases) {
    const result = isAdminPath(testCase.path);
    assert.strictEqual(result, testCase.expected, 
      `isAdminPath('${testCase.path}') should return ${testCase.expected}`
    );
  }
});