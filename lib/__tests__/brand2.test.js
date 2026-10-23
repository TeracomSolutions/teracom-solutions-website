import assert from 'node:assert/strict';
import test from 'node:test';

import { brandDomain, brandFrom, rebrandText } from '../brand.js';

const LUNEVA = brandFrom({ NEXT_PUBLIC_BRAND_NAME: 'Luneva', NEXT_PUBLIC_BRAND_SITE_URL: 'https://www.luneva.com.au', NEXT_PUBLIC_STAFF_DOMAIN: 'luneva.com.au' });

test('brandDomain is the website host without www, else the staff domain', () => {
  assert.equal(brandDomain(LUNEVA), 'luneva.com.au');
  assert.equal(brandDomain(brandFrom({ NEXT_PUBLIC_BRAND_NAME: 'X', NEXT_PUBLIC_STAFF_DOMAIN: 'x.example' })), 'x.example');
});

test('rebrandText swaps Teracom wording for the business only on a custom brand', () => {
  assert.equal(rebrandText('Teracom Solutions staff only', LUNEVA), 'Luneva staff only');
  assert.equal(rebrandText('Teracom Solutions Pty Ltd', LUNEVA), 'Luneva');
  assert.equal(rebrandText("Teracom's own site, the Teracom AI platform", LUNEVA), "Luneva's own site, the Luneva");
  assert.equal(rebrandText('write to robert@teracomsolutions.com.au', LUNEVA), 'write to robert@luneva.com.au');
  assert.equal(rebrandText('Nothing to change here', LUNEVA), 'Nothing to change here');
  assert.equal(rebrandText('Teracom Solutions', brandFrom({})), 'Teracom Solutions');
});

test('rebrandText leaves empty and missing text alone', () => {
  assert.equal(rebrandText('', LUNEVA), '');
  assert.equal(rebrandText(null, LUNEVA), null);
});
