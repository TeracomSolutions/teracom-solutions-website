import test from 'node:test';
import assert from 'node:assert/strict';

import { emailLooksRight, cleanOrderingInput } from '../supplierOrdering.js';

// Test emailLooksRight function
await test('emailLooksRight', () => {
  assert.strictEqual(emailLooksRight('orders@leader.example'), true);
  assert.strictEqual(emailLooksRight('a@b'), false);
  assert.strictEqual(emailLooksRight('a b@c.com'), false);
  assert.strictEqual(emailLooksRight('a@@b.com'), false);
  assert.strictEqual(emailLooksRight('@b.com'), false);
  assert.strictEqual(emailLooksRight('a@.com'), false);
  assert.strictEqual(emailLooksRight(''), false);
  assert.strictEqual(emailLooksRight(null), false);
});

// Test cleanOrderingInput function
await test('cleanOrderingInput', () => {
  // A good update is cleaned
  const result1 = cleanOrderingInput({ zoho_vendor_name: '  Leader Computers ', po_email: ' orders@leader.example ', drop_ship: true });
  assert.deepStrictEqual(result1, { values: { zoho_vendor_name: 'Leader Computers', po_email: 'orders@leader.example', drop_ship: true } });

  // Blank text stays blank so the backend clears it
  const result2 = cleanOrderingInput({ po_email: '   ', paperwork_wording: '' });
  assert.deepStrictEqual(result2, { values: { po_email: '', paperwork_wording: '' } });

  // Only the keys sent come back and unknown keys are ignored
  const result3 = cleanOrderingInput({ account_number: '123', colour: 'red' });
  assert.deepStrictEqual(result3, { values: { account_number: '123' } });

  // Long text is cut to its limit
  const longPaperwork = 'x'.repeat(3000);
  const result4 = cleanOrderingInput({ paperwork_wording: longPaperwork });
  assert.strictEqual(result4.values.paperwork_wording.length, 2000);

  const longVendorName = 'y'.repeat(300);
  const result5 = cleanOrderingInput({ zoho_vendor_name: longVendorName });
  assert.strictEqual(result5.values.zoho_vendor_name.length, 200);

  // Bad input is refused
  const result6 = cleanOrderingInput(null);
  assert.deepStrictEqual(result6, { error: 'No details were sent.' });

  const result7 = cleanOrderingInput([]);
  assert.deepStrictEqual(result7, { error: 'No details were sent.' });

  const result8 = cleanOrderingInput({});
  assert.deepStrictEqual(result8, { error: 'No details were sent.' });

  const result9 = cleanOrderingInput({ po_email: 'nope' });
  assert.deepStrictEqual(result9, { error: 'That email address does not look right.' });

  const result10 = cleanOrderingInput({ drop_ship: 'yes' });
  assert.deepStrictEqual(result10, { error: 'drop ship must be yes or no.' });

  const result11 = cleanOrderingInput({ zoho_vendor_id: 5 });
  assert.deepStrictEqual(result11, { error: 'zoho vendor_id must be text.' });
});