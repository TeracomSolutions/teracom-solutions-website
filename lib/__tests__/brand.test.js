import assert from 'node:assert/strict';
import test from 'node:test';

import { brandFrom, retitle } from '../brand.js';

test('with nothing set the brand is Teracom and its logo', () => {
  const brand = brandFrom({});
  assert.equal(brand.name, 'Teracom Solutions');
  assert.equal(brand.custom, false);
  assert.equal(brand.logo, '/assets/teracom-logo.png');
  assert.equal(brand.siteUrl, '/');
  assert.equal(brand.staffDomain, 'teracomsolutions.com.au');
});

test('a custom brand has no Teracom logo unless it names its own', () => {
  const plain = brandFrom({ NEXT_PUBLIC_BRAND_NAME: ' Luneva ', NEXT_PUBLIC_BRAND_SITE_URL: 'https://www.luneva.com.au', NEXT_PUBLIC_STAFF_DOMAIN: 'luneva.com.au' });
  assert.equal(plain.name, 'Luneva');
  assert.equal(plain.custom, true);
  assert.equal(plain.logo, '');
  assert.equal(plain.siteUrl, 'https://www.luneva.com.au');
  assert.equal(plain.staffDomain, 'luneva.com.au');
  assert.equal(brandFrom({ NEXT_PUBLIC_BRAND_NAME: 'Luneva', NEXT_PUBLIC_BRAND_LOGO: '/luneva.png' }).logo, '/luneva.png');
});

test('retitle swaps the business name only on a custom brand', () => {
  const luneva = brandFrom({ NEXT_PUBLIC_BRAND_NAME: 'Luneva' });
  assert.equal(retitle('Pricing|Teracom Solutions', luneva), 'Pricing | Luneva');
  assert.equal(retitle('Audit log | Teracom Solutions', luneva), 'Audit log | Luneva');
  assert.equal(retitle('Something else', luneva), 'Something else');
  assert.equal(retitle('Pricing|Teracom Solutions', brandFrom({})), 'Pricing|Teracom Solutions');
});
