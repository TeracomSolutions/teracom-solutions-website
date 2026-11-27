// Which Stripe Checkout sessions the Import paid orders button records (Robert, 27 November 2026). Pure, so the
// plain Node test runner can load it; app/api/admin/orders/import-stripe/route.js does the fetching.

export const IMPORT_DAYS_DEFAULT = 90;
export const IMPORT_DAYS_MAX = 365;

/** A store order worth recording: a one-off payment that went through, in the live account. */
export function shouldImport(session) {
  if (!session || typeof session.id !== 'string') return false;
  if (session.mode && session.mode !== 'payment') return false;
  if (session.livemode === false) return false;
  return ['paid', 'no_payment_required'].includes(session.payment_status);
}

/** Days back to look, from the request; a whole number between 1 and IMPORT_DAYS_MAX. */
export function importDays(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return IMPORT_DAYS_DEFAULT;
  return Math.min(n, IMPORT_DAYS_MAX);
}
