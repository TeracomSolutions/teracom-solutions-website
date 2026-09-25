import test from 'node:test';
import assert from 'node:assert/strict';

import { formatDate, formatDateTime, humanise, inquiryLabel } from '../adminFormat.js';

test('formatDate renders in Sydney time, not UTC', () => {
  // 23:30 UTC on the 21st is already the 22nd in Sydney (AEST, UTC+10).
  assert.equal(formatDate('2026-06-21T23:30:00Z'), '22 June 2026');
});

test('formatDateTime includes the clock time in Sydney', () => {
  assert.match(formatDateTime('2026-06-21T23:30:00Z'), /22 June 2026, 09:30 am/);
});

test('date helpers fall back for blank or invalid values', () => {
  assert.equal(formatDate(null), '—');
  assert.equal(formatDate('not a date'), '—');
  assert.equal(formatDateTime(undefined, 'Never'), 'Never');
});

test('humanise turns stored codes into words', () => {
  assert.equal(humanise('needs_review'), 'Needs review');
  assert.equal(humanise('website_intelligence'), 'Website intelligence');
  assert.equal(humanise('platform_admin'), 'Platform admin');
  assert.equal(humanise('openai'), 'OpenAI');
  assert.equal(humanise(''), '—');
});

test('inquiryLabel names every contact-form option and copes with unknown ones', () => {
  assert.equal(inquiryLabel('contact_sales'), 'Contact sales');
  assert.equal(inquiryLabel('securityos'), 'SecurityOS');
  assert.equal(inquiryLabel('something_new'), 'Something new');
});
