import test from 'node:test';
import assert from 'node:assert/strict';

import { consentLabel, consentTone, customerName, customerQuery, shownSentence, summarySentence, tierSummary } from '../customerList.js';

test('customer names fall back sensibly', () => {
  assert.equal(customerName({ first_name: 'Sam', last_name: 'Lee', company: 'Acme' }), 'Sam Lee');
  assert.equal(customerName({ first_name: 'Sam', last_name: null }), 'Sam');
  assert.equal(customerName({ last_name: 'Lee' }), 'Lee');
  assert.equal(customerName({ first_name: ' ', company: 'Acme', email: 'a@b.c' }), 'Acme');
  assert.equal(customerName({ email: 'a@b.c' }), 'a@b.c');
  assert.equal(customerName({}), 'Unnamed customer');
});

test('consent labels and tones', () => {
  assert.deepEqual([true, false, null, undefined].map(consentLabel), ['Receives updates', 'Opted out', 'Not asked', 'Not asked']);
  assert.deepEqual([true, false, null, undefined].map(consentTone), ['ok', 'bad', 'muted', 'muted']);
});

test('the query carries only what is set', () => {
  assert.equal(customerQuery({}), '');
  assert.equal(customerQuery({ q: '  acme ', consent: 'yes', tier: '', page: 1, pageSize: 100, sort: 'name' }), 'q=acme&consent=yes&sort=name&page_size=100');
  assert.equal(customerQuery({ page: 3, tier: 'none', login: 'no' }), 'tier=none&login=no&page=3');
  assert.equal(new URLSearchParams(customerQuery({ q: 'x'.repeat(300) })).get('q').length, 200);
});

test('summary sentences', () => {
  assert.equal(summarySentence({ all: 695, receives_updates: 305, opted_out: 390, not_asked: 0 }), '695 customers: 305 receive updates, 390 opted out, 0 not asked.');
  assert.equal(summarySentence(undefined), '0 customers: 0 receive updates, 0 opted out, 0 not asked.');
  assert.equal(tierSummary({ 'No tier': 551, Platinum: 38, Gold: 31, Silver: 75 }), 'Silver 75, Gold 31, Platinum 38, No tier 551');
  assert.equal(tierSummary({ Bronze: 2, 'No tier': 1, Gold: 0, Silver: 3 }), 'Silver 3, Bronze 2, No tier 1');
  assert.equal(tierSummary(undefined), '');
  assert.equal(shownSentence({ page: 2, page_size: 100, total: 695, customers: new Array(100) }), 'Showing 101–200 of 695');
  assert.equal(shownSentence({ page: 1, page_size: 100, total: 0, customers: [] }), 'No customers match.');
});
