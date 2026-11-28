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

/** A Stripe payment ID (pi_...) or checkout session ID (cs_...) typed by staff, cleaned; '' when it is neither. */
export function stripeId(value) {
  const text = String(value || '').trim();
  return /^(pi|cs)_[A-Za-z0-9_]{8,200}$/.test(text) ? text : '';
}

/** Days back to look, from the request; a whole number between 1 and IMPORT_DAYS_MAX. */
export function importDays(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 1) return IMPORT_DAYS_DEFAULT;
  return Math.min(n, IMPORT_DAYS_MAX);
}
