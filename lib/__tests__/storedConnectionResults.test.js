import test from 'node:test';
import assert from 'node:assert/strict';

import { mergeStoredResults, STORED_RESULT_MAX_AGE_MS } from '../storedConnectionResults.js';

const now = new Date('2026-10-17T12:00:00Z');

const ENTRIES = [
  { key: 'stripe', name: 'Stripe', status: 'unknown', detail: 'Live key ending 1234; webhook signing secret set.', checked_at: null, can_test: true },
  { key: 'turnstile', name: 'Cloudflare Turnstile', status: 'unknown', detail: 'Site key set.', checked_at: null, can_test: true },
  { key: 'deployment', name: 'Deployment', status: 'unknown', detail: 'Not set up', checked_at: null, can_test: false }
];

// Test 1: a fresh stored result is applied
 test('fresh stored result is applied', () => {
   const stored = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-17T11:00:00Z' }
   };

   const result = mergeStoredResults(ENTRIES, stored, now);

   assert.equal(result[0].status, 'connected');
   assert.equal(result[0].detail, 'Stripe answers in live mode.');
   assert.equal(result[0].checked_at, '2026-10-17T11:00:00Z');
   // Other fields unchanged
   assert.equal(result[0].key, 'stripe');
   assert.equal(result[0].name, 'Stripe');
   assert.equal(result[0].can_test, true);
 });

// Test 2: a result older than 24 hours is ignored
 test('result older than 24 hours is ignored', () => {
   // This should be ignored (older than 24h)
   const stored1 = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-16T11:59:00Z' }
   };

   const result1 = mergeStoredResults(ENTRIES, stored1, now);
   assert.equal(result1[0].status, 'unknown'); // Should remain unchanged

   // This should be applied (23.5 hours old)
   const stored2 = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-16T12:30:00Z' }
   };

   const result2 = mergeStoredResults(ENTRIES, stored2, now);
   assert.equal(result2[0].status, 'connected'); // Should be applied
 });

// Test 3: a result from the future is ignored
 test('result from the future is ignored', () => {
   // This should be ignored (future)
   const stored1 = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-17T13:00:00Z' }
   };

   const result1 = mergeStoredResults(ENTRIES, stored1, now);
   assert.equal(result1[0].status, 'unknown'); // Should remain unchanged

   // This should be applied (5 minutes ahead)
   const stored2 = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-17T12:03:00Z' }
   };

   const result2 = mergeStoredResults(ENTRIES, stored2, now);
   assert.equal(result2[0].status, 'connected'); // Should be applied
 });

// Test 4: a connection that is not set up is never overridden
 test('not set up connection is never overridden', () => {
   const entry = {
     key: 'turnstile',
     status: 'not_set_up',
     can_test: false,
     detail: 'Not set'
   };

   const stored = {
     turnstile: { status: 'connected', detail: 'Turnstile answers.', checked_at: '2026-10-17T11:00:00Z' }
   };

   // Create entries array with this entry
   const entries = [
     ...ENTRIES.filter(e => e.key !== 'turnstile'),
     entry
   ];

   const result = mergeStoredResults(entries, stored, now);
   const turnstileEntry = result.find(e => e.key === 'turnstile');
   assert.equal(turnstileEntry.status, 'not_set_up'); // Should remain unchanged
   assert.equal(turnstileEntry.checked_at, entry.checked_at); // Should remain unchanged
   assert.equal(turnstileEntry.detail, entry.detail); // Should remain unchanged
 });

// Test 5: only stripe and turnstile are touched
 test('only stripe and turnstile are touched', () => {
   const stored = {
     deployment: { status: 'connected', detail: 'Deployment works.', checked_at: '2026-10-17T11:00:00Z' }
   };

   const result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[2].status, 'unknown'); // Should remain unchanged
 });

// Test 6: bad stored data is ignored
 test('bad stored data is ignored', () => {
   // Invalid status
   let stored = { stripe: { status: 'great', detail: 'x', checked_at: '2026-10-17T11:00:00Z' } };
   let result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'unknown');

   // Invalid date
   stored = { stripe: { status: 'connected', detail: 'x', checked_at: 'not a date' } };
   result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'unknown');

   // null stored
   stored = null;
   result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'unknown');

   // undefined stored
   stored = undefined;
   result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'unknown');

   // empty object
   stored = {};
   result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'unknown');
 });

// Test 7: an empty stored detail keeps the entry's own detail but applies the status and time
 test('empty stored detail is handled', () => {
   const stored = {
     stripe: { status: 'connected', detail: '', checked_at: '2026-10-17T11:00:00Z' }
   };

   const result = mergeStoredResults(ENTRIES, stored, now);
   assert.equal(result[0].status, 'connected');
   assert.equal(result[0].checked_at, '2026-10-17T11:00:00Z');
   // Detail should remain the original
   assert.equal(result[0].detail, 'Live key ending 1234; webhook signing secret set.');
 });

// Test 8: the input is not changed
 test('input is not changed', () => {
   const originalEntries = ENTRIES.map(e => ({ ...e }));

   const stored = {
     stripe: { status: 'connected', detail: 'Stripe answers in live mode.', checked_at: '2026-10-17T11:00:00Z' }
   };

   const result = mergeStoredResults(ENTRIES, stored, now);

   // Original entries should be unchanged
   assert.equal(ENTRIES[0].status, 'unknown');
   assert.equal(ENTRIES[1].status, 'unknown');

   // Result should be different
   assert.equal(result[0].status, 'connected');
 });