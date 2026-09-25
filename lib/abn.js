// ABN validation, using the ATO's published checksum.
//
// THE STEP EVERYONE MISSES: subtract 1 from the first digit before weighting.
// Leave it out and the algorithm looks entirely reasonable and rejects every
// real ABN in existence, including Teracom's own. That is not hypothetical --
// a code-generation model produced exactly that error twice in one day, with
// confident comments explaining the wrong version. Hence the known-good
// fixtures in the tests: any change here has to keep accepting real ABNs.
//
// This is an offline check. It proves a number is well-formed and not a typo;
// it does NOT prove the ABN exists, is active, or belongs to the applicant.
// Only ABN Lookup can tell us that, and the form must not claim otherwise.

const WEIGHTS = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

/** Digits only. ABNs get typed with spaces off a letterhead or an invoice. */
export function abnDigits(value) {
  return String(value ?? '').replace(/\D/g, '');
}

/**
 * True if `value` is a well-formed ABN.
 *
 * Blank is not valid here -- "is this an ABN" and "was this required" are
 * separate questions, and the caller already knows the answer to the second.
 */
export function isValidAbn(value) {
  const digits = abnDigits(value);
  if (digits.length !== 11) return false;

  const numbers = digits.split('').map(Number);
  numbers[0] -= 1;

  const sum = numbers.reduce((total, digit, i) => total + digit * WEIGHTS[i], 0);
  return sum % 89 === 0;
}

/**
 * Why an ABN was rejected, in words an applicant can act on, or null if it
 * is fine.
 *
 * The digit-count case is separated out because "that is 10 digits, an ABN
 * has 11" tells someone what to do, and "invalid ABN" does not -- and the
 * commonest cause is an ACN (9 digits) pasted in by mistake.
 */
export function abnProblem(value) {
  const digits = abnDigits(value);
  if (!digits) return null;

  if (digits.length === 9) {
    return 'That looks like an ACN (9 digits). An ABN has 11 digits.';
  }
  if (digits.length !== 11) {
    return `An ABN has 11 digits — that is ${digits.length}.`;
  }
  if (!isValidAbn(digits)) {
    return 'That ABN does not appear to be valid. Please check it against the invoice or letterhead.';
  }
  return null;
}

/** 'XX XXX XXX XXX', the way the ATO prints it. */
export function formatAbn(value) {
  const digits = abnDigits(value);
  if (digits.length !== 11) return String(value ?? '').trim();
  return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 11)}`;
}
