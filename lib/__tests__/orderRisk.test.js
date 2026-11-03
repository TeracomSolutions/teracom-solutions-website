import { test } from 'node:test';
import assert from 'node:assert/strict';

import { cardOptionsFor, holdMetadata, riskRequest } from '../orderRisk.js';

test('the bank security check is asked for from $500', () => {
  assert.deepEqual(cardOptionsFor(49999), {});
  assert.deepEqual(cardOptionsFor(50000), { payment_method_options: { card: { request_three_d_secure: 'any' } } });
});

test('a paid session and its charge become the backend check', () => {
  const session = {
    id: 'cs_1', payment_intent: 'pi_1', amount_total: 81000, metadata: { teracomCustomerId: 'c-1' },
    customer_details: { email: 'pat@example.com', name: 'Pat', address: { line1: '1 Main St', city: 'Melbourne', state: 'VIC', postal_code: '3000', country: 'AU' } },
    collected_information: { shipping_details: { name: 'Pat', address: { line1: '9 Other St', city: 'Geelong', state: 'VIC', postal_code: '3220', country: 'AU' } } },
  };
  const charge = {
    outcome: { risk_level: 'elevated', risk_score: 66, type: 'authorized' },
    payment_method_details: { card: { brand: 'visa', country: 'AU', funding: 'credit', checks: { cvc_check: 'pass', address_postal_code_check: 'fail', address_line1_check: 'unavailable' }, three_d_secure: { result: 'authenticated' } } },
  };
  const body = riskRequest(session, charge);
  assert.equal(body.payment_intent_id, 'pi_1');
  assert.equal(body.customer_id, 'c-1');
  assert.equal(body.shipping.postcode, '3220');
  assert.equal(body.billing.postcode, '3000');
  assert.deepEqual(body.signals, {
    risk_level: 'elevated', risk_score: 66, outcome_type: 'authorized', cvc_check: 'pass', postcode_check: 'fail', line1_check: 'unavailable',
    card_country: 'AU', funding: 'credit', three_d_secure: 'authenticated', wallet: null, brand: 'visa',
  });
  assert.equal(riskRequest({ id: 'cs_2', shipping_details: { address: { postal_code: '2000' } } }, null).shipping.postcode, '2000');
});

test('a held payment is marked in Stripe with its reasons', () => {
  assert.deepEqual(holdMetadata(['A.', 'B.']), { teracomHold: 'yes', teracomHoldReasons: 'A. | B.' });
  assert.ok(holdMetadata(['x'.repeat(900)]).teracomHoldReasons.length <= 480);
});
