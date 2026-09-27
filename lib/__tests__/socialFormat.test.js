import test from 'node:test';
import assert from 'node:assert/strict';

import {
  CHANNELS,
  NETWORKS,
  describeAudience,
  isInFlight,
  statusTone,
  summariseDeliveries,
  validateUpdate,
  xLength,
} from '../socialFormat.js';

test('the five networks and five channels are listed in order', () => {
  assert.deepEqual(NETWORKS.map((n) => n.key), ['linkedin', 'facebook', 'instagram', 'x', 'youtube']);
  assert.deepEqual(CHANNELS.map((c) => c.key), ['linkedin', 'facebook', 'instagram', 'x', 'email']);
  assert.equal(NETWORKS.find((n) => n.key === 'youtube').credentialFields.length, 0);
});

test('an empty update fails on title, body and channels', () => {
  const errors = validateUpdate({});
  assert.equal(errors.length, 3);
  assert.ok(errors.some((e) => e.includes('title')));
  assert.ok(errors.some((e) => e.includes('channel')));
});

test('X counts the link and stops at 280', () => {
  assert.equal(xLength('a'.repeat(10), ''), 10);
  assert.equal(xLength('a'.repeat(10), 'https://x.y'), 34);
  assert.deepEqual(validateUpdate({ title: 't', body: 'a'.repeat(280), channels: ['x'] }), []);
  assert.equal(validateUpdate({ title: 't', body: 'a'.repeat(281), channels: ['x'] }).length, 1);
  assert.equal(validateUpdate({ title: 't', body: 'a'.repeat(260), channels: ['x'], link_url: 'https://x.y' }).length, 1);
  assert.deepEqual(validateUpdate({ title: 't', body: 'a'.repeat(300), channels: ['linkedin'] }), []);
});

test('Instagram needs an image and a body without X does not crash the check', () => {
  assert.equal(validateUpdate({ title: 't', body: 'b', channels: ['instagram'] }).length, 1);
  assert.deepEqual(validateUpdate({ title: 't', body: 'b', channels: ['instagram'], image_url: 'https://x.y/a.jpg' }), []);
  assert.ok(validateUpdate({ title: 't', channels: ['x'] }).length >= 1);
});

test('status tones', () => {
  assert.equal(statusTone('ready'), 'ok');
  assert.equal(statusTone('sent'), 'ok');
  assert.equal(statusTone('failing'), 'bad');
  assert.equal(statusTone('failed'), 'bad');
  assert.equal(statusTone('scheduled'), 'warn');
  assert.equal(statusTone('sending'), 'warn');
  for (const s of ['draft', 'cancelled', 'skipped', 'pending', 'not_configured', undefined]) assert.equal(statusTone(s), 'muted');
});

test('audience and delivery sentences', () => {
  assert.equal(describeAudience({ all: true }), 'All customers who agreed to hear from us');
  assert.equal(describeAudience({ tiers: ['Gold', 'Silver'] }), 'Tiers: Gold, Silver');
  assert.equal(describeAudience(undefined), 'All customers who agreed to hear from us');
  assert.equal(summariseDeliveries([]), '');
  assert.equal(
    summariseDeliveries([{ channel: 'linkedin', status: 'sent' }, { channel: 'email', status: 'sent', detail: 'sent to 12 customers' }, { channel: 'x', status: 'failed', detail: 'HTTP 401' }]),
    'LinkedIn sent; Customer email sent (sent to 12 customers); X failed (HTTP 401)',
  );
});

test('in-flight updates are the scheduled and sending ones', () => {
  assert.ok(isInFlight({ status: 'sending' }) && isInFlight({ status: 'scheduled' }));
  assert.ok(!isInFlight({ status: 'sent' }) && !isInFlight({ status: 'draft' }) && !isInFlight(undefined));
});
