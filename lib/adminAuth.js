import { timingSafeEqual } from 'node:crypto';

// Plain !== on a secret comparison is a timing side-channel (it short-circuits
// on the first mismatched byte). timingSafeEqual closes that, but requires
// equal-length buffers up front -- comparing length first is safe (a token's
// length isn't the secret) and lets us reject a missing/empty
// ADMIN_IMPORT_TOKEN or a wrong-length guess without ever calling it.
export function isValidImportToken(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string' || expected.length === 0) {
    return false;
  }
  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  if (providedBuf.length !== expectedBuf.length) {
    return false;
  }
  return timingSafeEqual(providedBuf, expectedBuf);
}
