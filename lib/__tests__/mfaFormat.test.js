import test from 'node:test';
import assert from 'node:assert/strict';

import { groupSecret, isBackupCode, cleanCode, backupCodesText } from '../mfaFormat.js';

await test('groupSecret', () => {
  assert.equal(groupSecret(''), '');
  assert.equal(groupSecret('ABCDEFGH'), 'ABCD EFGH');
  assert.equal(groupSecret('ABCDEFGHIJKL'), 'ABCD EFGH IJKL');
  assert.equal(groupSecret('ABCDEFGHIJKLMNOP'), 'ABCD EFGH IJKL MNOP');
});

await test('isBackupCode', () => {
  assert.ok(isBackupCode('12345-67890'));
  assert.ok(isBackupCode('abcde-12345'));
  assert.ok(isBackupCode('ABCDE-12345'));
  assert.ok(!isBackupCode('ABCDEF-12345'));
  assert.ok(!isBackupCode('12345-ABCDEF'));
  
  assert.ok(!isBackupCode('')); // empty
  assert.ok(!isBackupCode('1234567890')); // no hyphen
  assert.ok(!isBackupCode('12345-6789')); // wrong length
  assert.ok(!isBackupCode('123456-789012')); // wrong length
  assert.ok(!isBackupCode('1234-56789')); // wrong length
});

await test('cleanCode', () => {
  // Test backup codes
  assert.equal(cleanCode('12345-67890'), '12345-67890');
  assert.equal(cleanCode('abcde-F0123'), 'ABCDE-F0123');
  
  // Test 6-digit codes
  assert.equal(cleanCode('123456'), '123456');
  assert.equal(cleanCode(' 123 456 '), '123456');
  
  // Invalid codes
  assert.equal(cleanCode('1234567'), ''); // too long
  assert.equal(cleanCode('12345'), ''); // too short
  assert.equal(cleanCode('abcde-fghij'), ''); // g to j are not hexadecimal, so not a backup code
  assert.equal(cleanCode('ghijk-lmnop'), ''); // not hex, not digits
  assert.equal(cleanCode(''), '');
});

await test('backupCodesText', () => {
  const codes = ['12345-67890', 'ABCDE-FGHIJ'];
  const email = 'test@example.com';
  
  const result = backupCodesText(codes, email);
  const expected = `Teracom Admin backup codes for ${email}\n12345-67890\nABCDE-FGHIJ\n\nEach code works once only.`;
  
  assert.equal(result, expected);
  
  // Test with empty codes
  assert.equal(backupCodesText([], email), `Teracom Admin backup codes for ${email}\n\nEach code works once only.`);
});