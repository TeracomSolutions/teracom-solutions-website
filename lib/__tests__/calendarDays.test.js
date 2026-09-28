import test from 'node:test';
import assert from 'node:assert/strict';

import { monthGrid, melbourneDate, melbourneTime } from '../calendarDays.js';

// Test monthGrid function
await test('monthGrid for October 2026', () => {
  const grid = monthGrid(2026, 10);
  
  // Check that first week starts on Monday 2026-09-28 (not inMonth)
  assert.equal(grid[0][0].date, '2026-09-28');
  assert.equal(grid[0][0].inMonth, false);
  
  // Check that last week contains 2026-10-31
  const lastWeek = grid[grid.length - 1];
  assert.ok(lastWeek.some((day) => day.date === '2026-10-31' && day.inMonth));
  assert.equal(lastWeek[6].date, '2026-11-01');
  
  // Check that each week has 7 days
  for (const week of grid) {
    assert.equal(week.length, 7);
  }
});

// Test melbourneDate function
await test('melbourneDate for 2026-10-05T22:30:00Z', () => {
  const result = melbourneDate('2026-10-05T22:30:00Z');
  assert.equal(result, '2026-10-06');
});

// Test melbourneTime function
await test('melbourneTime for 2026-10-05T22:30:00Z', () => {
  const result = melbourneTime('2026-10-05T22:30:00Z');
  assert.equal(result, '9:30 am');
});