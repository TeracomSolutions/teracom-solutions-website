import test from 'node:test';
import assert from 'node:assert/strict';

import {
  IDLE_CHOICES,
  decodeJwtPayload,
  formatCountdown,
  idleLabel,
  needsRefresh,
  parseIdleMinutes,
  remainingMs,
  replaceCookie,
  signOutReason,
} from '../adminIdle.js';

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const token = (payload) => `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url(payload)}.sig`;

test('labels and choices', () => {
  assert.deepEqual(IDLE_CHOICES, [5, 10, 15, 30, 60, 120, 240, 480]);
  assert.deepEqual(IDLE_CHOICES.map(idleLabel), ['5 minutes', '10 minutes', '15 minutes', '30 minutes', '1 hour', '2 hours', '4 hours', '8 hours']);
  assert.equal(idleLabel(0), '');
  assert.equal(parseIdleMinutes('30'), 30);
  assert.equal(parseIdleMinutes('7'), 15);
  assert.equal(parseIdleMinutes(undefined), 15);
});

test('decodes a token payload without verifying it', () => {
  assert.deepEqual(decodeJwtPayload(token({ iat: 100, exp: 1000, email: 'ø@teracom' })), { iat: 100, exp: 1000, email: 'ø@teracom' });
  assert.equal(decodeJwtPayload('garbage'), null);
  assert.equal(decodeJwtPayload('a.!!!.c'), null);
  assert.equal(decodeJwtPayload(undefined), null);
});

test('when to refresh', () => {
  assert.equal(needsRefresh({ iat: 1000, exp: 1900 }, 1030), false);
  assert.equal(needsRefresh({ iat: 1000, exp: 1900 }, 1061), true);
  assert.equal(needsRefresh({ iat: 1000, exp: 1040 }, 1015), true);
  assert.equal(needsRefresh(null, 1000), true);
  assert.equal(needsRefresh({ exp: 1900 }, 1000), true);
});

test('countdown', () => {
  assert.equal(formatCountdown(0), '0:00');
  assert.equal(formatCountdown(-5000), '0:00');
  assert.equal(formatCountdown(59_000), '0:59');
  assert.equal(formatCountdown(59_001), '1:00');
  assert.equal(formatCountdown((14 * 60 + 5) * 1000), '14:05');
  assert.equal(formatCountdown((3600 + 2 * 60 + 3) * 1000), '1:02:03');
  assert.equal(remainingMs({ lastTouch: 1_000_000, idleMinutes: 5, now: 1_000_000 }), 300_000);
  assert.equal(remainingMs({ lastTouch: 1_000_000, idleMinutes: 'x', now: 1_060_000 }), 840_000);
});

test('sign-out reasons and cookie header rewriting', () => {
  assert.equal(signOutReason('Signed out after 5 minutes without activity.'), 'idle');
  assert.equal(signOutReason('This refresh token is invalid, expired, or has been revoked.'), 'expired');
  assert.equal(signOutReason(undefined), 'expired');
  assert.equal(replaceCookie('a=1; teracom_admin_session=old; b=2', 'teracom_admin_session', 'new'), 'a=1; b=2; teracom_admin_session=new');
  assert.equal(replaceCookie('', 'x', 'y'), 'x=y');
});
