import test from 'node:test';
import assert from 'node:assert/strict';

import { isOpenNow, melbourneTime } from '../teraHours.js';

const HOURS = { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '16:30' };

test('times are read in Melbourne', () => {
  // 2026-10-05 is a Monday; Melbourne is UTC+11 in October (daylight saving).
  assert.deepEqual(melbourneTime(new Date('2026-10-05T00:30:00Z')), { day: 'Monday', minutes: 11 * 60 + 30 });
});

test('open on weekdays from 9am to 4:30pm only', () => {
  assert.equal(isOpenNow(new Date('2026-10-05T00:30:00Z'), HOURS), true); // Mon 11:30am
  assert.equal(isOpenNow(new Date('2026-10-04T22:00:00Z'), HOURS), true); // Mon 9:00am
  assert.equal(isOpenNow(new Date('2026-10-05T05:30:00Z'), HOURS), false); // Mon 4:30pm
  assert.equal(isOpenNow(new Date('2026-10-04T21:59:00Z'), HOURS), false); // Mon 8:59am
  assert.equal(isOpenNow(new Date('2026-10-04T00:30:00Z'), HOURS), false); // Sun 11:30am
});
