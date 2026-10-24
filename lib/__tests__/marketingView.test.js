import assert from 'node:assert/strict';
import test from 'node:test';

import { WEEKDAYS, campaignPayload, campaignStateText, campaignStateTone, emptyCampaign, hourLabel } from '../marketingView.js';

test('campaign states read plainly with colours', () => {
  assert.equal(campaignStateText('live'), 'Live now');
  assert.equal(campaignStateText('scheduled'), 'Starts later');
  assert.equal(campaignStateTone('live'), 'good');
  assert.equal(campaignStateTone('scheduled'), 'warn');
  assert.equal(campaignStateTone('ended'), 'muted');
  assert.equal(WEEKDAYS[0], 'Monday');
  assert.equal(hourLabel(9), '9 am');
  assert.equal(hourLabel(0), '12 am');
  assert.equal(hourLabel(15), '3 pm');
});

test('the form starts as a draft from today and blanks are sent as null', () => {
  const form = emptyCampaign(new Date(2026, 9, 25, 10, 0));
  assert.equal(form.status, 'draft');
  assert.equal(form.starts_on, '2026-10-25');
  const payload = campaignPayload({ ...form, title: '  Domes  ', offer: '15% off', banner_text: ' ', coupon_code: 'HIK15' });
  assert.equal(payload.title, 'Domes');
  assert.equal(payload.banner_text, null);
  assert.equal(payload.ends_on, null);
  assert.equal(payload.coupon_code, 'HIK15');
  assert.equal(payload.show_banner, true);
});
