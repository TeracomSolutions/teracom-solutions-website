import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  MONITORING_LOGIN_PATH,
  TERACOM_AI_SIGN_IN,
  canShowMonitoringLogin,
  monitoringLoginEnabled,
  monitoringLoginFaqs,
  monitoringLoginPlanned,
  monitoringLoginToday,
} from '../monitoringLogin.js';

test('the monitoring customer login is off unless the switch says on', () => {
  assert.equal(monitoringLoginEnabled(undefined), false);
  assert.equal(monitoringLoginEnabled(''), false);
  assert.equal(monitoringLoginEnabled('off'), false);
  assert.equal(monitoringLoginEnabled('true'), false);
  assert.equal(monitoringLoginEnabled('on'), true);
  assert.equal(monitoringLoginEnabled(' ON '), true);
});

test('switched off, the page opens only as a preview', () => {
  assert.equal(canShowMonitoringLogin(undefined, false), false);
  assert.equal(canShowMonitoringLogin('yes', false), false);
  assert.equal(canShowMonitoringLogin('1', false), true);
  assert.equal(canShowMonitoringLogin(undefined, true), true);
});

test('the page sits under monitoring and signs in only through Teracom AI', () => {
  assert.equal(MONITORING_LOGIN_PATH, '/monitoring/customer-login');
  assert.equal(TERACOM_AI_SIGN_IN, 'https://app.teracomsolutions.com.au/portal');
});

// Pre-launch wording only (CTO, 2026-11-02): no prices, response times or launch dates.
test('the copy makes no price, response time or availability claim', () => {
  const text = JSON.stringify([monitoringLoginToday, monitoringLoginPlanned, monitoringLoginFaqs]).toLowerCase();
  assert.doesNotMatch(text, /\$\s*\d/);
  assert.doesNotMatch(text, /\d+\s*(seconds|minutes|mins|hours)/);
  assert.doesNotMatch(text, /available now|sign up now|buy now|launch(es|ing)? (on|in)/);
  assert.doesNotMatch(text, /remote(ly)? (access|connect)/);
});
